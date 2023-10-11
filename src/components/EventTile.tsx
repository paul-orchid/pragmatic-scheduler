import React, { useContext } from 'react';
import { Box, Typography, TypographyProps, styled } from '@mui/material';
import { CalEvent } from '../types';
import { format } from 'date-fns';
import { SchedulerContext } from './Scheduler';

const Container = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '100%',
}));

const InnerText = styled((props: TypographyProps) => <Typography variant="caption" noWrap {...props} />)(() => ({
  display: 'block',
  userSelect: 'none',
}));

export const EventTile = ({ event }: { event: CalEvent }) => {
  const { EventTile: EventTileOverride } = useContext(SchedulerContext);
  const Component = EventTileOverride || DefaultEventTile;
  return <Component event={event} />;
};
EventTile.displayName = 'EventTile';

const DefaultEventTile = ({ event }: { event: CalEvent }) => {
  return (
    <Container key={event.id} bgcolor={event.bgColor || 'primary.main'}>
      <Box className="handle" flex={1} sx={{ cursor: 'move', overflow: 'hidden' }} padding={1}>
        <InnerText fontWeight="bold" color={event.textColor || 'text.primary'}>
          {event.title}
        </InnerText>
        <InnerText color={event.textColor || 'text.primary'}>
          {`${format(event.startTime, 'HHmm')}-${format(event.endTime, 'HHmm')}`}
        </InnerText>
      </Box>
    </Container>
  );
};

// export const EventTile = React.forwardRef(({ event, children, ...otherProps }:
// { event: CalEvent } & BoxProps, ref) => {
//   return (
//     <Container ref={ref} key={event.id} bgcolor={event.bgColor || 'primary.main'} {...otherProps}>
//       <Box className="handle" flex={1} sx={{ cursor: 'move', overflow: 'hidden' }} padding={1}>
//         <InnerText fontWeight="bold" color={event.textColor || 'text.primary'}>
//           {event.title}
//         </InnerText>
//         <InnerText color={event.textColor || 'text.primary'}>
//           {`${format(event.startTime, 'HHmm')}-${format(event.endTime, 'HHmm')}`}
//         </InnerText>
//       </Box>
//       {children}
//     </Container>
//   );
// });
// EventTile.displayName = 'EventTile';
