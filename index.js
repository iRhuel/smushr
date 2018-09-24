#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const resolve = require('path').resolve;
const smush = require('./lib/smush');
const fileWalk = require('./lib/files');
const version = require('./package.json').version;

program
    .arguments('[paths...]')
    .version(version, '-v, --version')
    .option('-r, --recursive', 'recursively parse subdirectories as well')
    .option('-o, --output [name]', 'specify output file name')
    .action(paths => {
        const dirs = [];
        const result = {};

        paths
            .map(name => resolve(name))
            .forEach(path => fs.existsSync(path) ? dirs.push(path) : console.log(`WARNING: ${path} does not exist!`));

        dirs.forEach(dir => {
            const outputName = program.output || 'smushed';

            if (program.recursive) {
                fileWalk(resolve(dir), (err, list) => {
                    if (err) throw err;

                    list
                        .filter(filePath => filePath.includes('.json'))
                        .filter(filePath => !filePath.includes(outputName))
                        .forEach(filePath => smush(require(filePath), result));

                    fs.writeFileSync(`${outputName}.json`, JSON.stringify(result, null, '\t'), 'utf8', err => {
                        if (err) throw err;
                    });
                });
            } else {
                const files = fs
                    .readdirSync(resolve(dir))
                    .filter(filePath => filePath.includes('.json'))
                    .filter(filePath => !filePath.includes(outputName))
                    .map(filePath => resolve(dir, filePath));

                files.forEach(filePath => smush(require(filePath), result));

                fs.writeFileSync(`${outputName}.json`, JSON.stringify(result, null, '\t'), 'utf8', err => {
                    if (err) throw err;
                });
            }
        });
    })
    .parse(process.argv);
