import React, { useCallback, useContext, useEffect, useState } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import 'react-resizable/css/styles.css';
import { Box, Typography, TypographyProps, styled } from '@mui/material';
import { CalEvent } from '../types';
import { useCalcEventPosition } from '../hooks/useCalcEventPosition';
import { SchedulerContext } from './Scheduler';
import { ResourceRowContext } from './ResourceRow';
import { format } from 'date-fns';

const Container = styled(Box)(({ theme }) => ({
  zIndex: 1,
  display: 'flex',
}));

const InnerBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const InnerText = styled((props: TypographyProps) => <Typography variant="caption" {...props} />)(({ theme }) => ({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const UnassignedEvent = ({ event: startEvent, ...otherProps }: { event: CalEvent }) => {
  const {
    onEventChange,
    resources,
    config: { rowMinHeight },
  } = useContext(SchedulerContext);
  const { index } = useContext(ResourceRowContext);
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

  const { secondsToWidthConversion } = useCalcEventPosition(startEvent);
  const nodeRef = React.useRef(null);

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
    },
    [event, index, resources, rowMinHeight, secondsToWidthConversion],
  );

  const handleDrag: DraggableEventHandler = useCallback((e, data) => {
    console.log('e: ', e);
    console.log('data: ', data);
    // const msAdjustment = (data.deltaX / secondsToWidthConversion) * 1000;
    // const newStart = new Date(event.startTime.getTime() + msAdjustment);
    // const newEnd = new Date(event.endTime.getTime() + msAdjustment);
    // setEvent({ ...event, startTime: newStart, endTime: newEnd });
  }, []);

  return (
    <Draggable nodeRef={nodeRef} axis="y" handle=".handle" scale={1} key={key} defaultPosition={{ x: 25, y: 0 }}>
      <Container ref={nodeRef} height={rowMinHeight} {...otherProps}>
        <InnerBox className="handle" flex={1} sx={{ cursor: 'move' }} bgcolor={event.bgColor || 'primary.main'}>
          <InnerText fontWeight="bold" color={event.textColor || 'text.primary'}>
            {event.title}
          </InnerText>
          <InnerText color={event.textColor || 'text.primary'}>
            {`${format(event.startTime, 'HHmm')}-${format(event.endTime, 'HHmm')}`}
          </InnerText>
        </InnerBox>
      </Container>
    </Draggable>
  );
};
