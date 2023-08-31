import {fdir} from 'fdir';
import path from 'path';

import filePropertiesReaderFactory from './file-properties-reader.js';

var fileReader = null;

const returnOneObject = async file => {
  try {
    let returnObj = await fileReader(file);

    return returnObj;
  } catch (error) {
    console.log(`error with ${file}: ${error.message}`);
    return null;
  }
};

const fdirQuery = async (absDir, dirsIncluded = false) => {
  let files = new fdir().withFullPaths().crawl(absDir);
  if (dirsIncluded) {
    files = files.withDirs();
  }
  files = await files.withPromise();
  return files;
};

/*example options:
const crawlOptions = {
  hash: false,
  size: true,
  name: true,
  dirs: false,
  getBinaryStatus: false,
  getXattrs: false
};
*/

const getAllFilesInformation = async (files, onEmitFile) => {
  let i = 0;
  let returnedArray = [];
  let totalNumberOfFailures = 0;
  for await (const file of files) {
    i++;
    let fileObj = await returnOneObject(file);
    if (fileObj === null) {
      totalNumberOfFailures++;
      if (totalNumberOfFailures > 50) {
        console.log('WEVE FUCKED UP TOO MUCH');
        process.exit(1);
      }
    } else {
      if (onEmitFile !== null) {
        await onEmitFile(fileObj);
      } else {
        await returnedArray.push(fileObj);
      }
      if (i % 100 === 0) {
        console.log(`done with ${i}/${files.length} files`);
      }
    }
  }
  return returnedArray;
};
async function crawlOneDir(dir, crawlOptions, onEmitFile = null) {
  let absDir = path.resolve(dir);
  let files = await fdirQuery(absDir, crawlOptions.dir);

  console.log(`done crawling ${dir}. found ${files.length} files`);

  console.log(`reading files metadata`);

  fileReader = await filePropertiesReaderFactory(crawlOptions, absDir);
  let returnedArray = await getAllFilesInformation(files, onEmitFile);

  return returnedArray;
}

export default crawlOneDir;
