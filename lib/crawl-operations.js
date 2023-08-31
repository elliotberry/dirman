import {stat, open} from 'node:fs/promises';
import hash from './hash-file-xx3.js';
import isBinary from './is-binary.js';
import getAllAttributes from './xattr.js';

/**
 * Returns the size of a file at the given file path.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<number>} - The size of the file in bytes.
 */
const size = async filePath => {
  try {
    let j = await stat(filePath);

    return j.size;
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return 0;
  }
};

/**
 * Returns an object containing various properties of a file at the given file path.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<Object>} - An object containing the size, mtime, ctime, and birthtime of the file.
 */
const stats = async filePath => {
  try {
    let j = await stat(filePath);
 
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

/*example options:
const crawlOptions = {
  hash: false,
  size: true,
  name: true,
  dirs: false,
  getBinaryStatus: false,
  getXattrs: false
};
*/
const crawlOperations = [
  {
    optionName: 'hash',
    keyName: 'hash',
    defaultValue: true,
    fn: hash,
  },
  {
    optionName: 'size',
    keyName: 'size',
    defaultValue: false,
    fn: size,
  },
  {
    optionName: 'stats',
    keyName: 'stats',
    defaultValue: true,
    fn: stats,
  },
  {
    optionName: 'getBinaryStatus',
    keyName: 'isBinary',
    defaultValue: true,
    fn: isBinary,
  },
  {
    optionName: 'getXattrs',
    keyName: 'xattrs',
    defaultValue: true,
    fn: getAllAttributes,
  },
  { 
    optionName: 'allTheStats',
    keyName: 'allTheStats',
    defaultValue: true,
    fn: allTheStats,

  }
];

let defaultCrawlOptions = Object.fromEntries(
    crawlOperations.map((operation) => {
        return [operation.optionName, operation.defaultValue];
    })
);
console.log(crawlOperations)
export {crawlOperations, defaultCrawlOptions};
