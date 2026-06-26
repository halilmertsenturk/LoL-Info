import { PlatformId, RoutingValue, RegionMapping, ApiError } from '../types/index';

const REGION_MAP: Record<string, RegionMapping> = {
  tr1:  { platformId: 'tr1',  routing: 'europe' },
  euw1: { platformId: 'euw1', routing: 'europe' },
  eun1: { platformId: 'eun1', routing: 'europe' },
  na1:  { platformId: 'na1',  routing: 'americas' },
  kr:   { platformId: 'kr',   routing: 'asia' },
  jp1:  { platformId: 'jp1',  routing: 'asia' },
  br1:  { platformId: 'br1',  routing: 'americas' },
  la1:  { platformId: 'la1',  routing: 'americas' },
  la2:  { platformId: 'la2',  routing: 'americas' },
  oc1:  { platformId: 'oc1',  routing: 'sea' },
  ru:   { platformId: 'ru',   routing: 'europe' },
  ph2:  { platformId: 'ph2',  routing: 'sea' },
  sg2:  { platformId: 'sg2',  routing: 'sea' },
  th2:  { platformId: 'th2',  routing: 'sea' },
  tw2:  { platformId: 'tw2',  routing: 'sea' },
  vn2:  { platformId: 'vn2',  routing: 'sea' },
};

// Friendly aliases that map common region names to platform IDs
const REGION_ALIASES: Record<string, string> = {
  tr: 'tr1',
  euw: 'euw1',
  eun: 'eun1',
  eune: 'eun1',
  na: 'na1',
  kr: 'kr',
  jp: 'jp1',
  br: 'br1',
  lan: 'la1',
  las: 'la2',
  oce: 'oc1',
  oc: 'oc1',
  ru: 'ru',
  ph: 'ph2',
  sg: 'sg2',
  th: 'th2',
  tw: 'tw2',
  vn: 'vn2',
};

/**
 * Resolves a region string (platform ID or alias) into a RegionMapping.
 * Throws ApiError if the region is invalid.
 */
export function getRegionMapping(region: string): RegionMapping {
  const normalized = region.toLowerCase().trim();

  // Direct platform ID match
  if (REGION_MAP[normalized]) {
    return REGION_MAP[normalized];
  }

  // Alias match
  const aliasKey = REGION_ALIASES[normalized];
  if (aliasKey && REGION_MAP[aliasKey]) {
    return REGION_MAP[aliasKey];
  }

  throw new ApiError(
    `Invalid region "${region}". Valid regions: ${Object.keys(REGION_MAP).join(', ')}`,
    400
  );
}

/**
 * Returns the platform API host (e.g. "tr1.api.riotgames.com")
 */
export function getPlatformHost(platformId: PlatformId): string {
  return `${platformId}.api.riotgames.com`;
}

/**
 * Returns the routing API host (e.g. "europe.api.riotgames.com")
 */
export function getRoutingHost(routing: RoutingValue): string {
  return `${routing}.api.riotgames.com`;
}

/**
 * Returns the list of all valid region keys
 */
export function getValidRegions(): string[] {
  return Object.keys(REGION_MAP);
}
