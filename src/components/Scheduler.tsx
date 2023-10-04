import React, { useMemo } from 'react';
import { styled, ThemeProvider, Theme } from '@mui/material';
import { ScheduleDay, Resource, CalEvent, Config, DivisionDetail } from '../scheduler';
import { merge } from 'lodash';
import { addDays, endOfDay } from 'date-fns';
import { TimelineView } from '../views/TimelineView';
import { defaultConfig, defaultDivisionDetails } from '../constants/defaults';
import { useDateToDivisions } from '../hooks/useDateToDivisions';
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
}>({
  activeDate: new Date(),
  days: [],
  resources: [],
  events: [],
  config: defaultConfig,
  calendarBounds: { start: new Date(), end: new Date(), range: 0, totalDivisions: 0 },
});

const Container = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

const mergedTheme = (outerTheme: Theme) =>
  merge(outerTheme, {
    typography: {
      subtitle2: {
        fontSize: 14,
        fontWeight: 800,
        lineHeight: '18px',
        letterSpacing: '0.5px',
      },
      tableHeader: {
        fontFamily: outerTheme.typography.subtitle2.fontFamily,
        fontSize: 14,
        fontWeight: 600,
        lineHeight: '18px',
        letterSpacing: '0.15px',
        textAlign: 'center',
      },
    },
  });

export const Scheduler = ({
  activeDate,
  divisionDetails = defaultDivisionDetails,
  resources,
  events,
  config = defaultConfig,
  onEventChange,
}: {
  activeDate: Date;
  divisionDetails?: DivisionDetail[];
  resources: Resource[];
  events: CalEvent[];
  config?: Config;
  onEventChange?: (event: CalEvent) => void;
}) => {
  // TODO install react-grid-layout and use it to handle the layout, and drag/drop/resize of the scheduler

  const { dateToDivisions } = useDateToDivisions();
  const firstDay = useMemo(() => addDays(activeDate, -1), [activeDate]);
  const lastDay = useMemo(() => endOfDay(addDays(activeDate, 1)), [activeDate]);
  const days = useMemo(
    () => [firstDay, activeDate, lastDay].map((date) => dateToDivisions(date, divisionDetails)),
    [activeDate, dateToDivisions, divisionDetails, firstDay, lastDay]
  );

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
        (event.endTime >= firstDay && event.endTime <= lastDay)
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
      }}
    >
      <ThemeProvider theme={mergedTheme}>
        <Container>
          <TimelineView />
        </Container>
      </ThemeProvider>
    </SchedulerContext.Provider>
  );
};
