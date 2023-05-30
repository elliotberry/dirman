import {fdir} from 'fdir';
import path from 'path';
import {stat,  open} from 'node:fs/promises';
import hash from './hash-file-xx3.js';

const size = async filePath => {
  try {
  const file = await open(filePath);
  return await stat().size;
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return 0;
  }
};

const comparerFactory = (compareOptions) => {
  let arrayOfCompareFns = [];
  if (compareOptions.hash) {
    arrayOfCompareFns.push(hash);
  }
  if (compareOptions.size) {
    arrayOfCompareFns.push(size);
  }
 
  return arrayOfCompareFns;
};



const returnOneObject = async (file, absDir, comparer) => {
  try {
    let returnObj = {};
    for await (const fn of comparer) {
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

async function crawlOneDir(dir, compareOptions) {
  let absDir = path.resolve(dir);
 
  const files = await new fdir().withFullPaths().crawl(absDir).withPromise();
  let comparer = comparerFactory(compareOptions);
  let withHashes = [];
  for await (const file of files) {
    let fileObj = await returnOneObject(file, absDir, comparer);
    withHashes.push(fileObj);
  }

  return withHashes;
}

export default crawlOneDir;
