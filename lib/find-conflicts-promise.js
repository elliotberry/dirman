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
export default findConflicts
