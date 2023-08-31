import { listAttributes, getAttribute, setAttribute } from 'fs-xattr'

const getAllAttributes = async (path) => {
    let ret = []
    await listAttributes(path).then((attributes) => {
        attributes.forEach(async (attribute) => {
           await getAttribute(path, attribute).then((value) => {
                ret.push({ attribute, value })
            })
        })
    })
    return ret
}

export default getAllAttributes