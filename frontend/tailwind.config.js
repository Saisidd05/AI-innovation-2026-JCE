/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0A0E17',
        panel: '#0F172A',
        elevated: '#131F37',
        border: '#1E293B',
        primary: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5'
        },
        text: {
          main: '#F8FAFC',
          secondary: '#94A3B8'
        },
        status: {
          observed: '#38BDF8',
          verified: '#10B981',
          inferred: '#F59E0B',
          flagged: '#EF4444',
          synthetic: '#D97706'
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
