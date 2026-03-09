import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ToastMessage } from '@/types';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  
  // Current Page
  currentPage: string;
  
  // Modal
  modalOpen: boolean;
  modalContent: string | null;
  modalData: unknown | null;
  
  // Toast
  toasts: ToastMessage[];
  
  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  
  // Theme
  theme: 'dark' | 'light' | 'system';
  
  // Emergency
  emergencyMode: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  openModal: (content: string, data?: unknown) => void;
  closeModal: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setEmergencyMode: (mode: boolean) => void;
  reset: () => void;
}

const initialState = {
  sidebarOpen: true,
  currentPage: '/',
  modalOpen: false,
  modalContent: null,
  modalData: null,
  toasts: [],
  reducedMotion: false,
  highContrast: false,
  theme: 'dark' as const,
  emergencyMode: false,
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      
      setCurrentPage: (currentPage) => set({ currentPage }),
      
      openModal: (modalContent, modalData) => set({
        modalOpen: true,
        modalContent,
        modalData,
      }),
      
      closeModal: () => set({
        modalOpen: false,
        modalContent: null,
        modalData: null,
      }),
      
      addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        const newToast = { ...toast, id };
        
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));
        
        // Auto-remove toast after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },
      
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),
      
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
      
      setTheme: (theme) => set({ theme }),
      
      setEmergencyMode: (emergencyMode) => set({ emergencyMode }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'vitalis-ui-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        theme: state.theme,
      }),
    }
  )
);
