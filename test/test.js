import assert from "node:assert"
import { afterEach, describe, test } from "node:test"

import folderDiff from "../lib/folder-diff.js"
import { createTestData, execa, tryToDeleteFolder } from "./test-functions.js"

process.env.VERBOSE = "true"

describe("tests", async () => {
  afterEach(async () => await tryToDeleteFolder())

  test("programmatic use: Should show unique files from the first directory", async () => {
    let {
      folderAPath,
      folderBPath,

      uniqueFilesA
    } = await createTestData()

    let { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath
    )
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
  test("Should show unique files from the second directory", async () => {
    let { folderAPath, folderBPath, uniqueFilesB } = await createTestData()

    let { allFiles, directory2AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath
    )
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

  test("Should work the same when instantiated through the CLI", async () => {
    let { folderAPath, folderBPath, uniqueFilesA } = await createTestData()
    let stdout = await execa(`node index.js ${folderAPath} ${folderBPath}`)
    console.log(stdout)
    let stringOfOutput = stdout.trim()
    let stringOfPredicted = uniqueFilesA
      .map((item) => item.name)
      .sort()
      .join("\n")
    assert.strictEqual(stringOfOutput, stringOfPredicted)
  })
})
