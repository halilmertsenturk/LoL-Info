import { useState, useEffect } from 'react';
import api from '../services/api';
import type { PlayerProfile, TFTProfile } from '../types';

interface UsePlayerDataResult {
  profile: PlayerProfile | null;
  tftProfile: TFTProfile | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export function usePlayerData(region: string, gameName: string, tagLine: string): UsePlayerDataResult {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [tftProfile, setTftProfile] = useState<TFTProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!region || !gameName || !tagLine) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch LoL and TFT data concurrently
      const [profileData, tftData] = await Promise.all([
        api.getPlayerProfile(region, gameName, tagLine),
        api.getTFTProfile(region, gameName, tagLine).catch(() => null), // Don't fail if TFT fails
      ]);

      setProfile(profileData);
      setTftProfile(tftData);
    } catch (err: any) {
      console.error('Error fetching player data:', err);
      setError(err.message || 'Failed to fetch player profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [region, gameName, tagLine]);

  return { profile, tftProfile, loading, error, fetchData };
}
