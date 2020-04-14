const { FileDb } = require('../main/FileDb');
const fs = require('fs');
const path = require('path');

describe('FileDb', () => {
    let fileDb;
    const testFilePath = path.resolve('src', 'test', 'db', 'test_db_file.csv');
    const preExistingTestFileResourcesPath = path.resolve('src', 'test', 'resources', 'preexisting_test_db_file.csv');
    const preExistingTestFilePath = path.resolve('src', 'test', 'db', 'preexisting_test_db_file.csv');

    beforeEach(() => {
        fileDb = new FileDb({
            columns: ['foo', 'bar', 'baz'],
            keys: ['foo', 'bar'],
            path: testFilePath
        });
        fs.copyFileSync(preExistingTestFileResourcesPath, preExistingTestFilePath);
    });

    afterEach(() => {
        fs.unlinkSync(testFilePath);
        fs.unlinkSync(preExistingTestFilePath);
    });

    it('#_toCSV() happy path - transforms values to defined columns order', () => {
        expect(fileDb._toCsv({foo: 'a', bar: 'b', baz: 'c'}))
            .toBe('"a|b","a","b","c"');
        expect(fileDb._toCsv({foo: 'hello', bar: 'hola', baz: 'bonjour'}))
            .toBe('"hello|hola","hello","hola","bonjour"');
    });

    it('#_toCsv() escapes quotes according to RFC 4180 spec', () => {
        expect(fileDb._toCsv({foo: 'hi "tom"', bar: 'b', baz: 'c'}))
            .toBe('"hi ""tom""|b","hi ""tom""","b","c"');
    });

    it('#_toCsv() happy path - columns of csv appear in consistent (defined) order, regardless of object prop order', () => {
        const testEntries = [
            {
                foo: 'x',
                bar: 'y',
                baz: 'z'
            },
            {
                foo: 'x',
                baz: 'z',
                bar: 'y'
            },
            {
                baz: 'z',
                foo: 'x',
                bar: 'y'
            },
            {
                baz: 'z',
                bar: 'y',
                foo: 'x'
            },
            {
                bar: 'y',
                foo: 'x',
                baz: 'z'
            },
            {
                bar: 'y',
                baz: 'z',
                foo: 'x'
            }
        ];
        testEntries.forEach(entry => {
            const actualCsv = fileDb._toCsv(entry);
            expect(actualCsv).toBe('"x|y","x","y","z"');
        });
    });

    it('#save() happy path', async () => {
        await fileDb.save({foo: 'x', bar: 'y', baz: 'z'});
        const contents = fs.readFileSync(testFilePath, {encoding: 'utf8'});
        expect(contents.trim()).toBe('"x|y","x","y","z"');
    });

    it('#save() happy path - overwrite on same key (multi-part key) value', async () => {
        await fileDb.save({foo: 'a', bar: 'b', baz: 'hello world'});
        await fileDb.save({foo: 'c', bar: 'd', baz: 'x'});
        await fileDb.save({foo: 'c', bar: 'f', baz: 'y'});
        await fileDb.save({foo: 'g', bar: 'f', baz: 'z'});
        await fileDb.save({foo: 'c', bar: 'd', baz: '0'});
        const expected = `
"a|b","a","b","hello world"
"c|d","c","d","0"
"c|f","c","f","y"
"g|f","g","f","z"
        `.trim();
        console.log('expected:', expected);
        const contents = fs.readFileSync(testFilePath, {encoding: 'utf8'});
        expect(contents.trim()).toBe(expected);
    });
});
