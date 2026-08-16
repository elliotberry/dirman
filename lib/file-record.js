import path from "node:path"

/**
 * @typedef {object} FileRecord
 * @property {string} absolutePath
 * @property {string} rootDirectory
 * @property {string} baseName
 * @property {string} parentDirectory
 * @property {string} relativePath
 * @property {string} relativePathFromRoot
 * @property {string} [hash]
 * @property {number} [size]
 * @property {boolean} [match]
 * @property {string} [matchedFile]
 * @property {string} [matchID]
 */

/**
 * @param {string} filePath
 * @param {string} rootDirectory
 * @returns {FileRecord}
 */
export const createFileRecord = (filePath, rootDirectory) => {
  const absolutePath = path.resolve(filePath)
  const parentDirectory = path.dirname(absolutePath)

  return {
    absolutePath,
    baseName: path.basename(absolutePath),
    parentDirectory,
    relativePath: path.relative(parentDirectory, absolutePath),
    relativePathFromRoot: path.relative(rootDirectory, absolutePath),
    rootDirectory
  }
}
