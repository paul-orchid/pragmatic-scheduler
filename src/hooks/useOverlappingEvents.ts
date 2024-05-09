import { useCallback, useContext, useMemo } from 'react';
import { CalEvent } from '../types';
import { SchedulerContext } from '../components/Scheduler';

export const useOverlappingOffset = () => {
  const { events } = useContext(SchedulerContext);
  const eventsWithResourcePosition = useMemo(() => {
    const eventsWithOffsetInfo: (CalEvent & {
      overlappingOffset: number;
    })[] = [];
    // keep track of the layout of events
    const layout: { [resourceId: string]: { [rowNumber: number]: CalEvent[] } } = {};
    for (const event of events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())) {
      if (!event.resourceId) {
        continue;
      }
      // create a layout for each resource if it doesn't exist
      layout[event.resourceId] = layout[event.resourceId] || {};
      // get the layout for the resource
      const layoutResource = layout[event.resourceId];
      const highestRowAllocated = Math.max(...Object.keys(layoutResource).map((key) => parseInt(key, 10)));
      let overlappingOffset = 0; // default to 0

      // for each row in the layout, check if the event overlaps with any of the events in the row and
      // increment the offset
      for (let i = 0; i <= highestRowAllocated; i++) {
        const eventsThisRow = layoutResource[overlappingOffset] || [];
        if (eventsThisRow.some((e) => doEventsOverlap(e, event))) {
          overlappingOffset++;
        }
      }
      layoutResource[overlappingOffset] = layoutResource[overlappingOffset] || [];
      layoutResource[overlappingOffset].push(event);

      eventsWithOffsetInfo.push({
        ...event,
        overlappingOffset: overlappingOffset,
      });
    }
    return eventsWithOffsetInfo;
  }, [events]);

  return useCallback(
    (event: CalEvent): number => {
      return eventsWithResourcePosition.find((e) => e.id === event.id)?.overlappingOffset || 0;
    },
    [eventsWithResourcePosition],
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
