import log from "./log.js"
//compare config
const defaultCompareOptions = ["hash", "size"]

//only works with one comparison option at a time
//one day will be expanded as per user need
const compareOperations = {
  basename: (file1, file2) => {
    return file1.basename === file2.basename
  },
  hash: (file1, file2) => {
    return file1.hash === file2.hash
  },
  size: (file1, file2) => {
    return file1.size === file2.size
  }
}

const parseCompareOptions = (compareOptions) => {
  //create array of functions to compare files based on user options
  const fns = []
  for (const option of compareOptions) {
    const opt = option.toLowerCase()
    if (compareOperations.hasOwnProperty(opt)) {
      fns.push(compareOperations[opt])
    } else {
      throw new Error(`option ${option} is not a valid option`)
    }
  }
  if (fns.length === 0) {
    throw new Error("no valid compare options")
  }
  return fns
}

//creates fn to compare one file to another as per user options, returns essentially array.filter
const comparisonFactory = (
  compareOptions = defaultCompareOptions,
  matchCondition = "all"
) => {
  const fns = parseCompareOptions(compareOptions)

  //compare one file to another file based on user options
  const compareOneToOne = async (file1, file2) => {
    if (fns.length === 1) {
      return fns[0](file1, file2)
    }
    const results = fns.map((function_) => function_(file1, file2))
    if (matchCondition === "all") {
      return results.every((result) => result === true)
    } else if (matchCondition === "any") {
      return results.includes(true)
    }

    return false
  }

  const compareOneToAll = async (file1, directory2) => {
    file1.match = false
    for await (const directory2file of directory2) {
      const result = await compareOneToOne(file1, directory2file)
      file1.match = false
      if (result === true) {
        file1.match = true
        file1.matchedFile = directory2file.hash
        file1.matchID = file1.hash + directory2file.hash
        break
      }
    }
    return file1
  }
  return { compareOneToAll, compareOneToOne }
}

const compareDirectories = async (
  directory1FileArray,
  directory2FileArray,
  compareOptions = defaultCompareOptions,
  matchCondition = "all"
) => {
  if (
    !Array.isArray(directory1FileArray) ||
    !Array.isArray(directory2FileArray)
  ) {
    throw new TypeError("dir1 and dir2 must be arrays")
  }
  log(
    `Comparing files with options: ${compareOptions} and match condition: ${matchCondition}`
  )
  let { compareOneToAll } = comparisonFactory(compareOptions, matchCondition)

  const folder1Results = await Promise.all(
    directory1FileArray.map((file1) =>
      compareOneToAll(file1, directory2FileArray)
    )
  )
  if (folder1Results.length === 0) {
    throw new Error("no files found in directory 1")
  }
  const folder2Results = directory2FileArray.map((file2) => {
    file2.match = false
    for (const file1 of folder1Results) {
      if (file1.match === true && file1.matchedFile === file2.hash) {
        file2.match = true
        file2.matchedFile = file1.hash
      }
    }
    return file2
  })

  return [...folder1Results, ...folder2Results]
}

export { compareDirectories, defaultCompareOptions }
