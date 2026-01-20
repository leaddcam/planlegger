// db.js (PostgreSQL via pg)
const { Pool } = require('pg');
const config = require("./config");

// setter opp pool
const pool = new Pool({
    connectionString: config.db.connectionString, 
    // ssl: { rejectUnauthorized: false } // enable when deploying to managed PG (Azure)
  });

async function query(text, params) {
  return pool.query(text, params);
}

// startup db check
async function testConnection() {
  try {
    const res = await pool.query('SELECT version()');
    console.log('Koblet til PostgreSQL:', res.rows[0].version);
  } catch (err) {
    console.error('Feil ved tilkobling til PostgreSQL:', err);
    process.exitCode = 1;
  }
}
if (config.db.testConnection) {
  testConnection();
}

module.exports = { pool, query };
