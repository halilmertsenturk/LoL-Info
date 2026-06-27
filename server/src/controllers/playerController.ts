import { Request, Response, NextFunction } from 'express';
import { ApiError, PlayerProfile, TftProfile } from '../types/index';
import {
  getAccountByRiotId,
  getSummonerByPuuid,
  getLeagueEntries,
  getChampionMasteries,
  getMatchIds,
  getTftLeagueEntries,
  getTftMatchIds,
  transformSummonerData,
  transformRankedData,
  transformMasteryData,
  fetchAndTransformMatches,
  transformTftRankedData,
  fetchAndTransformTftMatches,
} from '../services/riotApiService';
import {
  getCachedPlayerProfile,
  getCachedPlayerProfileByName,
  cachePlayerProfile,
  getCachedTftProfile,
  getCachedTftProfileByName,
  cacheTftProfile,
  recordSearch,
  getSearchHistory,
} from '../services/cacheService';
import { getRegionMapping } from '../utils/regionMapper';

function isRiotCacheOnlyMode(): boolean {
  return process.env.RIOT_CACHE_ONLY === 'true';
}

function isRiotAuthFailure(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.message.includes('API key') ||
      error.message.includes('forbidden') ||
      error.message.includes('blocked requests') ||
      error.message.includes('proxy'))
  );
}

function sendCachedProfile(
  res: Response,
  profile: PlayerProfile,
  options: { stale?: boolean } = {}
): void {
  res.json({
    success: true,
    data: profile,
    fromCache: true,
    stale: options.stale ?? false,
  });
}

function sendCachedTftProfile(
  res: Response,
  profile: TftProfile,
  options: { stale?: boolean } = {}
): void {
  res.json({
    success: true,
    data: profile,
    fromCache: true,
    stale: options.stale ?? false,
  });
}

async function tryStaleProfileFallback(
  res: Response,
  gameName: string,
  tagLine: string,
  region: string
): Promise<boolean> {
  const staleProfile = await getCachedPlayerProfileByName(gameName, tagLine, region, {
    allowStale: true,
  });
  if (staleProfile) {
    sendCachedProfile(res, staleProfile, { stale: true });
    return true;
  }
  return false;
}

async function tryStaleTftFallback(
  res: Response,
  gameName: string,
  tagLine: string,
  region: string
): Promise<boolean> {
  const staleProfile = await getCachedTftProfileByName(gameName, tagLine, region, {
    allowStale: true,
  });
  if (staleProfile) {
    sendCachedTftProfile(res, staleProfile, { stale: true });
    return true;
  }
  return false;
}

/**
 * GET /api/player/:region/:gameName/:tagLine
 * Returns full LoL profile: summoner info, ranked stats, champion mastery, match history.
 */
export async function getPlayerProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const region = req.params.region as string;
    const gameName = req.params.gameName as string;
    const tagLine = req.params.tagLine as string;

    if (!region || !gameName || !tagLine) {
      throw new ApiError('Missing required parameters: region, gameName, tagLine', 400);
    }

    // Validate region early
    const regionMapping = getRegionMapping(region);

    // Record search history (fire-and-forget)
    recordSearch(gameName, tagLine, regionMapping.platformId).catch(() => {});

    // Step 1: Serve fresh cache without hitting Riot when possible
    const cachedByName = await getCachedPlayerProfileByName(
      gameName,
      tagLine,
      regionMapping.platformId
    );
    if (cachedByName) {
      sendCachedProfile(res, cachedByName);
      return;
    }

    if (isRiotCacheOnlyMode()) {
      if (await tryStaleProfileFallback(res, gameName, tagLine, regionMapping.platformId)) {
        return;
      }
      throw new ApiError(
        'Profile not in cache. Enable RIOT_PROXY_URL or search this player locally first to seed cache.',
        503
      );
    }

    // Step 2: Resolve Riot account to get PUUID
    let account;
    try {
      account = await getAccountByRiotId(region, gameName, tagLine);
    } catch (error) {
      if (isRiotAuthFailure(error)) {
        if (await tryStaleProfileFallback(res, gameName, tagLine, regionMapping.platformId)) {
          return;
        }
      }
      throw error;
    }

    // Step 3: Check cache
    const cached = await getCachedPlayerProfile(account.puuid, regionMapping.platformId);
    if (cached) {
      sendCachedProfile(res, cached);
      return;
    }

    // Step 4: Fetch summoner data
    const summoner = await getSummonerByPuuid(region, account.puuid);

    // Step 5: Fetch ranked, mastery, and match IDs in parallel
    const [leagueEntries, masteries, matchIds] = await Promise.all([
      getLeagueEntries(region, account.puuid),
      getChampionMasteries(region, account.puuid, 7),
      getMatchIds(region, account.puuid, 20),
    ]);

    // Step 5: Transform data
    const summonerProfile = transformSummonerData(summoner, account);
    const rankedData = transformRankedData(leagueEntries);
    const masteryData = transformMasteryData(masteries);

    // Step 7: Fetch match details (batched)
    const matchData = await fetchAndTransformMatches(region, account.puuid, matchIds);

    // Step 7: Build response
    const profile: PlayerProfile = {
      summoner: summonerProfile,
      ranked: rankedData,
      mastery: masteryData,
      matches: matchData,
      cachedAt: new Date().toISOString(),
    };

    // Step 8: Cache the result (fire-and-forget)
    cachePlayerProfile(
      account.puuid,
      regionMapping.platformId,
      account.gameName,
      account.tagLine,
      summonerProfile,
      rankedData,
      masteryData,
      matchData
    ).catch(() => {});

    res.json({
      success: true,
      data: profile,
      fromCache: false,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/player/:region/:gameName/:tagLine/tft
 * Returns TFT profile: ranked stats and match history.
 */
export async function getTftPlayerProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const region = req.params.region as string;
    const gameName = req.params.gameName as string;
    const tagLine = req.params.tagLine as string;

    if (!region || !gameName || !tagLine) {
      throw new ApiError('Missing required parameters: region, gameName, tagLine', 400);
    }

    // Validate region early
    const regionMapping = getRegionMapping(region);

    // Record search history (fire-and-forget)
    recordSearch(gameName, tagLine, regionMapping.platformId).catch(() => {});

    const cachedByName = await getCachedTftProfileByName(
      gameName,
      tagLine,
      regionMapping.platformId
    );
    if (cachedByName) {
      sendCachedTftProfile(res, cachedByName);
      return;
    }

    if (isRiotCacheOnlyMode()) {
      if (await tryStaleTftFallback(res, gameName, tagLine, regionMapping.platformId)) {
        return;
      }
      throw new ApiError(
        'TFT profile not in cache. Enable RIOT_PROXY_URL or search this player locally first to seed cache.',
        503
      );
    }

    let account;
    try {
      account = await getAccountByRiotId(region, gameName, tagLine);
    } catch (error) {
      if (isRiotAuthFailure(error)) {
        if (await tryStaleTftFallback(res, gameName, tagLine, regionMapping.platformId)) {
          return;
        }
      }
      throw error;
    }

    const cached = await getCachedTftProfile(account.puuid, regionMapping.platformId);
    if (cached) {
      sendCachedTftProfile(res, cached);
      return;
    }

    const [tftLeagueEntries, tftMatchIds] = await Promise.all([
      getTftLeagueEntries(region, account.puuid).catch(() => [] as Awaited<ReturnType<typeof getTftLeagueEntries>>),
      getTftMatchIds(region, account.puuid, 20),
    ]);

    // Step 5: Transform data
    const tftRankedData = transformTftRankedData(tftLeagueEntries);

    // Step 6: Fetch TFT match details (batched)
    const tftMatchData = await fetchAndTransformTftMatches(region, account.puuid, tftMatchIds);

    // Step 7: Build response
    const tftProfile: TftProfile = {
      ranked: tftRankedData,
      matches: tftMatchData,
      cachedAt: new Date().toISOString(),
    };

    // Step 8: Cache the result (fire-and-forget)
    cacheTftProfile(
      account.puuid,
      regionMapping.platformId,
      account.gameName,
      account.tagLine,
      tftRankedData,
      tftMatchData
    ).catch(() => {});

    res.json({
      success: true,
      data: tftProfile,
      fromCache: false,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/search/history
 * Returns recent search history.
 */
export async function getSearchHistoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const clampedLimit = Math.min(Math.max(limit, 1), 100);

    const history = await getSearchHistory(clampedLimit);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}
