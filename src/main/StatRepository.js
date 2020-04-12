const { streamFileLines: defaultStreamFileLines } = require('./import/streamFileLines');
require('./types');

/**
 * Stores and Accesses {@link Stat Watch Statistics (aka "Stats")}
 */
class StatRepository {
    /**
     * DI constructor
     * @param {Object} deps
     * TODO: add param to define where the repo resides (ie file or directory path?)
     */
    constructor({streamFileLines = defaultStreamFileLines}) {
        this._streamFileLines = streamFileLines;
    }

    /**
     * persist a {@link Stat stat} object
     *
     * @param {Stat} stat
     * @returns {Promise<void>}
     */
    async save(stat) {

    }

    /**
     * search stored {@link Stat stats} given the query parameters
     *
     * @param {Object} query
     * @param {string} query.select
     * @param {string} query.order
     * @param {string} query.filter
     * @returns {Promise<[Stat]>}
     */
    async search({select, order, filter}) {

    }
}

module.exports = {
    StatRepository,
    /**
     * singleton instance using default deps
     */
    statRepo: new StatRepository({})
};