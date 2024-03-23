//only works with one comparison option at a time

//one day will be expanded as per user need
const compareOperations = {
  hash: function (file1, file2) {
    console.log(file1.hash, file2.hash)
    return file1.hash === file2.hash
  },
  size: function (file1, file2) {
    return file1.size === file2.size
  },
  name: function (file1, file2) {
    return file1.basename === file2.basename
  }
}

let defaultCompareOptions = {
  hash: true,
  size: false,
  name: false
}

let matchConditions = "all" //all or any

//creates fn to compare one file to another as per user options, returns essentially array.filter
const comparisonFactory = (compareOptions) => {
  let fns = []
  for (let option in compareOptions) {
    if (compareOptions[option] === true) {
      if (!compareOperations[option]) {
        throw new Error(`option ${option} is not a valid option`)
      }
      fns.push(compareOperations[option])
    }
  }
  if (fns.length === 0) {
    throw new Error("no valid compare options")
  }
  let compareOneToOne = async (file1, file2) => {
    let returnValue = false

    if (fns.length === 1) {
      returnValue = fns[0](file1, file2)
    } else {
      for await (const function_ of fns) {
        let thisResult = function_(file1, file2)
        if (matchConditions === "any") {
          if (thisResult === true) {
            returnValue = true
            break
          }
        } else {
          if (thisResult === false) {
            returnValue = false
            break
          }
        }
      }
    }
    return returnValue
  }
  const compareOneToAll = async (file1, dir2) => {
    file1.match = false
    for await (let dir2file of dir2) {
      let res = await compareOneToOne(file1, dir2file)
      if (res === true) {
        file1.match = true
        file1.matchedFile = dir2file.hash
        break
      }
    }
    return file1
  }
  return { compareOneToOne, compareOneToAll }
}

const compareDirectories = async (
  dir1FileArray,
  dir2FileArray,
  compareOptions = defaultCompareOptions
) => {
  if (!Array.isArray(dir1FileArray) || !Array.isArray(dir2FileArray)) {
    throw new TypeError("dir1 and dir2 must be arrays")
  }

  let { compareOneToAll } = comparisonFactory(compareOptions)

  let folder1Results = await Promise.all(
    dir1FileArray.map((file1) => compareOneToAll(file1, dir2FileArray))
  )
  let folder2Results = dir2FileArray.map((file2) => {
    file2.match = false
    for (const file1 of folder1Results) {
      if (file1.match === true && file1.matchedFile === file2) {
        file2.match = true
        file2.matchedFile = file1.hash
      }
    }
    return file2
  })

  let allFiles = [...folder1Results, ...folder2Results]
  return allFiles
}

export { defaultCompareOptions, compareDirectories }
