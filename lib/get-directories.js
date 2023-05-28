import {fdir} from 'fdir';
import path from 'path';

const getPathTags = relativePath => {
  return relativePath
    .split(path.sep)
    .map(tag => tag.toLowerCase().trim())
    .filter(tag => tag.length > 0);
};
const getDirectories = async baseFolder => {
  let baseAbsPath = path.resolve(baseFolder);
  let baseRelPath = path.relative(baseAbsPath, baseFolder);

  let files = await new fdir().withFullPaths().group().crawl(baseFolder).withPromise();
  return files.map(obj => {
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
  });
};

export default getDirectories;
