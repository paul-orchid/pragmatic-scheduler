import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { SchedulerContext } from './Scheduler';
import { Box, styled } from '@mui/material';
import { CalEvent } from '../types';
import { Cell } from '../layout/Cell';
import { EventTile } from './EventTile';

const EventsContainer = styled('div')(() => ({
  position: 'relative',
  flex: 1,
  display: 'flex',
}));

export const ResourceRowContext = React.createContext<{
  containerWidth: number;
}>({
  containerWidth: 0,
});

export const ResourceRow = ({ events }: { events: CalEvent[] }) => {
  const { days, config } = useContext(SchedulerContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    setContainerWidth(ref.current?.offsetWidth || 0);
  }, []);

  return (
    <Box flex={1} display="flex" minHeight={config.rowMinHeight}>
      {/* Add columns for each day */}
      <EventsContainer ref={ref}>
        <ResourceRowContext.Provider value={{ containerWidth }}>
          {days.map((day, index) => (
            <Cell key={index} classes={['no-padding']}>
              {day.divisions.map((division, index) => (
                <Cell key={index} classes={['light-border']} minWidth={config.divisionMinWidth}></Cell>
              ))}
            </Cell>
          ))}
          {events.map((event) => (
            <EventTile key={event.id} event={event} />
          ))}
        </ResourceRowContext.Provider>
      </EventsContainer>
    </Box>
  );
};
