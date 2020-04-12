const { streamFileLines: defaultStreamFileLines } = require('./import/streamFileLines');

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
     * @param {function(Object): string} deps.getKey Function that gets (unique) key from Entry object
     * @param {function(string): string} deps.readKey Function that gets (unique) key from db line TODO: I don't think this is needed... at least not passed-in
     */
    constructor({
        path,
        streamFileLines = defaultStreamFileLines,
        columns,
        getKey,
        readKey
    }) {
        // TODO: validate path and that it can be written to
        this._path = path;
        this._streamFileLines = streamFileLines;
        this._columns = columns;
        this._getKey = getKey;
    }
}

module.exports = {
    FileDb
};
