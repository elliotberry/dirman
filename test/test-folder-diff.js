import fs from 'fs';
import path from 'path';
import folderDiff from '../output-list-of-files-not-in-second-folder.js';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mainFolder = path.join(__dirname, 'testFolder');
const folderA = path.join(mainFolder, 'folderA');
const folderB = path.join(mainFolder, 'folderB');

//this part is important for the tests to run
var testLog = msg => console.log(chalk.bgBlue.black(msg));

global.konsole = {
  log: msg => {
    console.log(chalk.blue(msg));
  },
  error: msg => {
    console.log(chalk.red(msg));
  },
};

// Create folders
async function createFolders() {
  await fs.promises.mkdir(mainFolder);
  await fs.promises.mkdir(folderA);
  await fs.promises.mkdir(folderB);
}
// Generate random files
async function generateFiles() {
  // Randomly decide if the file should be in both folders or just one
  const totalFiles = 10;
  const folderAFiles = [];
  const folderBFiles = [];
  let iterationArr = Array.from({length: totalFiles}, (_, i) => i + 1);
  let lastFileToEdit = '';
  for await (let i of iterationArr) {
    const fileName = `file${i}.txt`;
    const content = Math.random().toString(36).substring(2);
    if (i <= 3) {
      await fs.promises.writeFile(path.join(folderA, fileName), content);
      folderAFiles.push(fileName);
    } else if (i > 3 && i <= 6) {
      await fs.promises.writeFile(path.join(folderB, fileName), content);
      folderBFiles.push(fileName);
    } else if (i > 6 && i <= 9) {
      await fs.promises.writeFile(path.join(folderA, fileName), content);
      await fs.promises.writeFile(path.join(folderB, fileName), content);
      folderAFiles.push(fileName);
      folderBFiles.push(fileName);
      lastFileToEdit = fileName;
    } else {
      const content1 = Math.random().toString(36).substring(2);
      await fs.promises.appendFile(path.join(folderB, lastFileToEdit), content1);
    }
  }

  // testLog a tree of the generated files
  testLog('Generated files:');
  testLog(mainFolder);
  testLog('├──', folderA);
  testLog('│   ├──', (await fs.promises.readdir(folderA)).join('\n│   ├── '));
  testLog('└──', folderB);
  testLog('    ├──', (await fs.promises.readdir(folderB)).join('\n    ├── '));
}

// Delete folder recursively
async function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    await fs.promises.rm(dirPath, {recursive: true});
    testLog(`Folder deleted: ${dirPath}`);
  }
}

async function main() {
  await deleteFolderRecursive(mainFolder);
  await createFolders();
  await generateFiles();

  await folderDiff(folderA, folderB);

  // Uncomment the line below to delete the testFolder and its contents
  //deleteFolderRecursive(mainFolder);
}
export {createFolderOfRandomShit}
main();
