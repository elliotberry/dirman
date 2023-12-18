import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';
import { exec } from 'child_process';
import path from 'path';
//import ora from 'ora';


const testParentFolder = './test';
const foldera = path.resolve(path.join('test', 'a'));
const folderb = path.resolve(path.join('test', 'b'));

const createRandomFileName = () => randomBytes(6).toString('hex') + '.txt';
const createRandomContent = () => randomBytes(20).toString('hex');

let execa = (command) => {
    return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        resolve(`${JSON.parse(stdout)}`);
        
    });
    })
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

async function tryToDeleteFolder(folderName) {
    //delete test if exists
    try {
        await fs.rm(folderName, { recursive: true });
    } catch (error) {
        
    }
}


async function test() {
    console.log('testing folder-diff');
    await tryToDeleteFolder(testParentFolder);
    await fs.mkdir(testParentFolder, { recursive: true });
    const commonFiles = Array.from({ length: 5 }, createRandomFileName);
    const uniqueFilesA = Array.from({ length: 5 }, createRandomFileName);
    const uniqueFilesB = Array.from({ length: 5 }, createRandomFileName);

    await createFolderWithFiles(foldera, commonFiles, uniqueFilesA);
    await createFolderWithFiles(folderb, commonFiles, uniqueFilesB);


    let res = await await execa(`node ../cli.js folder-diff --f1 ${foldera} --f2 ${folderb} --format json `)
    console.log(JSON.stringify(res));
}

main();
