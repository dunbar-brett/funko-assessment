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
    let filename = path[path.length - 1].split('.xml')[0];
    let jsonObj;
    path = path.slice(0, -1).join('');

    const outFilePath = `./output/${filename + '_folder_' + fid + (deepLink ? '_deep' : '') + '.xml'}`;

    console.log('fid: ' + fid);
    console.log('outFilePath: ', outFilePath);

    fs.readFile(inputFilePath, function(_err, data) {
        const parser = new XMLParser(utils.parserOptions);
        jsonObj = parser.parse(data);

        let mainContent = utils.getContentByFolderID(jsonObj, fid);

        console.log('mainContent', mainContent);

        // Initialize the results array with mainContent
        var filteredContent = [
            mainContent
        ];

        // Search for all the mainContent's related classification-link elements
        if (deepLink) {
            utils.getDeepContentLinks(mainContent, jsonObj, 5).forEach(content => {
                utils.addContentNode(filteredContent, content);
            });
        }

        // Remove folders
        delete jsonObj.library.folder;

        // Overwrite content with filtered results
        jsonObj.library.content = filteredContent;

        console.log('filtered, ' + filteredContent.length + ' content links\n');
        
        // Write the file to disk
        utils.writeFile(outFilePath, XMLBuilder.buildObject(jsonObj));
    });

}

module.exports = execute;