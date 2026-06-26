import React from 'react';
import type { MatchData, MatchParticipant } from '../types';
import { 
  getChampionIconById, 
  getSummonerSpellIconUrl, 
  getItemIconUrl, 
  calculateKDA,
  getKDAColor,
  calculateCSPerMin,
  formatGameDuration,
  timeAgo,
  getQueueNameById
} from '../utils/helpers';

interface MatchHistoryProps {
  matches: MatchData[];
  puuid: string;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches, puuid }) => {
  if (matches.length === 0) {
    return (
      <div className="match-history-empty">
        <p>No recent matches found.</p>
      </div>
    );
  }

  return (
    <div className="match-history-section">
      <h3>Match History</h3>
      <div className="match-list">
        {matches.map((match) => {
          const participant = match.info.participants.find((p) => p.puuid === puuid);
          if (!participant) return null;

          const isWin = participant.win;
          const kdaStr = calculateKDA(participant.kills, participant.deaths, participant.assists);
          const kdaRatio = (participant.kills + participant.assists) / Math.max(1, participant.deaths);
          const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
          const csPerMin = calculateCSPerMin(cs, match.info.gameDuration);

          const items = [
            participant.item0, participant.item1, participant.item2,
            participant.item3, participant.item4, participant.item5,
            participant.item6
          ];

          return (
            <div key={match.metadata.matchId} className={`match-card ${isWin ? 'win' : 'loss'}`}>
              <div className="match-indicator"></div>
              
              <div className="match-meta">
                <div className="match-queue">{getQueueNameById(match.info.queueId)}</div>
                <div className="match-time">{timeAgo(match.info.gameCreation)}</div>
                <div className="match-result-badge">{isWin ? 'VICTORY' : 'DEFEAT'}</div>
                <div className="match-duration">{formatGameDuration(match.info.gameDuration)}</div>
              </div>

              <div className="match-champion">
                <div className="champ-icon-group">
                  <div className="champ-icon-container">
                    <img 
                      src={getChampionIconById(participant.championId)} 
                      alt={participant.championName} 
                      className="champ-icon-main" 
                    />
                    <div className="champ-level">{participant.champLevel}</div>
                  </div>
                  <div className="summoner-spells">
                    <img src={getSummonerSpellIconUrl(participant.summoner1Id)} alt="Spell 1" />
                    <img src={getSummonerSpellIconUrl(participant.summoner2Id)} alt="Spell 2" />
                  </div>
                </div>
                <div className="champ-name">{participant.championName}</div>
              </div>

              <div className="match-kda">
                <div className="kda-stats">
                  <span>{participant.kills}</span> / 
                  <span className="deaths">{participant.deaths}</span> / 
                  <span>{participant.assists}</span>
                </div>
                <div className="kda-ratio" style={{ color: getKDAColor(kdaRatio) }}>
                  {kdaStr} KDA
                </div>
                <div className="cs-stats">
                  {cs} CS ({csPerMin}/m)
                </div>
              </div>

              <div className="match-items">
                {items.map((itemId, idx) => (
                  <div key={idx} className={`item-slot ${idx === 6 ? 'trinket' : ''}`}>
                    {itemId > 0 && (
                      <img src={getItemIconUrl(itemId)} alt="Item" />
                    )}
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

export default MatchHistory;
