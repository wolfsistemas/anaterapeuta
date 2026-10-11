/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFcf7',
          100: '#F7F3EC',
          200: '#EFE7DA',
          300: '#E4D8C4',
        },
        sage: {
          50: '#F3F6F3',
          100: '#E2EBE3',
          200: '#C5D6C7',
          300: '#9BB8A0',
          400: '#6B8F71',
          500: '#54765A',
          600: '#3D5A40',
          700: '#2F4632',
        },
        clay: {
          400: '#D49278',
          500: '#C4785A',
          600: '#A85E42',
        },
        ink: {
          500: '#6B6560',
          700: '#3F3B36',
          900: '#2C2A26',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px -24px rgba(61, 90, 64, 0.28)',
        card: '0 8px 30px -12px rgba(44, 42, 38, 0.12)',
      },
    },
  },
  plugins: [],
}
