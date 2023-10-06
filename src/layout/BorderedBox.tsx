import React from 'react';
import { Box, styled } from '@mui/material';
import { Colors } from '../constants/colors';

export const BoxShadow = styled(Box)(() => ({
  boxShadow: `0px 0px 0px 1px ${Colors.greyShadow};`,
}));

export const BorderedBox = styled(BoxShadow)(() => ({
  flex: 1,
  display: 'flex',
}));
