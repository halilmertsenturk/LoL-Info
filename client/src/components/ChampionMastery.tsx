import React from 'react';
import type { ChampionMasteryEntry } from '../types';
import { getChampionIconById, getChampionNameById, formatNumber } from '../utils/helpers';

interface ChampionMasteryProps {
  masteryData: ChampionMasteryEntry[];
}

const ChampionMastery: React.FC<ChampionMasteryProps> = ({ masteryData }) => {
  if (masteryData.length === 0) return null;

  return (
    <div className="mastery-section">
      <h3>Champion Mastery</h3>
      <div className="mastery-grid">
        {masteryData.slice(0, 7).map((mastery, index) => {
          const champName = getChampionNameById(mastery.championId);
          const iconUrl = getChampionIconById(mastery.championId);
          
          return (
            <div key={mastery.championId} className={`mastery-card ${index === 0 ? 'top-champ' : ''}`}>
              <div className="champ-icon-wrapper">
                <img src={iconUrl} alt={champName} className="champ-icon" />
                <div className="mastery-level-badge">{mastery.championLevel}</div>
              </div>
              <div className="champ-info">
                <div className="champ-name">{champName}</div>
                <div className="mastery-points">{formatNumber(mastery.championPoints)} pts</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChampionMastery;
