import {promises as fs} from 'fs';

import {assert} from 'chai';
import __dirname from '../lib/__dirname.js';
import {describe, it, before, after} from 'mocha';

import {execa} from './execa.js';
import {createTestData, tryToDeleteFolder, folderAPath, folderBPath} from './test-functions.js';

const main = async () => {
  await createTestData();
  let res = await execa(`node cli.js folder-diff ${folderAPath} ${folderBPath} --format json`);
  console.log(res);
 // await tryToDeleteFolder();
};
main()
