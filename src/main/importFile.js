const { streamFileLines: defaultStreamFileLines } = require('./import/streamFileLines');
const { parseLine: defaultParseLine } = require('./import/parseLine');
const StatRepository = require('./StatRepository'); // TODO

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
        const stat = parseLine(line);
        await statRepo.save(stat);
    });
};

module.exports = {
    importFile: createImportFile({}),
    createImportFile
};
