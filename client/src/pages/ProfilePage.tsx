import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlayerData } from '../hooks/usePlayerData';
import SearchBar from '../components/SearchBar';
import ProfileCard from '../components/ProfileCard';
import RankedInfo from '../components/RankedInfo';
import ChampionMastery from '../components/ChampionMastery';
import MatchHistory from '../components/MatchHistory';
import TFTRankedInfo from '../components/TFTRankedInfo';
import TFTMatchHistory from '../components/TFTMatchHistory';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import type { Region } from '../types';

const ProfilePage: React.FC = () => {
  const { region, gameName, tagLine } = useParams<{ region: string; gameName: string; tagLine: string }>();
  const [activeTab, setActiveTab] = useState<'lol' | 'tft'>('lol');
  
  const { profile, tftProfile, loading, error, fetchData } = usePlayerData(
    region || '', 
    gameName || '', 
    tagLine || ''
  );

  return (
    <div className="profile-page">
      <header className="page-header">
        <Link to="/" className="logo">
          <span className="gold-text">LoL</span> Info
        </Link>
        <div className="header-search">
          <SearchBar 
            initialRegion={(region as Region) || 'tr1'} 
            initialQuery={`${gameName}#${tagLine}`} 
          />
        </div>
      </header>

      <main className="profile-content">
        {loading && <Loading />}
        
        {error && !loading && (
          <ErrorDisplay message={error} onRetry={fetchData} />
        )}
        
        {profile && !loading && !error && (
          <>
            <ProfileCard summoner={profile.summoner} region={region || ''} />
            
            <div className="tabs-container">
              <button 
                className={`tab-btn ${activeTab === 'lol' ? 'active' : ''}`}
                onClick={() => setActiveTab('lol')}
              >
                League of Legends
              </button>
              <button 
                className={`tab-btn ${activeTab === 'tft' ? 'active' : ''}`}
                onClick={() => setActiveTab('tft')}
              >
                Teamfight Tactics
              </button>
            </div>
            
            {activeTab === 'lol' && (
              <div className="tab-content lol-content">
                <div className="content-sidebar">
                  <RankedInfo rankedData={profile.ranked} />
                  <ChampionMastery masteryData={profile.championMastery} />
                </div>
                <div className="content-main">
                  <MatchHistory matches={profile.matches} puuid={profile.summoner.puuid} />
                </div>
              </div>
            )}
            
            {activeTab === 'tft' && (
              <div className="tab-content tft-content">
                <div className="content-sidebar">
                  {tftProfile ? (
                    <TFTRankedInfo rankedData={tftProfile.ranked} />
                  ) : (
                    <div className="ranked-section empty">
                      <p>TFT ranked data unavailable.</p>
                    </div>
                  )}
                </div>
                <div className="content-main">
                  {tftProfile && tftProfile.matches.length > 0 ? (
                    <TFTMatchHistory matches={tftProfile.matches} puuid={profile.summoner.puuid} />
                  ) : (
                    <div className="match-history-empty">
                      <p>No recent TFT matches found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
