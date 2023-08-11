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

  const fileReader = async filePath => {
    let returnObj = {};
    for await (const fn of filePropertiesReader) {
      returnObj[fn.name] = await fn(filePath);
    }
    returnObj.absolutePath = file;
    returnObj.relativePath = file.split(absDir)[1];
    returnObj.basename = path.basename(file);
    return returnObj;
  };

  return fileReader;
};

export default filePropertiesReaderFactory;
