const groupByExtension = async (files) => {
    let grouped = {}
    for await (const file of files) {
        let ext = file.ext
        if (ext === '') {
            ext = '<no-extension>'
        }
        if (grouped[ext]) {
            grouped[ext].push(file)
        } else {
            grouped[ext] = [file]
        }
    }
    let uniqueExtensions = Object.keys(grouped)
    let withCounts = {};
    uniqueExtensions.forEach((ext) => {
        withCounts[ext] = grouped[ext].length
    })
    return { withCounts, grouped, uniqueExtensions }
}

const formatGroupsArray = (groups) => {
    let groupsArray = []
    Object.entries(groups).forEach(([key, value]) => {
        let size = getGroupSize(value)
        let sorted = sortFilesBySize(value)
        groupsArray.push({
            extension: key,
            files: sorted,
            size: size,
            prettySize: prettyBytes(size),
        })
    })
    return groupsArray
}
export { groupByExtension, formatGroupsArray }