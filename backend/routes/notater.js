// routes/notater.js
const express = require('express');
const router = express.Router();
const { query } = require('../db'); // pg helper
const requireAuth = require('../middleware/auth');

//
// svarer på http://localhost:3000/api/notater
//

// legger til et nytt notat (enten interesse ELLER emne må være satt – ikke begge)
router.post('/', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { interesse = null, emne = null, tittel, innhold, blokkId } = req.body;

  const hasInteresse = !!interesse;
  const hasEmne = !!emne;
  if (!tittel || hasInteresse === hasEmne) {
    return res.status(400).json({ melding: 'mangler tittel eller feil kombinasjon av interesse/emne (kun én tillatt)' });
  }

  const blokkVerdi =
    blokkId !== undefined && blokkId !== null && !isNaN(Number(blokkId)) ? Number(blokkId) : null;

  try {
    const { rows } = await query(
      `insert into notater (user_id, interesse, emne, tittel, innhold, "blokkId")
       values ($1, $2, $3, $4, $5, $6)
       returning "notatId"`,
      [userId, interesse, emne, tittel, innhold || '', blokkVerdi]
    );

    return res.status(201).json({ notatId: rows[0].notatId, melding: 'notat lagret' });
  } catch (err) {
    console.error('feil ved lagring av notat:', err);
    return res.status(500).json({ melding: 'serverfeil' });
  }
});

// henter ett notat basert på id
router.get('/id/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const { rows } = await query(
      'select * from notater where "notatId" = $1 and user_id = $2',
      [id, userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'notat ikke funnet' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('feil ved henting av notat:', err);
    return res.status(500).json({ error: 'feil ved henting av notat' });
  }
});

// henter alle notater for en interesse
router.get('/interesse/:interesse', requireAuth, async (req, res) => {
  const { interesse } = req.params;
  const userId = req.user.id;
  try {
    const { rows } = await query(
      `select * from notater
       where user_id = $1 and interesse = $2 and emne is null
       order by opprettelsesdato desc`,
      [userId, interesse]
    );
    return res.json(rows);
  } catch (err) {
    console.error('feil ved henting av notater (interesse):', err);
    return res.status(500).json({ error: 'feil ved henting av notater' });
  }
});

// henter alle notater for et emne
router.get('/emne/:emne', requireAuth, async (req, res) => {
  const { emne } = req.params;
  const userId = req.user.id;
  try {
    const { rows } = await query(
      `select * from notater
       where user_id = $1 and emne = $2 and interesse is null
       order by opprettelsesdato desc`,
      [userId, emne]
    );
    return res.json(rows);
  } catch (err) {
    console.error('feil ved henting av notater (emne):', err);
    return res.status(500).json({ error: 'feil ved henting av notater' });
  }
});

// oppdaterer eksisterende notat
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { tittel, innhold } = req.body;
  const userId = req.user.id;

  try {
    const result = await query(
      'update notater set tittel = $1, innhold = $2 where "notatId" = $3 and user_id = $4',
      [tittel, innhold, id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'notat ikke funnet' });
    return res.json({ success: true });
  } catch (err) {
    console.error('feil ved oppdatering av notat:', err);
    return res.status(500).json({ error: 'databasefeil' });
  }
});

// sletter notat
router.delete('/:notatId', requireAuth, async (req, res) => {
  const { notatId } = req.params;
  const userId = req.user.id;
  try {
    const result = await query(
      'delete from notater where "notatId" = $1 and user_id = $2',
      [notatId, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ melding: 'notat ikke funnet' });
    return res.status(204).send();
  } catch (err) {
    console.error('feil ved sletting av notat:', err);
    return res.status(500).json({ melding: 'serverfeil ved sletting' });
  }
});

module.exports = router;


