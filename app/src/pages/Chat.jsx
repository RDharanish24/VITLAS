import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Send,
    Mic,
    MicOff,
    User,
    Bot,
    Sparkles,
    AlertTriangle,
    Phone,
    Settings,
    MoreVertical
} from 'lucide-react';
import { GlassCard, NeonButton } from '@/components/ui-custom';
import { useChatStore, useUserStore } from '@/stores';
import { sendMessageToGemini, detectCrisis } from '@/api/gemini';
import { cn } from '@/lib/utils';
import { CRISIS_RESOURCES } from '@/lib/constants';

// AI Avatar Component
const AIAvatar = ({ type, isTyping }) => {
    const avatarStyles = {
        doctor: 'from-neon-cyan to-blue-500',
        coach: 'from-neon-green to-emerald-500',
        friendly: 'from-neon-purple to-pink-500',
    };

    return (
        <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-br',
            avatarStyles[type] || avatarStyles.friendly
        )}>
            <Bot className="w-6 h-6 text-white" />

            {isTyping && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full animate-pulse" />
            )}
        </div>
    );
};

// Emotion Indicator
const EmotionIndicator = ({ emotion, confidence }) => {
    const emotionColors = {
        anxious: 'text-neon-yellow bg-neon-yellow/20',
        calm: 'text-neon-green bg-neon-green/20',
        tired: 'text-neon-purple bg-neon-purple/20',
        stressed: 'text-neon-red bg-neon-red/20',
        happy: 'text-neon-pink bg-neon-pink/20',
        neutral: 'text-gray-400 bg-gray-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                emotionColors[emotion] || emotionColors.neutral
            )}
        >
            Detected: {emotion} ({Math.round(confidence * 100)}%)
        </motion.div>
    );
};

// Crisis Alert
const CrisisAlert = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neon-red/10 border border-neon-red/30 rounded-xl p-4 mb-4"
        >
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-neon-red flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-neon-red mb-1">We're Here to Help</h3>
                    <p className="text-sm text-gray-300 mb-3">
                        It sounds like you might be going through a difficult time. Please reach out to one of these resources:
                    </p>
                    <div className="space-y-2">
                        {CRISIS_RESOURCES.map((resource) => (
                            <a
                                key={resource.name}
                                href={`tel:${resource.phone}`}
                                className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <Phone className="w-4 h-4 text-neon-cyan" />
                                <div>
                                    <p className="text-sm font-medium text-white">{resource.name}</p>
                                    <p className="text-xs text-neon-cyan">{resource.phone}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Chat Message Component
const ChatMessage = ({ message }) => {
    const { preferences } = useUserStore();
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex gap-4 mb-4',
                isUser ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                {isUser ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                ) : (
                    <AIAvatar type={preferences.aiAvatar} />
                )}
            </div>

            {/* Message Content */}
            <div className={cn(
                'max-w-[70%]',
                isUser ? 'text-right' : 'text-left'
            )}>
                <div className={cn(
                    'inline-block px-4 py-3 rounded-2xl',
                    isUser
                        ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30'
                        : 'bg-dark-surface-light border border-white/10'
                )}>
                    <p className="text-white whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Emotion detection for user messages */}
                {isUser && message.emotion && (
                    <div className="mt-2 flex justify-end">
                        <EmotionIndicator emotion={message.emotion.primary} confidence={message.emotion.confidence} />
                    </div>
                )}

                {/* Crisis alert for AI responses */}
                {!isUser && message.crisisDetected && <CrisisAlert />}

                <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div>
    );
};

// Voice Input Visualization
const VoiceVisualizer = () => {
    return (
        <div className="flex items-center justify-center gap-1 h-8">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-neon-cyan rounded-full"
                    animate={{
                        height: [8, 24, 8],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                    }}
                />
            ))}
        </div>
    );
};

export const Chat = () => {
    const { messages, isTyping, addMessage, setTyping, toggleVoiceInput } = useChatStore();
    const { preferences } = useUserStore();

    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
            emotion: { primary: 'neutral', confidence: 0.8 },
        };

        addMessage(userMessage);
        const currentInput = input;
        setInput('');
        setTyping(true);

        try {
            // Call real Gemini AI
            const responseText = await sendMessageToGemini(currentInput, messages);
            const crisisDetected = detectCrisis(currentInput);

            const aiMessage = {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: responseText,
                timestamp: new Date().toISOString(),
                crisisDetected,
            };

            addMessage(aiMessage);
        } catch (error) {
            console.error('Failed to send message:', error);

            // Show error as an AI message so the user sees it
            const errorMessage = {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: error instanceof Error
                    ? `⚠️ ${error.message}`
                    : '⚠️ Something went wrong. Please try again.',
                timestamp: new Date().toISOString(),
            };
            addMessage(errorMessage);
        } finally {
            setTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleVoiceToggle = () => {
        setIsRecording(!isRecording);
        toggleVoiceInput();

        // Simulate voice input
        if (!isRecording) {
            setTimeout(() => {
                setInput('I\'ve been feeling anxious about work lately...');
                setIsRecording(false);
            }, 3000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[calc(100vh-8rem)] flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <AIAvatar type={preferences.aiAvatar} />
                    <div>
                        <h1 className="text-2xl font-bold font-display text-white">AI Health Companion</h1>
                        <p className="text-sm text-gray-400">
                            {isTyping ? 'Typing...' : 'Always here to help'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <GlassCard className="flex-1 flex flex-col overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Welcome message */}
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">How are you feeling today?</h2>
                            <p className="text-gray-400 max-w-md mx-auto">
                                I'm your AI health companion. I can help with stress management, sleep improvement,
                                and answer questions about your health data.
                            </p>

                            {/* Quick suggestions */}
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                                {['I need help with sleep', 'I\'m feeling stressed', 'Analyze my health trends', 'Breathing exercise'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setInput(suggestion)}
                                        className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Message list */}
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-gray-400"
                        >
                            <AIAvatar type={preferences.aiAvatar} isTyping />
                            <span className="text-sm">AI is thinking...</span>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        {/* Voice button */}
                        <button
                            onClick={handleVoiceToggle}
                            className={cn(
                                'p-3 rounded-xl transition-all duration-300',
                                isRecording
                                    ? 'bg-neon-red/20 text-neon-red animate-pulse'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            )}
                        >
                            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        {/* Text input */}
                        <div className="flex-1 relative">
                            {isRecording ? (
                                <div className="h-12 flex items-center justify-center bg-white/5 rounded-xl">
                                    <VoiceVisualizer />
                                </div>
                            ) : (
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="w-full h-12 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-neon-cyan/50"
                                    rows={1}
                                />
                            )}
                        </div>

                        {/* Send button */}
                        <NeonButton
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            variant="cyan"
                            size="md"
                            icon={<Send className="w-5 h-5" />}
                        >
                            Send
                        </NeonButton>
                    </div>

                    {/* Privacy note */}
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Your conversations are private and encrypted. Crisis detection is active for your safety.
                    </p>
                </div>
            </GlassCard>
        </motion.div>
    );
};
