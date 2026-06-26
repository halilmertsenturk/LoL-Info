import type { RegionOption, RankTier } from '../types';

// ===== Data Dragon =====
const DD_VERSION = '15.1.1';
const DD_BASE = `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}`;

export function getProfileIconUrl(iconId: number): string {
  return `${DD_BASE}/img/profileicon/${iconId}.png`;
}

export function getChampionIconUrl(championName: string): string {
  return `${DD_BASE}/img/champion/${championName}.png`;
}

export function getItemIconUrl(itemId: number): string {
  if (itemId === 0) return '';
  return `${DD_BASE}/img/item/${itemId}.png`;
}

export function getSummonerSpellIconUrl(spellId: number): string {
  const spellMap: Record<number, string> = {
    1: 'SummonerBoost',
    3: 'SummonerExhaust',
    4: 'SummonerFlash',
    6: 'SummonerHaste',
    7: 'SummonerHeal',
    11: 'SummonerSmite',
    12: 'SummonerTeleport',
    13: 'SummonerMana',
    14: 'SummonerDot',
    21: 'SummonerBarrier',
    30: 'SummonerPoroRecall',
    31: 'SummonerPoroThrow',
    32: 'SummonerSnowball',
    39: 'SummonerSnowURFSnowball_Mark',
    54: 'Summoner_UltBookPlaceholder',
    55: 'Summoner_UltBookSmitePlaceholder',
  };
  const name = spellMap[spellId] || 'SummonerFlash';
  return `${DD_BASE}/img/spell/${name}.png`;
}

// ===== Champion ID → Name Mapping =====
// Common champion mappings (ID → DataDragon name)
const CHAMPION_ID_MAP: Record<number, string> = {
  1: 'Annie', 2: 'Olaf', 3: 'Galio', 4: 'TwistedFate', 5: 'XinZhao',
  6: 'Urgot', 7: 'LeBlanc', 8: 'Vladimir', 9: 'Fiddlesticks', 10: 'Kayle',
  11: 'MasterYi', 12: 'Alistar', 13: 'Ryze', 14: 'Sion', 15: 'Sivir',
  16: 'Soraka', 17: 'Teemo', 18: 'Tristana', 19: 'Warwick', 20: 'Nunu',
  21: 'MissFortune', 22: 'Ashe', 23: 'Tryndamere', 24: 'Jax', 25: 'Morgana',
  26: 'Zilean', 27: 'Singed', 28: 'Evelynn', 29: 'Twitch', 30: 'Karthus',
  31: 'Chogath', 32: 'Amumu', 33: 'Rammus', 34: 'Anivia', 35: 'Shaco',
  36: 'DrMundo', 37: 'Sona', 38: 'Kassadin', 39: 'Irelia', 40: 'Janna',
  41: 'Gangplank', 42: 'Corki', 43: 'Karma', 44: 'Taric', 45: 'Veigar',
  48: 'Trundle', 50: 'Swain', 51: 'Caitlyn', 53: 'Blitzcrank', 54: 'Malphite',
  55: 'Katarina', 56: 'Nocturne', 57: 'Maokai', 58: 'Renekton', 59: 'JarvanIV',
  60: 'Elise', 61: 'Orianna', 62: 'MonkeyKing', 63: 'Brand', 64: 'LeeSin',
  67: 'Vayne', 68: 'Rumble', 69: 'Cassiopeia', 72: 'Skarner', 74: 'Heimerdinger',
  75: 'Nasus', 76: 'Nidalee', 77: 'Udyr', 78: 'Poppy', 79: 'Gragas',
  80: 'Pantheon', 81: 'Ezreal', 82: 'Mordekaiser', 83: 'Yorick', 84: 'Akali',
  85: 'Kennen', 86: 'Garen', 89: 'Leona', 90: 'Malzahar', 91: 'Talon',
  92: 'Riven', 96: 'KogMaw', 98: 'Shen', 99: 'Lux', 101: 'Xerath',
  102: 'Shyvana', 103: 'Ahri', 104: 'Graves', 105: 'Fizz', 106: 'Volibear',
  107: 'Rengar', 110: 'Varus', 111: 'Nautilus', 112: 'Viktor', 113: 'Sejuani',
  114: 'Fiora', 115: 'Ziggs', 117: 'Lulu', 119: 'Draven', 120: 'Hecarim',
  121: 'Khazix', 122: 'Darius', 126: 'Jayce', 127: 'Lissandra', 131: 'Diana',
  133: 'Quinn', 134: 'Syndra', 136: 'AurelionSol', 141: 'Kayn', 142: 'Zoe',
  143: 'Zyra', 145: 'Kaisa', 147: 'Seraphine', 150: 'Gnar', 154: 'Zac',
  157: 'Yasuo', 161: 'VelKoz', 163: 'Taliyah', 164: 'Camille', 166: 'Akshan',
  200: 'Belveth', 201: 'Braum', 202: 'Jhin', 203: 'Kindred', 221: 'Zeri',
  222: 'Jinx', 223: 'TahmKench', 233: 'Briar', 234: 'Viego', 235: 'Senna',
  236: 'Lucian', 238: 'Zed', 240: 'Kled', 245: 'Ekko', 246: 'Qiyana',
  254: 'Vi', 266: 'Aatrox', 267: 'Nami', 268: 'Azir', 350: 'Yuumi',
  360: 'Samira', 412: 'Thresh', 420: 'Illaoi', 421: 'RekSai', 427: 'Ivern',
  429: 'Kalista', 432: 'Bard', 497: 'Rakan', 498: 'Xayah', 516: 'Ornn',
  517: 'Sylas', 518: 'Neeko', 523: 'Aphelios', 526: 'Rell', 555: 'Pyke',
  711: 'Vex', 777: 'Yone', 799: 'Ambessa', 875: 'Sett', 876: 'Lillia',
  887: 'Gwen', 888: 'Renata', 893: 'Aurora', 895: 'Nilah', 897: 'KSante',
  901: 'Smolder', 902: 'Milio', 910: 'Hwei', 950: 'Naafiri',
};

export function getChampionNameById(championId: number): string {
  return CHAMPION_ID_MAP[championId] || `Champion${championId}`;
}

export function getChampionIconById(championId: number): string {
  const name = getChampionNameById(championId);
  return getChampionIconUrl(name);
}

// ===== Formatting =====
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function formatGameDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

// ===== KDA =====
export function calculateKDA(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) return 'Perfect';
  return ((kills + assists) / deaths).toFixed(2);
}

export function getKDAColor(kda: number): string {
  if (kda >= 5) return '#f0c75e';
  if (kda >= 4) return '#22c55e';
  if (kda >= 3) return '#0ac8b9';
  if (kda >= 2) return '#e2e8f0';
  return '#94a3b8';
}

// ===== CS =====
export function calculateCSPerMin(cs: number, durationSeconds: number): string {
  if (durationSeconds === 0) return '0.0';
  return (cs / (durationSeconds / 60)).toFixed(1);
}

// ===== Win Rate =====
export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

// ===== Rank =====
export function getRankDisplay(tier: RankTier, rank: string): string {
  const noDiv = ['MASTER', 'GRANDMASTER', 'CHALLENGER'];
  if (noDiv.includes(tier)) {
    return capitalize(tier);
  }
  return `${capitalize(tier)} ${rank}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getRankColor(tier: RankTier): string {
  const colors: Record<RankTier, string> = {
    IRON: '#6b6b6b',
    BRONZE: '#a0673f',
    SILVER: '#8a9bae',
    GOLD: '#c89b3c',
    PLATINUM: '#2a9d8f',
    EMERALD: '#22c55e',
    DIAMOND: '#576cce',
    MASTER: '#9b59b6',
    GRANDMASTER: '#e74c3c',
    CHALLENGER: '#f0c75e',
  };
  return colors[tier] || '#94a3b8';
}

export function getQueueName(queueType: string): string {
  const names: Record<string, string> = {
    RANKED_SOLO_5x5: 'Ranked Solo/Duo',
    RANKED_FLEX_SR: 'Ranked Flex',
    RANKED_TFT: 'TFT Ranked',
    RANKED_TFT_DOUBLE_UP: 'TFT Double Up',
    RANKED_TFT_TURBO: 'TFT Hyper Roll',
  };
  return names[queueType] || queueType;
}

export function getQueueNameById(queueId: number): string {
  const names: Record<number, string> = {
    400: 'Normal Draft',
    420: 'Ranked Solo/Duo',
    430: 'Normal Blind',
    440: 'Ranked Flex',
    450: 'ARAM',
    700: 'Clash',
    830: 'Co-op vs AI Intro',
    840: 'Co-op vs AI Beginner',
    850: 'Co-op vs AI Intermediate',
    900: 'URF',
    1020: 'One for All',
    1090: 'TFT Normal',
    1100: 'TFT Ranked',
    1130: 'TFT Hyper Roll',
    1160: 'TFT Double Up',
    1300: 'Nexus Blitz',
    1400: 'Ultimate Spellbook',
    1700: 'Arena',
    1900: 'Pick URF',
  };
  return names[queueId] || `Queue ${queueId}`;
}

// ===== Placement =====
export function getPlacementColor(placement: number): string {
  if (placement === 1) return '#f0c75e';
  if (placement === 2) return '#c0c0c0';
  if (placement === 3) return '#cd7f32';
  if (placement <= 4) return '#22c55e';
  if (placement <= 6) return '#e2e8f0';
  return '#ef4444';
}

export function getPlacementLabel(placement: number): string {
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' };
  const suffix = suffixes[placement] || 'th';
  return `${placement}${suffix}`;
}

export function isTopFour(placement: number): boolean {
  return placement <= 4;
}

// ===== Regions =====
export const REGIONS: RegionOption[] = [
  { value: 'na1', label: 'North America', shortLabel: 'NA' },
  { value: 'euw1', label: 'Europe West', shortLabel: 'EUW' },
  { value: 'eun1', label: 'Europe Nordic & East', shortLabel: 'EUNE' },
  { value: 'kr', label: 'Korea', shortLabel: 'KR' },
  { value: 'jp1', label: 'Japan', shortLabel: 'JP' },
  { value: 'br1', label: 'Brazil', shortLabel: 'BR' },
  { value: 'la1', label: 'Latin America North', shortLabel: 'LAN' },
  { value: 'la2', label: 'Latin America South', shortLabel: 'LAS' },
  { value: 'oc1', label: 'Oceania', shortLabel: 'OCE' },
  { value: 'tr1', label: 'Turkey', shortLabel: 'TR' },
  { value: 'ru', label: 'Russia', shortLabel: 'RU' },
  { value: 'ph2', label: 'Philippines', shortLabel: 'PH' },
  { value: 'sg2', label: 'Singapore', shortLabel: 'SG' },
  { value: 'th2', label: 'Thailand', shortLabel: 'TH' },
  { value: 'tw2', label: 'Taiwan', shortLabel: 'TW' },
  { value: 'vn2', label: 'Vietnam', shortLabel: 'VN' },
];

export function getRegionLabel(regionValue: string): string {
  const region = REGIONS.find((r) => r.value === regionValue);
  return region?.shortLabel || regionValue.toUpperCase();
}
