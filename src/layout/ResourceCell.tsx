import React, { useContext } from 'react';
import { SchedulerContext } from '../components/Scheduler';
import { Box, Typography } from '@mui/material';
import { Cell } from './Cell';
import { useCalcResourceRows } from '../hooks/useCalcResourceRows';
import { Resource } from '../types';

export const ResourceCell = ({ resource }: { resource: Resource }) => {
  const {
    config: { rowMinHeight },
    ResourceCell: ResourceCellOverride,
  } = useContext(SchedulerContext);
  const calcResourceRows = useCalcResourceRows();

  const rows = calcResourceRows(resource);

  const Component = ResourceCellOverride || DefaultResourceCell;

  return (
    <Box display="flex" flex={1} minHeight={rowMinHeight * rows}>
      <Component resource={resource} />
    </Box>
  );
};

const DefaultResourceCell = ({ resource }: { resource: Resource }) => {
  return (
    <Cell alignItems="center">
      <Typography variant="subtitle2">{resource.name}</Typography>
    </Cell>
  );
};
