import { useCallback, useContext } from 'react';
import { CalEvent } from '../types';
import { SchedulerContext } from '../components/Scheduler';

export const useOverlappingEvents = () => {
  const { events } = useContext(SchedulerContext);
  return useCallback(
    (event: CalEvent): CalEvent[] => {
      const eventIndex = events.findIndex((e) => e.id === event.id);
      return events.filter((e, index) => {
        return (
          index < eventIndex &&
          e.id !== event.id &&
          e.allowOverlap !== true &&
          e.resourceId === event.resourceId &&
          ((e.startTime >= event.startTime && e.startTime < event.endTime) ||
            (e.endTime > event.startTime && e.endTime <= event.endTime) ||
            (e.startTime <= event.startTime && e.endTime >= event.endTime))
        );
      });
    },
    [events],
  );
};
