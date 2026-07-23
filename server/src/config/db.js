import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_TYPE = process.env.DB_TYPE || 'auto'; // 'mysql', 'sqlite', or 'auto'

let dbMode = 'none';
let mysqlPool = null;
let sqliteDb = null;

// Ensure data directory exists
const dataDir = path.resolve(__dirname, '../../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export async function initDb() {
  if (dbMode !== 'none') return dbMode;

  const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'cricketiq',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 2000
  };

  if (DB_TYPE === 'mysql' || DB_TYPE === 'auto') {
    try {
      const tempPool = mysql.createPool(mysqlConfig);
      // Quick test query
      const [rows] = await tempPool.query('SELECT 1');
      mysqlPool = tempPool;
      dbMode = 'mysql';
      console.log('✅ Connected to MySQL Database at', mysqlConfig.host);
      await createTablesMySQL();
      return dbMode;
    } catch (err) {
      if (DB_TYPE === 'mysql') {
        console.error('❌ Failed to connect to MySQL:', err.message);
        throw err;
      }
      console.log('ℹ️ MySQL not detected on localhost, defaulting to embedded SQLite database.');
    }
  }

  // SQLite fallback
  const dbPath = path.join(dataDir, 'cricketiq.db');
  sqliteDb = new sqlite3.Database(dbPath);
  dbMode = 'sqlite';
  console.log('✅ Initialized SQLite Database at:', dbPath);
  await createTablesSQLite();
  return dbMode;
}

export async function query(sql, params = []) {
  if (dbMode === 'none') {
    await initDb();
  }

  if (dbMode === 'mysql') {
    const [results] = await mysqlPool.query(sql, params);
    return results;
  } else {
    return new Promise((resolve, reject) => {
      const trimmed = sql.trim().toUpperCase();
      if (trimmed.startsWith('SELECT')) {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        });
      } else {
        sqliteDb.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve({ insertId: this.lastID, affectedRows: this.changes });
        });
      }
    });
  }
}

async function createTablesMySQL() {
  const schemas = [
    `CREATE TABLE IF NOT EXISTS players (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      country VARCHAR(50) NOT NULL,
      role VARCHAR(50) NOT NULL,
      batting_style VARCHAR(50),
      bowling_style VARCHAR(50),
      date_of_birth DATE,
      photo_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS teams (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      country VARCHAR(50) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS matches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      format VARCHAR(10) NOT NULL,
      match_date DATE NOT NULL,
      venue VARCHAR(100) NOT NULL,
      team_home_id INT,
      team_away_id INT
    )`,
    `CREATE TABLE IF NOT EXISTS innings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      match_id INT NOT NULL,
      team_id INT NOT NULL,
      innings_number INT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS player_match_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      match_id INT NOT NULL,
      player_id INT NOT NULL,
      runs INT DEFAULT 0,
      balls_faced INT DEFAULT 0,
      fours INT DEFAULT 0,
      sixes INT DEFAULT 0,
      dismissal_type VARCHAR(50) DEFAULT 'not out',
      overs_bowled DECIMAL(4,1) DEFAULT 0.0,
      runs_conceded INT DEFAULT 0,
      wickets INT DEFAULT 0,
      catches INT DEFAULT 0,
      stumpings INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS career_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      format VARCHAR(10) NOT NULL,
      season VARCHAR(20),
      matches INT DEFAULT 0,
      runs INT DEFAULT 0,
      average DECIMAL(6,2) DEFAULT 0.00,
      strike_rate DECIMAL(6,2) DEFAULT 0.00,
      hundreds INT DEFAULT 0,
      fifties INT DEFAULT 0,
      highest_score INT DEFAULT 0,
      wickets INT DEFAULT 0,
      bowling_average DECIMAL(6,2) DEFAULT 0.00,
      economy DECIMAL(5,2) DEFAULT 0.00,
      catches INT DEFAULT 0,
      last_computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_player_format_season (player_id, format, season)
    )`,
    `CREATE TABLE IF NOT EXISTS ai_summaries (
      player_id INT PRIMARY KEY,
      summary_text TEXT NOT NULL,
      generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'viewer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS opposition_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_id INT NOT NULL,
      format VARCHAR(10) NOT NULL,
      opposition VARCHAR(100) NOT NULL,
      matches INT DEFAULT 0,
      innings INT DEFAULT 0,
      runs INT DEFAULT 0,
      highest_score VARCHAR(20) DEFAULT '0',
      average DECIMAL(6,2) DEFAULT 0.00,
      hundreds INT DEFAULT 0,
      fifties INT DEFAULT 0,
      wickets INT DEFAULT 0,
      bowling_average DECIMAL(6,2) DEFAULT 0.00,
      economy DECIMAL(5,2) DEFAULT 0.00,
      UNIQUE KEY unique_opp (player_id, format, opposition)
    )`,
    `CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      payload TEXT,
      attempts INT DEFAULT 0,
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const s of schemas) {
    await mysqlPool.query(s);
  }
}

async function createTablesSQLite() {
  const schemas = [
    `CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      role TEXT NOT NULL,
      batting_style TEXT,
      bowling_style TEXT,
      date_of_birth TEXT,
      photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      format TEXT NOT NULL,
      match_date TEXT NOT NULL,
      venue TEXT NOT NULL,
      team_home_id INTEGER,
      team_away_id INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS innings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL,
      team_id INTEGER NOT NULL,
      innings_number INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS player_match_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      runs INTEGER DEFAULT 0,
      balls_faced INTEGER DEFAULT 0,
      fours INTEGER DEFAULT 0,
      sixes INTEGER DEFAULT 0,
      dismissal_type TEXT DEFAULT 'not out',
      overs_bowled REAL DEFAULT 0.0,
      runs_conceded INTEGER DEFAULT 0,
      wickets INTEGER DEFAULT 0,
      catches INTEGER DEFAULT 0,
      stumpings INTEGER DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS career_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      format TEXT NOT NULL,
      season TEXT,
      matches INTEGER DEFAULT 0,
      runs INTEGER DEFAULT 0,
      average REAL DEFAULT 0.00,
      strike_rate REAL DEFAULT 0.00,
      hundreds INTEGER DEFAULT 0,
      fifties INTEGER DEFAULT 0,
      highest_score INTEGER DEFAULT 0,
      wickets INTEGER DEFAULT 0,
      bowling_average REAL DEFAULT 0.00,
      economy REAL DEFAULT 0.00,
      catches INTEGER DEFAULT 0,
      last_computed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(player_id, format, season)
    )`,
    `CREATE TABLE IF NOT EXISTS ai_summaries (
      player_id INTEGER PRIMARY KEY,
      summary_text TEXT NOT NULL,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'viewer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS opposition_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      format TEXT NOT NULL,
      opposition TEXT NOT NULL,
      matches INTEGER DEFAULT 0,
      innings INTEGER DEFAULT 0,
      runs INTEGER DEFAULT 0,
      highest_score TEXT DEFAULT '0',
      average REAL DEFAULT 0.00,
      hundreds INTEGER DEFAULT 0,
      fifties INTEGER DEFAULT 0,
      wickets INTEGER DEFAULT 0,
      bowling_average REAL DEFAULT 0.00,
      economy REAL DEFAULT 0.00,
      UNIQUE(player_id, format, opposition)
    )`,
    `CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      payload TEXT,
      attempts INTEGER DEFAULT 0,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const s of schemas) {
    await new Promise((resolve, reject) => {
      sqliteDb.run(s, (err) => (err ? reject(err) : resolve()));
    });
  }
}

export function getDbMode() {
  return dbMode;
}
