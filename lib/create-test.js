import fs from 'fs';
const rootFolder = './test';
const dirpath1 = `${rootFolder}/folder1`;
const dirpath2 = `${rootFolder}/folder2`;
const resetTest = function () {
  //if root folder exists, delete it
  if (fs.existsSync(rootFolder)) {
    fs.rmdirSync(rootFolder, {recursive: true});
  }

  //create test folder
  fs.mkdirSync(rootFolder);
  //create child folders under it
  fs.mkdirSync(dirpath1);
  fs.mkdirSync(dirpath2);
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
      {name: 'file10.txt', content: 'This is a test.'},
    ];
    for (let i = 0; i < arr.length; i++) {
      fs.writeFileSync(`${dirpath1}/${arr[i].name}`, arr[i].content);
    }
    //copy all of folder1 into folder2
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
createTest();
export default createTest;
