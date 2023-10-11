import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Daily from './Daily';
import Monthly from './Monthly';
import Weekly from './Weekly';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Daily />} />
      <Route path="/week" element={<Weekly />} />
      <Route path="/month" element={<Monthly />} />
    </Routes>
  );
};

export default AppRouter;
