import pkg from 'xxhash-addon';
import {open} from 'node:fs/promises';
const {XXHash3} = pkg;

const promiseToHash = rs => {
  return new Promise(function (res, rej) {
    const xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]));
    rs.on('data', data => xxh3.update(data))
      .on('end', () => res(xxh3.digest().toString('hex')))
      .on('error', err => {
        console.log(`error with ${rs.path}: ${err.message}`);
        res('');
      });
  });
};

// Hashes a file using XXHash3
const hash = async filePath => {
  try {
    let file = await open(filePath);
    let rs = file.createReadStream();
    let hash = await promiseToHash(rs);
    await file.close();
    return hash;
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return '';
  }
};

//standardized return for crawl ops.
const info = {
  optionName: 'hash',
  keyName: 'hash',
  defaultValue: true,
  fn: hash,
};

export default info;
