#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const resolve = require('path').resolve;
const smush = require('./lib/smush');
const fileWalk = require('./lib/files');
const pkg = require('./package.json');

program
    .arguments('[paths...]')
    .version(pkg.version, '-v, --version')
    .usage('[options] [paths...]')
    .description(pkg.description)
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
    .on('--help', () => {
        console.log('\nExamples:\n');
        console.log('   $ smush . ./dir ./dir/otherDir -o outputName');
        console.log('   $ smush -o outputName . -r');
    })
    .parse(process.argv);
