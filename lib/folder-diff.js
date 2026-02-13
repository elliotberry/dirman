import { compareDirectories } from "./compare.js"
import crawlOneDirectory from "./crawl-one-directory.js"
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

async function main(
  directory1,
  directory2,
  compareOptions,
  matchCondition,
  progress
) {
  updateProgressText(progress, "Validating directories...")
  const directory1AbsolutePath = await parseFolderArgument(directory1, 1)
  const directory2AbsolutePath = await parseFolderArgument(directory2, 2)
  log(
    `Got abs directories. Starting folder-diff for ${directory1AbsolutePath} and ${directory2AbsolutePath}.`
  )
  updateProgressText(progress, `Scanning ${directory1AbsolutePath}...`)
  const directory1Files = await crawlOneDirectory(directory1AbsolutePath)

  updateProgressText(progress, `Scanning ${directory2AbsolutePath}...`)
  const directory2files = await crawlOneDirectory(directory2AbsolutePath)

  updateProgressText(progress, "Comparing file lists...")
  const allFiles = await compareDirectories(
    directory1Files,
    directory2files,
    compareOptions,
    matchCondition
  )

  updateProgressText(progress, "Finalizing results...")
  return { allFiles, directory1AbsolutePath, directory2AbsolutePath }
}
export default main
