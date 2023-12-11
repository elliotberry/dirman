import {program} from 'commander';
import path from 'path';
import display from './lib/display/display-simple-list.js';
import crawlOneDir from './lib/crawl-one-folder.js';
import {defaultCompareOptions, compareDirectories} from './lib/compare.js';
import {defaultCrawlOptions} from './lib/crawl-operations/crawl-operations.js';

program.name('dirman').description('various file organization utils').version('0.0.3');

program
  .command('compare')
  .requiredOption('-d, --dir1 <directory>', 'First directory to compare')
  .requiredOption('-e, --dir2 <directory>', 'Second directory to compare')
  .action(async options => {

    const {dir1, dir2} = options;

   

    let one = await crawlOneDir(dir1);
    console.log(`done crawling ${dir1}`);
    let two = await crawlOneDir(dir2);

    console.log(`done crawling ${dir2}`);
    console.log(`comparing ${dir1} to ${dir2}`);
    let compared = await compareDirectories(one, two, compareOptions);
    display(compared);
  });
program.parse(process.argv);
