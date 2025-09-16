// routes/notater.js
const express = require('express');
const router = express.Router();
const { query } = require('../db'); // pg helper

//
// svarer på http://localhost:3000/api/notater
//

// Legger til et nytt notat (enten interesse ELLER emne må være satt – ikke begge)
router.post('/', async (req, res) => {
  const { interesse = null, emne = null, tittel, innhold, blokkId } = req.body;
  console.log('routes/notater.js body:', req.body);

  // Eksakt én av interesse/emne må være satt
  const hasInteresse = !!interesse;
  const hasEmne = !!emne;
  if (!tittel || hasInteresse === hasEmne) {
    return res.status(400).json({ melding: 'Mangler tittel eller feil kombinasjon av interesse/emne (kun én tillatt)' });
  }

  const blokkVerdi =
    blokkId !== undefined && blokkId !== null && !isNaN(Number(blokkId)) ? Number(blokkId) : null;

  try {
    const { rows } = await query(
      `INSERT INTO notater (interesse, emne, tittel, innhold, "blokkId")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING "notatId"`,
      [interesse, emne, tittel, innhold || '', blokkVerdi]
    );

    return res.status(201).json({ notatId: rows[0].notatId, melding: 'Notat lagret' });
  } catch (err) {
    console.error('Feil ved lagring av notat:', err);
    return res.status(500).json({ melding: 'Serverfeil' });
  }
});

// Hent ett notat basert på ID (plasser denne FØR “/interesse/..” og “/emne/..” for å unngå routing-kollisjon)
router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await query('SELECT * FROM notater WHERE "notatId" = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Notat ikke funnet' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Feil ved henting av notat:', err);
    return res.status(500).json({ error: 'Feil ved henting av notat' });
  }
});

// Hent alle notater for en INTERESSE (emne er NULL i disse radene)
router.get('/interesse/:interesse', async (req, res) => {
  const { interesse } = req.params;
  try {
    const { rows } = await query(
      `SELECT * FROM notater
       WHERE interesse = $1 AND emne IS NULL
       ORDER BY opprettelsesdato DESC`,
      [interesse]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Feil ved henting av notater (interesse):', err);
    return res.status(500).json({ error: 'Feil ved henting av notater' });
  }
});

// Hent alle notater for et EMNE (interesse er NULL i disse radene)
router.get('/emne/:emne', async (req, res) => {
  const { emne } = req.params;
  try {
    const { rows } = await query(
      `SELECT * FROM notater
       WHERE emne = $1 AND interesse IS NULL
       ORDER BY opprettelsesdato DESC`,
      [emne]
    );
    return res.json(rows);
  } catch (err) {
    console.error('Feil ved henting av notater (emne):', err);
    return res.status(500).json({ error: 'Feil ved henting av notater' });
  }
});

// Oppdater eksisterende notat (tittel/innhold)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tittel, innhold } = req.body;

  try {
    const result = await query(
      'UPDATE notater SET tittel = $1, innhold = $2 WHERE "notatId" = $3',
      [tittel, innhold, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Notat ikke funnet' });
    return res.json({ success: true });
  } catch (err) {
    console.error('Feil ved oppdatering av notat:', err);
    return res.status(500).json({ error: 'Databasefeil' });
  }
});

// Slett notat
router.delete('/:notatId', async (req, res) => {
  const { notatId } = req.params;
  try {
    const result = await query('DELETE FROM notater WHERE "notatId" = $1', [notatId]);
    if (result.rowCount === 0) return res.status(404).json({ melding: 'Notat ikke funnet' });
    return res.status(204).send();
  } catch (err) {
    console.error('Feil ved sletting av notat:', err);
    return res.status(500).json({ melding: 'Serverfeil ved sletting' });
  }
});

module.exports = router;


