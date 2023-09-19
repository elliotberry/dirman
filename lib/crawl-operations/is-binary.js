import {isBinaryFile} from 'isbinaryfile';


const isBinary = async (filePath) => {
    
    return await isBinaryFile(filePath);
}

const info =   {
    optionName: 'getBinaryStatus',
    keyName: 'isBinary',
    defaultValue: true,
    fn: isBinary,
  }

export default info;