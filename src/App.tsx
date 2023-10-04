import { ThemeProvider } from '@mui/system';
import React from 'react';
import './App.css';
import { Box, Typography } from '@mui/material';

function App() {
  return (
    <ThemeProvider theme={{}}>
      <Box>
        <Typography variant="h3">Pragmatic Scheduler Demo</Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
