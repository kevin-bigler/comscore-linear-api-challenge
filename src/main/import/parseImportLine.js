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
 * TODO: potentially inject/configure field list. not necessarily needed unless handling multiple imports or if the field list varies per file
 */
const parseImportLine = (line) => {
    const [STB, TITLE, PROVIDER, DATE, REV, VIEW_TIME] = line.split('|').map(x => x.trim());
    return {STB, TITLE, PROVIDER, DATE, REV, VIEW_TIME};
};

module.exports = { parseImportLine };
