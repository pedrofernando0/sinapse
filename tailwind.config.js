import animate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './legacy/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [animate],
};
