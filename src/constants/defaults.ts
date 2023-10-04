import { Config, DivisionDetail } from '../scheduler';

export const defaultConfig: Config = {
  resourceColumnWidth: 220,
  rowMinHeight: 70,
  divisionMinWidth: 65,
  eventMinSeconds: 30 * 60, // 30 minutes
};

export const defaultDivisionDetails: DivisionDetail[] = [
  { name: 'Morning', startHour: 8, endHour: 12 },
  { name: 'Afternoon', startHour: 12, endHour: 17 },
  { name: 'Evening', startHour: 17, endHour: 20 },
  { name: 'Night', startHour: 20, endHour: 24 },
];
