
import __dirname from '../lib/__dirname.js';
import folderDiff from '../lib/folder-diff.js';
import {createTestData, tryToDeleteFolder} from './test-functions.js';
import {execa} from './execa.js';

const main = async () => {
  let { testParentFolder, folderAPath, folderBPath, commonFiles, uniqueFilesA, uniqueFilesB } = await createTestData();
 
  
  let comparedInfo = await folderDiff(folderAPath, folderBPath);
  /*let r = comparedInfo.isNotInDir2.map(item => {
    return item.relativePath;
  }) */

  //const matches = comparedInfo.filter(item => item.match === true);
  console.log(comparedInfo);
  console.log("------");
// console.log(uniqueFilesA.map(item => item.name));
 //await tryToDeleteFolder();
};
main()
