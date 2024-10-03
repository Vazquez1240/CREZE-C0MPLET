// tailwind.config.js
const materialUITheme = require('./src/theme'); // Importa tu archivo de temas de Material UI

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Asegúrate de incluir todas tus rutas
  theme: {
    extend: {
      colors: {
        primary: materialUITheme.palette.primary.main,
        secondary: materialUITheme.palette.secondary.main,
        background: materialUITheme.palette.background.default,
      },
      fontFamily: {
        sans: materialUITheme.typography.fontFamily,
      },
    },
  },
  plugins: [],
};
