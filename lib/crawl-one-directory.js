import path from "node:path"

import { fdir } from "fdir"

import hash from "./crawl-operations/hash-file-xx3.js"
import stats from "./crawl-operations/stats.js"
import log from "./log.js"

const crawlOperations = [
  {
    fn: async (object) => {
      const absolutePath = object.absolutePath
      const parentDirectory = path.dirname(absolutePath)
      return {
        ...object,
        baseName: path.basename(absolutePath),
        parentDir: parentDirectory,
        relativePath: path.relative(parentDirectory, absolutePath)
      }
    },
    name: "basePathInfo"
  },
  hash,
  stats
]

const allOperations = async (filePath) => {
  let fileObject = { absolutePath: path.resolve(filePath) }

  for (const op of crawlOperations) {
    try {
      fileObject = await op.fn(fileObject)
    } catch (error) {
      console.error(
        `Error with ${fileObject.absolutePath}: ${error.message} in ${op.name}`
      )
      break
    }
  }

  return fileObject
}

const fdirQuery = async (absoluteDirectory, directoriesIncluded = false) => {
  const files = new fdir().withFullPaths().crawl(absoluteDirectory)
  return await files.withPromise(
    directoriesIncluded ? { includeDirs: true } : {}
  )
}

const getAllFilesInformation = async (files) => {
  log(`Getting file information for ${files.length} files...`)
  const returnedArray = []

  for (const file of files) {
    const fileObject = await allOperations(file)
    returnedArray.push(fileObject)
  }

  return returnedArray
}

const crawlOneDirectory = async (directory) => {
  const files = await fdirQuery(directory)
  log(`Got ${files.length} filenames in ${directory}.`)
  if (files.length === 0) {
    throw new Error(`No files found in ${directory}`)
  }
  return await getAllFilesInformation(files)
}

export default crawlOneDirectory
