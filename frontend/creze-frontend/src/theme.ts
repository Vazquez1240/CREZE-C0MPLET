// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#669bbc', // Color secundario
        },
        // Agrega más colores según tus necesidades
        background: {
            default: '#0D1B2A', // Color de fondo por defecto
        },
        text: {
            primary: '#000000', // Color de texto principal
            secondary: '#ffffff', // Color de texto secundario
        },


    },
});

export default theme;
