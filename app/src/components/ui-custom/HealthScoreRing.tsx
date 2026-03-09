import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HealthScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const HealthScoreRing: React.FC<HealthScoreRingProps> = ({
  score,
  size = 200,
  strokeWidth = 12,
  className,
  showLabel = true,
  animated = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return '#00FF88'; // Green
    if (s >= 60) return '#00D9FF'; // Cyan
    if (s >= 40) return '#FFB800'; // Yellow
    return '#FF4444'; // Red
  };

  const scoreColor = getScoreColor(score);

  // Get score label
  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ backgroundColor: scoreColor }}
      />
      
      {/* SVG Ring */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={scoreColor} />
            <stop offset="100%" stopColor={scoreColor} stopOpacity={0.6} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : undefined}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          filter="url(#glow)"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold font-display"
          style={{ color: scoreColor, textShadow: `0 0 20px ${scoreColor}` }}
          initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {score}
        </motion.span>
        {showLabel && (
          <span className="text-sm text-gray-400 mt-1">{getScoreLabel(score)}</span>
        )}
      </div>
    </div>
  );
};
