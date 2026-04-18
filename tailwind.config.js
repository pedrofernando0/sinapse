import animate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './legacy/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%':       { transform: 'translateX(-6px)' },
          '30%':       { transform: 'translateX(6px)' },
          '45%':       { transform: 'translateX(-5px)' },
          '60%':       { transform: 'translateX(5px)' },
          '75%':       { transform: 'translateX(-3px)' },
          '90%':       { transform: 'translateX(3px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        shake:            'shake 0.65s ease-in-out',
        'gradient-shift': 'gradient-shift 12s ease infinite',
      },
    },
  },
  plugins: [animate],
};
