/**
 * getContentByID.js
 * @description The purpose of this script is to filter an SFCC XML
 *  backup file based on a content-id value. Also pass in deepLink to
 *  search recursively.
 */
const fs = require('fs');
const utils = require('./utils');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

function execute(args, inputFilePath, deepLink) {
    console.log('executing action: getContentByID()', inputFilePath);
    const cid = utils.getProcessArg(args, 'cid');
    
    // Early return if not enough args are provided for this action
    if (!cid || cid === '') {
        console.log('content-id not specified. Ending process. CID: \'' + cid + '\'');
        process.kill(process.pid);
    }

    // Generate the output filename/path
    let path = inputFilePath.split('/')
    let filename = path[path.length - 1].split('.xml')[0];
    let jsonObj;
    path = path.slice(0, -1).join('');

    const outFilePath = `./output/${filename + '_content_' + cid + (deepLink ? '_deep' : '') + '.xml'}`;

    console.log('cid: ' + cid);
    console.log('outFilePath: ', outFilePath);

    fs.readFile(inputFilePath, function(_err, data) {
        const parser = new XMLParser(utils.parserOptions);
        jsonObj = parser.parse(data);

        var mainContent = utils.getContentByID(jsonObj, cid);

        console.log('mainContent', mainContent);

        // Initialize the results array with mainContent
        var filteredContent = [
            mainContent
        ];

        // Search for all the mainContent's related content-link elements
        if (deepLink) {
            utils.getDeepContentLinks(mainContent, jsonObj, 5).forEach(content => {
                utils.addContentNode(filteredContent, content);
            });
        }

        // Remove folders
        delete jsonObj.library.folder;

        // Overwrite content with filtered results
        jsonObj.library.content = filteredContent;

        console.log('filtered, 1 page + ', (filteredContent.length - 2) + ' content links\n');
        
        filteredContent.forEach((content, i) => console.log((i > 0 ? '  link: ' : 'content: ') + content['@_content-id']))

        const builder = new XMLBuilder(utils.builderOptions);
        utils.writeFile(outFilePath, utils.formatXMLString(builder.build(jsonObj)));
    });
}

module.exports = execute;
