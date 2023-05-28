const createArrayHash = async files => {
    let newhash = new XXHash3(Buffer.from([0, 0, 0, 0]));
    for await (const file of files) {
      if (typeof file !== 'string') {
        file = JSON.stringify(file);
      }
      newhash.update(file);
    }
    return newhash.digest().toString('hex');
  };

  export default createArrayHash;