import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegionSelector from './RegionSelector';
import type { Region } from '../types';

interface SearchBarProps {
  initialRegion?: Region;
  initialQuery?: string;
  large?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialRegion = 'tr1', 
  initialQuery = '',
  large = false
}) => {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Handle both GameName#TagLine and just GameName (default to #TR1, #EUW, etc. if no tag)
    let gameName = query;
    let tagLine = '';
    
    if (query.includes('#')) {
      const parts = query.split('#');
      gameName = parts[0];
      tagLine = parts.slice(1).join('#');
    } else {
      // Default tag based on region or just standard Riot tag
      tagLine = region.toUpperCase().replace(/[0-9]/g, '');
    }

    if (gameName && tagLine) {
      navigate(`/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
    }
  };

  return (
    <form className={`search-bar ${large ? 'search-bar-large' : ''}`} onSubmit={handleSubmit}>
      <RegionSelector selectedRegion={region} onRegionChange={setRegion} />
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="GameName#TagLine"
          className="search-input"
        />
      </div>
      <button type="submit" className="search-submit-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
