import { useCallback, useContext } from 'react';
import { Resource } from '../types';
import { SchedulerContext } from '../components/Scheduler';
import { useOverlappingOffset } from './useOverlappingEvents';

export const useCalcResourceRows = () => {
  const { events } = useContext(SchedulerContext);

  const getOverlappingOffset = useOverlappingOffset();

  return useCallback(
    (resource: Resource): number => {
      const resourceEvents = events.filter((event) => event.resourceId === resource.id && event.allowOverlap !== true);
      const maxOverlappingEvents = resourceEvents.reduce((max, event) => Math.max(max, getOverlappingOffset(event)), 0);
      return maxOverlappingEvents + 1;
    },
    [events, getOverlappingOffset],
  );
};
