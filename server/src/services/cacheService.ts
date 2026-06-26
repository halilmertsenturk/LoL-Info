import prisma from '../config/database';
import {
  PlayerProfile,
  TftProfile,
  SummonerProfile,
  RankedInfo,
  ChampionMasteryInfo,
  MatchSummary,
  TftRankedInfo,
  TftMatchSummary,
  SearchHistoryEntry,
} from '../types/index';

// Cache TTL: 10 minutes in milliseconds
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Checks if a cached entry is still valid (within 10-minute window).
 */
function isCacheValid(cachedAt: Date): boolean {
  const now = Date.now();
  const cachedTime = cachedAt.getTime();
  return now - cachedTime < CACHE_TTL_MS;
}

// ==========================================
// Player Cache Operations
// ==========================================

/**
 * Retrieves cached LoL profile data if it exists and is within TTL.
 * Returns null if no valid cache exists.
 */
export async function getCachedPlayerProfile(
  puuid: string,
  region: string
): Promise<PlayerProfile | null> {
  try {
    const cached = await prisma.playerCache.findUnique({
      where: {
        puuid_region: { puuid, region },
      },
    });

    if (!cached || !isCacheValid(cached.cachedAt)) {
      return null;
    }

    // All required LoL data must be present
    if (!cached.summonerData || !cached.rankedData || !cached.masteryData || !cached.matchData) {
      return null;
    }

    return {
      summoner: cached.summonerData as unknown as SummonerProfile,
      ranked: cached.rankedData as unknown as RankedInfo[],
      mastery: cached.masteryData as unknown as ChampionMasteryInfo[],
      matches: cached.matchData as unknown as MatchSummary[],
      cachedAt: cached.cachedAt.toISOString(),
    };
  } catch (error) {
    console.error('⚠️ Cache read error (player profile):', error);
    return null;
  }
}

/**
 * Stores LoL profile data in cache.
 */
export async function cachePlayerProfile(
  puuid: string,
  region: string,
  gameName: string,
  tagLine: string,
  summoner: SummonerProfile,
  ranked: RankedInfo[],
  mastery: ChampionMasteryInfo[],
  matches: MatchSummary[]
): Promise<void> {
  try {
    await prisma.playerCache.upsert({
      where: {
        puuid_region: { puuid, region },
      },
      update: {
        gameName,
        tagLine,
        summonerData: JSON.parse(JSON.stringify(summoner)),
        rankedData: JSON.parse(JSON.stringify(ranked)),
        masteryData: JSON.parse(JSON.stringify(mastery)),
        matchData: JSON.parse(JSON.stringify(matches)),
        cachedAt: new Date(),
      },
      create: {
        puuid,
        region,
        gameName,
        tagLine,
        summonerData: JSON.parse(JSON.stringify(summoner)),
        rankedData: JSON.parse(JSON.stringify(ranked)),
        masteryData: JSON.parse(JSON.stringify(mastery)),
        matchData: JSON.parse(JSON.stringify(matches)),
        cachedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('⚠️ Cache write error (player profile):', error);
    // Non-fatal: don't throw, the API response still works
  }
}

/**
 * Retrieves cached TFT profile data if it exists and is within TTL.
 */
export async function getCachedTftProfile(
  puuid: string,
  region: string
): Promise<TftProfile | null> {
  try {
    const cached = await prisma.playerCache.findUnique({
      where: {
        puuid_region: { puuid, region },
      },
    });

    if (!cached || !isCacheValid(cached.cachedAt)) {
      return null;
    }

    if (!cached.tftRankedData || !cached.tftMatchData) {
      return null;
    }

    return {
      ranked: cached.tftRankedData as unknown as TftRankedInfo[],
      matches: cached.tftMatchData as unknown as TftMatchSummary[],
      cachedAt: cached.cachedAt.toISOString(),
    };
  } catch (error) {
    console.error('⚠️ Cache read error (TFT profile):', error);
    return null;
  }
}

/**
 * Stores TFT profile data in cache.
 */
export async function cacheTftProfile(
  puuid: string,
  region: string,
  gameName: string,
  tagLine: string,
  ranked: TftRankedInfo[],
  matches: TftMatchSummary[]
): Promise<void> {
  try {
    await prisma.playerCache.upsert({
      where: {
        puuid_region: { puuid, region },
      },
      update: {
        gameName,
        tagLine,
        tftRankedData: JSON.parse(JSON.stringify(ranked)),
        tftMatchData: JSON.parse(JSON.stringify(matches)),
        cachedAt: new Date(),
      },
      create: {
        puuid,
        region,
        gameName,
        tagLine,
        tftRankedData: JSON.parse(JSON.stringify(ranked)),
        tftMatchData: JSON.parse(JSON.stringify(matches)),
        cachedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('⚠️ Cache write error (TFT profile):', error);
  }
}

// ==========================================
// Search History Operations
// ==========================================

/**
 * Records a search in the search history.
 * Increments searchCount if the same player was searched before.
 */
export async function recordSearch(
  gameName: string,
  tagLine: string,
  region: string
): Promise<void> {
  try {
    await prisma.searchHistory.upsert({
      where: {
        gameName_tagLine_region: { gameName, tagLine, region },
      },
      update: {
        searchCount: { increment: 1 },
        lastSearched: new Date(),
      },
      create: {
        gameName,
        tagLine,
        region,
        searchCount: 1,
        lastSearched: new Date(),
      },
    });
  } catch (error) {
    console.error('⚠️ Search history write error:', error);
  }
}

/**
 * Returns the most recent searches, ordered by lastSearched desc.
 */
export async function getSearchHistory(limit: number = 20): Promise<SearchHistoryEntry[]> {
  try {
    const entries = await prisma.searchHistory.findMany({
      orderBy: { lastSearched: 'desc' },
      take: limit,
    });

    return entries.map((entry) => ({
      id: entry.id,
      gameName: entry.gameName,
      tagLine: entry.tagLine,
      region: entry.region,
      searchCount: entry.searchCount,
      lastSearched: entry.lastSearched.toISOString(),
    }));
  } catch (error) {
    console.error('⚠️ Search history read error:', error);
    return [];
  }
}
