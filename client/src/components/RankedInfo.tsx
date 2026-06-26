import React from 'react';
import type { RankedEntry } from '../types';
import { getRankDisplay, calculateWinRate, capitalize } from '../utils/helpers';

interface RankedInfoProps {
  rankedData: RankedEntry[];
}

const RankedInfo: React.FC<RankedInfoProps> = ({ rankedData }) => {
  // Sort so Solo/Duo is first
  const sortedData = [...rankedData].sort((a, b) => {
    if (a.queueType === 'RANKED_SOLO_5x5') return -1;
    if (b.queueType === 'RANKED_SOLO_5x5') return 1;
    return 0;
  });

  if (sortedData.length === 0) {
    return (
      <div className="ranked-section empty">
        <h3>Ranked</h3>
        <p>No ranked data available for this season.</p>
      </div>
    );
  }

  return (
    <div className="ranked-section">
      {sortedData.map((entry) => {
        const isSolo = entry.queueType === 'RANKED_SOLO_5x5';
        const winRate = calculateWinRate(entry.wins, entry.losses);
        
        return (
          <div key={entry.queueType} className="ranked-card">
            <div className="ranked-header">
              <h4>{isSolo ? 'Ranked Solo/Duo' : 'Ranked Flex'}</h4>
            </div>
            
            <div className="ranked-content">
              <div className="rank-emblem-container">
                {/* Note: In a real app, you'd use local assets or another CDN for emblems. Using text styling as fallback */}
                <div className={`rank-emblem-placeholder tier-${entry.tier.toLowerCase()}`}>
                  {entry.tier.charAt(0)}
                </div>
              </div>
              
              <div className="rank-details">
                <div className="rank-tier">{getRankDisplay(entry.tier, entry.rank)}</div>
                <div className="rank-lp">{entry.leaguePoints} LP</div>
              </div>
              
              <div className="rank-stats">
                <div className="win-loss">
                  <span className="wins">{entry.wins}W</span>
                  <span className="divider">/</span>
                  <span className="losses">{entry.losses}L</span>
                </div>
                <div className={`win-rate ${winRate >= 50 ? 'positive' : 'negative'}`}>
                  {winRate}% Win Rate
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankedInfo;
