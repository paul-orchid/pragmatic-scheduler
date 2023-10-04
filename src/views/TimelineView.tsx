import React, { useContext, useEffect, useRef } from 'react';
import { SchedulerContext } from '../components/Scheduler';
import { HeaderRow } from '../components/HeaderRow';
import { ResourceRow } from '../components/ResourceRow';
import { Box, Typography } from '@mui/material';
import { BorderedBox } from '../layout/BorderedBox';
import { Cell } from '../layout/Cell';

export const TimelineView = () => {
  const { resources, events, config, activeDate } = useContext(SchedulerContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollTo({
      left: ref.current.scrollWidth * 0.3,
      behavior: 'smooth',
    });
  }, [activeDate]);

  return (
    <Box display="flex">
      {/* left side column that does not scroll */}
      <Box>
        <BorderedBox
          px={4}
          alignItems="center"
          maxWidth={config.resourceColumnWidth}
          minWidth={config.resourceColumnWidth}
          minHeight={config.rowMinHeight}
        >
          <Typography variant="subtitle2">TEAM</Typography>
        </BorderedBox>
        {resources.map((resource) => (
          <BorderedBox minHeight={config.rowMinHeight} key={resource.id}>
            <Cell alignItems="center" maxWidth={config.resourceColumnWidth} minWidth={config.resourceColumnWidth}>
              <Typography variant="subtitle2">{resource.name}</Typography>
            </Cell>
          </BorderedBox>
        ))}
      </Box>
      {/* right side column that scrolls */}
      <Box overflow="auto" ref={ref}>
        <HeaderRow />
        {resources.map((resource, index) => {
          const resourceEvents = events.filter((event) => event.resourceId === resource.id);
          return <ResourceRow key={resource.id + index.toString()} events={resourceEvents} />;
        })}
      </Box>
    </Box>
  );
};
