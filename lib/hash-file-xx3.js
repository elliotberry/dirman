import pkg from 'xxhash-addon';
import {open} from 'node:fs/promises';
const {XXHash3} = pkg;

/**
 * Promisifies the hashing of a read stream
 * @param {fs.ReadStream} rs - The read stream to hash
 * @returns {Promise<string>} - A promise that resolves to the hex string of the hash
 */
const promiseToHash = (rs) => {
  return new Promise(function (res, rej) {
    const xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]));
    rs.on('data', data => xxh3.update(data))
      .on('end', () => res(xxh3.digest().toString('hex')))
      .on('error', err => {
        console.log(`error with ${rs.path}: ${err.message}`);
        res("");
      });
  });
};

/**
 * Hashes a file using XXHash3
 * @param {string} filePath - The path to the file to hash
 * @returns {Promise<string>} - A promise that resolves to the hex string of the hash
 */
const hash = async filePath => {
  try {
  let file = await open(filePath);
  let rs = file.createReadStream();
  let hash = await promiseToHash(rs);
  await file.close();
  return hash;
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return "";
  }
};

export default hash;