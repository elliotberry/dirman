import pkg from 'xxhash-addon';

const {XXHash3} = pkg;

async function* generateChunks(filePath, size) {
  const sharedBuffer = Buffer.alloc(size);
  const stats = fs.statSync(filePath); // file details
  const fd = fs.openSync(filePath); // file descriptor
  let bytesRead = 0; // how many bytes were read
  let end = size;

  for (let i = 0; i < Math.ceil(stats.size / size); i++) {
    await readBytes(fd, sharedBuffer);
    bytesRead = (i + 1) * size;
    if (bytesRead > stats.size) {
      // When we reach the end of file,
      // we have to calculate how many bytes were actually read
      end = size - (bytesRead - stats.size);
    }
    yield sharedBuffer.slice(0, end);
  }
}

async function hash(file, chunkSize = 100000) {
  let xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]));
  for await (const chunk of generateChunks(file, chunkSize)) {
    xxh3.update(chunk);
  }
  return xxh3.digest().toString('hex');
}

export default hash;
