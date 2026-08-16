import log from "./log.js"

const defaultCompareOptions = ["hash"]
const defaultBy = "content"
const keyPriority = ["hash", "size", "basename"]

const compareOperations = {
  basename: (file1, file2) => file1.baseName === file2.baseName,
  hash: (file1, file2) => file1.hash === file2.hash,
  size: (file1, file2) => file1.size === file2.size
}

const keyValue = (file, key) => {
  if (key === "basename") {
    return file.baseName
  }

  if (key === "hash") {
    return file.hash
  }

  if (key === "size") {
    return file.size
  }
}

const indexByKey = (files, key) => {
  const index = new Map()

  for (const file of files) {
    const value = keyValue(file, key)
    if (value === undefined) {
      continue
    }

    const bucket = index.get(value)
    if (bucket) {
      bucket.push(file)
    } else {
      index.set(value, [file])
    }
  }

  return index
}

export const normalizeCompareOptions = (
  compareOptions = defaultCompareOptions
) => {
  const options = compareOptions.map((option) => option.toLowerCase())

  if (options.length === 0) {
    throw new Error("no valid compare options")
  }

  for (const option of options) {
    if (!Object.hasOwn(compareOperations, option)) {
      throw new Error(`option ${option} is not a valid option`)
    }
  }

  return options
}

const markMatch = (file, counterpart) => ({
  ...file,
  match: true,
  matchID: counterpart.absolutePath,
  matchedFile: counterpart.relativePathFromRoot
})

const markMiss = (file) => ({ ...file, match: false })

const appendUniqueMatches = (file1, option, indexes, seen, candidates) => {
  const value = keyValue(file1, option)
  if (value === undefined) {
    return
  }

  const matches = indexes[option].get(value) ?? []
  for (const file2 of matches) {
    if (seen.has(file2.absolutePath)) {
      continue
    }

    seen.add(file2.absolutePath)
    candidates.push(file2)
  }
}

const comparisonFactory = (
  compareOptions = defaultCompareOptions,
  matchCondition = "all",
  directory2 = [],
  by = defaultBy
) => {
  const optionNames = normalizeCompareOptions(compareOptions)

  const compareOneToOne = (file1, file2) => {
    const results = optionNames.map((option) =>
      compareOperations[option](file1, file2)
    )

    return matchCondition === "all" ?
        results.every(Boolean)
      : results.some(Boolean)
  }

  if (by === "path") {
    const directory2ByPath = new Map(
      directory2.map((file) => [file.relativePathFromRoot, file])
    )

    const compareOneToAll = (file1) => {
      const file2 = directory2ByPath.get(file1.relativePathFromRoot)
      if (!file2) {
        return markMiss(file1)
      }

      return compareOneToOne(file1, file2) ?
          markMatch(file1, file2)
        : markMiss(file1)
    }

    return { compareOneToAll, compareOneToOne }
  }

  const indexes = Object.fromEntries(
    optionNames.map((option) => [option, indexByKey(directory2, option)])
  )

  const candidatesFor = (file1) => {
    if (matchCondition === "all") {
      const primary = keyPriority.find((key) => optionNames.includes(key))
      const value = keyValue(file1, primary)
      return indexes[primary].get(value) ?? []
    }

    const seen = new Set()
    const candidates = []

    for (const option of optionNames) {
      appendUniqueMatches(file1, option, indexes, seen, candidates)
    }

    return candidates
  }

  const compareOneToAll = (file1) => {
    for (const file2 of candidatesFor(file1)) {
      if (compareOneToOne(file1, file2)) {
        return markMatch(file1, file2)
      }
    }

    return markMiss(file1)
  }

  return { compareOneToAll, compareOneToOne }
}

const compareDirectories = async (
  directory1,
  directory2,
  compareOptions = defaultCompareOptions,
  matchCondition = "all",
  by = defaultBy
) => {
  if (!Array.isArray(directory1) || !Array.isArray(directory2)) {
    throw new TypeError("directory1 and directory2 must be arrays")
  }

  log(
    `Comparing files with options: ${compareOptions}, match: ${matchCondition}, by: ${by}`
  )

  const { compareOneToAll: compareAgainstDirectory2 } = comparisonFactory(
    compareOptions,
    matchCondition,
    directory2,
    by
  )
  const { compareOneToAll: compareAgainstDirectory1 } = comparisonFactory(
    compareOptions,
    matchCondition,
    directory1,
    by
  )

  const directory1Results = directory1.map((file) =>
    compareAgainstDirectory2(file)
  )
  log("Done comparing files in directory 1")
  const directory2Results = directory2.map((file) =>
    compareAgainstDirectory1(file)
  )

  return [...directory1Results, ...directory2Results]
}

export { compareDirectories, defaultBy, defaultCompareOptions }
