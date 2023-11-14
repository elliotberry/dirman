import {fdir} from 'fdir';
import path from 'path';
import {defaultCrawlOptions} from './crawl-operations/crawl-operations.js';

import filePropertiesReaderFactory from './file-properties-reader.js';

var fileReader = null;

const returnOneObject = async file => {
  try {
    return await fileReader.read(file);
  } catch (error) {
    console.log(`error with ${file}: ${error.message}`);
    return null;
  }
};

const fdirQuery = async (absDir, dirsIncluded = false) => {
  let files = new fdir().withFullPaths().crawl(absDir);
  if (dirsIncluded === true) {
    files = files.withDirs();
  }
  files = await files.withPromise();
  return files;
};


const getAllFilesInformation = async (files, onEmitFile, logFrequency=100) => {
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
  
      if (logFrequency > 0 && i % logFrequency === 0) {
        console.log(`done with ${i}/${files.length} files`);
      }
    }
  }
  return returnedArray;
};


async function crawlOneDir(dir, crawlOptions=defaultCrawlOptions, showDirs=false, onEmitFile = null) {
try {
  let absDir = path.resolve(dir);
  let files = await fdirQuery(absDir, showDirs);

  console.log(`done crawling ${dir}. found ${files.length} files`);
  console.log(`reading files metadata`);

  fileReader = new filePropertiesReaderFactory(crawlOptions, absDir);
  let returnedArray = await getAllFilesInformation(files, onEmitFile);

  return returnedArray;
}
catch(e) {
  throw new error
}
}

export default crawlOneDir;
