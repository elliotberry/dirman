import assert from "node:assert"
import { afterEach, beforeEach, describe, it, test } from "node:test"

import folderDiff from "../lib/folder-diff.js"
import {
  createTestData,
  testParentFolder,
  tryToDeleteFolder
} from "./test-functions.js"

describe("tests", async () => {
  afterEach(async () => await tryToDeleteFolder())

  it("Should show unique files from the first directory", async () => {
    let {
      commonFiles,
      folderAPath,
      folderBPath,
      testParentFolder,
      uniqueFilesA,
      uniqueFilesB
    } = await createTestData()
    console.log(folderAPath, folderBPath)
    let { allFiles, directory1AbsolutePath, directory2AbsolutePath } =
      await folderDiff(folderAPath, folderBPath)
    let folder1Files = allFiles.filter(
      (item) => item.parentDir === directory1AbsolutePath
    )
    let notInFolder2 = folder1Files.filter((item) => item.match === false)
    let stringOfOutput = notInFolder2
      .map((item) => item.baseName)
      .sort()
      .join("\n")

    let stringOfPredicted = uniqueFilesA
      .map((item) => item.name)
      .sort()
      .join("\n")

    assert.strictEqual(stringOfOutput, stringOfPredicted)
  })
  it("Should show unique files from the second directory", async () => {
    let {
      commonFiles,
      folderAPath,
      folderBPath,
      testParentFolder,
      uniqueFilesA,
      uniqueFilesB
    } = await createTestData()

    let { allFiles, directory1AbsolutePath, directory2AbsolutePath } =
      await folderDiff(folderAPath, folderBPath)
    let folder2Files = allFiles.filter(
      (item) => item.parentDir === directory2AbsolutePath
    )
    let notInFolder1 = folder2Files.filter((item) => item.match === false)
    let stringOfOutput = notInFolder1
      .map((item) => item.baseName)
      .sort()
      .join("\n")

    let stringOfPredicted = uniqueFilesB
      .map((item) => item.name)
      .sort()
      .join("\n")

    assert.strictEqual(stringOfOutput, stringOfPredicted)
  })
})
