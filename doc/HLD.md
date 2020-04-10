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

- file system based
- file name (~hash key) = `TITLE_DATE.csv`
- first column (~range key) = `STB`
- column looks like `STB,PROVIDER,REV,VIEW_TIME`
