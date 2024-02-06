const fs = require('fs');

function matchContentByType(content, type) {
    if (type === 'null') {
        return !content.type;
    }
    return content.type === type;
}

function getContentByID(jsonObj, cid) {
    var rContent;
    jsonObj.library.content.forEach(content => {
        if (content['@_content-id'] === cid) {
            rContent = content;
        }
    });
    return rContent;
}

function getContentByFolderID(jsonObj, fid) {
    let foundContents = [];
    jsonObj.library.content.forEach(content => {
        let classificationLink = content['folder-links'] ? content['folder-links']['classification-link'] : null;
        console.log('classificationLink', classificationLink, content['@_content-id'])
        if (classificationLink && classificationLink['@_folder-id'] === fid) {
            console.log('found content by folder id', content['@_content-id'])
            foundContents.push(content);
        }
    });
    return foundContents;
}

/**
 * @function getProcessArg
 * @description checks for the existence of a process argument and
 *  returns the attached value if found
 * @param {Array} args list of arguments from the original process,
 *  converted to an Array
 * @param {String} key key to check the existence of. Don't add the '-'
 *  character when intending to check flags
 * @returns 
 */
function getProcessArg(args, key) {
    var returnValue = '';
    args.forEach(function(value, index) {
        if (value.split('=').length > 1) { // support for i=value
            let argKey = value.split('=')[0];
            let argVal = value.split('=')[1];
            if (argKey === key) {
                returnValue = argVal;
            }
        } else if (value === ('-' + key)) { // support for -i value
            returnValue = args[index + 1];
        }
    });
    return returnValue;
}

/**
 * @function hasProcessArgFlag
 * @description Checks process arguments for the existence of a flag
 *  and returns a boolean indicating the result
 * @param {Array} args list of arguments from the original process,
 *  converted to an Array
 * @param {String} key key to check the existence of. Don't add the '-' character.
 * @returns 
 */
function hasProcessArgFlag(args, key) {
    var returnValue = '';
    args.forEach(function(value, index) {
        if (value === ('-' + key)) {
            returnValue = true;
        }
    });
    return returnValue;
}

/**
 * @function writeFile
 * @description Helper function that uses FS to save a file to disk
 * @param {string} outputFilePath path to write the file to, need to
 *  include both filename and extension
 * @param {string} dataString String data to be written as the file contents
 */
function writeFile(outputFilePath, dataString) {
    fs.writeFile(
        outputFilePath, 
        dataString, 
        function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log("The file was saved!");
            }
        }
    ); 
}

/**
 * @function getDeepContentLinks
 * @descriotion Returns an array of all content related to a given content
 *  element via content-links
 * @param {object} content content node to deep search
 * @param {object} jsonObj fullly parsed XML-JSON structure
 * @param {Number} depth integer-based number to specify how deep to search.
 *  Defaults to 3.
 * @returns {Array} list of content found via content-links
 */
function getDeepContentLinks(content, jsonObj, depth = 3) {
    var contentLinks = getContentLinks(content, jsonObj);
    var rArray = contentLinks.concat();
    var currentContent = contentLinks.concat();

    var links = [];

    // Support for deep link searching, limited to a max depth
    for (var i = 0; i < depth; i++) {
        currentContent.forEach(contentLink => {
            // cache the results here so we can iterate through them on the next pass
            links = [
                ...links,
                ...getContentLinks(contentLink, jsonObj)
            ];
        });
        // push linked content to the main return array
        rArray.push(...links);
        currentContent = links.concat();
        // reset the array to avoid processing content twice
        links = [];
    }
    return rArray;
}

/**
 * @function getContentLinks
 * @description Searches for, and returns all content-link contents related to the passed-in content object
 * @param {object} content Content Node to be searched for content-links
 * @param {*} jsonObj 
 * @returns 
 */
function getContentLinks(content, jsonObj) {
    var rArray = [];
    if (contentHasLinks(content)) {
        let links = content['content-links']['content-link'];
        // Support for single entry in an object
        if (!links.forEach) {
            links = [links];
        }
        console.log('grabbing content links from ' + content['@_content-id'], links.length);
        links.forEach(cLink => {
            var linkedContent = getContentByID(jsonObj, cLink['@_content-id']);
            if (linkedContent) {
                // If there's content found, we push it to the return array
                rArray.push(linkedContent);
            }
        });
    }
    if (isContentAsset(content)) {
        let contentId
        try {
            contentId = JSON.parse(content['data']['#text'])['aid']
        } catch (err) {
            console.log(err.message)
        }
        var linkedContent = getContentByID(jsonObj, contentId);
        if (linkedContent) {
            rArray.push(linkedContent);
        }
    }
    return rArray;
}

/**
 * @function contentHasLinks
 * @description Checks a content object for content links and returns
 *  true if the wrapper and one items exists, else false
 * @param {object} content Content object to be tested
 * @returns {boolean}
 */
function contentHasLinks(content) {
    return 'content-links' in content
        ? content['content-links']['content-link'] !== undefined
        : false;
}

function isContentAsset(content) {
    return content && content['type'] && content['type'] === 'component.shared_assets.contentAsset'
}

/**
 * @function addContentNode
 * @description Tries to add a content node in JSON to the passed in array
 *  if the content-id doesn't already exist in the array. Use this instead of
 *  array.push directly.
 * @param {Array} array List to add the content node to
 * @param {*} content Content to be added
 * @returns 
 */
function addContentNode(array, content) {
    var exists = false;
    array.forEach(_content => {
        if (_content['@_content-id'] === content['@_content-id']) {
            exists = true;
        }
    });
    if (!exists) {
        array.push(content);
    }
    return array;
}

module.exports = {
    builderOptions: {
        ignoreAttributes: false,
        allowBooleanAttributes: true,
        format: true
    },
    parserOptions: {
        ignoreAttributes: false,
        format: true
    },
    addContentNode,
    getContentByID,
    getContentByFolderID,
    getContentLinks,
    getDeepContentLinks,
    getProcessArg,
    hasProcessArgFlag,
    matchContentByType,
    writeFile,
    // Special format considerations for SFCC
    formatXMLString: str => {
        return str
            // Replace double quotes
            .replace(/(&quot\;)/g,"\"")
            // Replace single quotes
            .replace(/(&apos\;)/g, '\'')
            
    }
};
