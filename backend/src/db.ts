import Database from 'better-sqlite3';
import path from 'path';

// Connect to SQLite database in the root of the backend folder
const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database tables
const initDb = () => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      points INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      streak INTEGER DEFAULT 0,
      lastActive TEXT
    );

    CREATE TABLE IF NOT EXISTS vitals (
      id TEXT PRIMARY KEY,
      userId TEXT,
      heartRate INTEGER,
      bloodPressure TEXT,
      glucose INTEGER,
      oxygenLevel INTEGER,
      stressLevel INTEGER,
      temperature REAL,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS sleep (
      id TEXT PRIMARY KEY,
      userId TEXT,
      date TEXT,
      duration INTEGER,
      quality INTEGER,
      deepSleep INTEGER,
      lightSleep INTEGER,
      remSleep INTEGER,
      awakeTime INTEGER
    );

    CREATE TABLE IF NOT EXISTS mood (
      id TEXT PRIMARY KEY,
      userId TEXT,
      rating INTEGER,
      emotions TEXT,
      notes TEXT,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS guilds (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      memberCount INTEGER,
      icon TEXT
    );
    
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      userId TEXT,
      achievementId TEXT,
      unlockedAt TEXT
    );
  `);

    console.log('Database tables initialized.');
};

initDb();

export default db;
