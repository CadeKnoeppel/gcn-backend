import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Log Time Route
router.post('/:id/log-time', async (req, res) => {
  const { id } = req.params;
  const { start, end } = req.body;

  try {
    await User.findByIdAndUpdate(id, {
      $push: { loginLogs: { start, end } }
    });
    res.json({ message: 'Login session recorded' });
  } catch (err) {
    console.error('❌ Time log error:', err);
    res.status(500).json({ error: 'Failed to log time' });
  }
});

// ✅ Get Total Hours for a User
router.get('/hours', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.loginLogs) return res.json({ totalHours: 0 });

    let totalMs = 0;
    for (const log of user.loginLogs) {
      if (log.start && log.end) {
        totalMs += new Date(log.end) - new Date(log.start);
      }
    }

    const totalHours = totalMs / (1000 * 60 * 60); // Convert ms to hrs
    res.json({ totalHours });
  } catch (err) {
    console.error('❌ Error calculating hours:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get list of all users (name + email)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email');
    res.json(users);
  } catch (err) {
    console.error('❌ Failed to fetch users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
