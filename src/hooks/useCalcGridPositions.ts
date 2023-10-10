import { useContext, useMemo } from 'react';
import { SchedulerContext } from '../components/Scheduler';
import GridLayout from 'react-grid-layout';
import { useCalcResourceRows } from './useCalcResourceRows';

export const useCalcGridPositions = () => {
  const { resources, config, days } = useContext(SchedulerContext);
  const calcResourceRows = useCalcResourceRows();

  const layouts: GridLayout.Layout[] = useMemo(() => {
    let rowCount = 0;
    return resources
      .map((_resource, index) => {
        const rows = calcResourceRows(_resource);
        const y = rowCount;
        rowCount += rows;
        return days.map((day, dayIndex) =>
          day.divisions.map((_division, divIndex) => {
            const x = (dayIndex * day.divisions.length + divIndex) * config.divisionParts;
            return {
              i: `cell-${index}-${dayIndex}-${divIndex}`,
              x: x,
              y: y,
              w: config.divisionParts,
              h: rows,
              static: true,
            };
          }),
        );
      })
      .flat(3);
  }, [calcResourceRows, config.divisionParts, days, resources]);

  return layouts;
};
