import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { startOfToday } from 'date-fns';
import { Scheduler } from '../components/Scheduler';
import { CalEvent } from '../types';
import { SchedulerDateControls } from '../components/SchedulerDateControls';
import { divisionDetails, events as rawEvents, resources } from '../data/daily';
import { SourceCodeLink } from './SourceCodeLink';

function Daily() {
  const [activeDate, setActiveDate] = useState(startOfToday());
  const [events, setEvents] = useState<CalEvent[]>(rawEvents);

  const handleEventChange = (event: CalEvent) => {
    setEvents((prevEvents) => {
      const index = prevEvents.findIndex((e) => e.id === event.id);
      const newEvents = [...prevEvents];
      newEvents[index] = event;
      return newEvents;
    });
  };

  return (
    <>
      <Box mb={2} display="flex" alignItems="center" flexDirection="column">
        <Typography variant="h5">Pragmatic Scheduler Demo - Daily</Typography>
        <SourceCodeLink href="https://github.com/paul-orchid/pragmatic-scheduler/blob/main/src/demo/Daily.tsx" />
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
    </>
  );
}

export default Daily;
