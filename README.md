# 🏏 CricketIQ

An interactive analytics web app for exploring retired cricket legends, comparing career performances across formats, and diving into historical cricket data.

Built with **React**, **Node.js / Express**, **Tailwind CSS**, and **SQLite / MySQL**, CricketIQ features real-time player search, interactive career timeline charts, format-specific leaderboards, head-to-head comparisons, and AI-assisted performance summaries.

---

## ✨ Key Features

- 🔍 **Cricketer Search**: Instantly search through retired international cricket legends by name, country, or playing role.
- 📊 **Comprehensive Career Profiles**:
  - Breakdown across **Test**, **ODI**, and **T20** formats.
  - Yearly career timeline charts and radar skill visualizations.
  - Opposition country breakdowns and venue performance stats.
  - Recent match logs with detailed scorecard numbers.
- ⚔️ **Head-to-Head Player Comparison**:
  - Select up to 3 players to compare side-by-side.
  - Highlights career leaders in runs, batting average, strike rate, wickets, and economy.
  - Interactive comparison bar charts and milestone breakdowns.
- 🏆 **Global Leaderboards**:
  - Filter by metric (**Most Runs**, **Batting Average**, **Strike Rate**, **Most Wickets**, **Best Bowling Average**, **Best Economy Rate**, **Centuries**, **Fifties**, **Highest Score**).
  - Filter by format (**Test**, **ODI**, **T20**, or **All Formats**).
  - Includes **true weighted economy rates** across combined formats.
  - Minimum qualification thresholds for bowling stats so part-time bowlers don't skew rankings.
- 🤖 **AI Performance Summaries**:
  - Concise AI-generated player overviews powered by Google's Gemini API, grounded strictly in statistical data.
- ⚡ **Background Processing & Job Queue**:
  - Asynchronous background queue for heavy statistical aggregations and batch job processing.
  - In-memory cache monitor for fast profile rendering.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, React Router v6 |
| **Backend** | Node.js, Express.js, JWT Authentication, bcryptjs |
| **Database** | SQLite (default zero-config setup) or MySQL (`mysql2/promise`) |
| **AI Integration** | Google Generative AI (`@google/generative-ai`) |

---

## 📁 Repository Structure

```
CricketIQ/
├── client/                 # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, PlayerAvatar, AuthModal, AISummaryCard)
│   │   ├── pages/          # Dashboard, PlayerProfile, PlayerCompare, Leaderboards, AdminJobs
│   │   ├── charts/         # Recharts components (CareerTimelineChart, ComparisonBarChart, etc.)
│   │   └── api.js          # Axios API client
│   └── package.json
│
├── server/                 # Express API Backend
│   ├── src/
│   │   ├── config/         # Database setup & SQLite/MySQL pool connection handling
│   │   ├── models/         # Database models (playerModel, leaderboardModel, statsModel, userModel)
│   │   ├── routes/         # Express routes (playerRoutes, leaderboardRoutes, authRoutes, adminRoutes)
│   │   ├── services/       # Gemini AI service & background job worker
│   │   └── index.js        # Server entry point
│   └── package.json
│
└── data/                   # Data seeding & JSON datasets
    ├── raw/                # Historical player & opposition datasets
    └── scripts/            # Database seed scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Installation

Clone the repository and install dependencies for both `server` and `client`:

```bash
# Clone the repository
git clone https://github.com/nandithshetty/CricketIQ.git
cd CricketIQ

# Install Backend dependencies
cd server
npm install

# Install Frontend dependencies
cd ../client
npm install
```

### 3. Environment Configuration (Optional)

In `server/`, create a `.env` file if you want to enable Gemini AI player summaries or custom MySQL configuration:

```env
PORT=5000
JWT_SECRET=cricketiq_super_secret_jwt_key_2026

# Optional: Add your Gemini API key for AI player summaries
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Set DB_TYPE=mysql if using local MySQL instead of default SQLite
DB_TYPE=sqlite
```

> **Note:** If `GEMINI_API_KEY` is not provided, CricketIQ automatically uses fallback statistical summaries so all features continue working seamlessly.

### 4. Seed the Database

Run the database seed script to populate SQLite with player statistics and opposition records:

```bash
cd server
npm run seed
```

### 5. Running the Application

Start the backend API server and frontend development server in separate terminal windows:

**Terminal 1 — Backend Server:**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
# Running on http://localhost:3000
```

Open `http://localhost:3000` in your browser to explore CricketIQ!

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/players/search?q=...` | Search cricketers by name, country, or role |
| `GET` | `/api/players/:id` | Fetch full career stats, match logs, & opposition stats |
| `GET` | `/api/players/:id/ai-summary` | Get or generate AI performance overview |
| `GET` | `/api/players/compare?ids=1,2,3` | Compare head-to-head performance across players |
| `GET` | `/api/leaderboard?stat=runs&format=ALL` | Retrieve global leaderboard rankings |
| `POST` | `/api/auth/login` | Sign in to user account |
| `POST` | `/api/auth/register` | Create user account |
| `GET` | `/api/admin/jobs` | Fetch background processing queue jobs (Admin required) |

---

## 🤝 Contributing

Contributions, feedback, and feature suggestions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
