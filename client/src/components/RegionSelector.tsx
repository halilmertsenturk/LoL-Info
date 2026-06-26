import React, { useState, useRef, useEffect } from 'react';
import { REGIONS } from '../utils/helpers';
import type { Region } from '../types';

interface RegionSelectorProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onRegionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = REGIONS.find((r) => r.value === selectedRegion);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="region-selector-container" ref={containerRef}>
      <button
        type="button"
        className="region-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.shortLabel || 'Region'}</span>
        <svg
          className={`dropdown-icon ${isOpen ? 'open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="region-dropdown">
          {REGIONS.map((region) => (
            <div
              key={region.value}
              className={`region-option ${selectedRegion === region.value ? 'selected' : ''}`}
              onClick={() => {
                onRegionChange(region.value as Region);
                setIsOpen(false);
              }}
            >
              <span className="region-short">{region.shortLabel}</span>
              <span className="region-full">{region.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
