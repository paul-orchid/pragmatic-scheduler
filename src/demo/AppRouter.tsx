import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Daily from './Daily';
import Monthly from './Monthly';
import Weekly from './Weekly';
import { Navigate } from 'react-router';
import Daily2 from './Daily2';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/daily" element={<Daily />} />
      <Route path="/daily2" element={<Daily2 />} />
      <Route path="/week" element={<Weekly />} />
      <Route path="/month" element={<Monthly />} />
      <Route path="*" element={<Navigate replace to="/daily" />} />
    </Routes>
  );
};

export default AppRouter;
