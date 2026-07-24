/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#a3e635',
          red: '#ef233c',
          pink: '#ff2e6c',
        },
        ink: '#0a0a0a',
      },
      fontFamily: {
        display: ['"Permanent Marker"', '"Bangers"', 'cursive'],
        body: ['"Rubik"', 'sans-serif'],
      },
      boxShadow: {
        neonGreen: '0 0 8px #a3e635, 0 0 24px #a3e63566',
        neonRed: '0 0 8px #ef233c, 0 0 24px #ef233c66',
      },
      keyframes: {
        'dice-roll': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(120deg) scale(1.1)' },
          '50%': { transform: 'rotate(240deg) scale(0.95)' },
          '75%': { transform: 'rotate(320deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
      },
      animation: {
        'dice-roll': 'dice-roll 0.6s ease-in-out',
        flicker: 'flicker 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
