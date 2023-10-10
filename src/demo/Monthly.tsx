import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { format, isFirstDayOfMonth, isWeekend, startOfToday } from 'date-fns';
import { Scheduler } from '../components/Scheduler';
import { CalEvent, ScheduleDay } from '../types';
import { SchedulerDateControls } from '../components/SchedulerDateControls';
import { divisionDetails, events as rawEvents, resources } from '../data/monthly';

const myDivisionWidth = 50;
const weekendColor = '#EDF1F6';

function Monthly() {
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
        <Typography variant="h5" mb={1}>
          Pragmatic Scheduler Demo - Monthly
        </Typography>
        <Typography variant="subtitle1">This example also has a Custom Header Row passed</Typography>
      </Box>
      <Box mb={2} display="flex" justifyContent="center">
        {/* <SchedulerDateControls activeDate={activeDate} setActiveDate={setActiveDate} /> */}
      </Box>
      <Scheduler
        activeDate={activeDate}
        resources={resources}
        events={events}
        divisionDetails={divisionDetails}
        onEventChange={handleEventChange}
        HeaderRow={HeaderRow}
        config={{
          resourceColumnWidth: 220,
          rowMinHeight: 70,
          divisionWidth: myDivisionWidth,
          eventMinSeconds: 60 * 60 * 9, // 9 hours
          divisionParts: 1,
          daysToDisplay: 30,
        }}
      />
    </>
  );
}

const HeaderRow = ({ days }: { days: ScheduleDay[] }) => {
  return days.map((day, index) => {
    const showMonthHeader = index === 1 || isFirstDayOfMonth(day.date);
    const _isWeekend = isWeekend(day.date);
    return (
      <Box
        key={index}
        display="flex"
        flexDirection="column"
        flex={1}
        minWidth={myDivisionWidth}
        maxWidth={myDivisionWidth}
      >
        <Box minHeight={19}>
          <Typography variant="tableHeader" color="red">
            {showMonthHeader ? format(day.date, 'MMM') : ' '}
          </Typography>
        </Box>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          sx={{ backgroundColor: _isWeekend ? weekendColor : 'unset' }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="tableHeader" color="text.secondary">
            {format(day.date, 'dd')}
          </Typography>
          <Typography variant="subtitle2" color="text.disabled">
            {format(day.date, 'EEE').toUpperCase()}
          </Typography>
        </Box>
      </Box>
    );
  });
};

export default Monthly;
