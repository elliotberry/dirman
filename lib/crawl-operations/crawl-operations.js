import hash from "./hash-file-xx3.js"

import stats from "./stats.js"

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
const crawlOperations = [hash, stats]

//let defaultCrawlOptions = crawlOperations;
/*
crawlOperations.forEach(operation => {
  if (operation.defaultValue === true) {
    defaultCrawlOptions.push(operation.optionName);
  }
});
*/
export { crawlOperations }
