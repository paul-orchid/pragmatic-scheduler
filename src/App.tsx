import { ThemeProvider } from '@mui/system';
import React, { useRef, useState } from 'react';
import './App.css';
import { Box, Typography } from '@mui/material';
import { addMinutes, setHours, startOfToday } from 'date-fns';
import { Scheduler } from './components/Scheduler';
import { CalEvent, DivisionDetail, Resource } from './scheduler';
import { Colors } from './constants/colors';
import { SchedulerDateControls } from './components/SchedulerDateControls';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from './layout/theme';

function App() {
  const [activeDate, setActiveDate] = useState(startOfToday());
  const resources: Resource[] = useRef<Resource[]>([
    { id: '1', name: 'Andy' },
    { id: '2', name: 'Adam' },
  ]).current;

  const events: CalEvent[] = useRef<CalEvent[]>([
    {
      id: '1',
      resourceId: '1',
      startTime: addMinutes(startOfToday(), 18 * 60 + 30),
      endTime: addMinutes(startOfToday(), 19 * 60 + 30),
      title: 'Andy 630 - 730pm',
      bgColor: Colors.fluroAmber,
      textColor: 'black',
    },
    {
      id: '2',
      resourceId: '1',
      startTime: setHours(startOfToday(), 20),
      endTime: setHours(startOfToday(), 23),
      title: 'Andy 8-11pm',
      bgColor: Colors.fluroRed,
      textColor: 'white',
    },
    {
      id: '3',
      resourceId: '2',
      startTime: setHours(startOfToday(), 20),
      endTime: setHours(startOfToday(), 22),
      title: 'Adam 8 - 10pm',
      bgColor: Colors.gold,
      textColor: 'black',
    },
  ]).current;

  const divisionDetails = useRef<DivisionDetail[]>([
    { name: '6am', startHour: 6, endHour: 8 },
    { name: '8am', startHour: 8, endHour: 10 },
    { name: '10am', startHour: 10, endHour: 12 },
    { name: '12pm', startHour: 12, endHour: 14 },
    { name: '2pm', startHour: 14, endHour: 16 },
    { name: '4pm', startHour: 16, endHour: 18 },
    { name: '6pm', startHour: 18, endHour: 20 },
    { name: '8pm', startHour: 20, endHour: 22 },
    { name: '10pm', startHour: 22, endHour: 24 },
  ]).current;

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
