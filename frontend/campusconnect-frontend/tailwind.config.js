module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#bad6ff',
          300: '#85b6ff',
          400: '#4d8dff',
          500: '#1a5fff',
          600: '#0047ff',
          700: '#0040e6',
          800: '#0036cc',
          900: '#002b99'
        },
        secondary: {
          400: '#764ba2',
          500: '#667eea'
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e'
        },
        bg: {
          glass: 'rgba(255, 255, 255, 0.95)'
        }
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      animation: {
        'gradient-shift': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite'
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}
