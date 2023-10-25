import React, { useContext } from 'react';
import { SchedulerContext } from './Scheduler';
import { Box, Typography } from '@mui/material';
import { BorderedBox } from '../layout/BorderedBox';
import { Colors } from '../constants/colors';

export const UnassignedHeader = () => {
  const {
    UnassignedHeader: UnassignedHeaderOverride,
    config: { resourceColumnWidth },
  } = useContext(SchedulerContext);

  return (
    <Box display="flex">
      <Box maxWidth={resourceColumnWidth} minWidth={resourceColumnWidth} />
      {UnassignedHeaderOverride ? (
        <UnassignedHeaderOverride />
      ) : (
        <BorderedBox px={3} py={2} sx={{ background: Colors.lightGrey }}>
          <Typography variant="tableHeader">UNASSIGNED</Typography>
        </BorderedBox>
      )}
    </Box>
  );
};
