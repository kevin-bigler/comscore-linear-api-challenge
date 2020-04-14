/**
 * break filter string into parts
 * TODO: unit test
 * @param {string} filter string in format <field><compare operator><value>, ex: foo>=5
 * @returns {{compare: (function({string}, {string}): boolean), field: {string}, value: {string}}}
 */
const parseFilterTokens = (filter) => {
    // the zeroth entry is the full match (eg foo>=5), hence starting at index 1 for field etc individual values
    const [,field,operator,value] = filter.match(/([\w\d\_]+)([=><]+)([\w\d\_]+)/);
    console.debug('filter tokens:', {field, operator, value});
    return {
        field,
        compare: getCompareFn(operator),
        value
    };
};

/**
 * get compare function based on operator token
 *
 * @param {string} operator operator string like '=', '>' etc
 * @returns {function({string}, {string}): boolean} predicate function to call with compare(a, b)
 */
const getCompareFn = (operator) => {
    switch (operator) {
        case '=':
        case '==':
            return (a, b) => a === b;
        case '>':
            return (a, b) => a > b;
        case '<':
            return (a, b) => a < b;
        case '>=':
            return (a, b) => a >= b;
        case '<=':
            return (a, b) => a <= b;
        default:
            throw new Error(`invalid filter operator/token: ${operator}`);
    }
};

module.exports = {
    parseFilterTokens
};
