const { streamFileLines: defaultStreamFileLines } = require('./import/streamFileLines');
const replaceInFile = require('replace-in-file');
const json2Csv = require('json2csv');
const fs = require('fs');
const path = require('path');
const escapeRegex = require('regex-escape'); //require('escape-string-regexp');
const papaparse = require('papaparse');
const R = require('ramda');
const { getPredicateFn } = require('./query/getPredicateFn');

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
        // console.log(`file db located at: ${path}`);

        this._path = path;
        this._streamFileLines = streamFileLines;
        this._columns = ['UNIQUE_KEY', ...columns];
        this._keys = keys;
    }

    /**
     * persist an entry in the db. upserts
     *
     * if an entry with the same key(s) exists, overwrites. otherwise, appends
     *
     * @param {Object} entry
     * @returns {Promise<void>}
     */
    async save(entry) {
        const updated = await this._update(entry);

        if (!updated) {
            // console.debug('db not updated, inserting (appending)');
            await this._insert(entry);
        } else {
            // console.debug('db updated');
        }
    }

    /**
     * update entry in db, if exists.
     *
     * @param entry
     * @returns {Promise<boolean>} resolves `true` if entry existed and was updated. `false` if it did not exist/not updated
     * @private
     * TODO: fix bug dealing with comscore's watch stat format (see statRepository.test.js upsert test case)
     */
    async _update(entry) {
        // TODO: maybe change json2csv usage to papaparse (to reduce # libs and b/c it seems simpler)
        const uniqueKeyCsvFormatted = json2Csv.parse({UNIQUE_KEY: this._getUniqueKey(entry)}, {fields: ['UNIQUE_KEY'], header: false});
        // console.log('unique key csv formatted', uniqueKeyCsvFormatted);
        const uniqueKeyRegexEscaped = escapeRegex(uniqueKeyCsvFormatted);
        // console.log('unique key regex escaped', uniqueKeyRegexEscaped);
        const row = this._toCsv(entry);
        const result = await replaceInFile({
            files: this._path,
            from: new RegExp('^' + uniqueKeyRegexEscaped + ',.+$', 'gm'),
            to: row
        });
        return result && result.length && result[0] && result[0].hasChanged;
    }

    /**
     * add entry to db. does not check unique key, simply adds
     *
     * @param entry
     * @returns {Promise<void>}
     * @private
     */
    async _insert(entry) {
        const row = this._toCsv(entry);
        // console.debug('sav row', row);
        await fs.promises.appendFile(this._path, row + "\n");
    }

    /**
     *
     * @param {[string]} filter filter expression(s) TODO
     * @param {[string]} order field(s) to order by
     * @param {[string]} field(s) to select for results
     * @returns {Promise<unknown[]>}
     */
    async search({filter= [], order= [], select = []}) {
        // TODO: do all 3 query params have to be present? do validation, test it
        // 1. read line by line (./import/streamFileLines())
        // 2. filter the line (check against predicate, ie query.filter())
        // 3. sort by query.order field name
        // 4. pick only the properties listed in query.select[] field names array
        const matches = [];
        await this._streamFileLines(this._path, async (line) => {
            const record = this._parseCsvLine(line);
            if (this._isMatch(record, filter)) {
                matches.push(record);
            }
        });
        // TODO: validate 'select' -- has to just be values from this._columns (error or ignore other values given)
        // console.log('matches', matches);
        // console.log('filter', filter);
        // console.log('order', order);
        // console.log('select', select);
        const compositeSort = R.sortWith(
            order.map(k =>
                R.ascend(R.prop(k))
            )
        );
        const sorted = compositeSort(matches);
        // console.debug('ordered:', sorted);
        const results = sorted.map(R.pick(select));
        // console.debug('results after select applied', results);
        return results;
    }

    _parseCsvLine(line) {
        const parsed = papaparse.parse(line);
        const lineValues = parsed.data[0];
        return this._columns
            .map((k, i) =>
                ({[k]: lineValues[i]}))
            .reduce((obj, cur) =>
                ({...obj, ...cur}),
                {});
    }

    /**
     * tests predicates (filter) against the given record
     *
     * @param {Object} record
     * @param {[string]} filter predicate statement(s)
     * @returns {boolean}
     * @private
     */
    _isMatch(record, filter) {
        const passes = filter
            .map(getPredicateFn)
            .filter(predicateFn => predicateFn(record));
        // console.debug('_isMatch summary', {numPasses: passes.length, numFilters: filter.length});
        return passes.length === filter.length;
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
