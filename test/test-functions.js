import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';
import path from 'path';

import __dirname from '../lib/__dirname.js';


const testParentFolder = path.join(__dirname, 'test', 'test-files');
const folderAPath = path.resolve(path.join(testParentFolder, 'a'));
const folderBPath = path.resolve(path.join(testParentFolder, 'b'));

const createRandomFileName = () => randomBytes(6).toString('hex') + '.txt';
const createRandomContent = () => randomBytes(20).toString('hex');
String.prototype.del = function(s) {
    return this.split(s).join("")
}
async function createFolderWithFiles(folderName, commonFiles, uniqueFiles) {
    await fs.mkdir(folderName, { recursive: true });
    for (const file of commonFiles) {
        await fs.writeFile(`${folderName}/${file}`, createRandomContent());
    }
    for (const file of uniqueFiles) {
        await fs.writeFile(`${folderName}/${file}`, createRandomContent());
    }
}
async function tryToDeleteFolder() {
    //delete test if exists
    try {
        await fs.rm(testParentFolder, { recursive: true });
    } catch (error) {
        // Handle error if needed
       
    }
}

const createTestData = async () => {
    await tryToDeleteFolder(testParentFolder);
    await fs.mkdir(testParentFolder, { recursive: true });
    const commonFiles = Array.from({ length: 5 }, createRandomFileName);
    const uniqueFilesA = Array.from({ length: 5 }, createRandomFileName);
    const uniqueFilesB = Array.from({ length: 5 }, createRandomFileName);

    await createFolderWithFiles(folderAPath, commonFiles, uniqueFilesA);
    await createFolderWithFiles(folderBPath, commonFiles, uniqueFilesB);
}
export { tryToDeleteFolder, createTestData, testParentFolder, folderAPath, folderBPath, createRandomFileName, createRandomContent };