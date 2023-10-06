import React, { useContext, useMemo } from 'react';
import { SchedulerContext } from './Scheduler';
import { Box, Typography, useTheme } from '@mui/material';
import { ScheduleDay } from '../types';
import { format, isSameDay } from 'date-fns';
import { BorderedBox } from '../layout/BorderedBox';
import { ResourceRow } from './ResourceRow';

export const HeaderRow = () => {
  const {
    days,
    config: { unAssignedRows, rowMinHeight },
  } = useContext(SchedulerContext);

  return (
    <>
      <Box position="relative" minHeight={unAssignedRows * rowMinHeight}>
        <ResourceRow index={-1 * (unAssignedRows + 1)} />
      </Box>
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
  const theme = useTheme();
  const { config } = useContext(SchedulerContext);
  // account for padding and border: (spacing x 8) + 1px + 1px
  const minWidth = useMemo(
    () => config.divisionMinWidth + parseInt(theme.spacing(8)) + 2,
    [config.divisionMinWidth, theme],
  );
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
