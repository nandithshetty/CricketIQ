import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALL_PLAYERS = [
  // EXISTING 27 PLAYERS
  {
    "name": "Virat Kohli",
    "country": "India",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1988-11-05",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 118, "runs": 9040, "average": 48.08, "strike_rate": 55.62, "hundreds": 30, "fifties": 31, "highest_score": 254, "wickets": 0, "bowling_average": 0.0, "economy": 3.0, "catches": 115 },
      { "format": "ODI", "matches": 295, "runs": 13906, "average": 58.18, "strike_rate": 93.54, "hundreds": 50, "fifties": 72, "highest_score": 183, "wickets": 5, "bowling_average": 166.2, "economy": 5.25, "catches": 152 },
      { "format": "T20", "matches": 125, "runs": 4188, "average": 48.69, "strike_rate": 137.04, "hundreds": 1, "fifties": 38, "highest_score": 122, "wickets": 4, "bowling_average": 51.0, "economy": 8.16, "catches": 54 }
    ]
  },
  {
    "name": "Sachin Tendulkar",
    "country": "India",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm legbreak / offbreak",
    "date_of_birth": "1973-04-24",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 200, "runs": 15921, "average": 53.78, "strike_rate": 54.04, "hundreds": 51, "fifties": 68, "highest_score": 248, "wickets": 46, "bowling_average": 54.17, "economy": 3.52, "catches": 115 },
      { "format": "ODI", "matches": 463, "runs": 18426, "average": 44.83, "strike_rate": 86.23, "hundreds": 49, "fifties": 96, "highest_score": 200, "wickets": 154, "bowling_average": 44.48, "economy": 4.97, "catches": 140 },
      { "format": "T20", "matches": 1, "runs": 10, "average": 10.0, "strike_rate": 83.33, "hundreds": 0, "fifties": 0, "highest_score": 10, "wickets": 1, "bowling_average": 12.0, "economy": 4.8, "catches": 1 }
    ]
  },
  {
    "name": "Rohit Sharma",
    "country": "India",
    "role": "Opening Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1987-04-30",
    "photo_url": "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 64, "runs": 4301, "average": 42.16, "strike_rate": 56.24, "hundreds": 12, "fifties": 18, "highest_score": 212, "wickets": 2, "bowling_average": 112.0, "economy": 3.35, "catches": 62 },
      { "format": "ODI", "matches": 265, "runs": 10866, "average": 49.16, "strike_rate": 92.43, "hundreds": 31, "fifties": 57, "highest_score": 264, "wickets": 9, "bowling_average": 64.33, "economy": 5.21, "catches": 93 },
      { "format": "T20", "matches": 159, "runs": 4231, "average": 32.05, "strike_rate": 140.89, "hundreds": 5, "fifties": 32, "highest_score": 121, "wickets": 1, "bowling_average": 113.0, "economy": 8.92, "catches": 65 }
    ]
  },
  {
    "name": "MS Dhoni",
    "country": "India",
    "role": "Wicketkeeper Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1981-07-07",
    "photo_url": "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 90, "runs": 4876, "average": 38.09, "strike_rate": 59.11, "hundreds": 6, "fifties": 33, "highest_score": 224, "wickets": 0, "bowling_average": 0.0, "economy": 2.88, "catches": 256 },
      { "format": "ODI", "matches": 350, "runs": 10773, "average": 50.57, "strike_rate": 87.56, "hundreds": 10, "fifties": 73, "highest_score": 183, "wickets": 1, "bowling_average": 31.0, "economy": 5.16, "catches": 321 },
      { "format": "T20", "matches": 98, "runs": 1617, "average": 37.6, "strike_rate": 126.13, "hundreds": 0, "fifties": 2, "highest_score": 56, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 57 }
    ]
  },
  {
    "name": "Jasprit Bumrah",
    "country": "India",
    "role": "Fast Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast",
    "date_of_birth": "1993-12-06",
    "photo_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 40, "runs": 272, "average": 7.55, "strike_rate": 32.18, "hundreds": 0, "fifties": 0, "highest_score": 34, "wickets": 173, "bowling_average": 20.49, "economy": 2.76, "catches": 14 },
      { "format": "ODI", "matches": 89, "runs": 95, "average": 5.27, "strike_rate": 42.41, "hundreds": 0, "fifties": 0, "highest_score": 16, "wickets": 149, "bowling_average": 23.55, "economy": 4.59, "catches": 18 },
      { "format": "T20", "matches": 70, "runs": 26, "average": 4.33, "strike_rate": 61.9, "hundreds": 0, "fifties": 0, "highest_score": 8, "wickets": 89, "bowling_average": 17.74, "economy": 6.27, "catches": 12 }
    ]
  },
  {
    "name": "Ravindra Jadeja",
    "country": "India",
    "role": "Allrounder",
    "batting_style": "Left-hand bat",
    "bowling_style": "Slow left-arm orthodox",
    "date_of_birth": "1988-12-06",
    "photo_url": "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 74, "runs": 3176, "average": 36.5, "strike_rate": 57.06, "hundreds": 4, "fifties": 21, "highest_score": 175, "wickets": 303, "bowling_average": 23.95, "economy": 2.47, "catches": 43 },
      { "format": "ODI", "matches": 197, "runs": 2756, "average": 32.42, "strike_rate": 85.06, "hundreds": 0, "fifties": 13, "highest_score": 87, "wickets": 220, "bowling_average": 36.07, "economy": 4.88, "catches": 71 },
      { "format": "T20", "matches": 74, "runs": 515, "average": 21.45, "strike_rate": 127.16, "hundreds": 0, "fifties": 0, "highest_score": 46, "wickets": 54, "bowling_average": 28.4, "economy": 7.13, "catches": 28 }
    ]
  },
  {
    "name": "Steve Smith",
    "country": "Australia",
    "role": "Middle-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm legbreak",
    "date_of_birth": "1989-06-02",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 109, "runs": 9685, "average": 56.97, "strike_rate": 53.64, "hundreds": 32, "fifties": 41, "highest_score": 239, "wickets": 19, "bowling_average": 56.47, "economy": 4.28, "catches": 182 },
      { "format": "ODI", "matches": 158, "runs": 5446, "average": 43.91, "strike_rate": 87.27, "hundreds": 12, "fifties": 33, "highest_score": 164, "wickets": 28, "bowling_average": 34.67, "economy": 5.42, "catches": 83 },
      { "format": "T20", "matches": 67, "runs": 1094, "average": 24.86, "strike_rate": 125.45, "hundreds": 0, "fifties": 5, "highest_score": 90, "wickets": 17, "bowling_average": 22.17, "economy": 7.78, "catches": 39 }
    ]
  },
  {
    "name": "Pat Cummins",
    "country": "Australia",
    "role": "Fast Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast",
    "date_of_birth": "1993-05-08",
    "photo_url": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 62, "runs": 1289, "average": 16.52, "strike_rate": 42.6, "hundreds": 0, "fifties": 3, "highest_score": 63, "wickets": 269, "bowling_average": 22.53, "economy": 2.86, "catches": 28 },
      { "format": "ODI", "matches": 88, "runs": 454, "average": 12.61, "strike_rate": 78.54, "hundreds": 0, "fifties": 0, "highest_score": 37, "wickets": 141, "bowling_average": 28.66, "economy": 5.25, "catches": 27 },
      { "format": "T20", "matches": 57, "runs": 167, "average": 9.27, "strike_rate": 127.48, "hundreds": 0, "fifties": 0, "highest_score": 28, "wickets": 66, "bowling_average": 23.36, "economy": 7.37, "catches": 20 }
    ]
  },
  {
    "name": "Ricky Ponting",
    "country": "Australia",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1974-12-19",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 168, "runs": 13378, "average": 51.85, "strike_rate": 58.72, "hundreds": 41, "fifties": 62, "highest_score": 257, "wickets": 5, "bowling_average": 55.4, "economy": 3.32, "catches": 196 },
      { "format": "ODI", "matches": 375, "runs": 13704, "average": 42.03, "strike_rate": 80.39, "hundreds": 30, "fifties": 82, "highest_score": 164, "wickets": 3, "bowling_average": 34.66, "economy": 4.16, "catches": 160 },
      { "format": "T20", "matches": 17, "runs": 401, "average": 28.64, "strike_rate": 132.78, "hundreds": 0, "fifties": 2, "highest_score": 98, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 8 }
    ]
  },
  {
    "name": "Shane Warne",
    "country": "Australia",
    "role": "Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm legbreak",
    "date_of_birth": "1969-09-13",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 145, "runs": 3154, "average": 17.32, "strike_rate": 57.65, "hundreds": 0, "fifties": 12, "highest_score": 99, "wickets": 708, "bowling_average": 25.41, "economy": 2.65, "catches": 125 },
      { "format": "ODI", "matches": 194, "runs": 1018, "average": 13.05, "strike_rate": 72.04, "hundreds": 0, "fifties": 1, "highest_score": 55, "wickets": 293, "bowling_average": 25.73, "economy": 4.25, "catches": 80 }
    ]
  },
  {
    "name": "Joe Root",
    "country": "England",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1990-12-30",
    "photo_url": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 146, "runs": 12402, "average": 50.62, "strike_rate": 56.78, "hundreds": 34, "fifties": 64, "highest_score": 254, "wickets": 70, "bowling_average": 44.82, "economy": 3.32, "catches": 194 },
      { "format": "ODI", "matches": 171, "runs": 6522, "average": 47.6, "strike_rate": 86.74, "hundreds": 16, "fifties": 39, "highest_score": 133, "wickets": 27, "bowling_average": 57.37, "economy": 5.7, "catches": 82 },
      { "format": "T20", "matches": 32, "runs": 893, "average": 35.72, "strike_rate": 126.3, "hundreds": 0, "fifties": 5, "highest_score": 90, "wickets": 6, "bowling_average": 23.33, "economy": 8.75, "catches": 18 }
    ]
  },
  {
    "name": "Ben Stokes",
    "country": "England",
    "role": "Allrounder",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm fast-medium",
    "date_of_birth": "1991-06-04",
    "photo_url": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 105, "runs": 6508, "average": 35.75, "strike_rate": 59.21, "hundreds": 13, "fifties": 33, "highest_score": 258, "wickets": 203, "bowling_average": 32.07, "economy": 3.31, "catches": 107 },
      { "format": "ODI", "matches": 114, "runs": 3159, "average": 38.98, "strike_rate": 95.32, "hundreds": 5, "fifties": 21, "highest_score": 182, "wickets": 74, "bowling_average": 42.39, "economy": 6.05, "catches": 50 },
      { "format": "T20", "matches": 43, "runs": 585, "average": 21.66, "strike_rate": 128.0, "hundreds": 0, "fifties": 1, "highest_score": 52, "wickets": 26, "bowling_average": 32.92, "economy": 8.39, "catches": 22 }
    ]
  },
  {
    "name": "James Anderson",
    "country": "England",
    "role": "Fast Bowler",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm fast-medium",
    "date_of_birth": "1982-07-30",
    "photo_url": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 188, "runs": 1353, "average": 9.08, "strike_rate": 40.54, "hundreds": 0, "fifties": 0, "highest_score": 81, "wickets": 704, "bowling_average": 26.45, "economy": 2.79, "catches": 106 },
      { "format": "ODI", "matches": 194, "runs": 273, "average": 7.58, "strike_rate": 48.75, "hundreds": 0, "fifties": 0, "highest_score": 28, "wickets": 269, "bowling_average": 29.22, "economy": 4.92, "catches": 54 },
      { "format": "T20", "matches": 19, "runs": 1, "average": 1.0, "strike_rate": 20.0, "hundreds": 0, "fifties": 0, "highest_score": 1, "wickets": 18, "bowling_average": 30.66, "economy": 7.84, "catches": 5 }
    ]
  },
  {
    "name": "Kane Williamson",
    "country": "New Zealand",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1990-08-08",
    "photo_url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 100, "runs": 8743, "average": 54.98, "strike_rate": 51.43, "hundreds": 32, "fifties": 34, "highest_score": 251, "wickets": 30, "bowling_average": 40.23, "economy": 3.12, "catches": 88 },
      { "format": "ODI", "matches": 165, "runs": 6810, "average": 48.64, "strike_rate": 81.25, "hundreds": 13, "fifties": 45, "highest_score": 148, "wickets": 37, "bowling_average": 35.45, "economy": 5.38, "catches": 65 },
      { "format": "T20", "matches": 93, "runs": 2575, "average": 33.44, "strike_rate": 123.08, "hundreds": 0, "fifties": 18, "highest_score": 95, "wickets": 6, "bowling_average": 27.33, "economy": 8.0, "catches": 44 }
    ]
  },
  {
    "name": "Trent Boult",
    "country": "New Zealand",
    "role": "Fast Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Left-arm fast",
    "date_of_birth": "1989-07-22",
    "photo_url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 78, "runs": 759, "average": 15.81, "strike_rate": 62.41, "hundreds": 0, "fifties": 0, "highest_score": 52, "wickets": 317, "bowling_average": 27.49, "economy": 3.0, "catches": 41 },
      { "format": "ODI", "matches": 114, "runs": 204, "average": 9.27, "strike_rate": 69.15, "hundreds": 0, "fifties": 0, "highest_score": 21, "wickets": 211, "bowling_average": 23.97, "economy": 4.93, "catches": 45 },
      { "format": "T20", "matches": 61, "runs": 48, "average": 6.85, "strike_rate": 78.68, "hundreds": 0, "fifties": 0, "highest_score": 16, "wickets": 83, "bowling_average": 21.69, "economy": 7.76, "catches": 24 }
    ]
  },
  {
    "name": "Babar Azam",
    "country": "Pakistan",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1994-10-15",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 55, "runs": 3998, "average": 44.42, "strike_rate": 54.89, "hundreds": 9, "fifties": 27, "highest_score": 196, "wickets": 2, "bowling_average": 27.0, "economy": 3.85, "catches": 39 },
      { "format": "ODI", "matches": 117, "runs": 5729, "average": 56.72, "strike_rate": 88.75, "hundreds": 19, "fifties": 32, "highest_score": 158, "wickets": 0, "bowling_average": 0.0, "economy": 6.0, "catches": 51 },
      { "format": "T20", "matches": 123, "runs": 4145, "average": 41.03, "strike_rate": 129.08, "hundreds": 3, "fifties": 36, "highest_score": 122, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 50 }
    ]
  },
  {
    "name": "Wasim Akram",
    "country": "Pakistan",
    "role": "Fast Bowler",
    "batting_style": "Left-hand bat",
    "bowling_style": "Left-arm fast",
    "date_of_birth": "1966-06-03",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 104, "runs": 2898, "average": 22.64, "strike_rate": 52.53, "hundreds": 3, "fifties": 7, "highest_score": 257, "wickets": 414, "bowling_average": 23.62, "economy": 2.59, "catches": 44 },
      { "format": "ODI", "matches": 356, "runs": 3717, "average": 16.52, "strike_rate": 88.33, "hundreds": 0, "fifties": 6, "highest_score": 86, "wickets": 502, "bowling_average": 23.52, "economy": 3.89, "catches": 88 }
    ]
  },
  {
    "name": "Shaheen Afridi",
    "country": "Pakistan",
    "role": "Fast Bowler",
    "batting_style": "Left-hand bat",
    "bowling_style": "Left-arm fast",
    "date_of_birth": "2000-04-06",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 30, "runs": 454, "average": 14.18, "strike_rate": 45.2, "hundreds": 0, "fifties": 0, "highest_score": 45, "wickets": 115, "bowling_average": 26.73, "economy": 3.09, "catches": 6 },
      { "format": "ODI", "matches": 53, "runs": 168, "average": 9.33, "strike_rate": 87.04, "hundreds": 0, "fifties": 0, "highest_score": 23, "wickets": 104, "bowling_average": 23.94, "economy": 5.54, "catches": 15 },
      { "format": "T20", "matches": 70, "runs": 158, "average": 9.29, "strike_rate": 133.89, "hundreds": 0, "fifties": 0, "highest_score": 23, "wickets": 96, "bowling_average": 20.81, "economy": 7.79, "catches": 18 }
    ]
  },
  {
    "name": "AB de Villiers",
    "country": "South Africa",
    "role": "Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1984-02-17",
    "photo_url": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 114, "runs": 8765, "average": 50.66, "strike_rate": 54.51, "hundreds": 22, "fifties": 46, "highest_score": 278, "wickets": 2, "bowling_average": 46.5, "economy": 3.32, "catches": 222 },
      { "format": "ODI", "matches": 228, "runs": 9577, "average": 53.5, "strike_rate": 101.09, "hundreds": 25, "fifties": 53, "highest_score": 176, "wickets": 7, "bowling_average": 28.85, "economy": 6.12, "catches": 176 },
      { "format": "T20", "matches": 78, "runs": 1672, "average": 26.12, "strike_rate": 135.16, "hundreds": 0, "fifties": 10, "highest_score": 79, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 65 }
    ]
  },
  {
    "name": "Jacques Kallis",
    "country": "South Africa",
    "role": "Allrounder",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast-medium",
    "date_of_birth": "1975-10-16",
    "photo_url": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 166, "runs": 13289, "average": 55.37, "strike_rate": 45.97, "hundreds": 45, "fifties": 58, "highest_score": 224, "wickets": 292, "bowling_average": 32.65, "economy": 2.82, "catches": 200 },
      { "format": "ODI", "matches": 328, "runs": 11579, "average": 44.36, "strike_rate": 72.89, "hundreds": 17, "fifties": 86, "highest_score": 139, "wickets": 273, "bowling_average": 31.79, "economy": 4.84, "catches": 131 },
      { "format": "T20", "matches": 25, "runs": 666, "average": 35.05, "strike_rate": 119.35, "hundreds": 0, "fifties": 5, "highest_score": 73, "wickets": 12, "bowling_average": 27.75, "economy": 7.33, "catches": 7 }
    ]
  },
  {
    "name": "Kagiso Rabada",
    "country": "South Africa",
    "role": "Fast Bowler",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm fast",
    "date_of_birth": "1995-05-25",
    "photo_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 64, "runs": 974, "average": 11.87, "strike_rate": 46.51, "hundreds": 0, "fifties": 0, "highest_score": 47, "wickets": 291, "bowling_average": 22.05, "economy": 3.37, "catches": 30 },
      { "format": "ODI", "matches": 101, "runs": 393, "average": 9.58, "strike_rate": 78.44, "hundreds": 0, "fifties": 0, "highest_score": 31, "wickets": 157, "bowling_average": 27.82, "economy": 5.06, "catches": 29 },
      { "format": "T20", "matches": 65, "runs": 161, "average": 9.47, "strike_rate": 109.52, "hundreds": 0, "fifties": 0, "highest_score": 22, "wickets": 71, "bowling_average": 27.91, "economy": 8.35, "catches": 20 }
    ]
  },
  {
    "name": "Brian Lara",
    "country": "West Indies",
    "role": "Top-order Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm legbreak",
    "date_of_birth": "1969-05-02",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 131, "runs": 11953, "average": 52.88, "strike_rate": 60.51, "hundreds": 34, "fifties": 48, "highest_score": 400, "wickets": 0, "bowling_average": 0.0, "economy": 3.25, "catches": 164 },
      { "format": "ODI", "matches": 299, "runs": 10405, "average": 40.48, "strike_rate": 79.51, "hundreds": 19, "fifties": 63, "highest_score": 169, "wickets": 4, "bowling_average": 38.25, "economy": 5.46, "catches": 120 }
    ]
  },
  {
    "name": "Chris Gayle",
    "country": "West Indies",
    "role": "Opening Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1979-09-21",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 103, "runs": 7214, "average": 42.18, "strike_rate": 60.27, "hundreds": 15, "fifties": 37, "highest_score": 333, "wickets": 73, "bowling_average": 42.73, "economy": 2.76, "catches": 96 },
      { "format": "ODI", "matches": 301, "runs": 10480, "average": 37.83, "strike_rate": 87.19, "hundreds": 25, "fifties": 54, "highest_score": 215, "wickets": 167, "bowling_average": 35.48, "economy": 4.76, "catches": 124 },
      { "format": "T20", "matches": 79, "runs": 1899, "average": 27.92, "strike_rate": 137.5, "hundreds": 2, "fifties": 14, "highest_score": 117, "wickets": 20, "bowling_average": 22.0, "economy": 6.9, "catches": 20 }
    ]
  },
  {
    "name": "Rashid Khan",
    "country": "Afghanistan",
    "role": "Bowling Allrounder",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm legbreak",
    "date_of_birth": "1998-09-20",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 5, "runs": 106, "average": 15.14, "strike_rate": 63.85, "hundreds": 0, "fifties": 1, "highest_score": 51, "wickets": 34, "bowling_average": 22.35, "economy": 2.97, "catches": 0 },
      { "format": "ODI", "matches": 103, "runs": 1228, "average": 19.8, "strike_rate": 104.95, "hundreds": 0, "fifties": 5, "highest_score": 60, "wickets": 182, "bowling_average": 19.97, "economy": 4.16, "catches": 30 },
      { "format": "T20", "matches": 92, "runs": 418, "average": 13.06, "strike_rate": 129.41, "hundreds": 0, "fifties": 0, "highest_score": 48, "wickets": 152, "bowling_average": 14.12, "economy": 6.07, "catches": 38 }
    ]
  },
  {
    "name": "Kumar Sangakkara",
    "country": "Sri Lanka",
    "role": "Wicketkeeper Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1977-10-27",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 134, "runs": 12400, "average": 57.4, "strike_rate": 54.19, "hundreds": 38, "fifties": 52, "highest_score": 319, "wickets": 0, "bowling_average": 0.0, "economy": 3.0, "catches": 182 },
      { "format": "ODI", "matches": 404, "runs": 14234, "average": 41.98, "strike_rate": 78.86, "hundreds": 25, "fifties": 93, "highest_score": 169, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 402 },
      { "format": "T20", "matches": 56, "runs": 1382, "average": 31.4, "strike_rate": 119.55, "hundreds": 0, "fifties": 8, "highest_score": 78, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 25 }
    ]
  },
  {
    "name": "Muttiah Muralitharan",
    "country": "Sri Lanka",
    "role": "Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1972-04-17",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 133, "runs": 1261, "average": 11.67, "strike_rate": 68.37, "hundreds": 0, "fifties": 1, "highest_score": 67, "wickets": 800, "bowling_average": 22.72, "economy": 2.47, "catches": 104 },
      { "format": "ODI", "matches": 350, "runs": 674, "average": 6.94, "strike_rate": 77.56, "hundreds": 0, "fifties": 0, "highest_score": 33, "wickets": 534, "bowling_average": 23.08, "economy": 3.93, "catches": 130 }
    ]
  },
  {
    "name": "Shakib Al Hasan",
    "country": "Bangladesh",
    "role": "Allrounder",
    "batting_style": "Left-hand bat",
    "bowling_style": "Slow left-arm orthodox",
    "date_of_birth": "1987-03-24",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 71, "runs": 4609, "average": 37.77, "strike_rate": 61.54, "hundreds": 5, "fifties": 31, "highest_score": 217, "wickets": 246, "bowling_average": 31.31, "economy": 3.03, "catches": 29 },
      { "format": "ODI", "matches": 247, "runs": 7570, "average": 37.29, "strike_rate": 82.52, "hundreds": 9, "fifties": 56, "highest_score": 124, "wickets": 317, "bowling_average": 29.52, "economy": 4.44, "catches": 59 },
      { "format": "T20", "matches": 129, "runs": 2551, "average": 23.19, "strike_rate": 121.18, "hundreds": 0, "fifties": 13, "highest_score": 84, "wickets": 149, "bowling_average": 20.91, "economy": 6.81, "catches": 30 }
    ]
  },

  // NEW ADDITIONAL PLAYERS (28 to 65+)
  {
    "name": "Ravichandran Ashwin",
    "country": "India",
    "role": "Bowling Allrounder",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1986-09-17",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 100, "runs": 3309, "average": 26.26, "strike_rate": 54.02, "hundreds": 5, "fifties": 14, "highest_score": 124, "wickets": 516, "bowling_average": 23.75, "economy": 2.81, "catches": 34 },
      { "format": "ODI", "matches": 116, "runs": 707, "average": 16.44, "strike_rate": 86.96, "hundreds": 0, "fifties": 1, "highest_score": 65, "wickets": 156, "bowling_average": 33.2, "economy": 4.94, "catches": 32 },
      { "format": "T20", "matches": 65, "runs": 184, "average": 16.72, "strike_rate": 115.0, "hundreds": 0, "fifties": 0, "highest_score": 31, "wickets": 72, "bowling_average": 23.22, "economy": 6.9, "catches": 12 }
    ]
  },
  {
    "name": "Mohammed Shami",
    "country": "India",
    "role": "Fast Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast",
    "date_of_birth": "1990-09-03",
    "photo_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 64, "runs": 750, "average": 12.09, "strike_rate": 58.05, "hundreds": 0, "fifties": 2, "highest_score": 56, "wickets": 229, "bowling_average": 27.71, "economy": 3.3, "catches": 16 },
      { "format": "ODI", "matches": 101, "runs": 211, "average": 8.11, "strike_rate": 84.4, "hundreds": 0, "fifties": 0, "highest_score": 25, "wickets": 195, "bowling_average": 23.68, "economy": 5.55, "catches": 28 },
      { "format": "T20", "matches": 23, "runs": 13, "average": 3.25, "strike_rate": 81.25, "hundreds": 0, "fifties": 0, "highest_score": 11, "wickets": 24, "bowling_average": 29.62, "economy": 8.94, "catches": 4 }
    ]
  },
  {
    "name": "Rishabh Pant",
    "country": "India",
    "role": "Wicketkeeper Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1997-10-04",
    "photo_url": "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 34, "runs": 2271, "average": 43.67, "strike_rate": 73.63, "hundreds": 6, "fifties": 11, "highest_score": 159, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 119 },
      { "format": "ODI", "matches": 31, "runs": 865, "average": 34.6, "strike_rate": 106.65, "hundreds": 1, "fifties": 5, "highest_score": 125, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 26 },
      { "format": "T20", "matches": 74, "runs": 1158, "average": 23.16, "strike_rate": 127.25, "hundreds": 0, "fifties": 3, "highest_score": 65, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 43 }
    ]
  },
  {
    "name": "KL Rahul",
    "country": "India",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1992-04-18",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 53, "runs": 2983, "average": 34.28, "strike_rate": 52.88, "hundreds": 8, "fifties": 15, "highest_score": 199, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 58 },
      { "format": "ODI", "matches": 77, "runs": 2851, "average": 49.15, "strike_rate": 87.57, "hundreds": 7, "fifties": 18, "highest_score": 112, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 52 },
      { "format": "T20", "matches": 72, "runs": 2265, "average": 37.75, "strike_rate": 139.12, "hundreds": 2, "fifties": 22, "highest_score": 110, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 23 }
    ]
  },
  {
    "name": "Shubman Gill",
    "country": "India",
    "role": "Opening Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1999-09-08",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 25, "runs": 1492, "average": 35.52, "strike_rate": 58.74, "hundreds": 4, "fifties": 6, "highest_score": 128, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 20 },
      { "format": "ODI", "matches": 44, "runs": 2271, "average": 61.37, "strike_rate": 103.46, "hundreds": 6, "fifties": 13, "highest_score": 208, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 25 },
      { "format": "T20", "matches": 21, "runs": 578, "average": 30.42, "strike_rate": 139.27, "hundreds": 1, "fifties": 3, "highest_score": 126, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 10 }
    ]
  },
  {
    "name": "Rahul Dravid",
    "country": "India",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1973-01-11",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 164, "runs": 13288, "average": 52.31, "strike_rate": 42.51, "hundreds": 36, "fifties": 63, "highest_score": 270, "wickets": 1, "bowling_average": 39.0, "economy": 2.4, "catches": 210 },
      { "format": "ODI", "matches": 344, "runs": 10889, "average": 39.16, "strike_rate": 71.24, "hundreds": 12, "fifties": 83, "highest_score": 153, "wickets": 4, "bowling_average": 42.5, "economy": 4.97, "catches": 196 }
    ]
  },
  {
    "name": "Anil Kumble",
    "country": "India",
    "role": "Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm legbreak",
    "date_of_birth": "1970-10-17",
    "photo_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 132, "runs": 2506, "average": 17.77, "strike_rate": 43.12, "hundreds": 1, "fifties": 5, "highest_score": 110, "wickets": 619, "bowling_average": 29.65, "economy": 2.69, "catches": 60 },
      { "format": "ODI", "matches": 271, "runs": 938, "average": 10.53, "strike_rate": 61.06, "hundreds": 0, "fifties": 0, "highest_score": 26, "wickets": 337, "bowling_average": 30.89, "economy": 4.3, "catches": 85 }
    ]
  },
  {
    "name": "David Warner",
    "country": "Australia",
    "role": "Opening Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm legbreak",
    "date_of_birth": "1986-10-27",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 112, "runs": 8786, "average": 44.59, "strike_rate": 70.26, "hundreds": 26, "fifties": 37, "highest_score": 335, "wickets": 4, "bowling_average": 71.0, "economy": 3.8, "catches": 92 },
      { "format": "ODI", "matches": 161, "runs": 6932, "average": 45.3, "strike_rate": 97.26, "hundreds": 22, "fifties": 33, "highest_score": 179, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 71 },
      { "format": "T20", "matches": 110, "runs": 3277, "average": 33.43, "strike_rate": 142.47, "hundreds": 1, "fifties": 28, "highest_score": 100, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 62 }
    ]
  },
  {
    "name": "Mitchell Starc",
    "country": "Australia",
    "role": "Fast Bowler",
    "batting_style": "Left-hand bat",
    "bowling_style": "Left-arm fast",
    "date_of_birth": "1990-01-30",
    "photo_url": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 89, "runs": 2092, "average": 20.71, "strike_rate": 62.53, "hundreds": 0, "fifties": 10, "highest_score": 99, "wickets": 358, "bowling_average": 27.61, "economy": 3.37, "catches": 40 },
      { "format": "ODI", "matches": 121, "runs": 558, "average": 11.62, "strike_rate": 89.13, "hundreds": 0, "fifties": 0, "highest_score": 52, "wickets": 236, "bowling_average": 22.96, "economy": 5.15, "catches": 42 },
      { "format": "T20", "matches": 65, "runs": 96, "average": 9.6, "strike_rate": 106.66, "hundreds": 0, "fifties": 0, "highest_score": 14, "wickets": 79, "bowling_average": 23.81, "economy": 7.64, "catches": 18 }
    ]
  },
  {
    "name": "Glenn Maxwell",
    "country": "Australia",
    "role": "Allrounder",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1988-10-14",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 7, "runs": 339, "average": 26.07, "strike_rate": 64.32, "hundreds": 1, "fifties": 0, "highest_score": 104, "wickets": 8, "bowling_average": 42.62, "economy": 4.54, "catches": 8 },
      { "format": "ODI", "matches": 142, "runs": 3895, "average": 35.4, "strike_rate": 126.91, "hundreds": 4, "fifties": 23, "highest_score": 201, "wickets": 74, "bowling_average": 40.5, "economy": 5.56, "catches": 84 },
      { "format": "T20", "matches": 106, "runs": 2600, "average": 29.88, "strike_rate": 155.5, "hundreds": 5, "fifties": 10, "highest_score": 145, "wickets": 40, "bowling_average": 27.52, "economy": 7.42, "catches": 48 }
    ]
  },
  {
    "name": "Travis Head",
    "country": "Australia",
    "role": "Top-order Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1993-12-29",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 49, "runs": 3173, "average": 41.75, "strike_rate": 64.12, "hundreds": 7, "fifties": 16, "highest_score": 175, "wickets": 12, "bowling_average": 45.2, "economy": 3.75, "catches": 30 },
      { "format": "ODI", "matches": 65, "runs": 2397, "average": 42.05, "strike_rate": 105.17, "hundreds": 5, "fifties": 16, "highest_score": 152, "wickets": 18, "bowling_average": 48.6, "economy": 5.48, "catches": 28 },
      { "format": "T20", "matches": 38, "runs": 1032, "average": 31.27, "strike_rate": 157.07, "hundreds": 0, "fifties": 5, "highest_score": 91, "wickets": 1, "bowling_average": 52.0, "economy": 8.5, "catches": 14 }
    ]
  },
  {
    "name": "Adam Gilchrist",
    "country": "Australia",
    "role": "Wicketkeeper Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1971-11-14",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 96, "runs": 5570, "average": 47.6, "strike_rate": 81.95, "hundreds": 17, "fifties": 26, "highest_score": 204, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 379 },
      { "format": "ODI", "matches": 287, "runs": 9619, "average": 35.89, "strike_rate": 96.94, "hundreds": 16, "fifties": 55, "highest_score": 172, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 417 }
    ]
  },
  {
    "name": "Stuart Broad",
    "country": "England",
    "role": "Fast Bowler",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm fast-medium",
    "date_of_birth": "1986-06-24",
    "photo_url": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 167, "runs": 3662, "average": 18.03, "strike_rate": 55.67, "hundreds": 1, "fifties": 13, "highest_score": 169, "wickets": 604, "bowling_average": 27.68, "economy": 2.97, "catches": 56 },
      { "format": "ODI", "matches": 121, "runs": 529, "average": 12.02, "strike_rate": 74.5, "hundreds": 0, "fifties": 0, "highest_score": 45, "wickets": 178, "bowling_average": 30.13, "economy": 5.26, "catches": 27 },
      { "format": "T20", "matches": 56, "runs": 118, "average": 7.37, "strike_rate": 105.35, "hundreds": 0, "fifties": 0, "highest_score": 18, "wickets": 65, "bowling_average": 22.93, "economy": 7.62, "catches": 15 }
    ]
  },
  {
    "name": "Jos Buttler",
    "country": "England",
    "role": "Wicketkeeper Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1990-09-08",
    "photo_url": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 57, "runs": 2907, "average": 31.94, "strike_rate": 54.68, "hundreds": 2, "fifties": 18, "highest_score": 152, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 153 },
      { "format": "ODI", "matches": 181, "runs": 5022, "average": 39.54, "strike_rate": 117.11, "hundreds": 11, "fifties": 26, "highest_score": 162, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 221 },
      { "format": "T20", "matches": 124, "runs": 3264, "average": 35.86, "strike_rate": 144.6, "hundreds": 1, "fifties": 24, "highest_score": 101, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 78 }
    ]
  },
  {
    "name": "Harry Brook",
    "country": "England",
    "role": "Middle-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1999-02-22",
    "photo_url": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 15, "runs": 1376, "average": 62.54, "strike_rate": 88.88, "hundreds": 5, "fifties": 8, "highest_score": 186, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 14 },
      { "format": "ODI", "matches": 15, "runs": 407, "average": 29.07, "strike_rate": 98.78, "hundreds": 0, "fifties": 3, "highest_score": 80, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 7 },
      { "format": "T20", "matches": 39, "runs": 707, "average": 27.19, "strike_rate": 146.48, "hundreds": 0, "fifties": 3, "highest_score": 81, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 18 }
    ]
  },
  {
    "name": "Tim Southee",
    "country": "New Zealand",
    "role": "Fast Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast-medium",
    "date_of_birth": "1988-12-11",
    "photo_url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 100, "runs": 2098, "average": 15.65, "strike_rate": 82.72, "hundreds": 0, "fifties": 6, "highest_score": 77, "wickets": 380, "bowling_average": 29.87, "economy": 3.01, "catches": 74 },
      { "format": "ODI", "matches": 161, "runs": 718, "average": 12.37, "strike_rate": 96.63, "hundreds": 0, "fifties": 1, "highest_score": 55, "wickets": 221, "bowling_average": 33.7, "economy": 5.5, "catches": 48 },
      { "format": "T20", "matches": 123, "runs": 302, "average": 11.18, "strike_rate": 139.17, "hundreds": 0, "fifties": 0, "highest_score": 39, "wickets": 157, "bowling_average": 22.38, "economy": 8.04, "catches": 58 }
    ]
  },
  {
    "name": "Daryl Mitchell",
    "country": "New Zealand",
    "role": "Allrounder",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1991-05-20",
    "photo_url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 25, "runs": 1607, "average": 48.69, "strike_rate": 54.34, "hundreds": 5, "fifties": 10, "highest_score": 190, "wickets": 3, "bowling_average": 66.33, "economy": 3.1, "catches": 30 },
      { "format": "ODI", "matches": 39, "runs": 1577, "average": 52.56, "strike_rate": 93.31, "hundreds": 6, "fifties": 5, "highest_score": 134, "wickets": 10, "bowling_average": 36.5, "economy": 5.62, "catches": 22 },
      { "format": "T20", "matches": 67, "runs": 1260, "average": 26.25, "strike_rate": 138.61, "hundreds": 0, "fifties": 5, "highest_score": 72, "wickets": 8, "bowling_average": 26.62, "economy": 9.54, "catches": 36 }
    ]
  },
  {
    "name": "Mohammad Rizwan",
    "country": "Pakistan",
    "role": "Wicketkeeper Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium",
    "date_of_birth": "1992-06-01",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 30, "runs": 1616, "average": 40.4, "strike_rate": 53.68, "hundreds": 3, "fifties": 9, "highest_score": 115, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 69 },
      { "format": "ODI", "matches": 74, "runs": 2088, "average": 40.15, "strike_rate": 89.65, "hundreds": 3, "fifties": 13, "highest_score": 131, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 73 },
      { "format": "T20", "matches": 102, "runs": 3313, "average": 48.72, "strike_rate": 126.45, "hundreds": 1, "fifties": 29, "highest_score": 104, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 54 }
    ]
  },
  {
    "name": "Shoaib Akhtar",
    "country": "Pakistan",
    "role": "Fast Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast",
    "date_of_birth": "1975-08-13",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 46, "runs": 544, "average": 10.07, "strike_rate": 49.09, "hundreds": 0, "fifties": 0, "highest_score": 47, "wickets": 178, "bowling_average": 25.69, "economy": 3.37, "catches": 12 },
      { "format": "ODI", "matches": 163, "runs": 394, "average": 8.95, "strike_rate": 72.82, "hundreds": 0, "fifties": 0, "highest_score": 43, "wickets": 247, "bowling_average": 24.97, "economy": 4.76, "catches": 20 }
    ]
  },
  {
    "name": "Quinton de Kock",
    "country": "South Africa",
    "role": "Wicketkeeper Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Slow left-arm orthodox",
    "date_of_birth": "1992-12-17",
    "photo_url": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 54, "runs": 3300, "average": 38.82, "strike_rate": 70.93, "hundreds": 6, "fifties": 22, "highest_score": 141, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 221 },
      { "format": "ODI", "matches": 155, "runs": 6770, "average": 45.74, "strike_rate": 96.64, "hundreds": 21, "fifties": 30, "highest_score": 178, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 197 },
      { "format": "T20", "matches": 92, "runs": 2584, "average": 31.51, "strike_rate": 137.66, "hundreds": 1, "fifties": 16, "highest_score": 100, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 82 }
    ]
  },
  {
    "name": "Dale Steyn",
    "country": "South Africa",
    "role": "Fast Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast",
    "date_of_birth": "1983-06-27",
    "photo_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 93, "runs": 1251, "average": 13.59, "strike_rate": 55.45, "hundreds": 0, "fifties": 2, "highest_score": 76, "wickets": 439, "bowling_average": 22.95, "economy": 3.24, "catches": 26 },
      { "format": "ODI", "matches": 125, "runs": 365, "average": 8.9, "strike_rate": 72.85, "hundreds": 0, "fifties": 0, "highest_score": 35, "wickets": 196, "bowling_average": 25.95, "economy": 4.87, "catches": 27 },
      { "format": "T20", "matches": 47, "runs": 21, "average": 3.5, "strike_rate": 77.77, "hundreds": 0, "fifties": 0, "highest_score": 5, "wickets": 64, "bowling_average": 18.35, "economy": 6.94, "catches": 14 }
    ]
  },
  {
    "name": "Hashim Amla",
    "country": "South Africa",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm medium / legbreak",
    "date_of_birth": "1983-03-31",
    "photo_url": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 124, "runs": 9282, "average": 46.64, "strike_rate": 49.97, "hundreds": 28, "fifties": 41, "highest_score": 311, "wickets": 0, "bowling_average": 0.0, "economy": 3.0, "catches": 108 },
      { "format": "ODI", "matches": 181, "runs": 8113, "average": 49.46, "strike_rate": 88.39, "hundreds": 27, "fifties": 39, "highest_score": 159, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 87 }
    ]
  },
  {
    "name": "Nicholas Pooran",
    "country": "West Indies",
    "role": "Wicketkeeper Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1995-10-02",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "ODI", "matches": 61, "runs": 2343, "average": 39.71, "strike_rate": 99.4, "hundreds": 3, "fifties": 11, "highest_score": 118, "wickets": 6, "bowling_average": 28.5, "economy": 5.7, "catches": 48 },
      { "format": "T20", "matches": 95, "runs": 2079, "average": 25.66, "strike_rate": 136.32, "hundreds": 0, "fifties": 12, "highest_score": 82, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 52 }
    ]
  },
  {
    "name": "Andre Russell",
    "country": "West Indies",
    "role": "Allrounder",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast",
    "date_of_birth": "1988-04-29",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 1, "runs": 2, "average": 2.0, "strike_rate": 40.0, "hundreds": 0, "fifties": 0, "highest_score": 2, "wickets": 1, "bowling_average": 73.0, "economy": 3.17, "catches": 1 },
      { "format": "ODI", "matches": 56, "runs": 1034, "average": 27.21, "strike_rate": 130.22, "hundreds": 0, "fifties": 4, "highest_score": 92, "wickets": 70, "bowling_average": 31.84, "economy": 5.84, "catches": 17 },
      { "format": "T20", "matches": 82, "runs": 1033, "average": 20.66, "strike_rate": 163.44, "hundreds": 0, "fifties": 3, "highest_score": 51, "wickets": 60, "bowling_average": 31.5, "economy": 9.16, "catches": 26 }
    ]
  },
  {
    "name": "Vivian Richards",
    "country": "West Indies",
    "role": "Top-order Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1952-03-07",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 121, "runs": 8540, "average": 50.23, "strike_rate": 69.77, "hundreds": 24, "fifties": 45, "highest_score": 291, "wickets": 32, "bowling_average": 61.37, "economy": 2.67, "catches": 122 },
      { "format": "ODI", "matches": 187, "runs": 6721, "average": 47.0, "strike_rate": 90.2, "hundreds": 11, "fifties": 45, "highest_score": 189, "wickets": 118, "bowling_average": 35.83, "economy": 4.49, "catches": 100 }
    ]
  },
  {
    "name": "Pathum Nissanka",
    "country": "Sri Lanka",
    "role": "Opening Batter",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm legbreak",
    "date_of_birth": "1998-05-18",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 9, "runs": 537, "average": 38.35, "strike_rate": 47.77, "hundreds": 1, "fifties": 5, "highest_score": 103, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 4 },
      { "format": "ODI", "matches": 55, "runs": 2284, "average": 45.68, "strike_rate": 89.56, "hundreds": 6, "fifties": 13, "highest_score": 210, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 20 },
      { "format": "T20", "matches": 51, "runs": 1344, "average": 27.42, "strike_rate": 116.76, "hundreds": 0, "fifties": 11, "highest_score": 75, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 15 }
    ]
  },
  {
    "name": "Wanindu Hasaranga",
    "country": "Sri Lanka",
    "role": "Bowling Allrounder",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm legbreak",
    "date_of_birth": "1997-07-29",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 4, "runs": 196, "average": 28.0, "strike_rate": 78.4, "hundreds": 0, "fifties": 1, "highest_score": 59, "wickets": 4, "bowling_average": 100.75, "economy": 3.75, "catches": 2 },
      { "format": "ODI", "matches": 58, "runs": 918, "average": 22.39, "strike_rate": 108.63, "hundreds": 0, "fifties": 4, "highest_score": 80, "wickets": 84, "bowling_average": 26.47, "economy": 5.09, "catches": 19 },
      { "format": "T20", "matches": 68, "runs": 650, "average": 14.77, "strike_rate": 125.48, "hundreds": 0, "fifties": 1, "highest_score": 71, "wickets": 110, "bowling_average": 15.36, "economy": 6.84, "catches": 24 }
    ]
  },
  {
    "name": "Lasith Malinga",
    "country": "Sri Lanka",
    "role": "Fast Bowler",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm fast",
    "date_of_birth": "1983-08-28",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 30, "runs": 275, "average": 8.87, "strike_rate": 50.92, "hundreds": 0, "fifties": 0, "highest_score": 64, "wickets": 101, "bowling_average": 33.15, "economy": 3.84, "catches": 7 },
      { "format": "ODI", "matches": 226, "runs": 567, "average": 7.36, "strike_rate": 74.02, "hundreds": 0, "fifties": 0, "highest_score": 56, "wickets": 338, "bowling_average": 28.87, "economy": 5.35, "catches": 31 },
      { "format": "T20", "matches": 84, "runs": 136, "average": 6.47, "strike_rate": 88.31, "hundreds": 0, "fifties": 0, "highest_score": 27, "wickets": 107, "bowling_average": 20.79, "economy": 7.42, "catches": 21 }
    ]
  },
  {
    "name": "Mohammad Nabi",
    "country": "Afghanistan",
    "role": "Allrounder",
    "batting_style": "Right-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1985-01-01",
    "photo_url": "https://images.unsplash.com/photo-1508801939247-22bef957014d?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 3, "runs": 33, "average": 5.5, "strike_rate": 55.0, "hundreds": 0, "fifties": 0, "highest_score": 24, "wickets": 8, "bowling_average": 31.75, "economy": 3.13, "catches": 2 },
      { "format": "ODI", "matches": 161, "runs": 3595, "average": 27.23, "strike_rate": 86.64, "hundreds": 2, "fifties": 17, "highest_score": 136, "wickets": 171, "bowling_average": 32.44, "economy": 4.31, "catches": 58 },
      { "format": "T20", "matches": 129, "runs": 2165, "average": 22.31, "strike_rate": 136.24, "hundreds": 0, "fifties": 5, "highest_score": 89, "wickets": 96, "bowling_average": 28.52, "economy": 7.31, "catches": 62 }
    ]
  },
  {
    "name": "Mustafizur Rahman",
    "country": "Bangladesh",
    "role": "Fast Bowler",
    "batting_style": "Left-hand bat",
    "bowling_style": "Left-arm fast-medium",
    "date_of_birth": "1995-09-06",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 15, "runs": 64, "average": 5.33, "strike_rate": 31.52, "hundreds": 0, "fifties": 0, "highest_score": 16, "wickets": 31, "bowling_average": 36.74, "economy": 3.44, "catches": 1 },
      { "format": "ODI", "matches": 104, "runs": 139, "average": 6.95, "strike_rate": 59.91, "hundreds": 0, "fifties": 0, "highest_score": 20, "wickets": 164, "bowling_average": 25.84, "economy": 5.12, "catches": 19 },
      { "format": "T20", "matches": 103, "runs": 71, "average": 4.17, "strike_rate": 61.2, "hundreds": 0, "fifties": 0, "highest_score": 15, "wickets": 128, "bowling_average": 21.65, "economy": 7.55, "catches": 18 }
    ]
  },
  {
    "name": "Tamim Iqbal",
    "country": "Bangladesh",
    "role": "Opening Batter",
    "batting_style": "Left-hand bat",
    "bowling_style": "Right-arm offbreak",
    "date_of_birth": "1989-03-20",
    "photo_url": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    "career": [
      { "format": "Test", "matches": 70, "runs": 5134, "average": 38.89, "strike_rate": 58.12, "hundreds": 10, "fifties": 31, "highest_score": 206, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 20 },
      { "format": "ODI", "matches": 243, "runs": 8357, "average": 36.65, "strike_rate": 78.54, "hundreds": 14, "fifties": 56, "highest_score": 158, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 68 },
      { "format": "T20", "matches": 78, "runs": 1758, "average": 24.08, "strike_rate": 116.96, "hundreds": 1, "fifties": 7, "highest_score": 103, "wickets": 0, "bowling_average": 0.0, "economy": 0.0, "catches": 18 }
    ]
  }
];

const targetPath = path.resolve(__dirname, '../raw/real_cricket_stats.json');
fs.writeFileSync(targetPath, JSON.stringify(ALL_PLAYERS, null, 2), 'utf8');

console.log(`🎉 Successfully generated dataset with ${ALL_PLAYERS.length} international players!`);
console.log(`📁 Saved to: ${targetPath}`);
