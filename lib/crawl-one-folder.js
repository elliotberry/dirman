import { fdir } from "fdir"
import path from "node:path"

import { crawlOperations } from "./crawl-operations/crawl-operations.js"

const basePathInfo = {
  fn: async (object) => {
    object.baseName = path.basename(object.absolutePath)
    let parentDirectory = path.dirname(object.absolutePath)
    object.parentDir = parentDirectory
    object.relativePath = path.relative(parentDirectory, object.absolutePath)
    return object
  },
  name: "basePathInfo"
}

let arrayOfOperations = [basePathInfo, ...crawlOperations]

//perform a number of operations on an array of files to get information about them
const allOperations = async (filePath) => {
  let fileObject = { absolutePath: path.resolve(filePath) }

  for await (const op of arrayOfOperations) {
    try {
      fileObject = await op.fn(fileObject)
    } catch (error) {
      console.log(`error with ${fileObject.absolutePath}: ${error.message}`)
      return fileObject
    }
  }
  return fileObject
}

const returnOneObject = async (file) => {
  try {
    return await allOperations(file)
  } catch (error) {
    console.log(`error with ${file}: ${error.message}`)
    return null
  }
}

const fdirQuery = async (absoluteDirectory, directoriesIncluded = false) => {
  let files = new fdir().withFullPaths().crawl(absoluteDirectory)
  if (directoriesIncluded === true) {
    files = files.withDirs()
  }
  let fileOutput = await files.withPromise()
  return fileOutput
}

const getAllFilesInformation = async (files) => {
  let returnedArray = []
  for await (const file of files) {
    let fileObject = await returnOneObject(file)
    await returnedArray.push(fileObject)
  }
  return returnedArray
}

async function crawlOneDirectory(directory) {
  let files = await fdirQuery(directory)

  let returnedArray = await getAllFilesInformation(files)

  return returnedArray
}

export default crawlOneDirectory
