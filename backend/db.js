const mysql = require('mysql2/promise'); // håndterer databasen (her: "planlegger")
require('dotenv').config();

// kobler backend til MySQL-database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSORD,
    database: 'planlegger',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// tester forbindelsen
async function testConnection() {
  try {
    // Hent en connection fra poolen
    const connection = await db.getConnection();
    console.log("Koblet til MySQL-databasen " + process.env.DB_NAME);
    connection.release(); // gi connection tilbake til pool
  } catch (err) {
    console.error('Feil ved tilkobling til database: ', err);
  }
}

testConnection();


module.exports = db;