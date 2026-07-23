import { query } from '../config/db.js';

export async function createJob(type, payload = {}) {
  const result = await query(
    `INSERT INTO jobs (type, status, payload, attempts) VALUES (?, 'pending', ?, 0)`,
    [type, JSON.stringify(payload)]
  );
  return { id: result.insertId, type, status: 'pending', payload };
}

export async function getNextPendingJob() {
  const jobs = await query(
    `SELECT * FROM jobs WHERE status = 'pending' AND attempts < 3 ORDER BY id ASC LIMIT 1`
  );
  return jobs.length > 0 ? jobs[0] : null;
}

export async function updateJobStatus(jobId, status, errorMessage = null, attempts = null) {
  let sql = `UPDATE jobs SET status = ?`;
  let params = [status];

  if (errorMessage !== null) {
    sql += `, error_message = ?`;
    params.push(errorMessage);
  }

  if (attempts !== null) {
    sql += `, attempts = ?`;
    params.push(attempts);
  }

  sql += ` WHERE id = ?`;
  params.push(jobId);

  await query(sql, params);
}

export async function getJobById(jobId) {
  const jobs = await query(`SELECT * FROM jobs WHERE id = ?`, [jobId]);
  return jobs.length > 0 ? jobs[0] : null;
}

export async function getAllJobs() {
  return query(`SELECT * FROM jobs ORDER BY id DESC LIMIT 50`);
}
