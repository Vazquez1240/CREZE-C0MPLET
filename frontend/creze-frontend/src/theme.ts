// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#778DA9', // Color secundario
        },
        // Agrega más colores según tus necesidades
        text: {
            primary: '#000000', // Color de texto principal
            secondary: '#ffffff', // Color de texto secundario
        },
        info: {
            main: '#415A77'
        },
        warning: {
          main: '#778DA9'
        },
        background: {
            default: '#f4f3ee', // Color de fondo por defecto
        },
        success: {
            main: '#91ff35'
        }

    },
});

export default theme;
