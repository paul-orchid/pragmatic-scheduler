import React, { useState } from 'react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { addDays, format, isFirstDayOfMonth, isSunday, isWeekend, startOfToday } from 'date-fns';
import { Scheduler } from '../components/Scheduler';
import { CalEvent, GridCellLayout, Resource, ScheduleDay } from '../types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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

  const handleGoBack = () => {
    setActiveDate((d) => addDays(d, -1));
  };
  const handleGoForward = () => {
    setActiveDate((d) => addDays(d, 1));
  };

  return (
    <>
      <Box mb={2} display="flex" alignItems="center" flexDirection="column">
        <Typography variant="h5" mb={1}>
          Pragmatic Scheduler Demo - Monthly
        </Typography>
        <Typography variant="subtitle1">This example also has Custom Components passed</Typography>
      </Box>
      <Box display="flex">
        <Box flex={1} minWidth={0}>
          <Scheduler
            activeDate={activeDate}
            resources={resources}
            events={events}
            divisionDetails={divisionDetails}
            onEventChange={handleEventChange}
            HeaderRow={HeaderRow}
            ResourceCell={ResourceCell}
            ResourceHeader={() => <ResourceHeader onClick={handleGoBack} />}
            GridCell={GridCell}
            config={{
              resourceColumnWidth: 60,
              rowHeight: 70,
              divisionWidth: myDivisionWidth,
              eventMinSeconds: 60 * 60 * 9, // 9 hours
              divisionParts: 1,
              daysToDisplay: 30,
            }}
          />
        </Box>
        <Box>
          <IconButton onClick={handleGoForward}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
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

const ResourceCell = ({ resource }: { resource: Resource }) => {
  return (
    <Box display="flex" justifyContent="center" px={1.25} flexDirection="column">
      <Avatar sx={{ bgcolor: (resource.data as { color: string })?.color }}>{resource.name[0]}</Avatar>
      <Typography variant="body2">{resource.name}</Typography>
    </Box>
  );
};

const ResourceHeader = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <IconButton onClick={onClick}>
        <ArrowBackIosIcon />
      </IconButton>
    </Box>
  );
};

const GridCell = ({ layout }: { layout: GridCellLayout }) => {
  const _isWeekend = isWeekend(layout.day.date);
  const _isSunday = isSunday(layout.day.date);

  return (
    <Box
      height="100%"
      sx={{ backgroundColor: _isWeekend ? weekendColor : 'unset', margin: '1px' }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {_isSunday && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: '#14142B40', borderRadius: 2, height: 50, width: 40, userSelect: 'none' }}
        >
          24
        </Box>
      )}
    </Box>
  );
};

export default Monthly;
