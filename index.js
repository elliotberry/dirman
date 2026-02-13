#!/usr/bin/env node
import { Spinner } from "@topcli/spinner"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import folderDiff from "./lib/folder-diff.js"
import notInFolder2 from "./lib/output/not-in-folder-2.js"

const shouldUseSpinner = (verboseFlag) =>
  process.stdout.isTTY && process.env.CI !== "true" && !verboseFlag

const main = async () => {
  const parser = await yargs(hideBin(process.argv))
    .usage("Usage: $0 <cmd> [options]") // usage string of application.
    .positional("directory1", {
      demandOption: true,
      describe: "First directory path",
      type: "string"
    })
    .positional("directory2", {
      demandOption: true,
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
      default: ["hash"],
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
    .option("verbose", {
      alias: "v",
      default: false,
      describe: "Run with verbose logging",
      type: "boolean"
    })
    .help("h")
    .alias("h", "help")

  let spinner = null
  try {
    const argv = await parser.parse()
    spinner = shouldUseSpinner(argv.verbose) ? new Spinner() : null

    process.env.VERBOSE = String(argv.verbose)
    spinner?.start("Validating directories...")

    let { allFiles, directory1AbsolutePath, directory2AbsolutePath } =
      await folderDiff(argv._[0], argv._[1], argv.compare, argv.match, spinner)

    if (spinner) {
      spinner.text = "Preparing output..."
    }
    await notInFolder2(directory1AbsolutePath, directory2AbsolutePath, allFiles)
    spinner?.succeed("Finished directory comparison.")
  } catch (error) {
    spinner?.failed("Directory comparison failed.")
    console.error(error.message)
    process.exitCode = 1
  }
}

main()
