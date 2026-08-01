/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // StaffCentral / Modern Light UI Palette tokens matching user screenshot:
        brand: {
          50: '#EBF3FF',
          100: '#D6E7FF',
          200: '#ADCFFF',
          300: '#75B0FF',
          400: '#3B8BFF',
          500: '#0066FF', // Vibrant Electric Blue
          600: '#0052CC',
          700: '#003E99',
          800: '#002B66',
          900: '#001833',
        },
        cardPink: {
          DEFAULT: '#FF3875',
          dark: '#E0265F',
        },
        cardGreen: {
          DEFAULT: '#00C853',
          dark: '#009E40',
        },
        cardBlue: {
          DEFAULT: '#0066FF',
          dark: '#0052CC',
        },
        cardCoral: {
          DEFAULT: '#FF5722',
          dark: '#E64A19',
        },
        surface: {
          bg: '#F4F6F8',
          card: '#FFFFFF',
          sidebar: '#FAFAFC',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
