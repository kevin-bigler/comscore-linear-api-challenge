const { streamFileLines: defaultStreamFileLines } = require('./import/streamFileLines');
const { parseLine: defaultParseLine } = require('./import/parseLine');
const { persistEntry: defaultPersistEntry } = require('./import/persistEntry');

/**
 * Factory for importFile function, allows Dependency Injection
 * @param {Object} deps
 * @returns {function(...[*]=)}
 */
const createImportFile = ({
    streamFileLines = defaultStreamFileLines,
    parseLine = defaultParseLine,
    persistEntry = defaultPersistEntry
}) => ({path}) => {
    streamFileLines(path, async (line) => {
        const entry = parseLine(line);
        await persistEntry(entry);
    });
};

module.exports = {
    importFile: createImportFile({}),
    createImportFile
};
