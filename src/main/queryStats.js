const { getStatRepository: defaultGetStatRepository } = require('./statRepository');

/**
 * parse a cli argument that is a comma-separated list of values. trims and removes empty lines
 *
 * @param {string} arg comma-separated list of value(s)
 * @returns {[string]} array of the individual values
 */
const parseArgCsv = (arg) => arg.split(',').map(x => x.trim()).filter(x => !!x);

/**
 * search the stats repo with given query params
 *
 * @param {Object} query
 * @param {string} query.filter comma-separated filter expression(s)
 * @param {string} query.order comma-separated field(s) to sort results by
 * @param {string} query.select comma-separated field(s) to show in results
 * @returns {[string]} csv row(s) of results per query params
 */
const createQueryStats = ({statRepository = defaultGetStatRepository()}) => async ({filter, order, select}) => {
    console.log('queryStats', {filter, order, select});
    const filterArr = parseArgCsv(filter);
    const orderArr = parseArgCsv(order);
    const selectArr = parseArgCsv(select);
    console.log('queryStats parsed args', {filterArr, orderArr, selectArr});
    const results = await statRepository.search({filter: filterArr, order: orderArr, select: selectArr});
    return results.map(stat => {
        const resultLine = selectArr.map(selectField => stat[selectField]).join(',');
        console.debug('result line:', resultLine);
        return resultLine;
    });
};

module.exports = {
    queryStats: createQueryStats({}),
    createQueryStats
};
