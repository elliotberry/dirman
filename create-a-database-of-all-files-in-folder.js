import crawlOneDir from './lib/crawl-one-folder.js';

import {defaultCrawlOptions} from './lib/crawl-operations/crawl-operations.js';
import dbFactory from './lib/stream-to-lowdb.js';

async function main(dir) {
  const add = await dbFactory({dir});

  const onEmitFile = async fileObj => {
    await add(fileObj);
  };

  let showDirs = false;
  await crawlOneDir(dir, defaultCrawlOptions, showDirs, onEmitFile);
}

export default main;
