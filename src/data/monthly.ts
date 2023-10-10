import { addDays, setHours, startOfToday } from 'date-fns';
import { CalEvent, DivisionDetail, Resource } from '../types';
import { Colors } from '../constants/colors';

export const resources: Resource[] = [
  { id: '1', name: 'Andy' },
  { id: '2', name: 'Adam' },
  { id: '3', name: 'Sarah' },
];

export const events: CalEvent[] = [
  {
    id: '1',
    resourceId: '1',
    startTime: setHours(startOfToday(), 8),
    endTime: setHours(startOfToday(), 17),
    title: 'Andy Day1',
    bgColor: Colors.fluroAmber,
    textColor: 'black',
  },
  {
    id: '2',
    resourceId: '1',
    startTime: addDays(setHours(startOfToday(), 8), 1),
    endTime: addDays(setHours(startOfToday(), 17), 1),
    title: 'Andy Day2',
    bgColor: Colors.fluroRed,
    textColor: 'white',
  },
  {
    id: '3',
    resourceId: '2',
    startTime: setHours(startOfToday(), 8),
    endTime: setHours(startOfToday(), 17),
    title: 'Adam Day1',
    bgColor: Colors.gold,
    textColor: 'black',
  },
];

export const divisionDetails: DivisionDetail[] = [{ name: '8am-5pm', startHour: 8, endHour: 17 }];
