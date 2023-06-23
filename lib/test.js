import fs from 'fs';
import crawlTwoDirs from './crawl-two-folders-and-display-files-different.js';


const rootFolder = './test';
const dirpath1 = `${rootFolder}/folder1`;
const dirpath2 = `${rootFolder}/folder2`;

const delFolder = function () {
  //if root folder exists, delete it
  if (fs.existsSync(rootFolder)) {
    fs.rmdirSync(rootFolder, {recursive: true});
  }
};

const resetTest = function () {
  delFolder();
  //create test folder
  fs.mkdirSync(rootFolder);
  //create child folders under it
  fs.mkdirSync(dirpath1);
  fs.mkdirSync(dirpath2);
};
const createRandomFileContent = function () {
  let random = Math.floor(Math.random() * 100);
  let content = '';
  for (let i = 0; i < random; i++) {
    content += 'This is a test.';
  }
  return content;
};

const createTest = function () {
  return new Promise(function (resolve, reject) {
    resetTest();
    let arr = [
      {name: 'file1.txt', content: 'This is a test.'},
      {name: 'file2.txt', content: 'This is a test.'},
      {name: 'file3.txt', content: 'This is a test.'},
      {name: 'file4.txt', content: 'This is a test.'},
      {name: 'file5.txt', content: 'This is a test.'},
      {name: 'file6.txt', content: 'This is a test.'},
      {name: 'file7.txt', content: 'This is a test.'},
      {name: 'file8.txt', content: 'This is a test.'},
      {name: 'file9.txt', content: 'This is a test.'},
      {name: 'file10.txt', content: createRandomFileContent()},
    ];
    //one random file should be different

    for (let i = 0; i < arr.length; i++) {
      fs.writeFileSync(`${dirpath1}/${arr[i].name}`, arr[i].content);
    }
    //now make a folder in folder1
    fs.mkdirSync(`${dirpath1}/folder3`);
    //now add three files in folder3
    let arr2 = [
      {name: 'file11.txt', content: 'This is a test.'},
      {name: 'file12.txt', content: 'This is a test.'},
      {name: 'file13.txt', content: 'This is a test.'},
    ];
    for (let i = 0; i < arr2.length; i++) {
      fs.writeFileSync(`${dirpath1}/folder3/${arr2[i].name}`, arr2[i].content);
    }
    //now copy folder 3 to folder 2, but omit a random file
    fs.mkdirSync(`${dirpath2}/folder3`);
    fs.copyFileSync(`${dirpath1}/folder3/file11.txt`, `${dirpath2}/folder3/file11.txt`);
    fs.copyFileSync(`${dirpath1}/folder3/file12.txt`, `${dirpath2}/folder3/file12.txt`);
    //now copy the files from folder1 to folder2
    for (let i = 0; i < arr.length; i++) {
      fs.copyFileSync(`${dirpath1}/${arr[i].name}`, `${dirpath2}/${arr[i].name}`);
    }

    //make the files different in the two folders in random ways\
    let random = Math.floor(Math.random() * 10);
    for (let i = 0; i < random; i++) {
      let possibleChanges = ['deleteFile', 'changeFile', 'addFile'];
      let change = possibleChanges[Math.floor(Math.random() * 3)];
      let randomFile = Math.floor(Math.random() * 10);
      if (change === 'deleteFile') {
        fs.unlinkSync(`${dirpath2}/${arr[randomFile].name}`);
      }
      if (change === 'changeFile') {
        fs.writeFileSync(`${dirpath2}/${arr[randomFile].name}`, 'This is a different test.');
      }
      if (change === 'addFile') {
        fs.writeFileSync(`${dirpath2}/${arr[randomFile].name}`, 'This is a different test.');
      }
    }
    resolve();
  });
};


const main = async function () {

  await createTest();
  await crawlTwoDirs(dirpath1, dirpath2);
  delFolder();
};
main();

