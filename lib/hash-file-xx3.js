import pkg from 'xxhash-addon';

const {XXHash3} = pkg;

const hashFile = filePath => {
  return new Promise(function (res, rej) {
    const xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]));
    createReadStream(filePath)
      .on('data', data => xxh3.update(data))
      .on('end', () => res(xxh3.digest().toString('hex')))
      .on('error', function (error) {
        console.log(`error: ${error.message}`);
        rej(error.message);
      });
  });
};

export default hashFile;