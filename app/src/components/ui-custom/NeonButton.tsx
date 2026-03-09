import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'red' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className,
  onClick,
  disabled = false,
  type = 'button',
  icon,
}) => {
  const variantStyles = {
    cyan: {
      base: 'from-neon-cyan/20 to-neon-purple/20 border-neon-cyan/40 text-neon-cyan',
      hover: 'hover:from-neon-cyan/30 hover:to-neon-purple/30 hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]',
    },
    purple: {
      base: 'from-neon-purple/20 to-neon-pink/20 border-neon-purple/40 text-neon-purple',
      hover: 'hover:from-neon-purple/30 hover:to-neon-pink/30 hover:border-neon-purple hover:shadow-[0_0_20px_rgba(112,0,255,0.4)]',
    },
    pink: {
      base: 'from-neon-pink/20 to-neon-cyan/20 border-neon-pink/40 text-neon-pink',
      hover: 'hover:from-neon-pink/30 hover:to-neon-cyan/30 hover:border-neon-pink hover:shadow-[0_0_20px_rgba(255,0,160,0.4)]',
    },
    green: {
      base: 'from-neon-green/20 to-neon-cyan/20 border-neon-green/40 text-neon-green',
      hover: 'hover:from-neon-green/30 hover:to-neon-cyan/30 hover:border-neon-green hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]',
    },
    red: {
      base: 'from-neon-red/20 to-neon-pink/20 border-neon-red/40 text-neon-red',
      hover: 'hover:from-neon-red/30 hover:to-neon-pink/30 hover:border-neon-red hover:shadow-[0_0_20px_rgba(255,68,68,0.4)]',
    },
    white: {
      base: 'from-white/10 to-white/5 border-white/30 text-white',
      hover: 'hover:from-white/20 hover:to-white/10 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]',
    },
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        'relative overflow-hidden rounded-xl font-medium',
        'bg-gradient-to-br border',
        'transition-all duration-300',
        'flex items-center justify-center gap-2',
        variantStyles[variant].base,
        !disabled && variantStyles[variant].hover,
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};
