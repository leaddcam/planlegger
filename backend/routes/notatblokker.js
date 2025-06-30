const express = require('express');
const router = express.Router();
const db = require('../db');
//
// svarer på http://localhost:3000/api/notatblokker
//

// legger til notatblokk i notatblokker
router.post('/blokker', async (req, res) => {
  const { interesse, navn } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO notatblokker (interesse, navn, opprettelsesdato, antall_notater) VALUES (?, ?, NOW(), 0)',
      [interesse, navn]
    );

    res.json({ blokkId: result.insertId, interesse, navn });
  } catch (err) {
    console.error('Feil ved opprettelse av blokk:', err);
    res.status(500).json({ error: 'Feil ved opprettelse av blokk' });
  }
});

// Henter alle blokker for en interesse
router.get('/blokker/:interesse', async (req, res) => {
  const { interesse } = req.params;

  try {
    const [result] = await db.query(
      'SELECT * FROM notatblokker WHERE interesse = ?',
      [interesse]
    );
    res.json(result);
  } catch (err) {
    console.error('Feil ved henting av blokker:', err);
    res.status(500).json({ error: 'Feil ved henting av blokker' });
  }
});

//  Henter én blokk basert på blokkId
router.get('/notatblokk/:blokkId', async (req, res) => {
  const blokkId = req.params.blokkId;

  try {
    const [rows] = await db.query(
      'SELECT * FROM notatblokker WHERE blokkId = ?',
      [blokkId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ melding: 'Notatblokk ikke funnet' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Feil ved henting av notatblokk:', err);
    res.status(500).json({ melding: 'Serverfeil' });
  }
});


router.post('/blokk', async (req, res) => {
  const { interesse, navn } = req.body;

  if (!interesse || !navn) {
    return res.status(400).json({ melding: 'Mangler interesse eller navn' });
  }

  try {
    const sql = `INSERT INTO notatblokker (interesse, navn) VALUES (?, ?)`;
    const [result] = await db.query(sql, [interesse, navn]);

    if (!result.insertId) {
      return res.status(500).json({ melding: 'Kunne ikke lagre notatblokk' });
    }

    res.status(201).json({ blokkId: result.insertId, navn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ melding: 'Serverfeil' });
  }
});

module.exports = router;