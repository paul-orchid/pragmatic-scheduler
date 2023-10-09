import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SchedulerContext } from '../components/Scheduler';
import { HeaderRow } from '../components/HeaderRow';
import { Box, Typography } from '@mui/material';
import { BorderedBox } from '../layout/BorderedBox';
import { Cell } from '../layout/Cell';
import { Colors } from '../constants/colors';
import GridLayout from 'react-grid-layout';
import { EventTile } from '../components/EventTile';
import { useCalcEventPosition } from '../hooks/useCalcEventPosition';
import { useLayoutToCalEvent } from '../hooks/useLayoutToCalEvent';
import { CalEvent } from '../types';

export const TimelineView = () => {
  const {
    days,
    resources,
    events,
    config,
    activeDate,
    calendarBounds: { totalDivisions },
    onEventChange,
  } = useContext(SchedulerContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const calcEventPosition = useCalcEventPosition();
  const layoutToCalEvent = useLayoutToCalEvent();
  const [dragCalEvent, setDragCalEvent] = useState<CalEvent | undefined>();
  const [droppingItem, setDroppingItem] = useState<GridLayout.Layout>({ i: 'droppedItem', w: 4, h: 1, x: 0, y: 0 });

  useEffect(() => {
    ref.current?.scrollTo({
      left: ref.current.scrollWidth * 0.3,
      behavior: 'smooth',
    });
  }, [activeDate]);

  const cols = useMemo(() => {
    return totalDivisions * config.divisionParts;
  }, [config.divisionParts, totalDivisions]);

  const handleDrop = useCallback(
    (_layout: GridLayout.Layout[], layoutItem: GridLayout.Layout) => {
      if (dragCalEvent) {
        const updatedEvent = layoutToCalEvent(layoutItem);
        onEventChange?.(updatedEvent);
      }
    },
    [dragCalEvent, layoutToCalEvent, onEventChange],
  );

  const handleUnassignedDragStart = useCallback(
    (event: CalEvent) => {
      setDragCalEvent(event);
      const layout = calcEventPosition(event);
      setDroppingItem(layout);
    },
    [calcEventPosition],
  );

  const handleDragStop: GridLayout.ItemCallback = useCallback(
    (
      _layout: GridLayout.Layout[],
      _oldItem: GridLayout.Layout,
      newItem: GridLayout.Layout,
      // _placeholder: GridLayout.Layout,
      // _event: MouseEvent,
      // _element: HTMLElement,
    ) => {
      const updatedEvent = layoutToCalEvent(newItem);
      onEventChange?.(updatedEvent);
    },
    [layoutToCalEvent, onEventChange],
  );

  return (
    <Box>
      {/* top row */}
      <Box display="flex">
        <Box px={4} maxWidth={config.resourceColumnWidth} minWidth={config.resourceColumnWidth} />
        <BorderedBox px={3} py={2} sx={{ background: Colors.lightGrey }}>
          <Typography variant="tableHeader">UNASSIGNED</Typography>
        </BorderedBox>
      </Box>
      <Box display="flex">
        {/* left side column that does not scroll */}
        <Box marginTop={`${config.rowMinHeight * 2}px`}>
          <BorderedBox
            px={4}
            alignItems="center"
            maxWidth={config.resourceColumnWidth}
            minWidth={config.resourceColumnWidth}
            minHeight={config.rowMinHeight}
          >
            <Typography variant="subtitle2">TEAM</Typography>
          </BorderedBox>
          {resources.map((resource) => (
            <BorderedBox minHeight={config.rowMinHeight} key={resource.id}>
              <Cell alignItems="center" maxWidth={config.resourceColumnWidth} minWidth={config.resourceColumnWidth}>
                <Typography variant="subtitle2">{resource.name}</Typography>
              </Cell>
            </BorderedBox>
          ))}
        </Box>
        {/* right side column that scrolls */}
        <Box position="relative" flex={1} overflow="auto" ref={ref}>
          <HeaderRow onDragStart={handleUnassignedDragStart} />
          <GridLayout
            className="layout"
            margin={[0, 0]}
            compactType={null}
            allowOverlap={true}
            cols={cols}
            rowHeight={config.rowMinHeight}
            width={(cols * config.divisionMinWidth) / config.divisionParts}
            isBounded={true}
            isDroppable={true}
            onDrop={handleDrop}
            droppingItem={droppingItem}
            onDragStop={handleDragStop}
          >
            {/* <div key="a" data-grid={{ x: 0, y: 2, w: 4, h: 1, static: true }}>
              <div style={{ height: '100%', background: 'yellow' }}>Static1 x: 0 y: 2</div>
            </div>
            <div key="b" data-grid={{ x: 4, y: 2, w: 4, h: 1, static: true }}>
              <div style={{ height: '100%', background: 'red' }}>Static2 x: 4 y: 2</div>
            </div>
            <div key="c" data-grid={{ x: 8, y: 3, w: 4, h: 1, static: true }}>
              <div style={{ height: '100%', background: 'grey' }}>Static3 x: 8 y: 3</div>
            </div> */}

            {resources.map((_resource, index) =>
              days.map((day, dayIndex) =>
                day.divisions.map((_division, divIndex) => {
                  const x = (dayIndex * day.divisions.length + divIndex) * config.divisionParts;
                  const y = index;
                  return (
                    <div
                      data-key={`cell-${index}-${dayIndex}-${divIndex}`}
                      key={`cell-${index}-${dayIndex}-${divIndex}`}
                      data-grid={{
                        x: x,
                        y: y,
                        w: 4,
                        h: 1,
                        static: true,
                      }}
                    >
                      <Cell
                        classes={['no-padding', 'light-border']}
                        height={config.rowMinHeight - 2}
                        maxWidth={config.divisionMinWidth}
                        minWidth={config.divisionMinWidth}
                      ></Cell>
                    </div>
                  );
                }),
              ),
            )}
            {events
              .filter((e) => e.resourceId)
              .map((event) => {
                const dataGridProps = calcEventPosition(event);
                return (
                  <div key={event.id} data-grid={dataGridProps}>
                    <EventTile key={event.id} event={event} />
                  </div>
                );
              })}
          </GridLayout>
        </Box>
      </Box>
    </Box>
  );
};
