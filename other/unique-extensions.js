    const exts = files.map((file) => {
        return path.extname(file);
    }).filter((ext) => {
        return ext !== "";
    });
    const uniqueExts = [...new Set(exts)];