
import hash from './hash-file-xx3.js';
import isBinary from './is-binary.js';
import getAllAttributes from './xattrs.js';
import getExifInfo from './exif.js';
import stats from './stats.js';

const crawlOperations = [
  hash,
  isBinary,
  getAllAttributes,
  getExifInfo,
  stats
];
/*
let defaultCrawlOptions = [];
crawlOperations.forEach(operation => {
  if (operation.defaultValue === true) {
    defaultCrawlOptions.push(operation.optionName);
  }
});
*/

const defaultCrawlOptions = {
  hash: true,
  stats: true,

  dirs: false,
  getBinaryStatus: false,
  getXattrs: false
};
export {crawlOperations, defaultCrawlOptions};
