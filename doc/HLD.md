# High Level Design (and some lower level)

## example file (provided)

```
STB|TITLE|PROVIDER|DATE|REV|VIEW_TIME
stb1|the matrix|warner bros|2014-04-01|4.00|1:30
stb1|unbreakable|buena vista|2014-04-03|6.00|2:05
stb2|the hobbit|warner bros|2014-04-02|8.00|2:45
stb3|the matrix|warner bros|2014-04-02|4.00|1:05
```

## fields

- STB
- TITLE
- PROVIDER
- DATE
- REV
- VIEW_TIME

## unique key

multi-part key of:

- STB
- TITLE
- DATE

## considerations

scale (estimate)

STB > TITLE > DATE > PROVIDER

millions > thousands > hundreds > tens

## db structure

- file system based (obviously)

#### KISS solution

- single db file for all of a record type (table), which we just have one: `Stat` (Watch Statistic)
- format: csv, so that it can be opened as a spreadsheet (excel etc) and b/c it's a universal format
- row looks like `STB,TITLE,DATE,PROVIDER,REV,VIEW_TIME`
- csv to comply with [RFC 4180 specification](https://tools.ietf.org/html/rfc4180#section-2)

#### other ideas... maybe later, experiment

- maybe prefix rows with the multipart (unique) key?
    - ie `STB|TITLE|DATE|<csv line>`
    - could then use regex and/or not have to parse the line in some circumstances
- could try having a "keys" table, separate from main table, for potentially quicker querying
- file name (~hash key) = `TITLE_DATE.csv`
- first column (~range key) = `STB`
- row looks like `STB,PROVIDER,REV,VIEW_TIME`
