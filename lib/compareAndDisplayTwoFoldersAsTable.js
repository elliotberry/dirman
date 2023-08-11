const compareAndDisplayTwoFoldersAsTable = (compared) => {
  display(compared.isNotInTargetFolder.map(file => {
    let newObject = {
      path: file.relativePath
    }
    if (file.hash) {
      newObject.hash = file.hash;
    }
    if (file.size) {
      newObject.size = file.size;
    }
    return newObject;
  }));
}

export default compareAndDisplayTwoFoldersAsTable;