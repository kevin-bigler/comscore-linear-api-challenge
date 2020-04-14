const { streamFileLines: defaultStreamFileLines } = require('./import/streamFileLines');
const replaceInFile = require('replace-in-file');
const json2Csv = require('json2csv');

/**
 * File system-backed database interface
 */
class FileDb {
    /**
     * DI Constructor
     *
     * @param {Object} deps
     * @param {string} deps.path File system path where db should reside. Can point to existing or new db path.
     * @param {function} deps.streamFileLines
     * @param {[string]} deps.columns property list to dictate the column order
     * @param {[string]} deps.keys one or more property name that combined constitutes the unique key for entries
     */
    constructor({
        path,
        streamFileLines = defaultStreamFileLines,
        columns,
        keys
    }) {
        // TODO: validate path and that it can be written to
        this._path = path;
        this._streamFileLines = streamFileLines;
        this._columns = ['UNIQUE_KEY', ...columns]; // unique key value goes in the first column, before all the actual property values
        this._keys = keys;
    }

    async save(entry) {
        const row = this._toCsv({
            'UNIQUE_KEY': this._getUniqueKey(entry),
            ...entry
        });
        // TODO: save the row to the file -- try to replace, and if that didn't work, append to the file
    }

    async search(query) {
        // TODO:
        // 1. read line by line (./import/streamFileLines())
        // 2. filter the line (check against predicate, ie query.filter())
        // 3. sort by query.order field name
        // 4. pick only the properties listed in query.select[] field names array
    }

    _toCsv(entry) {
        const opts = { fields: this._columns, header: false };

        try {
            return json2Csv.parse(entry, opts);
        } catch (err) {
            console.error(err); // TODO: test error case... may want it to just throw and bubble up
            throw err;
        }
    }

    _getUniqueKey(entry) {
        return this._keys
            .map(k => entry[k])
            .join('|');
    }
}

module.exports = {
    FileDb
};
