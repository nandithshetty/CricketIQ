import { createJob, getJobById, getAllJobs } from '../models/jobModel.js';
import cache from '../cache/cacheManager.js';

export async function triggerImport(req, res) {
  try {
    const { type = 'career_stats_recompute', payload = {} } = req.body;
    const job = await createJob(type, payload);
    res.status(202).json({
      message: 'Import job queued successfully',
      jobId: job.id,
      job
    });
  } catch (err) {
    console.error('Error queuing import job:', err);
    res.status(500).json({ error: 'Failed to queue import job' });
  }
}

export async function getImportStatus(req, res) {
  try {
    const { jobId } = req.params;
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error('Error fetching job status:', err);
    res.status(500).json({ error: 'Failed to fetch job status' });
  }
}

export async function getJobsList(req, res) {
  try {
    const jobs = await getAllJobs();
    res.json(jobs);
  } catch (err) {
    console.error('Error listing jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs list' });
  }
}

export async function getCacheStats(req, res) {
  res.json(cache.getStats());
}
