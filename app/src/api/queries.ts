import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  User, 
  VitalSnapshot, 
  SleepData, 
  MoodEntry, 
  ChatMessage,
  Achievement,
  Guild,
  Challenge,
  Intervention,
  RiskAssessment,
  FutureSimulation,
  WhatIfScenario,
  ApiResponse 
} from '@/types';

// API base URL
const API_BASE = '';

// Fetch helper
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  const result: ApiResponse<T> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Unknown error');
  }
  
  return result.data as T;
}

// ============ USER QUERIES ============

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => fetchApi<User>('/api/user'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<User>) =>
      fetchApi<User>('/api/user', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// ============ VITALS QUERIES ============

export const useCurrentVitals = () => {
  return useQuery({
    queryKey: ['vitals', 'current'],
    queryFn: () => fetchApi<VitalSnapshot>('/api/vitals/current'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useVitalsHistory = (days = 30) => {
  return useQuery({
    queryKey: ['vitals', 'history', days],
    queryFn: () => fetchApi<Array<{ date: string; heartRate: number; glucose: number; sleep: number; stress: number }>>(`/api/vitals/history?days=${days}`),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddVitalEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entry: VitalSnapshot) =>
      fetchApi<VitalSnapshot>('/api/vitals', {
        method: 'POST',
        body: JSON.stringify(entry),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals'] });
    },
  });
};

// ============ SLEEP QUERIES ============

export const useSleepData = (days = 7) => {
  return useQuery({
    queryKey: ['sleep', days],
    queryFn: () => fetchApi<SleepData[]>(`/api/sleep?days=${days}`),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddSleepEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entry: SleepData) =>
      fetchApi<SleepData>('/api/sleep', {
        method: 'POST',
        body: JSON.stringify(entry),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep'] });
    },
  });
};

// ============ MOOD QUERIES ============

export const useMoodEntries = (limit = 10) => {
  return useQuery({
    queryKey: ['mood', limit],
    queryFn: () => fetchApi<MoodEntry[]>(`/api/mood?limit=${limit}`),
    staleTime: 2 * 60 * 1000,
  });
};

export const useAddMoodEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entry: Omit<MoodEntry, 'id'>) =>
      fetchApi<MoodEntry>('/api/mood', {
        method: 'POST',
        body: JSON.stringify(entry),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood'] });
    },
  });
};

// ============ CHAT QUERIES ============

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (content: string) =>
      fetchApi<ChatMessage>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  });
};

// ============ ACHIEVEMENT QUERIES ============

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => fetchApi<Achievement[]>('/api/achievements'),
    staleTime: 10 * 60 * 1000,
  });
};

export const useUnlockAchievement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<Achievement>(`/api/achievements/${id}/unlock`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
};

// ============ GUILD QUERIES ============

export const useGuilds = () => {
  return useQuery({
    queryKey: ['guilds'],
    queryFn: () => fetchApi<Guild[]>('/api/guilds'),
    staleTime: 5 * 60 * 1000,
  });
};

export const useJoinGuild = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<Guild>(`/api/guilds/${id}/join`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guilds'] });
    },
  });
};

// ============ CHALLENGE QUERIES ============

export const useChallenges = (type?: string) => {
  return useQuery({
    queryKey: ['challenges', type],
    queryFn: () => fetchApi<Challenge[]>(`/api/challenges${type ? `?type=${type}` : ''}`),
    staleTime: 5 * 60 * 1000,
  });
};

export const useJoinChallenge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<Challenge>(`/api/challenges/${id}/join`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
};

export const useUpdateChallengeProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      fetchApi<Challenge>(`/api/challenges/${id}/progress`, {
        method: 'PATCH',
        body: JSON.stringify({ progress }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
};

// ============ ANALYTICS QUERIES ============

export const useRiskAssessment = () => {
  return useQuery({
    queryKey: ['analytics', 'risk'],
    queryFn: () => fetchApi<RiskAssessment>('/api/analytics/risk'),
    staleTime: 10 * 60 * 1000,
  });
};

export const useHealthScore = () => {
  return useQuery({
    queryKey: ['analytics', 'health-score'],
    queryFn: () => fetchApi('/api/analytics/health-score'),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFutureSimulation = (years = 10) => {
  return useQuery({
    queryKey: ['analytics', 'future', years],
    queryFn: () => fetchApi<FutureSimulation>(`/api/analytics/future-simulation?years=${years}`),
    staleTime: 10 * 60 * 1000,
  });
};

export const useWhatIfScenarios = () => {
  return useQuery({
    queryKey: ['analytics', 'scenarios'],
    queryFn: () => fetchApi<WhatIfScenario[]>('/api/analytics/scenarios'),
    staleTime: 10 * 60 * 1000,
  });
};

export const useRunScenario = () => {
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/api/analytics/scenarios/${id}/run`, {
        method: 'POST',
      }),
  });
};

// ============ INTERVENTION QUERIES ============

export const useInterventions = () => {
  return useQuery({
    queryKey: ['interventions'],
    queryFn: () => fetchApi<Intervention[]>('/api/interventions'),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompleteIntervention = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<Intervention>(`/api/interventions/${id}/complete`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
    },
  });
};

// ============ WEARABLE QUERIES ============

export const useSyncWearable = () => {
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/api/wearables/${id}/sync`, {
        method: 'POST',
      }),
  });
};
