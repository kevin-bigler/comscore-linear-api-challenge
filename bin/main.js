#!/usr/bin/env node

const { argv } = require('yargs');
const { commandHub } = require('../index');
commandHub(argv);
