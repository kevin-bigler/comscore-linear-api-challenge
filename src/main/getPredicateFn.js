const { parseFilterTokens } = require('./parseFilterTokens');

const getPredicateFn = (filter) => {
    const {field, compare, value} = parseFilterTokens(filter);
    return (entry) => {
        compare(entry, field, value);
    };
};

module.exports = {
    getPredicateFn
};
