import {isBinaryFile} from 'isbinaryfile';


const isBinary = async (filePath) => {
    
    return await isBinaryFile(filePath);
}
export default isBinary;