/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Blue Brand Palette (AeroPulse Identity)
        brandBlue: {
          50: '#e0f2fe',
          100: '#bae6fd',
          200: '#7dd3fc',
          300: '#38bdf8',
          400: '#0ea5e9',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#164e63',
          950: '#082f49',
        },
        brandGreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        forest: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c5e0d4',
          300: '#9ecaba',
          400: '#71ae9b',
          500: '#4e927f',
          600: '#3c7566',
          700: '#325e53',
          800: '#2a4c44',
          900: '#243f39',
          950: '#0b1915',
        },
        // AQI Severity Colors (Strictly kept distinguishable)
        aqi: {
          good: '#10B981',        // Green
          satisfactory: '#84CC16',// Light Green
          moderate: '#F59E0B',    // Amber/Yellow
          poor: '#F97316',        // Orange
          veryPoor: '#EF4444',    // Crimson/Red
          severe: '#9333EA',      // Purple
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(34, 197, 94, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.3)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(147, 51, 234, 0.3)',
      }
    },
  },
  plugins: [],
};
