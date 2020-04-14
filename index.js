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
    if (!map[command]) {
        throw new Error(`invalid command or none provided (${command})`)
    }
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
const queryCommand = async ({f, o, s}) => {
    // TODO: validate input
    // TODO: define params
    const results = await queryStats({filter: f, order: o, select: s});
    results.forEach(console.log);
};

module.exports = {
    commandHub,
    getCommandFn,
    importCommand,
    queryCommand
};
