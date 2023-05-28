const findMatch = function (file1, dir2, compare={hash: false}) {
  return new Promise(async (resolve, reject) => {
    let match = dir2.find(file2 => {
      return file1.relativePath === file2.relativePath;
    });
    file1.match = match ? true : false;
    resolve(file1);
  });
};

const findConflictsPromise = async (dir1, dir2) => {
  if (!Array.isArray(dir1) || !Array.isArray(dir2)) {
    throw new Error('dir1 and dir2 must be arrays');
  }

  let matchingResults = await Promise.all(dir1.map(file1 => findMatch(file1, dir2)));
  const isNotInTargetFolder = matchingResults.filter(file => !file.match);
  const isInTargetFolder = matchingResults.filter(file => file.match);

  return {isInTargetFolder, isNotInTargetFolder};
};
export {findConflictsPromise as findConflicts};
