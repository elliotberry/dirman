import { compareDirectories } from "./compare.js"
import crawlOneDirectory from "./crawl-one-folder.js"
import parseFolderArgument from "./parseArguments.js"

async function main(directory1, directory2) {
  let absoluteDirectory1 = await parseFolderArgument(directory1)
  let absoluteDirectory2 = await parseFolderArgument(directory2)
  let one = await crawlOneDirectory(absoluteDirectory1)
  let two = await crawlOneDirectory(absoluteDirectory2)
  let allFiles = await compareDirectories(one, two)

  return { absoluteDirectory1, absoluteDirectory2, allFiles }
}
export default main
