import { stat } from 'node:fs/promises';

/**
 * Returns an object containing various properties of a file at the given file path.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<Object>} - An object containing the size, mtime, ctime, and birthtime of the file.
 */
export const stats = async (filePath) => {
  try {
    let j = await stat(filePath);

    return {
      size: j.size,
      mtime: j.mtimeMs,
      ctime: j.ctimeMs,
      birthtime: j.birthtimeMs,
    };
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return 0;
  }
};
