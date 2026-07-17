/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FCFCFB',
        foreground: '#111827',
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#E0E7FF'
        },
        secondary: {
          DEFAULT: '#86EFAC',
          foreground: '#14532D',
        },
        accent: {
          DEFAULT: '#FFB89E',
          foreground: '#7C2D12',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F3F4F6'
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.02), 0 10px 30px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
      }
    },
  },
  plugins: [],
}
