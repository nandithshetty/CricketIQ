import express from 'express';
import { triggerImport, getImportStatus, getJobsList, getCacheStats } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce authentication & admin role check for all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

router.post('/import', triggerImport);
router.get('/import/:jobId', getImportStatus);
router.get('/jobs', getJobsList);
router.get('/cache', getCacheStats);

export default router;
