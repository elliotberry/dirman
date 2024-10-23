const displaySimpleList = async function ({ isNotInDir2 }) {
  console.log(
    isNotInDir2
      .map((item) => {
        return item.absolutePath
      })
      .sort()
      .join("\n")
  )
}
export default displaySimpleList
