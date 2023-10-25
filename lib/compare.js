

const compareOperations = {
  hash: function (file1, file2) {
    return file1.hash === file2.hash;
  },
  size: function (file1, file2) {
    return file1.size === file2.size;
  },
  name: function (file1, file2) {
    return file1.basename === file2.basename;
  },
};

const comparisonFactory = compareOptions => {
  let fns = [];
  for (let option in compareOptions) {
    if (compareOptions[option] === true) {
      if (!compareOperations[option]) {
        throw new Error(`option ${option} is not a valid option`);
      }
      fns.push(compareOperations[option]);
    }
  }

  let compareOneToOne = async (file1, file2) => {
    let ret = true;
    let results = [];
    for await (const fn of fns) {
      let thisResult = await fn(file1, file2);
      if (!thisResult) {
        ret = false;
        break;
      }
    }
    return ret;
  };
  const compareOneToAll = async (file1, dir2) => {
    file1.match = false;
  for await (let dir2file of dir2) {
    let res = await compareOneToOne(file1, dir2file);
    if (res === true) {
      file1.match = true;
    }
    break;
  }
  return file1;
  };
  return {compareOneToOne, compareOneToAll};
};

let defaultCompareOptions = {
  hash: true,
  size: false,
  name: false
};

const compareDirectories = async (dir1FileArray, dir2FileArray, compareOptions) => {
  if (!compareOptions) {
    compareOptions = defaultCompareOptions;
  }
  if (!Array.isArray(dir1) || !Array.isArray(dir2)) {
    throw new Error('dir1 and dir2 must be arrays');
  }
  let {compareOneToAll} = comparisonFactory(compareOptions);
  let matchingResults = await Promise.all(dir1FileArray.map(file1 => compareOneToAll(file1, dir2FileArray)));
  const isNotInDir2 = matchingResults.filter(file => !file.match);
  const isInDir2 = matchingResults.filter(file => file.match);

  return {isInDir2, isNotInDir2};
};

export {defaultCompareOptions, compareDirectories};
