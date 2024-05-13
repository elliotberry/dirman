#!/usr/bin/env node
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
      .option("compare", {
        alias: "c",
        array: true, // Key aspect to allow multiple values
        choices: ["hash", "size", "basename"],
        description:
          "Set operations for comparing files. Available options: hash, size, basename. Default: hash",
        type: "string"
      })
      .default("compare", ["hash"])
      .option("match", {
        alias: "m",
        choices: ["all", "any"],
        default: "all",
        description:
          "Set match conditions. Available options: all, any. Default: all",
        type: "string"
      })
      .help("h")
      .alias("h", "help")
    const argv = await parser.parse()
    console.log(argv)

    let { absoluteDirectory1, absoluteDirectory2, allFiles } = await folderDiff(
      argv._[0],
      argv._[1],
      argv.compare,
      argv.match
    )
    await notInFolder2(absoluteDirectory1, absoluteDirectory2, allFiles)
  } catch (error) {
    console.error(error.message)
  }
}

main()
