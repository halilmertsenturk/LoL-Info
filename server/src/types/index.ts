// ==========================================
// Riot API Response Types
// ==========================================

export interface RiotAccountDto {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface SummonerDto {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface LeagueEntryDto {
  leagueId: string;
  summonerId: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  miniSeries?: MiniSeriesDto;
}

export interface MiniSeriesDto {
  losses: number;
  progress: string;
  target: number;
  wins: number;
}

export interface ChampionMasteryDto {
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  tokensEarned: number;
  markRequiredForNextLevel: number;
  championSeasonMilestone: number;
  milestoneGrades?: string[];
}

export interface MatchDto {
  metadata: MatchMetadataDto;
  info: MatchInfoDto;
}

export interface MatchMetadataDto {
  dataVersion: string;
  matchId: string;
  participants: string[];
}

export interface MatchInfoDto {
  endOfGameResult: string;
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: ParticipantDto[];
  platformId: string;
  queueId: number;
  teams: TeamDto[];
  tournamentCode?: string;
}

export interface ParticipantDto {
  assists: number;
  baronKills: number;
  bountyLevel: number;
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  deaths: number;
  doubleKills: number;
  dragonKills: number;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInSurrender: boolean;
  goldEarned: number;
  goldSpent: number;
  individualPosition: string;
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  kills: number;
  lane: string;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  neutralMinionsKilled: number;
  participantId: number;
  pentaKills: number;
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  profileIcon: number;
  puuid: string;
  quadraKills: number;
  riotIdGameName: string;
  riotIdTagline: string;
  role: string;
  sightWardsBoughtInGame: number;
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: boolean;
  teamId: number;
  teamPosition: string;
  timeCCingOthers: number;
  timePlayed: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

export interface TeamDto {
  bans: BanDto[];
  objectives: ObjectivesDto;
  teamId: number;
  win: boolean;
}

export interface BanDto {
  championId: number;
  pickTurn: number;
}

export interface ObjectivesDto {
  baron: ObjectiveDto;
  champion: ObjectiveDto;
  dragon: ObjectiveDto;
  horde: ObjectiveDto;
  inhibitor: ObjectiveDto;
  riftHerald: ObjectiveDto;
  tower: ObjectiveDto;
}

export interface ObjectiveDto {
  first: boolean;
  kills: number;
}

// ==========================================
// TFT Types
// ==========================================

export interface TftLeagueEntryDto {
  leagueId: string;
  summonerId: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  miniSeries?: MiniSeriesDto;
}

export interface TftMatchDto {
  metadata: TftMatchMetadataDto;
  info: TftMatchInfoDto;
}

export interface TftMatchMetadataDto {
  data_version: string;
  match_id: string;
  participants: string[];
}

export interface TftMatchInfoDto {
  endOfGameResult: string;
  gameCreation: number;
  game_datetime: number;
  game_length: number;
  game_version: string;
  mapId: number;
  participants: TftParticipantDto[];
  queueId: number;
  queue_id: number;
  tft_game_type: string;
  tft_set_core_name: string;
  tft_set_number: number;
}

export interface TftParticipantDto {
  augments: string[];
  companion: TftCompanionDto;
  gold_left: number;
  last_round: number;
  level: number;
  placement: number;
  players_eliminated: number;
  puuid: string;
  time_eliminated: number;
  total_damage_to_players: number;
  traits: TftTraitDto[];
  units: TftUnitDto[];
}

export interface TftCompanionDto {
  content_ID: string;
  item_ID: number;
  skin_ID: number;
  species: string;
}

export interface TftTraitDto {
  name: string;
  num_units: number;
  style: number;
  tier_current: number;
  tier_total: number;
}

export interface TftUnitDto {
  character_id: string;
  itemNames: string[];
  name: string;
  rarity: number;
  tier: number;
}

// ==========================================
// API Response Types
// ==========================================

export interface PlayerProfile {
  summoner: SummonerProfile;
  ranked: RankedInfo[];
  mastery: ChampionMasteryInfo[];
  matches: MatchSummary[];
  cachedAt: string;
}

export interface SummonerProfile {
  puuid: string;
  summonerId: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  profileIconUrl: string;
  summonerLevel: number;
}

export interface RankedInfo {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
  hotStreak: boolean;
  miniSeries?: MiniSeriesDto;
}

export interface ChampionMasteryInfo {
  championId: number;
  championName: string;
  championIconUrl: string;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
}

export interface MatchSummary {
  matchId: string;
  gameMode: string;
  gameCreation: number;
  gameDuration: number;
  queueId: number;
  participant: ParticipantSummary;
  teams: TeamDto[];
}

export interface ParticipantSummary {
  championName: string;
  championId: number;
  champLevel: number;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  totalMinionsKilled: number;
  csPerMinute: number;
  goldEarned: number;
  visionScore: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
  teamPosition: string;
  win: boolean;
  totalDamageDealtToChampions: number;
  wardsPlaced: number;
  wardsKilled: number;
}

export interface TftProfile {
  ranked: TftRankedInfo[];
  matches: TftMatchSummary[];
  cachedAt: string;
}

export interface TftRankedInfo {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
  hotStreak: boolean;
}

export interface TftMatchSummary {
  matchId: string;
  gameCreation: number;
  gameDuration: number;
  gameVersion: string;
  tftSetNumber: number;
  tftGameType: string;
  participant: TftParticipantSummary;
}

export interface TftParticipantSummary {
  placement: number;
  level: number;
  goldLeft: number;
  playersEliminated: number;
  totalDamageToPlayers: number;
  timeEliminated: number;
  augments: string[];
  traits: TftTraitDto[];
  units: TftUnitDto[];
}

export interface SearchHistoryEntry {
  id: string;
  gameName: string;
  tagLine: string;
  region: string;
  searchCount: number;
  lastSearched: string;
}

// ==========================================
// Champion Data Dragon Map
// ==========================================

export interface ChampionDataDragon {
  [key: string]: {
    key: string;
    id: string;
    name: string;
  };
}

// ==========================================
// Error Types
// ==========================================

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// ==========================================
// Region Types
// ==========================================

export type PlatformId =
  | 'tr1' | 'euw1' | 'eun1' | 'na1' | 'kr' | 'jp1'
  | 'br1' | 'la1' | 'la2' | 'oc1' | 'ru'
  | 'ph2' | 'sg2' | 'th2' | 'tw2' | 'vn2';

export type RoutingValue = 'europe' | 'americas' | 'asia' | 'sea';

export interface RegionMapping {
  platformId: PlatformId;
  routing: RoutingValue;
}
