import { useContext, useMemo } from 'react';
import { SchedulerContext } from '../components/Scheduler';
import { useCalcResourceRows } from './useCalcResourceRows';
import { GridCellLayout } from '../types';

export const useCalcGridPositions = () => {
  const { resources, config, days } = useContext(SchedulerContext);
  const calcResourceRows = useCalcResourceRows();

  const layouts: GridCellLayout[] = useMemo(() => {
    let rowCount = 0;
    return resources
      .map((_resource, index) => {
        const rows = calcResourceRows(_resource);
        const y = rowCount;
        rowCount += rows;
        return days.map((day, dayIndex) =>
          day.divisions.map((division, divIndex) => {
            const x = (dayIndex * day.divisions.length + divIndex) * config.divisionParts;
            return {
              i: `cell-${index}-${dayIndex}-${divIndex}`,
              x: x,
              y: y,
              w: config.divisionParts,
              h: rows,
              static: true,
              day: day,
              division: division,
              resourceId: _resource.id,
            };
          }),
        );
      })
      .flat(3);
  }, [calcResourceRows, config.divisionParts, days, resources]);

  return layouts;
};
