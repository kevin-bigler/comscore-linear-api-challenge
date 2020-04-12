const { FileDb: DefaultFileDb } = require('./FileDb');
require('./types');

const type = 'StatRepository';
const extension = 'csv';

const columns = [
    'STB',
    'TITLE',
    'DATE',
    'PROVIDER',
    'REV',
    'VIEW_TIME'
];

const keys = [
    'STB',
    'TITLE',
    'DATE'
];

/**
 * Stores and Accesses {@link Stat Watch Statistics (aka "Stats")}
 * TODO: could just change this into a factory, ie getRepo({type, suffix, columns, keys}); which could memoize the repo by type+suffix. can also configure the columns+keys in a config/default.yaml
 */
class StatRepository {
    /**
     * DI constructor
     * @param {Object} deps
     */
    constructor({
        FileDb = DefaultFileDb,
        pathSuffix = getDateString()
    }) {
        this._path = path.resolve('db', `${type}_${pathSuffix}.${extension}`);
        this._fileDb = new FileDb({
            path: this._path,
            columns,
            keys
        });
    }

    /**
     * persist a {@link Stat stat} object
     *
     * @param {Stat} stat
     * @returns {Promise<void>}
     */
    async save(stat) {
        return this._fileDb.save(stat);
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
        return this._fileDb.search({select, order, filter});
    }
}

/**
 * Get current day as 'YYYY-MM-DD'
 * @returns {string}
 */
const getDateString = () =>
    new Date().toISOString().substring(0, 'YYYY-MM-DD'.length);

module.exports = {
    StatRepository,
    /**
     * singleton instance using default deps
     */
    statRepo: new StatRepository({})
};