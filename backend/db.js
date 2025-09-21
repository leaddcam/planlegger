// db.js (PostgreSQL via pg)
const { Pool } = require('pg');
require('dotenv').config();

// setter opp pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL // ssl: { rejectUnauthorized: false } // enable when you deploy to managed PG (Azure)
  });

async function query(text, params) {
  return pool.query(text, params);
}

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
