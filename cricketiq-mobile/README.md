# 🏏 CricketIQ Mobile

A cross-platform React Native (Expo) mobile application designed for deep cricket statistical analysis, player profiles, head-to-head comparisons, and AI performance summaries.

---

## 📱 Features

1. **Legends Directory (`HomeScreen`)**
   - Real-time search across all 81 international cricket legends.
   - Filter chips for national teams (India, Australia, England, Pakistan, etc.) and player roles (Batter, Bowler, All-rounder, Wicketkeeper).
   - Fast, optimized `FlatList` with authentic high-resolution player portraits and fallback avatar initials.
   - Pull-to-refresh to sync data with the backend.

2. **Deep Player Profile (`PlayerDetailScreen`)**
   - Hero header with player portrait, country badge, role, batting/bowling styles, and date of birth.
   - Career format switcher (**Test**, **ODI**, **T20I**).
   - Key statistical metric grid: Matches, Innings, Runs, Batting Average, Strike Rate, High Score, 100s, 50s, Wickets, Economy, Bowling Average, and Best Bowling figures.
   - **Grounded AI Performance Insights**: Powered by Gemini with verifiable statistical highlights and on-demand refresh.
   - **Opposition Breakdown Splits**: Performance breakdown against top international teams.

3. **Head-to-Head Comparison (`CompareScreen`)**
   - Select any two cricketers via an interactive search picker modal.
   - Format selector (**Test**, **ODI**, **T20I**).
   - Side-by-side metric comparison table with automated leader indicators (trophy highlight for superior stats).
   - Stat differentials (Runs, Average, Strike Rate, Centuries, Wickets, Economy).

4. **All-Time Leaderboards (`LeaderboardScreen`)**
   - Ranked top 20 leaderboards across history.
   - Filter by format (**All Formats**, **Test**, **ODI**, **T20I**).
   - Filter by metric category: Runs, Batting Average, Strike Rate, Centuries, Wickets, Economy, Bowling Average.
   - Podium badges (🥇 #1, 🥈 #2, 🥉 #3) with quick tap navigation to full player profile.

---

## 🏗️ Architecture & Clean Code

- **Framework**: React Native with Expo (Blank JavaScript template).
- **Navigation**: React Navigation 7 (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`).
- **Styling**: Centralized Design System (`src/theme/`) with standardized color tokens, typography scales, and spacing units matching CricketIQ web aesthetics.
- **Networking**: Axios client with centralized request configuration, error interceptors, and automatic image/host URL resolution across physical devices (`172.20.10.3`), Android emulators (`10.0.2.2`), and web (`localhost`).

---

## 🚀 Getting Started

### 1. Ensure the Backend Server is Running
```bash
cd ../server
npm run dev
```

### 2. Start the Mobile Dev Server
```bash
cd cricketiq-mobile
npx expo start
```

### 3. Open the App
- **Android Emulator**: Press `a` in the terminal or run `npx expo start --android`.
- **Physical Phone**: Install the **Expo Go** app from the App Store or Google Play and scan the QR code displayed in the terminal.
- **Web Preview**: Press `w` in the terminal or run `npx expo start --web`.

---

## 🛠️ Verification
All dependencies and configs passed the official Expo diagnostic suite:
```bash
npx expo-doctor
# 21/21 checks passed. No issues detected!
```
