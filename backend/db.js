const mysql = rquire('mysql2'); // håndterer databasen (her: "planlegger")
require('dotenv').config();

// kobler backend til MySQL-database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    passord: process.env.PASSORD,
    database: 'planlegger'
});

// tester forbindelsen
db.connect((err) => {
    if (err) {
        console.error('Feil ved tilkobling til database: ', err);
    } else {
        console.log("Koblet til MySQL-databasen " + process.env.DB_NAME);
    }
});

module.exports = db;