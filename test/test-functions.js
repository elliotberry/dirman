#!/usr/bin/env node
import { randomBytes } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"

import __dirname from "../lib/dirname.js"
import { exec } from "node:child_process"

const execa = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        throw new Error(error || stderr)
      }
      resolve(stdout)
    })
  })
}

const testParentFolder = path.resolve(
  path.join(__dirname, "test", "test-files")
)
const folderAPath = path.resolve(path.join(testParentFolder, "a"))
const folderBPath = path.resolve(path.join(testParentFolder, "b"))

const createRandomFileName = (suffix = "") =>
  `${suffix}-${randomBytes(6).toString("hex")}.txt`
const createRandomContent = () => randomBytes(20).toString("hex")
const createRandomFile = (suffix = "") => {
  return { content: createRandomContent(), name: createRandomFileName(suffix) }
}

String.prototype.del = function (s) {
  return this.split(s).join("")
}

async function createFolderWithFiles(folderName, files) {
  await fs.mkdir(folderName, { recursive: true })
  for await (const file of files) {
    await fs.writeFile(`${folderName}/${file.name}`, file.content)
  }
}

async function tryToDeleteFolder() {
  //delete test if exists
  try {
    await fs.rm(testParentFolder, { recursive: true })
  } catch {
    // Handle error if needed
  }
}

const createTestData = async () => {
  await tryToDeleteFolder(testParentFolder)
  await fs.mkdir(testParentFolder, { recursive: true })
  const commonFiles = Array.from({ length: 5 }, function () {
    return createRandomFile("common")
  })
  const uniqueFilesA = Array.from({ length: 5 }, function () {
    return createRandomFile("unique")
  })
  const uniqueFilesB = Array.from({ length: 5 }, function () {
    return createRandomFile("unique")
  })
  let filesA = [...commonFiles, ...uniqueFilesA]
  let filesB = [...commonFiles, ...uniqueFilesB]
  await createFolderWithFiles(folderAPath, filesA)
  await createFolderWithFiles(folderBPath, filesB)

  return {
    commonFiles,
    folderAPath,
    folderBPath,
    testParentFolder,
    uniqueFilesA,
    uniqueFilesB
  }
}

if (process.argv.join(" ").includes("generate")) {
  createTestData()
  console.log("Test data generated")
}
if (process.argv.join(" ").includes("remove")) {
  tryToDeleteFolder()
  console.log("Test data removed")
}

export {
  createRandomContent,
  createRandomFileName,
  createTestData,
  folderAPath,
  folderBPath,
  testParentFolder,
  tryToDeleteFolder,
  execa
}
