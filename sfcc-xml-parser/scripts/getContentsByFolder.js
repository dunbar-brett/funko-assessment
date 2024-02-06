/**
 * getContentByFolder.js
 * @description The purpose of this script is to return an array of content nodes
 *  based on the 'classification-link' property, in an XML data backup file for SFCC
 */
const fs = require('fs');
const utils = require('./utils');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

function execute(args, inputFilePath, deepLink) {
    console.log('executing action: getContentsByFolder()', inputFilePath);
    const fid = utils.getProcessArg(args, 'fid');
    const target = utils.getProcessArg(args, 'target');

    // Early return if not enough args are provided for this action
    if (!fid || fid === '') {
        console.log('folder-id not specified. Ending process. FID: \'' + fid + '\'');
        process.kill(process.pid);
    }

    // Generate the output filename/path
    let path = inputFilePath.split('/')
    const filename = path[path.length - 1].split('.xml')[0];
    let jsonObj;
    path = path.slice(0, -1).join('');

    const outFilePath = `./output/${filename + '_folder_' + fid + (deepLink ? '_deep' : '') + '.xml'}`;

    console.log('fid: ' + fid);
    console.log('outFilePath: ', outFilePath);

    fs.readFile(inputFilePath, function(_err, data) {
        const parser = new XMLParser(utils.parserOptions);
        jsonObj = parser.parse(data);

        const contentByFolderId = utils.getContentByFolderID(jsonObj, fid);

        console.log('mainContent', contentByFolderId);

        // Initialize the results array with mainContent
        const filteredContent = [
            ...contentByFolderId
        ];

        // Search for all the mainContent's related classification-link elements
        if (deepLink) {
            utils.getDeepContentLinks(contentByFolderId, jsonObj, 5).forEach(content => {
                utils.addContentNode(filteredContent, content);
            });
        }

        // Remove folders
        delete jsonObj.library.folder; // TODO: not sure if this is needed

        // Overwrite content with filtered results
        jsonObj.library.content = filteredContent;

        console.log('filtered, ' + filteredContent.length + ' content link(s)\n');
        
        // Write the file to disk
        const builder = new XMLBuilder(utils.builderOptions);
        utils.writeFile(outFilePath, utils.formatXMLString(builder.build(jsonObj)));
    });

}

module.exports = execute;