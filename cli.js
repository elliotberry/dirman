#!/usr/bin/env node
import {hideBin} from 'yargs/helpers';
import folderDiff from './lib/folder-diff.js';
import yargs from 'yargs';
import chalk from 'chalk';

const main = async () => {
  const parser = await yargs(hideBin(process.argv))
    .usage('Usage: $0 <cmd> [options]') // usage string of application.
    .positional('folder1', {
      describe: 'First folder path',
      type: 'string',
    })
    .positional('folder2', {
      describe: 'Second folder path',
      type: 'string',
    })
    .help('h')
    .alias('h', 'help');
  const argv = await parser.parse();

  await folderDiff(argv._[0], argv._[1]);
};

main().catch(error => console.error(chalk.red(error)));
