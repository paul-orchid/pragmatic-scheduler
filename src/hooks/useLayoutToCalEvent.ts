import { useCallback, useContext } from 'react';
import { CalEvent, Resource } from '../types';
import { SchedulerContext } from '../components/Scheduler';
import GridLayout from 'react-grid-layout';
import { useCalcResourceRows } from './useCalcResourceRows';

export const useLayoutToCalEvent = () => {
  const {
    events,
    resources,
    days,
    config: { divisionParts },
  } = useContext(SchedulerContext);
  const calcResourceRows = useCalcResourceRows();

  return useCallback(
    (layout: GridLayout.Layout): CalEvent => {
      const event = events.find((event) => event.id === layout?.i);
      if (!event) {
        throw new Error('Event not found');
      }
      let rowCount = 0;
      let resource: Resource | undefined = undefined;
      for (const _resource of resources) {
        rowCount += calcResourceRows(_resource);
        if (rowCount > layout.y) {
          resource = _resource;
          break;
        }
      }

      // const resource = resources[layout.y];
      let startTime: Date | undefined = undefined;
      let endTime: Date | undefined = undefined;

      let divisionCount = 0;
      const endColumn = layout.x + layout.w;

      outerLoop: for (const day of days) {
        if (layout.x <= divisionCount + day.divisions.length * divisionParts) {
          // the layout.x is in this day
          for (const division of day.divisions) {
            const divisionRange = division.endTime.getTime() - division.startTime.getTime();
            if (!startTime && layout.x < divisionCount + divisionParts) {
              const divisionRange = division.endTime.getTime() - division.startTime.getTime();
              const fractionOfDivision = (layout.x % divisionParts) / divisionParts;
              startTime = new Date(division.startTime.getTime() + fractionOfDivision * divisionRange);
            }
            if (!endTime && endColumn < divisionCount + divisionParts) {
              const fractionOfDivision = (endColumn % divisionParts) / divisionParts;
              endTime = new Date(division.startTime.getTime() + fractionOfDivision * divisionRange);
            }
            if (startTime && endTime) {
              break outerLoop;
            }
            divisionCount = divisionCount + divisionParts;
          }
        } else {
          // the layout.x is not in this day so we need to add the divisions to the divisionCount
          divisionCount += day.divisions.length * divisionParts;
        }
      }
      return {
        ...event,
        resourceId: resource?.id,
        startTime: startTime || event.startTime,
        endTime: endTime || event.endTime,
      };
    },
    [calcResourceRows, days, divisionParts, events, resources],
  );
};
