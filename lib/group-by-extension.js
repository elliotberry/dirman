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
    let withCountsArray = []
    uniqueExtensions.forEach((ext) => {
        withCounts[ext] = grouped[ext].length
        withCountsArray.push({
            extension: ext,
            count: grouped[ext].length
        })
    })
    withCountsArray.sort((a, b) => {
        return b.count - a.count
    })
    uniqueExtensions.sort((a, b) => {
        return grouped[b].length - grouped[a].length
    })
    return { withCounts: withCountsArray, grouped, uniqueExtensions }
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