// backend/routes/tasks.js
import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// ✅ Get all tasks (assigned to or created by user)
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: email }, { createdBy: email }]
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ✅ Count incomplete tasks
router.get('/due', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const count = await Task.countDocuments({
      assignedTo: email,
      completed: false
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count tasks' });
  }
});

// ✅ Create a new task
router.post('/', async (req, res) => {
  const { title, description, assignedTo, createdBy, dueDate } = req.body;
  if (!title || !assignedTo || !createdBy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      assignedTo,
      createdBy,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});
// ✅ Mark task as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark task complete' });
  }
});

export default router;
