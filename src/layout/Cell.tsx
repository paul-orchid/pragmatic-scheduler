import React from 'react';
import { Box, BoxProps, styled } from '@mui/material';

const CellBase = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(2.25),
  paddingBottom: theme.spacing(2.25),
  boxShadow: ' 0px 0px 0px 1px #E0E0E0;',
  '&.no-padding': {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  '&.light-border': {
    boxShadow: 'unset',
    border: '0.5px solid #F1F1F1',
  },
}));

export const Cell = ({ classes = [], ...otherProps }: { classes?: ('no-padding' | 'light-border')[] } & BoxProps) => {
  return <CellBase className={classes.join(' ')} {...otherProps} />;
};
