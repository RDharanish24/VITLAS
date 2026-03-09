import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Users,
    Target,
    TrendingUp,
    Star,
    Zap,
    Crown,
    Footprints,
    Moon,
    Sparkles,
    ChevronRight,
    Plus
} from 'lucide-react';
import { GlassCard, NeonButton } from '@/components/ui-custom';
import { useAchievements, useGuilds, useChallenges, useJoinChallenge } from '@/api/queries';
import { cn } from '@/lib/utils';
import { ACHIEVEMENTS, GUILDS, CHALLENGES, FAMILY_MEMBERS } from '@/lib/constants';
import confetti from 'canvas-confetti';

// Achievement Badge
const AchievementBadge = ({ achievement }) => {
    const tierColors = {
        bronze: 'from-amber-600 to-amber-800',
        silver: 'from-gray-400 to-gray-600',
        gold: 'from-yellow-400 to-yellow-600',
        platinum: 'from-cyan-400 to-purple-500',
    };

    const Icon = achievement.unlocked ? Trophy : Lock;

    function Lock(props) {
        return (
            <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
                'relative p-4 rounded-xl',
                'bg-gradient-to-br',
                achievement.unlocked ? tierColors[achievement.tier] : 'from-gray-700 to-gray-800',
                'opacity-100'
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    achievement.unlocked ? 'bg-white/20' : 'bg-black/20'
                )}>
                    <Icon className={cn(
                        'w-6 h-6',
                        achievement.unlocked ? 'text-white' : 'text-gray-500'
                    )} />
                </div>
                <div className="flex-1">
                    <h3 className={cn(
                        'font-medium',
                        achievement.unlocked ? 'text-white' : 'text-gray-400'
                    )}>
                        {achievement.name}
                    </h3>
                    <p className="text-xs text-white/70">{achievement.description}</p>

                    {/* Progress bar */}
                    {!achievement.unlocked && (
                        <div className="mt-2">
                            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white/50 rounded-full transition-all"
                                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-white/50 mt-1">
                                {achievement.progress}/{achievement.maxProgress}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                </div>
            )}
        </motion.div>
    );
};

// Guild Card
const GuildCard = ({ guild }) => {
    return (
        <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={guild.avatar}
                        alt={guild.name}
                        className="w-14 h-14 rounded-xl"
                    />
                    <div>
                        <h3 className="font-medium text-white">{guild.name}</h3>
                        <p className="text-sm text-gray-400">{guild.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-neon-yellow">
                    <Crown className="w-5 h-5" />
                    <span className="font-bold">#{guild.rank}</span>
                </div>
            </div>

            {/* Members */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex -space-x-2">
                    {guild.members.slice(0, 4).map((member, i) => (
                        <img
                            key={member.userId}
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full border-2 border-dark-surface"
                            style={{ zIndex: 4 - i }}
                        />
                    ))}
                    {guild.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white border-2 border-dark-surface">
                            +{guild.members.length - 4}
                        </div>
                    )}
                </div>
                <span className="text-sm text-gray-400">{guild.members.length} members</span>
            </div>

            {/* Score */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                    <p className="text-xs text-gray-500">Total Score</p>
                    <p className="text-xl font-bold text-neon-cyan">{guild.totalScore.toLocaleString()}</p>
                </div>
                <NeonButton variant="cyan" size="sm">
                    View
                </NeonButton>
            </div>
        </GlassCard>
    );
};

// Challenge Card
const ChallengeCard = ({ challenge }) => {
    const joinChallenge = useJoinChallenge();

    const handleJoin = async () => {
        await joinChallenge.mutateAsync(challenge.id);
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#00D9FF', '#7000FF', '#FF00A0'],
        });
    };

    const categoryIcons = {
        steps: Footprints,
        sleep: Moon,
        meditation: Sparkles,
        hydration: Zap,
        custom: Target,
    };

    const Icon = categoryIcons[challenge.category] || Target;

    return (
        <GlassCard className="p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neon-cyan/20">
                        <Icon className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                        <h3 className="font-medium text-white">{challenge.title}</h3>
                        <p className="text-sm text-gray-400">{challenge.description}</p>
                    </div>
                </div>
                <span className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    challenge.type === 'daily' && 'bg-neon-green/20 text-neon-green',
                    challenge.type === 'weekly' && 'bg-neon-cyan/20 text-neon-cyan',
                    challenge.type === 'monthly' && 'bg-neon-purple/20 text-neon-purple'
                )}>
                    {challenge.type}
                </span>
            </div>

            {/* Progress */}
            {challenge.joined && (
                <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-neon-cyan">{challenge.progress}/{challenge.target} {challenge.unit}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all"
                            style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{challenge.participants.toLocaleString()} participants</span>
                <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
            </div>

            {/* Reward & Action */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-neon-yellow" />
                    <span className="text-sm text-gray-400">{challenge.reward}</span>
                </div>

                {challenge.joined ? (
                    <span className="px-3 py-1 text-sm text-neon-green bg-neon-green/20 rounded-lg">
                        Joined
                    </span>
                ) : (
                    <NeonButton
                        variant="cyan"
                        size="sm"
                        onClick={handleJoin}
                        disabled={joinChallenge.isPending}
                    >
                        Join Challenge
                    </NeonButton>
                )}
            </div>
        </GlassCard>
    );
};

// Family Health Tree
const FamilyHealthTree = () => {
    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-white">Family Health Tree</h2>
                    <p className="text-sm text-gray-400">Track your family's health journey</p>
                </div>
                <NeonButton variant="white" size="sm" icon={<Plus className="w-4 h-4" />}>
                    Add Member
                </NeonButton>
            </div>

            <div className="space-y-4">
                {FAMILY_MEMBERS.map((member) => (
                    <motion.div
                        key={member.id}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5"
                    >
                        <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white">{member.name}</h3>
                                <span className="text-xs text-gray-500">{member.relationship}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-400">Age: {member.age}</span>
                                <span className={cn(
                                    'text-sm font-medium',
                                    member.healthScore >= 80 ? 'text-neon-green' :
                                        member.healthScore >= 60 ? 'text-neon-cyan' :
                                            'text-neon-yellow'
                                )}>
                                    Score: {member.healthScore}
                                </span>
                            </div>
                            {member.conditions.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {member.conditions.map((condition) => (
                                        <span key={condition} className="px-2 py-0.5 text-xs bg-neon-yellow/20 text-neon-yellow rounded">
                                            {condition}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
};

// Leaderboard
const Leaderboard = () => {
    const leaderboardData = [
        { rank: 1, name: 'Sarah Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahKim', score: 15420, trend: 'up' },
        { rank: 2, name: 'Mike Ross', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeRoss', score: 14850, trend: 'same' },
        { rank: 3, name: 'Alex Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen', score: 14200, trend: 'up' },
        { rank: 4, name: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaPark', score: 13980, trend: 'down' },
        { rank: 5, name: 'Tom Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TomChen', score: 13500, trend: 'same' },
    ];

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-white">Global Leaderboard</h2>
                    <p className="text-sm text-gray-400">Top performers this week</p>
                </div>
                <TrendingUp className="w-5 h-5 text-neon-cyan" />
            </div>

            <div className="space-y-3">
                {leaderboardData.map((user) => (
                    <div
                        key={user.rank}
                        className={cn(
                            'flex items-center gap-4 p-3 rounded-xl',
                            user.rank <= 3 ? 'bg-white/5' : ''
                        )}
                    >
                        <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                            user.rank === 1 && 'bg-yellow-500/20 text-yellow-500',
                            user.rank === 2 && 'bg-gray-400/20 text-gray-400',
                            user.rank === 3 && 'bg-amber-600/20 text-amber-600',
                            user.rank > 3 && 'text-gray-500'
                        )}>
                            {user.rank}
                        </div>

                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />

                        <div className="flex-1">
                            <p className={cn(
                                'font-medium',
                                user.name === 'Alex Chen' ? 'text-neon-cyan' : 'text-white'
                            )}>
                                {user.name} {user.name === 'Alex Chen' && '(You)'}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="font-bold text-white">{user.score.toLocaleString()}</p>
                            <p className={cn(
                                'text-xs',
                                user.trend === 'up' && 'text-neon-green',
                                user.trend === 'down' && 'text-neon-red',
                                user.trend === 'same' && 'text-gray-500'
                            )}>
                                {user.trend === 'up' && '↑'}
                                {user.trend === 'down' && '↓'}
                                {user.trend === 'same' && '−'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

export const Community = () => {
    const { data: achievements } = useAchievements();
    const { data: guilds } = useGuilds();
    const { data: challenges } = useChallenges();

    const [activeTab, setActiveTab] = useState('achievements');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-display text-white">Community</h1>
                <p className="text-gray-400 mt-1">Achievements, guilds, and challenges</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Points', value: '14,200', icon: Star, color: 'text-neon-yellow' },
                    { label: 'Achievements', value: '5/8', icon: Trophy, color: 'text-neon-cyan' },
                    { label: 'Guild Rank', value: '#3', icon: Users, color: 'text-neon-purple' },
                    { label: 'Challenges', value: '2 Active', icon: Target, color: 'text-neon-green' },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <GlassCard key={stat.label} className="p-4 text-center">
                            <Icon className={cn('w-6 h-6 mx-auto mb-2', stat.color)} />
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-gray-400">{stat.label}</p>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'achievements', label: 'Achievements', icon: Trophy },
                    { id: 'guilds', label: 'Guilds', icon: Users },
                    { id: 'challenges', label: 'Challenges', icon: Target },
                ].map((tab) => {
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {activeTab === 'achievements' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(achievements || ACHIEVEMENTS).map((achievement) => (
                                <AchievementBadge key={achievement.id} achievement={achievement} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'guilds' && (
                        <div className="space-y-4">
                            {(guilds || GUILDS).map((guild) => (
                                <GuildCard key={guild.id} guild={guild} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'challenges' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(challenges || CHALLENGES).map((challenge) => (
                                <ChallengeCard key={challenge.id} challenge={challenge} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Leaderboard />
                    <FamilyHealthTree />
                </div>
            </div>
        </motion.div>
    );
};
