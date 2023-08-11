import {fdir} from 'fdir';
import path from 'path';

import filePropertiesReaderFactory from './file-properties-reader.js';

const returnOneObject = async (file, absDir, filePropertiesReader) => {
  try {
    let returnObj = await filePropertiesReader(file);

    return returnObj;
  } catch (error) {
    console.log(`error with ${file}: ${error.message}`);
  }
};

const fdirQuery = async (dir, dirsIncluded = false) => {
  let absDir = path.resolve(dir);
  let files = new fdir().withFullPaths().crawl(absDir);
  if (dirsIncluded) {
    files = files.withDirs();
  }
  files = await files.withPromise();
  return files;
};

async function crawlOneDir(dir, crawlOptions) {
  let files = await fdirQuery(dir, crawlOptions.dir);

  console.log(`done crawling ${dir}. found ${files.length} files`);

  /*  let withHashes = [];
  let i = 0;
  const pushFile = async file => {
    withHashes.push(file);
  } */
  console.log(`reading files metadata`);

  let filePropertiesReader = filePropertiesReaderFactory(crawlOptions);
  for await (const file of files) {
    i++;
    let fileObj = await returnOneObject(file, absDir, filePropertiesReader);
    await pushFile(fileObj);
    if (i % 100 === 0) {
      console.log(`done with ${i}/${files.length} files`);
    }
  }

  return withHashes;
}

export default crawlOneDir;
