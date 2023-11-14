import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

async function databaseFactory() {
  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  });

  await db.run(`
        CREATE TABLE IF NOT EXISTS files (
          filePath TEXT,
          dir TEXT,
          root TEXT,
          base TEXT,
          name TEXT,
          ext TEXT,
          size INTEGER,
          birthtime TEXT,
          atime TEXT,
          mtime TEXT,
          ctime TEXT,
          isFile INTEGER,
          isDirectory INTEGER,
          hash TEXT,
          dateCrawled INTEGER,
          drive TEXT
        )
      `);
  async function insert(objs) {
    try {
      if (!Array.isArray(objs) && typeof objs === 'object') {
        objs = [objs];
      }

      const promises = objs.map(async obj => {
        await db.run(
          `
              INSERT INTO files (
                filePath, dir, root, base, name, ext,
                size, birthtime, atime, mtime, ctime, isFile, isDirectory,
                hash, dateCrawled, drive
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
          [...Object.values(obj)],
        );
      });

      await Promise.all(promises);

      console.log('Objects saved to SQLite database');
    } catch (error) {
      console.log(`Error saving objects to SQLite database: ${error}`);
    }
  }
  return    {insert};
}
export default databaseFactory;