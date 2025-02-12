const path = require('path');
const { FileDb: DefaultFileDb } = require('./FileDb');
require('./types');

// note: could configure this info instead of hard-coding (ie use "config" package and config/default.yaml to define)
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
 * DI factory that creates a factory that creates a repo... :(
 * don't worry about that unless doing unit testing. otherwise, use the default export using default FileDb impl
 *
 * repo to Store and Access {@link Stat Watch Statistics (aka "Stats")}
 */
const createGetStatRepository = ({FileDb = DefaultFileDb}) =>
    ({path = getDefaultPath()}) => {
        console.log(`stat repository located at: ${path}`);
        return new FileDb({
            path,
            columns,
            keys
        });
    };

const getDefaultPath = () => path.resolve('db', `${type}_${getDateString()}.${extension}`);

/**
 * Get current day as 'YYYY-MM-DD'
 * @returns {string}
 */
const getDateString = () =>
    new Date().toISOString().substring(0, 'YYYY-MM-DD'.length);

module.exports = {
    getStatRepository: createGetStatRepository({}),
    createGetStatRepository
};
