import { execFile } from "node:child_process"
import { randomBytes } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"
import { promisify } from "node:util"

import __dirname from "../lib/dirname.js"

const execFileAsync = promisify(execFile)

const testParentFolder = path.resolve(
  path.join(__dirname, "test", "test-files")
)
const folderAPath = path.resolve(path.join(testParentFolder, "a"))
const folderBPath = path.resolve(path.join(testParentFolder, "b"))
const cliPath = path.join(__dirname, "index.js")

const runCli = async (arguments_, extraEnvironment = {}) => {
  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    [cliPath, ...arguments_],
    {
      cwd: __dirname,
      env: {
        ...process.env,
        CI: "true",
        VERBOSE: "false",
        ...extraEnvironment
      }
    }
  )

  return { stderr, stdout }
}

const createRandomFileName = (suffix = "") => {
  const suffixText = suffix ? `${suffix}-` : ""
  return `${suffixText}${randomBytes(6).toString("hex")}.txt`
}

const createRandomContent = (size = 20) => randomBytes(size).toString("hex")

const createRandomFile = (suffix = "", size = 20) => {
  return {
    content: createRandomContent(size),
    name: createRandomFileName(suffix)
  }
}

const writeTree = async (folderName, files) => {
  await fs.mkdir(folderName, { recursive: true })
  for (const file of files) {
    const relativePath = file.relativePath ?? file.name
    const fullPath = path.join(folderName, relativePath)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, file.content)
  }
}

async function tryToDeleteTestParentFolder() {
  try {
    await fs.rm(testParentFolder, { recursive: true, force: true })
  } catch {
    // Directory may not exist yet.
  }
}

const createSomeFiles = async () => {
  return Array.from({ length: 5 }, function () {
    return createRandomFile("unique", 200)
  })
}

const createTestData = async () => {
  await tryToDeleteTestParentFolder()
  await fs.mkdir(testParentFolder, { recursive: true })
  const commonFiles = Array.from({ length: 5 }, function () {
    return createRandomFile("common")
  })
  const uniqueFilesA = await createSomeFiles()
  const uniqueFilesB = await createSomeFiles()
  const filesA = [...commonFiles, ...uniqueFilesA]
  const filesB = [...commonFiles, ...uniqueFilesB]
  await writeTree(folderAPath, filesA)
  await writeTree(folderBPath, filesB)

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
  await createTestData()
  console.log("Test data generated")
}
if (process.argv.join(" ").includes("remove")) {
  await tryToDeleteTestParentFolder()
  console.log("Test data removed")
}

const makeParentDirectory = async () => {
  await fs.mkdir(testParentFolder, { recursive: true })
}

const uniqueNames = (files, rootDirectory) =>
  files
    .filter(
      (item) => item.rootDirectory === rootDirectory && item.match === false
    )
    .map((item) => item.relativePathFromRoot)
    .sort((left, right) => left.localeCompare(right))

export {
  createRandomContent,
  createRandomFileName,
  createTestData,
  folderAPath,
  folderBPath,
  makeParentDirectory,
  runCli,
  testParentFolder,
  tryToDeleteTestParentFolder,
  uniqueNames,
  writeTree
}
