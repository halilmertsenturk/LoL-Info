import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:region/:gameName/:tagLine" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
