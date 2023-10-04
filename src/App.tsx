import { ThemeProvider } from '@mui/system';
import React, { useState } from 'react';
import './App.css';
import { Box, Typography } from '@mui/material';
import { startOfToday } from 'date-fns';
import { Scheduler } from './components/Scheduler';
import { CalEvent } from './types';
import { SchedulerDateControls } from './components/SchedulerDateControls';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from './layout/theme';
import { divisionDetails, events, resources } from './data/scheduler';

function App() {
  const [activeDate, setActiveDate] = useState(startOfToday());

  const handleEventChange = (event: CalEvent) => {
    console.log('dashboard event changed', event);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box mb={2}>
          <Typography variant="h3">Pragmatic Scheduler Demo</Typography>
        </Box>
        <Box mb={2} display="flex" justifyContent="center">
          <SchedulerDateControls activeDate={activeDate} setActiveDate={setActiveDate} />
        </Box>
        <Scheduler
          activeDate={activeDate}
          resources={resources}
          events={events}
          divisionDetails={divisionDetails}
          onEventChange={handleEventChange}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
