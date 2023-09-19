import {crawlTwoDirs} from './lib/crawl-two-folders-and-display-files-different.js';
import displayAsTable from './lib/display-folder-diff.js';
import yargs from 'yargs/yargs';

//var argv = yargs(process.argv.slice(2)).scriptName('move').usage('$0 <source> <destination>').help().argv;

//const source = argv._[0];
//onst destination = argv._[1];

async function main(source, destination) {
  let obj = await crawlTwoDirs(source, destination);
  displayAsTable(obj);
}


export default main;
