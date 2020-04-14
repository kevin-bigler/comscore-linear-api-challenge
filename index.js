const { argv } = require('yargs');
const { importFile } = require('./src/main/importFile');
const { queryStats } = require('./src/main/queryStats');

/*
    parse cli params
    pass params to whichever command-function (2nd cli arg)
    commands:
     import - needs file name (pipe-delimited props, line-delimited entries)
     query - select, order, filter
*/

const commandHub = async () => {
    const [ command ] = argv._;
    const cmdFn = getCommandFn(command);
    return await cmdFn(argv);
};

/**
 * factory to return a fn corresponding to the given command name
 * @param {string} command command name
 */
const getCommandFn = (command) => {
    const map = {
        'import': importCommand,
        'query': queryCommand
    };
    return map[command];
};

/**
 * parse cli params and pass on to appropriate service/fn
 */
const importCommand = ({path}) => {
    // TODO: validate input
    return importFile({path});
};

/**
 * parse cli params and pass on to appropriate service/fn
 */
const queryCommand = ({}) => {
    // TODO: validate input
    // TODO: define params
    return queryStats({});
};

module.exports = {
    commandHub,
    getCommandFn,
    importCommand,
    queryCommand
};
