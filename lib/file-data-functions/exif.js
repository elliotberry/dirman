
import { Exiftool } from '@mattduffy/exiftool'


const getExifInfo = async (filePath) => {
let exiftool = await new Exiftool().init(filePath)
return exiftool
}

export default getExifInfo