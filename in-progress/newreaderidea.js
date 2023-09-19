import path from 'path';
import {crawlOperations} from './file-data-functions/crawl-operations.js';
import {open} from 'node:fs/promises';

class File {
  constructor(filePath, parentDir) {
    this.filePath = filePath;
    this.parentDir = parentDir;
    getPathInfo();
  }
  getPathInfo() {
    this.ext = path.extname(this.filePath);
    this.basename = path.basename(this.filePath);
    this.absolutePath = filePath;
    this.relativePath = filePath.split(this.parentDir)[1];
  }
  returnObj() {
    return {
      absolutePath: this.absolutePath,
      relativePath: this.relativePath,
      basename: this.basename,
      ext: this.ext
    }
  }
}
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
  /**
   * Reads the properties of a file at a given file path.
   * @param {string} filePath - The path to the file.
   * @returns {Promise<Object>} - An object containing the properties of the file.
   */
  async read(filePath) {
   let thisFile = new File(filePath, this.parentDir);
    for await (const op of this.arrayOfOperations) {
      returnObj[op.keyName] = await op.fn(returnObj.absolutePath);
    }

    return returnObj;
  }
}

export default FilePropertiesReader;
