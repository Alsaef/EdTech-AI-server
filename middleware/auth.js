const jwt = require('../utils/jwt');

// `required` ensures user is logged in, `optional` attaches user if token present
async function required(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization format' });
    const payload = jwt.verifyToken(parts[1]);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function optional(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return next();
    const payload = jwt.verifyToken(parts[1]);
    req.user = payload;
    next();
  } catch (err) {
    next();
  }
}

module.exports = { required, optional };
