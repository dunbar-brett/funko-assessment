/**
 * USAGE HELP:
 * 
 * Arguments
 * 
 * For Content
 * ----------------------------------------------
 * - file           Path to the input XML file. Required.
 */
const beginStream = require('./scripts/beginStream');
const utils = require('./scripts/utils');

const args = process.argv.slice(2);
const inputFilePath = utils.getProcessArg(args, 'file');
const outputFilePath = utils.getProcessArg(args, 'output');
const requiredFields = utils.getRequiredFields();

// Early returns if not enough args are provided
if (!inputFilePath) {
  console.log('invalid input file specified. Ending process. File: \'' + inputFilePath + '\'');
  process.kill(process.pid);
}

if (!outputFilePath) {
  console.log('invalid output file specified. Ending process. File: \'' + outputFilePath + '\'');
  process.kill(process.pid);
}

if (!requiredFields.length) {
  console.error('No required fields found in constants/utils.txt');
  process.kill(process.pid);
}

(async() => {
  await beginStream(inputFilePath, outputFilePath, requiredFields);
  console.log('\r\nStream finished!\r\n');
})();
