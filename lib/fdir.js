import {fdir} from 'fdir';
import path from 'path';
const fdirQuery = async (absDir, dirsIncluded = false) => {
  let files = new fdir().withFullPaths().crawl(absDir);
  if (dirsIncluded === true) {
    files = files.withDirs();
  }
  files = await files.withPromise();
  return files;
};
export default fdirQuery;