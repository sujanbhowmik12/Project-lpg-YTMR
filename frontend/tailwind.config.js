/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom 6-color Palette from user specification:
        // ROSÉ: #E3A58A, CORAL: #E9633E, SUNBEAM: #EAAA42
        // MELON: #A0AF72, SEAFOAM: #AAC1AD, NEPTUNE: #537987
        rose: {
          DEFAULT: '#E3A58A',
          light: '#F2D3C7',
          dark: '#C87F63',
          500: '#E3A58A',
        },
        coral: {
          DEFAULT: '#E9633E',
          50: '#FDF3F0',
          100: '#FCE4DD',
          200: '#F8C4B7',
          300: '#F49E8A',
          400: '#EE7D60',
          500: '#E9633E',
          600: '#D24B27',
          700: '#AA3517',
          800: '#86280F',
          900: '#6E210C',
        },
        sunbeam: {
          DEFAULT: '#EAAA42',
          light: '#F6D995',
          dark: '#C78923',
          500: '#EAAA42',
        },
        melon: {
          DEFAULT: '#A0AF72',
          light: '#C8D3A8',
          dark: '#7A884E',
          500: '#A0AF72',
        },
        seafoam: {
          DEFAULT: '#AAC1AD',
          light: '#D3E1D5',
          dark: '#7E9C82',
          500: '#AAC1AD',
        },
        neptune: {
          DEFAULT: '#537987',
          50: '#F2F6F7',
          100: '#E2EBEF',
          200: '#C7D8DF',
          300: '#9FBECD',
          400: '#759EB1',
          500: '#537987',
          600: '#3D5E6B',
          700: '#2F4954',
          800: '#22363F',
          900: '#16242B',
          950: '#0B1317',
        },
        brand: {
          50: '#FDF3F0',
          100: '#FCE4DD',
          200: '#F8C4B7',
          300: '#F49E8A',
          400: '#EE7D60',
          500: '#E9633E', // Coral as primary brand color
          600: '#D24B27',
          700: '#AA3517',
          800: '#86280F',
          900: '#6E210C',
        },
        gasBlue: {
          50: '#F2F6F7',
          100: '#E2EBEF',
          200: '#C7D8DF',
          300: '#9FBECD',
          400: '#759EB1',
          500: '#537987', // Neptune slate teal
          600: '#3D5E6B',
          700: '#2F4954',
          800: '#22363F',
          900: '#16242B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
