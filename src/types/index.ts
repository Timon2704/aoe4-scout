// AoE4 World API Types
export interface Mode {
  rating?: number;
  max_rating?: number;
  rank?: number;
  rank_level?: string;
  streak?: number;
  games_count?: number;
  wins_count?: number;
  losses_count?: number;
  win_rate?: number;
  last_game_at?: string;
}

export interface Player {
  profile_id: number;
  name: string;
  rating: number;
  rank: number;
  wins: number;
  losses: number;
  win_rate: number;
  games_count: number;
  last_game_at: string;
  country?: string;
  social?: {
    twitch?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
  };
  avatars?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  modes?: {
    rm_solo?: Mode;
    rm_team?: Mode;
    rm_1v1_elo?: Mode;
    rm_2v2_elo?: Mode;
    rm_3v3_elo?: Mode;
    rm_4v4_elo?: Mode;
    qm_1v1?: Mode;
    qm_2v2?: Mode;
    qm_3v3?: Mode;
    qm_4v4?: Mode;
  };
}

export interface Game {
  game_id: string;
  started_at: string;
  updated_at: string;
  duration: number;
  map: string;
  kind: 'rm_1v1' | 'rm_2v2' | 'rm_3v3' | 'rm_4v4' | 'rm_team';
  leaderboard: string;
  season: number;
  server: string;
  patch: number;
  average_rating: number;
  ongoing: boolean;
  just_finished: boolean;
  teams: Team[];
}

export interface Team {
  winner: boolean;
  players: TeamPlayer[];
}

export interface TeamPlayer {
  profile_id: number;
  name: string;
  rating: number;
  rating_diff?: number;
  civilization: Civilization;
  color: number;
  team: number;
  player?: Player; // Extended player info
}

export type Civilization = 
  | 'english'
  | 'french'
  | 'holy_roman_empire'
  | 'chinese'
  | 'delhi_sultanate'
  | 'mongols'
  | 'rus'
  | 'abbasid_dynasty'
  | 'malians'
  | 'ottomans'
  | 'byzantines'
  | 'japanese'
  | 'jeanne_darc'
  | 'ayyubids'
  | 'zhu_xis_legacy'
  | 'order_of_the_dragon'
  | 'knights_templar'
  | 'house_of_lancaster';

export interface LeaderboardEntry {
  rank: number;
  rating: number;
  profile_id: number;
  name: string;
  games_count: number;
  wins: number;
  losses: number;
  win_rate: number;
  last_game_at: string;
}

export interface PlayerGamesResponse {
  games: Game[];
  total: number;
  page: number;
  per_page: number;
}

export interface TeamAnalysisData {
  teammate_id: number;
  teammate_name: string;
  games_together: number;
  wins_together: number;
  win_rate: number;
  last_played: string;
}

export interface ProfileData {
  url: string;
  profile_id: number;
  name: string;
}

// UI State Types
export interface AppState {
  profile: ProfileData | null;
  currentGame: Game | null;
  isPolling: boolean;
  error: string | null;
}
