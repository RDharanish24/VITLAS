import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Activity, 
  LineChart, 
  Brain, 
  Users,
  Menu,
  X,
  Settings,
  Bell,
  Zap
} from 'lucide-react';
import { useUIStore, useUserStore } from '@/stores';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'chat', label: 'AI Companion', icon: MessageCircle, path: '/chat' },
  { id: 'biometrics', label: 'Biometrics', icon: Activity, path: '/biometrics' },
  { id: 'analytics', label: 'Analytics', icon: LineChart, path: '/analytics' },
  { id: 'mental-health', label: 'Mental Health', icon: Brain, path: '/mental-health' },
  { id: 'community', label: 'Community', icon: Users, path: '/community', badge: 2 },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, reducedMotion } = useUIStore();
  const { user } = useUserStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 280 : 80,
          x: 0 
        }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-screen z-50',
          'bg-dark-surface/90 backdrop-blur-xl',
          'border-r border-white/5',
          'flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="logo-expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display text-white">VITALIS</h1>
                  <p className="text-xs text-neon-cyan">AI Health OS</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mx-auto"
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors lg:block hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl',
                    'transition-all duration-200',
                    'hover:bg-white/5',
                    isActive && 'bg-gradient-to-r from-neon-cyan/20 to-transparent border-l-2 border-neon-cyan'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg',
                    isActive ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-400'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center justify-between flex-1 overflow-hidden"
                      >
                        <span className={cn(
                          'font-medium whitespace-nowrap',
                          isActive ? 'text-white' : 'text-gray-400'
                        )}>
                          {item.label}
                        </span>
                        
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-neon-pink/20 text-neon-pink rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-neon-cyan/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.occupation}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!sidebarOpen && (
            <div className="flex flex-col items-center gap-2">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-neon-cyan/30"
              />
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};
