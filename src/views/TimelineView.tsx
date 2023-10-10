import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SchedulerContext } from '../components/Scheduler';
import { HeaderRow, UnAssignedEvents } from '../components/HeaderRow';
import { Box, Typography } from '@mui/material';
import { BorderedBox, BoxShadow } from '../layout/BorderedBox';
import { Cell } from '../layout/Cell';
import { Colors } from '../constants/colors';
import GridLayout from 'react-grid-layout';
import { EventTile } from '../components/EventTile';
import { useCalcEventPosition } from '../hooks/useCalcEventPosition';
import { useCalcResourceRows } from '../hooks/useCalcResourceRows';
import { useLayoutToCalEvent } from '../hooks/useLayoutToCalEvent';
import { useCalcGridPositions } from '../hooks/useCalcGridPositions';
import { CalEvent } from '../types';

export const TimelineView = () => {
  const {
    resources,
    events,
    days,
    config,
    activeDate,
    calendarBounds: { totalDivisions },
    onEventChange,
  } = useContext(SchedulerContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const calcEventPosition = useCalcEventPosition();
  const layoutToCalEvent = useLayoutToCalEvent();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const gridLayouts = useCalcGridPositions();
  const calcResourceRows = useCalcResourceRows();

  const [dragCalEvent, setDragCalEvent] = useState<CalEvent | undefined>();
  const [droppingItem, setDroppingItem] = useState<GridLayout.Layout>({ i: 'droppedItem', w: 4, h: 1, x: 0, y: 0 });
  const [layouts, setLayouts] = useState<GridLayout.Layout[]>(gridLayouts);

  const updateLayout = useCallback(
    (layout: GridLayout.Layout[]) => {
      const gridIds = gridLayouts.map((l) => l.i);
      const eventLayouts = layout.filter((l) => !gridIds.includes(l.i));
      setLayouts([...eventLayouts, ...gridLayouts]);
    },
    [gridLayouts],
  );

  useEffect(() => {
    // scroll to the current date (there is 1 day in the past)
    ref.current?.scrollTo({
      left: ref.current.scrollWidth * (1 / (config.daysToDisplay + 1)),
      behavior: 'smooth',
    });
  }, [activeDate, config.daysToDisplay]);

  const cols = useMemo(() => {
    return totalDivisions * config.divisionParts;
  }, [config.divisionParts, totalDivisions]);

  const handleDrop = useCallback(
    (_layout: GridLayout.Layout[], layoutItem: GridLayout.Layout) => {
      if (dragCalEvent && layoutItem) {
        const updatedEvent = layoutToCalEvent(layoutItem);
        onEventChange?.(updatedEvent);
        setIsDraggingOver(false);
      }
    },
    [dragCalEvent, layoutToCalEvent, onEventChange],
  );

  const handleDropDragOver = useCallback(() => {
    setIsDraggingOver(true);
    return undefined;
  }, [setIsDraggingOver]);

  const handleUnassignedDragStart = useCallback(
    (event: CalEvent) => {
      setDragCalEvent(event);
      const layout = calcEventPosition(event);
      setDroppingItem(layout);
    },
    [calcEventPosition],
  );

  const handleDragResizeStop: GridLayout.ItemCallback = useCallback(
    (
      layout: GridLayout.Layout[],
      _oldItem: GridLayout.Layout,
      newItem: GridLayout.Layout,
      // _placeholder: GridLayout.Layout,
      // _event: MouseEvent,
      // _element: HTMLElement,
    ) => {
      const updatedEvent = layoutToCalEvent(newItem);
      onEventChange?.(updatedEvent);
      // be sure to unset this so that the handleLayoutChange updates the layout
      setIsDraggingOver(false);
      setTimeout(() => {
        // note this is required as the handleLayoutChange is not always triggered
        // see: https://github.com/react-grid-layout/react-grid-layout/issues/1606
        // the setTimeout is a hack as sometime it ges into a loop depending on how quickly the event is dropped
        updateLayout(layout);
      });
    },
    [layoutToCalEvent, onEventChange, updateLayout],
  );

  const handleLayoutChange = useCallback(
    (layout: GridLayout.Layout[]) => {
      // note we have to check if we are dragging over as the handleLayoutChange can remove the droppingItem
      // which causes the handleDrop be called with an undefined layoutItem, and the "pink box" is not shown
      if (!isDraggingOver) {
        updateLayout(layout);
      }
    },
    [isDraggingOver, updateLayout],
  );

  return (
    <Box>
      {/* top row */}
      {config.unAssignedRows && (
        <Box display="flex">
          <Box px={4} maxWidth={config.resourceColumnWidth} minWidth={config.resourceColumnWidth} />
          <BorderedBox px={3} py={2} sx={{ background: Colors.lightGrey }}>
            <Typography variant="tableHeader">UNASSIGNED</Typography>
          </BorderedBox>
        </Box>
      )}
      <Box display="flex">
        {/* left side column that does not scroll */}
        <Box marginTop={config.unAssignedRows ? `${config.rowMinHeight * 2}px` : 0}>
          <BorderedBox
            px={4}
            alignItems="center"
            maxWidth={config.resourceColumnWidth}
            minWidth={config.resourceColumnWidth}
            minHeight={config.rowMinHeight}
          >
            <Typography variant="subtitle2">TEAM</Typography>
          </BorderedBox>
          {resources.map((resource) => {
            const rows = calcResourceRows(resource);
            return (
              <BorderedBox minHeight={config.rowMinHeight * rows} key={resource.id}>
                <Cell alignItems="center" maxWidth={config.resourceColumnWidth} minWidth={config.resourceColumnWidth}>
                  <Typography variant="subtitle2">{resource.name}</Typography>
                </Cell>
              </BorderedBox>
            );
          })}
        </Box>
        {/* right side column that scrolls */}
        <BoxShadow position="relative" flex={1} overflow="auto" ref={ref}>
          {config.unAssignedRows && <UnAssignedEvents onDragStart={handleUnassignedDragStart} />}
          <HeaderRow days={days} />
          <GridLayout
            className="layout"
            margin={[0, 0]}
            compactType={null}
            allowOverlap={true}
            cols={cols}
            rowHeight={config.rowMinHeight}
            width={(cols * config.divisionWidth) / config.divisionParts}
            isBounded={true}
            isDroppable={true}
            onDrop={handleDrop}
            onDropDragOver={handleDropDragOver}
            droppingItem={droppingItem}
            onDragStop={handleDragResizeStop}
            onResizeStop={handleDragResizeStop}
            layout={layouts}
            onLayoutChange={handleLayoutChange}
          >
            {gridLayouts.map((layout) => {
              return (
                <div key={layout.i}>
                  <Cell
                    classes={['no-padding', 'light-border']}
                    height={config.rowMinHeight * layout.h - 2}
                    maxWidth={config.divisionWidth}
                    minWidth={config.divisionWidth}
                  ></Cell>
                </div>
              );
            })}
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
        </BoxShadow>
      </Box>
    </Box>
  );
};
