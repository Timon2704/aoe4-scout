import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getPlayerLastGame, getPlayer, handleApiError } from '../services/aoe4worldApi';
import { POLLING_INTERVAL } from '../utils/constants';
import type { Game, TeamPlayer } from '../types';

interface UseGamePollingOptions {
  profileId: number | null;
  enabled?: boolean;
  onGameStart?: (game: Game) => void;
  onGameEnd?: (game: Game) => void;
}

export function useGamePolling({
  profileId,
  enabled = true,
  onGameStart = () => {},
  onGameEnd = () => {},
}: UseGamePollingOptions) {
  const queryClient = useQueryClient();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const previousGameRef = useRef<Game | null>(null);

  const { data: lastGame, error, isLoading, isFetching } = useQuery({
    queryKey: ['lastGame', profileId],
    queryFn: async () => {
      if (!profileId) return null;
      return getPlayerLastGame(profileId);
    },
    enabled: !!profileId && enabled,
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false,
  });

  const fetchOpponentDetails = useCallback(async (game: Game) => {
    if (!game?.teams) return game;

    const teamsWithDetails = await Promise.all(
      game.teams.map(async (team: any) => {
        const players = Array.isArray(team) ? team : team.players;
        const playersWithDetails = await Promise.all(
          players.map(async (p: TeamPlayer) => {
            if (p.player) return p;
            try {
              const fullPlayer = await getPlayer(p.profile_id);
              return { ...p, player: fullPlayer };
            } catch (e) {
              console.error(`Failed to fetch details for player ${p.profile_id}`, e);
              return p;
            }
          })
        );
        return { ...team, players: playersWithDetails };
      })
    );

    return { ...game, teams: teamsWithDetails };
  }, []);

  useEffect(() => {
    if (isFetching) {
      return;
    }

    // If the API returns no game data, clear the current game from the UI.
    if (!lastGame) {
      if (currentGame !== null) {
        setCurrentGame(null);
      }
      previousGameRef.current = null;
      return;
    }

    const previousGameId = previousGameRef.current?.game_id;
    const wasGameOngoing = previousGameRef.current?.ongoing;
    
    const isNewGame = lastGame.game_id !== previousGameId;
    const didGameEnd = wasGameOngoing && !lastGame.ongoing;

    if (isNewGame) {
      onGameStart(lastGame);
      // Fetch details for the new game and set it as current
      fetchOpponentDetails(lastGame).then(setCurrentGame);
    } else if (didGameEnd) {
      onGameEnd(lastGame);
      // Update the current game to reflect its final state, keeping player details
      setCurrentGame(prevGame => (prevGame ? { ...prevGame, ...lastGame } : lastGame));
    }
    
    // Always update the ref to the latest raw game data for the next comparison
    previousGameRef.current = lastGame;

  }, [lastGame, isFetching, fetchOpponentDetails, onGameStart, onGameEnd]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['lastGame', profileId] });
  }, [queryClient, profileId]);

  return {
    currentGame,
    isLoading: isLoading,
    error: error ? handleApiError(error) : null,
    refresh,
    isPolling: enabled && !!profileId,
  };
}
