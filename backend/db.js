const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// DB file in project root
const dbPath = path.resolve(__dirname, '../travel.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("DB error:", err.message);
  else console.log("Connected to SQLite database.");
});

// Create sample tables if not exist
db.serialize(() => {

  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Destinations table
  db.run(`CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    season TEXT,
    budget_range TEXT,
    mood TEXT,
    country TEXT,
    description TEXT
  )`);

  // Itineraries table
  db.run(`CREATE TABLE IF NOT EXISTS itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    tripName TEXT,
    startDate TEXT,
    endDate TEXT,
    details TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Itinerary days and activities
  db.run(`CREATE TABLE IF NOT EXISTS itinerary_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itinerary_id INTEGER,
    date TEXT,
    FOREIGN KEY(itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS itinerary_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_id INTEGER,
    time TEXT,
    description TEXT,
    FOREIGN KEY(day_id) REFERENCES itinerary_days(id) ON DELETE CASCADE
  )`);

  // Expenses table
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    amount REAL,
    currency TEXT,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Culture table
  db.run(`CREATE TABLE IF NOT EXISTS culture (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT UNIQUE,
    greetings TEXT,
    dining TEXT,
    customs TEXT,
    taboos TEXT,
    region TEXT
  )`);

  // Seed minimal culture data if empty
  db.get('SELECT COUNT(*) as cnt FROM culture', (err, row) => {
    if (err) return;
    if (row && row.cnt === 0) {
      const stmt = db.prepare('INSERT INTO culture (country, greetings, dining, customs, taboos, region) VALUES (?,?,?,?,?,?)');
      stmt.run('Japan', 'Bowing is customary; depth shows respect.', 'Say itadakimasu before eating; slurping noodles is fine.', 'Remove shoes in homes/temples; punctuality valued.', 'Do not stick chopsticks upright in rice.', 'asia');
      stmt.run('Italy', 'Handshake or cheek kisses among friends.', 'Cappuccino is for breakfast; don\'t rush meals.', 'Dress modestly in churches.', 'Avoid cheese on seafood pasta; don\'t discuss money.', 'europe');
      stmt.run('France', 'Bonjour when entering shops; la bise among friends.', 'Wait for \"bon appétit\"; bread on table, not plate.', 'Punctuality flexible socially; dress well.', 'Avoid loud speech; money/politics are sensitive.', 'europe');
      stmt.finalize();
    }
  });
});

module.exports = db;
