import {fdir} from 'fdir';
import path from 'path';
import {stat, open} from 'node:fs/promises';
import hash from './hash-file-xx3.js';

const size = async filePath => {
  try {
    let j = await stat(filePath);

    return j.size;
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return 0;
  }
};

const allTheStats = async filePath => {
  try {
    let j = await stat(filePath);
    let k = await open(filePath);
    return {
      size: j.size,
      mtime: j.mtimeMs,
      ctime: j.ctimeMs,
      birthtime: j.birthtimeMs,
  
    };
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return 0;
  }
};

const filePropertiesReaderFactory = crawlOptions => {
  let arrayOfCompareFns = [];
  if (crawlOptions.hash) {
    arrayOfCompareFns.push(hash);
  }
  if (crawlOptions.size) {
    arrayOfCompareFns.push(size);
  }

  return arrayOfCompareFns;
};

const returnOneObject = async (file, absDir, filePropertiesReader) => {
  try {
    let returnObj = {};
    for await (const fn of filePropertiesReader) {
      returnObj[fn.name] = await fn(file);
    }
    returnObj.absolutePath = file;
    returnObj.relativePath = file.split(absDir)[1];
    returnObj.basename = path.basename(file);
    return returnObj;
  } catch (error) {
    console.log(`error with ${file}: ${error.message}`);
  }
};

async function crawlOneDir(dir, crawlOptions) {
  let absDir = path.resolve(dir);

  const files = await new fdir().withFullPaths().crawl(absDir).withPromise();
  console.log(`done crawling ${dir}. found ${files.length} files`);

  let filePropertiesReader = filePropertiesReaderFactory(crawlOptions);
  let withHashes = [];
  let i = 0;

  console.log(`reading files metadata`);
  for await (const file of files) {
    i++;
    let fileObj = await returnOneObject(file, absDir, filePropertiesReader);
    withHashes.push(fileObj);
    if (i % 100 === 0) {
      console.log(`done with ${i}/${files.length} files`);
    }
  }

  return withHashes;
}

export default crawlOneDir;
