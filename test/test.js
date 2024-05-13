import folderDiff from "../lib/folder-diff.js"
import {
  createTestData,
  testParentFolder,
  tryToDeleteFolder
} from "./test-functions.js"
import { test } from "node:test";
import assert from "node:assert"

test("Flat directory with some unique files returns correctly", async (t) => {
  let {
    commonFiles,
    folderAPath,
    folderBPath,
    testParentFolder,
    uniqueFilesA,
    uniqueFilesB,
    tryToDeleteFolder
  } = await createTestData()

  let {allFiles, directory1AbsolutePath, directory2AbsolutePath} = await folderDiff(folderAPath, folderBPath)
  let folder1Files = allFiles.filter(
    (item) => item.parentDir === directory1AbsolutePath
  )
  let notInFolder2 = folder1Files.filter((item) => item.match === false)
  let stringOfOutput = notInFolder2.map((item) => item.baseName).sort().join("\n")

  let stringOfPredicted = uniqueFilesA.map((item) => item.name).sort().join("\n")
  
  assert.strictEqual(stringOfOutput, stringOfPredicted)
  await tryToDeleteFolder()
})
