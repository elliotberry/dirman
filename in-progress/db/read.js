import {Readable} from 'node:stream';
import dbFactory from '../../lib/stream-to-lowdb.js';
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



const g = async function () {
 const {add} = await dbFactory();
 await add({p: 'fdfd'});
}
g();
