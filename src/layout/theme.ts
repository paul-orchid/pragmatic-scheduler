import { createTheme } from '@mui/material';
import { Colors } from '../constants/colors';

export const theme = createTheme({
  palette: {
    text: {
      secondary: Colors.primaryMain,
      disabled: '#A0A3BD',
    },
    primary: {
      main: Colors.primaryMain,
      dark: Colors.primaryDark,
    },
    secondary: { main: Colors.gold, light: '#EAE6DE' },
  },
  typography: {
    h2: {
      fontSize: 64,
      fontWeight: 800,
      lineHeight: '68px',
      letterSpacing: 0,
      // text-align: left;
    },
    h5: {
      fontSize: 26,
      fontWeight: 800,
      lineHeight: '33px',
      letterSpacing: '0.5px',
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 600,
      lineHeight: '24px',
      letterSpacing: '0.15px',
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: '24px',
      letterSpacing: '0.15px',
      textAlign: 'center',
    },
    body1: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0.15px',
    },
    body2: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '22px',
      letterSpacing: '0.15px',
    },
    caption: {
      fontSize: 12,
      fontWeight: 500,
      lineHeight: '15px',
    },
  },
});
