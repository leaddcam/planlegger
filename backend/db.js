// db.js (PostgreSQL via pg)
const { Pool } = require('pg');
require('dotenv').config();

// setting up pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL // ssl: { rejectUnauthorized: false } // enable when you deploy to managed PG (Azure)
  });

// Simple helper like mysql2's pool.execute
async function query(text, params) {
  return pool.query(text, params);
}

// Test connection (similar to your MySQL version)
async function testConnection() {
  try {
    const res = await pool.query('SELECT version()');
    console.log('Koblet til PostgreSQL:', res.rows[0].version);
  } catch (err) {
    console.error('Feil ved tilkobling til PostgreSQL:', err);
    process.exitCode = 1;
  }
}
testConnection();

module.exports = { pool, query };
