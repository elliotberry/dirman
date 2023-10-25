import save from '../create-a-database-of-all-files-in-folder.js';
import {createFolderOfRandomShit} from './createFolderOfRandomShit.js';

async function main() {
    let dir = "test-save"
    await createFolderOfRandomShit(dir, 10)
    await save(dir);
    }
    main();
