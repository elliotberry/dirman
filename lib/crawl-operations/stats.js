import {stat} from 'node:fs/promises';

const getStats = async ({absolutePath}) => {
  try {
    return await stat(absolutePath);
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return 0;
  }
};

export default {
  fn: async obj => {
    let stats = await getStats(obj);
    obj.stats = stats;
    return obj;
  },
  name: 'stats',
};
