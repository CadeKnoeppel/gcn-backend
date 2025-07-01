import express from 'express';
import Announcement from '../models/Announcement.js';

const router = express.Router();

// 🔹 POST a new announcement
router.post('/', async (req, res) => {
  try {
    const { content, author } = req.body;
    const newAnnouncement = new Announcement({ content, author });
    const saved = await newAnnouncement.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save announcement' });
  }
});

// 🔹 GET all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 }).limit(5);
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

export default router;
