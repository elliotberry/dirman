import {fdir} from 'fdir';
import crypto from 'crypto';
import Table from 'cli-table';
import fs from 'fs';
// Define the two directories to compare
const dir1 = '/Users/eberry/Desktop/working-files-to-backup/art';
const dir2 = '/Users/eberry/Desktop/working-files-to-backup/art-to-concat/art3';

// Define a helper function to compute the hash of a file
function getHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const fileData = fs.readFileSync(filePath);
    hash.update(fileData);
    resolve(hash.digest('hex'));
  });
}

// Define two objects to hold the file hashes for each directory
const dir1Hashes = {};
const dir2Hashes = {};

const crawl = async dir1 => {
  const files = await new fdir().withBasePath().withDirs().crawl(dir1).withPromise();
  let withHashes = await Promise.all(
    files.map(async filePath => {
      const hash = await getHash(filePath);
      return {filePath, hash};
    }),
  );
  //create object
  withHashes = withHashes.reduce((acc, cur) => {
    acc[cur.filePath] = cur.hash;
    return acc;
  }, {});
  console.log(withHashes);
  return withHashes;
};
const display = (dir1Files, dir2Files) => {
  const table = new Table({
    head: ['Filename', 'Directory'],
    colWidths: [50, 50],
  });

  // Compare the two sets of hashes and add the results to the table
  Object.keys(dir1Hashes).forEach(filePath => {
    const hash = dir1Hashes[filePath];
    if (!(filePath in dir2Hashes)) {
      table.push([filePath, dir1]);
    } else if (dir2Hashes[filePath] !== hash) {
      table.push([filePath, `${dir1} (${hash})`]);
      table.push([filePath, `${dir2} (${dir2Hashes[filePath]})`]);
    }
  });

  Object.keys(dir2Hashes).forEach(filePath => {
    const hash = dir2Hashes[filePath];
    if (!(filePath in dir1Hashes)) {
      table.push([filePath, dir2]);
    }
  });

  // Display the table in the console
  console.log(table.toString());
};
const main = async () => {
  const dir1Files = await crawl(dir1);
  // const dir2Files = await crawl(dir2);
};

main();
