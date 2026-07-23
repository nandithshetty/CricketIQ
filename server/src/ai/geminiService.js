import { GoogleGenerativeAI } from '@google/generative-ai';
import { query } from '../config/db.js';
import { getPlayerById, getPlayerCareerStats } from '../models/playerModel.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI = null;

if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key') {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generatePlayerAISummary(playerId) {
  const player = await getPlayerById(playerId);
  if (!player) throw new Error(`Player ID ${playerId} not found`);

  const careerStats = await getPlayerCareerStats(playerId);
  const overallStats = careerStats.filter((cs) => cs.season === null);

  const formattedStats = overallStats.map((s) => ({
    format: s.format,
    matches: s.matches,
    runs: s.runs,
    battingAverage: s.average,
    strikeRate: s.strike_rate,
    hundreds: s.hundreds,
    fifties: s.fifties,
    highestScore: s.highest_score,
    wickets: s.wickets,
    bowlingAverage: s.bowling_average,
    economy: s.economy
  }));

  const statsJson = JSON.stringify(formattedStats, null, 2);
  let summaryText = '';

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a professional cricket analytics assistant. 
Given these verified statistics for ${player.name} (${player.country}, ${player.role}):
${statsJson}

Rule: Summarize their career strengths, versatility across formats, and key impact in 2-3 concise sentences. DO NOT invent any numbers, statistics, or records not explicitly provided in the stats above.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      summaryText = response.text().trim();
    } catch (err) {
      console.warn(`⚠️ Gemini API call failed for player ${player.name}:`, err.message);
      summaryText = buildDeterministicAnalyticalSummary(player, formattedStats);
    }
  } else {
    summaryText = buildDeterministicAnalyticalSummary(player, formattedStats);
  }

  // Save or update in ai_summaries table
  const existing = await query(`SELECT player_id FROM ai_summaries WHERE player_id = ?`, [playerId]);
  if (existing.length > 0) {
    await query(
      `UPDATE ai_summaries SET summary_text = ?, generated_at = CURRENT_TIMESTAMP WHERE player_id = ?`,
      [summaryText, playerId]
    );
  } else {
    await query(
      `INSERT INTO ai_summaries (player_id, summary_text) VALUES (?, ?)`,
      [playerId, summaryText]
    );
  }

  return summaryText;
}

export async function getPlayerAISummary(playerId, forceRegenerate = false) {
  if (!forceRegenerate) {
    const rows = await query(`SELECT summary_text, generated_at FROM ai_summaries WHERE player_id = ?`, [playerId]);
    if (rows.length > 0) {
      return { summary: rows[0].summary_text, generatedAt: rows[0].generated_at, cached: true };
    }
  }

  const newSummary = await generatePlayerAISummary(playerId);
  return { summary: newSummary, generatedAt: new Date().toISOString(), cached: false };
}

function buildDeterministicAnalyticalSummary(player, stats) {
  if (!stats || stats.length === 0) {
    return `${player.name} is an international ${player.role} representing ${player.country}. Detailed historical match statistics are currently being compiled.`;
  }

  const odi = stats.find((s) => s.format === 'ODI');
  const test = stats.find((s) => s.format === 'Test');
  const t20 = stats.find((s) => s.format === 'T20');

  const totalRuns = stats.reduce((acc, s) => acc + (s.runs || 0), 0);
  const totalWickets = stats.reduce((acc, s) => acc + (s.wickets || 0), 0);
  const total100s = stats.reduce((acc, s) => acc + (s.hundreds || 0), 0);

  let sentence1 = `${player.name} (${player.country}) is an elite ${player.role} who has accumulated ${totalRuns.toLocaleString()} runs`;
  if (totalWickets > 10) {
    sentence1 += ` and claimed ${totalWickets} wickets across international formats.`;
  } else {
    sentence1 += ` with ${total100s} century marks across international formats.`;
  }

  let sentence2 = '';
  if (player.role.toLowerCase().includes('bowler') || totalWickets > 30) {
    const mainFormat = test && test.wickets > 0 ? test : odi || t20;
    if (mainFormat) {
      sentence2 = `In ${mainFormat.format} matches, they have taken ${mainFormat.wickets} wickets with a bowling average of ${mainFormat.bowlingAverage} and economy of ${mainFormat.economy}.`;
    }
  } else {
    const mainFormat = odi || test || t20;
    if (mainFormat) {
      sentence2 = `In ${mainFormat.format} cricket, they maintain an impressive batting average of ${mainFormat.battingAverage} with a strike rate of ${mainFormat.strikeRate}.`;
    }
  }

  const sentence3 = `Their consistent execution makes them a pivotal asset for ${player.country} in high-pressure fixtures.`;

  return `${sentence1} ${sentence2} ${sentence3}`.trim();
}
