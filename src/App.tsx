import { ThemeProvider } from '@mui/system';
import React, { useRef } from 'react';
import './App.css';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from './layout/theme';
import { HashRouter } from 'react-router-dom';
import Sidebar from './demo/Sidebar';
import AppRouter from './demo/AppRouter';

function App() {
  const basename = useRef(
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? undefined : '/pragmatic-scheduler',
  ).current;
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <HashRouter basename={basename}>
          <Box display="flex" flexDirection="row" height="100%" width="100%">
            <Sidebar />

            <Box flex={1} minWidth={0}>
              <AppRouter />
            </Box>
          </Box>
        </HashRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
