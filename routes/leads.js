import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

/* ───── GET /api/leads ─────
   Query:  user (string, required), limit (number, default 10, max 100)
   1) Claim up to `limit` leads with no assignedTo
   2) Return that user’s assigned leads (up to `limit`), newest first
──────────────────────────── */
router.get('/', async (req, res) => {
  const { user, limit = 10 } = req.query;
  if (!user) return res.status(400).json({ error: 'Missing user name' });
  const lim = Math.min(Number(limit) || 10, 100);

  try {
    // 1️⃣ Claim unassigned
    const unclaimed = await Lead.find({ assignedTo: { $exists: false } })
      .select('_id')
      .limit(lim)
      .lean();

    if (unclaimed.length) {
      await Lead.updateMany(
        { _id: { $in: unclaimed.map(d => d._id) } },
        { $set: { assignedTo: user } }
      );
    }

    // 2️⃣ Fetch this user’s batch
    const leads = await Lead.find({ assignedTo: user })
      .sort({ timestamp: -1 })
      .limit(lim);

    res.json(leads);
  } catch (err) {
    console.error('❌ Failed to fetch/assign leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

/* ── GET /api/leads/daily-completed ──
   Query: email (string, required)
   Returns how many leads this email has marked contacted today
───────────────────────────────────── */
router.get('/daily-completed', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  try {
    const count = await Lead.countDocuments({
      contactedEmail: email,
      contacted: true,
      contactedAt: { $gte: startOfDay }
    });
    res.json({ count });
  } catch (err) {
    console.error('❌ Failed to count daily leads:', err);
    res.status(500).json({ error: 'Failed to count leads' });
  }
});

/* ── PATCH /api/leads/:id ──
   Body: any Lead field(s) to update
   If you set `contacted: true` it will stamp `contactedAt` now (if not provided)
─────────────────────────── */
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const update = { ...req.body };

  // auto-stamp contactedAt if marking contacted
  if (update.contacted === true && !update.contactedAt) {
    update.contactedAt = new Date();
  }

  try {
    const updated = await Lead.findByIdAndUpdate(id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update lead:', err);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

export default router;
