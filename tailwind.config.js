/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0f1c',
        'card-dark': '#1e293b',
        'primary': '#3b82f6',
        'accent': '#f59e0b',
        'border-dark': '#334155',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'success': '#10b981',
        'danger': '#ef4444',
        'warning': '#f59e0b'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      width: {
        'sidebar': '240px',
      },
      minHeight: {
        'card': '120px',
      }
    },
  },
  plugins: [],
}
