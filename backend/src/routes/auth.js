const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { fetchLeetCodeStats } = require('../services/leetcodeService');

const router = express.Router();

const getAuthErrorMessage = (error, fallback) => {
  if (error?.code === 11000) {
    return 'Username or email already exists';
  }

  if (error?.name === 'ValidationError') {
    return Object.values(error.errors)
      .map((item) => item.message)
      .join(', ');
  }

  return fallback;
};

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      email: user.email,
      leetcodeUsername: user.leetcodeUsername || null,
    },
    process.env.JWT_SECRET || 'dev_secret_change_me',
    { expiresIn: '7d' },
  );

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Store only bcrypt hash in DB, never the raw password.
    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name: String(name).trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        leetcodeUsername: user.leetcodeUsername,
      },
    });
  } catch (error) {
    const message = getAuthErrorMessage(error, 'Registration failed');
    const statusCode = error?.code === 11000 || error?.name === 'ValidationError' ? 400 : 500;
    return res.status(statusCode).json({ message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    const loginValue = String(emailOrUsername).trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: loginValue }, { username: loginValue }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        leetcodeUsername: user.leetcodeUsername,
      },
    });
  } catch (error) {
    const message = getAuthErrorMessage(error, 'Login failed');
    return res.status(500).json({ message });
  }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user });
});

router.post('/profile/leetcode', auth, async (req, res) => {
  try {
    const { leetcodeUsername } = req.body;

    if (!leetcodeUsername) {
      return res.status(400).json({ message: 'LeetCode username is required' });
    }

    const normalizedLeetCodeUsername = String(leetcodeUsername).trim().toLowerCase();
    await fetchLeetCodeStats(normalizedLeetCodeUsername);

    const conflict = await User.findOne({
      leetcodeUsername: normalizedLeetCodeUsername,
      _id: { $ne: req.user.id },
    });

    if (conflict) {
      return res.status(409).json({ message: 'This LeetCode username is already linked to another account' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          leetcodeUsername: normalizedLeetCodeUsername,
        },
      },
      {
        new: true,
      },
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Profile completed successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to set LeetCode username' });
  }
});

module.exports = router;
