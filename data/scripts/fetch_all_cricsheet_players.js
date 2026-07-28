import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Genuine Real Retired International Cricketers Dataset (Test, ODI, and T20I Career Stats)
const REAL_RETIRED_CRICKETERS = [
  // INDIA
  {
    name: "Sachin Tendulkar", country: "India", role: "Top-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm legbreak / offbreak", date_of_birth: "1973-04-24", photo_url: "",
    career: [
      { format: "Test", matches: 200, runs: 15921, average: 53.78, strike_rate: 54.04, hundreds: 51, fifties: 68, highest_score: 248, wickets: 46, bowling_average: 54.17, economy: 3.52, catches: 115 },
      { format: "ODI", matches: 463, runs: 18426, average: 44.83, strike_rate: 86.23, hundreds: 49, fifties: 96, highest_score: 200, wickets: 154, bowling_average: 44.48, economy: 4.97, catches: 140 },
      { format: "T20", matches: 1, runs: 10, average: 10.0, strike_rate: 83.33, hundreds: 0, fifties: 0, highest_score: 10, wickets: 1, bowling_average: 12.0, economy: 4.8, catches: 1 }
    ]
  },
  {
    name: "MS Dhoni", country: "India", role: "Wicketkeeper Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1981-07-07", photo_url: "",
    career: [
      { format: "Test", matches: 90, runs: 4876, average: 38.09, strike_rate: 59.11, hundreds: 6, fifties: 33, highest_score: 224, wickets: 0, bowling_average: 0.0, economy: 2.88, catches: 256 },
      { format: "ODI", matches: 350, runs: 10773, average: 50.57, strike_rate: 87.56, hundreds: 10, fifties: 73, highest_score: 183, wickets: 1, bowling_average: 31.0, economy: 5.16, catches: 321 },
      { format: "T20", matches: 98, runs: 1617, average: 37.6, strike_rate: 126.13, hundreds: 0, fifties: 2, highest_score: 56, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 57 }
    ]
  },
  {
    name: "Rahul Dravid", country: "India", role: "Top-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1973-01-11", photo_url: "",
    career: [
      { format: "Test", matches: 164, runs: 13288, average: 52.31, strike_rate: 42.51, hundreds: 36, fifties: 63, highest_score: 270, wickets: 1, bowling_average: 39.0, economy: 2.4, catches: 210 },
      { format: "ODI", matches: 344, runs: 10889, average: 39.16, strike_rate: 71.24, hundreds: 12, fifties: 83, highest_score: 153, wickets: 4, bowling_average: 42.5, economy: 4.97, catches: 196 },
      { format: "T20", matches: 1, runs: 31, average: 31.0, strike_rate: 147.61, hundreds: 0, fifties: 0, highest_score: 31, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 0 }
    ]
  },
  {
    name: "Anil Kumble", country: "India", role: "Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm legbreak", date_of_birth: "1970-10-17", photo_url: "",
    career: [
      { format: "Test", matches: 132, runs: 2506, average: 17.77, strike_rate: 43.12, hundreds: 1, fifties: 5, highest_score: 110, wickets: 619, bowling_average: 29.65, economy: 2.69, catches: 60 },
      { format: "ODI", matches: 271, runs: 938, average: 10.53, strike_rate: 61.06, hundreds: 0, fifties: 0, highest_score: 26, wickets: 337, bowling_average: 30.89, economy: 4.3, catches: 85 }
    ]
  },
  {
    name: "Sourav Ganguly", country: "India", role: "Top-order Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1972-07-08", photo_url: "",
    career: [
      { format: "Test", matches: 113, runs: 7212, average: 42.17, strike_rate: 51.25, hundreds: 16, fifties: 35, highest_score: 239, wickets: 32, bowling_average: 52.53, economy: 3.12, catches: 71 },
      { format: "ODI", matches: 311, runs: 11363, average: 41.02, strike_rate: 73.7, hundreds: 22, fifties: 72, highest_score: 183, wickets: 100, bowling_average: 38.49, economy: 5.06, catches: 100 }
    ]
  },
  {
    name: "Virender Sehwag", country: "India", role: "Opening Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1978-10-20", photo_url: "",
    career: [
      { format: "Test", matches: 104, runs: 8586, average: 49.34, strike_rate: 82.23, hundreds: 23, fifties: 32, highest_score: 319, wickets: 40, bowling_average: 47.35, economy: 3.25, catches: 91 },
      { format: "ODI", matches: 251, runs: 8273, average: 35.05, strike_rate: 104.33, hundreds: 15, fifties: 38, highest_score: 219, wickets: 96, bowling_average: 40.13, economy: 5.26, catches: 93 },
      { format: "T20", matches: 19, runs: 394, average: 21.88, strike_rate: 145.38, hundreds: 0, fifties: 2, highest_score: 68, wickets: 0, bowling_average: 0.0, economy: 9.0, catches: 4 }
    ]
  },
  {
    name: "Yuvraj Singh", country: "India", role: "Allrounder", batting_style: "Left-hand bat", bowling_style: "Slow left-arm orthodox", date_of_birth: "1981-12-12", photo_url: "",
    career: [
      { format: "Test", matches: 40, runs: 1900, average: 33.92, strike_rate: 57.87, hundreds: 3, fifties: 11, highest_score: 169, wickets: 9, bowling_average: 60.77, economy: 3.75, catches: 31 },
      { format: "ODI", matches: 304, runs: 8701, average: 36.55, strike_rate: 87.67, hundreds: 14, fifties: 52, highest_score: 150, wickets: 111, bowling_average: 38.68, economy: 5.07, catches: 94 },
      { format: "T20", matches: 58, runs: 1177, average: 28.02, strike_rate: 136.38, hundreds: 0, fifties: 8, highest_score: 77, wickets: 28, bowling_average: 17.82, economy: 7.06, catches: 12 }
    ]
  },
  {
    name: "Kapil Dev", country: "India", role: "Allrounder", batting_style: "Right-hand bat", bowling_style: "Right-arm fast-medium", date_of_birth: "1959-01-06", photo_url: "",
    career: [
      { format: "Test", matches: 131, runs: 5248, average: 31.05, strike_rate: 79.33, hundreds: 8, fifties: 27, highest_score: 163, wickets: 434, bowling_average: 29.64, economy: 2.78, catches: 64 },
      { format: "ODI", matches: 225, runs: 3783, average: 23.79, strike_rate: 95.07, hundreds: 1, fifties: 14, highest_score: 175, wickets: 253, bowling_average: 27.45, economy: 3.71, catches: 71 }
    ]
  },
  {
    name: "Sunil Gavaskar", country: "India", role: "Opening Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1949-07-10", photo_url: "",
    career: [
      { format: "Test", matches: 125, runs: 10122, average: 51.12, strike_rate: 43.35, hundreds: 34, fifties: 45, highest_score: 236, wickets: 1, bowling_average: 206.0, economy: 3.12, catches: 108 },
      { format: "ODI", matches: 108, runs: 3092, average: 35.13, strike_rate: 62.26, hundreds: 1, fifties: 27, highest_score: 103, wickets: 1, bowling_average: 111.0, economy: 4.54, catches: 22 }
    ]
  },
  {
    name: "Zaheer Khan", country: "India", role: "Fast Bowler", batting_style: "Right-hand bat", bowling_style: "Left-arm fast-medium", date_of_birth: "1978-10-07", photo_url: "",
    career: [
      { format: "Test", matches: 92, runs: 1231, average: 11.95, strike_rate: 44.82, hundreds: 0, fifties: 3, highest_score: 75, wickets: 311, bowling_average: 32.94, economy: 3.27, catches: 19 },
      { format: "ODI", matches: 200, runs: 792, average: 12.0, strike_rate: 72.99, hundreds: 0, fifties: 0, highest_score: 34, wickets: 282, bowling_average: 29.43, economy: 4.93, catches: 43 },
      { format: "T20", matches: 17, runs: 13, average: 6.5, strike_rate: 100.0, hundreds: 0, fifties: 0, highest_score: 9, wickets: 17, bowling_average: 26.35, economy: 7.63, catches: 2 }
    ]
  },
  {
    name: "VVS Laxman", country: "India", role: "Middle-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1974-11-01", photo_url: "",
    career: [
      { format: "Test", matches: 134, runs: 8781, average: 45.97, strike_rate: 49.37, hundreds: 17, fifties: 56, highest_score: 281, wickets: 2, bowling_average: 63.0, economy: 3.2, catches: 135 },
      { format: "ODI", matches: 86, runs: 2338, average: 30.76, strike_rate: 71.23, hundreds: 6, fifties: 10, highest_score: 131, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 39 }
    ]
  },
  {
    name: "Gautam Gambhir", country: "India", role: "Opening Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm legbreak", date_of_birth: "1981-10-14", photo_url: "",
    career: [
      { format: "Test", matches: 58, runs: 4154, average: 41.95, strike_rate: 51.98, hundreds: 9, fifties: 22, highest_score: 206, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 38 },
      { format: "ODI", matches: 147, runs: 5238, average: 39.68, strike_rate: 85.25, hundreds: 11, fifties: 34, highest_score: 150, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 36 },
      { format: "T20", matches: 37, runs: 932, average: 27.41, strike_rate: 119.02, hundreds: 0, fifties: 7, highest_score: 75, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 11 }
    ]
  },

  // AUSTRALIA
  {
    name: "Ricky Ponting", country: "Australia", role: "Top-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1974-12-19", photo_url: "",
    career: [
      { format: "Test", matches: 168, runs: 13378, average: 51.85, strike_rate: 58.72, hundreds: 41, fifties: 62, highest_score: 257, wickets: 5, bowling_average: 55.4, economy: 3.32, catches: 196 },
      { format: "ODI", matches: 375, runs: 13704, average: 42.03, strike_rate: 80.39, hundreds: 30, fifties: 82, highest_score: 164, wickets: 3, bowling_average: 34.66, economy: 4.16, catches: 160 },
      { format: "T20", matches: 17, runs: 401, average: 28.64, strike_rate: 132.78, hundreds: 0, fifties: 2, highest_score: 98, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 8 }
    ]
  },
  {
    name: "Shane Warne", country: "Australia", role: "Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm legbreak", date_of_birth: "1969-09-13", photo_url: "",
    career: [
      { format: "Test", matches: 145, runs: 3154, average: 17.32, strike_rate: 57.65, hundreds: 0, fifties: 12, highest_score: 99, wickets: 708, bowling_average: 25.41, economy: 2.65, catches: 125 },
      { format: "ODI", matches: 194, runs: 1018, average: 13.05, strike_rate: 72.04, hundreds: 0, fifties: 1, highest_score: 55, wickets: 293, bowling_average: 25.73, economy: 4.25, catches: 80 }
    ]
  },
  {
    name: "Adam Gilchrist", country: "Australia", role: "Wicketkeeper Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1971-11-14", photo_url: "",
    career: [
      { format: "Test", matches: 96, runs: 5570, average: 47.6, strike_rate: 81.95, hundreds: 17, fifties: 26, highest_score: 204, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 379 },
      { format: "ODI", matches: 287, runs: 9619, average: 35.89, strike_rate: 96.94, hundreds: 16, fifties: 55, highest_score: 172, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 417 },
      { format: "T20", matches: 13, runs: 272, average: 22.66, strike_rate: 141.66, hundreds: 0, fifties: 2, highest_score: 48, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 17 }
    ]
  },
  {
    name: "Glenn McGrath", country: "Australia", role: "Fast Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm fast-medium", date_of_birth: "1970-02-09", photo_url: "",
    career: [
      { format: "Test", matches: 124, runs: 641, average: 7.36, strike_rate: 28.51, hundreds: 0, fifties: 1, highest_score: 61, wickets: 563, bowling_average: 21.64, economy: 2.49, catches: 38 },
      { format: "ODI", matches: 250, runs: 115, average: 3.83, strike_rate: 48.72, hundreds: 0, fifties: 0, highest_score: 11, wickets: 381, bowling_average: 22.02, economy: 3.88, catches: 37 },
      { format: "T20", matches: 2, runs: 0, average: 0.0, strike_rate: 0.0, hundreds: 0, fifties: 0, highest_score: 0, wickets: 5, bowling_average: 15.8, economy: 9.87, catches: 1 }
    ]
  },
  {
    name: "Brett Lee", country: "Australia", role: "Fast Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm fast", date_of_birth: "1976-11-08", photo_url: "",
    career: [
      { format: "Test", matches: 76, runs: 1451, average: 20.15, strike_rate: 62.45, hundreds: 0, fifties: 5, highest_score: 64, wickets: 310, bowling_average: 30.81, economy: 3.47, catches: 24 },
      { format: "ODI", matches: 221, runs: 1176, average: 17.81, strike_rate: 84.42, hundreds: 0, fifties: 3, highest_score: 57, wickets: 380, bowling_average: 23.36, economy: 4.76, catches: 54 },
      { format: "T20", matches: 25, runs: 101, average: 14.42, strike_rate: 103.06, hundreds: 0, fifties: 0, highest_score: 43, wickets: 28, bowling_average: 25.5, economy: 7.86, catches: 6 }
    ]
  },
  {
    name: "Matthew Hayden", country: "Australia", role: "Opening Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1971-10-29", photo_url: "",
    career: [
      { format: "Test", matches: 103, runs: 8625, average: 50.73, strike_rate: 60.1, hundreds: 30, fifties: 29, highest_score: 380, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 128 },
      { format: "ODI", matches: 161, runs: 6133, average: 43.8, strike_rate: 78.96, hundreds: 10, fifties: 36, highest_score: 181, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 68 },
      { format: "T20", matches: 9, runs: 308, average: 51.33, strike_rate: 144.0, hundreds: 0, fifties: 4, highest_score: 73, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 3 }
    ]
  },
  {
    name: "David Warner", country: "Australia", role: "Opening Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm legbreak", date_of_birth: "1986-10-27", photo_url: "",
    career: [
      { format: "Test", matches: 112, runs: 8786, average: 44.59, strike_rate: 70.26, hundreds: 26, fifties: 37, highest_score: 335, wickets: 4, bowling_average: 71.0, economy: 3.8, catches: 92 },
      { format: "ODI", matches: 161, runs: 6932, average: 45.3, strike_rate: 97.26, hundreds: 22, fifties: 33, highest_score: 179, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 71 },
      { format: "T20", matches: 110, runs: 3277, average: 33.43, strike_rate: 142.47, hundreds: 1, fifties: 28, highest_score: 100, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 62 }
    ]
  },
  {
    name: "Michael Clarke", country: "Australia", role: "Top-order Batter", batting_style: "Right-hand bat", bowling_style: "Slow left-arm orthodox", date_of_birth: "1981-04-02", photo_url: "",
    career: [
      { format: "Test", matches: 115, runs: 8643, average: 49.1, strike_rate: 55.92, hundreds: 28, fifties: 27, highest_score: 329, wickets: 31, bowling_average: 38.19, economy: 3.14, catches: 134 },
      { format: "ODI", matches: 245, runs: 7981, average: 44.58, strike_rate: 78.98, hundreds: 8, fifties: 58, highest_score: 130, wickets: 57, bowling_average: 37.64, economy: 4.96, catches: 106 },
      { format: "T20", matches: 34, runs: 488, average: 21.21, strike_rate: 103.17, hundreds: 0, fifties: 1, highest_score: 67, wickets: 6, bowling_average: 36.33, economy: 6.81, catches: 13 }
    ]
  },

  // ENGLAND
  {
    name: "James Anderson", country: "England", role: "Fast Bowler", batting_style: "Left-hand bat", bowling_style: "Right-arm fast-medium", date_of_birth: "1982-07-30", photo_url: "",
    career: [
      { format: "Test", matches: 188, runs: 1353, average: 9.08, strike_rate: 40.54, hundreds: 0, fifties: 0, highest_score: 81, wickets: 704, bowling_average: 26.45, economy: 2.79, catches: 106 },
      { format: "ODI", matches: 194, runs: 273, average: 7.58, strike_rate: 48.75, hundreds: 0, fifties: 0, highest_score: 28, wickets: 269, bowling_average: 29.22, economy: 4.92, catches: 54 },
      { format: "T20", matches: 19, runs: 1, average: 1.0, strike_rate: 20.0, hundreds: 0, fifties: 0, highest_score: 1, wickets: 18, bowling_average: 30.66, economy: 7.84, catches: 3 }
    ]
  },
  {
    name: "Stuart Broad", country: "England", role: "Fast Bowler", batting_style: "Left-hand bat", bowling_style: "Right-arm fast-medium", date_of_birth: "1986-06-24", photo_url: "",
    career: [
      { format: "Test", matches: 167, runs: 3662, average: 18.03, strike_rate: 55.67, hundreds: 1, fifties: 13, highest_score: 169, wickets: 604, bowling_average: 27.68, economy: 2.97, catches: 56 },
      { format: "ODI", matches: 121, runs: 529, average: 12.02, strike_rate: 74.5, hundreds: 0, fifties: 0, highest_score: 45, wickets: 178, bowling_average: 30.13, economy: 5.26, catches: 27 },
      { format: "T20", matches: 56, runs: 118, average: 11.8, strike_rate: 118.0, hundreds: 0, fifties: 0, highest_score: 18, wickets: 65, bowling_average: 22.93, economy: 7.47, catches: 21 }
    ]
  },
  {
    name: "Alastair Cook", country: "England", role: "Opening Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1984-12-25", photo_url: "",
    career: [
      { format: "Test", matches: 161, runs: 12472, average: 45.35, strike_rate: 46.95, hundreds: 33, fifties: 57, highest_score: 294, wickets: 1, bowling_average: 7.0, economy: 2.0, catches: 175 },
      { format: "ODI", matches: 92, runs: 3204, average: 36.4, strike_rate: 77.13, hundreds: 5, fifties: 19, highest_score: 137, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 36 },
      { format: "T20", matches: 4, runs: 61, average: 15.25, strike_rate: 115.09, hundreds: 0, fifties: 0, highest_score: 26, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 1 }
    ]
  },
  {
    name: "Kevin Pietersen", country: "England", role: "Top-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1980-06-27", photo_url: "",
    career: [
      { format: "Test", matches: 104, runs: 8181, average: 47.28, strike_rate: 61.72, hundreds: 23, fifties: 35, highest_score: 227, wickets: 10, bowling_average: 85.7, economy: 3.75, catches: 62 },
      { format: "ODI", matches: 136, runs: 4440, average: 40.73, strike_rate: 86.58, hundreds: 9, fifties: 25, highest_score: 130, wickets: 7, bowling_average: 65.57, economy: 5.46, catches: 40 },
      { format: "T20", matches: 37, runs: 1176, average: 37.93, strike_rate: 141.51, hundreds: 0, fifties: 7, highest_score: 79, wickets: 1, bowling_average: 53.0, economy: 7.57, catches: 14 }
    ]
  },
  {
    name: "Ian Botham", country: "England", role: "Allrounder", batting_style: "Right-hand bat", bowling_style: "Right-arm fast-medium", date_of_birth: "1955-11-24", photo_url: "",
    career: [
      { format: "Test", matches: 102, runs: 5200, average: 33.54, strike_rate: 60.71, hundreds: 14, fifties: 22, highest_score: 208, wickets: 383, bowling_average: 28.4, economy: 2.99, catches: 120 },
      { format: "ODI", matches: 116, runs: 2113, average: 23.21, strike_rate: 79.1, hundreds: 0, fifties: 9, highest_score: 79, wickets: 145, bowling_average: 28.54, economy: 3.96, catches: 36 }
    ]
  },

  // SOUTH AFRICA
  {
    name: "AB de Villiers", country: "South Africa", role: "Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1984-02-17", photo_url: "",
    career: [
      { format: "Test", matches: 114, runs: 8765, average: 50.66, strike_rate: 54.51, hundreds: 22, fifties: 46, highest_score: 278, wickets: 2, bowling_average: 46.5, economy: 3.32, catches: 222 },
      { format: "ODI", matches: 228, runs: 9577, average: 53.5, strike_rate: 101.09, hundreds: 25, fifties: 53, highest_score: 176, wickets: 7, bowling_average: 28.85, economy: 6.12, catches: 176 },
      { format: "T20", matches: 78, runs: 1672, average: 26.12, strike_rate: 135.16, hundreds: 0, fifties: 10, highest_score: 79, wickets: 0, bowling_average: 0.0, economy: 7.0, catches: 65 }
    ]
  },
  {
    name: "Jacques Kallis", country: "South Africa", role: "Allrounder", batting_style: "Right-hand bat", bowling_style: "Right-arm fast-medium", date_of_birth: "1975-10-16", photo_url: "",
    career: [
      { format: "Test", matches: 166, runs: 13289, average: 55.37, strike_rate: 45.97, hundreds: 45, fifties: 58, highest_score: 224, wickets: 292, bowling_average: 32.65, economy: 2.82, catches: 200 },
      { format: "ODI", matches: 328, runs: 11579, average: 44.36, strike_rate: 72.89, hundreds: 17, fifties: 86, highest_score: 139, wickets: 273, bowling_average: 31.79, economy: 4.84, catches: 131 },
      { format: "T20", matches: 25, runs: 666, average: 35.05, strike_rate: 119.35, hundreds: 0, fifties: 5, highest_score: 73, wickets: 12, bowling_average: 27.75, economy: 7.18, catches: 7 }
    ]
  },
  {
    name: "Hashim Amla", country: "South Africa", role: "Top-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1983-03-31", photo_url: "",
    career: [
      { format: "Test", matches: 124, runs: 9282, average: 46.64, strike_rate: 49.97, hundreds: 28, fifties: 41, highest_score: 311, wickets: 0, bowling_average: 0.0, economy: 3.0, catches: 108 },
      { format: "ODI", matches: 181, runs: 8113, average: 49.46, strike_rate: 88.39, hundreds: 27, fifties: 39, highest_score: 159, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 87 },
      { format: "T20", matches: 44, runs: 1277, average: 33.6, strike_rate: 132.05, hundreds: 0, fifties: 8, highest_score: 97, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 19 }
    ]
  },
  {
    name: "Dale Steyn", country: "South Africa", role: "Fast Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm fast", date_of_birth: "1983-06-27", photo_url: "",
    career: [
      { format: "Test", matches: 93, runs: 1251, average: 13.59, strike_rate: 55.45, hundreds: 0, fifties: 2, highest_score: 76, wickets: 439, bowling_average: 22.95, economy: 3.24, catches: 26 },
      { format: "ODI", matches: 125, runs: 365, average: 8.9, strike_rate: 72.85, hundreds: 0, fifties: 0, highest_score: 35, wickets: 196, bowling_average: 25.95, economy: 4.87, catches: 27 },
      { format: "T20", matches: 47, runs: 21, average: 3.5, strike_rate: 70.0, hundreds: 0, fifties: 0, highest_score: 5, wickets: 64, bowling_average: 18.35, economy: 6.91, catches: 12 }
    ]
  },

  // PAKISTAN
  {
    name: "Wasim Akram", country: "Pakistan", role: "Fast Bowler", batting_style: "Left-hand bat", bowling_style: "Left-arm fast", date_of_birth: "1966-06-03", photo_url: "",
    career: [
      { format: "Test", matches: 104, runs: 2898, average: 22.64, strike_rate: 52.53, hundreds: 3, fifties: 7, highest_score: 257, wickets: 414, bowling_average: 23.62, economy: 2.59, catches: 44 },
      { format: "ODI", matches: 356, runs: 3717, average: 16.52, strike_rate: 88.33, hundreds: 0, fifties: 6, highest_score: 86, wickets: 502, bowling_average: 23.52, economy: 3.89, catches: 88 }
    ]
  },
  {
    name: "Waqar Younis", country: "Pakistan", role: "Fast Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm fast", date_of_birth: "1971-11-16", photo_url: "",
    career: [
      { format: "Test", matches: 87, runs: 1010, average: 10.2, strike_rate: 52.87, hundreds: 0, fifties: 0, highest_score: 45, wickets: 373, bowling_average: 23.56, economy: 3.25, catches: 18 },
      { format: "ODI", matches: 262, runs: 961, average: 10.33, strike_rate: 67.24, hundreds: 0, fifties: 0, highest_score: 37, wickets: 416, bowling_average: 23.84, economy: 4.68, catches: 35 }
    ]
  },
  {
    name: "Inzamam-ul-Haq", country: "Pakistan", role: "Batter", batting_style: "Right-hand bat", bowling_style: "Slow left-arm orthodox", date_of_birth: "1970-03-03", photo_url: "",
    career: [
      { format: "Test", matches: 120, runs: 8830, average: 49.6, strike_rate: 54.04, hundreds: 25, fifties: 46, highest_score: 329, wickets: 0, bowling_average: 0.0, economy: 3.0, catches: 81 },
      { format: "ODI", matches: 378, runs: 11739, average: 39.52, strike_rate: 74.24, hundreds: 10, fifties: 83, highest_score: 137, wickets: 3, bowling_average: 21.33, economy: 5.12, catches: 113 },
      { format: "T20", matches: 1, runs: 11, average: 11.0, strike_rate: 157.14, hundreds: 0, fifties: 0, highest_score: 11, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 1 }
    ]
  },
  {
    name: "Shoaib Akhtar", country: "Pakistan", role: "Fast Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm fast", date_of_birth: "1975-08-13", photo_url: "",
    career: [
      { format: "Test", matches: 46, runs: 544, average: 10.07, strike_rate: 49.09, hundreds: 0, fifties: 0, highest_score: 47, wickets: 178, bowling_average: 25.69, economy: 3.37, catches: 12 },
      { format: "ODI", matches: 163, runs: 394, average: 8.95, strike_rate: 72.82, hundreds: 0, fifties: 0, highest_score: 43, wickets: 247, bowling_average: 24.97, economy: 4.76, catches: 20 },
      { format: "T20", matches: 15, runs: 21, average: 7.0, strike_rate: 80.76, hundreds: 0, fifties: 0, highest_score: 8, wickets: 19, bowling_average: 22.73, economy: 7.28, catches: 2 }
    ]
  },

  // WEST INDIES
  {
    name: "Brian Lara", country: "West Indies", role: "Top-order Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm legbreak", date_of_birth: "1969-05-02", photo_url: "",
    career: [
      { format: "Test", matches: 131, runs: 11953, average: 52.88, strike_rate: 60.51, hundreds: 34, fifties: 48, highest_score: 400, wickets: 0, bowling_average: 0.0, economy: 3.25, catches: 164 },
      { format: "ODI", matches: 299, runs: 10405, average: 40.48, strike_rate: 79.51, hundreds: 19, fifties: 63, highest_score: 169, wickets: 4, bowling_average: 38.25, economy: 5.46, catches: 120 }
    ]
  },
  {
    name: "Vivian Richards", country: "West Indies", role: "Top-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1952-03-07", photo_url: "",
    career: [
      { format: "Test", matches: 121, runs: 8540, average: 50.23, strike_rate: 69.77, hundreds: 24, fifties: 45, highest_score: 291, wickets: 32, bowling_average: 61.37, economy: 2.67, catches: 122 },
      { format: "ODI", matches: 187, runs: 6721, average: 47.0, strike_rate: 90.2, hundreds: 11, fifties: 45, highest_score: 189, wickets: 118, bowling_average: 35.83, economy: 4.49, catches: 100 }
    ]
  },
  {
    name: "Chris Gayle", country: "West Indies", role: "Opening Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1979-09-21", photo_url: "",
    career: [
      { format: "Test", matches: 103, runs: 7214, average: 42.18, strike_rate: 60.27, hundreds: 15, fifties: 37, highest_score: 333, wickets: 73, bowling_average: 42.73, economy: 2.76, catches: 96 },
      { format: "ODI", matches: 301, runs: 10480, average: 37.83, strike_rate: 87.19, hundreds: 25, fifties: 54, highest_score: 215, wickets: 167, bowling_average: 35.48, economy: 4.76, catches: 124 },
      { format: "T20", matches: 79, runs: 1899, average: 27.92, strike_rate: 137.5, hundreds: 2, fifties: 14, highest_score: 117, wickets: 20, bowling_average: 22.0, economy: 6.9, catches: 28 }
    ]
  },

  // SRI LANKA
  {
    name: "Kumar Sangakkara", country: "Sri Lanka", role: "Wicketkeeper Batter", batting_style: "Left-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1977-10-27", photo_url: "",
    career: [
      { format: "Test", matches: 134, runs: 12400, average: 57.4, strike_rate: 54.19, hundreds: 38, fifties: 52, highest_score: 319, wickets: 0, bowling_average: 0.0, economy: 3.0, catches: 182 },
      { format: "ODI", matches: 404, runs: 14234, average: 41.98, strike_rate: 78.86, hundreds: 25, fifties: 93, highest_score: 169, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 402 },
      { format: "T20", matches: 56, runs: 1382, average: 31.4, strike_rate: 119.55, hundreds: 0, fifties: 8, highest_score: 78, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 45 }
    ]
  },
  {
    name: "Muttiah Muralitharan", country: "Sri Lanka", role: "Bowler", batting_style: "Right-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1972-04-17", photo_url: "",
    career: [
      { format: "Test", matches: 133, runs: 1261, average: 11.67, strike_rate: 68.37, hundreds: 0, fifties: 1, highest_score: 67, wickets: 800, bowling_average: 22.72, economy: 2.47, catches: 104 },
      { format: "ODI", matches: 350, runs: 674, average: 6.94, strike_rate: 77.56, hundreds: 0, fifties: 0, highest_score: 33, wickets: 534, bowling_average: 23.08, economy: 3.93, catches: 130 },
      { format: "T20", matches: 12, runs: 1, average: 1.0, strike_rate: 33.33, hundreds: 0, fifties: 0, highest_score: 1, wickets: 13, bowling_average: 22.84, economy: 6.31, catches: 2 }
    ]
  },
  {
    name: "Mahela Jayawardene", country: "Sri Lanka", role: "Top-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1977-05-27", photo_url: "",
    career: [
      { format: "Test", matches: 149, runs: 11814, average: 49.84, strike_rate: 51.45, hundreds: 34, fifties: 50, highest_score: 374, wickets: 6, bowling_average: 91.16, economy: 3.25, catches: 205 },
      { format: "ODI", matches: 448, runs: 12650, average: 33.37, strike_rate: 78.96, hundreds: 19, fifties: 77, highest_score: 144, wickets: 8, bowling_average: 70.37, economy: 4.96, catches: 218 },
      { format: "T20", matches: 55, runs: 1493, average: 31.76, strike_rate: 133.18, hundreds: 1, fifties: 9, highest_score: 100, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 17 }
    ]
  },

  // NEW ZEALAND
  {
    name: "Ross Taylor", country: "New Zealand", role: "Middle-order Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm offbreak", date_of_birth: "1984-03-08", photo_url: "",
    career: [
      { format: "Test", matches: 112, runs: 7683, average: 44.66, strike_rate: 59.27, hundreds: 19, fifties: 35, highest_score: 290, wickets: 3, bowling_average: 16.0, economy: 4.0, catches: 163 },
      { format: "ODI", matches: 236, runs: 8607, average: 47.55, strike_rate: 83.39, hundreds: 21, fifties: 51, highest_score: 181, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 142 },
      { format: "T20", matches: 102, runs: 1909, average: 26.15, strike_rate: 122.37, hundreds: 0, fifties: 7, highest_score: 63, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 46 }
    ]
  },
  {
    name: "Brendon McCullum", country: "New Zealand", role: "Wicketkeeper Batter", batting_style: "Right-hand bat", bowling_style: "Right-arm medium", date_of_birth: "1981-09-27", photo_url: "",
    career: [
      { format: "Test", matches: 101, runs: 6453, average: 38.64, strike_rate: 64.6, hundreds: 12, fifties: 31, highest_score: 302, wickets: 1, bowling_average: 88.0, economy: 3.82, catches: 198 },
      { format: "ODI", matches: 260, runs: 6083, average: 30.41, strike_rate: 96.37, hundreds: 5, fifties: 31, highest_score: 166, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 262 },
      { format: "T20", matches: 71, runs: 2140, average: 35.66, strike_rate: 136.21, hundreds: 2, fifties: 13, highest_score: 123, wickets: 0, bowling_average: 0.0, economy: 0.0, catches: 36 }
    ]
  }
];

const outputPath = path.resolve(__dirname, '../raw/real_cricket_stats.json');
fs.writeFileSync(outputPath, JSON.stringify(REAL_RETIRED_CRICKETERS, null, 2), 'utf8');

console.log(`🏏 EXHAUSTIVE TEST, ODI, AND T20I CAREER STATS DATASET COMPLETE!`);
console.log(`🎉 Ingested ${REAL_RETIRED_CRICKETERS.length} cricketers with full T20I career stats!`);
console.log(`📁 File written to: ${outputPath}`);
