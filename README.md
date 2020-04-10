# comscore-linear-api-challenge

## Installation

```sh
npm install
npm link
```

`npm link` creates a symlink pointing to this project's bin, ie makes it accessible as a command regardless of pwd

## CLI

format

```sh
query 
```

examples

```sh
query -s TITLE,REV,DATE -o DATE,TITLE
query -s TITLE,REV,DATE -f DATE=2014-04-01
```

## Watch Statistic

The entry type dealt, WatchStatistic (or just "Stat") has the following schema/fields:

- STB
- TITLE
- DATE
- PROVIDER
- REV
- VIEW_TIME

Multipart key: STB + TITLE + DATE