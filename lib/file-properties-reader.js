import path from 'path';
import {crawlOperations} from './crawl-operations.js';

/**
 * Returns a function that reads the properties of a file at a given file path.
 * @param {Object} crawlOptions - An object containing options for crawling the file system.
 * @param {boolean} crawlOptions.hash - Whether or not to include the file's hash in the returned object.
 * @param {boolean} crawlOptions.size - Whether or not to include the file's size in the returned object.
 * @returns {Function} - A function that reads the properties of a file at a given file path.
 */


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




const filePropertiesReaderFactory = async (crawlOptions, parentDir) => {
  try {

    console.log(crawlOperations)
    let arrayOfOperations = crawlOperations.filter((operation) => {
      if (crawlOptions[operation.name] === true) {
        return false
      }
      else {
        return true
      }
    });
   console.log(arrayOfOperations)
    
    /**
     * Reads the properties of a file at a given file path.
     * @param {string} filePath - The path to the file.
     * @returns {Promise<Object>} - An object containing the properties of the file.
     */
    const fileReader = async (filePath) => {
      let returnObj = {};
      returnObj.absolutePath = filePath;
      returnObj.ext = path.extname(filePath);
      returnObj.relativePath = filePath.split(parentDir)[1];
      returnObj.basename = path.basename(filePath);
      for await (const op of arrayOfOperations) {
        returnObj[op.name] = await op.fn(returnObj.absolutePath);
      }
  
      return returnObj;
    };

    return fileReader;
  } catch (e) {
    console.log(`error creating filepropsreader: ${e}`);
  }
};

export default filePropertiesReaderFactory;
