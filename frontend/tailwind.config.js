// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f0f0f',
          card: '#1a1a1a',
          hover: '#252525',
          border: '#2a2a2a',
          text: '#e5e5e5',
          muted: '#a0a0a0',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
        },
        accent: {
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
        }
      },
      backgroundColor: {
        'dark-primary': '#0f0f0f',
        'dark-secondary': '#1a1a1a',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}