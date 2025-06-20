// API Configuration
export const API_BASE_URL = 'https://aoe4world.com/api/v0';
export const POLLING_INTERVAL = 10000; // 10 seconds
export const COOKIE_NAME = 'aoe4_scout_profile';
export const COOKIE_EXPIRY_DAYS = 365;

// Civilization Display Names
export const CIVILIZATION_NAMES: Record<string, string> = {
  english: 'English',
  french: 'French',
  holy_roman_empire: 'Holy Roman Empire',
  chinese: 'Chinese',
  delhi_sultanate: 'Delhi Sultanate',
  mongols: 'Mongols',
  rus: 'Rus',
  abbasid_dynasty: 'Abbasid Dynasty',
  malians: 'Malians',
  ottomans: 'Ottomans',
  byzantines: 'Byzantines',
  japanese: 'Japanese',
  jeanne_darc: 'Jeanne d\'Arc',
  ayyubids: 'Ayyubids',
  zhu_xis_legacy: 'Zhu Xi\'s Legacy',
  order_of_the_dragon: 'Order of the Dragon',
  knights_templar: 'Knights Templar',
  house_of_lancaster: 'House of Lancaster'
};

// Civilization Flag Mapping (to asset files)
export const CIVILIZATION_FLAG_MAP: Record<string, string> = {
  english: 'en',
  french: 'fr',
  holy_roman_empire: 'hr',
  chinese: 'ch',
  delhi_sultanate: 'de',
  mongols: 'mo',
  rus: 'ru',
  abbasid_dynasty: 'ab',
  malians: 'ma',
  ottomans: 'ot',
  byzantines: 'by',
  japanese: 'ja',
  jeanne_darc: 'je',
  ayyubids: 'ay',
  zhu_xis_legacy: 'zx',
  order_of_the_dragon: 'od',
  knights_templar: 'kt',
  house_of_lancaster: 'hl'
};

// Civilization Colors (for CSS classes)
export const CIVILIZATION_COLORS: Record<string, string> = {
  english: '#DC2626', // red-600
  french: '#2563EB', // blue-600
  holy_roman_empire: '#FACC15', // yellow-400
  chinese: '#EF4444', // red-500
  delhi_sultanate: '#10B981', // emerald-500
  mongols: '#8B5CF6', // violet-500
  rus: '#059669', // emerald-600
  abbasid_dynasty: '#F59E0B', // amber-500
  malians: '#D97706', // amber-600
  ottomans: '#7C3AED', // violet-600
  byzantines: '#9333EA', // purple-600
  japanese: '#EC4899', // pink-500
  jeanne_darc: '#3B82F6', // blue-500
  ayyubids: '#14B8A6', // teal-500
  zhu_xis_legacy: '#F43F5E', // rose-500
  order_of_the_dragon: '#6366F1', // indigo-500
  knights_templar: '#E11D48', // rose-600
  house_of_lancaster: '#BE185D' // pink-700
};

// Map Display Names
export const MAP_NAMES: Record<string, string> = {
  'dry_arabia': 'Dry Arabia',
  'lipany': 'Lipany',
  'high_view': 'High View',
  'mountain_clearing': 'Mountain Clearing',
  'ancient_spires': 'Ancient Spires',
  'danube_river': 'Danube River',
  'black_forest': 'Black Forest',
  'mongolian_heights': 'Mongolian Heights',
  'altai': 'Altai',
  'confluence': 'Confluence',
  'french_pass': 'French Pass',
  'hill_and_dale': 'Hill and Dale',
  'king_of_the_hill': 'King of the Hill',
  'warring_islands': 'Warring Islands',
  'archipelago': 'Archipelago',
  'nagari': 'Nagari',
  'boulder_bay': 'Boulder Bay',
  'prairie': 'Prairie',
  'alpine_lakes': 'Alpine Lakes',
  'wetlands': 'Wetlands',
  'oasis': 'Oasis',
  'hideout': 'Hideout',
  'golden_heights': 'Golden Heights',
  'four_lakes': 'Four Lakes',
  'forts': 'Forts',
  'rocky_river': 'Rocky River',
  'cliffside': 'Cliffside',
  'golden_pit': 'Golden Pit',
  'migration': 'Migration',
  'volcanic_island': 'Volcanic Island'
};

// Game Mode Display Names
export const GAME_MODE_NAMES: Record<string, string> = {
  'rm_1v1': '1v1 Ranked',
  'rm_2v2': '2v2 Ranked',
  'rm_3v3': '3v3 Ranked',
  'rm_4v4': '4v4 Ranked',
  'rm_team': 'Team Ranked'
};

// Rank Level Display Names
export const RANK_LEVEL_NAMES: Record<string, string> = {
  'bronze_1': 'Bronze I',
  'bronze_2': 'Bronze II',
  'bronze_3': 'Bronze III',
  'silver_1': 'Silver I',
  'silver_2': 'Silver II',
  'silver_3': 'Silver III',
  'gold_1': 'Gold I',
  'gold_2': 'Gold II',
  'gold_3': 'Gold III',
  'platinum_1': 'Platinum I',
  'platinum_2': 'Platinum II',
  'platinum_3': 'Platinum III',
  'diamond_1': 'Diamond I',
  'diamond_2': 'Diamond II',
  'diamond_3': 'Diamond III',
  'conqueror_1': 'Conqueror I',
  'conqueror_2': 'Conqueror II',
  'conqueror_3': 'Conqueror III',
};

// Rating Tiers
export const RATING_TIERS = [
  { min: 0, max: 599, name: 'Bronze I', color: '#CD7F32' },
  { min: 600, max: 699, name: 'Bronze II', color: '#CD7F32' },
  { min: 700, max: 799, name: 'Bronze III', color: '#CD7F32' },
  { min: 800, max: 899, name: 'Silver I', color: '#C0C0C0' },
  { min: 900, max: 999, name: 'Silver II', color: '#C0C0C0' },
  { min: 1000, max: 1099, name: 'Silver III', color: '#C0C0C0' },
  { min: 1100, max: 1199, name: 'Gold I', color: '#FFD700' },
  { min: 1200, max: 1299, name: 'Gold II', color: '#FFD700' },
  { min: 1300, max: 1399, name: 'Gold III', color: '#FFD700' },
  { min: 1400, max: 1499, name: 'Platinum I', color: '#E5E4E2' },
  { min: 1500, max: 1599, name: 'Platinum II', color: '#E5E4E2' },
  { min: 1600, max: 1699, name: 'Platinum III', color: '#E5E4E2' },
  { min: 1700, max: 1799, name: 'Diamond I', color: '#B9F2FF' },
  { min: 1800, max: 1899, name: 'Diamond II', color: '#B9F2FF' },
  { min: 1900, max: 1999, name: 'Diamond III', color: '#B9F2FF' },
  { min: 2000, max: 9999, name: 'Conqueror', color: '#FF6B6B' }
];

export function getRatingTier(rating: number) {
  return RATING_TIERS.find(tier => rating >= tier.min && rating <= tier.max) || RATING_TIERS[0];
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export const getRankBadgeUrl = (rankLevel?: string, mode: 'solo' | 'team' = 'solo'): string => {
  if (!rankLevel) {
    return `/src/assets/badges/${mode}_unranked.svg`;
  }
  const formattedRank = rankLevel.toLowerCase().replace(/ /g, '_');
  return `/src/assets/badges/${mode}_${formattedRank}.svg`;
};

export function formatTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}
