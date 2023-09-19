/**
 * Returns an array of objects representing directories and their files
 * @param {string} baseFolder - The base folder to start crawling from
 * @returns {Promise<Array<Object>>} - An array of objects representing directories and their files
 */
import {fdir} from 'fdir';
import path from 'path';
import getPathTags from './get-path-tags.js';


const createFileObj = async (obj) => {
 
    let newObj = {};
    newObj.relativePath = path.relative(baseAbsPath, obj.directory);
    newObj.absolutePath = obj.directory;
    newObj.basename = path.basename(obj.directory);
    newObj.tags = getPathTags(newObj.relativePath);
    newObj.files = obj.files.map(file => {
      let newFile = {};
      newFile.relativePath = path.relative(baseAbsPath, file);
      newFile.absolutePath = file;
      newFile.basename = path.basename(file);
      newFile.tags = getPathTags(newFile.relativePath);
      return newFile;
    });
    return newObj;
};

const getDirectories = async baseFolder => {
  let baseAbsPath = path.resolve(baseFolder);
  let baseRelPath = path.relative(baseAbsPath, baseFolder);

  let files = await new fdir().withFullPaths().group().crawl(baseFolder).withPromise();
  return files.map(createFileObj);
};

export default getDirectories;
