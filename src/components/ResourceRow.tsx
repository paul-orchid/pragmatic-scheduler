import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SchedulerContext } from './Scheduler';
import { styled } from '@mui/material';
import { CalEvent, Resource } from '../types';
import { Cell } from '../layout/Cell';
import { EventTile } from './EventTile';

const Container = styled('div')(({ minHeight }: { minHeight: number }) => ({
  position: 'relative',
  flex: 1,
  display: 'flex',
  zIndex: 2,
  minHeight: minHeight,
}));
const EventsContainer = styled('div')(() => ({
  position: 'relative',
  flex: 1,
  display: 'flex',
}));

export const ResourceRowContext = React.createContext<{
  containerWidth: number;
  index: number;
}>({
  index: 0,
  containerWidth: 0,
});

export const ResourceRow = ({ resource, index }: { resource?: Resource; index: number }) => {
  const { events: allEvents, days, config } = useContext(SchedulerContext);
  const events = useMemo(() => allEvents.filter((e) => e.resourceId === resource?.id), [allEvents, resource?.id]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    setContainerWidth(ref.current?.offsetWidth || 0);
  }, []);

  const handleMouseEnter = () => {
    console.log('mouse enter');
  };

  return (
    <Container minHeight={config.rowMinHeight} onMouseEnter={handleMouseEnter}>
      {/* Add columns for each day */}
      <EventsContainer ref={ref}>
        <ResourceRowContext.Provider value={{ containerWidth, index }}>
          {days.map((day, index) => (
            <Cell key={index} classes={resource ? ['no-padding'] : ['no-padding', 'no-border']}>
              {day.divisions.map((_division, index) => (
                <Cell
                  key={index}
                  classes={resource ? ['light-border'] : ['no-border']}
                  minWidth={config.divisionMinWidth}
                ></Cell>
              ))}
            </Cell>
          ))}
          {events.map((event) => (
            <EventTile key={event.id} event={event} />
          ))}
        </ResourceRowContext.Provider>
      </EventsContainer>
    </Container>
  );
};
