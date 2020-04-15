const { createGetStatRepository } = require('../main/statRepository');
const fs = require('fs');
const path = require('path');

describe('statRepository', () => {
    let getStatRepository;
    let testFilePath;

    beforeEach(() => {
        testFilePath = path.resolve('src', 'test', 'statRepository', 'test_stat_repo.csv');
        getStatRepository = createGetStatRepository({});
    });

    afterEach(() => {
        fs.unlinkSync(testFilePath);
    });

    it('happy path', async () => {
        const statRepo = getStatRepository({path: testFilePath});
        await statRepo.save({
            STB: 'foo',
            TITLE: 'bar',
            DATE: 'baz',
            PROVIDER: 'bing',
            REV: 'bang',
            VIEW_TIME: 'boom'
        });
        await statRepo.save({
            STB: 'a',
            TITLE: 'b',
            DATE: 'c',
            PROVIDER: 'x',
            REV: 'y',
            VIEW_TIME: 'z'
        });
        let expected = `
"foo|bar|baz","foo","bar","baz","bing","bang","boom"
"a|b|c","a","b","c","x","y","z"
        `.trim();
        // console.log('expected:', expected);
        let contents = fs.readFileSync(testFilePath, {encoding: 'utf8'});
        expect(contents.trim()).toBe(expected);

        await statRepo.save({
            STB: 'foo',
            TITLE: 'bar',
            DATE: 'baz',
            PROVIDER: 'larry',
            REV: 'moe',
            VIEW_TIME: 'curly'
        });
        expected = `
"foo|bar|baz","foo","bar","baz","larry","moe","curly"
"a|b|c","a","b","c","x","y","z"
        `.trim();
        // console.log('expected:', expected);
        contents = fs.readFileSync(testFilePath, {encoding: 'utf8'});
        expect(contents.trim()).toBe(expected);
    });
});
