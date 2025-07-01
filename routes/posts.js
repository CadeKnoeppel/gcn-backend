import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST a new post
router.post('/', async (req, res) => {
  const { title, author, content } = req.body;
  if (!title || !author || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newPost = new Post({ title, author, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("❌ Error saving post:", err);
    res.status(500).json({ error: 'Failed to save post' });
  }
});

export default router;
