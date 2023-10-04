import React, { useContext, useMemo } from 'react';
import { SchedulerContext } from './Scheduler';
import { Box, Typography, useTheme } from '@mui/material';
import { ScheduleDay } from '../scheduler';
import { format, isSameDay } from 'date-fns';
import { BorderedBox } from '../layout/BorderedBox';

export const HeaderRow = () => {
  const { days, config } = useContext(SchedulerContext);
  return (
    <Box flex={1} display="flex" minHeight={config.rowMinHeight}>
      {/* Add columns for each day */}
      {days.map((day, index) => (
        <HeaderCell key={index} day={day} />
      ))}
    </Box>
  );
};

const HeaderCell = ({ day, ...other }: { day: ScheduleDay }) => {
  const theme = useTheme();
  const { config, activeDate } = useContext(SchedulerContext);
  const isActive = isSameDay(day.date, activeDate);

  // account for padding and border: (spacing x 8) + 1px + 1px
  const minWidth = useMemo(
    () => config.divisionMinWidth + parseInt(theme.spacing(8)) + 2,
    [config.divisionMinWidth, theme]
  );
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
