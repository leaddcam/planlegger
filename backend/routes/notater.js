const express = require('express');
const router = express.Router();
const db = require('../db');
//
// svarer på http://localhost:3000/api/notater
//

// Legger til et nytt notat
router.post('/', async (req, res) => {
  const { interesse, tittel, innhold, blokkId } = req.body;
  console.log("routes/notater.js: ");
  console.log(req.body);

  if (!interesse || !tittel) {
    return res.status(400).json({ melding: 'Mangler data' });
  }

  try {
    const blokkVerdi = (blokkId && !isNaN(Number(blokkId))) ? Number(blokkId) : null;
    const sql = `INSERT INTO notater (interesse, tittel, innhold, blokkId) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [interesse, tittel, innhold || '', blokkVerdi]);

    console.log('Insert result:', result);
    if (!result.insertId) {
      return res.status(500).json({ melding: 'Kunne ikke lagre notat - mangler insertId' });
    }

    res.status(201).json({ notatId: result.insertId, melding: 'Notat lagret' });
  } catch (err) {
    console.error('Feil ved lagring av notat:', err);
    res.status(500).json({ melding: 'Serverfeil' });
  }
});

//  Henter alle notater for en interesse
router.get('/:interesse', async (req, res) => {
  const { interesse } = req.params;
  console.log("🔍 Mottatt GET-forespørsel for interesse:", interesse);

  try {
    const [result] = await db.query('SELECT * FROM notater WHERE interesse = ?', [interesse]);
    res.json(result);
  } catch (err) {
    console.error("Feil ved henting av notater:", err);
    res.status(500).json({ error: 'Feil ved henting av notater' });
  }
});

//  Henter ett notat basert på ID
router.get('/id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('SELECT * FROM notater WHERE notatId = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Notat ikke funnet' });
    }
    res.json(result[0]);
  } catch (err) {
    console.error('Feil ved henting av notat:', err);
    res.status(500).json({ error: 'Feil ved henting av notat' });
  }
});

//  Oppdaterer eksisterende notat
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tittel, innhold } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE notater SET tittel = ?, innhold = ? WHERE notatId = ?',
      [tittel, innhold, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notat ikke funnet' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Feil ved oppdatering av notat:', err);
    res.status(500).json({ error: 'Databasefeil' });
  }
});

// DELETE ( ett notat )
router.delete('/:notatId', async (req, res) => {
  const { notatId } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM notater WHERE notatId = ?',
      [notatId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ melding: 'Notat ikke funnet' });
    }

    res.status(204).send(); // OK, ingen innhold
  } catch (err) {
    console.error('Feil ved sletting av notat:', err);
    res.status(500).json({ melding: 'Serverfeil ved sletting' });
  }
});


module.exports = router;

