import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('antigravity_chat_history');
        return saved ? JSON.parse(saved) : [
            { role: 'assistant', content: 'Greeting initiated. I am Antigravity AI. How may I assist your cyber-operations today?' }
        ];
    });
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('antigravity_chat_history', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [isOpen]);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsThinking(true);

        try {
            // Dynamic import to avoid SSR issues if any, although this is SPA.
            // Also ensures puter is available.
            const response = await window.puter.ai.chat(input);

            const aiMessage = {
                role: 'assistant',
                content: response?.message?.content || response?.toString() || "Connection interrupted."
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Neural link unstable. Unable to reach AI core.' }]);
        } finally {
            setIsThinking(false);
        }
    };

    const clearHistory = () => {
        setMessages([{ role: 'assistant', content: 'Memory purged. Ready for new input.' }]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-[90vw] max-w-[400px] h-[500px] flex flex-col rounded-lg overflow-hidden glass-panel border border-cyan-500/30 neon-border"
                    >
                        {/* Header */}
                        <div className="bg-slate-900/80 p-4 border-b border-cyan-500/20 flex justify-between items-center backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                <h3 className="font-mono text-cyan-400 font-bold tracking-wider">TERMINAL // AI</h3>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={clearHistory}
                                    className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                    title="Clear History"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-lg text-sm font-mono leading-relaxed ${msg.role === 'user'
                                                ? 'bg-cyan-900/40 border border-cyan-500/30 text-cyan-50 rounded-br-none'
                                                : 'bg-slate-900/60 border border-purple-500/30 text-purple-100 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-1 opacity-50 text-xs text-purple-400">
                                                <Bot size={12} />
                                                <span>ANTIGRAVITY</span>
                                            </div>
                                        )}
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800/50 p-3 rounded-lg flex items-center gap-2 border border-purple-500/20">
                                        <Loader2 size={16} className="text-purple-400 animate-spin" />
                                        <span className="text-xs text-purple-400 font-mono animate-pulse">PROCESSING DATA...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-slate-900/80 border-t border-cyan-500/20 backdrop-blur-md">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter command..."
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded text-sm p-3 pr-10 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 text-cyan-100 font-mono placeholder:text-slate-600 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isThinking}
                                    className="absolute right-2 p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg border backdrop-blur-sm transition-all duration-300 relative group
          ${isOpen
                        ? 'bg-slate-900 border-purple-500 text-purple-400 shadow-purple-900/20'
                        : 'bg-cyan-950/80 border-cyan-400 text-cyan-400 shadow-cyan-900/20 hover:shadow-cyan-500/40'
                    }`}
            >
                <span className="absolute inset-0 rounded-full bg-current opacity-10 animate-pulse-slow"></span>
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}

                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></span>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
