// import required modules
import {fdir} from 'fdir';
import path from 'path';

// define function to calculate weighted score of a subdirectory
function calcWeightedScore(subdir1, subdir2, weights) {
  // calculate mean and standard deviation of each measurement
  const means = {};
  const stds = {};
  const measurements = ['basename', 'filename', 'extension', 'size', 'dateModified', 'dateCreated'];

  measurements.forEach(measurement => {
    const values = [];

    subdir1.files.forEach(file => {
      values.push(file[measurement]);
    });

    subdir2.files.forEach(file => {
      values.push(file[measurement]);
    });

    means[measurement] = values.reduce((sum, value) => sum + value, 0) / values.length;

    const variance = values.reduce((sum, value) => sum + Math.pow(value - means[measurement], 2), 0) / values.length;
    stds[measurement] = Math.sqrt(variance);
  });

  // calculate weighted score based on distance to means
  let score = 0;

  score += weights.basename * Math.exp(-Math.abs(subdir1.basename - subdir2.basename) / stds.basename);
  score += weights.filename * Math.exp(-Math.abs(subdir1.filename - subdir2.filename) / stds.filename);
  score += weights.extension * Math.exp(-Math.abs(subdir1.extension - subdir2.extension) / stds.extension);
  score += weights.size * Math.exp(-Math.abs(subdir1.size - subdir2.size) / stds.size);
  score += weights.dateModified * Math.exp(-Math.abs(subdir1.dateModified - subdir2.dateModified) / stds.dateModified);
  score += weights.dateCreated * Math.exp(-Math.abs(subdir1.dateCreated - subdir2.dateCreated) / stds.dateCreated);

  return score;
}

// define function to compare two subdirectories
function compareSubdirs(subdir1, subdir2, weights, similarityThreshold) {
  const score = calcWeightedScore(subdir1, subdir2, weights);

  return score >= similarityThreshold;
}

// function to crawl directory and subdirectories
async function crawlDirectory(baseFolder, weightOptions, similarityThreshold) {
  // get list of all files in directory and subdirectories
  const files = await new fdir().withFullPaths().group().crawl(baseFolder).withPromise();
const mapit = async file => {
    return new Promise(async (resolve, reject) => {
        let obj = {};
        obj.path = file.dir
        obj.basename = path.basename(file.dir)
        obj.files = file.files.map(file => {
        
                path: file.path,
                name: path.basename(file.path, file.ext),
                ext: file.ext,
                size: file.stats.size,
                dateModified: file.stats.mtime.getTime(),
                dateCreated: file.stats.birthtime.getTime()
              })
        resolve(obj);
        });
    }

  // create array of subdirectories with their files
  const subdirs = files
    .filter(file => file.dir) // exclude individual files
    .map(file => mapit)
 

  // compare each subdirectory pair and filter by similarity threshold
  const matches = subdirs.filter((subdir1, i, arr) =>
    arr.some((subdir2, j) => j > i && compareSubdirs(subdir1, subdir2, weightOptions, similarityThreshold))
  );

  return matches;
}

// example usage
crawlDirectory('/Users/eberry/Desktop/working-files-to-backup/art', {
  basename: 1, // weight for basename
  filename: 1, // weight for filename
  extension: 1, // weight for extension
  size: 1, // weight for size
  dateModified: 1, // weight for date modified
  dateCreated: 1 // weight for date created
}, 0.5).then(console.log).catch(console.error);
