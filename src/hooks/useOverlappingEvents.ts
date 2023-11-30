import { useCallback, useContext, useMemo } from 'react';
import { CalEvent } from '../types';
import { SchedulerContext } from '../components/Scheduler';

export const useOverlappingOffset = () => {
  const getOverlappingEvents = useOverlappingEvents();

  return useCallback(
    (event: CalEvent): number => {
      const overlappingEvents = getOverlappingEvents(event).sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      );
      return overlappingEvents.length > 0
        ? overlappingEvents.reduce((max, event) => Math.max(max, event.overlappingEventsCount), 0) + 1
        : 0;
    },
    [getOverlappingEvents],
  );
};

const doEventsOverlap = (event1: CalEvent, event2: CalEvent) => {
  return (
    event1.id !== event2.id &&
    event1.allowOverlap !== true &&
    event2.allowOverlap !== true &&
    event1.resourceId === event2.resourceId &&
    ((event1.startTime >= event2.startTime && event1.startTime < event2.endTime) ||
      (event1.endTime > event2.startTime && event1.endTime <= event2.endTime) ||
      (event1.startTime <= event2.startTime && event1.endTime >= event2.endTime))
  );
};

export const useOverlappingEvents = () => {
  const { events } = useContext(SchedulerContext);
  const eventsWithOverlapCount = useMemo(() => {
    const eventsWithOffset = [];
    for (const event of events) {
      const eventIndex = events.findIndex((e) => e.id === event.id);
      const overlappingEvents = events.filter((e, index) => {
        return index < eventIndex && doEventsOverlap(event, e);
      });
      const existingMaxOverlap = Math.max(
        0,
        ...eventsWithOffset
          .filter((e) => overlappingEvents.map((e) => e.id).includes(e.id))
          .map((e) => e.overlappingEventsCount),
      );
      eventsWithOffset.push({
        ...event,
        overlappingEventsCount: overlappingEvents.length + existingMaxOverlap,
      });
    }
    return eventsWithOffset;
  }, [events]);
  return useCallback(
    (event: CalEvent): (CalEvent & { overlappingEventsCount: number })[] => {
      const eventIndex = eventsWithOverlapCount.findIndex((e) => e.id === event.id);
      return eventsWithOverlapCount.filter((e, index) => {
        return index < eventIndex && doEventsOverlap(event, e);
      });
    },
    [eventsWithOverlapCount],
  );
  // return useCallback(
  //   (event: CalEvent): CalEvent[] => {
  //     const eventIndex = events.findIndex((e) => e.id === event.id);
  //     return events.filter((e, index) => {
  //       return (
  //         index < eventIndex &&
  //         e.id !== event.id &&
  //         e.allowOverlap !== true &&
  //         e.resourceId === event.resourceId &&
  //         ((e.startTime >= event.startTime && e.startTime < event.endTime) ||
  //           (e.endTime > event.startTime && e.endTime <= event.endTime) ||
  //           (e.startTime <= event.startTime && e.endTime >= event.endTime))
  //       );
  //     });
  //   },
  //   [events],
  // );
};
