const { fdir } = require("fdir");
//const yargs = require("yargs");
const moveFile = require("./move-file");
const path = require('path')
const fs = require("fs");
const getDirectory = async function (dirStr) {
  try {
    let dir = path.resolve(dirStr);
    if (fs.existsSync(dir)) {
      return dir;
    } else {
      throw new Error(`${dirStr} doesn't exist`);
    }
  } catch (e) {
    console.log(`Problem getting directory: ${e}`);
  }
};

const main = async function (srcPath, dest) {
  const srcPath = "./test/"; //yargs.argv[2];
  const dest = "/Users/eberry/Desktop/dest/";
  const theSrcPath = await getDirectory(srcPath);
  const theDestPath = await getDirectory(dest);
  const api = new fdir().withFullPaths().crawl(theSrcPath);

  const files = await api.sync();
  console.log(files)

  for await (file of files) {
    console.log(`${theDestPath}`)
    let newP = await moveFile(file, theDestPath);
    console.log(`moved ${file} to ${theDestPath}`)
  }
  
};
