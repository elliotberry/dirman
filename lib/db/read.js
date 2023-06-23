import {Readable} from 'node:stream';
import renderer from './stream-to-lowdb.js';
import fs from 'fs';
import path from 'path';

var rs;

const init = function (dir) {
  rs = new Readable({
    objectMode: true,
    read() {},
  });
  //interval for checking new files
  setInterval(function () {
    console.log('interval');
    rs.push({p: 'fdfd'});
  }, 1000);

  rs.on('data', (buff) => {
    console.log(buff.toString())
  })
  return rs;
};

const gg = init();

const g = async function () {
  let ws = await renderer();
  gg.pipe(ws);
}
g();
