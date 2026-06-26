import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import api from '../services/api';
import type { SearchHistoryEntry } from '../types';
import { getProfileIconUrl, timeAgo } from '../utils/helpers';

const HomePage: React.FC = () => {
  const [recentSearches, setRecentSearches] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await api.getSearchHistory();
        setRecentSearches(history);
      } catch (error) {
        console.error('Failed to load search history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">
          <span className="gold-text">LoL</span> Info
        </h1>
        <p className="hero-subtitle">
          Advanced League of Legends and TFT player statistics
        </p>
        
        <div className="search-container-large">
          <SearchBar large={true} />
        </div>
      </div>

      <div className="recent-searches-section">
        <h2>Recent Searches</h2>
        
        {loading ? (
          <div className="loading-spinner-small"></div>
        ) : recentSearches.length > 0 ? (
          <div className="recent-searches-grid">
            {recentSearches.map((entry, idx) => (
              <Link 
                to={`/${entry.region}/${encodeURIComponent(entry.gameName)}/${encodeURIComponent(entry.tagLine)}`}
                key={`${entry.gameName}-${entry.tagLine}-${entry.region}-${idx}`}
                className="recent-search-card"
              >
                <div className="recent-icon">
                  {entry.profileIconId ? (
                    <img src={getProfileIconUrl(entry.profileIconId)} alt="Icon" />
                  ) : (
                    <div className="icon-placeholder"></div>
                  )}
                </div>
                <div className="recent-info">
                  <div className="recent-name">
                    {entry.gameName}<span>#{entry.tagLine}</span>
                  </div>
                  <div className="recent-meta">
                    <span className="recent-region">{entry.region.toUpperCase()}</span>
                    <span className="recent-time">{timeAgo(entry.timestamp)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-searches">No recent searches. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
