const uniqueExtensions = async (files) => {

    const exts = files.map((file) => {
        return {path: file, ext: path.extname(file)};

    }).reduce((acc, ext) => {
        if (acc[ext]) {
            acc[ext].push(ext);
        } else {
            acc[ext] = [ext];
        }
        return acc;
    }, {});
    return exts;
}

export default uniqueExtensions;