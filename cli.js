#!/usr/bin/env node

import {hideBin} from 'yargs/helpers';
import folderDiff from './lib/folder-diff.js';
import yargs from 'yargs';
import chalk from 'chalk';


const main = async () => {
  const parser = await yargs(hideBin(process.argv))
    .usage('Usage: $0 <cmd> [options]') // usage string of application.
    .command('folder-diff', 'output list of files not in second folder') // describe commands available.
    .option('folder1', {
      alias: 'f1',
      describe: 'First folder path',
      demandOption: true,
      type: 'string',
    })
    .option('folder2', {
      alias: 'f2',
      describe: 'Second folder path',
      demandOption: true,
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

  await folderDiff(argv.folder1, argv.folder2, argv.format);
};

main().catch((error) =>console.error(chalk.red(error)));
