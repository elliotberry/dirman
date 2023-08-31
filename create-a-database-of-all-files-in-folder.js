import crawlOneDir from './lib/crawl-one-folder.js';
import {groupByExtension} from './lib/group-by-extension.js';
import {defaultCrawlOptions} from './lib/crawl-operations.js';
import dbFactory from './lib/stream-to-lowdb.js';

async function main() {
  const {add} = await dbFactory();
  const onEmitFile = async file => {
    await add(file);
  };
  let dir = '/Users/eberry/projects/auto-large-canvas/node_modules';
  await crawlOneDir(dir, defaultCrawlOptions, onEmitFile);

}

main();
