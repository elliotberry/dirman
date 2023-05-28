
import crawlOneDir from './lib/crawl-one-folder.js';
import compareTwoFolders from './lib/compare-two-folders.js';
import findConflicts from './lib/find-conflicts-promise.js';
import saveLog from './lib/save-log.js';

async function crawlTwoDirs(dir1, dir2) {
  let one = await crawlOneDir(dir1);
  let two = await crawlOneDir(dir2);

  let compared = await findConflicts(one, two);
  await saveLog({compared, dir1, dir2}, './compared.json');
  console.log(compared.isNotInTargetFolder.map(file => file.absolutePath).join('\n'));
}
crawlTwoDirs('/Volumes/fatboi/olde/art', '/Users/eberry/Desktop/working-files-to-backup/art');


