import React, { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SchedulerContext } from './Scheduler';
import { Box, Typography, styled } from '@mui/material';
import { CalEvent, ScheduleDay } from '../types';
import { format, isSameDay } from 'date-fns';
import { BorderedBox } from '../layout/BorderedBox';
import { useUnassignedEventPosition } from '../hooks/useUnassignedEventPosition';
import { EventTile } from './EventTile';

export const HeaderRow = ({ onDragStart }: { onDragStart: (event: CalEvent) => void }) => {
  const {
    days,
    config: { rowMinHeight },
  } = useContext(SchedulerContext);

  return (
    <>
      <UnAssignedEvents onDragStart={onDragStart} />
      <Box flex={1} display="flex" minHeight={rowMinHeight}>
        {/* Add columns for each day */}
        {days.map((day, index) => (
          <HeaderCell key={index} day={day} />
        ))}
      </Box>
    </>
  );
};

const useMinWidthPlusSpacing = () => {
  const { config } = useContext(SchedulerContext);
  const minWidth = useMemo(() => config.divisionMinWidth, [config.divisionMinWidth]);
  return minWidth;
};

const HeaderCell = ({ day, ...other }: { day: ScheduleDay }) => {
  const { activeDate } = useContext(SchedulerContext);
  const isActive = isSameDay(day.date, activeDate);
  const minWidth = useMinWidthPlusSpacing();

  return (
    <BorderedBox flexDirection="column" {...other}>
      <Typography variant="tableHeader" color={isActive ? 'secondary.main' : 'text.disabled'} p={0.75}>
        {format(day.date, 'EEE dd/MM/yyyy')}
      </Typography>
      <Box display="flex">
        {day.divisions.map((division, index) => (
          <Box key={index} display="flex" flexDirection="column" flex={1} minWidth={minWidth}>
            <Typography variant="tableHeader" color="text.disabled" p={0.75}>
              {division.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </BorderedBox>
  );
};

const Container = styled('div')(() => ({
  position: 'absolute',
  userSelect: 'none',
}));

const UnAssignedEvents = ({ onDragStart }: { onDragStart: (event: CalEvent) => void }) => {
  const {
    events,
    config: { unAssignedRows, rowMinHeight, divisionMinWidth },
    calendarBounds: { totalDivisions },
  } = useContext(SchedulerContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const calcEventPosition = useUnassignedEventPosition();
  const unAssignedEvents = useMemo(() => events.filter((e) => !e.resourceId), [events]);

  useLayoutEffect(() => {
    setContainerWidth(ref.current?.offsetWidth || 0);
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent, event: CalEvent) => {
      onDragStart(event);
      // this is a hack for firefox
      // Firefox requires some kind of initialization
      // which we can do by adding this attribute
      // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313

      e.dataTransfer.setData('text/plain', '');
    },
    [onDragStart],
  );

  return (
    <Box
      position="relative"
      width={totalDivisions * divisionMinWidth}
      overflow="auto"
      height={unAssignedRows * rowMinHeight}
      ref={ref}
    >
      {unAssignedEvents.map((event) => {
        const { top, height, left, width } = calcEventPosition(containerWidth, event);
        return (
          <Container
            key={event.id}
            // className="droppable-element"
            draggable={true}
            style={{ top, height, left, width }}
            onDragStart={(e) => handleDragStart(e, event)}
          >
            <EventTile event={event} />
          </Container>
        );
      })}
    </Box>
  );
};
