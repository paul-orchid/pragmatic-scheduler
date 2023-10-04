import { DivisionDetail, ScheduleDay } from '../scheduler';
import { setHours, startOfDay } from 'date-fns';

export const useDateToDivisions = () => {
  const dateToDivisions = (date: Date, divisionDetails: DivisionDetail[]): ScheduleDay => {
    const startOfDayDate = startOfDay(date);
    return {
      date: startOfDayDate,
      divisions: divisionDetails.map((divisionDetail) => {
        return {
          name: divisionDetail.name,
          startTime: setHours(startOfDayDate, divisionDetail.startHour),
          endTime: setHours(startOfDayDate, divisionDetail.endHour),
        };
      }),
    };
  };

  return { dateToDivisions };
};
