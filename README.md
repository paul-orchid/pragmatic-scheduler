# pragmatic-scheduler

Pragmatic Scheduler is a React Resource Scheduler based on [Material UI](https://mui.com/material-ui/getting-started/) and uses [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout) for the Drag/Drop/Resize functionality

## Installation

Install the Pragmatic Scheduler [package](https://www.npmjs.org/package/pragmatic-scheduler) package using [npm](https://www.npmjs.com/):

```bash
npm install pragmatic-scheduler
```

## Usage

Use Scheduler like any other component. The following example below will
produce a Schuedlue with controls to change the date forward/backward

- users will be able to drag or resize events on a given resource
- users will be able to drag unassigned events on the calendar
- users will be able to drag events on to other resources

```js
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { startOfToday } from 'date-fns';
import { CalEvent } from 'pragmatic-scheduler/dist/types';
import { Scheduler, SchedulerDateControls } from 'pragmatic-scheduler';
import { divisionDetails, events as rawEvents, resources } from '../data/daily';

function Basic() {
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

export default Basic;

```

### Scheduler Props

The Scheduler component supports the following properties (see the source for the final word on this):

```js

// This set the active date of the Scheduler
activeDate: Date,

// each day in the schedule it will be divided in however many divisions are provided here
// check out the demos for examples of how to do this
divisionDetails: DivisionDetail[];

// The list of resources to appear in the calendar
resources: Resource[];

// The list of events to appear in the calendar
// If an event has no resourceId, it will appear in the Unassigned Section
// if the config prop has unAssignedRows set to more than 0
events: CalEvent[];

// scheduler config
config?: {
  resourceColumnWidth: number; // the fixed width of the resource column
  rowHeight: number; // the fixed height of a single row
  divisionWidth: number; // the width of each division that each day is split into
  unAssignedRows?: number; // the number of rows of unassigned events to show above the calendar. Set to 0 to not have any Unassigned Section
  divisionParts: number; // each division can be further broken into parts. E.g. a 2 hour division may be broke into 4 30 minut parts. This controls the snapping when dragging/resizing.
  daysToDisplay: number; // the number of days to load for the scheduler. Check out the demos for examples
}

// Callback to handle events being changed
onEventChange?: (event: CalEvent) => void;

// Optionally override the header row. Check out the demos for examples
HeaderRow?: React.FC<{ days: ScheduleDay[] }>;

// Optionally override each resource cell. Check out the demos for examples
ResourceCell?: React.FC<{ resource: Resource }>;

// Optionally override each resource header. Check out the demos for examples
ResourceHeader?: React.FC;

// Optionally override how the background grid is displayed. Use this to change the format or add extra information to the grid. Check out the demos for examples
GridCell?: React.FC<{ layout: GridCellLayout }>;

// Optionally override each Event Tile on the Calendar. Check out the demos for examples
EventTile?: React.FC<{ event: CalEvent }>;
```

### SchedulerDateControls Props

The SchedulerDateControls component supports the following properties (see the source for the final word on this):

```js

// This is the active date of the Scheduler
activeDate: Date,

// Pass a function so the component can change the activeDate
setActiveDate: React.Dispatch<React.SetStateAction<Date>>;

// Change the button Text that trigger the date picker
buttonText?: string;

// When the forward/back buttons are pressed, how many days to move forward/back
moveByDays?: number;

```
