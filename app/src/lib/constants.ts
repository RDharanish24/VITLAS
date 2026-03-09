// ============================================
// VITALIS - Constants & Mock Data
// ============================================

import type { 
  User, 
  UserPreferences, 
  VitalSnapshot, 
  SleepData, 
  MoodEntry,
  BodyZone,
  HealthScore,
  ChatMessage,
  RiskAssessment,
  Achievement,
  Guild,
  Challenge,
  FamilyMember,
  WearableDevice,
  BreathingPattern,
  CBTExercise,
  SleepStory,
  Intervention,
  WhatIfScenario,
  NavItem
} from '@/types';

// Current User - Alex Chen
export const CURRENT_USER: User = {
  id: 'user-001',
  name: 'Alex Chen',
  email: 'alex.chen@vitalis.ai',
  age: 28,
  gender: 'male',
  occupation: 'Software Engineer',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen',
  conditions: ['Mild Anxiety', 'Irregular Sleep'],
  goals: ['Improve Sleep Quality', 'Reduce Stress', 'Maintain Fitness'],
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-12-01T00:00:00Z',
};

// User Preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  reducedMotion: false,
  highContrast: false,
  notifications: true,
  aiAvatar: 'friendly',
  language: 'en',
};

// Current Vitals
export const CURRENT_VITALS: VitalSnapshot = {
  id: 'vitals-001',
  userId: 'user-001',
  vitals: {
    heartRate: 72,
    bloodPressure: { systolic: 118, diastolic: 78 },
    glucose: 95,
    oxygenSaturation: 98,
    temperature: 36.6,
    respiratoryRate: 16,
  },
  timestamp: new Date().toISOString(),
  source: 'wearable',
};

// 30-Day Vital Trends
export const VITAL_TRENDS = [
  { date: '2024-11-01', heartRate: 74, glucose: 98, sleep: 5.8, stress: 65 },
  { date: '2024-11-02', heartRate: 73, glucose: 97, sleep: 6.0, stress: 62 },
  { date: '2024-11-03', heartRate: 75, glucose: 99, sleep: 5.5, stress: 70 },
  { date: '2024-11-04', heartRate: 72, glucose: 95, sleep: 6.2, stress: 58 },
  { date: '2024-11-05', heartRate: 71, glucose: 94, sleep: 6.5, stress: 55 },
  { date: '2024-11-06', heartRate: 73, glucose: 96, sleep: 6.0, stress: 60 },
  { date: '2024-11-07', heartRate: 74, glucose: 98, sleep: 5.8, stress: 63 },
  { date: '2024-11-08', heartRate: 72, glucose: 95, sleep: 6.3, stress: 57 },
  { date: '2024-11-09', heartRate: 71, glucose: 94, sleep: 6.5, stress: 54 },
  { date: '2024-11-10', heartRate: 70, glucose: 93, sleep: 6.8, stress: 52 },
  { date: '2024-11-11', heartRate: 72, glucose: 95, sleep: 6.2, stress: 56 },
  { date: '2024-11-12', heartRate: 73, glucose: 96, sleep: 6.0, stress: 59 },
  { date: '2024-11-13', heartRate: 71, glucose: 94, sleep: 6.5, stress: 53 },
  { date: '2024-11-14', heartRate: 70, glucose: 93, sleep: 6.8, stress: 50 },
  { date: '2024-11-15', heartRate: 72, glucose: 95, sleep: 6.3, stress: 55 },
  { date: '2024-11-16', heartRate: 73, glucose: 96, sleep: 6.1, stress: 58 },
  { date: '2024-11-17', heartRate: 71, glucose: 94, sleep: 6.6, stress: 52 },
  { date: '2024-11-18', heartRate: 70, glucose: 93, sleep: 6.9, stress: 48 },
  { date: '2024-11-19', heartRate: 72, glucose: 95, sleep: 6.4, stress: 54 },
  { date: '2024-11-20', heartRate: 71, glucose: 94, sleep: 6.7, stress: 51 },
  { date: '2024-11-21', heartRate: 70, glucose: 93, sleep: 7.0, stress: 47 },
  { date: '2024-11-22', heartRate: 72, glucose: 95, sleep: 6.5, stress: 53 },
  { date: '2024-11-23', heartRate: 71, glucose: 94, sleep: 6.8, stress: 49 },
  { date: '2024-11-24', heartRate: 70, glucose: 92, sleep: 7.1, stress: 45 },
  { date: '2024-11-25', heartRate: 72, glucose: 95, sleep: 6.6, stress: 52 },
  { date: '2024-11-26', heartRate: 71, glucose: 94, sleep: 6.9, stress: 48 },
  { date: '2024-11-27', heartRate: 70, glucose: 93, sleep: 7.2, stress: 44 },
  { date: '2024-11-28', heartRate: 72, glucose: 95, sleep: 6.7, stress: 50 },
  { date: '2024-11-29', heartRate: 71, glucose: 94, sleep: 7.0, stress: 46 },
  { date: '2024-11-30', heartRate: 72, glucose: 95, sleep: 6.2, stress: 55 },
];

// Sleep Data (Last 7 Days)
export const SLEEP_DATA: SleepData[] = [
  { date: '2024-11-24', duration: 7.1, quality: 'good', deepSleep: 22, remSleep: 20, lightSleep: 52, awakeTime: 25, score: 78 },
  { date: '2024-11-25', duration: 6.6, quality: 'fair', deepSleep: 18, remSleep: 18, lightSleep: 58, awakeTime: 35, score: 68 },
  { date: '2024-11-26', duration: 6.9, quality: 'good', deepSleep: 20, remSleep: 19, lightSleep: 55, awakeTime: 28, score: 72 },
  { date: '2024-11-27', duration: 7.2, quality: 'excellent', deepSleep: 25, remSleep: 22, lightSleep: 48, awakeTime: 18, score: 85 },
  { date: '2024-11-28', duration: 6.7, quality: 'fair', deepSleep: 19, remSleep: 17, lightSleep: 57, awakeTime: 32, score: 70 },
  { date: '2024-11-29', duration: 7.0, quality: 'good', deepSleep: 21, remSleep: 20, lightSleep: 54, awakeTime: 24, score: 75 },
  { date: '2024-11-30', duration: 6.2, quality: 'fair', deepSleep: 17, remSleep: 16, lightSleep: 60, awakeTime: 40, score: 65 },
];

// Mood Entries
export const MOOD_ENTRIES: MoodEntry[] = [
  { id: 'mood-001', userId: 'user-001', mood: 'tired', intensity: 6, notes: 'Long day at work', timestamp: '2024-11-25T18:00:00Z' },
  { id: 'mood-002', userId: 'user-001', mood: 'calm', intensity: 7, notes: 'Evening meditation helped', timestamp: '2024-11-25T21:00:00Z' },
  { id: 'mood-003', userId: 'user-001', mood: 'anxious', intensity: 5, notes: 'Deadline pressure', timestamp: '2024-11-26T14:00:00Z' },
  { id: 'mood-004', userId: 'user-001', mood: 'neutral', intensity: 5, timestamp: '2024-11-26T20:00:00Z' },
  { id: 'mood-005', userId: 'user-001', mood: 'happy', intensity: 8, notes: 'Great workout!', timestamp: '2024-11-27T09:00:00Z' },
  { id: 'mood-006', userId: 'user-001', mood: 'calm', intensity: 8, notes: 'Good sleep', timestamp: '2024-11-27T19:00:00Z' },
  { id: 'mood-007', userId: 'user-001', mood: 'tired', intensity: 7, notes: 'Poor sleep last night', timestamp: '2024-11-28T07:00:00Z' },
  { id: 'mood-008', userId: 'user-001', mood: 'neutral', intensity: 6, timestamp: '2024-11-28T18:00:00Z' },
  { id: 'mood-009', userId: 'user-001', mood: 'calm', intensity: 7, timestamp: '2024-11-29T20:00:00Z' },
  { id: 'mood-010', userId: 'user-001', mood: 'anxious', intensity: 4, notes: 'Meeting tomorrow', timestamp: '2024-11-30T15:00:00Z' },
];

// 3D Body Model Zones
export const BODY_ZONES: BodyZone[] = [
  { id: 'zone-001', name: 'Heart', status: 'healthy', position: [0, 1.2, 0.3], description: 'Cardiovascular health is optimal', lastChecked: new Date().toISOString() },
  { id: 'zone-002', name: 'Brain', status: 'warning', position: [0, 1.6, 0.2], description: 'Elevated stress levels detected', lastChecked: new Date().toISOString() },
  { id: 'zone-003', name: 'Lungs', status: 'healthy', position: [0.15, 1.3, 0.25], description: 'Respiratory function normal', lastChecked: new Date().toISOString() },
  { id: 'zone-004', name: 'Liver', status: 'healthy', position: [0.1, 1.0, 0.2], description: 'Metabolic markers in range', lastChecked: new Date().toISOString() },
  { id: 'zone-005', name: 'Stomach', status: 'warning', position: [0, 0.9, 0.25], description: 'Mild digestive irregularities', lastChecked: new Date().toISOString() },
  { id: 'zone-006', name: 'Sleep Center', status: 'warning', position: [0, 1.6, -0.1], description: 'Sleep quality needs improvement', lastChecked: new Date().toISOString() },
];

// Health Score
export const CURRENT_HEALTH_SCORE: HealthScore = {
  overall: 78,
  breakdown: {
    cardiovascular: 85,
    metabolic: 80,
    sleep: 65,
    mental: 72,
    fitness: 88,
  },
  lastUpdated: new Date().toISOString(),
};

// Sample AI Conversation
export const SAMPLE_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'user',
    content: "I've been feeling really stressed about work lately. My sleep has been terrible.",
    timestamp: '2024-11-30T14:30:00Z',
    emotion: { primary: 'anxious', confidence: 0.85 },
  },
  {
    id: 'msg-002',
    role: 'assistant',
    content: "I can see from your data that your stress levels have been elevated this week, and your sleep quality has dropped to 65%. Your heart rate variability also suggests your body is working harder to recover. Let's work on this together. Have you tried the 4-7-8 breathing exercise before bed?",
    timestamp: '2024-11-30T14:31:00Z',
  },
  {
    id: 'msg-003',
    role: 'user',
    content: "I haven't been consistent with it. I just feel overwhelmed with deadlines.",
    timestamp: '2024-11-30T14:32:00Z',
    emotion: { primary: 'tired', confidence: 0.78 },
  },
  {
    id: 'msg-004',
    role: 'assistant',
    content: "That's completely understandable. Let me suggest a manageable approach: Start with just 2 minutes of breathing before bed tonight. I've also scheduled a gentle reminder for 9 PM. Based on your sleep patterns, going to bed by 10:30 PM could improve your deep sleep by an estimated 15%. Would you like me to set up a sleep optimization plan?",
    timestamp: '2024-11-30T14:33:00Z',
  },
];

// Risk Assessment
export const RISK_ASSESSMENT: RiskAssessment = {
  cardiovascular: { score: 85, risk: 'low' },
  mental: { score: 72, risk: 'moderate' },
  metabolic: { score: 80, risk: 'low' },
  sleep: { score: 65, risk: 'moderate' },
};

// Interventions
export const INTERVENTIONS: Intervention[] = [
  { id: 'int-001', title: 'Sleep Hygiene Protocol', description: 'Establish consistent sleep schedule, no screens 1h before bed', category: 'sleep', priority: 'high', timeline: '2 weeks', expectedImpact: '+15% sleep quality', completed: false },
  { id: 'int-002', title: 'Stress Management Routine', description: 'Daily 10-min meditation + breathing exercises', category: 'mental', priority: 'high', timeline: 'Ongoing', expectedImpact: '-20% stress score', completed: false },
  { id: 'int-003', title: 'Cardio Optimization', description: 'Increase weekly cardio to 150 minutes', category: 'exercise', priority: 'medium', timeline: '4 weeks', expectedImpact: '+5% cardiovascular score', completed: true },
  { id: 'int-004', title: 'Glucose Monitoring', description: 'Track post-meal glucose for 2 weeks', category: 'nutrition', priority: 'medium', timeline: '2 weeks', expectedImpact: 'Better metabolic understanding', completed: false },
  { id: 'int-005', title: 'Annual Physical', description: 'Schedule comprehensive health checkup', category: 'medical', priority: 'high', timeline: 'This month', expectedImpact: 'Baseline health assessment', completed: false },
];

// What-If Scenarios
export const WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  { id: 'scenario-001', name: 'Optimal Sleep', parameter: 'sleep', value: 8, duration: 30, projectedOutcome: { healthScoreChange: +8, lifeExpectancyChange: +1.2, riskReduction: { cardiovascular: 15, mental: 25, metabolic: 10 } } },
  { id: 'scenario-002', name: 'Daily Meditation', parameter: 'meditation', value: 20, duration: 30, projectedOutcome: { healthScoreChange: +5, lifeExpectancyChange: +0.8, riskReduction: { cardiovascular: 10, mental: 35, metabolic: 5 } } },
  { id: 'scenario-003', name: '10K Steps Daily', parameter: 'steps', value: 10000, duration: 30, projectedOutcome: { healthScoreChange: +6, lifeExpectancyChange: +1.0, riskReduction: { cardiovascular: 20, mental: 15, metabolic: 18 } } },
  { id: 'scenario-004', name: 'No Sugar Challenge', parameter: 'sugar', value: 0, duration: 30, projectedOutcome: { healthScoreChange: +4, lifeExpectancyChange: +0.6, riskReduction: { cardiovascular: 8, mental: 5, metabolic: 25 } } },
];

// Achievements
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-001', name: 'First Steps', description: 'Complete your first health check-in', icon: 'footprints', category: 'milestone', tier: 'bronze', unlockedAt: '2024-01-20T00:00:00Z', progress: 1, maxProgress: 1, unlocked: true },
  { id: 'ach-002', name: 'Sleep Warrior', description: 'Maintain 7+ hours sleep for 7 days', icon: 'moon', category: 'health', tier: 'silver', unlockedAt: '2024-02-15T00:00:00Z', progress: 7, maxProgress: 7, unlocked: true },
  { id: 'ach-003', name: 'Zen Master', description: 'Complete 50 meditation sessions', icon: 'sparkles', category: 'mental', tier: 'gold', progress: 42, maxProgress: 50, unlocked: false },
  { id: 'ach-004', name: 'Heart Healthy', description: 'Maintain optimal cardiovascular score for 30 days', icon: 'heart', category: 'health', tier: 'gold', unlockedAt: '2024-03-01T00:00:00Z', progress: 30, maxProgress: 30, unlocked: true },
  { id: 'ach-005', name: 'Data Donor', description: 'Share anonymized data for research', icon: 'database', category: 'social', tier: 'silver', unlockedAt: '2024-02-01T00:00:00Z', progress: 1, maxProgress: 1, unlocked: true },
  { id: 'ach-006', name: 'Stress Buster', description: 'Reduce stress score by 20%', icon: 'shield', category: 'mental', tier: 'platinum', progress: 15, maxProgress: 20, unlocked: false },
  { id: 'ach-007', name: 'Team Player', description: 'Join a health guild', icon: 'users', category: 'social', tier: 'bronze', unlockedAt: '2024-01-25T00:00:00Z', progress: 1, maxProgress: 1, unlocked: true },
  { id: 'ach-008', name: 'Early Bird', description: 'Wake up before 6 AM for 14 days', icon: 'sun', category: 'health', tier: 'silver', progress: 8, maxProgress: 14, unlocked: false },
];

// Guilds
export const GUILDS: Guild[] = [
  { 
    id: 'guild-001', 
    name: 'Code Warriors', 
    description: 'Tech professionals prioritizing health',
    members: [
      { userId: 'user-001', name: 'Alex Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen', contribution: 2450, role: 'member' },
      { userId: 'user-002', name: 'Sarah Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahKim', contribution: 3200, role: 'leader' },
      { userId: 'user-003', name: 'Mike Ross', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeRoss', contribution: 2800, role: 'officer' },
      { userId: 'user-004', name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaWilson', contribution: 2100, role: 'member' },
    ],
    totalScore: 10550,
    rank: 3,
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=CodeWarriors',
  },
  { 
    id: 'guild-002', 
    name: 'Mindful Movers', 
    description: 'Yoga and meditation enthusiasts',
    members: [
      { userId: 'user-005', name: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaPark', contribution: 4100, role: 'leader' },
      { userId: 'user-006', name: 'Tom Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TomChen', contribution: 3500, role: 'officer' },
    ],
    totalScore: 7600,
    rank: 1,
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=MindfulMovers',
  },
];

// Challenges
export const CHALLENGES: Challenge[] = [
  { id: 'chal-001', title: '7-Day Sleep Challenge', description: 'Get 7+ hours of quality sleep every night', type: 'weekly', category: 'sleep', target: 7, unit: 'nights', participants: 1247, endDate: '2024-12-07', reward: 'Sleep Master Badge', joined: true, progress: 3 },
  { id: 'chal-002', title: '10K Steps Daily', description: 'Walk 10,000 steps every day for 30 days', type: 'monthly', category: 'steps', target: 300000, unit: 'steps', participants: 3421, endDate: '2024-12-31', reward: 'Step Champion Badge', joined: false, progress: 0 },
  { id: 'chal-003', title: 'Mindful Minutes', description: 'Meditate for 100 minutes this week', type: 'weekly', category: 'meditation', target: 100, unit: 'minutes', participants: 892, endDate: '2024-12-07', reward: 'Zen Seeker Badge', joined: true, progress: 45 },
  { id: 'chal-004', title: 'Hydration Hero', description: 'Drink 2.5L water daily for 14 days', type: 'daily', category: 'hydration', target: 14, unit: 'days', participants: 2156, endDate: '2024-12-14', reward: 'Hydration Master Badge', joined: false, progress: 0 },
];

// Family Members
export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'fam-001', name: 'Mom', relationship: 'Mother', age: 58, healthScore: 82, conditions: ['Hypertension'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mom', sharedData: true },
  { id: 'fam-002', name: 'Dad', relationship: 'Father', age: 60, healthScore: 75, conditions: ['Diabetes Type 2'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dad', sharedData: true },
  { id: 'fam-003', name: 'Sister', relationship: 'Sister', age: 25, healthScore: 88, conditions: [], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sister', sharedData: false },
];

// Wearable Devices
export const WEARABLE_DEVICES: WearableDevice[] = [
  { id: 'wear-001', type: 'smartwatch', name: 'Apple Watch Series 9', connected: true, lastSync: new Date().toISOString(), batteryLevel: 78, dataTypes: ['heartRate', 'steps', 'sleep', 'bloodOxygen'] },
  { id: 'wear-002', type: 'ring', name: 'Oura Ring Gen 3', connected: true, lastSync: new Date().toISOString(), batteryLevel: 45, dataTypes: ['sleep', 'readiness', 'temperature'] },
  { id: 'wear-003', type: 'scale', name: 'Withings Body+', connected: false, lastSync: '2024-11-25T08:00:00Z', dataTypes: ['weight', 'bodyFat', 'muscleMass'] },
];

// Breathing Patterns
export const BREATHING_PATTERNS: BreathingPattern[] = [
  { name: '4-7-8 Relaxation', inhale: 4, hold: 7, exhale: 8, holdEmpty: 0, description: 'Calms the nervous system, reduces anxiety' },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, holdEmpty: 4, description: 'Used by Navy SEALs for focus and calm' },
  { name: 'Coherent Breathing', inhale: 5, hold: 0, exhale: 5, holdEmpty: 0, description: 'Optimizes heart rate variability' },
  { name: 'Energizing Breath', inhale: 2, hold: 0, exhale: 1, holdEmpty: 0, description: 'Increases alertness and energy' },
];

// CBT Exercises
export const CBT_EXERCISES: CBTExercise[] = [
  { 
    id: 'cbt-001', 
    title: 'Thought Record', 
    description: 'Identify and challenge negative thought patterns',
    category: 'thought_record',
    steps: [
      { order: 1, title: 'Situation', content: 'What happened? Where were you? Who were you with?', inputType: 'text' },
      { order: 2, title: 'Mood', content: 'How did you feel? Rate intensity (0-10)', inputType: 'scale' },
      { order: 3, title: 'Automatic Thoughts', content: 'What went through your mind? What did you think?', inputType: 'text' },
      { order: 4, title: 'Evidence For', content: 'What facts support this thought?', inputType: 'text' },
      { order: 5, title: 'Evidence Against', content: 'What facts contradict this thought?', inputType: 'text' },
      { order: 6, title: 'Balanced Thought', content: 'What\'s a more balanced perspective?', inputType: 'text' },
    ],
    estimatedDuration: 15,
  },
  { 
    id: 'cbt-002', 
    title: 'Behavioral Activation', 
    description: 'Schedule pleasant activities to improve mood',
    category: 'behavioral_activation',
    steps: [
      { order: 1, title: 'Activity Selection', content: 'Choose an activity you used to enjoy', inputType: 'text' },
      { order: 2, title: 'Schedule It', content: 'When will you do this activity?', inputType: 'text' },
      { order: 3, title: 'Anticipated Pleasure', content: 'Rate expected enjoyment (0-10)', inputType: 'scale' },
      { order: 4, title: 'Actual Pleasure', content: 'Rate actual enjoyment after completing (0-10)', inputType: 'scale' },
    ],
    estimatedDuration: 10,
  },
];

// Sleep Stories
export const SLEEP_STORIES: SleepStory[] = [
  { id: 'story-001', title: 'Journey to the Stars', description: 'A peaceful voyage through the cosmos', duration: 25, category: 'fantasy', audioUrl: '/audio/stars.mp3', thumbnailUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400' },
  { id: 'story-002', title: 'Rainforest Symphony', description: 'Immerse yourself in tropical sounds', duration: 30, category: 'nature', audioUrl: '/audio/rainforest.mp3', thumbnailUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400' },
  { id: 'story-003', title: 'Ocean Waves', description: 'Gentle waves lulling you to sleep', duration: 20, category: 'nature', audioUrl: '/audio/ocean.mp3', thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400' },
  { id: 'story-004', title: 'Mountain Retreat', description: 'A cozy cabin in the mountains', duration: 35, category: 'journey', audioUrl: '/audio/mountain.mp3', thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400' },
];

// Navigation Items
export const NAV_ITEMS: NavItem[] = [
  { id: 'nav-001', label: 'Dashboard', icon: 'layout-dashboard', path: '/', badge: 0 },
  { id: 'nav-002', label: 'AI Companion', icon: 'message-circle', path: '/chat', badge: 0 },
  { id: 'nav-003', label: 'Biometrics', icon: 'activity', path: '/biometrics', badge: 0 },
  { id: 'nav-004', label: 'Analytics', icon: 'line-chart', path: '/analytics', badge: 0 },
  { id: 'nav-005', label: 'Mental Health', icon: 'brain', path: '/mental-health', badge: 0 },
  { id: 'nav-006', label: 'Community', icon: 'users', path: '/community', badge: 2 },
];

// Crisis Resources
export const CRISIS_RESOURCES = [
  { name: 'National Suicide Prevention Lifeline', phone: '988', description: '24/7 free and confidential support' },
  { name: 'Crisis Text Line', phone: '741741', description: 'Text HOME to connect with a counselor' },
  { name: 'SAMHSA Helpline', phone: '1-800-662-4357', description: 'Treatment referral and information' },
];

// Theme Colors
export const THEME_COLORS = {
  primary: '#00D9FF',
  secondary: '#7000FF',
  accent: '#FF00A0',
  success: '#00FF88',
  warning: '#FFB800',
  danger: '#FF4444',
  info: '#00D9FF',
  background: '#0A0F1C',
  surface: '#111827',
  surfaceLight: '#1F2937',
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
};

// Animation Durations
export const ANIMATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};

// API Endpoints
export const API_ENDPOINTS = {
  user: '/api/user',
  vitals: '/api/vitals',
  sleep: '/api/sleep',
  mood: '/api/mood',
  chat: '/api/chat',
  achievements: '/api/achievements',
  guilds: '/api/guilds',
  challenges: '/api/challenges',
  interventions: '/api/interventions',
  analytics: '/api/analytics',
};
