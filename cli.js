#!/usr/bin/env node
import chalk from "chalk"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import notInFolder2 from "./lib/output/not-in-folder-2.js"
import folderDiff from "./lib/folder-diff.js"

const main = async () => {
  try {
    const parser = await yargs(hideBin(process.argv))
      .usage("Usage: $0 <cmd> [options]") // usage string of application.
      .positional("folder1", {
        describe: "First folder path",
        type: "string"
      })
      .positional("folder2", {
        describe: "Second folder path",
        type: "string"
      })
      .option("h", {
        alias: "help",
        describe: "Show help",
        type: "boolean"
      })
      .option("format", {
        alias: "f",
        choices: ["notInFolder2"],
        default: "notInFolder2",
        describe: "Output format",
        type: "string"
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
