import { http, HttpResponse, delay } from 'msw';
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
import {
  CURRENT_USER,
  CURRENT_VITALS,
  SLEEP_DATA,
  MOOD_ENTRIES,
  ACHIEVEMENTS,
  GUILDS,
  CHALLENGES,
  INTERVENTIONS,
  RISK_ASSESSMENT,
  WHAT_IF_SCENARIOS,
  CURRENT_HEALTH_SCORE,
} from '@/lib/constants';

// Helper to create API response
const createResponse = <T>(data: T, success = true, message?: string): ApiResponse<T> => ({
  success,
  data,
  message,
});

// Simulate network delay
const simulateDelay = async (ms = 300) => await delay(ms);

export const handlers = [
  // ============ USER API ============
  
  // Get current user
  http.get('/api/user', async () => {
    await simulateDelay(200);
    return HttpResponse.json(createResponse<User>(CURRENT_USER));
  }),
  
  // Update user
  http.patch('/api/user', async ({ request }) => {
    await simulateDelay(300);
    const updates = await request.json() as Partial<User>;
    const updatedUser = { ...CURRENT_USER, ...updates, updatedAt: new Date().toISOString() };
    return HttpResponse.json(createResponse<User>(updatedUser));
  }),
  
  // ============ VITALS API ============
  
  // Get current vitals
  http.get('/api/vitals/current', async () => {
    await simulateDelay(150);
    // Simulate slight variations in vitals
    const vitals = {
      ...CURRENT_VITALS,
      vitals: {
        ...CURRENT_VITALS.vitals,
        heartRate: CURRENT_VITALS.vitals.heartRate + Math.floor(Math.random() * 6) - 3,
      },
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(createResponse<VitalSnapshot>(vitals));
  }),
  
  // Get vitals history
  http.get('/api/vitals/history', async ({ request }) => {
    await simulateDelay(300);
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    
    // Generate historical data
    const history = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        heartRate: 70 + Math.floor(Math.random() * 10),
        glucose: 92 + Math.floor(Math.random() * 10),
        sleep: 6 + Math.random() * 2,
        stress: 40 + Math.floor(Math.random() * 30),
      };
    });
    
    return HttpResponse.json(createResponse(history));
  }),
  
  // Add vital entry
  http.post('/api/vitals', async ({ request }) => {
    await simulateDelay(400);
    const entry = await request.json() as VitalSnapshot;
    return HttpResponse.json(createResponse<VitalSnapshot>({
      ...entry,
      id: `vitals-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }));
  }),
  
  // ============ SLEEP API ============
  
  // Get sleep data
  http.get('/api/sleep', async ({ request }) => {
    await simulateDelay(250);
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '7');
    return HttpResponse.json(createResponse<SleepData[]>(SLEEP_DATA.slice(0, days)));
  }),
  
  // Add sleep entry
  http.post('/api/sleep', async ({ request }) => {
    await simulateDelay(350);
    const entry = await request.json() as SleepData;
    return HttpResponse.json(createResponse<SleepData>(entry));
  }),
  
  // ============ MOOD API ============
  
  // Get mood entries
  http.get('/api/mood', async ({ request }) => {
    await simulateDelay(200);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    return HttpResponse.json(createResponse<MoodEntry[]>(MOOD_ENTRIES.slice(0, limit)));
  }),
  
  // Add mood entry
  http.post('/api/mood', async ({ request }) => {
    await simulateDelay(400);
    const entry = await request.json() as Omit<MoodEntry, 'id'>;
    const newEntry: MoodEntry = {
      ...entry,
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(createResponse<MoodEntry>(newEntry));
  }),
  
  // ============ CHAT API ============
  
  // Send message to AI
  http.post('/api/chat', async ({ request }) => {
    await simulateDelay(1000); // Simulate AI thinking
    const { content } = await request.json() as { content: string };
    
    // Simple emotion detection
    const emotions = ['anxious', 'calm', 'tired', 'stressed', 'happy', 'neutral'] as const;
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    // Check for crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself'];
    const crisisDetected = crisisKeywords.some(kw => content.toLowerCase().includes(kw));
    
    // Generate contextual response
    let response: string;
    
    if (crisisDetected) {
      response = "I'm really concerned about what you're sharing. Your safety is the most important thing right now. Please reach out to the National Suicide Prevention Lifeline at 988 or text HOME to 741741. You're not alone, and there are people who want to help.";
    } else if (content.toLowerCase().includes('sleep')) {
      response = "I can see from your data that sleep has been a challenge. Your average sleep duration this week is 6.5 hours, which is below the recommended 7-9 hours. Would you like me to create a personalized sleep improvement plan?";
    } else if (content.toLowerCase().includes('stress') || content.toLowerCase().includes('anxious')) {
      response = "I notice your stress levels have been elevated. Let's try a quick breathing exercise together. Would you like me to guide you through a 2-minute relaxation technique?";
    } else if (content.toLowerCase().includes('exercise') || content.toLowerCase().includes('workout')) {
      response = "Great job staying active! Your heart rate data shows you've been consistent with exercise. Keep it up - regular physical activity is one of the best things for both physical and mental health.";
    } else {
      response = "Thank you for sharing that with me. I'm here to support your health journey. Based on your recent data, you're making good progress overall. Is there anything specific you'd like to work on today?";
    }
    
    const aiMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      emotion: { primary: detectedEmotion, confidence: 0.85 },
      crisisDetected,
    };
    
    return HttpResponse.json(createResponse<ChatMessage>(aiMessage));
  }),
  
  // Get chat history
  http.get('/api/chat/history', async () => {
    await simulateDelay(300);
    return HttpResponse.json(createResponse<ChatMessage[]>([]));
  }),
  
  // ============ ACHIEVEMENTS API ============
  
  // Get achievements
  http.get('/api/achievements', async () => {
    await simulateDelay(250);
    return HttpResponse.json(createResponse<Achievement[]>(ACHIEVEMENTS));
  }),
  
  // Unlock achievement
  http.post('/api/achievements/:id/unlock', async ({ params }) => {
    await simulateDelay(400);
    const achievement = ACHIEVEMENTS.find(a => a.id === params.id);
    if (achievement) {
      return HttpResponse.json(createResponse<Achievement>({
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      }));
    }
    return HttpResponse.json(createResponse(null, false, 'Achievement not found'), { status: 404 });
  }),
  
  // ============ GUILDS API ============
  
  // Get guilds
  http.get('/api/guilds', async () => {
    await simulateDelay(300);
    return HttpResponse.json(createResponse<Guild[]>(GUILDS));
  }),
  
  // Join guild
  http.post('/api/guilds/:id/join', async ({ params }) => {
    await simulateDelay(500);
    const guild = GUILDS.find(g => g.id === params.id);
    if (guild) {
      return HttpResponse.json(createResponse<Guild>(guild));
    }
    return HttpResponse.json(createResponse(null, false, 'Guild not found'), { status: 404 });
  }),
  
  // ============ CHALLENGES API ============
  
  // Get challenges
  http.get('/api/challenges', async ({ request }) => {
    await simulateDelay(250);
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    let challenges = CHALLENGES;
    if (type) {
      challenges = challenges.filter(c => c.type === type);
    }
    
    return HttpResponse.json(createResponse<Challenge[]>(challenges));
  }),
  
  // Join challenge
  http.post('/api/challenges/:id/join', async ({ params }) => {
    await simulateDelay(400);
    const challenge = CHALLENGES.find(c => c.id === params.id);
    if (challenge) {
      return HttpResponse.json(createResponse<Challenge>({
        ...challenge,
        joined: true,
      }));
    }
    return HttpResponse.json(createResponse(null, false, 'Challenge not found'), { status: 404 });
  }),
  
  // Update challenge progress
  http.patch('/api/challenges/:id/progress', async ({ request, params }) => {
    await simulateDelay(300);
    const { progress } = await request.json() as { progress: number };
    const challenge = CHALLENGES.find(c => c.id === params.id);
    if (challenge) {
      return HttpResponse.json(createResponse<Challenge>({
        ...challenge,
        progress,
      }));
    }
    return HttpResponse.json(createResponse(null, false, 'Challenge not found'), { status: 404 });
  }),
  
  // ============ ANALYTICS API ============
  
  // Get risk assessment
  http.get('/api/analytics/risk', async () => {
    await simulateDelay(400);
    return HttpResponse.json(createResponse<RiskAssessment>(RISK_ASSESSMENT));
  }),
  
  // Get health score
  http.get('/api/analytics/health-score', async () => {
    await simulateDelay(300);
    return HttpResponse.json(createResponse(CURRENT_HEALTH_SCORE));
  }),
  
  // Get future simulation
  http.get('/api/analytics/future-simulation', async ({ request }) => {
    await simulateDelay(600);
    const url = new URL(request.url);
    const years = parseInt(url.searchParams.get('years') || '10');
    
    const simulation: FutureSimulation = {
      currentAge: 28,
      projectedAge: 28 + years,
      healthScore: Math.max(50, CURRENT_HEALTH_SCORE.overall - years * 2),
      lifeExpectancy: 85,
      recommendations: [
        'Maintain regular exercise routine',
        'Improve sleep quality to 7+ hours',
        'Practice daily stress management',
        'Regular health checkups',
      ],
      visualization: '/models/future-self.glb',
    };
    
    return HttpResponse.json(createResponse<FutureSimulation>(simulation));
  }),
  
  // Get what-if scenarios
  http.get('/api/analytics/scenarios', async () => {
    await simulateDelay(350);
    return HttpResponse.json(createResponse<WhatIfScenario[]>(WHAT_IF_SCENARIOS));
  }),
  
  // Run what-if scenario
  http.post('/api/analytics/scenarios/:id/run', async ({ params }) => {
    await simulateDelay(800);
    const scenario = WHAT_IF_SCENARIOS.find(s => s.id === params.id);
    if (scenario) {
      return HttpResponse.json(createResponse(scenario.projectedOutcome));
    }
    return HttpResponse.json(createResponse(null, false, 'Scenario not found'), { status: 404 });
  }),
  
  // ============ INTERVENTIONS API ============
  
  // Get interventions
  http.get('/api/interventions', async () => {
    await simulateDelay(300);
    return HttpResponse.json(createResponse<Intervention[]>(INTERVENTIONS));
  }),
  
  // Complete intervention
  http.post('/api/interventions/:id/complete', async ({ params }) => {
    await simulateDelay(400);
    const intervention = INTERVENTIONS.find(i => i.id === params.id);
    if (intervention) {
      return HttpResponse.json(createResponse<Intervention>({
        ...intervention,
        completed: true,
      }));
    }
    return HttpResponse.json(createResponse(null, false, 'Intervention not found'), { status: 404 });
  }),
  
  // ============ WEARABLES API ============
  
  // Get connected wearables
  http.get('/api/wearables', async () => {
    await simulateDelay(250);
    return HttpResponse.json(createResponse([]));
  }),
  
  // Sync wearable
  http.post('/api/wearables/:id/sync', async () => {
    await simulateDelay(1000);
    return HttpResponse.json(createResponse({ success: true, syncedAt: new Date().toISOString() }));
  }),
];
