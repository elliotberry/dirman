/**
 * Compares a file with a directory to find a match based on the provided comparer functions.
 * @param {Object} file1 - The file to compare.
 * @param {Array} dir2 - The directory to compare against.
 * @param {Array} comparer - An array of comparer functions to use for the comparison.
 * @returns {Promise} A promise that resolves with the file object with a match property indicating if a match was found.
 */
const findMatch = function (file1, dir2, comparer) {
  try {
    let compareFn = (f1, f2) => {
      let ret;
      for (const fn of comparer) {
        ret = fn(f1, f2);
        if (!ret) {
          ret = false;
          break;
        }
      }
      return ret;
    };

    return new Promise(async (resolve, reject) => {
      let match = dir2.find(file2 => {
        return compareFn(file1, file2);
      });
      file1.match = match ? true : false;
      resolve(file1);
    });
  } catch (error) {
    console.log(`error with ${file1}: ${error.message}`);
  }
};

/**
 * Creates an array of comparer functions based on the provided compare options.
 * @param {Object} compareOptions - An object containing the compare options.
 * @param {boolean} compareOptions.hash - Whether to compare the hash of the files.
 * @param {boolean} compareOptions.size - Whether to compare the size of the files.
 * @param {boolean} compareOptions.name - Whether to compare the basename of the files.
 * @returns {Array} An array of comparer functions.
 */
const comparisonFactory = (compareOptions) => {

  let fns = [];
  if (compareOptions.hash) {
    fns.push(function (file1, file2) {
      return file1.hash === file2.hash;
    });
  }
  if (compareOptions.size) {
    fns.push(function (file1, file2) {
      return file1.size === file2.size;
    });
  }
  if (compareOptions.name) {
    fns.push(function (file1, file2) {
      return file1.basename === file2.basename;
    });
  }
  return fns;
};

/**
 * Finds conflicts between two directories based on the provided compare options.
 * @param {Array} dir1 - The first directory to compare.
 * @param {Array} dir2 - The second directory to compare.
 * @param {Object} compareOptions - An object containing the compare options.
 * @param {boolean} compareOptions.hash - Whether to compare the hash of the files.
 * @param {boolean} compareOptions.size - Whether to compare the size of the files.
 * @param {boolean} compareOptions.name - Whether to compare the basename of the files.
 * @returns {Object} An object containing two arrays: isInTargetFolder and isNotInTargetFolder.
 */
const findConflicts = async (dir1, dir2, compareOptions) => {
  if (!Array.isArray(dir1) || !Array.isArray(dir2)) {
    throw new Error('dir1 and dir2 must be arrays');
  }
  let comparer = comparisonFactory(compareOptions);
  let matchingResults = await Promise.all(dir1.map(file1 => findMatch(file1, dir2, comparer)));
  const isNotInTargetFolder = matchingResults.filter(file => !file.match);
  const isInTargetFolder = matchingResults.filter(file => file.match);

  return {isInTargetFolder, isNotInTargetFolder};
};

export default findConflicts;
