// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import leadRoutes         from './routes/leads.js';
import postRoutes         from './routes/posts.js';
import userRoutes         from './routes/users.js';
import taskRoutes         from './routes/tasks.js';
import adminRoutes        from './routes/admin.js';
import sessionRoutes      from './routes/sessions.js';
import announcementRoutes from './routes/announcements.js';

const app = express();
const PORT = process.env.PORT || 5050;

// CORS whitelist
const allowList = [
  'http://localhost:5173',
  'https://gcn-frontend-ten.vercel.app'
];
// Allow any Vercel preview domain
const vercelPreview = /^https:\/\/gcn-frontend-git-.*\.vercel\.app$/;

const corsOptions = {
  origin: (origin, callback) =>
    !origin || allowList.includes(origin) || vercelPreview.test(origin)
      ? callback(null, true)
      : callback(new Error('CORS not allowed')),
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // pre-flight

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount your routes
app.use('/api/leads',         leadRoutes);
app.use('/api/posts',         postRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/tasks',         taskRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/sessions',      sessionRoutes);
app.use('/api/announcements', announcementRoutes);

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
