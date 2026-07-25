/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0b0f17',
          800: '#111827',
          700: '#1e293b',
          600: '#334155'
        },
        brand: {
          cyan: '#06b6d4',
          neon: '#00f2fe',
          emerald: '#10b981',
          gold: '#f59e0b',
          purple: '#8b5cf6'
        }
      }
    },
  },
  plugins: [],
}
