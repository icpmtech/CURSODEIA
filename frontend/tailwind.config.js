/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teams: {
          purple: '#6264A7',
          'purple-dark': '#464775',
          'purple-light': '#E8E8F0',
          blue: '#106EBE',
          'blue-light': '#EFF6FC',
          'gray-bg': '#F5F5F5',
          'gray-border': '#E1DFDD',
          'gray-text': '#605E5C',
          'gray-dark': '#323130',
          white: '#FFFFFF',
          red: '#C4314B',
          green: '#107C10',
          orange: '#D83B01',
          yellow: '#FFB900',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

