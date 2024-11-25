import log from "./log.js"

const defaultCompareOptions = ["hash"]

const compareOperations = {
  basename: (file1, file2) => file1.basename === file2.basename,
  hash: (file1, file2) => file1.hash === file2.hash,
  size: (file1, file2) => file1.size === file2.size
}

// Parses the compare options and returns an array of comparison functions
const parseCompareOptions = (compareOptions) => {
  const fns = compareOptions.map((option) => {
    const opt = option.toLowerCase()
    if (compareOperations[opt]) {
      return compareOperations[opt]
    }
    throw new Error(`option ${option} is not a valid option`)
  })

  if (fns.length === 0) {
    throw new Error("no valid compare options")
  }

  return fns
}

// Creates comparison functions based on the provided options and match condition
const comparisonFactory = (
  compareOptions = defaultCompareOptions,
  matchCondition = "all"
) => {
  const fns = parseCompareOptions(compareOptions)

  // Compares two files based on the provided comparison functions
  const compareOneToOne = (file1, file2) => {
    if (fns.length === 1) {
      return fns[0](file1, file2)
    }

    const results = fns.map((fn) => fn(file1, file2))
    return matchCondition === "all" ?
        results.every(Boolean)
      : results.some(Boolean)
  }

  // Compares one file to all files in a directory
  const compareOneToAll = async (file1, directory2) => {
    for await (const file2 of directory2) {
      if (compareOneToOne(file1, file2)) {
        return {
          ...file1,
          match: true,
          matchID: file1.hash + file2.hash,
          matchedFile: file2.hash
        }
      }
    }
    return { ...file1, match: false }
  }

  return { compareOneToAll, compareOneToOne }
}

// Compares two directories based on the provided options and match condition
const compareDirectories = async (
  directory1,
  directory2,
  compareOptions = defaultCompareOptions,
  matchCondition = "all"
) => {
  if (!Array.isArray(directory1) || !Array.isArray(directory2)) {
    throw new TypeError("directory1 and directory2 must be arrays")
  }

  log(
    `Comparing files with options: ${compareOptions} and match condition: ${matchCondition}`
  )
  const { compareOneToAll } = comparisonFactory(compareOptions, matchCondition)

  const directory1Results = await Promise.all(
    directory1.map((file1) => compareOneToAll(file1, directory2))
  )
  log("Done comparing files in directory 1")

  if (directory1Results.length === 0) {
    throw new Error("no files found in directory 1")
  }

  const directory2Results = directory2.map((file2) => {
    const matchedFile = directory1Results.find(
      (file1) => file1.match && file1.matchedFile === file2.hash
    )
    return matchedFile ?
        { ...file2, match: true, matchedFile: matchedFile.hash }
      : { ...file2, match: false }
  })

  return [...directory1Results, ...directory2Results]
}

export { compareDirectories, defaultCompareOptions }
