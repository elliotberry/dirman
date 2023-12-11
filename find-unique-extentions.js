
import display from './lib/display/display-simple-list.js';
import crawlOneDir from './lib/crawl-one-folder.js';

import {groupByExtension} from './lib/group-by-extension.js';
import {defaultCrawlOptions} from './lib/crawl-operations/crawl-operations.js';


async function main() {
  let dir = process.argv[2];
  let filez = await crawlOneDir(dir);
console.log(filez);
  console.log(`done crawling ${dir}. found ${filez.length} files`);
  let {grouped, withCounts, uniqueExtensions} = await groupByExtension(filez);
  console.log(withCounts);
}

main();
