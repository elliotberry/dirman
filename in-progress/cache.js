import {Low} from 'lowdb';
import {JSONFile} from 'lowdb/node';
import fs from 'fs';
import path from 'path';
class CachingFunction {
  constructor(cacheName) {
    this.initCache(cacheName);
    return this;
  }
  async initCache(cacheName) {
    this.dbFolder = './db';
    if (!fs.existsSync(this.dbFolder)) {
      fs.mkdirSync(this.dbFolder);
    }
    this.cacheName = path.join(this.dbFolder, cacheName);
    this.cache = new Low(new JSONFile(this.cacheName), {files: []});
    await this.cache.read();

  }
  async getCachedData() {
    return this.cache.get('data').value();
  }

  async getCacheEntryByKey(key) {
    return this.cache.get('data').find({key: key}).value();
  }

  async appendData(data) {
    await this.cache.read();

    if (Array.isArray(data)) {
      await this.cache.data.files.push(...data);
    } else {
      await this.cache.data.files.push(data);
    }
    await this.cache.write();
  }
}


let d = new CachingFunction('test.json');
d.appendData([{key: 'test', value: 'test'}, {key: 'test', value: 'test'}, {key: 'test', value: 'test'}])