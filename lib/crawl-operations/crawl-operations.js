
import hash from './hash-file-xx3.js';
import isBinary from './is-binary.js';
import getAllAttributes from './xattrs.js';
import getExifInfo from './exif.js';
import stats from './stats.js';

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
  hash,
  isBinary,
  getAllAttributes,
  getExifInfo,
  stats
];

let defaultCrawlOptions = [];
crawlOperations.forEach(operation => {
  if (operation.defaultValue === true) {
    defaultCrawlOptions.push(operation.optionName);
  }
});

export {crawlOperations, defaultCrawlOptions};