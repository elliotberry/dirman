import assert from "node:assert"
import { promises as fs } from "node:fs"
import path from "node:path"
import { afterEach, describe, test } from "node:test"

import folderDiff from "../lib/folder-diff.js"
import {
  createTestData,
  folderAPath,
  folderBPath,
  runCli,
  tryToDeleteTestParentFolder,
  uniqueNames,
  writeTree
} from "./test-functions.js"

describe("tests", async () => {
  afterEach(async () => await tryToDeleteTestParentFolder())

  test("programmatic use: Should show unique files from the first directory", async () => {
    const { folderAPath, folderBPath, uniqueFilesA } = await createTestData()

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath
    )
    const stringOfOutput = uniqueNames(allFiles, directory1AbsolutePath).join(
      "\n"
    )

    const stringOfPredicted = uniqueFilesA
      .map((item) => item.name)
      .sort((left, right) => left.localeCompare(right))
      .join("\n")

    assert.strictEqual(stringOfOutput, stringOfPredicted)
  })

  test("Should show unique files from the second directory", async () => {
    const { folderAPath, folderBPath, uniqueFilesB } = await createTestData()

    const { allFiles, directory2AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath
    )
    const stringOfOutput = uniqueNames(allFiles, directory2AbsolutePath).join(
      "\n"
    )

    const stringOfPredicted = uniqueFilesB
      .map((item) => item.name)
      .sort((left, right) => left.localeCompare(right))
      .join("\n")

    assert.strictEqual(stringOfOutput, stringOfPredicted)
  })

  test("Should work the same when instantiated through the CLI", async () => {
    const { folderAPath, folderBPath, uniqueFilesA } = await createTestData()
    const { stdout } = await runCli([folderAPath, folderBPath])
    const stringOfOutput = stdout.trim()
    const stringOfPredicted = uniqueFilesA
      .map((item) => item.name)
      .sort((left, right) => left.localeCompare(right))
      .join("\n")
    assert.strictEqual(stringOfOutput, stringOfPredicted)
  })

  test("nested directories are included in unique paths", async () => {
    await writeTree(folderAPath, [
      { content: "shared", relativePath: "keep/shared.txt" },
      { content: "only-a", relativePath: "deep/nested/only-a.txt" }
    ])
    await writeTree(folderBPath, [
      { content: "shared", relativePath: "keep/shared.txt" }
    ])

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath
    )

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [
      path.join("deep", "nested", "only-a.txt")
    ])
  })

  test("content-set: same bytes with different names are not unique", async () => {
    await writeTree(folderAPath, [
      { content: "same-bytes", relativePath: "alpha.txt" }
    ])
    await writeTree(folderBPath, [
      { content: "same-bytes", relativePath: "beta.txt" }
    ])

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath
    )

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [])
  })

  test("content-set: unique bytes are unique", async () => {
    await writeTree(folderAPath, [
      { content: "left-only", relativePath: "alpha.txt" }
    ])
    await writeTree(folderBPath, [
      { content: "right-only", relativePath: "beta.txt" }
    ])

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath
    )

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [
      "alpha.txt"
    ])
  })

  test("--by path: same bytes with different names are unique", async () => {
    await writeTree(folderAPath, [
      { content: "same-bytes", relativePath: "alpha.txt" }
    ])
    await writeTree(folderBPath, [
      { content: "same-bytes", relativePath: "beta.txt" }
    ])

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath,
      ["hash"],
      "all",
      undefined,
      { by: "path" }
    )

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [
      "alpha.txt"
    ])
  })

  test("--by path: same path with different hash is unique", async () => {
    await writeTree(folderAPath, [
      { content: "left", relativePath: "same.txt" }
    ])
    await writeTree(folderBPath, [
      { content: "right", relativePath: "same.txt" }
    ])

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath,
      ["hash"],
      "all",
      undefined,
      { by: "path" }
    )

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [
      "same.txt"
    ])
  })

  test("--compare size matches files of equal length regardless of name", async () => {
    await writeTree(folderAPath, [{ content: "aaaa", relativePath: "a.txt" }])
    await writeTree(folderBPath, [{ content: "bbbb", relativePath: "b.txt" }])

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath,
      ["size"]
    )

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [])
  })

  test("--compare size treats different lengths as unique", async () => {
    await writeTree(folderAPath, [{ content: "aa", relativePath: "a.txt" }])
    await writeTree(folderBPath, [{ content: "bbbb", relativePath: "b.txt" }])

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath,
      ["size"]
    )

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [
      "a.txt"
    ])
  })

  test("--compare basename matches same names at different paths", async () => {
    await writeTree(folderAPath, [
      { content: "left", relativePath: "nested/same.txt" }
    ])
    await writeTree(folderBPath, [
      { content: "right", relativePath: "other/same.txt" }
    ])

    const { allFiles, directory1AbsolutePath } = await folderDiff(
      folderAPath,
      folderBPath,
      ["basename"]
    )

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [])
  })

  test("empty directory compared to a full one does not throw", async () => {
    await writeTree(folderAPath, [])
    await fs.mkdir(folderAPath, { recursive: true })
    await writeTree(folderBPath, [{ content: "only-b", relativePath: "b.txt" }])

    const { allFiles, directory1AbsolutePath, directory2AbsolutePath } =
      await folderDiff(folderAPath, folderBPath)

    assert.deepStrictEqual(uniqueNames(allFiles, directory1AbsolutePath), [])
    assert.deepStrictEqual(uniqueNames(allFiles, directory2AbsolutePath), [
      "b.txt"
    ])
  })

  test("CLI accepts comma-separated compare flags", async () => {
    await writeTree(folderAPath, [{ content: "aaaa", relativePath: "a.txt" }])
    await writeTree(folderBPath, [{ content: "aaaa", relativePath: "b.txt" }])

    const { stdout } = await runCli([
      folderAPath,
      folderBPath,
      "-c",
      "hash,size"
    ])
    assert.strictEqual(stdout.trim(), "")
  })

  test("CLI -m any matches when any selected predicate matches", async () => {
    await writeTree(folderAPath, [{ content: "aaaa", relativePath: "a.txt" }])
    await writeTree(folderBPath, [{ content: "bbbb", relativePath: "b.txt" }])

    const { stdout } = await runCli([
      folderAPath,
      folderBPath,
      "-c",
      "hash,size",
      "-m",
      "any"
    ])
    assert.strictEqual(stdout.trim(), "")
  })

  test("CLI --json reports both unique lists", async () => {
    await writeTree(folderAPath, [{ content: "left", relativePath: "a.txt" }])
    await writeTree(folderBPath, [{ content: "right", relativePath: "b.txt" }])

    const { stdout } = await runCli([folderAPath, folderBPath, "--json"])
    const report = JSON.parse(stdout)

    assert.deepStrictEqual(report.onlyIn1, ["a.txt"])
    assert.deepStrictEqual(report.onlyIn2, ["b.txt"])
    assert.strictEqual(report.by, "content")
    assert.deepStrictEqual(report.compare, ["hash"])
  })

  test("CLI --only 2 prints unique files from directory 2", async () => {
    await writeTree(folderAPath, [{ content: "left", relativePath: "a.txt" }])
    await writeTree(folderBPath, [{ content: "right", relativePath: "b.txt" }])

    const { stdout } = await runCli([folderAPath, folderBPath, "--only", "2"])
    assert.strictEqual(stdout.trim(), "b.txt")
  })

  test("CLI --only both prints labeled sections", async () => {
    await writeTree(folderAPath, [{ content: "left", relativePath: "a.txt" }])
    await writeTree(folderBPath, [{ content: "right", relativePath: "b.txt" }])

    const { stdout } = await runCli([
      folderAPath,
      folderBPath,
      "--only",
      "both"
    ])
    assert.match(stdout, /Only in directory 1:\n(?:.*\n)?a\.txt/)
    assert.match(stdout, /Only in directory 2:\n(?:.*\n)?b\.txt/)
  })

  test("CLI --ignore skips matching files", async () => {
    await writeTree(folderAPath, [
      { content: "keep-a", relativePath: "keep.txt" },
      { content: "skip-a", relativePath: "skip.tmp" }
    ])
    await writeTree(folderBPath, [
      { content: "keep-b", relativePath: "keep.txt" }
    ])

    const { stdout } = await runCli([
      folderAPath,
      folderBPath,
      "--ignore",
      "*.tmp"
    ])
    assert.strictEqual(stdout.trim(), "keep.txt")
    assert.doesNotMatch(stdout, /skip\.tmp/)
  })
})
