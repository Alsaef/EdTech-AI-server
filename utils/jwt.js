const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev_secret';

function signToken(payload, options = { expiresIn: '7d' }) {
  return jwt.sign(payload, SECRET, options);
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
