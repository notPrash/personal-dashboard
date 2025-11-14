const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const db = require('../models/db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// SIGNUP
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  await db.read();
  if (db.data.users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 8);
  const user = { id: nanoid(), username, email, passwordHash };

  db.data.users.push(user);
  await db.write();

  return res.json({ message: "Signup success" });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  await db.read();
  const user = db.data.users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );

  return res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// GET LOGGED IN USER
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    await db.read();
    const user = db.data.users.find(u => u.id === payload.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
