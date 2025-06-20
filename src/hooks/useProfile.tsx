import { useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { COOKIE_NAME, COOKIE_EXPIRY_DAYS } from '../utils/constants';
import { extractProfileId, getPlayer } from '../services/aoe4worldApi';
import { Player } from '../types';

interface ProfileState {
  profileId: number | null;
  profileUrl: string | null;
  player: Player | null;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileState>({ profileId: null, profileUrl: null, player: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile from cookie on mount
  useEffect(() => {
    const savedProfile = Cookies.get(COOKIE_NAME);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
      } catch (e) {
        console.error('Failed to parse saved profile:', e);
        Cookies.remove(COOKIE_NAME);
      }
    }
    setLoading(false);
  }, []);

  // Save profile
  const saveProfile = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const initialId = extractProfileId(url);
      if (!initialId) {
        throw new Error('Invalid AoE4World URL. Please use a URL like: https://aoe4world.com/players/12345');
      }

      // Verify the profile exists and get the canonical player data
      const player = await getPlayer(initialId);
      
      // Always use the numeric profile_id from the API response for consistency
      const profileData: ProfileState = {
        profileId: player.profile_id,
        profileUrl: url,
        player
      };

      // Save to cookie
      Cookies.set(COOKIE_NAME, JSON.stringify(profileData), { 
        expires: COOKIE_EXPIRY_DAYS 
      });

      setProfile(profileData);
      return profileData;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to save profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear profile
  const clearProfile = useCallback(() => {
    Cookies.remove(COOKIE_NAME);
    setProfile({ profileId: null, profileUrl: null, player: null });
    setError(null);
  }, []);

  return {
    profile,
    loading,
    error,
    saveProfile,
    clearProfile
  };
}
