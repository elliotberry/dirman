
import folderDiff from "../lib/folder-diff.js"
import {
  createTestData,
  testParentFolder,
  tryToDeleteFolder
} from "./test-functions.js"

const main = async () => {
 
   let {
    commonFiles,
    folderAPath,
    folderBPath,
    testParentFolder,
    uniqueFilesA,
    uniqueFilesB
  } = await createTestData()

  let { allFiles } = await folderDiff(folderAPath, folderBPath)
  let folder1Files = allFiles.filter((item) => item.parentDir === folderAPath)
  let notInFolder2 = folder1Files.filter((item) => item.match === false)
  //const matches = comparedInfo.filter(item => item.match === true);
  console.log("------")
  console.log("notInFolder2")
  console.log(notInFolder2.map((item) => item.baseName).join("\n"))
  console.log("------")
  // console.log(uniqueFilesA.map(item => item.name));
  //await tryToDeleteFolder(); */
}
main()
