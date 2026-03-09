import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'cyan' | 'purple' | 'pink' | 'green' | 'none';
  onClick?: () => void;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = true,
  glow = 'none',
  onClick,
  delay = 0,
}) => {
  const glowStyles = {
    cyan: 'hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:border-neon-cyan/30',
    purple: 'hover:shadow-[0_0_20px_rgba(112,0,255,0.3)] hover:border-neon-purple/30',
    pink: 'hover:shadow-[0_0_20px_rgba(255,0,160,0.3)] hover:border-neon-pink/30',
    green: 'hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:border-neon-green/30',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-white/[0.08] to-white/[0.03]',
        'backdrop-blur-xl border border-white/[0.08]',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
        hover && 'transition-all duration-300',
        hover && 'hover:from-white/[0.12] hover:to-white/[0.05]',
        glowStyles[glow],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
