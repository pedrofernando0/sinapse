import animate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './01-app-core/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [animate],
};
