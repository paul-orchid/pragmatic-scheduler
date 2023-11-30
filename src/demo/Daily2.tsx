import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { addDays, endOfToday, startOfToday } from 'date-fns';
import { Scheduler } from '../components/Scheduler';
import { CalEvent } from '../types';
import { SchedulerDateControls } from '../components/SchedulerDateControls';
import { divisionDetails, events as rawEvents, resources } from '../data/daily';
import { SourceCodeLink } from './SourceCodeLink';

function Daily2() {
  const [activeDate, setActiveDate] = useState(startOfToday());
  const [events, setEvents] = useState<CalEvent[]>([
    { id: '1', resourceId: '1', title: 'Event 1', startTime: startOfToday(), endTime: addDays(endOfToday(), 1) },
    {
      id: '2',
      resourceId: '1',
      title: 'Event 2',
      startTime: addDays(startOfToday(), 1),
      endTime: addDays(endOfToday(), 2),
    },
    {
      id: '3',
      resourceId: '1',
      title: 'Event 3',
      startTime: addDays(startOfToday(), 2),
      endTime: addDays(endOfToday(), 3),
    },
    {
      id: '4',
      resourceId: '1',
      title: 'Event 4',
      startTime: addDays(startOfToday(), 3),
      endTime: addDays(endOfToday(), 4),
    },
  ]);

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
      {/* <Scheduler
        activeDate={activeDate}
        resources={resources}
        events={events}
        divisionDetails={divisionDetails}
        onEventChange={handleEventChange}
      /> */}
      <Scheduler
        activeDate={activeDate}
        resources={resources}
        onEventChange={handleEventChange}
        events={events}
        divisionDetails={[{ name: 'allDay', startHour: 0, endHour: 24 }]}
        // UnassignedHeader={UnassignedHeader}
        // UnAssignedBoxProps={{
        //   border: border,
        //   sx: {
        //     backgroundColor: 'background.default',
        //   },
        // }}
        // onEventChange={handleEventChange}
        // HeaderRow={HeaderRow}
        // ResourceCell={ResourceCell}
        // EventTile={EventTileMemoized}
        // GridCell={GridCell}
        // ResourceHeader={() => (
        //   <ResourceHeader setSortModel={setSortModel} title={resourceTitle} resourceWidth={resourceWidth} />
        // )}
        config={{
          resourceColumnWidth: 200,
          rowHeight: 70,
          divisionWidth: 200,
          divisionParts: 1,
          daysToDisplay: 15,
          unAssignedRows: 0,
        }}
      />
    </>
  );
}

export default Daily2;
