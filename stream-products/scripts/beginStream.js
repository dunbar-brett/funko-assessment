const XmlFlow = require('xml-flow');
const { createReadStream, createWriteStream } = require('fs');
const productTransform = require('./productTransform.js');
const utils = require('./utils');

/**
 * @desc Start the XML stream to process datas.
 * @param {String} inputFilePath
 * @param {String} outputFilePath
 */
const beginStream = (inputFilePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(outputFilePath);
    const readStream = createReadStream(inputFilePath);
    const flowStream = XmlFlow(readStream);
    const requiredFields = utils.getRequiredFields();
    let skippedProducts = 0;
    let validProducts = 0;
    let errorMessage = '';

    if (!requiredFields.length) {
      errorMessage = 'No required fields found in constants/utils.txt';
      console.error(errorMessage);
      reject(errorMessage);
    }

    // On end, close the streams
    const onStreamsEnd = () => {
      writeStream.destroy();
      readStream.close();
      console.log('Created output file: ', outputFilePath)
      console.log('Skipped Products: ', skippedProducts);
      console.log('Valid Products: ', validProducts);
      console.log('Total Products: ', validProducts + skippedProducts);
      
      if (errorMessage) {
        console.error(errorMessage);
        reject(errorMessage);
      }

      resolve();
    };

    flowStream.on('tag:product', product => {
      
      const result = productTransform(product)

      if (result) {
        console.log('Transformed Product: ', result['product-id'])
        writeStream.write(
          JSON.stringify(result, null, 2) + '\r\n', 
          err => err && console.log(err)
        )
        validProducts++
      } else {
        skippedProducts++
      }
    });

    flowStream
      .on('end', () => {
        onStreamsEnd()
      })
      .on('error', _error => {
        errorMessage = _error;
        onStreamsEnd()
      })
    });
};

module.exports = beginStream;
