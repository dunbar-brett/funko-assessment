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

function safeParse(value) {
    try {
        return JSON.parse(value)
    } catch (_err) {
        return value
    }
}

module.exports = {
    getProcessArg,
    safeParse
};
