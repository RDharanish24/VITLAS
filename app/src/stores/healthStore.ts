import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  VitalSnapshot, 
  SleepData, 
  MoodEntry, 
  BodyZone, 
  HealthScore,
  BiometricInput,
  NutritionEntry 
} from '@/types';
import { 
  CURRENT_VITALS, 
  SLEEP_DATA, 
  MOOD_ENTRIES, 
  BODY_ZONES, 
  CURRENT_HEALTH_SCORE,
  VITAL_TRENDS 
} from '@/lib/constants';

interface HealthState {
  // Vitals
  currentVitals: VitalSnapshot | null;
  vitalHistory: typeof VITAL_TRENDS;
  
  // Sleep
  sleepData: SleepData[];
  
  // Mood
  moodEntries: MoodEntry[];
  
  // Body Model
  bodyZones: BodyZone[];
  
  // Health Score
  healthScore: HealthScore | null;
  
  // Nutrition
  nutritionEntries: NutritionEntry[];
  
  // Loading & Error
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentVitals: (vitals: VitalSnapshot) => void;
  addVitalEntry: (entry: VitalSnapshot) => void;
  setSleepData: (data: SleepData[]) => void;
  addSleepEntry: (entry: SleepData) => void;
  setMoodEntries: (entries: MoodEntry[]) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  updateBodyZone: (id: string, updates: Partial<BodyZone>) => void;
  setHealthScore: (score: HealthScore) => void;
  addNutritionEntry: (entry: NutritionEntry) => void;
  addBiometricInput: (input: BiometricInput) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentVitals: CURRENT_VITALS,
  vitalHistory: VITAL_TRENDS,
  sleepData: SLEEP_DATA,
  moodEntries: MOOD_ENTRIES,
  bodyZones: BODY_ZONES,
  healthScore: CURRENT_HEALTH_SCORE,
  nutritionEntries: [],
  isLoading: false,
  error: null,
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentVitals: (vitals) => set({ currentVitals: vitals }),
      
      addVitalEntry: (entry) => set((state) => ({
        currentVitals: entry,
        vitalHistory: [...state.vitalHistory.slice(-29), {
          date: entry.timestamp.split('T')[0],
          heartRate: entry.vitals.heartRate,
          glucose: entry.vitals.glucose,
          sleep: state.sleepData[0]?.duration || 6,
          stress: 50,
        }],
      })),
      
      setSleepData: (data) => set({ sleepData: data }),
      
      addSleepEntry: (entry) => set((state) => ({
        sleepData: [entry, ...state.sleepData.slice(0, 6)],
      })),
      
      setMoodEntries: (entries) => set({ moodEntries: entries }),
      
      addMoodEntry: (entry) => set((state) => ({
        moodEntries: [entry, ...state.moodEntries],
      })),
      
      updateBodyZone: (id, updates) => set((state) => ({
        bodyZones: state.bodyZones.map((z) =>
          z.id === id ? { ...z, ...updates, lastChecked: new Date().toISOString() } : z
        ),
      })),
      
      setHealthScore: (score) => set({ healthScore: score }),
      
      addNutritionEntry: (entry) => set((state) => ({
        nutritionEntries: [entry, ...state.nutritionEntries],
      })),
      
      addBiometricInput: (input) => set((state) => {
        // Update current vitals based on input type
        if (!state.currentVitals) return state;
        
        const updatedVitals = { ...state.currentVitals };
        
        switch (input.type) {
          case 'heartRate':
            updatedVitals.vitals.heartRate = input.value as number;
            break;
          case 'bloodPressure':
            updatedVitals.vitals.bloodPressure = input.value as { systolic: number; diastolic: number };
            break;
          case 'glucose':
            updatedVitals.vitals.glucose = input.value as number;
            break;
          case 'temperature':
            updatedVitals.vitals.temperature = input.value as number;
            break;
        }
        
        return { currentVitals: updatedVitals };
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'vitalis-health-storage',
      partialize: (state) => ({
        moodEntries: state.moodEntries,
        nutritionEntries: state.nutritionEntries,
      }),
    }
  )
);
