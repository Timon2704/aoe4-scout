import React from 'react';
import clsx from 'clsx';
import { TeamPlayer, Mode } from '../types';
import { CIVILIZATION_NAMES } from '../utils/constants';
import CivFlag from './CivFlag';
import { FaUser, FaTwitch, FaYoutube, FaTwitter } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';
import RankBadge from './RankBadge';

interface PlayerCardProps {
  player: TeamPlayer;
  gameMode: string;
  isOpponent: boolean;
}

const getModeData = (player: TeamPlayer, gameMode: string): [Mode | undefined, Mode | undefined] => {
  const modes = player.player?.modes;
  if (!modes) return [undefined, undefined];

  const isSolo = gameMode.includes('1v1') || gameMode === 'rm_solo';
  const rankedMode = isSolo ? modes.rm_solo : modes.rm_team;
  
  const mmrKey = `${gameMode}_elo` as keyof typeof modes;
  const mmrMode = modes[mmrKey];

  return [rankedMode, mmrMode];
};

const StatItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-text-secondary mb-0.5">{label}</p>
    <p className="font-semibold text-sm">{value ?? 'N/A'}</p>
  </div>
);

const ModeStats: React.FC<{ title?: React.ReactNode; mode: Mode; mmr?: Mode; isSummary?: boolean; modeType: 'solo' | 'team' }> = ({ title, mode, mmr, isSummary, modeType }) => (
  <div className="bg-bg-light rounded-md p-2">
    {title && <div className="mb-2 text-text-primary">{title}</div>}
    
    

    <div className="grid grid-cols-2 gap-x-3 gap-y-2 items-center">
      {isSummary ? (
        <>
          <StatItem 
            label="1v1 MMR" 
            value={mmr?.rating} 
          />
          <StatItem 
            label="1v1 W / L" 
            value={mmr ? (
              <span>
                <span className="text-green-500">{mmr.wins_count || 0}</span>
                <span className="text-text-secondary"> / </span>
                <span className="text-red-500">{mmr.losses_count || 0}</span>
              </span>
            ) : 'N/A'}
          />
        </>
      ) : (
        <>
          <RankBadge rankLevel={mode.rank_level} mode={modeType} />
          <StatItem label="Rank" value={mode.rank ? `#${mode.rank}` : 'N/A'} />
          <StatItem 
            label="ELO" 
            value={mode.rating} 
          />
          <StatItem 
            label="MMR" 
            value={mmr?.rating} 
          />
          <StatItem 
            label="W / L" 
            value={
              <span>
                <span className="text-green-500">{mode.wins_count || 0}</span>
                <span className="text-text-secondary"> / </span>
                <span className="text-red-500">{mode.losses_count || 0}</span>
              </span>
            } 
          />
          <StatItem label="Win %" value={mode.win_rate ? `${mode.win_rate.toFixed(1)}%` : 'N/A'} />
        </>
      )}
    </div>
  </div>
);

export function PlayerCard({ player, gameMode, isOpponent }: PlayerCardProps) {
  const playerDetails = player.player;
  const [rankedMode, mmrMode] = getModeData(player, gameMode);
  const soloMode = playerDetails?.modes?.rm_solo;
  const soloMmrMode = playerDetails?.modes?.rm_1v1_elo;
  const isTeamGame = gameMode.includes('team') || ['2v2', '3v3', '4v4'].some(v => gameMode.includes(v));
  const civilizationName = CIVILIZATION_NAMES[player.civilization] || player.civilization;
  console.log('PlayerCard Civ Debug:', { apiValue: player.civilization, mappedName: civilizationName });

  const cardContent = (
    <div className={clsx(
      'bg-bg-dark rounded-lg p-3 border transition-all duration-200 card-hover h-full',
      isOpponent ? 'border-danger/30 hover:border-danger/50' : 'border-primary/30 hover:border-primary/50'
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          {playerDetails?.avatars?.medium ? (
            <img src={playerDetails.avatars.medium} alt={`${player.name} avatar`} className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-bg-light flex items-center justify-center">
              <FaUser className="w-8 h-8 text-text-secondary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg truncate">{player.name || 'Unknown Player'}</p>
            <div className="text-sm text-text-secondary flex items-center gap-3 mt-1">
              <CivFlag civilization={civilizationName} className="h-4 w-auto" />
              {playerDetails?.country && (
                <ReactCountryFlag 
                  countryCode={playerDetails.country} 
                  svg 
                  style={{
                    height: '1rem',
                    width: 'auto',
                  }}
                  title={playerDetails.country}
                />
              )}
              {playerDetails?.social?.twitch && (
                <a href={playerDetails.social.twitch} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white">
                  <FaTwitch />
                </a>
              )}
              {playerDetails?.social?.youtube && (
                <a href={playerDetails.social.youtube} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white">
                  <FaYoutube />
                </a>
              )}
              {playerDetails?.social?.twitter && (
                <a href={playerDetails.social.twitter} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white">
                  <FaTwitter />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {rankedMode && <ModeStats mode={rankedMode} mmr={mmrMode} modeType={gameMode === 'rm_1v1' ? 'solo' : 'team'} />}
        {isTeamGame && soloMode && <ModeStats title={
          <div className="flex items-center gap-2 font-bold text-sm">
            <FaUser className="w-4 h-4" />
            <span>1v1 Stats</span>
          </div>
        } mode={soloMode} mmr={soloMmrMode} isSummary modeType='solo' />}
      </div>
    </div>
  );

  if (!player.profile_id) {
    return cardContent;
  }

  return (
    <a 
      href={`https://aoe4world.com/players/${player.profile_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      {cardContent}
    </a>
  );
}
