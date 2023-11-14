import path from 'path';

//wip: create word partials a stags from fullpath
const getPathTags = fullpath => {
  return fullpath
    .split(path.sep)
    .map(tag => tag.toLowerCase().trim())
    .filter(tag => tag.length > 0);
};

export default getPathTags;
