import fs from "node:fs/promises"
import path from "node:path"

export default async function checkDirectoryArgument(thePath, position = 1) {
  if (!thePath || thePath === "") {
    throw new Error(
      `Error validating input path: No path provided for folder ${position}`
    )
  }

  const trimmedPath = thePath.trim()

  try {
    const stat = await fs.stat(trimmedPath)
    if (!stat.isDirectory()) {
      throw new Error(`Path ${trimmedPath} is not a directory`)
    }

    return path.resolve(trimmedPath)
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Error validating input path: Path ${trimmedPath} does not appear to exist`
      )
    }

    throw new Error(`Error validating input path: ${error.message}`)
  }
}
