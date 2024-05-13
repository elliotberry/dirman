import { compareDirectories } from "./compare.js"
import crawlOneDirectory from "./crawl-one-directory.js"
import parseFolderArgument from "./parse-arguments.js"

async function main(directory1, directory2, compareOptions, matchCondition) {
  const directory1AbsolutePath = await parseFolderArgument(directory1)
  const directory2AbsolutePath = await parseFolderArgument(directory2)
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
