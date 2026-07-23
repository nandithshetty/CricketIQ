import express from 'express';
import {
  search,
  getProfile,
  getAISummary,
  compare,
  getOpposition,
  getVenues
} from '../controllers/playerController.js';

const router = express.Router();

router.get('/search', search);
router.get('/compare', compare);
router.get('/:id', getProfile);
router.get('/:id/ai-summary', getAISummary);
router.get('/:id/opposition/:teamId?', getOpposition);
router.get('/:id/venues', getVenues);

export default router;
