import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Fetching player data...</p>
    </div>
  );
};

export default Loading;
