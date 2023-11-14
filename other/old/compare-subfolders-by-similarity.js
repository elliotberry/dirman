import {fdir} from 'fdir';
import fs from 'fs';
import path from 'path';
const baseFolder = '/Users/eberry/Desktop/working-files-to-backup/art';
import stringSimilarity from 'string-similarity';
import levenshtein from 'fast-levenshtein';

const returnTree = () => {
  return new Promise((resolve, reject) => {
    const fdirStream = new fdir().withFullPaths().withDirs().group().crawl(baseFolder).withPromise();
    const results = {
      folders: [],
      files: [],
      errors: [],
    };

    fdirStream().then(paths => {
      paths = paths.map(p => {
        let fullPaths = p;
        let dirName = path.parse(p.directory).name;
        let files = fullPaths.files.map(file => {
          let parsed = path.parse(file);
          return {
            name: parsed.name,
            ext: parsed.ext,
          };
        });
        return {
          dirName,
          files,
          fullPaths,
        };
      });
      console.log('paths', paths);

      resolve(paths);
    });
  });
};
/*
const compare = dirs => {
  await Promise.all(dirs.map(dir => {
    return new Promise((resolve, reject) => {
      let dirsToCompare = dirs.filter(thisDir => thisDir !== dir);
      let compared = dirsToCompare.map(dirToCompare => {
        let ranked = levenshtein.get(dir.basename, dirToCompare.basename);

  return dirs.map(dir => {
    if (!dir.ranked) {
      let dirsToCompare = dirs.filter(thisDir => thisDir !== dir);
      let compared = dirsToCompare.map(dirToCompare => {
        let ranked = levenshtein.get(dir.basename, dirToCompare.basename);
        return ranked;
      });
      dir.ranked = compared;
    }
  });
  return dirs;
};
*/
const groupByBaseName = dirs => {
  let grouped = dirs.reduce((acc, dir) => {
    let key = dir.basename;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(dir);
    return acc;
  }, {});
  return Object.keys(grouped).map(key => {
    return {
      key,
      value: grouped[key],
    };
  });
};
const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace);
};
const displayGrouped = grouped => {
  grouped
    .filter(item => item.value.length > 1)
    .sort((a, b) => {
      return b.value.length - a.value.length;
    })
    .forEach(item => {
      console.log(item.value.length);
      console.log(item.key);
      console.log(item.value.map(item => item.absolutePath).join('\n'));
      console.log('\n\n################');
    });
};
const start = async () => {
  let baseBasename = path.basename(baseFolder);
  const files = await new fdir().withFullPaths().group().crawl(baseFolder).withPromise();

  let folders = fdirStream.map(obj => obj.directory);
  let uniqueFolders = [...new Set(folders)].map(folder => {
    return {
      absolutePath: folder,
      relativePath: folder.split(baseFolder)[1].replaceAll('/', ''),
      basename: path.basename(folder),
      tags: folder
        .split('/')
        .filter(item => item !== baseBasename && item !== '')
        .map(item => item.toLowerCase()),
    };
  });
  //remove the base folder from the list
  uniqueFolders = uniqueFolders.filter(item => item.absolutePath !== baseFolder);
  //let compared = compare(uniqueFolders);
  let grouped = groupByBaseName(uniqueFolders);

  displayGrouped(grouped);
};
//start()

const getContextualInformation = async (folders, baseBasename, size=true) => {
  const getFileInformation = file => {
    return new Promise((resolve, reject) => {
      let abs = file;
      let basename = path.basename(file);
      if (size) {
        fs.statSync(file).then(stats => {

      resolve({
        absolutePath: abs,
        basename: basename,
      });
    });
  };
  const getInfoPromise = folder => {
    return new Promise((resolve, reject) => {
      let abs = folder.dir;
      let rel = folder.dir.split(baseFolder)[1].replaceAll('/', '');
      let basename = path.basename(folder.dir);
      if (size) {
        let stats = fs.statSync(folder.dir);
        folder.size = stats.size;
      }
      let tags = folder.dir
        .split('/')
        .filter(item => item !== baseBasename && item !== '')
        .map(item => item.toLowerCase())
        .sort();
      let files = Promise.all(folder.files.map(file => getFileInformation(file)));
      files.then(files => {

      resolve({
        absolutePath: abs,
        relativePath: rel,
        basename: basename,
        tags: tags,
        files: files,
      });
    });
  };

  return await Promise.all(folders.map(folder => getInfoPromise(folder)));
};

const main = async () => {
  let baseBasename = path.basename(baseFolder);
  const fdirStream = await new fdir().withFullPaths().group().crawl(baseFolder).withPromise();
  let folders = await getContextualInformation(fdirStream, baseBasename);
  console.log(folders);

};
main();
