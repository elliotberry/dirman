import filePropertiesReaderFactory from './file-properties-reader.js';
import {defaultCrawlOptions} from './crawl-operations/crawl-operations.js';
var fileReader = null;

const returnOneObject = async file => {
  try {
    return await fileReader.read(file);
  } catch (error) {
    console.log(`error with ${file}: ${error.message}`);
    return null;
  }
};

const getAllFilesInformation = async (files, onEmitFile=null, logFrequency = 100) => {
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
const getFilesInfo = async (files, absDir, crawlOptions=defaultCrawlOptions, onEmitFile=null) => {
  fileReader = new filePropertiesReaderFactory(crawlOptions, absDir);
  let returnedArray = await getAllFilesInformation(files, onEmitFile);
};
export default getFilesInfo;
