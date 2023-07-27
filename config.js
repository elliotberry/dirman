import path from 'path';
import fs from 'fs';
//if doesn't exist, create it
const appFolder = path.join(process.env.HOME, '.dirman2');
if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder);
}
const config = {
    appFolder: appFolder
}
export default config;