import path from 'path';
import crawlOneDir from './crawl-one-folder.js';
import parseFolderArgument from './parseArguments.js';
import displaySimpleList from './display-simple-list.js';
import {compareDirectories} from './compare.js';

async function main(dir1, dir2) {
  let absDir1 = await parseFolderArgument(dir1);
  let absDir2 = await parseFolderArgument(dir2);
  let one = await crawlOneDir(absDir1);
  let two = await crawlOneDir(absDir2);
  let compared = await compareDirectories(one, two);
  return compared;
  
}
export default main;
