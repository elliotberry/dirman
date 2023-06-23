import {crawlTwoDirs, saveAsJSON, displayAsTable} from './lib/crawl-two-folders-and-display-files-different.js';

async function main() {
  saveAsJSON;
  let obj = await crawlTwoDirs('/Volumes/2021-apr-staging/archive-time/full-archives/art', '/Users/eberry/Desktop/working-files-to-backup/art');
  //crawlTwoDirs('test/folder1', 'test/folder2');
  displayAsTable(obj);
  saveAsJSON(obj);
}

main();
