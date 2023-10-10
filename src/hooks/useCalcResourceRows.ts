import { useCallback, useContext } from 'react';
import { Resource } from '../types';
import { SchedulerContext } from '../components/Scheduler';
import { useOverlappingEvents } from './useOverlappingEvents';

export const useCalcResourceRows = () => {
  const { events } = useContext(SchedulerContext);

  const getOverlappingEvents = useOverlappingEvents();

  return useCallback(
    (resource: Resource): number => {
      const resourceEvents = events.filter((event) => event.resourceId === resource.id);
      const maxOverlappingEvents = resourceEvents.reduce(
        (max, event) => Math.max(max, getOverlappingEvents(event).length),
        0,
      );
      return maxOverlappingEvents + 1;
    },
    [events, getOverlappingEvents],
  );
};
