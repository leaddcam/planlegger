// routes/notatblokker.js (PostgreSQL)
const express = require("express");
const router = express.Router();
const { query } = require("../db");
const requireAuth = require("../middleware/auth");

// POST /api/notatblokker/oppdater-antall/:blokkId
router.post("/oppdater-antall/:blokkId", requireAuth, async (req, res) => {
  const { blokkId } = req.params;
  const userId = req.user.id;

  try {
    const { rowCount } = await query(
      `UPDATE notatblokker
       SET antall_notater = antall_notater + 1
       WHERE "blokkId" = $1 AND user_id = $2`,
      [blokkId, userId]
    );

    if (!rowCount) return res.status(404).json({ error: "notatblokk ikke funnet" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("feil ved oppdatering av antall_notater:", err);
    return res.status(500).json({ error: "serverfeil" });
  }
});

async function createBlokk(req, res) {
  const userId = req.user.id;
  const { interesse, emne = null, navn } = req.body;

  if ((!interesse && !emne) || !navn) {
    return res.status(400).json({ error: "mangler interesse/emne eller navn" });
  }

  try {
    const { rows } = await query(
      `INSERT INTO notatblokker (user_id, interesse, emne, navn)
       VALUES ($1, $2, $3, $4)
       RETURNING "blokkId", user_id, interesse, emne, navn, opprettelsesdato, antall_notater`,
      [userId, interesse, emne, navn]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("feil ved opprettelse av blokk:", err);
    return res.status(500).json({ error: "feil ved opprettelse av blokk" });
  }
}

// Begge endepunkter støttes fortsatt (minimal endring), men deler samme handler:
router.post("/blokk", requireAuth, createBlokk);
router.post("/blokker", requireAuth, createBlokk);

// GET /api/notatblokker/blokker/:interesse
router.get("/blokker/:interesse", requireAuth, async (req, res) => {
  const { interesse } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      `SELECT *
       FROM notatblokker
       WHERE interesse = $1 AND user_id = $2
       ORDER BY "blokkId" DESC`,
      [interesse, userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("feil ved henting av blokker:", err);
    return res.status(500).json({ error: "feil ved henting av blokker" });
  }
});

// GET /api/notatblokker/blokker/emne/:emne
router.get("/blokker/emne/:emne", requireAuth, async (req, res) => {
  const { emne } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      `SELECT *
       FROM notatblokker
       WHERE emne = $1 AND user_id = $2
       ORDER BY "blokkId" DESC`,
      [emne, userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("feil ved henting av blokker (emne):", err);
    return res.status(500).json({ error: "feil ved henting av blokker" });
  }
});

// GET /api/notatblokker/blokk/:blokkId
router.get("/blokk/:blokkId", requireAuth, async (req, res) => {
  const { blokkId } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      `SELECT *
       FROM notatblokker
       WHERE "blokkId" = $1 AND user_id = $2`,
      [blokkId, userId]
    );

    if (rows.length === 0) return res.status(404).json({ error: "notatblokk ikke funnet" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("feil ved henting av notatblokk:", err);
    return res.status(500).json({ error: "serverfeil" });
  }
});

// DELETE /api/notatblokker/:blokkId
router.delete("/:blokkId", requireAuth, async (req, res) => {
  const { blokkId } = req.params;
  const userId = req.user.id;

  try {
    // slett notater i blokken for denne brukeren
    await query(
      `DELETE FROM notater WHERE "blokkId" = $1 AND user_id = $2`,
      [blokkId, userId]
    );

    // slett selve blokken
    const { rowCount } = await query(
      `DELETE FROM notatblokker WHERE "blokkId" = $1 AND user_id = $2`,
      [blokkId, userId]
    );

    if (!rowCount) return res.status(404).json({ error: "notatblokk ikke funnet" });
    return res.status(204).send();
  } catch (err) {
    console.error("feil ved sletting av notatblokk:", err);
    return res.status(500).json({ error: "serverfeil ved sletting" });
  }
});

module.exports = router;
