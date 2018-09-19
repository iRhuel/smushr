#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const resolve = require('path').resolve;
const smush = require('./lib/smush');
const files = require('./lib/files');
const version = require('./package.json').version;

program
    .arguments('<path>')
    .version(version, '-v, --version')
    .action(path => {
        const result = {};
        files(resolve(path), (err, list) => {
            if (err) throw err;
            list
                .filter(filePath => filePath.includes('.json'))
                .forEach(filePath => smush(require(filePath), result));
            fs.writeFileSync('./smushed.json', JSON.stringify(result, null, '\t'), 'utf8', err => {
                if (err) throw err;
            });
        });
    })
    .parse(process.argv);