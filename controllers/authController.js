const jwt = require('../utils/jwt');
const User = require('../models/User');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({email: email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = jwt.signToken({ id: user._id, role: user.role });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.signToken({ id: user._id, role: user.role });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
