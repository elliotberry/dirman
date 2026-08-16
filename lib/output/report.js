const uniquePaths = (allFiles, rootDirectory) =>
  allFiles
    .filter(
      (item) => item.rootDirectory === rootDirectory && item.match === false
    )
    .map((item) => item.relativePathFromRoot)
    .sort((left, right) => left.localeCompare(right))

export const buildReport = ({
  allFiles,
  by,
  compare,
  directory1,
  directory2,
  match
}) => ({
  by,
  compare,
  directory1,
  directory2,
  match,
  onlyIn1: uniquePaths(allFiles, directory1),
  onlyIn2: uniquePaths(allFiles, directory2)
})

export const printReport = (report, { json = false, only = "1" } = {}) => {
  if (json) {
    console.log(JSON.stringify(report))
    return
  }

  if (only === "2") {
    console.log(report.onlyIn2.join("\n"))
    return
  }

  if (only === "both") {
    console.log("Only in directory 1:")
    console.log(report.onlyIn1.join("\n"))
    console.log("Only in directory 2:")
    console.log(report.onlyIn2.join("\n"))
    return
  }

  console.log(report.onlyIn1.join("\n"))
}
