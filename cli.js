#!/usr/bin/env node

import {hideBin} from 'yargs/helpers';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import folderDiff from './output-list-of-files-not-in-second-folder.js';
import yargs from 'yargs';
import chalk from 'chalk';
const __dirname = dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const parser = await yargs(hideBin(process.argv))
    .usage('Usage: $0 <cmd> [options]') // usage string of application.
    .option('loglevel', {
      alias: 'l',
      description: 'Set log level',
      choices: ['silent', 'error', 'info', 'verbose'],
      default: 'info',
    })
    .command('save', "save a database file about file information") // describe commands available.
    .option('folder', {
      alias: 'f',
      describe: 'folder path',
      demandOption: true,
      type: 'string',
    })
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
    .option('verbose')
    .help('h')
    .alias('h', 'help');
  const argv = await parser.parse();

  global.konsole = {
    log: msg => {
      if (!argv.l === 'silent') {
        if (level === 'verbose') {
          console.log(chalk.green(msg));
        } else {
          console.log(chalk.blue(msg));
        }
      }
    },
    error: msg => {
      if (!argv.l === 'silent') {
        console.log(chalk.red(msg));
      }
    },
  };
  console.log(`log level: ${argv.l}`);
  await folderDiff(argv.folder1, argv.folder2);
};

main().catch(console.error);
