import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fdir } from "fdir";
const rootFolder = '/Users/eberry/Desktop/working-files-to-backup/art-to-concat';
let folderList = [];



async function crawlFolder(currentPath) {
  let folderObj = { files: [], subDirectories: [] };
 var api = new fdir().withFullPaths()
 await api.crawl(currentPath).withPromise().then((list) => {
    list.forEach(async (filePath) => {
      let fileOrFolder = fs.lstatSync(filePath);

      if (fileOrFolder.isFile()) {
        let fileHash, fileSize;

        if (!fileOrFolder.isSymbolicLink()) {
          fileHash = crypto.createHash('sha1').update(fs.readFileSync(filePath)).digest('hex');
          fileSize = fileOrFolder.size;
        }

        folderObj.files.push({ name: path.basename(filePath), size: fileSize, hash: fileHash });
      } else if (fileOrFolder.isDirectory()) {
        let folderName = path.basename(filePath);
        let subFolderObj = { name: folderName, path: filePath, files: [], similarity: 0 };
        let subFolderContent = await crawlFolder(filePath);
        subFolderObj.files = subFolderContent.files;
        subFolderObj.subDirectories = subFolderContent.subDirectories;
        folderObj.subDirectories.push(subFolderObj);
      }
    });
  }).catch((err) => {
    console.log(err);
  });

  return folderObj;
}



function compareDirectories(folderObj1, folderObj2) {
  let folderSimilarity = 0;
  if (folderObj1.name === folderObj2.name) {
    folderSimilarity += 50;
  }
  let folder1Content = JSON.stringify(folderObj1.files);
  let folder2Content = JSON.stringify(folderObj2.files);
  let contentSimilarity = ((folder1Content === folder2Content) ? 50 : 0);
  if (contentSimilarity > 0) {
    let folder1Size = getFolderSize(folderObj1.files);
    let folder2Size = getFolderSize(folderObj2.files);

    if (folder1Size > folder2Size) {
      folderSimilarity += ((folder2Size / folder1Size) * 25);
    } else if (folder1Size < folder2Size) {
      folderSimilarity += ((folder1Size / folder2Size) * 25);
    } else {
      folderSimilarity += 25;
    }

    let folder1Hash = getFolderHash(folderObj1.files);
    let folder2Hash = getFolderHash(folderObj2.files);

    if (folder1Hash === folder2Hash) {
      folderSimilarity += 25;
    } else {
      let difference = getHashDifference(folder1Hash, folder2Hash);

      if (difference > 0) {
        folderSimilarity += ((difference / folder1Hash.length) * 25);
      } else {
        folderSimilarity += 25;
      }
    }
  }
  return folderSimilarity;
}


function getFolderSize(files) {
  let totalSize = 0;
  files.forEach(function (file) {
    totalSize += file.size;
  });
  return totalSize;
}

function getFolderHash(files) {
  let folderContent = '';
  files.forEach(function (file) {
    folderContent += file.hash;
  });
  return crypto.createHash('sha1').update(folderContent).digest('hex');
}

function getHashDifference(hash1, hash2) {
  let difference = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) difference++;
  }
  return difference;
}
async function main() {
  let arr = await crawlFolder(rootFolder);
  let arr2 = await crawlFolder(`/Users/eberry/Desktop/working-files-to-backup/art`);
  let out = compareDirectories(arr, arr2);
console.log(JSON.stringify(out, null, 2));
 
}
main();
//let arr = crawlFolder(`/Users/eberry/Desktop/working-files-to-backup/art-to-concat/art3`);
//let arr2 = crawlFolder(`/Users/eberry/Desktop/working-files-to-backup/art`);


//let out = compareDirectories(arr, arr2);
//console.log(JSON.stringify(arr, null, 2));
/*
folderList.sort(function (a, b) { return b.similarity - a.similarity; });

console.log('Folder List:');
console.log('------------');
folderList.forEach(function (folderObj1, index1) {
  folderList.forEach(function (folderObj2, index2) {
    if (index1 < index2) {
      console.log('Folder 1: ' + folderObj1.path + ', Folder 2: ' + folderObj2.path + ', Similarity: ' + folderObj1.subDirectories[index2].similarity + '%');
    }
  });
}); */

