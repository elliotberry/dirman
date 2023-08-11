import {crawlTwoDirs, displayAsTable} from './lib/crawl-two-folders-and-display-files-different.js';


async function main() {

  let obj = await crawlTwoDirs('/Volumes/2021-apr-staging/archive-time/full-archives/art', '/Users/eberry/Desktop/working-files-to-backup/art');
  displayAsTable(obj);
 
}

main();
