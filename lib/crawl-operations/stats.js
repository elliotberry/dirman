import { stat } from 'node:fs/promises';


const stats = async (filePath) => {
  try {
    return await stat(filePath);

  
  } catch (error) {
    console.log(`error with ${filePath}: ${error.message}`);
    return 0;
  }
};

const info =  {
  optionName: 'stats',
  keyName: 'stats',
  defaultValue: true,
  fn: stats,
}

export default info;
