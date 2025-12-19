import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ResultPage from '../pages/ResultPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* For demo purposes, we redirect root to the result page with some sample data */}
        <Route path="/" element={<Navigate to="/result?name=김서연&age=20대&tags=이중턱,윤곽라인,비대칭&exp=true&priority=확실한효과" replace />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
