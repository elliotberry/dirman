import crawlOneDir from './lib/crawl-one-folder.js';
import findConflicts from './lib/find-conflicts-promise.js';
import display from './lib/display-conflicts-in-console.js';
const compareOptions = {
  hash: true,
  size: false,
  name: false
};

async function crawlTwoDirs(dir1, dir2) {
  let one = await crawlOneDir(dir1, compareOptions);
  console.log(`done crawling ${dir1}`);
  let two = await crawlOneDir(dir2, compareOptions);
  console.log(two);
  console.log(`done crawling ${dir2}`);
  console.log(`comparing ${dir1} to ${dir2}`);
  let compared = await findConflicts(one, two, compareOptions);
  display(compared, dir1, dir2, compareOptions);
  
}
crawlTwoDirs('/Volumes/fatboi/olde/art', '/Users/eberry/Desktop/working-files-to-backup/art');
//crawlTwoDirs('test/folder1', 'test/folder2');
