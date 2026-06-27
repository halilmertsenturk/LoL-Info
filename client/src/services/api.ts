import type { PlayerProfile, TFTProfile, SearchHistoryEntry } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`);

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const body = await response.json() as ApiResponse<T> | T;

  if (body && typeof body === 'object' && 'success' in body) {
    const wrapped = body as ApiResponse<T>;
    if (wrapped.success && wrapped.data !== undefined) {
      return wrapped.data;
    }
    throw new Error(wrapped.error || 'Request failed');
  }

  return body as T;
}

function mapPlayerProfile(data: Record<string, unknown>): PlayerProfile {
  return {
    summoner: data.summoner as PlayerProfile['summoner'],
    ranked: data.ranked as PlayerProfile['ranked'],
    championMastery: (data.mastery ?? data.championMastery ?? []) as PlayerProfile['championMastery'],
    matches: data.matches as PlayerProfile['matches'],
  };
}

function mapSearchHistory(entries: Array<Record<string, unknown>>): SearchHistoryEntry[] {
  return entries.map((entry) => ({
    gameName: entry.gameName as string,
    tagLine: entry.tagLine as string,
    region: entry.region as SearchHistoryEntry['region'],
    timestamp: new Date((entry.lastSearched ?? entry.timestamp) as string | number).getTime(),
    profileIconId: entry.profileIconId as number | undefined,
  }));
}

export const api = {
  async getPlayerProfile(region: string, gameName: string, tagLine: string): Promise<PlayerProfile> {
    const encodedName = encodeURIComponent(gameName);
    const encodedTag = encodeURIComponent(tagLine);
    const data = await fetchJson<Record<string, unknown>>(
      `/api/player/${region}/${encodedName}/${encodedTag}`
    );
    return mapPlayerProfile(data);
  },

  getTFTProfile(region: string, gameName: string, tagLine: string): Promise<TFTProfile> {
    const encodedName = encodeURIComponent(gameName);
    const encodedTag = encodeURIComponent(tagLine);
    return fetchJson<TFTProfile>(`/api/player/${region}/${encodedName}/${encodedTag}/tft`);
  },

  async getSearchHistory(): Promise<SearchHistoryEntry[]> {
    const data = await fetchJson<Array<Record<string, unknown>>>('/api/search/history');
    return mapSearchHistory(data);
  },
};

export default api;
