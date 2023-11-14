import path from 'path';
import {crawlOperations} from './crawl-operations/crawl-operations.js';

class FilePropertiesReader {
  constructor(filePropertiesReaderOptions, parentDir) {
    this.options = filePropertiesReaderOptions;
    this.parentDir = parentDir;
    this.arrayOfOperations = crawlOperations.filter((operation) => {
      if (this.options.includes([operation.optionName])) {
        return false
      }
      else {
        return true
      }
    });
    console.log(`file reader ops enabled: ${this.arrayOfOperations.map((e)=>e.optionName).join(', ')}`);

  }
  async basePathInfo(filePath) {
    let returnObj = {};
    returnObj.absolutePath = filePath;
    returnObj.ext = path.extname(filePath);
    returnObj.relativePath = filePath.split(this.parentDir)[1];
    returnObj.basename = path.basename(filePath);
    return returnObj;
  }
  async read(filePath) {
    let returnObj = {};
    let basePathInfo = await this.basePathInfo(filePath);
    returnObj = {...returnObj, ...basePathInfo};
    for await (const op of this.arrayOfOperations) {
      returnObj[op.keyName] = await op.fn(returnObj.absolutePath);
    }

    return returnObj;
  }
}

export default FilePropertiesReader;
