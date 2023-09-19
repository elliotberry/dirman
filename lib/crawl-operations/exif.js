import {Exiftool} from '@mattduffy/exiftool';

const getExifInfo = async filePath => {
  let exiftool = await new Exiftool().init(filePath);
  return exiftool;
};

const info = {
 
    optionName: 'exifInfo',
    keyName: 'exifInfo',
    defaultValue: false,
    fn: getExifInfo,
}

export default info;

