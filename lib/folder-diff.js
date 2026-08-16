import { compareDirectories, defaultBy } from "./compare.js"
import crawlOneDirectory, { defaultConcurrency } from "./crawl-one-directory.js"
import log from "./log.js"
import parseFolderArgument from "./parse-arguments.js"

const updateProgressText = (progress, text) => {
  if (!progress) {
    return
  }

  if (typeof progress === "function") {
    progress(text)
    return
  }

  if (typeof progress === "object" && "text" in progress) {
    progress.text = text
  }
}

export default async function folderDiff(
  directory1,
  directory2,
  compareOptions,
  matchCondition,
  progress,
  options = {}
) {
  const {
    by = defaultBy,
    concurrency = defaultConcurrency(),
    ignore = []
  } = options

  updateProgressText(progress, "Validating directories...")
  const directory1AbsolutePath = await parseFolderArgument(directory1, 1)
  const directory2AbsolutePath = await parseFolderArgument(directory2, 2)
  log(
    `Got abs directories. Starting folder-diff for ${directory1AbsolutePath} and ${directory2AbsolutePath}.`
  )

  const crawlOptions = { compareOptions, concurrency, ignore }

  updateProgressText(progress, `Scanning ${directory1AbsolutePath}...`)
  const directory1Files = await crawlOneDirectory(
    directory1AbsolutePath,
    crawlOptions
  )
  updateProgressText(
    progress,
    `Scanned ${directory1Files.length} files. Scanning ${directory2AbsolutePath}...`
  )

  const directory2Files = await crawlOneDirectory(
    directory2AbsolutePath,
    crawlOptions
  )
  updateProgressText(
    progress,
    `Scanned ${directory2Files.length} files. Comparing file lists...`
  )

  const allFiles = await compareDirectories(
    directory1Files,
    directory2Files,
    compareOptions,
    matchCondition,
    by
  )

  updateProgressText(progress, "Finalizing results...")
  return {
    allFiles,
    by,
    compareOptions,
    directory1AbsolutePath,
    directory2AbsolutePath,
    matchCondition
  }
}
