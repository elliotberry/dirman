import os from "node:os"
import path from "node:path"

import { fdir } from "fdir"

import hash from "./crawl-operations/hash-file-xx3.js"
import stats from "./crawl-operations/stats.js"
import { createFileRecord } from "./file-record.js"
import { directoryNameExcluded, shouldIgnorePath } from "./ignore.js"
import log from "./log.js"

export const defaultConcurrency = () => os.availableParallelism?.() ?? 8

const crawlOperations = (compareOptions) => {
  const selected = new Set(
    (compareOptions ?? ["hash"]).map((option) => option.toLowerCase())
  )
  const operations = []

  if (selected.has("hash")) {
    operations.push(hash)
  }

  if (selected.has("size")) {
    operations.push(stats)
  }

  return operations
}

const mapPool = async (items, concurrency, mapper) => {
  if (items.length === 0) {
    return []
  }

  const limit = Math.max(1, concurrency)
  const results = Array.from({ length: items.length })
  let nextIndex = 0

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await mapper(items[index], index)
    }
  }

  const workerCount = Math.min(limit, items.length)
  await Promise.all(Array.from({ length: workerCount }, worker))
  return results
}

const allOperations = async (filePath, rootDirectory, operations) => {
  let fileObject = createFileRecord(filePath, rootDirectory)

  for (const operation of operations) {
    try {
      fileObject = await operation.fn(fileObject)
    } catch (error) {
      console.error(
        `Error with ${fileObject.absolutePath}: ${error.message} in ${operation.name}`
      )
      break
    }
  }

  return fileObject
}

const fdirQuery = async (
  absoluteDirectory,
  { ignore = [], includeDirectories = false } = {}
) => {
  let builder = new fdir().withFullPaths()

  if (includeDirectories) {
    builder = builder.withDirs()
  }

  if (ignore.length > 0) {
    builder = builder
      .exclude((directoryName) => directoryNameExcluded(directoryName, ignore))
      .filter(
        (filePath, isDirectory) =>
          isDirectory || !shouldIgnorePath(filePath, absoluteDirectory, ignore)
      )
  }

  return await builder.crawl(absoluteDirectory).withPromise()
}

export default async function crawlOneDirectory(directory, options = {}) {
  const {
    compareOptions = ["hash"],
    concurrency = defaultConcurrency(),
    ignore = [],
    includeDirectories = false
  } = options

  const files = await fdirQuery(directory, {
    ignore,
    includeDirectories
  })
  log(`Got ${files.length} filenames in ${directory}.`)

  if (files.length === 0) {
    return []
  }

  const rootDirectory = path.resolve(directory)
  const operations = crawlOperations(compareOptions)
  log(`Getting file information for ${files.length} files...`)

  return await mapPool(files, concurrency, (file) =>
    allOperations(file, rootDirectory, operations)
  )
}
