/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f59e0b',
          light: '#ffc174',
          dim: '#ffb95f',
          container: '#f59e0b',
          onContainer: '#613b00',
          onPrimary: '#472a00',
        },
        secondary: {
          DEFAULT: '#6366f1',
          light: '#c0c1ff',
          container: '#3131c0',
          onContainer: '#b0b2ff',
        },
        tertiary: {
          DEFAULT: '#14b8a6',
          light: '#57e1ce',
          fixed: '#71f8e4',
          container: '#30c5b3',
          onContainer: '#004d44',
        },
        surface: {
          base: '#0b1326',
          bright: '#31394d',
          dim: '#0b1326',
          lowest: '#060e20',
          low: '#131b2e',
          DEFAULT: '#171f33',
          high: '#222a3d',
          highest: '#2d3449',
        },
        glass: {
          surface: 'rgba(15, 23, 42, 0.65)',
          subtle: 'rgba(15, 23, 42, 0.40)',
          active: 'rgba(30, 41, 59, 0.75)',
          modal: 'rgba(11, 19, 38, 0.85)',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-highlight': 'rgba(255, 255, 255, 0.16)',
          'border-active': 'rgba(245, 158, 11, 0.4)',
        },
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-amber': '0 0 24px -2px rgba(245, 158, 11, 0.35)',
        'glow-indigo': '0 0 22px -2px rgba(99, 102, 241, 0.35)',
        'glow-teal': '0 0 16px -2px rgba(87, 225, 206, 0.4)',
        'timer-glow': '0 0 45px -5px rgba(245, 158, 11, 0.18)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'eq-1': 'eqPulse 1.2s ease-in-out infinite alternate',
        'eq-2': 'eqPulse 0.9s ease-in-out infinite alternate 0.2s',
        'eq-3': 'eqPulse 1.5s ease-in-out infinite alternate 0.4s',
        'eq-4': 'eqPulse 1.1s ease-in-out infinite alternate 0.1s',
      },
      keyframes: {
        eqPulse: {
          '0%': { height: '4px' },
          '100%': { height: '16px' },
        },
      },
    },
  },
  plugins: [],
}
