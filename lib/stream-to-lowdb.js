import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

import {Low} from 'lowdb';
import {JSONFile} from 'lowdb/node';
import fs from 'fs';
import path from 'path';
import {Writable} from 'node:stream';

/**
 * Initializes a new lowdb database for a new scan
 * @param {Object} info - Information about the scan
 * @param {string} info.dir - The directory being scanned
 * @returns {Promise<Low>} - The lowdb instance
 */
const initNewScan = async ({dir = 'unknown-dir', appFolder}) => {

  let date = new Date();
  let dateString = date.toISOString().replace(/:/g, '-');
  let fileName = `db-${dateString}.json`;
  const file = join(appFolder, fileName);
  const adapter = await new JSONFile(file);
  const defaultData = {startDate: date, dir: dir, items: []};
  const db = await new Low(adapter, defaultData);

  await db.read();
  await db.write();
  console.log(`db initialized at ${file}`);
  return db;
};

/**
 * Creates a new lowdb instance and a writable stream to add data to the instance
 * @param {Object} info - Information about the scan
 * @param {string} info.dir - The directory being scanned
 * @returns {Promise<Object>} - An object containing the add function and the writable stream
 */

//modes are: async or stream
async function dbFactory({dir, mode = 'async'}) {
  //if doesn't exist, create it
  const appFolder = path.join(process.env.HOME, '.dirman2');
  if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder);
  }
  
  let db = await initNewScan({dir, appFolder});

  if (mode === 'async') {
    const add = async obj => {
      await db.read();
      await db.data.items.push(obj);
      await db.write();
    };
    return add;
  } else if (mode === 'stream') {
    let writeableStream = new Writable({
      objectMode: true,
      write: (data, _, done) => {
        add(data).then(() => {
          done();
        });
      },
    });
    return writeableStream;
  } else {
    throw new Error(`mode ${mode} not supported`);
  }
}

export default dbFactory;
