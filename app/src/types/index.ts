// ============================================
// VITALIS - AI Health Monitoring System
// Type Definitions
// ============================================

// User & Profile Types
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  avatar?: string;
  conditions: string[];
  goals: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  user: User;
  preferences: UserPreferences;
  wearableConnected: boolean;
  wearableType?: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  reducedMotion: boolean;
  highContrast: boolean;
  notifications: boolean;
  aiAvatar: 'doctor' | 'coach' | 'friendly';
  language: string;
}

// Health Vitals Types
export interface Vitals {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  glucose: number;
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate: number;
}

export interface VitalSnapshot {
  id: string;
  userId: string;
  vitals: Vitals;
  timestamp: string;
  source: 'manual' | 'wearable' | 'camera';
}

export interface VitalTrend {
  date: string;
  heartRate: number;
  glucose: number;
  sleep: number;
  stress: number;
}

// Sleep Types
export interface SleepData {
  date: string;
  duration: number; // hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  deepSleep: number; // percentage
  remSleep: number; // percentage
  lightSleep: number; // percentage
  awakeTime: number; // minutes
  score: number; // 0-100
}

export interface SleepTrend {
  dates: string[];
  durations: number[];
  scores: number[];
}

// Stress & Mental Health Types
export interface StressLevel {
  level: 'low' | 'moderate' | 'high' | 'severe';
  score: number; // 0-100
  timestamp: string;
  triggers?: string[];
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad' | 'angry' | 'tired';
  intensity: number; // 1-10
  notes?: string;
  timestamp: string;
  aiArtUrl?: string;
}

export interface MoodTrend {
  date: string;
  averageMood: number;
  entries: number;
}

// Body Model Types
export interface BodyZone {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  position: [number, number, number]; // x, y, z coordinates
  description: string;
  lastChecked: string;
}

export interface HealthScore {
  overall: number; // 0-100
  breakdown: {
    cardiovascular: number;
    metabolic: number;
    sleep: number;
    mental: number;
    fitness: number;
  };
  lastUpdated: string;
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  emotion?: DetectedEmotion;
  crisisDetected?: boolean;
  resources?: CrisisResource[];
}

export interface DetectedEmotion {
  primary: 'anxious' | 'calm' | 'tired' | 'stressed' | 'happy' | 'neutral';
  confidence: number;
}

export interface CrisisResource {
  name: string;
  phone?: string;
  url?: string;
  description: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: string;
  lastMessageAt: string;
}

// Analytics & Predictions
export interface RiskAssessment {
  cardiovascular: { score: number; risk: 'low' | 'moderate' | 'high' };
  mental: { score: number; risk: 'low' | 'moderate' | 'high' };
  metabolic: { score: number; risk: 'low' | 'moderate' | 'high' };
  sleep: { score: number; risk: 'low' | 'moderate' | 'high' };
}

export interface FutureSimulation {
  currentAge: number;
  projectedAge: number;
  healthScore: number;
  lifeExpectancy: number;
  recommendations: string[];
  visualization: string; // URL or data for 3D visualization
}

export interface WhatIfScenario {
  id: string;
  name: string;
  parameter: string;
  value: number;
  duration: number; // days
  projectedOutcome: {
    healthScoreChange: number;
    lifeExpectancyChange: number;
    riskReduction: Record<string, number>;
  };
}

export interface Intervention {
  id: string;
  title: string;
  description: string;
  category: 'sleep' | 'exercise' | 'nutrition' | 'mental' | 'medical';
  priority: 'low' | 'medium' | 'high';
  timeline: string;
  expectedImpact: string;
  completed: boolean;
}

// Nutrition Types
export interface NutritionEntry {
  id: string;
  userId: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  photoUrl?: string;
  timestamp: string;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  confidence?: number; // AI confidence if from photo
}

// Gamification Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'health' | 'mental' | 'social' | 'milestone';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  members: GuildMember[];
  totalScore: number;
  rank: number;
  avatar?: string;
}

export interface GuildMember {
  userId: string;
  name: string;
  avatar?: string;
  contribution: number;
  role: 'leader' | 'officer' | 'member';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  category: 'steps' | 'sleep' | 'meditation' | 'hydration' | 'custom';
  target: number;
  unit: string;
  participants: number;
  endDate: string;
  reward: string;
  joined: boolean;
  progress: number;
}

// Family Health Types
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  healthScore: number;
  conditions: string[];
  avatar?: string;
  sharedData: boolean;
}

// Biometric Input Types
export interface BiometricInput {
  type: 'heartRate' | 'bloodPressure' | 'glucose' | 'weight' | 'temperature';
  value: number | { systolic: number; diastolic: number };
  unit: string;
  timestamp: string;
  notes?: string;
}

// Wearable Types
export interface WearableDevice {
  id: string;
  type: string;
  name: string;
  connected: boolean;
  lastSync: string;
  batteryLevel?: number;
  dataTypes: string[];
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  currentPage: string;
  modalOpen: boolean;
  modalContent: string | null;
  toast: ToastMessage | null;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

// Breathing Exercise Types
export interface BreathingPattern {
  name: string;
  inhale: number; // seconds
  hold: number; // seconds
  exhale: number; // seconds
  holdEmpty: number; // seconds
  description: string;
}

export interface BreathingSession {
  id: string;
  pattern: BreathingPattern;
  duration: number; // total seconds
  completed: boolean;
  biofeedback: BiofeedbackData[];
}

export interface BiofeedbackData {
  timestamp: number;
  heartRate: number;
  coherence: number; // HRV coherence score
}

// CBT Exercise Types
export interface CBTExercise {
  id: string;
  title: string;
  description: string;
  category: 'thought_record' | 'behavioral_activation' | 'relaxation' | 'exposure';
  steps: CBTStep[];
  estimatedDuration: number; // minutes
}

export interface CBTStep {
  order: number;
  title: string;
  content: string;
  inputType?: 'text' | 'scale' | 'multiple_choice' | 'checkbox';
  options?: string[];
}

// Sleep Story Types
export interface SleepStory {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  category: 'nature' | 'fantasy' | 'meditation' | 'journey';
  audioUrl: string;
  thumbnailUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  disabled?: boolean;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}
