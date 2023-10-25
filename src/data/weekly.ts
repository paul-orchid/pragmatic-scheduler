import { addDays, setHours, startOfToday } from 'date-fns';
import { CalEvent, DivisionDetail, Resource } from '../types';
import { Colors } from '../constants/colors';

export const resources: Resource[] = [
  { id: '1', name: 'Andy', data: { color: 'red' } },
  { id: '2', name: 'Adam', data: { color: 'green' } },
  { id: '3', name: 'Sarah', data: { color: 'orange' } },
];

export const events: CalEvent[] = [
  {
    id: '1',
    resourceId: '1',
    startTime: setHours(startOfToday(), 8),
    endTime: addDays(setHours(startOfToday(), 17), 1),
    title: 'Andy Day1',
    bgColor: Colors.fluroAmber,
    textColor: 'black',
  },
  {
    id: '2',
    resourceId: '1',
    startTime: addDays(setHours(startOfToday(), 8), 2),
    endTime: addDays(setHours(startOfToday(), 17), 4),
    title: 'Andy Day2 - not draggable',
    bgColor: Colors.fluroRed,
    textColor: 'white',
    draggable: false,
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
  {
    id: '4',
    startTime: addDays(setHours(startOfToday(), 8), 1),
    endTime: addDays(setHours(startOfToday(), 17), 1),
    title: 'UA Ev 1',
    bgColor: Colors.fluroRed,
    textColor: 'black',
  },
  {
    id: '5',
    startTime: addDays(setHours(startOfToday(), 8), 2),
    endTime: addDays(setHours(startOfToday(), 17), 2),
    title: 'UA Ev 2',
    bgColor: Colors.primaryMain,
    textColor: 'white',
  },
  {
    id: '6',
    startTime: addDays(setHours(startOfToday(), 8), 3),
    endTime: addDays(setHours(startOfToday(), 17), 3),
    title: 'UA Ev 3',
    bgColor: Colors.fluroAmber,
    textColor: 'black',
  },
  {
    id: '7',
    startTime: addDays(setHours(startOfToday(), 8), 3),
    endTime: addDays(setHours(startOfToday(), 17), 3),
    title: 'UA Ev 4',
    bgColor: Colors.teal,
    textColor: 'white',
  },
  {
    id: '8',
    startTime: addDays(setHours(startOfToday(), 8), 3),
    endTime: addDays(setHours(startOfToday(), 17), 3),
    title: 'UA Ev 5',
    bgColor: Colors.greyShadow,
    textColor: 'white',
  },
  {
    id: '9',
    startTime: addDays(setHours(startOfToday(), 8), -1),
    endTime: addDays(setHours(startOfToday(), 17), 1),
    resourceId: '2',
    title: 'Adam Annual leave',
    bgColor: Colors.greyShadow,
    textColor: 'white',
    allowOverlap: true,
    draggable: false,
  },
];

export const divisionDetails: DivisionDetail[] = [{ name: '8am-5pm', startHour: 8, endHour: 17 }];
