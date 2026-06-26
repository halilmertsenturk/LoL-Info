import React from 'react';
import type { TFTMatchData } from '../types';
import { 
  getPlacementColor, 
  getPlacementLabel, 
  isTopFour,
  formatGameDuration,
  timeAgo
} from '../utils/helpers';

interface TFTMatchHistoryProps {
  matches: TFTMatchData[];
  puuid: string;
}

const TFTMatchHistory: React.FC<TFTMatchHistoryProps> = ({ matches, puuid }) => {
  if (matches.length === 0) {
    return (
      <div className="match-history-empty">
        <p>No recent TFT matches found.</p>
      </div>
    );
  }

  return (
    <div className="match-history-section tft-match-history">
      <h3>TFT Match History</h3>
      <div className="match-list">
        {matches.map((match) => {
          const participant = match.info.participants.find((p) => p.puuid === puuid);
          if (!participant) return null;

          const placement = participant.placement;
          const top4 = isTopFour(placement);
          const color = getPlacementColor(placement);

          return (
            <div key={match.metadata.match_id} className={`match-card tft-match-card ${top4 ? 'win' : 'loss'}`}>
              <div className="match-indicator" style={{ backgroundColor: color }}></div>
              
              <div className="match-meta">
                <div className="match-queue">Set {match.info.tft_set_number}</div>
                <div className="match-time">{timeAgo(match.info.game_datetime)}</div>
                <div className="match-result-badge tft-placement" style={{ color }}>
                  {getPlacementLabel(placement)}
                </div>
                <div className="match-duration">{formatGameDuration(match.info.game_length)}</div>
              </div>

              <div className="tft-stats">
                <div className="level-info">Level {participant.level}</div>
                <div className="gold-left">🪙 {participant.gold_left}</div>
                <div className="rounds">Round {participant.last_round}</div>
              </div>

              <div className="tft-units">
                {participant.units.slice(0, 8).map((unit, idx) => (
                  <div key={idx} className={`tft-unit tier-${unit.tier}`}>
                    <div className="unit-stars">
                      {'★'.repeat(unit.tier)}
                    </div>
                    {/* Placeholder for unit icon, in real app would use TFT Data Dragon */}
                    <div className="unit-icon-placeholder">
                      {unit.character_id.replace('TFT10_', '').substring(0, 2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TFTMatchHistory;
