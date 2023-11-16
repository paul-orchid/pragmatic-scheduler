import React, { useState } from 'react';
import { Avatar, Box, ClickAwayListener, IconButton, Tooltip, Typography } from '@mui/material';
import { format, startOfToday } from 'date-fns';
import { Scheduler } from '../components/Scheduler';
import { CalEvent, Resource, ScheduleDay } from '../types';
import { divisionDetails, events as rawEvents, resources } from '../data/weekly';
import { SchedulerDateControls } from '../components/SchedulerDateControls';
import { SourceCodeLink } from './SourceCodeLink';
import { Colors } from '../constants/colors';
import InfoIcon from '@mui/icons-material/Info';

const myDivisionWidth = 160;
const weekendColor = '#EDF1F6';

function Weekly() {
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
          Pragmatic Scheduler Demo - Weekly
        </Typography>
        <Typography variant="subtitle1">
          This example has Custom Event tiles and Custom Unsassigned Area rendered
        </Typography>
        <SourceCodeLink href="https://github.com/paul-orchid/pragmatic-scheduler/blob/main/src/demo/Weekly.tsx" />
      </Box>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <SchedulerDateControls
          activeDate={activeDate}
          setActiveDate={setActiveDate}
          buttonText="Current Week"
          moveByDays={1}
        />
      </Box>
      <Scheduler
        activeDate={activeDate}
        resources={resources}
        events={events}
        divisionDetails={divisionDetails}
        onEventChange={handleEventChange}
        HeaderRow={HeaderRow}
        ResourceCell={ResourceCell}
        EventTile={EventTile}
        UnassignedHeader={UnassignedHeader}
        UnAssignedBoxProps={{
          bgcolor: Colors.gold,
          borderRadius: 2,
        }}
        config={{
          resourceColumnWidth: 220,
          rowHeight: 70,
          divisionWidth: myDivisionWidth,
          divisionParts: 1,
          daysToDisplay: 30,
          unAssignedRows: 2,
        }}
      />
    </>
  );
}

const UnassignedHeader = () => {
  return (
    <Box flex={1} px={3} py={2} sx={{ background: Colors.fluroAmber }} borderRadius={2}>
      <Typography variant="tableHeader">WEEKLY UNASSIGNED</Typography>
    </Box>
  );
};

const HeaderRow = ({ days }: { days: ScheduleDay[] }) => {
  return days.map((day, index) => {
    return (
      <Box
        key={index}
        display="flex"
        flexDirection="column"
        flex={1}
        minWidth={myDivisionWidth}
        maxWidth={myDivisionWidth}
      >
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          border={`1px solid ${weekendColor}`}
        >
          <Typography variant="tableHeader" color="text.disabled">
            {format(day.date, 'EEEE').toUpperCase()}
          </Typography>
          <Typography variant="tableHeader" color="text.secondary">
            {format(day.date, 'dd/MM/yyyy')}
          </Typography>
        </Box>
      </Box>
    );
  });
};

const ResourceCell = ({ resource }: { resource: Resource }) => {
  return (
    <Box display="flex" alignItems="center" px={1.25}>
      <Avatar sx={{ mr: 2, bgcolor: (resource.data as { color: string })?.color }}>{resource.name[0]}</Avatar>
      <Typography variant="body2">{resource.name}</Typography>
    </Box>
  );
};

const EventTile = ({ event }: { event: CalEvent }) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        title={event.title}
        arrow
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={2}
          height="100%"
          width="100%"
          sx={{ background: event.bgColor, cursor: 'pointer', userSelect: 'none' }}
          // onClick={handleTooltipOpen}
          flexDirection="column"
        >
          <Typography variant="body2">
            {event.title}{' '}
            <IconButton size="small" onClick={handleTooltipOpen} className="not-draggable">
              <InfoIcon />
            </IconButton>
          </Typography>
          <Typography variant="body2" color={event.textColor || 'text.primary'}>
            {`${format(event.startTime, 'HHmm')}-${format(event.endTime, 'HHmm')}hrs`}
          </Typography>
        </Box>
      </Tooltip>
    </ClickAwayListener>
  );
};

export default Weekly;
