const { streamFileLines: defaultStreamFileLines } = require('./import/streamFileLines');
const replaceInFile = require('replace-in-file');
const json2Csv = require('json2csv');
const fs = require('fs');
const path = require('path');
const escapeRegex = require('escape-string-regexp');
const papaparse = require('papaparse');

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
        this._ensureFileExists(path);
        if (!this._fileAccessible(path)) {
            throw new Error(`insufficient access to db file at path: ${path}`);
        }

        this._path = path;
        this._streamFileLines = streamFileLines;
        this._columns = ['UNIQUE_KEY', ...columns];
        this._keys = keys;
    }

    /**
     * persist an entry in the db.
     *
     * if an entry with the same key(s) exists, overwrites. otherwise, appends
     * @param {Object} entry
     * @returns {Promise<void>}
     */
    async save(entry) {
        const row = this._toCsv(entry);
        const opts = {fields: ['UNIQUE_KEY'], header: false};
        const keyFormatted = json2Csv.parse({UNIQUE_KEY: this._getUniqueKey(entry)}, opts);
        const result = await replaceInFile({
            files: this._path,
            from: new RegExp('^' + escapeRegex(keyFormatted) + ',.+$', 'gm'),
            to: row
        });
        if (!result[0].hasChanged) {
            await fs.promises.appendFile(this._path, row + "\n");
        }
    }

    async search({filter, order, select}) {
        const matches = [];
        await this._streamFileLines(this._path, async (line) => {
            const record = this._parseCsvLine(line);
            if (this._isMatch(record, filter)) {
                matches.push(record);
            }
        });
        // 1. read line by line (./import/streamFileLines())
        // 2. filter the line (check against predicate, ie query.filter())
        // 3. sort by query.order field name
        // 4. pick only the properties listed in query.select[] field names array
    }

    _parseCsvLine(line) {
        // TODO
        const parsed = papaparse.parse(line);
        const record = this._columns.map((k, i) => {
            return {[k]: parsed.data[0][i]};
        }).reduce((obj, cur) => ({...obj, ...cur}), {});
        console.debug('parsed result:', record);
        return record;
    }

    _isMatch(record, filter) {
        // TODO
    }

    /**
     *
     * @param {Object} entry
     * @returns {*}
     * @throws Error if json2Csv encounters some issue during conversion
     * @private
     */
    _toCsv(entry) {
        const opts = {fields: this._columns, header: false};
        return json2Csv.parse({
                UNIQUE_KEY: this._getUniqueKey(entry),
                ...entry
            },
            opts
        );
    }

    /**
     * gets unique key value for an entry, based on defined key fields
     * @param {Object} entry
     * @returns {string} entry's unique key value (joined by '|' if multi-part key)
     * @private
     */
    _getUniqueKey(entry) {
        return this._keys
            .map(k => entry[k])
            .join('|');
    }

    _ensureFileExists(filePath) {
        if (!fs.existsSync(filePath)) {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.openSync(filePath, 'w+');
        } else {
            if (fs.statSync(filePath).isDirectory()) {
                throw new Error(`path is a directory, not a file: ${filePath}`);
            }
        }

        if (!fs.statSync(filePath).isFile()) {
            throw new Error(`failed to create file at path: ${filePath}`);
        }
    }

    /**
     * checks if file can be read and written to
     * @param {string} path
     * @returns {boolean}
     * @private
     */
    _fileAccessible(path) {
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch (err) {
            console.error('insufficient file access', err);
            return false;
        }
    }
}

module.exports = {
    FileDb
};
