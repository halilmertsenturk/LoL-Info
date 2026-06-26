import type { PlayerProfile, TFTProfile, SearchHistoryEntry } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`);

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If we can't parse JSON error, use the status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  getPlayerProfile(region: string, gameName: string, tagLine: string): Promise<PlayerProfile> {
    const encodedName = encodeURIComponent(gameName);
    const encodedTag = encodeURIComponent(tagLine);
    return fetchJson<PlayerProfile>(`/api/player/${region}/${encodedName}/${encodedTag}`);
  },

  getTFTProfile(region: string, gameName: string, tagLine: string): Promise<TFTProfile> {
    const encodedName = encodeURIComponent(gameName);
    const encodedTag = encodeURIComponent(tagLine);
    return fetchJson<TFTProfile>(`/api/player/${region}/${encodedName}/${encodedTag}/tft`);
  },

  getSearchHistory(): Promise<SearchHistoryEntry[]> {
    return fetchJson<SearchHistoryEntry[]>('/api/search/history');
  },
};

export default api;
