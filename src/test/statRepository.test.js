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

    it('upsert functionality happy path', async () => {
        const statRepo = getStatRepository({path: testFilePath});
        const entry = (STB, TITLE, PROVIDER, DATE, REV, VIEW_TIME) => ({
            STB,
            TITLE,
            DATE,
            PROVIDER,
            REV,
            VIEW_TIME
        });
        const line = ({STB, TITLE, PROVIDER, DATE, REV, VIEW_TIME}) => `"${STB}|${TITLE}|${DATE}","${STB}","${TITLE}","${DATE}","${PROVIDER}","${REV}","${VIEW_TIME}"`;
        const assertFileContents = async (expected) => {
            const contents = fs.readFileSync(testFilePath, {encoding: 'utf8'});
            expect(contents.trim()).toBe(expected);
        };
        const e1 = entry('stb1', 'the matrix', 'warner bros', '2014-04-01', '4.00', '1:30');
        const e2 = entry('stb1', 'unbreakable', 'buena vista', '2014-04-03', '6.00', '2:05');
        const e3 = entry('stb2', 'the hobbit', 'warner bros', '2014-04-02', '8.00', '2:45');
        const e4 = entry('stb3', 'the matrix', 'warner bros', '2014-04-02', '4.00', '1:05');
        await statRepo.save(e1);
        await assertFileContents([line(e1)].join("\n"));
        await statRepo.save(e2);
        await assertFileContents([line(e1), line(e2)].join("\n"));
        await statRepo.save(e3);
        await assertFileContents([line(e1), line(e2), line(e3)].join("\n"));
        await statRepo.save(e4);
        await assertFileContents([line(e1), line(e2), line(e3), line(e4)].join("\n"));

        // ensure that on reuploading the same file, contents remain the same (ie it updates only, but w/ the same info)
        await statRepo.save(e1);
        await statRepo.save(e2);
        await statRepo.save(e3);
        await statRepo.save(e4);
        await assertFileContents([line(e1), line(e2), line(e3), line(e4)].join("\n"));
    });
});
