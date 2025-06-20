import { createContext, useContext, ReactNode } from 'react';
import { useProfile } from '../hooks/useProfile';
import { Player } from '../types';

interface ProfileState {
  profileId: number | null;
  profileUrl: string | null;
  player: Player | null;
}

interface ProfileContextType {
  profile: ProfileState;
  loading: boolean;
  error: string | null;
  saveProfile: (url: string) => Promise<ProfileState>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const profileData = useProfile();
  
  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}
