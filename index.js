#!/usr/bin/env node
import os from "node:os"

import { Spinner } from "@topcli/spinner"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import folderDiff from "./lib/folder-diff.js"
import { buildReport, printReport } from "./lib/output/report.js"

const compareChoices = ["hash", "size", "basename"]

const splitList = (values) => {
  const list = Array.isArray(values) ? values : [values]
  return list
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean)
}

const splitCompare = (values) =>
  splitList(values).map((value) => value.toLowerCase())

const shouldUseSpinner = (verboseFlag, jsonFlag) =>
  process.stdout.isTTY && process.env.CI !== "true" && !verboseFlag && !jsonFlag

const main = async () => {
  const argv = await yargs(hideBin(process.argv))
    .scriptName("dirman")
    .usage("$0 <directory1> <directory2> [options]")
    .command(
      "$0 <directory1> <directory2>",
      "Compare two directories",
      (command) =>
        command
          .positional("directory1", {
            describe: "First directory path",
            type: "string"
          })
          .positional("directory2", {
            describe: "Second directory path",
            type: "string"
          })
    )
    .option("compare", {
      alias: "c",
      array: true,
      choices: compareChoices,
      coerce: splitCompare,
      default: ["hash"],
      describe:
        "Comparison methods: hash, size, basename. Repeat or comma-separate.",
      type: "string"
    })
    .option("match", {
      alias: "m",
      choices: ["all", "any"],
      default: "all",
      describe: "Require all compare methods to match, or any of them.",
      type: "string"
    })
    .option("by", {
      choices: ["content", "path"],
      default: "content",
      describe: "Match files by content identity or by relative path.",
      type: "string"
    })
    .option("only", {
      choices: ["1", "2", "both"],
      coerce: String,
      default: "1",
      describe: "Which unique-file list to print.",
      type: "string"
    })
    .option("json", {
      default: false,
      describe: "Print results as JSON.",
      type: "boolean"
    })
    .option("ignore", {
      alias: "i",
      array: true,
      coerce: splitList,
      default: [],
      describe: "Glob or basename patterns to skip in both trees.",
      type: "string"
    })
    .option("concurrency", {
      default: os.availableParallelism?.() ?? 8,
      describe: "Max parallel file hashes.",
      type: "number"
    })
    .option("verbose", {
      alias: "v",
      default: false,
      describe: "Run with verbose logging",
      type: "boolean"
    })
    .help("h")
    .alias("h", "help")
    .strict()
    .parse()

  let spinner
  try {
    process.env.VERBOSE = String(argv.verbose)
    spinner =
      shouldUseSpinner(argv.verbose, argv.json) ? new Spinner() : undefined
    spinner?.start("Validating directories...")

    const { allFiles, directory1AbsolutePath, directory2AbsolutePath } =
      await folderDiff(
        argv.directory1,
        argv.directory2,
        argv.compare,
        argv.match,
        spinner,
        {
          by: argv.by,
          concurrency: argv.concurrency,
          ignore: argv.ignore
        }
      )

    spinner?.succeed("Finished directory comparison.")

    const report = buildReport({
      allFiles,
      by: argv.by,
      compare: argv.compare,
      directory1: directory1AbsolutePath,
      directory2: directory2AbsolutePath,
      match: argv.match
    })
    printReport(report, { json: argv.json, only: argv.only })
  } catch (error) {
    spinner?.failed("Directory comparison failed.")
    console.error(error.message)
    process.exitCode = 1
  }
}

main()
