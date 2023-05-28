import fs from 'fs';

const saveJSON = async (data, path) => {
    await fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

export default saveJSON;