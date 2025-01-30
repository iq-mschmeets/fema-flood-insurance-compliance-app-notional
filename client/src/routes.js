import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PolicyPage from './pages/PolicyPage';
import ClaimPage from './pages/ClaimPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/policies" element={<PolicyPage />} />
      <Route path="/claims" element={<ClaimPage />} />
    </Routes>
  );
};

export default AppRoutes;
