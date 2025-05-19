const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Cek apakah user sudah ada
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'User sudah dipakai' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user ke database
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'User berhasil ter-regrestrasi' });
});

// Login User
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Kredensial salah' });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    access_token: token,
    token_type: 'bearer',
    user: {
      id: user._id,
      username: user.username,
      password: req.body.password
    }
  });
});

// Get All User Info
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});


module.exports = router;