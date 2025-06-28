const express = require('express');
const router = express.Router();
const db = require('../db');


// legger til et nytt notat
router.post('/', (req, res) => {
    const { interesse, tittel, innhold, blokk } = req.body;
    console.log('POST body:', req.body);

    db.query(
        'INSERT INTO notater (interesse, tittel, innhold, blokk) VALUES (?, ?, ?, ?)',
        [interesse, tittel, innhold, blokk || null],
        (err, result) => {
            if (err) {
                console.error('DB feil: ', err);
                res.status(500).json({ error: 'Feil ved innsending' });
            } else {
                res.json({ id: result.insertId, interesse, tittel, innhold, blokk });
            }
        }
    );
});


// henter alle notater for en interesse
router.get('/:interesse', (req, res) => {
    const { interesse } = req.params;
    db.query(
        'SELECT * FROM notater WHERE interesse = ?', 
        [interesse], 
        (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Feil ved henting av notater' });
        } else {
            res.json(result);
        }
    });
});

// henter ett notat basert på ID
router.get('/id/:id', (req, res) => {
    const {id} = req.params;
    db.query(
        'SELECT * FROM notater WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({error: 'Feil ved henting av notat'});
            } else {
                res.json(result[0]);
            }
        }
    );
});


// oppdaterer eksisterende notat
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {tittel, innhold} = req.body;

    db.query(
        'UPDATE notater SET tittel = ?, innhold = ? WHERE id = ?',
        [tittel, innhold, id],
        (err, result) => {
            if (err) {
                console.error('DB feil: ', err);
                return res.status(500).json({error: 'Databasefeil'});
            } 
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Notat ikke funnet' });
            }

        res.json({success: true});
    });
});

module.exports = router;
