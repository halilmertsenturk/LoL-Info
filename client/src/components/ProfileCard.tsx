import React from 'react';
import type { SummonerProfile } from '../types';
import { getProfileIconUrl } from '../utils/helpers';

interface ProfileCardProps {
  summoner: SummonerProfile;
  region: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ summoner, region }) => {
  return (
    <div className="profile-card">
      <div className="profile-icon-container">
        <img 
          src={getProfileIconUrl(summoner.profileIconId)} 
          alt="Profile Icon" 
          className="profile-icon"
        />
        <div className="summoner-level">{summoner.summonerLevel}</div>
      </div>
      
      <div className="profile-info">
        <h1 className="summoner-name">
          {summoner.gameName}
          <span className="summoner-tag">#{summoner.tagLine}</span>
        </h1>
        <div className="region-badge">{region.toUpperCase()}</div>
      </div>
    </div>
  );
};

export default ProfileCard;
