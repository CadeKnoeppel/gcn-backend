import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Lead from '../models/Lead.js';
import Session from '../models/Session.js';

const router = express.Router();

// GET metrics for all employees
router.get('/metrics', async (req, res) => {
  try {
    const users = await User.find();
    const metrics = [];

    for (const user of users) {
      const [tasksCompleted, leadsContacted, sessions] = await Promise.all([
        Task.countDocuments({ assignedTo: user.email, completed: true }),
        Lead.countDocuments({ contactedBy: user.name }),
        Session.find({ userEmail: user.email }),
      ]);

      const totalHours = sessions.reduce((sum, session) => {
        const start = new Date(session.start).getTime();
        const end = new Date(session.end).getTime();
        return sum + (end - start);
      }, 0) / (1000 * 60 * 60); // convert ms to hours

      metrics.push({
        name: user.name,
        email: user.email,
        hours: totalHours.toFixed(2),
        tasksCompleted,
        leadsContacted,
      });
    }

    res.json(metrics);
  } catch (err) {
    console.error('❌ Admin metrics error:', err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router;
