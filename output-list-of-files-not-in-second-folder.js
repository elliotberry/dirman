import display from './lib/display/display-simple-list.js';
import crawlOneDir from './lib/crawl-one-folder.js';
import {defaultCompareOptions, compareDirectories} from './lib/compare.js';
import {defaultCrawlOptions} from './lib/crawl-operations/crawl-operations.js';
import yargs from 'yargs';

const argv = yargs
  .option('dir1', {
    describe: 'First directory to compare',
    demandOption: true,
    type: 'string'
  })
  .option('dir2', {
    describe: 'Second directory to compare',
    demandOption: true,
    type: 'string'
  })
  .option('recursive', {
    describe: 'Whether to crawl directories recursively',
    type: 'boolean',
    default: false
  })
  .option('ignoreCase', {
    describe: 'Whether to ignore case when comparing file names',
    type: 'boolean',
    default: false
  })
  .help()
  .alias('help', 'h')
  .argv;

async function main() {
  const { dir1, dir2, recursive, ignoreCase } = argv;

  const crawlOptions = {
    ...defaultCrawlOptions,
    recursive
  };

  const compareOptions = {
    ...defaultCompareOptions,
    ignoreCase
  };

  let one = await crawlOneDir(dir1, crawlOptions);
  console.log(`done crawling ${dir1}`);
  let two = await crawlOneDir(dir2, crawlOptions);

  console.log(`done crawling ${dir2}`);
  console.log(`comparing ${dir1} to ${dir2}`);
  let compared = await compareDirectories(one, two, compareOptions);
  display(compared);
}

export default main;
