// routes/notater.js (PostgreSQL)
const express = require("express");
const router = express.Router();
const { query } = require("../db");
const requireAuth = require("../middleware/auth");

// POST /api/notater
// legger til et nytt notat (enten interesse ELLER emne må være satt – ikke begge)
router.post("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { interesse = null, emne = null, tittel, innhold = "", blokkId } = req.body;

  const hasInteresse = interesse !== null && String(interesse).trim() !== "";
  const hasEmne = emne !== null && String(emne).trim() !== "";

  if (!tittel || !String(tittel).trim()) {
    return res.status(400).json({ error: "mangler tittel" });
  }
  if (hasInteresse === hasEmne) {
    // enten begge true eller begge false => ugyldig
    return res.status(400).json({
      error: "feil kombinasjon av interesse/emne (kun én tillatt)",
    });
  }

  const blokkVerdi =
    blokkId !== undefined && blokkId !== null && Number.isFinite(Number(blokkId))
      ? Number(blokkId)
      : null;

  try {
    const { rows } = await query(
      `INSERT INTO notater (user_id, interesse, emne, tittel, innhold, "blokkId")
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING "notatId"`,
      [userId, hasInteresse ? interesse : null, hasEmne ? emne : null, tittel, innhold, blokkVerdi]
    );

    return res.status(201).json({ notatId: rows[0].notatId, ok: true });
  } catch (err) {
    console.error("feil ved lagring av notat:", err);
    return res.status(500).json({ error: "serverfeil" });
  }
});

// GET /api/notater/id/:id
router.get("/id/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      `SELECT *
       FROM notater
       WHERE "notatId" = $1 AND user_id = $2`,
      [id, userId]
    );

    if (rows.length === 0) return res.status(404).json({ error: "notat ikke funnet" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("feil ved henting av notat:", err);
    return res.status(500).json({ error: "feil ved henting av notat" });
  }
});

// GET /api/notater/interesse/:interesse
router.get("/interesse/:interesse", requireAuth, async (req, res) => {
  const { interesse } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      `SELECT *
       FROM notater
       WHERE user_id = $1
         AND interesse = $2
         AND emne IS NULL
       ORDER BY opprettelsesdato DESC`,
      [userId, interesse]
    );

    return res.json(rows);
  } catch (err) {
    console.error("feil ved henting av notater (interesse):", err);
    return res.status(500).json({ error: "feil ved henting av notater" });
  }
});

// GET /api/notater/emne/:emne
router.get("/emne/:emne", requireAuth, async (req, res) => {
  const { emne } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await query(
      `SELECT *
       FROM notater
       WHERE user_id = $1
         AND emne = $2
         AND interesse IS NULL
       ORDER BY opprettelsesdato DESC`,
      [userId, emne]
    );

    return res.json(rows);
  } catch (err) {
    console.error("feil ved henting av notater (emne):", err);
    return res.status(500).json({ error: "feil ved henting av notater" });
  }
});

// PUT /api/notater/:id
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { tittel, innhold } = req.body;
  const userId = req.user.id;

  // Minimal validering (samme som før, bare litt tryggere)
  if (tittel !== undefined && !String(tittel).trim()) {
    return res.status(400).json({ error: "tittel kan ikke være tom" });
  }

  try {
    const { rowCount } = await query(
      `UPDATE notater
       SET tittel = $1,
           innhold = $2
       WHERE "notatId" = $3 AND user_id = $4`,
      [tittel, innhold, id, userId]
    );

    if (!rowCount) return res.status(404).json({ error: "notat ikke funnet" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("feil ved oppdatering av notat:", err);
    return res.status(500).json({ error: "databasefeil" });
  }
});

// DELETE /api/notater/:notatId
router.delete("/:notatId", requireAuth, async (req, res) => {
  const { notatId } = req.params;
  const userId = req.user.id;

  try {
    const { rowCount } = await query(
      `DELETE FROM notater
       WHERE "notatId" = $1 AND user_id = $2`,
      [notatId, userId]
    );

    if (!rowCount) return res.status(404).json({ error: "notat ikke funnet" });
    return res.status(204).send();
  } catch (err) {
    console.error("feil ved sletting av notat:", err);
    return res.status(500).json({ error: "serverfeil ved sletting" });
  }
});

module.exports = router;
