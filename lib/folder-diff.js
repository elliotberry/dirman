import { compareDirectories } from "./compare.js"
import crawlOneDirectory from "./crawl-one-directory.js"
import log from "./log.js"
import parseFolderArgument from "./parse-arguments.js"

async function main(directory1, directory2, compareOptions, matchCondition) {
  const directory1AbsolutePath = await parseFolderArgument(directory1, 1)
  const directory2AbsolutePath = await parseFolderArgument(directory2, 2)
  log(
    `Got abs directories. Starting folder-diff for ${directory1AbsolutePath} and ${directory2AbsolutePath}.`
  )
  const directory1Files = await crawlOneDirectory(directory1AbsolutePath)

  const directory2files = await crawlOneDirectory(directory2AbsolutePath)

  const allFiles = await compareDirectories(
    directory1Files,
    directory2files,
    compareOptions,
    matchCondition
  )

  return { allFiles, directory1AbsolutePath, directory2AbsolutePath }
}
export default main
