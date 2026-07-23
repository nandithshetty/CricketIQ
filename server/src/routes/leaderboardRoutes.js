import express from 'express';
import { getLeaderboards } from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', getLeaderboards);

export default router;
