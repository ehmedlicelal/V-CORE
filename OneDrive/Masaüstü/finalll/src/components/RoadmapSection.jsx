import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw, Cpu, Shield, Terminal, ArrowRight } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        question: "Which of the following describes a generic 'Phishing' attack?",
        options: [
            "Unauthorized access to a server via SSH",
            "Tricking users into revealing sensitive info via deceptive emails",
            "Overloading a server with traffic",
            "Injecting SQL code into a database"
        ]
    },
    {
        id: 2,
        question: "What does SQL Injection primarily target?",
        options: [
            "Network switches",
            "User passwords in memory",
            "Database contents",
            "Web browser extensions"
        ]
    },
    {
        id: 3,
        question: "What is the main purpose of a VPN?",
        options: [
            "To speed up your internet significantly",
            "To encrypt your internet connection and mask IP",
            "To scan for viruses",
            "To clean temporary files"
        ]
    },
    {
        id: 4,
        question: "Which password is considered strongest?",
        options: [
            "password123",
            "Admin@2025",
            "Tr0ub4dor&3",
            "Cyb3r$ecur!ty_L3gend#99"
        ]
    },
    {
        id: 5,
        question: "What is a DDoS attack?",
        options: [
            "Direct Denial of Service: Stealing data directly",
            "Distributed Denial of Service: Overwhelming a system from multiple sources",
            "Data Destruction on Server",
            "Domain Detachment of Service"
        ]
    },
    {
        id: 6,
        question: "What is Two-Factor Authentication (2FA)?",
        options: [
            "Using two different passwords",
            "Logging in twice to confirm identity",
            "Using two different methods (e.g., password + SMS code) to verify identity",
            "Sharing your account with a friend"
        ]
    },
    {
        id: 7,
        question: "What is 'Ransomware'?",
        options: [
            "Software that steals RAM",
            "Malware that encrypts your files and demands payment",
            "A tool to recover lost passwords",
            "An antivirus software"
        ]
    },
    {
        id: 8,
        question: "Which port is commonly used for HTTPS?",
        options: [
            "80",
            "21",
            "443",
            "22"
        ]
    },
    {
        id: 9,
        question: "What does 'Social Engineering' rely on?",
        options: [
            "Advanced coding skills",
            "Manipulating human psychology",
            "Brute forcing passwords",
            "Network sniffing"
        ]
    },
    {
        id: 10,
        question: "What is a 'Zero-Day' vulnerability?",
        options: [
            "A vulnerability that is 0 days old and has no patch",
            "A vulnerability discovered on Sunday",
            "A bug that affects zero users",
            "A fully patched security flaw"
        ]
    }
];

const RoadmapSection = () => {
    const [state, setState] = useState('quiz'); // quiz, analyzing, roadmap
    const [answers, setAnswers] = useState({});
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [roadmapData, setRoadmapData] = useState(null);
    const [error, setError] = useState(null);

    const handleOptionSelect = (option) => {
        setAnswers(prev => ({ ...prev, [QUESTIONS[currentQIndex].question]: option }));
    };

    const handleNext = () => {
        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        setState('analyzing');
        setError(null);

        // Construct the prompt
        const answersText = Object.entries(answers).map(([q, a]) => `Q: ${q} A: ${a}`).join('\n');
        const prompt = `
      Analyze these cyber security quiz answers:
      ${answersText}
      
      Identify weak areas based on incorrect or suboptimal answers.
      Create a personalized 5-step learning roadmap.
      
      CRITICAL INSTRUCTION: Return ONLY raw JSON. No markdown formatting, no code blocks.
      Format: [{ "title": "Step Name", "description": "Details", "resource": "Link or Term" }]
    `;

        try {
            const response = await window.puter.ai.chat(prompt);
            const content = response?.message?.content || response?.toString() || "";

            // Clean up markdown code blocks if present
            const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();

            const parsedData = JSON.parse(jsonString);

            if (Array.isArray(parsedData) && parsedData.length > 0) {
                setRoadmapData(parsedData);
                setState('roadmap');
            } else {
                throw new Error("Invalid JSON structure received");
            }
        } catch (err) {
            console.error("Analysis Error:", err);
            setError("AI Analysis failed. Data stream corrupted. Resynchronizing...");
            // Fallback data for demo if AI fails completely
            setRoadmapData([
                { title: "Basics of Security", description: "Review core concepts like CIA Triad.", resource: "Cybersecurity 101" },
                { title: "Network Defense", description: "Understand Firewalls and VPNs.", resource: "Network Security" },
                { title: "Threat Management", description: "Learn about Malware and Phishing.", resource: "Threat Landscape" },
                { title: "Cryptography", description: "Study Encryption and Hashing.", resource: "Crypto Basics" },
                { title: "Ethical Hacking", description: "Introduction to Pen Testing.", resource: "TryHackMe" }
            ]);
            setState('roadmap'); // Still show roadmap even if fallback
        }
    };

    const restart = () => {
        setAnswers({});
        setCurrentQIndex(0);
        setRoadmapData(null);
        setState('quiz');
    };

    return (
        <section className="py-20 px-4 max-w-4xl mx-auto min-h-[600px] flex flex-col justify-center">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
                    NEURAL LINK ASSESSMENT
                </h2>
                <p className="text-slate-400 font-mono">
                    {state === 'quiz' && "Calibrating skill level based on response patterns..."}
                    {state === 'analyzing' && "Processing neural feedback loop..."}
                    {state === 'roadmap' && "Optimization complete. Uploading learning path..."}
                </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                {state === 'quiz' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={currentQIndex}
                        className="relative z-10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-mono text-cyan-400">QUERY {currentQIndex + 1}/{QUESTIONS.length}</span>
                            <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-500 transition-all duration-500"
                                    style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-8 text-white">{QUESTIONS[currentQIndex].question}</h3>

                        <div className="space-y-3">
                            {QUESTIONS[currentQIndex].options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleOptionSelect(opt)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 group
                    ${answers[QUESTIONS[currentQIndex].question] === opt
                                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100'
                                            : 'bg-slate-900/40 border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800'
                                        }`}
                                >
                                    <span className="font-mono mr-3 opacity-50 group-hover:text-cyan-400">0{i + 1}</span>
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={!answers[QUESTIONS[currentQIndex].question]}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 neon-border"
                            >
                                {currentQIndex === QUESTIONS.length - 1 ? 'INITIATE ANALYSIS' : 'NEXT SEQUENCE'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {state === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center py-20 relative z-10">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse"></div>
                            <Cpu size={64} className="text-cyan-400 animate-bounce" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">ANALYZING RESPONSE VECTORS</h3>
                        <p className="text-slate-400 font-mono">Consulting AI Core...</p>
                    </div>
                )}

                {state === 'roadmap' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Shield className="text-purple-500" />
                                PERSONALIZED TRAJECTORY
                            </h3>
                            <button
                                onClick={restart}
                                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                            >
                                <RefreshCw size={14} /> RECALIBRATE
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300 flex items-center gap-2">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <div className="border-l-2 border-slate-700 ml-4 space-y-8 pl-8 py-2 relative">
                            {roadmapData && roadmapData.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group"
                                >
                                    {/* Timeline Node */}
                                    <span className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-purple-500 group-hover:bg-purple-500 transition-colors flex items-center justify-center">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                    </span>

                                    <div className="bg-slate-800/40 p-5 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-1 rounded">PHASE 0{idx + 1}</span>
                                            <h4 className="text-xl font-bold text-white">{step.title}</h4>
                                        </div>
                                        <p className="text-slate-400 mb-3 leading-relaxed">{step.description}</p>
                                        {step.resource && (
                                            <div className="flex items-center gap-2 text-cyan-400 text-sm font-mono opacity-80 group-hover:opacity-100">
                                                <Terminal size={14} />
                                                <span>RESOURCE_LINK: {step.resource}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default RoadmapSection;
