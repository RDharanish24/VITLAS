import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import {
    Calendar,
    Activity,
    Zap,
    Play,
    ChevronRight,
    Info
} from 'lucide-react';
import { GlassCard, NeonButton } from '@/components/ui-custom';
import { useRiskAssessment, useWhatIfScenarios, useRunScenario, useFutureSimulation } from '@/api/queries';
import { cn } from '@/lib/utils';
import { INTERVENTIONS, WHAT_IF_SCENARIOS } from '@/lib/constants';

// Risk Radar Chart
const RiskRadar = ({ data }) => {
    const chartData = [
        { subject: 'Cardiovascular', A: data.cardiovascular.score, fullMark: 100 },
        { subject: 'Mental Health', A: data.mental.score, fullMark: 100 },
        { subject: 'Metabolic', A: data.metabolic.score, fullMark: 100 },
        { subject: 'Sleep', A: data.sleep.score, fullMark: 100 },
    ];

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Your Health"
                        dataKey="A"
                        stroke="#00D9FF"
                        strokeWidth={2}
                        fill="#00D9FF"
                        fillOpacity={0.3}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#111827',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Future Self Simulation
const FutureSimulation = () => {
    const [years, setYears] = useState(10);
    const { data: simulation, isLoading } = useFutureSimulation(years);

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-white">Future Self Simulation</h2>
                    <p className="text-sm text-gray-400">See how your habits shape your future</p>
                </div>
                <div className="flex items-center gap-2">
                    {[5, 10, 20].map((y) => (
                        <button
                            key={y}
                            onClick={() => setYears(y)}
                            className={cn(
                                'px-3 py-1 rounded-lg text-sm transition-colors',
                                years === y
                                    ? 'bg-neon-cyan/20 text-neon-cyan'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            )}
                        >
                            {y}Y
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="h-48 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
                </div>
            ) : simulation ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl font-bold text-neon-cyan">{simulation.projectedAge}</span>
                        </div>
                        <p className="text-sm text-gray-400">Projected Age</p>
                    </div>

                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl font-bold text-neon-green">{simulation.healthScore}</span>
                        </div>
                        <p className="text-sm text-gray-400">Health Score</p>
                    </div>

                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center mx-auto mb-3">
                            <span className="text-3xl font-bold text-neon-purple">{simulation.lifeExpectancy}</span>
                        </div>
                        <p className="text-sm text-gray-400">Life Expectancy</p>
                    </div>
                </div>
            ) : null}

            {/* Recommendations */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-sm font-medium text-white mb-3">Recommendations for Better Future</h3>
                <div className="space-y-2">
                    {simulation?.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                            <ChevronRight className="w-4 h-4 text-neon-cyan" />
                            {rec}
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
};

// What-If Scenario Card
const ScenarioCard = ({ scenario }) => {
    const runScenario = useRunScenario();
    const [result, setResult] = useState(null);

    const handleRun = async () => {
        const outcome = await runScenario.mutateAsync(scenario.id);
        setResult(outcome);
    };

    return (
        <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-medium text-white">{scenario.name}</h3>
                    <p className="text-sm text-gray-400">
                        {scenario.value} {scenario.parameter} for {scenario.duration} days
                    </p>
                </div>
                <div className="p-2 rounded-lg bg-neon-cyan/20">
                    <Activity className="w-5 h-5 text-neon-cyan" />
                </div>
            </div>

            {result ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Health Score</span>
                        <span className={cn(
                            'font-medium',
                            result.healthScoreChange >= 0 ? 'text-neon-green' : 'text-neon-red'
                        )}>
                            {result.healthScoreChange > 0 ? '+' : ''}{result.healthScoreChange}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Life Expectancy</span>
                        <span className={cn(
                            'font-medium',
                            result.lifeExpectancyChange >= 0 ? 'text-neon-green' : 'text-neon-red'
                        )}>
                            {result.lifeExpectancyChange > 0 ? '+' : ''}{result.lifeExpectancyChange}y
                        </span>
                    </div>
                    <div className="pt-3 border-t border-white/5">
                        <p className="text-xs text-gray-500 mb-2">Risk Reduction:</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(result.riskReduction).map(([key, value]) => (
                                <span key={key} className="px-2 py-1 text-xs bg-neon-green/20 text-neon-green rounded">
                                    {key}: -{value}%
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <NeonButton
                    variant="cyan"
                    size="sm"
                    className="w-full"
                    onClick={handleRun}
                    disabled={runScenario.isPending}
                    icon={<Play className="w-4 h-4" />}
                >
                    {runScenario.isPending ? 'Running...' : 'Run Simulation'}
                </NeonButton>
            )}
        </GlassCard>
    );
};

// Intervention Timeline
const InterventionTimeline = () => {
    return (
        <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Personalized Interventions</h2>

            <div className="space-y-4">
                {INTERVENTIONS.map((intervention, index) => (
                    <motion.div
                        key={intervention.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            'flex items-center gap-4 p-4 rounded-xl',
                            'bg-white/5 border border-white/5',
                            intervention.completed && 'opacity-50'
                        )}
                    >
                        <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            intervention.completed
                                ? 'bg-neon-green/20'
                                : intervention.priority === 'high'
                                    ? 'bg-neon-red/20'
                                    : 'bg-neon-yellow/20'
                        )}>
                            {intervention.completed ? (
                                <Zap className="w-5 h-5 text-neon-green" />
                            ) : intervention.priority === 'high' ? (
                                <Activity className="w-5 h-5 text-neon-red" />
                            ) : (
                                <Calendar className="w-5 h-5 text-neon-yellow" />
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className={cn(
                                    'font-medium',
                                    intervention.completed ? 'text-gray-500 line-through' : 'text-white'
                                )}>
                                    {intervention.title}
                                </h3>
                                <span className={cn(
                                    'px-2 py-0.5 text-xs rounded-full',
                                    intervention.priority === 'high' && 'bg-neon-red/20 text-neon-red',
                                    intervention.priority === 'medium' && 'bg-neon-yellow/20 text-neon-yellow',
                                    intervention.priority === 'low' && 'bg-neon-cyan/20 text-neon-cyan'
                                )}>
                                    {intervention.priority}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">{intervention.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span>Timeline: {intervention.timeline}</span>
                                <span>Impact: {intervention.expectedImpact}</span>
                            </div>
                        </div>

                        {!intervention.completed && (
                            <NeonButton variant="white" size="sm">
                                Start
                            </NeonButton>
                        )}
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
};

export const Analytics = () => {
    const { data: riskData } = useRiskAssessment();
    const { data: scenarios } = useWhatIfScenarios();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-display text-white">Predictive Analytics</h1>
                <p className="text-gray-400 mt-1">AI-powered insights and future predictions</p>
            </div>

            {/* Risk Assessment & Future Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Risk Assessment</h2>
                            <p className="text-sm text-gray-400">Current health risk factors</p>
                        </div>
                        <Info className="w-5 h-5 text-gray-500" />
                    </div>

                    {riskData && <RiskRadar data={riskData} />}

                    {/* Risk breakdown */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        {riskData && Object.entries(riskData).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                <span className="text-sm text-gray-400 capitalize">{key}</span>
                                <span className={cn(
                                    'text-sm font-medium',
                                    value.risk === 'low' && 'text-neon-green',
                                    value.risk === 'moderate' && 'text-neon-yellow',
                                    value.risk === 'high' && 'text-neon-red'
                                )}>
                                    {value.risk}
                                </span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <FutureSimulation />
            </div>

            {/* What-If Scenarios */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">What-If Scenarios</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(scenarios || WHAT_IF_SCENARIOS).map((scenario) => (
                        <ScenarioCard key={scenario.id} scenario={scenario} />
                    ))}
                </div>
            </div>

            {/* Interventions */}
            <InterventionTimeline />
        </motion.div>
    );
};
