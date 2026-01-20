const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { query } = require('../db');

const config = require("../config"); // new

const COOKIE_OPTS = {
  ...config.auth.cookie,
  maxAge: 1000 * 60 * 60 * 24 * config.auth.tokenDays,
};

function setSessionCookie(res, uid) {
  const token = jwt.sign({ uid }, config.auth.jwtSecret, { expiresIn: `${config.auth.tokenDays}d` });
  res.cookie(config.auth.cookieName, token, COOKIE_OPTS);
}

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: config.mail.smtp.host,
  port: config.mail.smtp.port,
  auth: { user: config.mail.smtp.user, pass: config.mail.smtp.pass }
});

// quick startup check for SMTP; harmless if it fails in dev
transporter.verify()
  .then(() => console.log('smtp ok'))
  .catch(err => console.warn('smtp not ready (dev ok):', err.message));

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Mangler e-post og passord' });

  try {
    const hash = await argon2.hash(password);
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, display_name, email_verified)
       VALUES ($1,$2,$3,false)
       RETURNING id, email, display_name, email_verified`,
      [email, hash, displayName || null]
    );
    const user = rows[0];

    // create verification token (valid 24h)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24*60*60*1000);
    await query(
      `INSERT INTO email_verifications (user_id, token, expires_at) VALUES ($1,$2,$3)`,
      [user.id, token, expires]
    );

    const verifyUrl = `${config.app.origin}/verify-email?token=${token}`;

    // dev path: skip email and return the link
    if (config.mail.devSkipEmail) {
      return res.status(201).json({
        ok: true,
        message: 'Bruker opprettet (dev). Åpne verify_url for å bekrefte.',
        verify_url: verifyUrl
      });
    }

    // prod path: try to send; on failure, still succeed and include the link
    try {
      await transporter.sendMail({
        to: user.email,
        from: config.mail.from,
        subject: 'Bekreft e-posten din',
        text: `Klikk for å bekrefte: ${verifyUrl}`,
        html: `<p>Klikk for å bekrefte:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
      });
      return res.status(201).json({ ok: true, message: 'Bruker opprettet. Sjekk e-post for bekreftelse.' });
    } catch (mailErr) {
      console.error('sendMail feilet:', mailErr.message);
      return res.status(201).json({
        ok: true,
        message: 'Bruker opprettet, men sending av e-post feilet. Bruk verify_url manuelt.',
        verify_url: verifyUrl
      });
    }
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'E-post er allerede i bruk' });
    console.error('REGISTER 500:', err);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

// GET /api/auth/verify?token=...
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Token mangler');

  try {
    const { rows } = await query(
      `SELECT user_id, expires_at FROM email_verifications WHERE token=$1`,
      [token]
    );
    if (rows.length === 0) return res.status(400).send('Ugyldig token');

    const rec = rows[0];
    if (new Date(rec.expires_at) < new Date()) return res.status(400).send('Token er utløpt');

    await query(`UPDATE users SET email_verified=true WHERE id=$1`, [rec.user_id]);
    await query(`DELETE FROM email_verifications WHERE token=$1`, [token]);

    setSessionCookie(res, rec.user_id); // reuse helper
    res.redirect(`${config.app.origin}/home`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Serverfeil');
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Mangler e-post og passord' });

  try {
    const { rows } = await query(
      `SELECT id, email, password_hash, display_name, email_verified FROM users WHERE email=$1`,
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Feil e-post eller passord' });

    const u = rows[0];
    const ok = await argon2.verify(u.password_hash, password);
    if (!ok) return res.status(401).json({ error: 'Feil e-post eller passord' });

    // krev verifisering før innlogging:
    // if (!u.email_verified) return res.status(403).json({ error: 'Bekreft e-post før innlogging' });

    setSessionCookie(res, u.id);
    res.json({ user: { id: u.id, email: u.email, display_name: u.display_name, email_verified: u.email_verified } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie(config.auth.cookieName, { ...COOKIE_OPTS, maxAge: 0 });
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const token = req.cookies?.[config.auth.cookieName];
  if (!token) return res.json({ user: null });

  try {
    const { uid } = jwt.verify(token, config.auth.jwtSecret);
    const { rows } = await query(`SELECT id, email, display_name, email_verified FROM users WHERE id=$1`, [uid]);
    res.json({ user: rows[0] || null });
  } catch {
    res.json({ user: null });
  }
});

module.exports = router;
