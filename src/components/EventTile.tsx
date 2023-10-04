import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import 'react-resizable/css/styles.css';
import { Box, Typography, styled, useTheme } from '@mui/material';
import { CalEvent } from '../types';
import { useCalcEventPosition } from '../hooks/useCalcEventPosition';
import { SchedulerContext } from './Scheduler';

const Container = styled(Box)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const EventTile = ({ event: startEvent, ...otherProps }: { event: CalEvent }) => {
  const theme = useTheme();
  const { onEventChange } = useContext(SchedulerContext);
  const [event, setEvent] = useState(startEvent);

  useEffect(() => {
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

  const handleDragStop: DraggableEventHandler = (e, data) => {
    const msAdjustment = (data.lastX / secondsToWidthConversion) * 1000;
    const newStart = new Date(event.startTime.getTime() + msAdjustment);
    const newEnd = new Date(event.endTime.getTime() + msAdjustment);
    setEvent({ ...event, startTime: newStart, endTime: newEnd });
  };

  const handleResizeStop = (e: SyntheticEvent, { size, handle }: ResizeCallbackData) => {
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
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      axis="x"
      handle=".handle"
      grid={[minWidth, 0]}
      scale={1}
      // onStart={handleDragStart}
      // onDrag={handleDrag}
      onStop={handleDragStop}
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
          <Box className="handle" flex={1} sx={{ cursor: 'move' }}>
            <Typography
              variant="caption"
              textOverflow="ellipsis"
              overflow="hidden"
              color={event.textColor || 'text.primary'}
            >
              {event.title}
            </Typography>
          </Box>
        </Container>
      </Resizable>
    </Draggable>
  );
};
