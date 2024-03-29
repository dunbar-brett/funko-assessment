/**
 * getContentByType.js
 * @description The purpose of this script is to return an array of content nodes
 *  based on the 'type' property, in an XML data backup file for SFCC
 */
const fs = require('fs');
const utils = require('./utils');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

function execute(args, inputFilePath, deepLink) {
    console.log('executing action: getContentsByType()', inputFilePath);
    const typeValue = utils.getProcessArg(args, 'type');

    // Early return if not enough args are provided for this action
    if (!typeValue || typeValue === '') {
        console.log('invalid content type specified. Ending process. Type: \'' + typeValue + '\'');
        process.kill(process.pid);
    }

    // Generate the output filename/path
    let path = inputFilePath.split('/')
    let filename = path[path.length - 1].split('.xml')[0];
    let jsonObj;
    path = path.slice(0, -1).join('');

    const outFilePath = `./output/${filename + '_type_' + typeValue.replace(/\./g, '--') + (deepLink ? '_deep' : '') + '.xml'}`;
    console.log('path: ' + path, ', filename: ' + filename);
    console.log('outFilePath: ', outFilePath);

    fs.readFile(inputFilePath, function(_err, data) {
        const parser = new XMLParser(utils.parserOptions);
        jsonObj = parser.parse(data);
        console.log('Original content count:', jsonObj.library.content.length);
        
        // Get all content with a specified type

        let filteredContent = jsonObj.library.content.filter(
            content => utils.matchContentByType(content, typeValue)
        );

        // create a duplicate to iterate to avoid double passing
        var originalContent = filteredContent.concat();
        
        // Search for all the content related content-link elements
        if (deepLink) {
            originalContent.forEach(content => {
                utils.getDeepContentLinks(content, jsonObj, 10)
                    .forEach(_content => {
                        utils.addContentNode(filteredContent, _content);
                    }
                );
            });
        }

        // Remove folders
        delete jsonObj.library.folder;

        // Overwrite content with filtered results
        jsonObj.library.content = filteredContent;

        console.log('Filtered content count:', jsonObj.library.content.length);

        const builder = new XMLBuilder(utils.builderOptions);
        let xmlDataStr = builder.build(jsonObj)

        // console.log('XML built', xmlDataStr);

        utils.writeFile(outFilePath, xmlDataStr);
    });
}

module.exports = execute;
