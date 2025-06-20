import { useState, useEffect } from 'react';
import { FaRegClock, FaGlobe, FaUser, FaUserFriends, FaUsers, FaMapMarkedAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { Game } from '../types';
import { MAP_NAMES, GAME_MODE_NAMES, formatDuration } from '../utils/constants';

interface GameCardProps {
  game: Game;
  profileId: number | null;
}

export function GameCard({ game, profileId }: GameCardProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!game.ongoing) {
      setElapsedTime(game.duration);
      return;
    }

    const calculateElapsed = () => {
      const now = new Date().getTime();
      const start = new Date(game.started_at).getTime();
      setElapsedTime(Math.floor((now - start) / 1000));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [game.ongoing, game.started_at, game.duration]);

  const userTeam = game.teams.find(team => 
    team.players.some(p => p.profile_id === profileId)
  );
  const isWinner = userTeam?.winner || false;

  const getModeIcon = () => {
    const iconProps = { className: "w-3.5 h-3.5" };
    switch (game.kind) {
      case 'rm_1v1':
        return <FaUser {...iconProps} />;
      case 'rm_2v2':
        return <FaUserFriends {...iconProps} />;
      case 'rm_3v3':
      case 'rm_4v4':
      case 'rm_team':
        return <FaUsers {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div className={clsx(
      'bg-card-dark rounded-lg p-4 border transition-all duration-200',
      game.ongoing ? 'border-primary animate-pulse-slow' : 'border-border-dark',
      isWinner && !game.ongoing && 'border-success/30'
    )}>
      <div className="flex justify-end mb-2">
        {game.ongoing && (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Ongoing
          </span>
        )}
        {game.just_finished && (
          <span className="text-sm text-warning">Just Finished</span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 text-sm mb-4 text-center">
        <div>
          <p className="flex items-center justify-center gap-1.5 text-text-secondary text-xs">
            <FaMapMarkedAlt className="w-3.5 h-3.5" /> Map
          </p>
          <p className="font-medium truncate">{MAP_NAMES[game.map] || game.map}</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1.5 text-text-secondary text-xs">
            {getModeIcon()} Mode
          </p>
          <p className="font-medium truncate">{GAME_MODE_NAMES[game.kind] || game.kind}</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1.5 text-text-secondary text-xs">
            <FaUsers className="w-3.5 h-3.5" /> ∅ Rating
          </p>
          <p className="font-medium">{Math.round(game.average_rating)}</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1.5 text-text-secondary text-xs">
            <FaRegClock className="w-3.5 h-3.5" /> Time
          </p>
          <p className="font-medium">{formatDuration(elapsedTime)}</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1.5 text-text-secondary text-xs">
            <FaGlobe className="w-3.5 h-3.5" /> Server
          </p>
          <p className="font-medium capitalize">{game.server}</p>
        </div>
      </div>

      {!game.ongoing && userTeam && (
        <div className={clsx(
          'text-center py-2 rounded font-medium',
          isWinner ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
        )}>
          {isWinner ? 'Victory' : 'Defeat'}
        </div>
      )}
    </div>
  );
}
