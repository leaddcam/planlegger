// routes/notatblokker.js (PostgreSQL-versjon)
const express = require('express');
const router = express.Router();
const { query } = require('../db'); // <- pg helper

// Øker antall_notater med 1
router.post('/oppdater-antall/:blokkId', async (req, res) => {
  const blokkId = req.params.blokkId;

  try {
    const result = await query(
      'UPDATE notatblokker SET antall_notater = antall_notater + 1 WHERE "blokkId" = $1',
      [blokkId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ melding: 'Notatblokk ikke funnet' });
    }

    res.json({ melding: 'Notatblokk oppdatert' });
  } catch (err) {
    console.error('Feil ved oppdatering av antall_notater:', err);
    res.status(500).json({ melding: 'Serverfeil' });
  }
});

// Legger til notatblokk (variant 1 – bare interesse + navn)
router.post('/blokk', async (req, res) => {
  const { interesse, emne = null, navn } = req.body;

  if ((!interesse && !emne) || !navn) {
    return res.status(400).json({ melding: 'Mangler interesse/emne eller navn' });
  }

  try {
    const sql = `
      INSERT INTO notatblokker (interesse, emne, navn)
      VALUES ($1, $2, $3)
      RETURNING "blokkId", interesse, emne, navn, opprettelsesdato, antall_notater
    `;
    const values = [interesse, emne, navn];
    const { rows } = await query(sql, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Feil ved opprettelse av blokk:', err);
    res.status(500).json({ melding: 'Feil ved opprettelse av blokk' });
  }
});

// (Beholdes kun hvis du trenger en egen /blokker-endepunkt – her med både interesse & emne-støtte)
router.post('/blokker', async (req, res) => {
  const { interesse, emne = null, navn } = req.body;

  if ((!interesse && !emne) || !navn) {
    return res.status(400).json({ melding: 'Mangler interesse/emne eller navn' });
  }

  try {
    const { rows } = await query(
      `INSERT INTO notatblokker (interesse, emne, navn)
       VALUES ($1, $2, $3)
       RETURNING "blokkId", interesse, emne, navn, opprettelsesdato, antall_notater`,
      [interesse, emne, navn]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Feil ved opprettelse av blokk:', err);
    res.status(500).json({ error: 'Feil ved opprettelse av blokk' });
  }
});

// Henter alle blokker for en interesse
router.get('/blokker/:interesse', async (req, res) => {
  const { interesse } = req.params;

  try {
    const { rows } = await query(
      'SELECT * FROM notatblokker WHERE interesse = $1 ORDER BY "blokkId" DESC',
      [interesse]
    );
    res.json(rows);
  } catch (err) {
    console.error('Feil ved henting av blokker:', err);
    res.status(500).json({ error: 'Feil ved henting av blokker' });
  }
});

// henter alle blokker for et emne
router.get('/blokker/emne/:emne', async (req, res) => {
  const { emne } = req.params;
  try {
    const { rows } = await query(
      'SELECT * FROM notatblokker WHERE emne = $1 ORDER BY "blokkId" DESC',
      [emne]
    );
    res.json(rows);
  } catch (err) {
    console.error('Feil ved henting av blokker (emne):', err);
    res.status(500).json({ error: 'Feil ved henting av blokker' });
  }
});


// Henter én blokk basert på blokkId
router.get('/blokk/:blokkId', async (req, res) => {
  const blokkId = req.params.blokkId;

  try {
    const { rows } = await query(
      'SELECT * FROM notatblokker WHERE "blokkId" = $1',
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

// DELETE
router.delete('/:blokkId', async (req, res) => {
  const blokkId = req.params.blokkId;

  try {
    // 1) Slett notater i blokken
    await query('DELETE FROM notater WHERE "blokkId" = $1', [blokkId]);

    // 2) Slett selve blokken
    const result = await query('DELETE FROM notatblokker WHERE "blokkId" = $1', [blokkId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ melding: 'Notatblokk ikke funnet' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Feil ved sletting av notatblokk:', err);
    res.status(500).json({ melding: 'Serverfeil ved sletting' });
  }
});

module.exports = router;
