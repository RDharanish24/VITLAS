import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserPreferences, WearableDevice } from '@/types';
import { CURRENT_USER, DEFAULT_PREFERENCES, WEARABLE_DEVICES } from '@/lib/constants';

interface UserState {
  user: User | null;
  preferences: UserPreferences;
  wearables: WearableDevice[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  updateWearable: (id: string, updates: Partial<WearableDevice>) => void;
  connectWearable: (device: WearableDevice) => void;
  disconnectWearable: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: CURRENT_USER,
  preferences: DEFAULT_PREFERENCES,
  wearables: WEARABLE_DEVICES,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setUser: (user) => set({ user }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates, updatedAt: new Date().toISOString() } : null,
      })),
      
      setPreferences: (preferences) => set((state) => ({
        preferences: { ...state.preferences, ...preferences },
      })),
      
      updateWearable: (id, updates) => set((state) => ({
        wearables: state.wearables.map((w) =>
          w.id === id ? { ...w, ...updates } : w
        ),
      })),
      
      connectWearable: (device) => set((state) => ({
        wearables: [...state.wearables, { ...device, connected: true, lastSync: new Date().toISOString() }],
      })),
      
      disconnectWearable: (id) => set((state) => ({
        wearables: state.wearables.map((w) =>
          w.id === id ? { ...w, connected: false } : w
        ),
      })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'vitalis-user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        preferences: state.preferences,
        wearables: state.wearables,
      }),
    }
  )
);
