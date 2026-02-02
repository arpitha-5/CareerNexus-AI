import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/common/Navbar.jsx';

const CodeMentorPage = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your AI Code Mentor. I can help you debug tricky errors, explain complex algorithms, or optimize your code. What are you working on today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const simulateAIResponse = (userQuery) => {
        setIsTyping(true);
        let response = "";

        // Simple keyword matching for demo purposes
        const lowerQuery = userQuery.toLowerCase();

        if (lowerQuery.includes('optimize') || lowerQuery.includes('complexity')) {
            response = `Let's analyze the time complexity. \n\nYour current approach seems to be **O(n²)** because of the nested loops. \n\n**Hint:** Can we use a Hash Map to store visited elements? This would bring the lookup time down to **O(1)**, making the overall complexity **O(n)**.\n\nTry implementing that and let me know if you get stuck!`;
        } else if (lowerQuery.includes('debug') || lowerQuery.includes('error')) {
            response = `I see the issue. It looks like a classic **Off-By-One Error** in your loop condition.\n\n\`for (let i = 0; i <= arr.length; i++)\`\n\nArrays are 0-indexed, so accessing \`arr[arr.length]\` returns \`undefined\`. \n\n**Fix:** Change the condition to \`i < arr.length\`.`;
        } else if (lowerQuery.includes('react') || lowerQuery.includes('useeffect')) {
            response = `Great question about React! \n\n\`useEffect\` runs after every render by default. If you only want it to run once (like \`componentDidMount\`), pass an empty dependency array \`[]\`. \n\nIf you forget this, you might cause an **infinite loop** if you're setting state inside the effect!`;
        } else {
            response = `That's an interesting problem! \n\nTo solve this efficiently, first think about the data structure. \n- Would a **Stack** help with the ordering?\n- Or maybe a **Two-Pointer** approach?\n\nPlease paste your code snippet so I can give you specific hints!`;
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        simulateAIResponse(input);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 flex flex-col h-[calc(100vh-80px)]">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="text-3xl">👨‍💻</span> AI Code Mentor
                        </h1>
                        <p className="text-slate-500 text-sm">Interactive debugging & optimization assistant</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-xs font-mono text-slate-600">
                        Status: <span className="text-green-500 font-bold">Online</span>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                                        }`}
                                >
                                    <p className="font-bold text-[10px] uppercase mb-1 opacity-70">
                                        {msg.role === 'user' ? 'You' : 'Code Mentor'}
                                    </p>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4 flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-200">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste code or ask a logic question..."
                                className="flex-1 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm font-mono text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="bg-indigo-600 text-white px-8 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CodeMentorPage;
