// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

module.exports = function requireAuth(req, res, next) {
  const token = req.cookies?.sid;
  if (!token) return res.status(401).json({ error: 'Ikke innlogget' });
  try {
    const { uid } = jwt.verify(token, JWT_SECRET);
    req.user = { id: uid };
    next();
  } catch {
    res.status(401).json({ error: 'Ugyldig sesjon' });
  }
};
