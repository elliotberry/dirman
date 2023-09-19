import {listAttributes, getAttribute} from 'fs-xattr';

const getAllAttributes = async path => {
  let attributes = await listAttributes(path);
  let ret = [];
  for await (let attribute of attributes) {
    let value = await getAttribute(path, attribute);
    let obj = {attribute: attribute, value: value.toString()};
    if (attribute === 'com.apple.quarantine') {
      console.log('value', value);
      let v = value.toString();
      ret.parsed = v.split(';');
    }
    ret.push(obj);
  }
  return ret;
};

const info = {
  optionName: 'xattrs',
  keyName: 'xattrs',
  defaultValue: true,
  fn: getAllAttributes,
}

export default info;
