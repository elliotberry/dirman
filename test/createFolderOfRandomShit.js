import fs from 'fs';
import path from 'path';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import chalk from 'chalk';
const __dirname = dirname(fileURLToPath(import.meta.url));
const mainFolder = path.join(__dirname, 'testFolder');

global.konsole = {
  log: msg => {
    console.log(chalk.blue(msg));
  },
  error: msg => {
    console.log(chalk.red(msg));
  },
};

const createFolderOfRandomShit = async (folderPath, totalFiles = 10) => {
  let newFolder = path.join(mainFolder, folderPath);
  let iterationArr = Array.from({ length: totalFiles }, (_, i) => i + 1);
  let g = await fs.promises.access(mainFolder);
  console.log(g);
  if (await fs.promises.access(mainFolder)) {
    fs.promises.rm(mainFolder, { recursive: true });
  }
await fs.promises.mkdir(mainFolder);
await fs.promises.mkdir(newFolder);
  
  
  for await (let i of iterationArr) {
    const fileName = `file${i}.txt`;
    const content = Math.random().toString(36).substring(2);
    await fs.promises.writeFile(path.join(newFolder, fileName), content);
  }
};
export { createFolderOfRandomShit };