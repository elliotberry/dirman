import crawlOneDir from './crawl-one-folder.js';
import findConflicts from './find-conflicts-promise.js';
import display from './display-folder-diff.js';
import {defaultCrawlOptions} from './file-data-functions/crawl-operations.js';


async function crawlTwoDirs(dir1, dir2, crawlOptions, compareOptions) {
  if (!crawlOptions) {
    crawlOptions = defaultCrawlOptions;
  }
  let one = await crawlOneDir(dir1, crawlOptions);
  console.log(`done crawling ${dir1}`);
  let two = await crawlOneDir(dir2, crawlOptions);

  console.log(`done crawling ${dir2}`);
  console.log(`comparing ${dir1} to ${dir2}`);
  let compared = await findConflicts(one, two, compareOptions);
  console.log(`done comparing ${dir1} to ${dir2}`);
  console.log(`\n\n`);
  return display(compared);
}

export {crawlTwoDirs};
