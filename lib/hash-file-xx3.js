import pkg from 'xxhash-addon';
import {open} from 'node:fs/promises';
const {XXHash3} = pkg;


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

const hash = async filePath => {
  try {
  let file = await open(filePath);
  let rs = file.createReadStream();
  return await promiseToHash(rs);
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return "";
  }
};

export default hash;