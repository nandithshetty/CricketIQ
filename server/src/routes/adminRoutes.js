import express from 'express';
import { triggerImport, getImportStatus, getJobsList, getCacheStats } from '../controllers/adminController.js';

const router = express.Router();

router.post('/import', triggerImport);
router.get('/import/:jobId', getImportStatus);
router.get('/jobs', getJobsList);
router.get('/cache', getCacheStats);

export default router;
