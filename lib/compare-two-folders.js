const hasMatchingHash = (file1, dir2) => {
  let match = dir2.find((file2) => {
    return file1.hash === file2.hash;
  });

  return match === undefined ? false : true;
};

const compareTwoFolders = async (dir1, dir2) => {
  let isInTargetFolder = [];
  let isNotInTargetFolder = [];
  for await (const file1 of dir1) {
    //try to find file in dir2 that matches relative path and hash
    let match = hasMatchingHash(file1, dir2);

    if (match) {
      //if match, add to isInTargetFolder
      isInTargetFolder.push(file1);
    } else {
      isNotInTargetFolder.push(file1);
    }
  }
  return { isInTargetFolder, isNotInTargetFolder };
};

export default compareTwoFolders;
