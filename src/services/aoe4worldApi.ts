import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type { Player, Game, LeaderboardEntry } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Extract profile ID from aoe4world URL
export function extractProfileId(url: string): number | string | null {
  try {
    // Match numeric IDs (with optional slug), Steam IDs, or just slugs
    // Examples: 
    // - /players/12345
    // - /players/12345-PlayerName
    // - /players/12345678901234567
    const match = url.match(/players\/([0-9]+(?:-[^\/\s?#]+)?|[0-9]{17})/);
    if (!match) return null;
    
    const fullId = match[1];
    
    // If it contains a dash, extract just the numeric part
    if (fullId.includes('-')) {
      const numericPart = fullId.split('-')[0];
      return parseInt(numericPart);
    }
    
    // If it's a 17-digit Steam ID, return as string
    if (fullId.length === 17) {
      return fullId;
    }
    
    // Otherwise parse as number
    return parseInt(fullId);
  } catch {
    return null;
  }
}

// Get player details
export async function getPlayer(profileId: number | string): Promise<Player> {
  const response = await api.get<Player>(`/players/${profileId}`);
  return response.data;
}

// Get player's recent games
export async function getPlayerGames(
  profileId: number, 
  page: number = 1, 
  perPage: number = 10
): Promise<{ games: Game[]; total: number; page: number; perPage: number }> {
  const response = await api.get(`/players/${profileId}/games`, {
    params: {
      page,
      per_page: perPage
    }
  });
  return response.data;
}

// Get player's last game
export const getPlayerLastGame = async (profileId: number | string): Promise<Game | null> => {
  try {
    const response = await api.get(`/players/${profileId}/games/last`);
    // Ensure we always return null instead of undefined
    return response.data || null;
  } catch (error) {
    console.error('Error fetching last game:', error);
    return null;
  }
};

// Get leaderboard data
export async function getLeaderboard(
  leaderboard: string,
  profileId: number
): Promise<LeaderboardEntry[]> {
  const response = await api.get(`/leaderboards/${leaderboard}`, {
    params: { profile_id: profileId }
  });
  return response.data.leaderboard;
}

// Get opponent details
export async function getOpponentDetails(profileId: number): Promise<Player> {
  return getPlayer(profileId);
}

// Search for players
export async function searchPlayers(query: string): Promise<Player[]> {
  const response = await api.get<{ players: Player[] }>('/players/search', {
    params: { query }
  });
  return response.data.players || [];
}

// Get detailed game information
export async function getGame(gameId: string): Promise<Game> {
  const response = await api.get<Game>(`/games/${gameId}`);
  return response.data;
}

// Analyze team patterns from recent games
export const analyzeTeamPatterns = (games: Game[], profileId: number | string): TeamAnalysis => {
  const teammateStats: Record<string, TeammateStats> = {};
  let totalGames = 0;
  let gamesWithTeammates = 0;

  games.forEach(game => {
    if (!game.teams || !Array.isArray(game.teams)) {
      return; // Skip games without teams data
    }
    
    totalGames++;
    let foundPlayer = false;
    let playerTeamIndex = -1;

    // Find which team the player is on
    game.teams.forEach((team, teamIndex) => {
      // Each team is an array of player objects
      if (Array.isArray(team)) {
        const hasPlayer = team.some(player => 
          player && player.profile_id && player.profile_id.toString() === profileId.toString()
        );
        if (hasPlayer) {
          foundPlayer = true;
          playerTeamIndex = teamIndex;
        }
      }
    });

    if (foundPlayer && playerTeamIndex !== -1) {
      const playerTeam = game.teams[playerTeamIndex];
      
      // Check if this is a team game (more than 1 player on the team)
      if (Array.isArray(playerTeam) && playerTeam.length > 1) {
        gamesWithTeammates++;
        
        // Process each teammate
        playerTeam.forEach(player => {
          if (!player || !player.profile_id || player.profile_id.toString() === profileId.toString()) {
            return; // Skip if no player data or if it's the tracked player
          }

          const teammateId = player.profile_id.toString();
          
          if (!teammateStats[teammateId]) {
            teammateStats[teammateId] = {
              profile_id: player.profile_id,
              name: player.name || 'Unknown',
              games_together: 0,
              wins: 0,
              losses: 0,
              win_rate: 0
            };
          }

          teammateStats[teammateId].games_together++;
          
          if (player.result === 'win') {
            teammateStats[teammateId].wins++;
          } else {
            teammateStats[teammateId].losses++;
          }
          
          teammateStats[teammateId].win_rate = 
            (teammateStats[teammateId].wins / teammateStats[teammateId].games_together) * 100;
        });
      }
    }
  });

  // Convert to array and sort by games played together
  const teammates = Object.values(teammateStats)
    .sort((a, b) => b.games_together - a.games_together);

  return {
    total_games_analyzed: totalGames,
    games_with_teammates: gamesWithTeammates,
    unique_teammates: teammates.length,
    teammates
  };
};

// Error handler wrapper
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return 'Player not found';
        case 429:
          return 'Rate limit exceeded. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Error: ${error.response.statusText}`;
      }
    } else if (error.request) {
      return 'Network error. Please check your connection.';
    }
  }
  return 'An unexpected error occurred.';
}

interface TeammateStats {
  profile_id: number;
  name: string;
  games_together: number;
  wins: number;
  losses: number;
  win_rate: number;
}

interface TeamAnalysis {
  total_games_analyzed: number;
  games_with_teammates: number;
  unique_teammates: number;
  teammates: TeammateStats[];
}
