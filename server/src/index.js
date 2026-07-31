// CricketIQ Analytics Platform API Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './config/db.js';
import { ensureAdminUserExists } from './models/userModel.js';
import { startJobWorker } from './workers/jobWorker.js';

import playerRoutes from './routes/playerRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/players', playerRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CricketIQ Analytics Platform API', timestamp: new Date() });
});

async function startServer() {
  try {
    const dbMode = await initDb();
    console.log(`🚀 Database layer active in [${dbMode.toUpperCase()}] mode.`);
    await ensureAdminUserExists();

    // Start background job polling worker
    startJobWorker();

    app.listen(PORT, () => {
      console.log(`⚡ CricketIQ Backend API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('💥 Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
