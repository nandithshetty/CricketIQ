# CricketIQ — AI-Powered Cricket Analytics Platform

![CricketIQ Platform](https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80)

**CricketIQ** is a full-stack web app that lets users search international cricketers, view detailed career analytics across Test, ODI, and T20 formats, compare players head-to-head, browse global leaderboards, monitor background aggregation queues, and read AI-generated performance summaries — built on real historical cricket data.

---

## 🌟 Key Features

- 🔍 **Real-Time Autocomplete Search**: Search 20+ top international cricketers by name, country, or role.
- 📊 **Detailed Career Analytics & Recharts**: Format-wise breakdown (Test/ODI/T20), yearly performance timeline charts, format skill radar charts, recent match logs, opposition breakdowns, and venue statistics.
- ⚔️ **Head-to-Head Player Comparison**: Compare 2 to 3 players side-by-side with metric leader highlights and interactive bar charts.
- 🏆 **Global Leaderboards**: Multi-dimensional ranking by Most Runs, Batting Average, Strike Rate, Wickets, Economy, 100s, 50s, and Highest Score across custom formats and seasons.
- 🤖 **Grounded Gemini AI Summaries**: Performance summaries generated via Gemini API, constrained strictly to pre-computed verified statistics with zero hallucinated numbers.
- ⚡ **Background Processing Queue**: Asynchronous MySQL background `jobs` worker handles data imports, career stats recomputation, and AI summary regeneration with automatic retries.
- 🚀 **In-Memory Cache**: TTL Map-based cache for high-frequency player profiles and leaderboard queries, automatically invalidated when stats are updated.
- 🗄️ **Dual Database Layer**: Supports standard MySQL server (`mysql2/promise`) with an automatic embedded SQLite fallback (`cricketiq.db`) for seamless out-of-the-box evaluation.

---

## 📐 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, React Router DOM v6
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs
- **Database**: MySQL (with zero-config SQLite adapter fallback)
- **AI Integration**: `@google/generative-ai` (Gemini 1.5 Flash API with strict statistical prompt constraint)
- **Data Source**: Historical match & ball-by-ball aggregated datasets (Cricsheet format)

---

## 🗄️ Database Schema

```sql
players (id, name, country, role, batting_style, bowling_style, date_of_birth, photo_url, created_at)
teams (id, name, country)
matches (id, format, match_date, venue, team_home_id, team_away_id)
innings (id, match_id, team_id, innings_number)
player_match_stats (id, match_id, player_id, runs, balls_faced, fours, sixes, dismissal_type, overs_bowled, runs_conceded, wickets, catches, stumpings)
career_stats (id, player_id, format, season, matches, runs, average, strike_rate, hundreds, fifties, highest_score, wickets, bowling_average, economy, catches, last_computed_at)
ai_summaries (player_id, summary_text, generated_at)
users (id, email, password_hash, role, created_at)
jobs (id, type, status, payload, attempts, error_message, created_at)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18+) & npm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/cricketiq.git
cd cricketiq

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Seed Database
Populate database with 20+ top international players, 140+ matches, and 700+ match performance records:
```bash
cd server
npm run seed
```

### 4. Run Application
Start the API Backend:
```bash
# In server/
npm run dev
# Running on http://localhost:5000
```

Start the React Frontend:
```bash
# In client/
npm run dev
# Running on http://localhost:3000
```

---

## 📝 Resume Description

> "Built CricketIQ, a full-stack cricket analytics platform (React, Node/Express, MySQL) using real historical match data, featuring player search, career analytics with interactive charts, player comparison, leaderboards, asynchronous data-import processing, in-memory caching, and AI-generated performance summaries powered by the Gemini API constrained to verified statistics."

---

## 📄 License

MIT License © 2026 Nandith Shetty



