import { addMinutes, setHours, startOfToday } from 'date-fns';
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
    startTime: addMinutes(startOfToday(), 18 * 60 + 30),
    endTime: addMinutes(startOfToday(), 19 * 60 + 30),
    title: 'Andy 630 - 730pm',
    bgColor: Colors.fluroAmber,
    textColor: 'black',
  },
  {
    id: '2',
    resourceId: '1',
    startTime: setHours(startOfToday(), 20),
    endTime: setHours(startOfToday(), 23),
    title: 'Andy 8-11pm',
    bgColor: Colors.fluroRed,
    textColor: 'white',
  },
  {
    id: '3',
    resourceId: '2',
    startTime: setHours(startOfToday(), 20),
    endTime: setHours(startOfToday(), 22),
    title: 'Adam 8 - 10pm',
    bgColor: Colors.gold,
    textColor: 'black',
  },
  {
    id: '4',
    startTime: setHours(startOfToday(), 10),
    endTime: setHours(startOfToday(), 12),
    title: 'UA Ev 1',
    bgColor: Colors.fluroRed,
    textColor: 'black',
  },
  {
    id: '5',
    startTime: setHours(startOfToday(), 14),
    endTime: setHours(startOfToday(), 15),
    title: 'UA Ev 2',
    bgColor: Colors.primaryMain,
    textColor: 'white',
  },
  {
    id: '6',
    startTime: setHours(startOfToday(), 20),
    endTime: setHours(startOfToday(), 22),
    title: 'UA Ev 3',
    bgColor: Colors.fluroAmber,
    textColor: 'black',
  },
  {
    id: '7',
    startTime: setHours(startOfToday(), 20),
    endTime: setHours(startOfToday(), 22),
    title: 'UA Ev 4',
    bgColor: Colors.teal,
    textColor: 'white',
  },
  {
    id: '8',
    startTime: setHours(startOfToday(), 20),
    endTime: setHours(startOfToday(), 22),
    title: 'UA Ev 5',
    bgColor: Colors.greyShadow,
    textColor: 'white',
  },
];

export const divisionDetails: DivisionDetail[] = [
  { name: '6am', startHour: 6, endHour: 8 },
  { name: '8am', startHour: 8, endHour: 10 },
  { name: '10am', startHour: 10, endHour: 12 },
  { name: '12pm', startHour: 12, endHour: 14 },
  { name: '2pm', startHour: 14, endHour: 16 },
  { name: '4pm', startHour: 16, endHour: 18 },
  { name: '6pm', startHour: 18, endHour: 20 },
  { name: '8pm', startHour: 20, endHour: 22 },
  { name: '10pm', startHour: 22, endHour: 24 },
];
