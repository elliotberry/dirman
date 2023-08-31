import crawlOneDir from './lib/crawl-one-folder.js';
import {groupByExtension} from './lib/group-by-extension.js';
import {defaultCrawlOptions} from './lib/crawl-operations.js'


async function main() {
  let dir = '/Users/eberry/Desktop/working-files-to-backup/__structured-documents-organizing-2021/unorganized-documents';
  let filez = await crawlOneDir(dir, defaultCrawlOptions);
  let {grouped, withCounts, uniqueExtensions} = await groupByExtension(filez);
  console.log(withCounts);
  
}

main();
