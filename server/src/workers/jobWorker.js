import { getNextPendingJob, updateJobStatus } from '../models/jobModel.js';
import { recomputePlayerCareerStats, recomputeAllCareerStats } from '../models/statsModel.js';
import { generatePlayerAISummary } from '../ai/geminiService.js';
import { query } from '../config/db.js';

let isWorkerRunning = false;
let timerId = null;

export function startJobWorker() {
  if (isWorkerRunning) return;
  isWorkerRunning = true;
  console.log('🔄 Background Job Worker started (polling every 3s)...');
  timerId = setInterval(processJobs, 3000);
}

export function stopJobWorker() {
  if (timerId) clearInterval(timerId);
  isWorkerRunning = false;
  console.log('⏹️ Background Job Worker stopped.');
}

async function processJobs() {
  let job = null;
  try {
    job = await getNextPendingJob();
    if (!job) return;

    console.log(`⚙️ Worker processing job #${job.id} [${job.type}] (Attempt ${job.attempts + 1})...`);

    // Mark as running
    await updateJobStatus(job.id, 'running', null, job.attempts + 1);

    const payload = typeof job.payload === 'string' ? JSON.parse(job.payload || '{}') : job.payload || {};

    if (job.type === 'career_stats_recompute') {
      if (payload.playerId) {
        await recomputePlayerCareerStats(payload.playerId);
      } else {
        await recomputeAllCareerStats();
      }
    } else if (job.type === 'ai_summary_regenerate') {
      if (payload.playerId) {
        await generatePlayerAISummary(payload.playerId);
      } else {
        const players = await query(`SELECT id FROM players`);
        for (const p of players) {
          await generatePlayerAISummary(p.id);
        }
      }
    } else if (job.type === 'data_import') {
      await recomputeAllCareerStats();
    } else {
      throw new Error(`Unknown job type: ${job.type}`);
    }

    await updateJobStatus(job.id, 'completed');
    console.log(`✅ Job #${job.id} [${job.type}] completed successfully.`);
  } catch (err) {
    if (job) {
      const attempts = (job.attempts || 0) + 1;
      const status = attempts >= 3 ? 'failed' : 'pending';
      console.error(`❌ Job #${job.id} failed (attempt ${attempts}/3):`, err.message);
      await updateJobStatus(job.id, status, err.message, attempts);
    }
  }
}
