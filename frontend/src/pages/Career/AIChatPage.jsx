import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar.jsx';

const AIChatPage = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your AI Career Advisor. I have access to your skill profile and goal (Full Stack Developer). How can I guide you today? \n\nTry asking: \n- \"How do I improve my resume?\"\n- \"What's the market demand for React?\"\n- \"Suggest a project for my portfolio.\""
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const simulateResponse = (query) => {
        setIsTyping(true);
        let reply = "";
        const q = query.toLowerCase();

        if (q.includes('resume')) {
            reply = "Based on your goal (Full Stack Dev), your resume needs more **Projects**. \n\nI recommend adding a 'System Design' section. Would you like me to scan your resume now? (Navigate to Resume Analysis)";
        } else if (q.includes('project') || q.includes('idea')) {
            reply = "**Project Idea:** Build a Real-Time Collab Tool.\n\n**Tech Stack:** React, Socket.io, Node.js, Redis.\n\n**Why:** It demonstrates knowledge of WebSockets and state management, which are high-value skills right now.";
        } else if (q.includes('learn') || q.includes('next')) {
            reply = "Your Skill Gap analysis shows you are weak in **Docker**. \n\nI strongly suggest focusing on **Containerization** this week. It's causing a 30% drag on your readiness score.";
        } else {
            reply = "That's a great question. Given the current market trends, I'd advise focusing on **Depth over Breadth**. \n\nPick one stack (MERN) and master it, rather than learning 10 different tools superficially.";
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            setIsTyping(false);
        }, 1200);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput('');
        simulateResponse(input);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col h-[calc(100vh-80px)]">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">Career <span className="text-teal-600">Brain</span></h1>
                    <p className="text-slate-500 text-sm">Your personal AI strategist</p>
                </div>

                <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden">
                    <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🧠</span>
                            <div>
                                <h2 className="font-bold text-sm">Context Aware</h2>
                                <p className="text-[10px] text-slate-400">Access: Resume, Skills, Goals</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${m.role === 'user'
                                        ? 'bg-teal-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-700 rounded-bl-none border border-slate-200'
                                    }`}>
                                    <React.Fragment>
                                        {m.content.split('\n').map((line, idx) => (
                                            <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                                        ))}
                                    </React.Fragment>
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && <div className="text-slate-400 text-xs animate-pulse ml-4">Thinking...</div>}
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
                        <input
                            className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="Ask me anything about your career path..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button disabled={!input || isTyping} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 font-bold transition-all">
                            Ask
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AIChatPage;
