import fs from "node:fs/promises"
import path from "node:path"

import exists from "./exists.js"

async function checkIfDirectory(path) {
  try {
    const stat = await fs.stat(path)
    return stat.isDirectory()
  } catch (error) {
    console.error("Error checking the path:", error)
    return false
  }
}

let checkDirectoryArgument = async (thePath) => {
  if (!thePath) {
    throw new Error("Path is not defined")
  }
  if (typeof thePath !== "string") {
    throw new TypeError("Path is not a string")
  }
  let directoryExists = await exists(thePath)
  if (!directoryExists) {
    throw new Error("Path is not a directory")
  }
  let isDirectory = await checkIfDirectory(thePath)
  if (!isDirectory) {
    throw new Error("Path is not a directory")
  }
  return path.resolve(thePath)
}

export default checkDirectoryArgument
