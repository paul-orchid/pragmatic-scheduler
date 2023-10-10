import { Config, DivisionDetail } from '../types';

export const defaultConfig: Config = {
  resourceColumnWidth: 220,
  rowMinHeight: 70,
  divisionWidth: 160,
  eventMinSeconds: 30 * 60, // 30 minutes
  unAssignedRows: 2,
  divisionParts: 4,
  daysToDisplay: 3,
};

export const defaultDivisionDetails: DivisionDetail[] = [
  { name: 'Morning', startHour: 8, endHour: 12 },
  { name: 'Afternoon', startHour: 12, endHour: 17 },
  { name: 'Evening', startHour: 17, endHour: 20 },
  { name: 'Night', startHour: 20, endHour: 24 },
];
