const defaultFs = require('fs');
const defaultReadline = require('readline');

/**
 * factory to inject dependencies (ie partial application), creates 'streamFileLines' function with the given deps
 * @param {Object} deps Dependencies
 * @param {Object} deps.fs
 * @param {Object} deps.readline
 * @return {function}
 *
 * created function's info:
 * given a file path, streams its lines 1 at a time
 * note: skips blank lines
 *
 * @param {string} path Path of file to read
 * @param {function(line: string): Promise<*>} cb Callback function invoked per-line. Should return Promise
 * @returns {Promise<void>}
 */
const createStreamFileLines = ({fs = defaultFs, readline = defaultReadline}) => async (path, cb) => {
    const fileStream = fs.createReadStream(path);

    const rl = readline.createInterface({
        input: fileStream
    });

    for await (const line of rl) {
        if (line.length > 0) {
            await cb(line);
        }
    }
};

module.exports = {
    streamFileLines: createStreamFileLines({}),
    createStreamFileLines
};
