import fs from 'fs';
import path from 'path';
import filesNotInSecondFolder from '../output-list-of-files-not-in-second-folder.js';
const mainFolder = path.join(process.cwd(), 'testFolder');
const folderA = path.join(mainFolder, 'folderA');
const folderB = path.join(mainFolder, 'folderB');

// Create folders
async function createFolders() {
  if (!fs.existsSync(mainFolder)) {
    fs.mkdirSync(mainFolder);
    fs.mkdirSync(folderA);
    fs.mkdirSync(folderB);
  }
}

// Generate random files
async function generateFiles() {
  const totalFiles = 5;
  for (let i = 0; i < totalFiles; i++) {
    const fileName = `file${i}.txt`;
    const content = Math.random().toString(36).substring(2);
    const folderAFiles = [];
    const folderBFiles = [];
    // Randomly decide if the file should be in both folders or just one
    const randomChoice = Math.floor(Math.random() * 3);
    if (randomChoice === 0) {
      fs.writeFileSync(path.join(folderA, fileName), content);
      folderAFiles.push(fileName);
    } else if (randomChoice === 1) {
      fs.writeFileSync(path.join(folderB, fileName), content);
      folderBFiles.push(fileName);
    } else {
      fs.writeFileSync(path.join(folderA, fileName), content);
      fs.writeFileSync(path.join(folderB, fileName), content);
      folderAFiles.push(fileName);
      folderBFiles.push(fileName);
    }
  }
  console.log(`Files generated: ${totalFiles}`);
}

// Delete folder recursively
function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
  console.log(`Folder deleted: ${dirPath}`);
}

// Delete folder if it exists
function deleteIfExists(dirPath) {
  if (fs.existsSync(dirPath)) {
    deleteFolderRecursive(dirPath);
  }
}

async function main() {
  await deleteIfExists(mainFolder);
  createFolders();
  generateFiles();

  await filesNotInSecondFolder(folderA, folderB);

  // Uncomment the line below to delete the testFolder and its contents
  deleteFolderRecursive(mainFolder);
}
main();
