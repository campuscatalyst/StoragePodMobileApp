import * as SQLite from 'expo-sqlite';

let db = null;

export const initDB = async () => {
    try {
        if(!db) {
            db = await SQLite.openDatabaseAsync("app");
            await db.execAsync(`
                PRAGMA journal_mode = WAL;
                CREATE TABLE IF NOT EXISTS devices (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ip TEXT UNIQUE, port TEXT, domainName TEXT, givenname TEXT, status TEXT, discoveredAt DATETIME, lastAccessedAt DATETIME);
                CREATE INDEX IF NOT EXISTS ip_index_devices ON devices (ip);
                `);
        }
    } catch (error) {
        db = null;
        throw error;
    }
}

export const getDB = () => {
    return db;
}