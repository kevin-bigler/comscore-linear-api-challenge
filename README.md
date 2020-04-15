# comscore-linear-api-challenge

**BUG NOTE:** For some reason, updating records is not working with the current format/impl. Unit tests work with other schemas, so it probably has to do with the '-' in the dates I think.

Otherwise, I believe all functionality works. I would add more unit/integration tests, with time (TODO notes indicate this in certain areas).

Thanks.

## Installation

```sh
npm install
npm link
```

`npm link` creates a symlink pointing to this project's bin, ie makes it accessible as a command regardless of pwd

```sh
npm test
```

_(you'll see the failing test I mentioned in the above "bug note")_

## CLI

### import

```sh
comscore-challenge import -s <source path> -d <destination path>
```

source path points to a pipe-delimited file of watch statistics

### query

query format includes args for SELECT, ORDER and FILTER

- SELECT (`-s <select>`) &mdash; required. comma separated field names. defaults to all fields
- ORDER (`-o <order>`) &mdash; optional. one or more comma separated field names to order by. defaults to db's order
- FILTER (`-f <filter>`) &mdash; optional. predicate condition to filter results by. defaults to no filter

format:

```sh
comscore-challenge query -p <db path> [-s <select>] [-o <order>] [-f <filter>]
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
