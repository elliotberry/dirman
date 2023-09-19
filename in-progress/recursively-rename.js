const recursivelyRename = async (dir, name, n = 0) => {
  try {
    let baseFileName = name;
    if (n > 0) {
      let theBase = path.parse(baseFileName);
      baseFileName = `${theBase.name}-${n}${theBase.ext}`;
    }
    let fullPath = path.join(dir, baseFileName);

    if (fs.existsSync(fullPath)) {
      return await recursivelyRename(dir, name, n++);
    } else {
      return fullPath;
    }
  } catch (err) {
    log.error(`error with recursivelyRename: ${err}`);
  }
};