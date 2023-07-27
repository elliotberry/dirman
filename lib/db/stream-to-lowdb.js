import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import config from '../../config.js';
import {Low} from 'lowdb';
import {JSONFile} from 'lowdb/node';
import fs from 'fs';

import {Writable} from 'node:stream';

const init = async () => {
  const appFolder = config.appFolder;
  const file = join(appFolder, 'db.json');
  const adapter = new JSONFile(file);
  const defaultData = {items: []};
  const db = new Low(adapter, defaultData);

  await db.read();
  return db;
};

const initNewScan = async ({dir="unknown-dir"}) => {
  const appFolder = config.appFolder;
  let date = new Date();
  let dateString = date.toISOString().replace(/:/g, '-');
  let fileName = `db-${dateString}.json`;
  const file = join(appFolder, fileName);
  const adapter = await new JSONFile(file);
  const defaultData = {startDate: date,
    dir: dir,
    items: []
  
  };
  const db = await new Low(adapter, defaultData);

  await db.read();
  console.log(`db initialized at ${file}`);
  return db;
};

async function dbFactory(info={}) {
  let db = await initNewScan(info);
  const add = async obj => {
    await db.read();
    await db.data.items.push(obj);
    await db.write();
  };
  let writeableStream = new Writable({
    objectMode: true,
    write: (data, _, done) => {
      add(data).then(() => {
        done();
      });
    },
  });
  return {add, writeableStream};

}

export default dbFactory;
