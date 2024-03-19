import {fdir} from 'fdir';
import path from 'path';
import {crawlOperations} from './crawl-operations/crawl-operations.js';


const basePathInfo = {
  fn: async obj => {
    obj.baseName = path.basename(obj.absolutePath);
    let parentDir = path.dirname(obj.absolutePath);
    obj.parentDir = parentDir;
    obj.relativePath = path.relative(parentDir, obj.absolutePath);
    return obj;
  },
  name: 'basePathInfo',
};

let arrayOfOperations = [basePathInfo, ...crawlOperations];

//perform a number of operations on an array of files to get information about them
const allOperations = async filePath => {
  let fileObj = {absolutePath: path.resolve(filePath)};

  for await (const op of arrayOfOperations) {
    try {
      fileObj = await op.fn(fileObj);
    } catch (error) {
      console.log(`error with ${fileObj.absolutePath}: ${error.message}`);
      return fileObj;
    }
  }
  return fileObj;
};

const returnOneObject = async file => {
  try {
    return await allOperations(file);
  } catch (error) {
    console.log(`error with ${file}: ${error.message}`);
    return null;
  }
};

const fdirQuery = async (absDir, dirsIncluded = false) => {
  let files = new fdir().withFullPaths().crawl(absDir);
  if (dirsIncluded === true) {
    files = files.withDirs();
  }
  files = await files.withPromise();
  return files;
};

const getAllFilesInformation = async files => {
  let returnedArray = [];

  for await (const file of files) {
    let fileObj = await returnOneObject(file);
    await returnedArray.push(fileObj);
  }
  return returnedArray;
};

async function crawlOneDir(dir) {
  console.log(`crawling ${dir}`);
  let files = await fdirQuery(dir);

  let returnedArray = await getAllFilesInformation(files);

  return returnedArray;
}

export default crawlOneDir;
