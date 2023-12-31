import { useCallback, useContext } from 'react';
import { CalEvent } from '../types';
import { SchedulerContext } from '../components/Scheduler';
import { addDays } from 'date-fns';
import GridLayout from 'react-grid-layout';
import { useOverlappingOffset } from './useOverlappingEvents';
import { useCalcResourceRows } from './useCalcResourceRows';

export const useCalcEventPosition = () => {
  const {
    resources,
    days,
    config: { divisionParts },
  } = useContext(SchedulerContext);

  const getOverlappingOffset = useOverlappingOffset();
  const calcResourceRows = useCalcResourceRows();

  return useCallback(
    (event: CalEvent): GridLayout.Layout => {
      let divisionCount = 0;
      let x = 0;
      let w = 0;

      outerLoop: for (const day of days) {
        if (
          (day.date <= event.startTime && addDays(day.date, 1) > event.startTime) ||
          (day.date <= event.endTime && addDays(day.date, 1) > event.endTime) ||
          day.date >= event.endTime
        ) {
          for (const division of day.divisions) {
            const divisionRange = division.endTime.getTime() - division.startTime.getTime();
            if (division.startTime <= event.startTime && division.endTime >= event.startTime) {
              const fractionOfDivision = (event.startTime.getTime() - division.startTime.getTime()) / divisionRange;
              x = divisionCount + fractionOfDivision * divisionParts;
            }
            if (
              (division.startTime <= event.endTime && division.endTime >= event.endTime) ||
              division.startTime >= event.endTime
            ) {
              const fractionOfDivision = Math.max(
                (event.endTime.getTime() - division.startTime.getTime()) / divisionRange,
                0,
              );
              w = divisionCount + fractionOfDivision * divisionParts - x;
              break outerLoop;
            }
            divisionCount = divisionCount + divisionParts;
          }
        } else {
          divisionCount += day.divisions.length * divisionParts;
        }
      }
      const overlappingOffset = getOverlappingOffset(event);

      // sum up how may rows are use in the previous resources
      let rowCount = 0;
      for (const _resource of resources) {
        if (_resource.id === event.resourceId) {
          break;
        }
        rowCount += calcResourceRows(_resource);
      }

      const y = rowCount + (event.allowOverlap ? 0 : overlappingOffset);

      return {
        i: event.id,
        x: x,
        y: y,
        w: Number(w.toFixed(4)),
        h: 1,
        maxH: 1,
        isDraggable: event.draggable === false ? false : true,
        isResizable: event.resizable === false ? false : true,
      };
    },
    [calcResourceRows, days, divisionParts, getOverlappingOffset, resources],
  );
};
