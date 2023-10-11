import { useCallback, useContext } from 'react';
import { CalEvent } from '../types';
import { SchedulerContext } from '../components/Scheduler';
import { addDays } from 'date-fns';
import { useOverlappingEvents } from './useOverlappingEvents';

export const useUnassignedEventPosition = () => {
  const {
    days,
    calendarBounds: { totalDivisions },
    config: { rowHeight, divisionParts, divisionWidth },
  } = useContext(SchedulerContext);

  const getOverlappingEvents = useOverlappingEvents();

  return useCallback(
    (containerWidth: number, event: CalEvent) => {
      let divisionCount = 0;
      let left = 0;
      let width = 0;
      const totalTimeDisplayed = days.reduce((total, day) => {
        return (
          total +
          day.divisions.reduce(
            (total, division) => total + division.endTime.getTime() - division.startTime.getTime(),
            0,
          )
        );
      }, 0);
      const secondsToWidthConversion = (containerWidth / totalTimeDisplayed) * 1000;
      const minWidth = divisionWidth / divisionParts;

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
              left = ((divisionCount + fractionOfDivision) / totalDivisions) * containerWidth;
            }
            if (
              (division.startTime <= event.endTime && division.endTime >= event.endTime) ||
              division.startTime >= event.endTime
            ) {
              const fractionOfDivision = Math.max(
                (event.endTime.getTime() - division.startTime.getTime()) / divisionRange,
                0,
              );
              width =
                containerWidth - (1 - (divisionCount + fractionOfDivision) / totalDivisions) * containerWidth - left;
              break outerLoop;
            }
            divisionCount++;
          }
        } else {
          divisionCount += day.divisions.length;
        }
      }

      const overlappingEvents = getOverlappingEvents(event);

      const top = 2 + overlappingEvents.length * (rowHeight + 2);
      const height = rowHeight;
      return {
        minWidth,
        secondsToWidthConversion,
        left,
        width,
        top,
        height,
      };
    },
    [days, divisionParts, divisionWidth, getOverlappingEvents, rowHeight, totalDivisions],
  );
};
