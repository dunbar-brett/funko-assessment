/**
 * XML Parsing Tool - entry point
 * @description Use this to filter through XML data formatted by SFCC
 * 
 * USAGE HELP:
 * 
 * Arguments
 * 
 * For Content
 * ----------------------------------------------
 * - file           Path to the input XML file. Required.
 * - action || -a   Action type to process by. "id" and "type" accepted. Required.
 * - deep || -d     Flag to enable searching for content-links
 * - cid            content-id attribute of content to-be-found. Required for action=id.
 * - type           Type string to filter results by. Requried for action=type.
 * - folder         Folder string to filter results by. Required for action=folder.
 * 
 */
const utils = require('./scripts/utils');
const actions = {
    'id': require('./scripts/getContentByID'),
    'type': require('./scripts/getContentsByType'),
    'folder': require('./scripts/getContentsByFolder')
};

const args = process.argv.slice(2);
const inputFilePath = utils.getProcessArg(args, 'file');
const actionType = utils.getProcessArg(args, 'action') || utils.getProcessArg(args, 'a');
const deepLink = utils.getProcessArg(args, 'deep') === 'true' || utils.hasProcessArgFlag(args, 'd');

// Early returns if not enough args are provided
if (!actionType || !actions[actionType]) {
    console.log('invalid action specified. Ending process. Action: \'' + actionType + '\'');
    process.kill(process.pid);
}

if (!inputFilePath) {
    console.log('invalid input file specified. Ending process. File: \'' + inputFilePath + '\'');
    process.kill(process.pid);
}

actions[actionType](args, inputFilePath, deepLink);
