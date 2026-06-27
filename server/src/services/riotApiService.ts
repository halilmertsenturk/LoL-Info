import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  RiotAccountDto,
  SummonerDto,
  LeagueEntryDto,
  ChampionMasteryDto,
  MatchDto,
  TftLeagueEntryDto,
  TftMatchDto,
  ChampionDataDragon,
  ApiError,
  ChampionMasteryInfo,
  MatchSummary,
  ParticipantSummary,
  RankedInfo,
  SummonerProfile,
  TftRankedInfo,
  TftMatchSummary,
  TftParticipantSummary,
} from '../types/index';
import { getRegionMapping, getPlatformHost, getRoutingHost } from '../utils/regionMapper';

const DDRAGON_VERSION = '15.1.1';
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;

// In-memory champion ID-to-name map, loaded once on startup
let championIdToName: Record<number, string> = {};
let championDataLoaded = false;

/**
 * Loads champion data from Data Dragon and builds a champion ID -> name map.
 */
export async function loadChampionData(): Promise<void> {
  try {
    const url = `${DDRAGON_BASE}/data/en_US/champion.json`;
    const response = await axios.get(url, { timeout: 15000 });
    const champions = response.data.data as ChampionDataDragon;

    championIdToName = {};
    for (const champKey of Object.keys(champions)) {
      const champ = champions[champKey];
      championIdToName[parseInt(champ.key, 10)] = champ.id;
    }

    championDataLoaded = true;
    console.log(`✅ Loaded ${Object.keys(championIdToName).length} champions from Data Dragon`);
  } catch (error) {
    console.error('⚠️ Failed to load champion data from Data Dragon:', error);
    // Don't crash — champion names will fall back to "Unknown"
  }
}

/**
 * Returns champion name by ID, or "Unknown" if not loaded.
 */
export function getChampionNameById(championId: number): string {
  return championIdToName[championId] || 'Unknown';
}

/**
 * Creates an Axios instance with the Riot API key in headers.
 */
function createApiClient(): AxiosInstance {
  const apiKey = process.env.RIOT_API_KEY?.trim();
  if (!apiKey) {
    throw new ApiError('RIOT_API_KEY is not configured', 500);
  }

  return axios.create({
    timeout: 15000,
    headers: {
      'X-Riot-Token': apiKey,
      'Accept': 'application/json',
    },
  });
}

/**
 * Wraps Riot API calls with proper error handling.
 */
async function riotApiRequest<T>(url: string): Promise<T> {
  const client = createApiClient();
  console.log(`[Riot API] Requesting: ${url}`);

  try {
    const response = await client.get<T>(url);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const statusText = error.response?.statusText || 'Unknown Error';
      console.error(`[Riot API] Failed ${url} with status ${status} ${statusText}`);

      switch (status) {
        case 400:
          throw new ApiError('Bad request to Riot API', 400);
        case 401:
          throw new ApiError('Invalid Riot API key', 500);
        case 403:
          throw new ApiError('Riot API key expired or forbidden', 500);
        case 404:
          throw new ApiError('Player not found', 404);
        case 429:
          throw new ApiError('Riot API rate limit exceeded. Please try again later.', 429);
        case 500:
        case 502:
        case 503:
        case 504:
          throw new ApiError('Riot API is currently unavailable. Please try again later.', 503);
        default:
          throw new ApiError(`Riot API error: ${status} ${statusText}`, status || 500);
      }
    }
    throw new ApiError('Failed to communicate with Riot API', 500);
  }
}

// ==========================================
// Riot API Methods
// ==========================================

/**
 * Get account by Riot ID (gameName + tagLine).
 * Uses the regional routing value (europe, americas, asia, sea).
 */
export async function getAccountByRiotId(
  region: string,
  gameName: string,
  tagLine: string
): Promise<RiotAccountDto> {
  const { routing } = getRegionMapping(region);
  const host = getRoutingHost(routing);
  const encodedName = encodeURIComponent(gameName);
  const encodedTag = encodeURIComponent(tagLine);
  const url = `https://${host}/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`;

  return riotApiRequest<RiotAccountDto>(url);
}

/**
 * Get summoner by PUUID.
 * Uses the platform ID (tr1, euw1, na1, etc.).
 */
export async function getSummonerByPuuid(
  region: string,
  puuid: string
): Promise<SummonerDto> {
  const { platformId } = getRegionMapping(region);
  const host = getPlatformHost(platformId);
  const url = `https://${host}/lol/summoner/v4/summoners/by-puuid/${puuid}`;

  return riotApiRequest<SummonerDto>(url);
}

/**
 * Get league entries by summoner ID.
 */
export async function getLeagueEntries(
  region: string,
  summonerId: string
): Promise<LeagueEntryDto[]> {
  const { platformId } = getRegionMapping(region);
  const host = getPlatformHost(platformId);
  const url = `https://${host}/lol/league/v4/entries/by-summoner/${summonerId}`;

  return riotApiRequest<LeagueEntryDto[]>(url);
}

/**
 * Get top champion masteries by PUUID.
 */
export async function getChampionMasteries(
  region: string,
  puuid: string,
  count: number = 7
): Promise<ChampionMasteryDto[]> {
  const { platformId } = getRegionMapping(region);
  const host = getPlatformHost(platformId);
  const url = `https://${host}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`;

  return riotApiRequest<ChampionMasteryDto[]>(url);
}

/**
 * Get recent match IDs by PUUID.
 */
export async function getMatchIds(
  region: string,
  puuid: string,
  count: number = 20
): Promise<string[]> {
  const { routing } = getRegionMapping(region);
  const host = getRoutingHost(routing);
  const url = `https://${host}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;

  return riotApiRequest<string[]>(url);
}

/**
 * Get match details by match ID.
 */
export async function getMatchDetail(
  region: string,
  matchId: string
): Promise<MatchDto> {
  const { routing } = getRegionMapping(region);
  const host = getRoutingHost(routing);
  const url = `https://${host}/lol/match/v5/matches/${matchId}`;

  return riotApiRequest<MatchDto>(url);
}

/**
 * Get TFT league entries by summoner ID.
 */
export async function getTftLeagueEntries(
  region: string,
  summonerId: string
): Promise<TftLeagueEntryDto[]> {
  const { platformId } = getRegionMapping(region);
  const host = getPlatformHost(platformId);
  const url = `https://${host}/tft/league/v1/entries/by-summoner/${summonerId}`;

  return riotApiRequest<TftLeagueEntryDto[]>(url);
}

/**
 * Get TFT match IDs by PUUID.
 */
export async function getTftMatchIds(
  region: string,
  puuid: string,
  count: number = 20
): Promise<string[]> {
  const { routing } = getRegionMapping(region);
  const host = getRoutingHost(routing);
  const url = `https://${host}/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${count}`;

  return riotApiRequest<string[]>(url);
}

/**
 * Get TFT match detail by match ID.
 */
export async function getTftMatchDetail(
  region: string,
  matchId: string
): Promise<TftMatchDto> {
  const { routing } = getRegionMapping(region);
  const host = getRoutingHost(routing);
  const url = `https://${host}/tft/match/v1/matches/${matchId}`;

  return riotApiRequest<TftMatchDto>(url);
}

// ==========================================
// Data Transformation Helpers
// ==========================================

/**
 * Transforms raw summoner data + account info into a formatted SummonerProfile.
 */
export function transformSummonerData(
  summoner: SummonerDto,
  account: RiotAccountDto
): SummonerProfile {
  return {
    puuid: summoner.puuid,
    summonerId: summoner.id,
    gameName: account.gameName,
    tagLine: account.tagLine,
    profileIconId: summoner.profileIconId,
    profileIconUrl: `${DDRAGON_BASE}/img/profileicon/${summoner.profileIconId}.png`,
    summonerLevel: summoner.summonerLevel,
  };
}

/**
 * Transforms raw league entries into formatted RankedInfo array.
 */
export function transformRankedData(entries: LeagueEntryDto[]): RankedInfo[] {
  return entries.map((entry) => {
    const totalGames = entry.wins + entry.losses;
    const winRate = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;

    return {
      queueType: entry.queueType,
      tier: entry.tier,
      rank: entry.rank,
      leaguePoints: entry.leaguePoints,
      wins: entry.wins,
      losses: entry.losses,
      winRate,
      hotStreak: entry.hotStreak,
      miniSeries: entry.miniSeries,
    };
  });
}

/**
 * Transforms raw champion mastery data into formatted ChampionMasteryInfo array.
 */
export function transformMasteryData(
  masteries: ChampionMasteryDto[]
): ChampionMasteryInfo[] {
  return masteries.map((mastery) => {
    const championName = getChampionNameById(mastery.championId);
    return {
      championId: mastery.championId,
      championName,
      championIconUrl: `${DDRAGON_BASE}/img/champion/${championName}.png`,
      championLevel: mastery.championLevel,
      championPoints: mastery.championPoints,
      lastPlayTime: mastery.lastPlayTime,
    };
  });
}

/**
 * Transforms a single match + finds the participant's data.
 */
export function transformMatchData(
  match: MatchDto,
  puuid: string
): MatchSummary | null {
  const participant = match.info.participants.find((p) => p.puuid === puuid);
  if (!participant) return null;

  const gameDurationMinutes = match.info.gameDuration / 60;
  const kda =
    participant.deaths === 0
      ? participant.kills + participant.assists
      : parseFloat(((participant.kills + participant.assists) / participant.deaths).toFixed(2));

  const csPerMinute =
    gameDurationMinutes > 0
      ? parseFloat((participant.totalMinionsKilled / gameDurationMinutes).toFixed(1))
      : 0;

  const participantSummary: ParticipantSummary = {
    championName: participant.championName,
    championId: participant.championId,
    champLevel: participant.champLevel,
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    kda,
    totalMinionsKilled: participant.totalMinionsKilled,
    csPerMinute,
    goldEarned: participant.goldEarned,
    visionScore: participant.visionScore,
    item0: participant.item0,
    item1: participant.item1,
    item2: participant.item2,
    item3: participant.item3,
    item4: participant.item4,
    item5: participant.item5,
    item6: participant.item6,
    summoner1Id: participant.summoner1Id,
    summoner2Id: participant.summoner2Id,
    teamPosition: participant.teamPosition,
    win: participant.win,
    totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
    wardsPlaced: participant.wardsPlaced,
    wardsKilled: participant.wardsKilled,
  };

  return {
    matchId: match.metadata.matchId,
    gameMode: match.info.gameMode,
    gameCreation: match.info.gameCreation,
    gameDuration: match.info.gameDuration,
    queueId: match.info.queueId,
    participant: participantSummary,
    teams: match.info.teams,
  };
}

/**
 * Fetches and transforms multiple matches concurrently, with controlled parallelism.
 */
export async function fetchAndTransformMatches(
  region: string,
  puuid: string,
  matchIds: string[]
): Promise<MatchSummary[]> {
  const BATCH_SIZE = 5;
  const results: MatchSummary[] = [];

  for (let i = 0; i < matchIds.length; i += BATCH_SIZE) {
    const batch = matchIds.slice(i, i + BATCH_SIZE);
    const matchPromises = batch.map(async (matchId) => {
      try {
        const matchDetail = await getMatchDetail(region, matchId);
        return transformMatchData(matchDetail, puuid);
      } catch (error) {
        console.warn(`⚠️ Failed to fetch match ${matchId}:`, error instanceof Error ? error.message : error);
        return null;
      }
    });

    const batchResults = await Promise.all(matchPromises);
    for (const result of batchResults) {
      if (result) results.push(result);
    }
  }

  return results;
}

/**
 * Transforms TFT league entries into formatted TftRankedInfo array.
 */
export function transformTftRankedData(entries: TftLeagueEntryDto[]): TftRankedInfo[] {
  return entries.map((entry) => {
    const totalGames = entry.wins + entry.losses;
    const winRate = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;

    return {
      queueType: entry.queueType,
      tier: entry.tier,
      rank: entry.rank,
      leaguePoints: entry.leaguePoints,
      wins: entry.wins,
      losses: entry.losses,
      winRate,
      hotStreak: entry.hotStreak,
    };
  });
}

/**
 * Transforms a single TFT match + finds the participant's data.
 */
export function transformTftMatchData(
  match: TftMatchDto,
  puuid: string
): TftMatchSummary | null {
  const participant = match.info.participants.find((p) => p.puuid === puuid);
  if (!participant) return null;

  const participantSummary: TftParticipantSummary = {
    placement: participant.placement,
    level: participant.level,
    goldLeft: participant.gold_left,
    playersEliminated: participant.players_eliminated,
    totalDamageToPlayers: participant.total_damage_to_players,
    timeEliminated: participant.time_eliminated,
    augments: participant.augments,
    traits: participant.traits,
    units: participant.units,
  };

  return {
    matchId: match.metadata.match_id,
    gameCreation: match.info.gameCreation || match.info.game_datetime,
    gameDuration: match.info.game_length,
    gameVersion: match.info.game_version,
    tftSetNumber: match.info.tft_set_number,
    tftGameType: match.info.tft_game_type,
    participant: participantSummary,
  };
}

/**
 * Fetches and transforms multiple TFT matches concurrently.
 */
export async function fetchAndTransformTftMatches(
  region: string,
  puuid: string,
  matchIds: string[]
): Promise<TftMatchSummary[]> {
  const BATCH_SIZE = 5;
  const results: TftMatchSummary[] = [];

  for (let i = 0; i < matchIds.length; i += BATCH_SIZE) {
    const batch = matchIds.slice(i, i + BATCH_SIZE);
    const matchPromises = batch.map(async (matchId) => {
      try {
        const matchDetail = await getTftMatchDetail(region, matchId);
        return transformTftMatchData(matchDetail, puuid);
      } catch (error) {
        console.warn(`⚠️ Failed to fetch TFT match ${matchId}:`, error instanceof Error ? error.message : error);
        return null;
      }
    });

    const batchResults = await Promise.all(matchPromises);
    for (const result of batchResults) {
      if (result) results.push(result);
    }
  }

  return results;
}
