import {fdir} from 'fdir';
import path from 'path';
const getPathTags = fpath => {
    return fpath
      .split(path.sep)
      .map(tag => tag.toLowerCase().trim())
      .filter(tag => tag.length > 0);
  };

  export default getPathTags;