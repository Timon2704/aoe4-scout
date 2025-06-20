import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { GameCard } from './components/GameCard';
import { PlayerCard } from './components/PlayerCard';
import { TeamAnalysis } from './components/TeamAnalysis';
import { useProfileContext } from './contexts/ProfileContext';
import { useGamePolling } from './hooks/useGamePolling';
import { Game } from './types';
import { POLLING_INTERVAL } from './utils/constants';

export default function App() {
  const { profile } = useProfileContext();
  const [notifications, setNotifications] = useState<string[]>([]);
  
  const onGameStart = useCallback((game: Game) => {
    const message = `New game started on ${game.map}!`;
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== message));
    }, 5000);
  }, []);

  const onGameEnd = useCallback((game: Game) => {
    if (!profile?.profileId) return;
    const userTeam = game.teams.find(team => 
      team && team.players && team.players.some(p => p.profile_id === profile.profileId)
    );
    const result = userTeam?.winner ? 'Victory!' : 'Defeat';
    const message = `Game ended: ${result}`;
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== message));
    }, 5000);
  }, [profile?.profileId]);

  const { currentGame, isLoading, error, refresh, isPolling } = useGamePolling({
    profileId: profile?.profileId || null,
    enabled: !!profile?.profileId,
    onGameStart,
    onGameEnd,
  });

  const getOpponents = () => {
    if (!currentGame || !profile?.profileId) return [];

    const userTeam = currentGame.teams.find(team => 
      team && team.players && team.players.some(p => p.profile_id === profile.profileId)
    );

    if (!userTeam) return [];

    return currentGame.teams
      .filter(team => team !== userTeam)
      .flatMap(team => team.players);
  };

  const getTeammates = () => {
    if (!currentGame || !profile?.profileId) return [];
    
    const userTeam = currentGame.teams.find(team =>
      team && team.players && team.players.some(p => p.profile_id === profile.profileId)
    );
    
    if (!userTeam) return [];
    
    return userTeam.players.filter(p => p.profile_id !== profile.profileId);
  };

  return (
    <div className="flex h-screen bg-bg-dark overflow-hidden">
      {/* Background particles */}
      <div id="particle-container" className="fixed inset-0 pointer-events-none overflow-hidden" />

      {/* Sidebar */}
      <Sidebar isPolling={isPolling} onRefresh={refresh} currentGame={currentGame} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">


          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="fixed top-4 right-4 z-50 space-y-2">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg animate-pulse"
                >
                  {notification}
                </div>
              ))}
            </div>
          )}

          {profile?.profileId ? (
            <>
              {error && (
                <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                  <p className="text-danger">{error}</p>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Loading game data...</p>
                  </div>
                </div>
              ) : currentGame ? (
                <div className="space-y-6">
                  {/* Current Game */}
                  <section>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                      Current Game
                      {currentGame.ongoing && (
                        <span className="text-sm font-normal text-success flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </h2>
                    <GameCard game={currentGame} profileId={profile.profileId} />
                  </section>

                  {/* Opponents */}
                  {getOpponents().length > 0 && (
                    <section>
                      <h2 className="text-2xl font-semibold mb-4">
                        Opponents
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {getOpponents().map((opponent) => (
                          <PlayerCard
                            key={opponent.profile_id}
                            player={opponent}
                            isOpponent
                            gameMode={currentGame.kind}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Teammates */}
                  {getTeammates().length > 0 && (
                    <section>
                      <h2 className="text-2xl font-semibold mb-4">
                        Teammates
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {getTeammates().map((teammate) => (
                          <PlayerCard
                            key={teammate.profile_id}
                            player={teammate}
                            isOpponent={false}
                            gameMode={currentGame.kind}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-card-dark rounded-lg p-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">No Active Game</h2>
                    <p className="text-text-secondary">
                      Waiting for a new game to start. The app will automatically detect when you enter a match.
                    </p>
                  </div>
                  <TeamAnalysis profileId={profile.profileId} />
                </div>
              )}
            </>
          ) : (
            <div className="bg-card-dark rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Welcome to AoE IV Scout</h2>
              <p className="text-text-secondary mb-6">
                Enter your AoE4World profile URL in the sidebar to start tracking your opponents in real-time.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Real-time tracking with {POLLING_INTERVAL / 1000} second updates
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
