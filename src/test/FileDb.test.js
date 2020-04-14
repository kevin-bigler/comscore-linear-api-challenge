const { FileDb } = require('../main/FileDb');

describe('FileDb', () => {
    let fileDb;
    beforeAll(() => {
        fileDb = new FileDb({
            columns: ['foo', 'bar', 'baz']
        });
    });

    it('#_toCSV() happy path - transforms values to defined columns order', () => {
        // const fileDb
        // const actualCsv = fileDb._toCsv(entry);
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
            // first (empty) column is always UNIQUE_KEY -- tested below
            expect(actualCsv).toBe(',"x","y","z"');
        });
    });
});