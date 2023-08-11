import crawlOneDir from './crawl-one-folder.js';
import findConflicts from './find-conflicts-promise.js';
import display from './display-folder-diff.js';

const compareOptions = {
  hash: true,
  size: false,
  name: false,
  dirs: true,
};
const crawlOptions = {
  hash: true,
  size: true,
  name: true,
  dirs: true,
};

async function crawlTwoDirs(dir1, dir2) {
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
