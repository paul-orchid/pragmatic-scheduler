import React, { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SchedulerContext } from './Scheduler';
import { Box, Typography, styled } from '@mui/material';
import { CalEvent, ScheduleDay } from '../types';
import { format, isSameDay } from 'date-fns';
import { BorderedBox } from '../layout/BorderedBox';
import { useUnassignedEventPosition } from '../hooks/useUnassignedEventPosition';
import { EventTile } from './EventTile';

export const HeaderRow = ({ days }: { days: ScheduleDay[] }) => {
  const {
    HeaderRow: HeaderRowOverride,
    config: { rowHeight },
  } = useContext(SchedulerContext);

  return (
    <Box flex={1} display="flex" minHeight={rowHeight} maxHeight={rowHeight}>
      {/* Add columns for each day */}
      {HeaderRowOverride ? (
        <HeaderRowOverride days={days} />
      ) : (
        days.map((day, index) => <HeaderCell key={index} day={day} />)
      )}
    </Box>
  );
};

const useWidthPlusSpacing = () => {
  const { config } = useContext(SchedulerContext);
  const width = useMemo(() => config.divisionWidth, [config.divisionWidth]);
  return width;
};

const HeaderCell = ({ day }: { day: ScheduleDay }) => {
  const { activeDate } = useContext(SchedulerContext);
  const isActive = isSameDay(day.date, activeDate);
  const width = useWidthPlusSpacing();
  const dayWidth = width * day.divisions.length;

  return (
    <BorderedBox flexDirection="column" minWidth={dayWidth} maxWidth={dayWidth} overflow="hidden">
      <Typography variant="tableHeader" color={isActive ? 'secondary.main' : 'text.disabled'} p={0.75}>
        {format(day.date, 'EEE dd/MM/yyyy')}
      </Typography>
      <Box display="flex">
        {day.divisions.map((division, index) => (
          <Box key={index} display="flex" flexDirection="column" flex={1} minWidth={width} maxWidth={width}>
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

export const UnAssignedEvents = ({ onDragStart }: { onDragStart: (event: CalEvent) => void }) => {
  const {
    events,
    config: { unAssignedRows = 1, rowHeight, divisionWidth },
    calendarBounds: { totalDivisions },
    UnAssignedBoxProps,
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
      width={totalDivisions * divisionWidth}
      overflow="auto"
      height={unAssignedRows * rowHeight}
      ref={ref}
      {...UnAssignedBoxProps}
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
