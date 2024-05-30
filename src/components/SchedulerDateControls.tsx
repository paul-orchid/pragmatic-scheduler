import React, { useRef, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { addDays } from 'date-fns';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import type {} from '@mui/x-date-pickers/AdapterDateFnsV3';

export const SchedulerDateControls = ({
  activeDate,
  setActiveDate,
  buttonText = 'TODAY',
  moveByDays = 1,
}: {
  activeDate: Date;
  setActiveDate: React.Dispatch<React.SetStateAction<Date>>;
  buttonText?: string;
  moveByDays?: number;
}) => {
  const [open, setOpen] = useState(false);
  const handleChange = (newValue: Date | null) => {
    if (newValue) {
      setActiveDate(newValue);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleGoForward = () => {
    setActiveDate((d) => addDays(d, moveByDays));
  };
  const handleGoBack = () => {
    setActiveDate((d) => addDays(d, -1 * moveByDays));
  };

  return (
    <Box>
      <IconButton onClick={handleGoBack}>
        <ArrowBackIosIcon />
      </IconButton>
      <DesktopDatePicker
        open={open}
        label="Date desktop"
        format="dd/MM/yyyy"
        value={activeDate}
        onClose={handleClose}
        onChange={handleChange}
        slots={{
          textField: (params) => {
            return (
              <Button ref={params.InputProps.ref} sx={{ marginX: 0.625 }} variant="outlined" onClick={handleOpen}>
                {buttonText}
              </Button>
            );
          },
        }}
        slotProps={{
          actionBar: { actions: ['today', 'cancel'] },
          popper: { placement: 'bottom-end' },
        }}
      />
      <IconButton onClick={handleGoForward}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};
