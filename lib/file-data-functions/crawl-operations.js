
import hash from './hash-file-xx3.js';
import isBinary from './is-binary.js';
import getAllAttributes from './xattr.js';
import getExifInfo from './exif.js';
import {stats} from './stats.js';

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
    optionName: 'exifInfo',
    keyName: 'exifInfo',
    defaultValue: false,
    fn: getExifInfo,
  },
  {
    optionName: 'hash',
    keyName: 'hash',
    defaultValue: true,
    fn: hash,
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
    optionName: 'xattrs',
    keyName: 'xattrs',
    defaultValue: true,
    fn: getAllAttributes,
  },
];

let defaultCrawlOptions = [];
crawlOperations.forEach(operation => {
  if (operation.defaultValue === true) {
    defaultCrawlOptions.push(operation.optionName);
  }
});

export {crawlOperations, defaultCrawlOptions};
