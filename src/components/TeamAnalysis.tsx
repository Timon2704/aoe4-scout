import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlayerGames, analyzeTeamPatterns } from '../services/aoe4worldApi';

interface TeamAnalysisProps {
  profileId: number | null;
}

interface TeammateData {
  id: number;
  name: string;
  count: number;
  wins: number;
  winRate: number;
  lastPlayed: string;
}

export function TeamAnalysis({ profileId }: TeamAnalysisProps) {
  const { data: gamesData, isLoading } = useQuery({
    queryKey: ['playerGames', profileId],
    queryFn: () => profileId ? getPlayerGames(profileId, 1, 50) : Promise.resolve({ games: [], total: 0, page: 1, perPage: 50 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!profileId
  });

  const teammates = useMemo(() => {
    if (!gamesData?.games || !profileId) return [];
    
    const analysis = analyzeTeamPatterns(gamesData.games, profileId);
    
    // Filter and format teammates for display
    return analysis.teammates
      .filter(t => t.games_together >= 3) // Only show frequent teammates
      .slice(0, 5) // Top 5 teammates
      .map(t => ({
        id: t.profile_id,
        name: t.name,
        count: t.games_together,
        wins: t.wins,
        winRate: t.win_rate / 100, // Convert percentage to decimal
        lastPlayed: new Date().toISOString() // We don't have this data anymore, use current date as placeholder
      }));
  }, [gamesData, profileId]);

  if (!profileId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-card-dark rounded-lg p-6 border border-border-dark">
        <h2 className="text-xl font-semibold mb-4">Team Analysis</h2>
        <p className="text-text-secondary">Loading team patterns...</p>
      </div>
    );
  }

  if (teammates.length === 0) {
    return (
      <div className="bg-card-dark rounded-lg p-6 border border-border-dark">
        <h2 className="text-xl font-semibold mb-4">Team Analysis</h2>
        <p className="text-text-secondary">No frequent teammates found</p>
      </div>
    );
  }

  return (
    <div className="bg-card-dark rounded-lg p-6 border border-border-dark">
      <h2 className="text-xl font-semibold mb-4">Frequent Teammates</h2>
      <div className="space-y-3">
        {teammates.map((teammate: TeammateData) => (
          <div key={teammate.id} className="bg-bg-dark rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{teammate.name}</h3>
                <p className="text-sm text-text-secondary">
                  {teammate.count} games together
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {(teammate.winRate * 100).toFixed(0)}% win rate
                </p>
                <p className="text-xs text-text-secondary">
                  {teammate.wins}W - {teammate.count - teammate.wins}L
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
