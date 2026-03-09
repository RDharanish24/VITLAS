import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ChevronRight,
    TrendingUp,
    Calendar,
    Shield
} from 'lucide-react';
import { GlassCard, HealthScoreRing, VitalCard } from '@/components/ui-custom';
import { useHealthStore, useUIStore } from '@/stores';
import { useCurrentVitals, useHealthScore } from '@/api/queries';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { VITAL_TRENDS } from '@/lib/constants';

// 3D Body Model Component (simplified visualization)
const BodyModel = () => {
    const { bodyZones } = useHealthStore();

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Simplified body silhouette with status indicators */}
            <svg viewBox="0 0 200 400" className="h-80 w-auto">
                {/* Body outline */}
                <defs>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0, 217, 255, 0.2)" />
                        <stop offset="100%" stopColor="rgba(112, 0, 255, 0.2)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Head */}
                <circle cx="100" cy="40" r="25" fill="url(#bodyGradient)" stroke="rgba(0, 217, 255, 0.5)" strokeWidth="2" />

                {/* Torso */}
                <ellipse cx="100" cy="150" rx="45" ry="70" fill="url(#bodyGradient)" stroke="rgba(0, 217, 255, 0.5)" strokeWidth="2" />

                {/* Arms */}
                <path d="M55 100 L30 200" stroke="rgba(0, 217, 255, 0.5)" strokeWidth="15" strokeLinecap="round" fill="none" />
                <path d="M145 100 L170 200" stroke="rgba(0, 217, 255, 0.5)" strokeWidth="15" strokeLinecap="round" fill="none" />

                {/* Legs */}
                <path d="M80 220 L70 350" stroke="rgba(0, 217, 255, 0.5)" strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d="M120 220 L130 350" stroke="rgba(0, 217, 255, 0.5)" strokeWidth="18" strokeLinecap="round" fill="none" />

                {/* Status indicators for zones */}
                {bodyZones.map((zone) => {
                    const colors = {
                        healthy: '#00FF88',
                        warning: '#FFB800',
                        critical: '#FF4444',
                    };

                    // Map zone positions to SVG coordinates
                    const positions = {
                        'zone-001': [100, 130], // Heart
                        'zone-002': [100, 40], // Brain
                        'zone-003': [115, 110], // Lungs
                        'zone-004': [110, 160], // Liver
                        'zone-005': [100, 180], // Stomach
                        'zone-006': [130, 30], // Sleep Center
                    };

                    const pos = positions[zone.id] || [100, 150];

                    return (
                        <g key={zone.id}>
                            <circle
                                cx={pos[0]}
                                cy={pos[1]}
                                r="8"
                                fill={colors[zone.status]}
                                filter="url(#glow)"
                                className="animate-pulse"
                            />
                            <circle
                                cx={pos[0]}
                                cy={pos[1]}
                                r="12"
                                fill="none"
                                stroke={colors[zone.status]}
                                strokeWidth="2"
                                opacity="0.5"
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Zone labels */}
            <div className="absolute right-4 top-4 space-y-2">
                {bodyZones.map((zone) => {
                    const colors = {
                        healthy: 'bg-neon-green',
                        warning: 'bg-neon-yellow',
                        critical: 'bg-neon-red',
                    };

                    return (
                        <div key={zone.id} className="flex items-center gap-2 text-xs">
                            <span className={cn('w-2 h-2 rounded-full', colors[zone.status])} />
                            <span className="text-gray-400">{zone.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Emergency SOS Button
const SOSButton = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { setEmergencyMode } = useUIStore();

    const handleSOS = () => {
        if (!showConfirm) {
            setShowConfirm(true);
            setTimeout(() => setShowConfirm(false), 3000);
        } else {
            setEmergencyMode(true);
            // In real app, this would trigger emergency services
            alert('Emergency services contacted. Help is on the way.');
        }
    };

    return (
        <motion.button
            onClick={handleSOS}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                'relative px-8 py-4 rounded-full font-bold text-lg',
                'bg-gradient-to-r from-neon-red to-neon-pink',
                'text-white shadow-lg',
                'transition-all duration-300',
                showConfirm && 'ring-4 ring-neon-red/50'
            )}
            style={{
                boxShadow: '0 0 20px rgba(255, 68, 68, 0.5), 0 0 40px rgba(255, 68, 68, 0.3)',
            }}
        >
            <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {showConfirm ? 'TAP AGAIN TO CONFIRM' : 'EMERGENCY SOS'}
            </span>

            {/* Pulsing rings */}
            <span className="absolute inset-0 rounded-full animate-ping bg-neon-red/30" />
        </motion.button>
    );
};

export const Dashboard = () => {
    const { currentVitals } = useHealthStore();
    const { data: vitalsData } = useCurrentVitals();
    const { data: healthScoreData } = useHealthScore();

    const vitals = vitalsData || currentVitals;
    const healthScore = healthScoreData || { overall: 78, breakdown: { cardiovascular: 85, metabolic: 80, sleep: 65, mental: 72, fitness: 88 } };

    // Prepare chart data
    const chartData = VITAL_TRENDS.slice(-14).map(d => ({
        date: d.date.slice(5),
        heartRate: d.heartRate,
        sleep: d.sleep,
        stress: d.stress,
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">Health Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, Alex. Here's your health overview.</p>
                </div>
                <SOSButton />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Health Score & Body Model */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Health Score */}
                    <GlassCard className="p-6 flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-white mb-4">Health Score</h2>
                        <HealthScoreRing score={healthScore.overall} size={180} strokeWidth={10} />

                        {/* Score Breakdown */}
                        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                            {Object.entries(healthScore.breakdown).map(([key, value]) => (
                                <div key={key} className="text-center">
                                    <p className="text-2xl font-bold font-display" style={{
                                        color: value >= 80 ? '#00FF88' : value >= 60 ? '#00D9FF' : value >= 40 ? '#FFB800' : '#FF4444'
                                    }}>
                                        {value}
                                    </p>
                                    <p className="text-xs text-gray-400 capitalize">{key}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* 3D Body Model */}
                    <GlassCard className="p-6 h-96">
                        <h2 className="text-lg font-semibold text-white mb-4">Body Status</h2>
                        <BodyModel />
                    </GlassCard>
                </div>

                {/* Middle & Right Columns - Vitals & Charts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Vital Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <VitalCard
                            title="Heart Rate"
                            value={vitals?.vitals.heartRate || 72}
                            unit="bpm"
                            trend={VITAL_TRENDS.slice(-7).map(d => d.heartRate)}
                            trendDirection="down"
                            trendValue="-3%"
                            icon="heart"
                            status="healthy"
                            delay={0}
                        />
                        <VitalCard
                            title="Glucose"
                            value={vitals?.vitals.glucose || 95}
                            unit="mg/dL"
                            trend={VITAL_TRENDS.slice(-7).map(d => d.glucose)}
                            trendDirection="neutral"
                            trendValue="Stable"
                            icon="glucose"
                            status="healthy"
                            delay={0.1}
                        />
                        <VitalCard
                            title="Sleep"
                            value={6.2}
                            unit="hrs"
                            trend={VITAL_TRENDS.slice(-7).map(d => d.sleep)}
                            trendDirection="up"
                            trendValue="+8%"
                            icon="sleep"
                            status="warning"
                            delay={0.2}
                        />
                        <VitalCard
                            title="Stress"
                            value="Moderate"
                            trend={VITAL_TRENDS.slice(-7).map(d => d.stress)}
                            trendDirection="down"
                            trendValue="-12%"
                            icon="stress"
                            status="warning"
                            delay={0.3}
                        />
                    </div>

                    {/* Health Trends Chart */}
                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Health Trends</h2>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1 text-neon-cyan">
                                    <span className="w-2 h-2 rounded-full bg-neon-cyan" />
                                    Heart Rate
                                </span>
                                <span className="flex items-center gap-1 text-neon-purple">
                                    <span className="w-2 h-2 rounded-full bg-neon-purple" />
                                    Sleep
                                </span>
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#00D9FF" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7000FF" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#7000FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#374151" fontSize={12} />
                                    <YAxis stroke="#374151" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#111827',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="heartRate"
                                        stroke="#00D9FF"
                                        strokeWidth={2}
                                        fill="url(#heartRateGradient)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sleep"
                                        stroke="#7000FF"
                                        strokeWidth={2}
                                        fill="url(#sleepGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <GlassCard hover glow="cyan" className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-neon-cyan/20">
                                    <Calendar className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Schedule Checkup</p>
                                    <p className="text-sm text-gray-400">Next: Jan 15</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                            </div>
                        </GlassCard>

                        <GlassCard hover glow="purple" className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-neon-purple/20">
                                    <TrendingUp className="w-6 h-6 text-neon-purple" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">View Trends</p>
                                    <p className="text-sm text-gray-400">30-day analysis</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                            </div>
                        </GlassCard>

                        <GlassCard hover glow="green" className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-neon-green/20">
                                    <Shield className="w-6 h-6 text-neon-green" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Health Goals</p>
                                    <p className="text-sm text-gray-400">3 of 5 completed</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
