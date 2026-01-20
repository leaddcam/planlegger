// middleware/auth.js
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function requireAuth(req, res, next) {
  const token = req.cookies?.[config.auth.cookieName];
  if (!token) {
    return res.status(401).json({ error: "Ikke innlogget" });
  }

  try {
    const { uid } = jwt.verify(token, config.auth.jwtSecret);
    req.user = { id: uid };
    next();
  } catch {
    res.status(401).json({ error: "Ugyldig sesjon" });
  }
};

