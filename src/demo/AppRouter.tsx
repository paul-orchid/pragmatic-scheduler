import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Daily from './Daily';
import Monthly from './Monthly';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Daily />} />
      <Route path="/week" element={<Daily />} />
      <Route path="/month" element={<Monthly />} />
    </Routes>
  );
};

export default AppRouter;
