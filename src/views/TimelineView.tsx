import React, { useContext, useEffect, useRef } from 'react';
import { SchedulerContext } from '../components/Scheduler';
import { HeaderRow } from '../components/HeaderRow';
import { ResourceRow } from '../components/ResourceRow';
import { Box, Typography } from '@mui/material';
import { BorderedBox, BoxShadow } from '../layout/BorderedBox';
import { Cell } from '../layout/Cell';
import { Colors } from '../constants/colors';

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
    <Box>
      <Box display="flex">
        <Box px={4} maxWidth={config.resourceColumnWidth} minWidth={config.resourceColumnWidth} />
        <BorderedBox px={3} py={2} sx={{ background: Colors.lightGrey }}>
          <Typography variant="tableHeader">UNASSIGNED</Typography>
        </BorderedBox>
      </Box>
      <Box display="flex">
        {/* left side column that does not scroll */}
        <Box marginTop={`${config.rowMinHeight * 2}px`}>
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
        <BoxShadow overflow="auto" ref={ref}>
          <HeaderRow />
          <Box position="relative">
            {resources.map((resource, index) => (
              <ResourceRow key={resource.id + index.toString()} index={index} resource={resource} />
            ))}
          </Box>
        </BoxShadow>
      </Box>
    </Box>
  );
};
