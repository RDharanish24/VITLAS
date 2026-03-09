import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, ChatSession, DetectedEmotion } from '@/types';
import { SAMPLE_CHAT_MESSAGES } from '@/lib/constants';

interface ChatState {
  messages: ChatMessage[];
  sessions: ChatSession[];
  currentSession: string | null;
  isTyping: boolean;
  detectedEmotion: DetectedEmotion | null;
  crisisDetected: boolean;
  voiceInputEnabled: boolean;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  setTyping: (typing: boolean) => void;
  setDetectedEmotion: (emotion: DetectedEmotion | null) => void;
  setCrisisDetected: (detected: boolean) => void;
  toggleVoiceInput: () => void;
  startNewSession: () => void;
  loadSession: (sessionId: string) => void;
  reset: () => void;
}

const initialState = {
  messages: SAMPLE_CHAT_MESSAGES,
  sessions: [],
  currentSession: null,
  isTyping: false,
  detectedEmotion: null,
  crisisDetected: false,
  voiceInputEnabled: false,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      
      setMessages: (messages) => set({ messages }),
      
      clearMessages: () => set({ messages: [] }),
      
      setTyping: (isTyping) => set({ isTyping }),
      
      setDetectedEmotion: (emotion) => set({ detectedEmotion: emotion }),
      
      setCrisisDetected: (crisisDetected) => set({ crisisDetected }),
      
      toggleVoiceInput: () => set((state) => ({
        voiceInputEnabled: !state.voiceInputEnabled,
      })),
      
      startNewSession: () => {
        const newSession: ChatSession = {
          id: `session-${Date.now()}`,
          userId: 'user-001',
          messages: [],
          startedAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
        };
        
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSession: newSession.id,
          messages: [],
        }));
      },
      
      loadSession: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (session) {
          set({
            currentSession: sessionId,
            messages: session.messages,
          });
        }
      },
      
      reset: () => set(initialState),
    }),
    {
      name: 'vitalis-chat-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSession: state.currentSession,
      }),
    }
  )
);
