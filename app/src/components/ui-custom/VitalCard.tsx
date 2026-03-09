import { Activity, Droplets, Moon, Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { SparklineChart } from './SparklineChart';
import { cn } from '@/lib/utils';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number[];
  trendDirection?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: 'heart' | 'glucose' | 'sleep' | 'stress' | 'activity';
  status?: 'healthy' | 'warning' | 'critical' | 'neutral';
  delay?: number;
  onClick?: () => void;
}

export const VitalCard: React.FC<VitalCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendDirection = 'neutral',
  trendValue,
  icon,
  status = 'neutral',
  delay = 0,
  onClick,
}) => {
  const iconMap = {
    heart: Activity,
    glucose: Droplets,
    sleep: Moon,
    stress: Brain,
    activity: Activity,
  };

  const Icon = iconMap[icon];

  const statusColors = {
    healthy: 'text-neon-green',
    warning: 'text-neon-yellow',
    critical: 'text-neon-red',
    neutral: 'text-neon-cyan',
  };



  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;
  const trendColor = trendDirection === 'up' ? 'text-neon-green' : trendDirection === 'down' ? 'text-neon-red' : 'text-gray-400';

  return (
    <GlassCard hover glow="cyan" delay={delay} onClick={onClick} className={cn('p-4', onClick && 'cursor-pointer')}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-xl',
            'bg-gradient-to-br from-white/10 to-white/5',
            statusColors[status]
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className={cn('text-2xl font-bold font-display', statusColors[status])}>
                {value}
              </span>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
          </div>
        </div>
        
        {trend && (
          <div className="w-24">
            <SparklineChart 
              data={trend} 
              width={96} 
              height={32} 
              color={status === 'healthy' ? '#00FF88' : status === 'warning' ? '#FFB800' : status === 'critical' ? '#FF4444' : '#00D9FF'}
            />
          </div>
        )}
      </div>
      
      {trendValue && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
          <TrendIcon className={cn('w-4 h-4', trendColor)} />
          <span className={cn('text-sm', trendColor)}>{trendValue}</span>
          <span className="text-sm text-gray-500">vs last week</span>
        </div>
      )}
    </GlassCard>
  );
};
