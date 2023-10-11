import React, { useContext } from 'react';
import { Cell } from './Cell';
import { SchedulerContext } from '../components/Scheduler';
import { GridCellLayout } from '../types';

export const GridCell = ({ layout }: { layout: GridCellLayout }) => {
  const { GridCell: GridCellOverride } = useContext(SchedulerContext);
  const Component = GridCellOverride || DefaultGridCell;
  return <Component layout={layout} />;
};

const DefaultGridCell = () => {
  return <Cell classes={['no-padding', 'light-border']} height="100%"></Cell>;
};
