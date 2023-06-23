import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

import {Low} from 'lowdb';
import {JSONFile} from 'lowdb/node';
import fs from 'fs';

import {Writable} from 'node:stream';

const init = async () => {
  // db.json file path
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const file = join(__dirname, 'db.json');
  const adapter = new JSONFile(file);
  const defaultData = {items: []};
  const db = new Low(adapter, defaultData);

  await db.read();
  return db;
};

async function renderer() {
  let db = await init();
  const add = async obj => {
    await db.read();
    await db.data.items.push(obj);
    await db.write();
  };
  return new Writable({
    objectMode: true,
    write: (data, _, done) => {
      add(data).then(() => {
        done();
      });
    },
  });
}

export default renderer;
