import React, { useMemo } from 'react';

import { Box, styled } from '@mui/material';
import { ScheduleDay, Resource, CalEvent, Config, DivisionDetail } from '../types';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { defaultConfig, defaultDivisionDetails } from '../constants/defaults';
import { useDateToDivisions } from '../hooks/useDateToDivisions';
import { TimelineView } from '../views/TimelineView';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    tableHeader: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    tableHeader?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    tableHeader: true;
  }
}
export const SchedulerContext = React.createContext<{
  activeDate: Date;
  days: ScheduleDay[];
  resources: Resource[];
  events: CalEvent[];
  config: Config;
  calendarBounds: { start: Date; end: Date; range: number; totalDivisions: number };
  onEventChange?: (event: CalEvent) => void;
  HeaderRow?: React.FC<{ days: ScheduleDay[] }>;
}>({
  activeDate: new Date(),
  days: [],
  resources: [],
  events: [],
  config: defaultConfig,
  calendarBounds: { start: new Date(), end: new Date(), range: 0, totalDivisions: 0 },
});

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const Scheduler = ({
  activeDate,
  divisionDetails = defaultDivisionDetails,
  resources,
  events,
  config = defaultConfig,
  onEventChange,
  HeaderRow,
}: {
  activeDate: Date;
  divisionDetails?: DivisionDetail[];
  resources: Resource[];
  events: CalEvent[];
  config?: Config;
  onEventChange?: (event: CalEvent) => void;
  HeaderRow?: React.FC<{ days: ScheduleDay[] }>;
}) => {
  const { dateToDivisions } = useDateToDivisions();
  const firstDay = useMemo(() => addDays(activeDate, -1), [activeDate]);
  const lastDay = useMemo(() => endOfDay(addDays(firstDay, config.daysToDisplay)), [firstDay, config.daysToDisplay]);
  const days = useMemo(() => {
    const date = new Date(firstDay);
    const days: ScheduleDay[] = [];
    while (date <= lastDay) {
      days.push(dateToDivisions(date, divisionDetails));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [dateToDivisions, divisionDetails, firstDay, lastDay]);

  const range = lastDay.getTime() - firstDay.getTime();
  const totalDivisions = days.reduce((acc, day) => acc + day.divisions.length, 0);
  const daysWithDivisionsOrder: ScheduleDay[] = useMemo(() => {
    const daysWithDivisionsOrder: ScheduleDay[] = [];
    let order = 0;
    for (const day of days) {
      const divisions = day.divisions.map((division) => ({ ...division, order: order++ }));
      daysWithDivisionsOrder.push({ ...day, divisions });
    }
    return daysWithDivisionsOrder;
  }, [days]);

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        (event.startTime >= firstDay && event.startTime <= lastDay) ||
        (event.endTime >= firstDay && event.endTime <= lastDay),
    );
  }, [events, firstDay, lastDay]);

  return (
    <SchedulerContext.Provider
      value={{
        activeDate: activeDate,
        resources: resources,
        days: daysWithDivisionsOrder,
        events: filteredEvents,
        config: config,
        calendarBounds: { start: firstDay, end: lastDay, range: range, totalDivisions: totalDivisions },
        onEventChange: onEventChange,
        HeaderRow: HeaderRow,
      }}
    >
      <Container>
        <TimelineView />
      </Container>
    </SchedulerContext.Provider>
  );
};
