// ===== Region Types =====
export type Region =
  | 'br1'
  | 'eun1'
  | 'euw1'
  | 'jp1'
  | 'kr'
  | 'la1'
  | 'la2'
  | 'na1'
  | 'oc1'
  | 'ph2'
  | 'ru'
  | 'sg2'
  | 'th2'
  | 'tr1'
  | 'tw2'
  | 'vn2';

export interface RegionOption {
  value: Region;
  label: string;
  shortLabel: string;
}

// ===== Summoner / Account =====
export interface SummonerProfile {
  puuid: string;
  gameName: string;
  tagLine: string;
  summonerLevel: number;
  profileIconId: number;
}

// ===== Ranked =====
export type RankTier =
  | 'IRON'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'EMERALD'
  | 'DIAMOND'
  | 'MASTER'
  | 'GRANDMASTER'
  | 'CHALLENGER';

export type RankDivision = 'I' | 'II' | 'III' | 'IV';

export interface RankedEntry {
  queueType: string;
  tier: RankTier;
  rank: RankDivision;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

// ===== Champion Mastery =====
export interface ChampionMasteryEntry {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  tokensEarned: number;
}

// ===== Match History (LoL) =====
export interface MatchParticipant {
  puuid: string;
  summonerName: string;
  riotIdGameName: string;
  riotIdTagline: string;
  championId: number;
  championName: string;
  champLevel: number;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  visionScore: number;
  wardsPlaced: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
  win: boolean;
  teamId: number;
  role: string;
  lane: string;
  individualPosition: string;
  teamPosition: string;
  perks?: {
    styles: Array<{
      style: number;
      selections: Array<{ perk: number }>;
    }>;
  };
}

export interface MatchInfo {
  gameCreation: number;
  gameDuration: number;
  gameMode: string;
  gameType: string;
  queueId: number;
  participants: MatchParticipant[];
}

export interface MatchData {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: MatchInfo;
}

// ===== TFT =====
export interface TFTRankedEntry {
  queueType: string;
  tier: RankTier;
  rank: RankDivision;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface TFTUnit {
  character_id: string;
  name: string;
  rarity: number;
  tier: number;
  itemNames: string[];
  items: number[];
}

export interface TFTTrait {
  name: string;
  num_units: number;
  style: number;
  tier_current: number;
  tier_total: number;
}

export interface TFTMatchParticipant {
  puuid: string;
  placement: number;
  level: number;
  last_round: number;
  gold_left: number;
  players_eliminated: number;
  total_damage_to_players: number;
  time_eliminated: number;
  units: TFTUnit[];
  traits: TFTTrait[];
  augments: string[];
  companion: {
    content_ID: string;
    species: string;
    skin_ID: number;
  };
}

export interface TFTMatchInfo {
  game_datetime: number;
  game_length: number;
  game_version: string;
  queue_id: number;
  tft_game_type: string;
  tft_set_number: number;
  tft_set_core_name: string;
  participants: TFTMatchParticipant[];
}

export interface TFTMatchData {
  metadata: {
    match_id: string;
    participants: string[];
  };
  info: TFTMatchInfo;
}

// ===== API Response Types =====
export interface PlayerProfile {
  summoner: SummonerProfile;
  ranked: RankedEntry[];
  championMastery: ChampionMasteryEntry[];
  matches: MatchData[];
}

export interface TFTProfile {
  ranked: TFTRankedEntry[];
  matches: TFTMatchData[];
}

export interface SearchHistoryEntry {
  gameName: string;
  tagLine: string;
  region: Region;
  timestamp: number;
  profileIconId?: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// ===== Champion Data Dragon Mapping =====
export interface ChampionDataEntry {
  id: string;
  key: string;
  name: string;
}

export type ChampionMap = Record<string, ChampionDataEntry>;
