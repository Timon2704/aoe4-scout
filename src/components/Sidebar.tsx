import { useState } from 'react';
import { Game } from '../types';
import { PlayerCard } from './PlayerCard';
import { useProfileContext } from '../contexts/ProfileContext';
import { POLLING_INTERVAL } from '../utils/constants';
import { FaSync } from 'react-icons/fa';
import clsx from 'clsx';

interface SidebarProps {
  isPolling: boolean;
  onRefresh: () => void;
  currentGame: Game | null;
}

export function Sidebar({ isPolling, onRefresh, currentGame }: SidebarProps) {
  const { profile, saveProfile, clearProfile } = useProfileContext();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

  const trackedPlayer =
    currentGame && profile.profileId
      ? currentGame.teams.flatMap(team => team.players).find(p => p.profile_id === profile.profileId)
      : undefined;

  const handleSave = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    try {
      await saveProfile(url);
      setUrl('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-80 bg-bg-light p-6 flex flex-col gap-6 overflow-y-auto border-r border-border-dark">
      <h2 className="text-2xl font-bold">AoE IV Scout</h2>

      {!profile.profileId ? (
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="profileUrl" className="block text-sm font-medium mb-2">Profile URL</label>
            <input 
              type="text"
              id="profileUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://aoe4world.com/players/..."
              className="w-full bg-bg-dark border border-border-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Save Profile'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {trackedPlayer && currentGame ? (
            <PlayerCard player={trackedPlayer} isOpponent={false} gameMode={currentGame.kind} />
          ) : (
            <div>
              <p className="text-sm text-text-secondary">Currently tracking</p>
              <p className="font-semibold text-lg">{profile.player?.name}</p>
              {profile.profileUrl && (
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View on AoE4World
                </a>
              )}
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium">Status</p>
              <div className={`flex items-center gap-2 ${isPolling ? 'text-success' : 'text-text-secondary'}`}>
                <span className={`w-2 h-2 rounded-full ${isPolling ? 'bg-success animate-pulse' : 'bg-text-secondary'}`} />
                {isPolling ? 'Live' : 'Idle'}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Refresh Rate</span>
              <span>{POLLING_INTERVAL / 1000}s</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={clearProfile}
              className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
            >
              Change Profile
            </button>
            <button 
              onClick={onRefresh}
              className={clsx(
                'p-2 rounded-full hover:bg-primary/20 transition-colors flex items-center justify-center w-9 h-9',
              )}
              title="Refresh Data"
            >
              <FaSync className={clsx(isPolling && 'animate-spin-slow')} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto text-center text-xs text-text-secondary pt-4">
        <p>
          Data provided by{' '}
          <a href="https://aoe4world.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            aoe4world.com
          </a>
        </p>
      </div>
    </aside>
  );
}
