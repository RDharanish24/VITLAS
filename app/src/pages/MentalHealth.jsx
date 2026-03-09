import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wind,
    Meh,
    Zap,
    CloudRain,
    Sun,
    Moon,
    Play,
    Pause,
    RotateCcw,
    Calendar,
    BookOpen,
    Music,
    Sparkles
} from 'lucide-react';
import { GlassCard, NeonButton } from '@/components/ui-custom';
import { useAddMoodEntry, useMoodEntries } from '@/api/queries';
import { cn } from '@/lib/utils';
import { BREATHING_PATTERNS, MOOD_ENTRIES, CBT_EXERCISES, SLEEP_STORIES } from '@/lib/constants';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mood options
const MOODS = [
    { id: 'happy', label: 'Happy', icon: Sun, color: 'text-neon-green', bg: 'bg-neon-green/20' },
    { id: 'calm', label: 'Calm', icon: Wind, color: 'text-neon-cyan', bg: 'bg-neon-cyan/20' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    { id: 'anxious', label: 'Anxious', icon: Zap, color: 'text-neon-yellow', bg: 'bg-neon-yellow/20' },
    { id: 'sad', label: 'Sad', icon: CloudRain, color: 'text-neon-purple', bg: 'bg-neon-purple/20' },
    { id: 'tired', label: 'Tired', icon: Moon, color: 'text-neon-pink', bg: 'bg-neon-pink/20' },
];

// Breathing Exercise Component
const BreathingExercise = () => {
    const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('inhale');
    const [progress, setProgress] = useState(0);
    const [sessionTime, setSessionTime] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        let interval;
        const phaseDuration = selectedPattern[phase] * 1000;
        const startTime = Date.now();

        interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / phaseDuration) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                // Move to next phase
                const phases = ['inhale', 'hold', 'exhale', 'holdEmpty'];
                const currentIndex = phases.indexOf(phase);
                const nextIndex = (currentIndex + 1) % phases.length;

                // Skip phases with 0 duration
                let nextPhase = phases[nextIndex];
                while (selectedPattern[nextPhase] === 0 && nextPhase !== phase) {
                    const nextNextIndex = (phases.indexOf(nextPhase) + 1) % phases.length;
                    nextPhase = phases[nextNextIndex];
                }

                setPhase(nextPhase);
                setProgress(0);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [isActive, phase, selectedPattern]);

    useEffect(() => {
        if (isActive) {
            const timer = setInterval(() => setSessionTime(t => t + 1), 1000);
            return () => clearInterval(timer);
        }
    }, [isActive]);

    const getScale = () => {
        switch (phase) {
            case 'inhale': return 1 + (progress / 100) * 0.5;
            case 'hold': return 1.5;
            case 'exhale': return 1.5 - (progress / 100) * 0.5;
            case 'holdEmpty': return 1;
            default: return 1;
        }
    };

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In';
            case 'hold': return 'Hold';
            case 'exhale': return 'Breathe Out';
            case 'holdEmpty': return 'Pause';
            default: return '';
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'inhale': return '#00D9FF';
            case 'hold': return '#7000FF';
            case 'exhale': return '#FF00A0';
            case 'holdEmpty': return '#FFB800';
            default: return '#00D9FF';
        }
    };

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-white">Guided Breathing</h2>
                    <p className="text-sm text-gray-400">Biofeedback relaxation</p>
                </div>
                <select
                    value={selectedPattern.name}
                    onChange={(e) => setSelectedPattern(BREATHING_PATTERNS.find(p => p.name === e.target.value) || BREATHING_PATTERNS[0])}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                >
                    {BREATHING_PATTERNS.map((pattern) => (
                        <option key={pattern.name} value={pattern.name}>
                            {pattern.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Breathing Orb */}
            <div className="relative h-64 flex items-center justify-center mb-6">
                {/* Outer rings */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border-2 border-white/10"
                        style={{
                            width: 150 + i * 40,
                            height: 150 + i * 40,
                        }}
                        animate={{
                            scale: isActive ? [1, 1.1, 1] : 1,
                            opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
                        }}
                        transition={{
                            duration: selectedPattern.inhale + selectedPattern.exhale,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}

                {/* Main orb */}
                <motion.div
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{
                        background: `radial-gradient(circle, ${getPhaseColor()}40 0%, ${getPhaseColor()}20 50%, transparent 70%)`,
                        boxShadow: `0 0 60px ${getPhaseColor()}40`,
                    }}
                    animate={{
                        scale: getScale(),
                    }}
                    transition={{
                        duration: 0.1,
                    }}
                >
                    <span className="text-2xl font-bold" style={{ color: getPhaseColor() }}>
                        {getPhaseText()}
                    </span>
                </motion.div>

                {/* Progress ring */}
                <svg className="absolute w-48 h-48 transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="90"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="90"
                        fill="none"
                        stroke={getPhaseColor()}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                </svg>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => { setIsActive(false); setPhase('inhale'); setProgress(0); setSessionTime(0); }}
                    className="p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className={cn(
                        'px-8 py-3 rounded-xl font-medium flex items-center gap-2',
                        isActive
                            ? 'bg-neon-red/20 text-neon-red'
                            : 'bg-neon-cyan/20 text-neon-cyan'
                    )}
                >
                    {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isActive ? 'Pause' : 'Start'}
                </button>

                <div className="px-4 py-2 rounded-xl bg-white/5 text-gray-400">
                    {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')}
                </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
                {selectedPattern.description}
            </p>
        </GlassCard>
    );
};

// Mood Tracker
const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [intensity, setIntensity] = useState(5);
    const [notes, setNotes] = useState('');
    const addMoodEntry = useAddMoodEntry();
    const { data: moodEntries } = useMoodEntries();

    const handleSubmit = async () => {
        if (!selectedMood) return;

        await addMoodEntry.mutateAsync({
            userId: 'user-001',
            mood: selectedMood,
            intensity,
            notes,
            timestamp: new Date().toISOString(),
        });

        setSelectedMood(null);
        setIntensity(5);
        setNotes('');
    };

    // Prepare chart data
    const entries = moodEntries || MOOD_ENTRIES;
    const moodValues = { happy: 5, calm: 4, neutral: 3, anxious: 2, sad: 1, tired: 1, angry: 0 };
    const chartData = entries.slice(-7).map(e => ({
        date: new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: moodValues[e.mood] * (e.intensity / 5),
    }));

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-white">Mood Tracker</h2>
                    <p className="text-sm text-gray-400">How are you feeling right now?</p>
                </div>
                <Sparkles className="w-5 h-5 text-neon-purple" />
            </div>

            {/* Mood Selection */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {MOODS.map((mood) => {
                    const Icon = mood.icon;
                    return (
                        <button
                            key={mood.id}
                            onClick={() => setSelectedMood(mood.id)}
                            className={cn(
                                'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                                selectedMood === mood.id
                                    ? `${mood.bg} ${mood.color} ring-2 ring-offset-2 ring-offset-dark-surface ring-current`
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            )}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs">{mood.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Intensity Slider */}
            {selectedMood && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 mb-6"
                >
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                            Intensity: {intensity}/10
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={intensity}
                            onChange={(e) => setIntensity(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #00D9FF 0%, #00D9FF ${intensity * 10}%, rgba(255,255,255,0.1) ${intensity * 10}%)`,
                            }}
                        />
                    </div>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes (optional)..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none"
                        rows={2}
                    />

                    <NeonButton
                        variant="cyan"
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={addMoodEntry.isPending}
                    >
                        Log Mood
                    </NeonButton>
                </motion.div>
            )}

            {/* Mood Chart */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-sm font-medium text-white mb-3">7-Day Mood Trend</h3>
                <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="date" stroke="#374151" fontSize={10} />
                            <YAxis hide domain={[0, 5]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#111827',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="mood"
                                stroke="#FF00A0"
                                strokeWidth={2}
                                dot={{ fill: '#FF00A0', strokeWidth: 0, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </GlassCard>
    );
};

// CBT Exercise Card
const CBTExerciseCard = ({ exercise }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState({});

    const handleNext = () => {
        if (currentStep < exercise.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleResponse = (value) => {
        setResponses({ ...responses, [currentStep]: value });
    };

    return (
        <GlassCard className="p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neon-purple/20">
                        <BookOpen className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div>
                        <h3 className="font-medium text-white">{exercise.title}</h3>
                        <p className="text-sm text-gray-400">{exercise.description}</p>
                        <p className="text-xs text-gray-500 mt-1">~{exercise.estimatedDuration} minutes</p>
                    </div>
                </div>
                <NeonButton
                    variant="white"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? 'Close' : 'Start'}
                </NeonButton>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/5"
                    >
                        {/* Progress */}
                        <div className="flex items-center gap-2 mb-4">
                            {exercise.steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'h-1 flex-1 rounded-full',
                                        i <= currentStep ? 'bg-neon-cyan' : 'bg-white/10'
                                    )}
                                />
                            ))}
                        </div>

                        {/* Current Step */}
                        <div className="mb-4">
                            <h4 className="font-medium text-white mb-2">
                                Step {currentStep + 1}: {exercise.steps[currentStep].title}
                            </h4>
                            <p className="text-sm text-gray-400 mb-4">
                                {exercise.steps[currentStep].content}
                            </p>

                            {exercise.steps[currentStep].inputType === 'text' && (
                                <textarea
                                    value={responses[currentStep] || ''}
                                    onChange={(e) => handleResponse(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none"
                                    rows={3}
                                    placeholder="Type your response..."
                                />
                            )}

                            {exercise.steps[currentStep].inputType === 'scale' && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">0</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={responses[currentStep] || 5}
                                        onChange={(e) => handleResponse(e.target.value)}
                                        className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-400">10</span>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                disabled={currentStep === 0}
                                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentStep === exercise.steps.length - 1}
                                className="px-4 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan disabled:opacity-50"
                            >
                                {currentStep === exercise.steps.length - 1 ? 'Complete' : 'Next'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};

// Sleep Story Card
const SleepStoryCard = ({ story }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <GlassCard className="p-4 overflow-hidden">
            <div className="flex items-center gap-4">
                {story.thumbnailUrl && (
                    <img
                        src={story.thumbnailUrl}
                        alt={story.title}
                        className="w-20 h-20 rounded-xl object-cover"
                    />
                )}
                <div className="flex-1">
                    <h3 className="font-medium text-white">{story.title}</h3>
                    <p className="text-sm text-gray-400">{story.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">{story.duration} min</span>
                        <span className="text-xs text-gray-500 capitalize">{story.category}</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center',
                        isPlaying ? 'bg-neon-red/20 text-neon-red' : 'bg-neon-cyan/20 text-neon-cyan'
                    )}
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
            </div>

            {isPlaying && (
                <div className="mt-4">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-neon-cyan"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: story.duration * 60, ease: 'linear' }}
                        />
                    </div>
                </div>
            )}
        </GlassCard>
    );
};

// Stress Heatmap
const StressHeatmap = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeks = 4;

    // Generate random stress data
    const data = Array.from({ length: weeks * 7 }, () => Math.random());

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-white">Stress Heatmap</h2>
                    <p className="text-sm text-gray-400">Monthly stress pattern</p>
                </div>
                <Calendar className="w-5 h-5 text-gray-500" />
            </div>

            <div className="flex gap-1">
                {days.map((day) => (
                    <div key={day} className="flex-1 text-center text-xs text-gray-500 mb-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {data.map((stress, i) => {
                    const intensity = Math.floor(stress * 5);
                    const colors = [
                        'bg-transparent',
                        'bg-neon-green/20',
                        'bg-neon-cyan/20',
                        'bg-neon-yellow/20',
                        'bg-neon-red/20',
                    ];

                    return (
                        <div
                            key={i}
                            className={cn(
                                'aspect-square rounded-md',
                                colors[intensity]
                            )}
                            title={`Stress level: ${intensity}/5`}
                        />
                    );
                })}
            </div>

            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>Low Stress</span>
                <div className="flex gap-1">
                    {['bg-neon-green/40', 'bg-neon-cyan/40', 'bg-neon-yellow/40', 'bg-neon-red/40'].map((color, i) => (
                        <div key={i} className={cn('w-4 h-4 rounded', color)} />
                    ))}
                </div>
                <span>High Stress</span>
            </div>
        </GlassCard>
    );
};

export const MentalHealth = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-display text-white">Mental Health Studio</h1>
                <p className="text-gray-400 mt-1">Tools for mindfulness, mood tracking, and therapy</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Breathing Exercise */}
                <BreathingExercise />

                {/* Mood Tracker */}
                <MoodTracker />

                {/* Stress Heatmap */}
                <StressHeatmap />

                {/* CBT Exercises */}
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">CBT Exercises</h2>
                            <p className="text-sm text-gray-400">Cognitive behavioral therapy tools</p>
                        </div>
                        <BookOpen className="w-5 h-5 text-neon-purple" />
                    </div>

                    <div className="space-y-3">
                        {CBT_EXERCISES.map((exercise) => (
                            <CBTExerciseCard key={exercise.id} exercise={exercise} />
                        ))}
                    </div>
                </GlassCard>

                {/* Sleep Stories */}
                <GlassCard className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Sleep Stories</h2>
                            <p className="text-sm text-gray-400">AI-generated audio for better sleep</p>
                        </div>
                        <Music className="w-5 h-5 text-neon-cyan" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SLEEP_STORIES.map((story) => (
                            <SleepStoryCard key={story.id} story={story} />
                        ))}
                    </div>
                </GlassCard>
            </div>
        </motion.div>
    );
};
