

import path from 'path';

/**
 * Returns an array of tags extracted from a given path.
 * @param {string} fullpath - The full path to extract tags from.
 * @returns {string[]} An array of tags extracted from the given path.
 */
const getPathTags = fullpath => {
  return fullpath
    .split(path.sep)
    .map(tag => tag.toLowerCase().trim())
    .filter(tag => tag.length > 0);
};

export default getPathTags;
