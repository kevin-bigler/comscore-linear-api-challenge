const { importFile } = require('./src/main/importFile');
const { queryStats } = require('./src/main/queryStats');

/*
    index.js
    parse cli params
    pass params to whichever command-function (2nd cli arg)
    commands:
     import - needs file name (pipe-delimited props, line-delimited entries)
     query - select, order, filter
*/

/**
 * main command fn, dispatches whichever command is invoked (eg comscore-challenge query ... invokes the query command)
 * @param {Object} argv yargs.argv (cli args)
 * @returns {Promise<*>} async process
 * TODO: unit test
 */
const commandHub = async (argv) => {
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
 *
 * @param {Object} args
 * @param {string} args.s Source path, pointing to a file pipe-separated-values (see README)
 */
const importCommand = ({s}) => {
    // TODO: validate input
    return importFile({path: s});
};

/**
 * parse cli params and pass on to appropriate service/fn
 *
 * @param {Object} args
 * @param {string} args.f Filter, comma-separated filter expression(s)
 * @param {string} args.o Order, comma-separated field(s) to sort by
 * @param {string} args.s Select, comma-separated field(s) to show for each result
 * @returns {Promise<void>}
 */
const queryCommand = async ({f, o, s}) => {
    // TODO: validate input
    const results = await queryStats({filter: f, order: o, select: s});
    results.forEach(console.log);
};

module.exports = {
    commandHub,
    getCommandFn,
    importCommand,
    queryCommand
};
