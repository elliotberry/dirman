
import {createReadStream} from 'fs';
import {createHash} from 'crypto';
import {stat} from 'fs/promises';
import pkg from 'xxhash-addon';
import crawlOneDir from './crawl-one-dir.js';
const {XXHash3} = pkg;
import {findConflicts} from './lib/find-conflicts-promise.js';


const getFileInfo = async file => {
  try {
    const stats = await stat(file);

    if (stats.isFile()) {
      const filePath = file;
      const hash = createHash('sha256');
      const stream = createReadStream(filePath);

      // Read the file contents into the hash object.
      for await (const chunk of stream) {
        hash.update(chunk);
      }

      const fileHash = hash.digest('hex');
      await hashA.push({file: filePath, hash: fileHash});
    }
  } catch (err) {
    console.log(`${file} could not be hashed.`);
  }
};


var hashFile = filePath => {
  return new Promise(function (res) {
    const xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]));
    createReadStream(filePath)
      .on('data', data => xxh3.update(data))
      .on('end', () => res(xxh3.digest().toString('hex')));
  });
};





async function crawlTwoDirs(dir1, dir2, compare={hash: false}) {
  let one = await crawlOneDir(dir1, compare);

  let two = await crawlOneDir(dir2, compare);


  let compared = await findConflicts(one, two, compare);

  console.log(compared.isNotInTargetFolder.map(file => file.absolutePath).join('\n'));
}
crawlTwoDirs('/Volumes/2021-apr-staging/archive-time/full-archives/art', '/Users/eberry/Desktop/working-files-to-backup/art');
