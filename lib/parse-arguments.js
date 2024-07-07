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

const checkDirectoryArgument = async (thePath, position=1) => {
  try {
    if (!thePath || thePath === "") {
      throw new Error(`No path provided for folder ${position}`)
    }

    thePath = thePath.trim()
    const directoryExists = await exists(thePath)
    if (!directoryExists) {
      throw new Error(`Path ${thePath} does not appear to exist`)
    }
    const isDirectory = await checkIfDirectory(thePath)
    if (!isDirectory) {
      throw new Error(`Path ${thePath} is not a directory`)
    }
    return path.resolve(thePath)
  } catch (error) {
    throw new Error(`Error validating input path: ${error.message}`)
  }
}

export default checkDirectoryArgument
