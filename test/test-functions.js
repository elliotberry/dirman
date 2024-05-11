import { randomBytes } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"

import __dirname from "../lib/__dirname.js"

const testParentFolder = path.join(__dirname, "test", "test-files")
const folderAPath = path.resolve(path.join(testParentFolder, "a"))
const folderBPath = path.resolve(path.join(testParentFolder, "b"))

const createRandomFileName = () => randomBytes(6).toString("hex") + ".txt"
const createRandomContent = () => randomBytes(20).toString("hex")
const createRandomFile = () => {
  return { content: createRandomContent(), name: createRandomFileName() }
}
String.prototype.del = function (s) {
  return this.split(s).join("")
}

async function createFolderWithFiles(folderName, commonFiles, uniqueFiles) {
  await fs.mkdir(folderName, { recursive: true })
  for (const file of commonFiles) {
    await fs.writeFile(`${folderName}/common-${file.name}`, file.content)
  }
  for (const file of uniqueFiles) {
    await fs.writeFile(`${folderName}/unique-${file.name}`, file.content)
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
  const commonFiles = Array.from({ length: 5 }, createRandomFile)
  const uniqueFilesA = Array.from({ length: 5 }, createRandomFile)
  const uniqueFilesB = Array.from({ length: 5 }, createRandomFile)

  await createFolderWithFiles(folderAPath, commonFiles, uniqueFilesA)
  await createFolderWithFiles(folderBPath, commonFiles, uniqueFilesB)

  return {
    commonFiles,
    folderAPath,
    folderBPath,
    testParentFolder,
    uniqueFilesA,
    uniqueFilesB
  }
}
export {
  createRandomContent,
  createRandomFileName,
  createTestData,
  folderAPath,
  folderBPath,
  testParentFolder,
  tryToDeleteFolder
}
