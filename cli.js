#!/usr/bin/env node
import chalk from "chalk"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import folderDiff from "./lib/folder-diff.js"
import notInFolder2 from "./lib/output/not-in-folder-2.js"

const main = async () => {
  try {
    const parser = await yargs(hideBin(process.argv))
      .usage("Usage: $0 <cmd> [options]") // usage string of application.
      .positional("directory1", {
        describe: "First directory path",
        type: "string"
      })
      .positional("directory2", {
        describe: "Second directory path",
        type: "string"
      })
      .option("h", {
        alias: "help",
        describe: "Show help",
        type: "boolean"
      })
      .help("h")
      .alias("h", "help")
    const argv = await parser.parse()

    let { absoluteDirectory1, absoluteDirectory2, allFiles } = await folderDiff(
      argv._[0],
      argv._[1]
    )
    await notInFolder2(absoluteDirectory1, absoluteDirectory2, allFiles)
  } catch (error) {
    console.error(chalk.red(error.message))
  }
}

main()
