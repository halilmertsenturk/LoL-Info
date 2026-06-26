import React from 'react';
import type { TFTRankedEntry } from '../types';
import { getRankDisplay, calculateWinRate } from '../utils/helpers';

interface TFTRankedInfoProps {
  rankedData: TFTRankedEntry[];
}

const TFTRankedInfo: React.FC<TFTRankedInfoProps> = ({ rankedData }) => {
  if (rankedData.length === 0) {
    return (
      <div className="ranked-section empty">
        <h3>TFT Ranked</h3>
        <p>No TFT ranked data available.</p>
      </div>
    );
  }

  return (
    <div className="ranked-section">
      {rankedData.map((entry) => {
        const winRate = calculateWinRate(entry.wins, entry.losses);
        
        return (
          <div key={entry.queueType} className="ranked-card tft-ranked-card">
            <div className="ranked-header">
              <h4>TFT Ranked</h4>
            </div>
            
            <div className="ranked-content">
              <div className="rank-emblem-container">
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
                  <span className="wins">{entry.wins} Top 4</span>
                  <span className="divider">/</span>
                  <span className="losses">{entry.losses} Bot 4</span>
                </div>
                <div className={`win-rate ${winRate >= 50 ? 'positive' : 'negative'}`}>
                  {winRate}% Top 4 Rate
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TFTRankedInfo;
