import React from 'react';
import { BoxProps, styled } from '@mui/material';
import { BoxShadow } from './BorderedBox';

const CellBase = styled(BoxShadow)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(2.25),
  paddingBottom: theme.spacing(2.25),
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
  '&.no-border': {
    boxShadow: 'unset',
    border: '0.5px solid transparent', // still need a border to line up with the light border cells
  },
}));

export const Cell = ({
  classes = [],
  ...otherProps
}: { classes?: ('no-padding' | 'light-border' | 'no-border')[] } & BoxProps) => {
  return <CellBase className={classes.join(' ')} {...otherProps} />;
};
