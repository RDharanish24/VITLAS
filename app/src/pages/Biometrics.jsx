import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Camera,
    Mic,
    Watch,
    Plus,
    RefreshCw,
    Upload
} from 'lucide-react';
import { GlassCard, NeonButton } from '@/components/ui-custom';
import { useUserStore } from '@/stores';
import { useAddVitalEntry, useSyncWearable } from '@/api/queries';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form schemas
const vitalSchema = z.object({
    heartRate: z.number().min(30).max(250).optional(),
    systolic: z.number().min(70).max(250).optional(),
    diastolic: z.number().min(40).max(150).optional(),
    glucose: z.number().min(50).max(500).optional(),
    temperature: z.number().min(35).max(42).optional(),
    weight: z.number().min(30).max(300).optional(),
});

// Wearable Device Card
const WearableCard = ({ device }) => {
    const syncWearable = useSyncWearable();

    return (
        <GlassCard className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'p-3 rounded-xl',
                        device.connected ? 'bg-neon-green/20' : 'bg-gray-500/20'
                    )}>
                        <Watch className={cn(
                            'w-6 h-6',
                            device.connected ? 'text-neon-green' : 'text-gray-400'
                        )} />
                    </div>
                    <div>
                        <h3 className="font-medium text-white">{device.name}</h3>
                        <p className="text-sm text-gray-400">
                            {device.connected ? `Last sync: ${new Date(device.lastSync).toLocaleTimeString()}` : 'Disconnected'}
                        </p>
                        {device.batteryLevel !== undefined && (
                            <p className="text-xs text-gray-500">Battery: {device.batteryLevel}%</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {device.connected ? (
                        <>
                            <span className="px-2 py-1 text-xs bg-neon-green/20 text-neon-green rounded-full">
                                Connected
                            </span>
                            <button
                                onClick={() => syncWearable.mutate(device.id)}
                                className="p-2 rounded-lg hover:bg-white/5 text-gray-400"
                                disabled={syncWearable.isPending}
                            >
                                <RefreshCw className={cn('w-4 h-4', syncWearable.isPending && 'animate-spin')} />
                            </button>
                        </>
                    ) : (
                        <NeonButton variant="white" size="sm">
                            Connect
                        </NeonButton>
                    )}
                </div>
            </div>

            {/* Data types */}
            {device.connected && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500 mb-2">Syncing:</p>
                    <div className="flex flex-wrap gap-2">
                        {device.dataTypes.map((type) => (
                            <span key={type} className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded">
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </GlassCard>
    );
};

// Camera-based Heart Rate Estimation
const CameraHeartRate = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);

    const startScan = async () => {
        setIsScanning(true);
        setProgress(0);
        setResult(null);

        // Simulate scanning progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    setResult(72 + Math.floor(Math.random() * 10));
                    return 100;
                }
                return prev + 2;
            });
        }, 100);
    };

    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-neon-cyan/20">
                    <Camera className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                    <h3 className="font-medium text-white">Camera Heart Rate</h3>
                    <p className="text-sm text-gray-400">Estimate HR via fingertip color changes</p>
                </div>
            </div>

            <div className="relative aspect-video bg-black/50 rounded-xl overflow-hidden mb-4">
                {isScanning ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-neon-cyan/30 flex items-center justify-center">
                            <div
                                className="w-28 h-28 rounded-full bg-neon-cyan/20 flex items-center justify-center transition-all"
                                style={{ transform: `scale(${1 + Math.sin(progress / 10) * 0.1})` }}
                            >
                                <span className="text-2xl font-bold text-neon-cyan">{progress}%</span>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-4">Place your fingertip on the camera...</p>
                    </div>
                ) : result ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-6xl font-bold text-neon-green mb-2">{result}</div>
                        <p className="text-gray-400">BPM Estimated</p>
                        <NeonButton variant="cyan" size="sm" className="mt-4" onClick={() => setResult(null)}>
                            Scan Again
                        </NeonButton>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Camera className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-gray-400">Camera preview will appear here</p>
                    </div>
                )}
            </div>

            {!isScanning && !result && (
                <NeonButton variant="cyan" className="w-full" onClick={startScan}>
                    Start Scan
                </NeonButton>
            )}

            <p className="text-xs text-gray-500 mt-4 text-center">
                Place your fingertip gently over the camera lens and flash. Hold steady for 30 seconds.
            </p>
        </GlassCard>
    );
};

// Food Photo Analysis
const FoodPhotoAnalysis = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = () => {
        setIsAnalyzing(true);

        // Simulate analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult({
                foods: [
                    { name: 'Grilled Chicken Breast', calories: 165, confidence: 0.95 },
                    { name: 'Steamed Broccoli', calories: 55, confidence: 0.88 },
                    { name: 'Brown Rice', calories: 112, confidence: 0.92 },
                ],
                totalCalories: 332,
            });
        }, 2000);
    };

    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-neon-purple/20">
                    <Upload className="w-6 h-6 text-neon-purple" />
                </div>
                <div>
                    <h3 className="font-medium text-white">Food Photo Analysis</h3>
                    <p className="text-sm text-gray-400">AI-powered nutrition logging</p>
                </div>
            </div>

            <div
                className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-neon-cyan/50 transition-colors"
                onClick={handleUpload}
            >
                {isAnalyzing ? (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mb-4" />
                        <p className="text-gray-400">Analyzing your meal...</p>
                    </div>
                ) : result ? (
                    <div className="text-left">
                        <h4 className="font-medium text-white mb-3">Detected Foods:</h4>
                        <div className="space-y-2">
                            {result.foods.map((food, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                    <div>
                                        <p className="text-sm text-white">{food.name}</p>
                                        <p className="text-xs text-gray-400">{Math.round(food.confidence * 100)}% confidence</p>
                                    </div>
                                    <span className="text-neon-cyan font-medium">{food.calories} cal</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-gray-400">Total Calories</span>
                            <span className="text-xl font-bold text-neon-green">{result.totalCalories}</span>
                        </div>
                        <NeonButton variant="cyan" size="sm" className="w-full mt-4" onClick={() => setResult(null)}>
                            Analyze Another
                        </NeonButton>
                    </div>
                ) : (
                    <>
                        <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Click or drag to upload food photo</p>
                        <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG</p>
                    </>
                )}
            </div>
        </GlassCard>
    );
};

export const Biometrics = () => {
    const { wearables } = useUserStore();
    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(vitalSchema),
    });
    const addVitalEntry = useAddVitalEntry();
    const [activeTab, setActiveTab] = useState('manual');

    const onSubmit = async (data) => {
        const entry = {
            id: `vitals-${Date.now()}`,
            userId: 'user-001',
            vitals: {
                heartRate: data.heartRate || 72,
                bloodPressure: {
                    systolic: data.systolic || 118,
                    diastolic: data.diastolic || 78,
                },
                glucose: data.glucose || 95,
                oxygenSaturation: 98,
                temperature: data.temperature || 36.6,
                respiratoryRate: 16,
            },
            timestamp: new Date().toISOString(),
            source: 'manual',
        };

        await addVitalEntry.mutateAsync(entry);
        reset();
    };

    const tabs = [
        { id: 'manual', label: 'Manual Entry', icon: Activity },
        { id: 'camera', label: 'Camera', icon: Camera },
        { id: 'wearables', label: 'Wearables', icon: Watch },
        { id: 'nutrition', label: 'Nutrition', icon: Upload },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-display text-white">Biometric Input</h1>
                <p className="text-gray-400 mt-1">Track and monitor your health metrics</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
                                activeTab === tab.id
                                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeTab === 'manual' && (
                    <>
                        <GlassCard className="p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Manual Vital Entry</h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Heart Rate (BPM)</label>
                                        <input
                                            type="number"
                                            {...register('heartRate', { valueAsNumber: true })}
                                            placeholder="72"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Glucose (mg/dL)</label>
                                        <input
                                            type="number"
                                            {...register('glucose', { valueAsNumber: true })}
                                            placeholder="95"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Systolic BP</label>
                                        <input
                                            type="number"
                                            {...register('systolic', { valueAsNumber: true })}
                                            placeholder="118"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Diastolic BP</label>
                                        <input
                                            type="number"
                                            {...register('diastolic', { valueAsNumber: true })}
                                            placeholder="78"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Temperature (°C)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            {...register('temperature', { valueAsNumber: true })}
                                            placeholder="36.6"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            {...register('weight', { valueAsNumber: true })}
                                            placeholder="70"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
                                        />
                                    </div>
                                </div>

                                <NeonButton
                                    type="submit"
                                    variant="cyan"
                                    className="w-full"
                                    disabled={addVitalEntry.isPending}
                                >
                                    {addVitalEntry.isPending ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            Save Entry
                                        </>
                                    )}
                                </NeonButton>
                            </form>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Voice Input</h2>

                            <div className="flex items-center justify-center h-48 border-2 border-dashed border-white/20 rounded-xl">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
                                        <Mic className="w-8 h-8 text-neon-cyan" />
                                    </div>
                                    <p className="text-gray-400">Tap to start voice input</p>
                                    <p className="text-sm text-gray-500 mt-1">"My heart rate is 72..."</p>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-white/5 rounded-xl">
                                <p className="text-sm text-gray-400 mb-2">Try saying:</p>
                                <ul className="space-y-1 text-sm text-gray-500">
                                    <li>• "Record blood pressure 120 over 80"</li>
                                    <li>• "My glucose is 95"</li>
                                    <li>• "Weight 70 kilograms"</li>
                                </ul>
                            </div>
                        </GlassCard>
                    </>
                )}

                {activeTab === 'camera' && (
                    <div className="lg:col-span-2">
                        <CameraHeartRate />
                    </div>
                )}

                {activeTab === 'wearables' && (
                    <div className="lg:col-span-2 space-y-4">
                        {wearables.map((device) => (
                            <WearableCard key={device.id} device={device} />
                        ))}

                        <GlassCard className="p-6 border-dashed border-2 border-white/20">
                            <div className="flex items-center justify-center">
                                <NeonButton variant="white" icon={<Plus className="w-5 h-5" />}>
                                    Add New Device
                                </NeonButton>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {activeTab === 'nutrition' && (
                    <div className="lg:col-span-2">
                        <FoodPhotoAnalysis />
                    </div>
                )}
            </div>
        </motion.div>
    );
};
