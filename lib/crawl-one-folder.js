import fdir from './fdir.js';
import path from 'path';
import {defaultCrawlOptions} from './crawl-operations/crawl-operations.js';
import getFilesInfo from './get-files-info.js';


const getDir = async(dir) => {
  try {
  let absoluteDir = path.resolve(dir);
  return absoluteDir;
  }
  catch(e) {
    throw new Error(`cannot get dir: ${e.toString()}`)
  }
}

async function crawlOneFolder(dir, crawlOptions = defaultCrawlOptions, showDirs = false, onEmitFile = null) {
    
    let absDir = await getDir(dir);
    let files = await fdir(absDir, showDirs);

    console.log(`done crawling ${dir}. found ${files.length} files`);
    let ret = await getFilesInfo(files, absDir, crawlOptions, onEmitFile);

    return ret;
}

export default crawlOneFolder;
