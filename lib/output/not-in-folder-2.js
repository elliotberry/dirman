const notInFolder2 = (absoluteDirectory1, absoluteDirectory2, allFiles) => {
  let folder1Files = allFiles.filter(
    (item) => item.parentDir === absoluteDirectory1
  )

  let notInFolder2 = folder1Files.filter((item) => item.match === false)

  console.log(notInFolder2.map((item) => item.baseName).join("\n"))
}

export default notInFolder2
