export type ScheduleDay = {
  date: Date;
  divisions: Division[];
};

export type Division = {
  name: string;
  startTime: Date;
  endTime: Date;
  order?: number;
};

export type DivisionDetail = {
  name: string;
  startHour: number;
  endHour: number;
};

export type Resource = {
  name: string;
  id: string;
};

export type CalEvent = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  resourceId?: string;
  bgColor?: string;
  textColor?: string;
};

export type Config = {
  resourceColumnWidth: number;
  rowMinHeight: number;
  divisionWidth: number;
  eventMinSeconds: number;
  unAssignedRows?: number;
  divisionParts: number;
  daysToDisplay: number;
};
