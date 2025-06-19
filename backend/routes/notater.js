const express = require('express');
const router = express.Router();
const db = require('../db');

// henter alle notater for en interesse
router.get('/:interesse', (req, res) => {
    const { interesse } = req.params;
    db.query('SELECT * FROM notater WHERE interesse = ?', [interesse], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Feil ved henting av notater' });
        } else {
            res.json(result);
        }
    });
});

// legger til et nytt notat
router.post('/', (req, res) => {
    const { interesse, tittel, innhold } = req.body;
    db.query(
        'INSERT INTO notater (interesse, tittel, innhold) VALUES (?, ?, ?)',
        [interesse, tittel, innhold],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Feil ved innsending' });
            } else {
                res.json({ id: result.insertId, interesse, tittel, innhold });
            }
        }
    );
});

module.exports = router;
