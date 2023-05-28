import {fdir} from 'fdir';
import hash from './lib/hash-file-special-method.js';
import path from 'path';
import {createReadStream} from 'fs';
import hashFile from './lib/hash-file-xx3.js';

const makeRelative = (filePath, folder) => {
    return filePath.substring(filePath.indexOf(folder));
  };
  
  const returnOneObject = async (file, absDir) => {
    const hash = await hashFile(file);
    return {absolutePath: file, hash: hash, relativePath: makeRelative(file, absDir)};
  };
  
  async function crawlOneDir(dir) {
    let absDir = path.resolve(dir);
  
    const files = await new fdir().withFullPaths().crawl(dir).withPromise();
    const arrayHash = await createArrayHash(files);
    // console.log(files);
    // let withHashes = await Promise.all(files.map(returnOneObject));
    let withHashes = [];
    for await (const file of files) {
      let fileObj = await returnOneObject(file, absDir);
      withHashes.push(fileObj);
    }
  
    return withHashes;
  }