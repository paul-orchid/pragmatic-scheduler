import { ThemeProvider } from '@mui/system';
import React from 'react';
import './App.css';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from './layout/theme';
import { BrowserRouter } from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Sidebar from './demo/Sidebar';
import AppRouter from './demo/AppRouter';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Box display="flex" flexDirection="row" height="100%" width="100%">
            <Sidebar />

            <Box flex={1} minWidth={0}>
              <AppRouter />
            </Box>
          </Box>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
