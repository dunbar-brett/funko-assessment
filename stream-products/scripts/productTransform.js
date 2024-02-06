const utils = require('./utils');

/**
 * @desc Transforms a product for output.
 * @param {Object} product 
 * @returns {String | null}
 */
const productTransform = product => {
  let record = null

  const requiredFields = utils.getRequiredFields();

  // Attempt to create a new product record
  if (product && product['$attrs'] && product['$attrs']['product-id']) {
    let searchable = product['searchable-flag']

    // It is possible to have two entries for 'searchable-flag'
    // Example:
    //      <searchable-flag>true</searchable-flag>
    //      <searchable-flag site-id="FunkoUS">true</searchable-flag>
    // Take the first one, if it is an array
    if (Array.isArray(searchable)) {
      searchable = searchable[0]
    }

    if (searchable === 'true') {
      record = {}

      // product ID (sfcc product ID)
      if (product['$attrs'] && product['$attrs']['product-id']) {
        record['product-id'] = product['$attrs']['product-id']
      }

      // UPC
      if (product['upc']) {
        record['upc'] = product['upc']
      }

      // Custom Attributes
      if (product['custom-attributes'] && Array.isArray(product[ 'custom-attributes' ])) {
        for (let attr of product[ 'custom-attributes' ]) {
          let attributeId = attr['$attrs'] && attr['$attrs']['attribute-id'] ? attr['$attrs']['attribute-id'] : null

          if (attributeId) {
            // Exclusive Retailers
            if (attributeId === 'exclusiveRetailers') {
              if (Array.isArray(attr['value'])) {
                record['exclusiveRetailers'] = attr['value']
              } else {
                record['exclusiveRetailers'] = [attr['value']]
              }
            } else {
              record[attributeId] = utils.safeParse(attr['$text'])
            }
          }
        }
      }

      const productIsValid = (product) => {
        return requiredFields.every(field => Boolean(product[field]));
      };
      

      if (!productIsValid(record)) {
        record = null
      }
    }
  }

  return record
}

module.exports = productTransform;