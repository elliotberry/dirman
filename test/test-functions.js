#!/usr/bin/env node
import { exec } from "node:child_process"
import { randomBytes } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"

import __dirname from "../lib/dirname.js"

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

const createRandomFileName = (suffix = "") => {
  let suffixText = suffix ? `${suffix}-` : ""
  return `${suffixText}${randomBytes(6).toString("hex")}.txt`
}
const createRandomContent = (size = 20) => randomBytes(size).toString("hex")
const createRandomFile = (suffix = "", size = 20) => {
  return {
    content: createRandomContent(size),
    name: createRandomFileName(suffix)
  }
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

async function tryToDeleteTestParentFolder() {
  //delete test if exists
  try {
    await fs.rm(testParentFolder, { recursive: true })
  } catch {
    // Handle error if needed
  }
}

const createSomeFiles = async (numberOfFiles, suffix = "") => {
  return Array.from({ length: numberOfFiles }, function () {
    return createRandomFile(suffix, 200)
  })
}

const createTestData = async () => {
  await tryToDeleteTestParentFolder(testParentFolder)
  await fs.mkdir(testParentFolder, { recursive: true })
  const commonFiles = Array.from({ length: 5 }, function () {
    return createRandomFile("common")
  })
  const uniqueFilesA = await createSomeFiles(5, "unique")
  const uniqueFilesB = await createSomeFiles(5, "unique")
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
  tryToDeleteTestParentFolder()
  console.log("Test data removed")
}
const makeParentDirectory = async () => {
  await fs.mkdir(testParentFolder, { recursive: true })
}
const createOneFile = async (suffix = "") => {
  const file = createRandomFile(suffix, 500_000)
  await fs.writeFile(`${testParentFolder}/${file.name}`, file.content)
  return path.resolve(`${testParentFolder}/${file.name}`)
}
export {
  createOneFile,
  createRandomContent,
  createRandomFileName,
  createTestData,
  execa,
  folderAPath,
  folderBPath,
  makeParentDirectory,
  testParentFolder,
  tryToDeleteTestParentFolder
}
