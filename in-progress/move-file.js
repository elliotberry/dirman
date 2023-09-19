const fs = require("fs/promises");
const ffs = require("fs");
const path = require("path");


const maxTries = 1000;

const makeFullFilePath = (src, dest) => {
  if (ffs.lstatSync(dest).isDirectory()) {
    const srcPath = path.parse(src);
    return `${dest}/${srcPath.base}`
  }
  else {
    return dest
  }
}


const loopThroughRenaming = async (potentialPath, attempt = 0) => {
  let appendedStr = attempt > 0 ? `--${attempt}` : ``
  let newPotentialPath = `${potentialPath}${appendedStr}`
  if (fs.existsSync(potentialPath)) {
    attempt++
    //file exists
  }

}

const makeDestPath = async (src, dest) => {
    const fullDestPath = await makeFullFilePath(src, dest)
    if (fs.existsSync(fullDestPath)) {
      //file exists
    }
 
}


const moveFile = async (src, dest, attempt = 0) => {

  try { 
    let fullDest = await makeDestPath(src, dest)
    await fs.copyFile(src, fullDest, ffs.constants.COPYFILE_EXCL); // By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
    return fullDest;
  } catch (e) {
    if (e.code === "EEXIST") {
      attempt++;
      const srcPath = path.parse(src);
      const destPath = path.parse(dest);
      let newAttemptName = `${srcPath.name}--${attempt}${srcPath.ext}`;
      let newAttemptPath = `${destPath.dir}/${newAttemptName}`;
      moveFile(src, newAttemptPath, attempt);
    }
    else {
    
        throw new Error(e)
    }
  }
};
module.exports = moveFile
