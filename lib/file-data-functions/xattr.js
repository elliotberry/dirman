import {listAttributes, getAttribute} from 'fs-xattr';

const getAllAttributes = async path => {
  let ret = {};
  try {
    await listAttributes(path).then(async attributes => {
      await attributes.forEach(async attribute => {
        await getAttribute(path, attribute).then(value => {
          if (attribute && value) {
            ret[attribute] = value;
          }
        });
      });
    });
  } catch (error) {
    console.log(`error getting attributes for ${path}: ${error}`);
  }

  return ret;
};

export default getAllAttributes;
