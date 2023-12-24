#!/usr/bin/env node

import {hideBin} from 'yargs/helpers';
import folderDiff from './lib/folder-diff.js';
import yargs from 'yargs';
import chalk from 'chalk';

const log = (format = 'text') => {
  let fn = console.log;
  if (format === 'json') {
    fn = msg => console.log(JSON.stringify({msg: msg}, null, 2));
  }
  return fn;
};

const main = async () => {
  const parser = await yargs(hideBin(process.argv))
    .usage('Usage: $0 <cmd> [options]') // usage string of application.
    .command('folder-diff', 'output list of files not in second folder') // describe commands available.
    .positional('folder1', {
      describe: 'First folder path',
      type: 'string',
    })
    .positional('folder2', {
      describe: 'Second folder path',
      type: 'string',
    })
    .option('format', {
      alias: 'o',
      describe: 'Output format',
      choices: ['json', 'text'],
      default: 'text',
    })
    .help('h')
    .alias('h', 'help');
  const argv = await parser.parse();
  
  Global.log = log(argv.format);

  await folderDiff(argv._[0], argv._[1]);
};

main().catch(error => console.error(chalk.red(error)));
