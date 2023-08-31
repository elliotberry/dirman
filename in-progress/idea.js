import {open, createReadStream} from 'node:fs/promises';
const asyncPipe = funcs => {
  const asyncFuncs = funcs.map(func => util.promisify(func));
  return async input => {
    let result = input;
    for (let i = 0; i < asyncFuncs.length; i++) {
      const asyncFunc = asyncFuncs[i];
      result = await asyncFunc(result);
    }
    return result;
  };
};

const createFileSource = async file => {
  const fd = await open(file);
  const stream = fd.createReadStream();
  return stream;
};
