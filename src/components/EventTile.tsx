import React from 'react';
import { Box, BoxProps, Typography, TypographyProps, styled } from '@mui/material';
import { CalEvent } from '../types';
import { format } from 'date-fns';

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

export const EventTile = React.forwardRef(({ event, children, ...otherProps }: { event: CalEvent } & BoxProps, ref) => {
  return (
    <Container ref={ref} key={event.id} bgcolor={event.bgColor || 'primary.main'} {...otherProps}>
      <Box className="handle" flex={1} sx={{ cursor: 'move', overflow: 'hidden' }} padding={1}>
        <InnerText fontWeight="bold" color={event.textColor || 'text.primary'}>
          {event.title}
        </InnerText>
        <InnerText color={event.textColor || 'text.primary'}>
          {`${format(event.startTime, 'HHmm')}-${format(event.endTime, 'HHmm')}`} ({event.resourceId})
        </InnerText>
      </Box>
      {children}
    </Container>
  );
});
EventTile.displayName = 'EventTile';
