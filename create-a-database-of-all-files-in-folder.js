/*
 * This script creates a database of all files in a given folder by crawling through it and grouping files by extension.
 * @fileoverview Script to create a database of all files in a folder.
 * @module create-a-database-of-all-files-in-folder
 */

// FILEPATH: /Users/eberry/projects/__file-organization/dirman2/create-a-database-of-all-files-in-folder.js
import crawlOneDir from './lib/crawl-one-folder.js';
import {groupByExtension} from './lib/group-by-extension.js';
import {defaultCrawlOptions} from './lib/crawl-operations.js';
import dbFactory from './lib/stream-to-lowdb.js';

/**
 * Main function that creates a database of all files in a given folder.
 * @async
 * @function main
 * @returns {Promise<void>}
 */
async function main() {
  let dir = '/Users/eberry/Documents';
  const add = await dbFactory({dir});

  /**
   * Callback function that adds a file object to the database.
   * @async
   * @function onEmitFile
   * @param {Object} fileObj - The file object to add to the database.
   * @returns {Promise<void>}
   */
  const onEmitFile = async fileObj => {
    await add(fileObj);
  };

  let showDirs=false;
  await crawlOneDir(dir, defaultCrawlOptions, showDirs, onEmitFile);
}

main();
