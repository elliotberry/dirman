import display from './lib/display/display-simple-list.js';

import crawlOneDir from './lib/crawl-one-folder.js';
import {defaultCompareOptions, compareDirectories} from './lib/compare.js';

import {defaultCrawlOptions} from './lib/crawl-operations/crawl-operations.js';


async function main(dir1, dir2, crawlOptions, compareOptions) {
 
  if (!crawlOptions) {
    crawlOptions = defaultCrawlOptions;
  }
  if (!compareOptions) {
    compareOptions = defaultCompareOptions;
  }
  let one = await crawlOneDir(dir1, crawlOptions);
  console.log(`done crawling ${dir1}`);
  let two = await crawlOneDir(dir2, crawlOptions);

  console.log(`done crawling ${dir2}`);
  console.log(`comparing ${dir1} to ${dir2}`);
  let compared = await compareDirectories(one, two, compareOptions);
  display(compared);
}

let args = process.argv.slice(2);
if (args.length < 2) {
  console.log('usage: node output-list-of-files-not-in-second-folder.js <dir1> <dir2>');
  process.exit(1);
}
main(args[0], args[1]);
