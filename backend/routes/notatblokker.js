// routes/notatblokker.js (PostgreSQL-versjon)
const express = require('express');
const router = express.Router();
const { query } = require('../db'); // pg helper
const requireAuth = require('../middleware/auth');

//
// svarer på http://localhost:3031/api/notater
//


// øker antall_notater med 1
router.post('/oppdater-antall/:blokkId', requireAuth, async (req, res) => {
  const {blokkId} = req.params;
  const userId = req.user.id;

  try {
    const { rowCount } = await query(
      'update notatblokker set antall_notater = antall_notater + 1 where "blokkId" = $1 and user_id = $2',
      [blokkId, userId]
    );
    if (!rowCount) return res.status(404).json({ melding: 'notatblokk ikke funnet' });
    res.json({ melding: 'notatblokk oppdatert' });
  } catch (err) {
    console.error('feil ved oppdatering av antall_notater:', err);
    res.status(500).json({ melding: 'serverfeil' });
  }
});

// legger til notatblokk 
router.post('/blokk', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { interesse, emne = null, navn } = req.body;

  if ((!interesse && !emne) || !navn) {
    return res.status(400).json({ melding: 'mangler interesse/emne eller navn' });
  }

  try {
    const { rows } = await query(
      `insert into notatblokker (user_id, interesse, emne, navn)
       values ($1, $2, $3, $4)
       returning "blokkId", user_id, interesse, emne, navn, opprettelsesdato, antall_notater`,
      [userId, interesse, emne, navn]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('feil ved opprettelse av blokk:', err);
    res.status(500).json({ melding: 'feil ved opprettelse av blokk' });
  }
});

// ved behov for eget /blokker-endepunkt med både interesse og emne-støtte
// alternativt endepunkt /blokker (samme logikk)
router.post('/blokker', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { interesse, emne = null, navn } = req.body;

  if ((!interesse && !emne) || !navn) {
    return res.status(400).json({ melding: 'mangler interesse/emne eller navn' });
  }

  try {
    const { rows } = await query(
      `insert into notatblokker (user_id, interesse, emne, navn)
       values ($1, $2, $3, $4)
       returning "blokkId", user_id, interesse, emne, navn, opprettelsesdato, antall_notater`,
      [userId, interesse, emne, navn]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('feil ved opprettelse av blokk:', err);
    res.status(500).json({ error: 'feil ved opprettelse av blokk' });
  }
});

// henter alle blokker for en interesse
router.get('/blokker/:interesse', requireAuth, async (req, res) => {
  const { interesse } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      'select * from notatblokker where interesse = $1 and user_id = $2 order by "blokkId" desc',
      [interesse, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('feil ved henting av blokker:', err);
    res.status(500).json({ error: 'feil ved henting av blokker' });
  }
});

// henter alle blokker for et emne
router.get('/blokker/emne/:emne', requireAuth, async (req, res) => {
  const { emne } = req.params;
  const userId = req.user.id;
  try {
    const { rows } = await query(
      'select * from notatblokker where emne = $1 and user_id = $2 order by "blokkId" desc',
      [emne, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('feil ved henting av blokker (emne):', err);
    res.status(500).json({ error: 'feil ved henting av blokker' });
  }
});


// henter én blokk basert på blokkId
router.get('/blokk/:blokkId', requireAuth, async (req, res) => {
  const { blokkId } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      'select * from notatblokker where "blokkId" = $1 and user_id = $2',
      [blokkId, userId]
    );
    if (rows.length === 0) return res.status(404).json({ melding: 'notatblokk ikke funnet' });
    res.json(rows[0]);
  } catch (err) {
    console.error('feil ved henting av notatblokk:', err);
    res.status(500).json({ melding: 'serverfeil' });
  }
});

// DELETE
router.delete('/:blokkId', requireAuth, async (req, res) => {
  const { blokkId } = req.params;
  const userId = req.user.id;

  try {
    // slett notater i blokken for denne brukeren
    await query('delete from notater where "blokkId" = $1 and user_id = $2', [blokkId, userId]);

    // slett selve blokken
    const result = await query('delete from notatblokker where "blokkId" = $1 and user_id = $2', [blokkId, userId]);
    if (result.rowCount === 0) return res.status(404).json({ melding: 'notatblokk ikke funnet' });

    res.status(204).send();
  } catch (err) {
    console.error('feil ved sletting av notatblokk:', err);
    res.status(500).json({ melding: 'serverfeil ved sletting' });
  }
});

module.exports = router;
