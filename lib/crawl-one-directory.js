import { fdir } from "fdir"
import path from "node:path"

import hash from "./crawl-operations/hash-file-xx3.js"
import stats from "./crawl-operations/stats.js"
import log from "./log2.js"

const crawlOperations = [
  {
    fn: async (object) => {
      object.baseName = path.basename(object.absolutePath)
      const parentDirectory = path.dirname(object.absolutePath)
      object.parentDir = parentDirectory
      object.relativePath = path.relative(parentDirectory, object.absolutePath)
      return object
    },
    name: "basePathInfo"
  },
  hash,
  stats
]

const arrayOfOperations = crawlOperations

//perform a number of operations on an array of files to get information about them
const allOperations = async (filePath) => {
  //instantiates the file object
  let fileObject = { absolutePath: path.resolve(filePath) }

  for await (const op of arrayOfOperations) {
    try {
      fileObject = await op.fn(fileObject)
    } catch (error) {
      console.log(
        `error with ${fileObject.absolutePath}: ${error.message} in ${op.name}`
      )
      return fileObject
    }
  }
  return fileObject
}

//Get an array of file paths in a directory
const fdirQuery = async (absoluteDirectory, directoriesIncluded = false) => {
  let files = new fdir().withFullPaths().crawl(absoluteDirectory)
  if (directoriesIncluded === true) {
    files = files.withDirs()
  }
  return await files.withPromise()
}

//Get array of paths, return array of objects with information about each file
const getAllFilesInformation = async (files) => {
  const returnedArray = []
  for await (const file of files) {
    const fileObject = await allOperations(file)
    await returnedArray.push(fileObject)
  }
  return returnedArray
}

async function crawlOneDirectory(directory) {
  //get an arrray of file paths
  const files = await fdirQuery(directory)
  log(
    `Got ${files.length} filenames in ${directory}. Now getting file information.`
  )

  return await getAllFilesInformation(files)
}

export default crawlOneDirectory
