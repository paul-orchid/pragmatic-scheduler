import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, Typography } from '@mui/material';
import { SideBar } from 'pragmatic-ui';
import OrchidLogo from '../images/OrchidLogo';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ensure that the key matches the pathname so that it can select. Does not need to include '/'
  const navItems = useMemo(
    () => [
      {
        text: 'Day',
        key: '',
        icon: <ViewDayIcon />,
        onClick: () => navigate('/'),
      },
      {
        text: 'Week',
        key: 'week',
        icon: <ViewWeekIcon />,
        onClick: () => navigate('/week'),
      },
      {
        text: 'Month',
        key: 'month',
        icon: <CalendarMonthIcon />,
        onClick: () => navigate('/month'),
      },
    ],
    [navigate],
  );

  return (
    <SideBar
      collapsible={false}
      logoCollapsed={<OrchidLogo />}
      logoExpanded={<OrchidLogo />}
      items={navItems}
      childrenCollapsed={<CollapseText />}
      textVariant="body2"
      expandHint
      selectedMenuKey={location.pathname.substring(1)}
    />
  );
};

const CollapseText = () => {
  return (
    <Box p={2}>
      <Typography variant="h6">CT</Typography>
    </Box>
  );
};

export default Sidebar;
