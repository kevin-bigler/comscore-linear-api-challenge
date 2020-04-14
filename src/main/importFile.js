const { streamFileLines: defaultStreamFileLines } = require('./import/streamFileLines');
const { parseImportLine: defaultParseImportLine } = require('./import/parseImportLine');
const { getStatRepository: defaultGetStatRepository } = require('./statRepository');

/**
 * Factory for importFile function, allows Dependency Injection
 * @param {Object} deps
 * @returns {function(...[*]=)}
 */
const createImportFile = ({
    streamFileLines = defaultStreamFileLines,
    parseLine = defaultParseImportLine,
    getStatRepo = defaultGetStatRepository
}) => ({path}) => {
    const statRepo = getStatRepo({});
    streamFileLines(path, async (line) => {
        const stat = parseLine(line);
        await statRepo.save(stat);
    });
};

module.exports = {
    importFile: createImportFile({}),
    createImportFile
};
