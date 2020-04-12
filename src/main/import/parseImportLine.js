require('../types');

/**
 * get {@link Stat} from an import file's line
 *
 * import line format:
 * STB|TITLE|PROVIDER|DATE|REV|VIEW_TIME
 *
 * note: trims each value
 *
 * @param {string} line pipe-delimited string of stat fields' values
 * @returns {Stat}
 * TODO: handle case where string is invalid
 */
const parseImportLine = (line) => {
    const [STB, TITLE, PROVIDER, DATE, REV, VIEW_TIME] = line.split('|');
    return {STB, TITLE, PROVIDER, DATE, REV, VIEW_TIME};
};

module.exports = { parseImportLine };