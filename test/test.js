
import __dirname from '../lib/__dirname.js';
import folderDiff from '../lib/folder-diff.js';
import {createTestData, tryToDeleteFolder} from './test-functions.js';

const main = async () => {
  let { folderAPath, folderBPath, commonFiles, uniqueFilesA, uniqueFilesB } = await createTestData();
  console.log(folderAPath);
  console.log(folderBPath);
  
  let comparedInfo = await folderDiff(folderAPath, folderBPath);
  let r = comparedInfo.isNotInDir2.map(item => {
    return item.relativePath;
  })
  console.log(r);
  console.log("------");
  console.log(uniqueFilesA.map(item => item.name));
 await tryToDeleteFolder();
};
main()
