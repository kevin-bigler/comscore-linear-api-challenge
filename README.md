# comscore-linear-api-challenge

## Installation

```sh
npm install
npm link
```

`npm link` creates a symlink pointing to this project's bin, ie makes it accessible as a command regardless of pwd

## CLI

### import

```sh
comscore-challenge import -s <source path>
```

source path points to a pipe-delimited file of watch statistics

### query

query format includes args for SELECT, ORDER and FILTER

- SELECT (`-s <select>`) &mdash; required. comma separated field names
- ORDER (`-o <order>`) &mdash; optional. one or more comma separated field names to order by
- FILTER (`-f <filter>`) &mdash; optional. predicate condition to filter results by

format:

```sh
comscore-challenge query -s <select> -o <order> -f <filter>
```

examples:

```sh
comscore-challenge query -s TITLE,REV,DATE -o DATE,TITLE
comscore-challenge query -s TITLE,REV,DATE -f DATE=2014-04-01
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
