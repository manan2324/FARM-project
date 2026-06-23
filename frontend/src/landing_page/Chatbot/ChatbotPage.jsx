import React, { useState, useRef, useEffect } from 'react';

// --- SVG Icon Components ---
const BotIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="7" width="20" height="15" rx="2" />
        <path d="M12 2v5" />
        <path d="M8 12v2" />
        <path d="M16 12v2" />
        <path d="M8 17h8" />
        <path d="M2 11h20" />
    </svg>
);
const SendIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
const SparklesIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m12 3-1.5 3L7 7.5l3 1.5L11.5 12l1.5-3L16 7.5l-3-1.5zM3 12l1.5-3L7.5 7 6 4 4.5 1 3 4 0 5.5l3 1.5zM21 12l-1.5 3-3-1.5 1.5-3L19.5 9l1.5 3z" />
    </svg>
);

// --- Main Chatbot Component ---
const ChatbotPage = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Crop Advisor. How can I help you with your farming questions today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const [suggestionChips, setSuggestionChips] = useState(["Weather in Ahmedabad", "Best fertilizer for wheat", "When to plant tomatoes?"]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // --- Gemini API Call ---
    const getGeminiResponse = async (userMessage, chatHistory) => {
        setIsTyping(true);
        setError(null);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        // System prompt to guide the AI
        const systemPrompt = `You are an expert AI Crop Advisor for farmers in India. Your goal is to provide concise, helpful, and actionable advice.
    - Current location: Ahmedabad, Gujarat, India.
    - Current date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
    - Keep responses brief and to the point (2-3 sentences max unless details are requested).
    - If asked about weather, use the current location.
    - If you don't know an answer, say so.`;

        const payload = {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                // A simple way to include some history for context, could be expanded
                ...chatHistory.slice(-4).map(msg => ({
                    role: msg.sender === 'bot' ? 'model' : 'user',
                    parts: [{ text: msg.text }]
                })),
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ],
            tools: [{ "google_search": {} }], // Enable grounding for up-to-date info
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            const botResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (botResponseText) {
                const botResponse = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
                setMessages(prev => [...prev, botResponse]);
            } else {
                throw new Error("Received an empty response from the AI.");
            }

        } catch (e) {
            console.error("Gemini API call failed:", e);
            setError("Sorry, I'm having trouble connecting. Please try again in a moment.");
            // Add error message to chat
            const errorResponse = { id: Date.now() + 1, text: "Sorry, I couldn't get a response. Please check your connection and try again.", sender: 'bot', isError: true };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        const newUserMessage = { id: Date.now(), text, sender: 'user' };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);
        setInputValue('');

        getGeminiResponse(text, messages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    }

    const fetchTaskSuggestions = async () => {
        setIsFetchingSuggestions(true);
        const prompt = `Based on the current date (${new Date().toLocaleDateString()}) and location (Ahmedabad, Gujarat), suggest 3-4 concise, actionable farming tasks. Format as a simple list.`;

        // We can use the same Gemini function
        await getGeminiResponse(prompt, []);
        setIsFetchingSuggestions(false);
    }

    return (
        <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-2 sm:p-4">
            <div className="w-full max-w-2xl h-[90vh] sm:h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col">
                <header className="flex items-center p-4 border-b-2 border-slate-100 flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <BotIcon className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-lg font-extrabold text-slate-800">AI Crop Advisor</h1>
                        <p className="text-sm text-green-600 font-semibold flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            Online
                        </p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6 h-full" ref={messagesContainerRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <BotIcon className="w-5 h-5 text-slate-600" />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : msg.isError ? 'bg-red-100 text-red-800 rounded-bl-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <BotIcon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-100 rounded-bl-none">
                                <div className="flex items-center justify-center space-x-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dummy div to scroll into view */}
                    <div ref={messagesEndRef}></div>
                </main>


                {messages.length <= 1 && (
                    <div className="px-6 pb-4 flex flex-wrap gap-2">
                        {suggestionChips.map(chip => (
                            <button key={chip} onClick={() => handleSendMessage(chip)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-full transition-colors">
                                {chip}
                            </button>
                        ))}
                        <button onClick={fetchTaskSuggestions} disabled={isFetchingSuggestions} className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold text-sm rounded-full transition-colors flex items-center gap-1.5 disabled:opacity-50">
                            ✨ Suggest Tasks for my Farm
                        </button>
                    </div>
                )}

                <footer className="p-4 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask me anything about farming..."
                            className="flex-1 w-full px-4 py-3 text-sm bg-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue || isTyping}
                            className="p-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default ChatbotPage;