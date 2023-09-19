import {fdir} from 'fdir';
import getDirectories from './lib/get-directories.js';
import path from 'path';

const main = async () => {
  let folders = await getDirectories('./test/folder1');
  console.log(folders);
};

main();
