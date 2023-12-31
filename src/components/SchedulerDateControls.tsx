import React, { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { addDays } from 'date-fns';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

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
        inputFormat="dd/MM/yyyy"
        value={activeDate}
        onClose={handleClose}
        onChange={handleChange}
        componentsProps={{ actionBar: { actions: ['today', 'cancel'] } }}
        renderInput={(params) => {
          return (
            <Button sx={{ marginX: 0.625 }} variant="outlined" ref={params.inputRef} onClick={handleOpen}>
              {buttonText}
            </Button>
          );
        }}
      />
      <IconButton onClick={handleGoForward}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};
