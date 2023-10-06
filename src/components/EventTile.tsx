import React, { SyntheticEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import 'react-resizable/css/styles.css';
import { Box, Typography, TypographyProps, styled, useTheme } from '@mui/material';
import { CalEvent } from '../types';
import { useCalcEventPosition } from '../hooks/useCalcEventPosition';
import { SchedulerContext } from './Scheduler';
import { ResourceRowContext } from './ResourceRow';
import { format } from 'date-fns';

const Container = styled(Box)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const InnerText = styled((props: TypographyProps) => <Typography variant="caption" noWrap {...props} />)(() => ({
  display: 'block',
}));

const useDraggabbleBounds = () => {
  const { index } = useContext(ResourceRowContext);
  const {
    resources,
    config: { rowMinHeight },
  } = useContext(SchedulerContext);
  const bounds = React.useMemo(() => {
    return {
      top: -1 * rowMinHeight * index,
      bottom: (resources.length - (index + 1)) * rowMinHeight,
    };
  }, [rowMinHeight, index, resources.length]);
  return bounds;
};

export const EventTile = ({ event: startEvent, ...otherProps }: { event: CalEvent }) => {
  const theme = useTheme();
  const {
    onEventChange,
    resources,
    config: { rowMinHeight },
  } = useContext(SchedulerContext);
  const { index } = useContext(ResourceRowContext);
  const bounds = useDraggabbleBounds();
  const [event, setEvent] = useState(startEvent);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // if event changes, reset the key to force a re-render otherwise transforms from drag will not be reset
    setKey((k) => k + 1);
    setEvent(startEvent);
  }, [startEvent]);
  useEffect(() => {
    if (event && event !== startEvent) {
      onEventChange?.(event);
    }
  }, [event, onEventChange, startEvent]);

  const {
    left: startLeft,
    width: startWidth,
    top,
    bottom,
    minWidth,
    secondsToWidthConversion,
  } = useCalcEventPosition(startEvent);
  const [{ left, width }, setPosition] = useState({ left: startLeft, width: startWidth });
  const nodeRef = React.useRef(null);

  useEffect(() => {
    // must subtract off the padding and margin from the width
    setPosition({ left: startLeft, width: startWidth - parseInt(theme.spacing(4)) });
  }, [startLeft, startWidth, theme]);

  const onResize = (_event: SyntheticEvent, { size, handle }: ResizeCallbackData) => {
    setPosition((p) => {
      if (handle === 'w') {
        // if resizing from the left, we need to adjust the left position and width
        return { left: p.left + p.width - size.width, width: size.width };
      } else {
        // if resizing from the right, we only need to adjust the width
        return { ...p, width: size.width };
      }
    });
  };

  // const handleDragStart: DraggableEventHandler = useCallback(() => {
  //   setIsDragging(true);
  // }, []);

  const handleDragStop: DraggableEventHandler = useCallback(
    (e, data) => {
      const msAdjustment = (data.lastX / secondsToWidthConversion) * 1000;
      const newStart = new Date(event.startTime.getTime() + msAdjustment);
      const newEnd = new Date(event.endTime.getTime() + msAdjustment);
      let newResourceId = event.resourceId;
      if (data.lastY) {
        // if the event was dragged vertically, we need to adjust the resource id
        const indexToMove = Math.round(data.lastY / rowMinHeight);
        newResourceId = resources[index + indexToMove].id;
      }
      setEvent({ ...event, resourceId: newResourceId, startTime: newStart, endTime: newEnd });
      // setIsDragging(false);
    },
    [event, index, resources, rowMinHeight, secondsToWidthConversion],
  );

  const handleResizeStop = useCallback(
    (e: SyntheticEvent, { size, handle }: ResizeCallbackData) => {
      const newWidth = size.width + parseInt(theme.spacing(4));
      const currentTimeDifference = event.endTime.getTime() - event.startTime.getTime();
      const currentWidth = (currentTimeDifference / 1000) * secondsToWidthConversion;
      const msAdjustment = ((newWidth - currentWidth) / secondsToWidthConversion) * 1000;

      if (handle === 'w') {
        // if resizing from the left, we need to adjust the start time
        const newStart = new Date(event.startTime.getTime() - msAdjustment);
        setEvent({ ...event, startTime: newStart });
      } else {
        // if resizing from the right, we need to adjust the end time
        const newEnd = new Date(event.endTime.getTime() + msAdjustment);
        setEvent({ ...event, endTime: newEnd });
      }
    },
    [event, secondsToWidthConversion, theme],
  );

  return (
    <Draggable
      nodeRef={nodeRef}
      axis="both"
      handle=".handle"
      grid={[minWidth, rowMinHeight]}
      scale={1}
      // onStart={handleDragStart}
      onStop={handleDragStop}
      key={key}
      bounds={bounds}
    >
      <Resizable
        width={width}
        onResize={onResize}
        onResizeStop={handleResizeStop}
        axis="x"
        resizeHandles={['e', 'w']}
        minConstraints={[minWidth, 0]}
        draggableOpts={{ grid: [minWidth, 0] }}
      >
        <Container
          ref={nodeRef}
          sx={{ top, bottom, left, width }}
          bgcolor={event.bgColor || 'primary.main'}
          {...otherProps}
        >
          <Box className="handle" flex={1} sx={{ cursor: 'move', overflow: 'hidden' }}>
            <InnerText fontWeight="bold" color={event.textColor || 'text.primary'}>
              {event.title}
            </InnerText>
            <InnerText color={event.textColor || 'text.primary'}>
              {`${format(event.startTime, 'HHmm')}-${format(event.endTime, 'HHmm')}`}
            </InnerText>
          </Box>
        </Container>
      </Resizable>
    </Draggable>
  );
};
