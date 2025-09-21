import React, { useState, useEffect, useRef } from 'react';

// This component injects the necessary global styles into the document head
const GlobalStyles = () => (
  <style>{`
    :root {
        --tea-green: #CAE7B9;
        --flax: #F3DE8A;
        --coral-pink: #EB9486;
        --cool-gray: #7E7F9A;
        --cadet-gray: #97A7B3;
        --black: #2E2E2E;
    }

    body {
        font-family: 'Press Start 2P', cursive;
        background-color: var(--cool-gray);
        color: var(--black);
        -webkit-font-smoothing: none;
        -moz-osx-font-smoothing: grayscale;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }

    /* Custom pixelated border style */
    .pixel-border {
        border: 4px solid var(--black);
        box-shadow: 
            inset 0 0 0 4px var(--cadet-gray),
            8px 8px 0px var(--black);
    }
    
    .pixel-border-inner {
        border: 4px solid var(--black);
    }

    .pixel-button {
        background-color: var(--flax);
        border: 4px solid var(--black);
        box-shadow: 4px 4px 0px var(--black);
        transition: all 0.1s ease-in-out;
        transform: translate(0, 0);
    }

    .pixel-button:active {
        box-shadow: none;
        transform: translate(4px, 4px);
    }

    /* Custom scrollbar for the retro feel */
    ::-webkit-scrollbar {
        width: 16px;
    }
    ::-webkit-scrollbar-track {
        background: var(--cadet-gray);
        border-left: 4px solid var(--black);
    }
    ::-webkit-scrollbar-thumb {
        background: var(--flax);
        border: 4px solid var(--black);
    }
    ::-webkit-scrollbar-thumb:hover {
        background: var(--coral-pink);
    }

    /* Webkit specific styles for pixelated rendering */
    input, button, select, textarea {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
  `}</style>
);

// --- Child Components ---

const Header = ({ points }) => (
    <header className="flex justify-between items-center pb-2 border-b-4 border-black">
        <div id="currency-counter" className="bg-tea-green p-2 pixel-border-inner flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a64 64 0 0 0-53.11-62.35a8 8 0 0 0-10.78 10.78A48.11 48.11 0 0 1 176 128a47.41 47.41 0 0 1-13.43 33.15a8 8 0 1 0 11.08 11.59A63.22 63.22 0 0 0 192 128m-69.11 39.65a8 8 0 0 0-10.78-10.78A48.11 48.11 0 0 1 80 128a47.41 47.41 0 0 1 13.43-33.15a8 8 0 1 0-11.08-11.59A63.22 63.22 0 0 0 64 128a64 64 0 0 0 53.11 62.35a8 8 0 0 0 10.78-10.78Z"/></svg>
            <span id="points-display">{points}</span>
        </div>
        <h1 className="text-2xl">WALLET</h1>
    </header>
);

const Chatbot = ({ onQuery }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userQuery = query.trim();
        if (!userQuery) return;

        setIsThinking(true);
        setResponse('');
        setQuery('');

        try {
            const apiResponse = await callGeminiAPI(userQuery);
            setResponse(apiResponse);
        } catch (error) {
            console.error("Gemini API Error:", error);
            setResponse("Sorry, I couldn't connect to my brain right now.");
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div id="chatbot-area" className="flex flex-col gap-2">
            {(response || isThinking) && (
                <div id="chatbot-response-container" className="bg-tea-green p-4 pixel-border-inner min-h-[80px] text-sm max-h-48 overflow-y-auto">
                    <p id="chatbot-response-text">{isThinking ? 'Thinking...' : response}</p>
                </div>
            )}
            <form id="chatbot-form" className="flex gap-2" onSubmit={handleSubmit}>
                <input 
                    id="chatbot-input" 
                    type="text" 
                    placeholder="Ask a financial question..." 
                    className="w-full p-2 bg-tea-green pixel-border-inner focus:outline-none placeholder:text-black/50"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="pixel-button px-4">GO</button>
            </form>
        </div>
    );
};

const CalendarTab = ({ reminders, onAddReminder, onRemoveReminder }) => {
    const dateInputRef = useRef(null);

    useEffect(() => {
        if (dateInputRef.current) {
            dateInputRef.current.value = new Date().toISOString().split('T')[0];
        }
    }, []);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const taskInput = e.target.elements['reminder-task'];
        const dateInput = e.target.elements['reminder-date'];
        onAddReminder(taskInput.value, dateInput.value);
        e.target.reset();
        dateInput.value = new Date().toISOString().split('T')[0];
    };

    const sortedReminders = [...reminders].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div id="content-calendar" className="tab-content flex flex-col gap-4 h-full pr-2">
            <h2 className="text-lg text-center">FINANCIAL TO-DO'S</h2>
            <div id="reminders-list" className="flex-1 flex flex-col gap-2">
                {sortedReminders.length > 0 ? (
                    sortedReminders.map(reminder => (
                        <div key={reminder.id} className="flex justify-between items-center p-2 bg-white/50">
                            <div className="flex flex-col">
                                <span>{reminder.task}</span>
                                <span className="text-xs opacity-70">{new Date(reminder.date + 'T00:00:00').toLocaleDateString()}</span>
                            </div>
                            <button onClick={() => onRemoveReminder(reminder.id)} className="remove-reminder-btn text-xl text-red-700 hover:text-red-500">×</button>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4">No reminders yet! Add one below.</div>
                )}
            </div>
            <form id="add-reminder-form" onSubmit={handleSubmit} className="flex flex-col gap-2 mt-auto pt-2 border-t-4 border-black">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" id="reminder-task" name="reminder-task" placeholder="New Task..." className="flex-1 px-1 py-2 bg-white pixel-border-inner focus:outline-none" required />
                    <input type="date" id="reminder-date" name="reminder-date" ref={dateInputRef} className="p-2 bg-white pixel-border-inner focus:outline-none" required />
                </div>
                <button type="submit" className="pixel-button px-8 self-center">ADD</button>
            </form>
        </div>
    );
};

const StampsTab = ({ stamps }) => (
    <div id="content-stamps" className="tab-content">
        <h2 className="text-lg text-center mb-4">COLLECTED STAMPS</h2>
        <div id="stamps-grid" className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {stamps.map(stamp => (
                <div key={stamp.id} className="aspect-square flex flex-col items-center justify-center p-2 text-center pixel-border-inner" style={{ backgroundColor: stamp.color }}>
                    <div className="text-4xl">{stamp.icon}</div>
                    <div className="text-xs mt-1">{stamp.name}</div>
                </div>
            ))}
        </div>
    </div>
);


// --- GEMINI API INTEGRATION ---
async function callGeminiAPI(query) {
    const apiKey = ""; // This will be handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const systemPrompt = `## Core Identity
You are a specialized financial AI chatbot.

## Primary Directive
Your absolute top priority is to deliver answers with maximum brevity and clarity. You must sacrifice verbosity for conciseness in every response.

## Rules of Engagement
1.  **Conciseness Protocol:** Responses must be as short as humanly possible while still being accurate. Aim for 2-4 sentences. Never use conversational filler ("Certainly!", "That's a great question!", etc.).
2.  **Direct Answer Structure:**
    -   Line 1: The direct answer to the user's core question.
    -   Line 2-3: A brief, essential explanation or context.
    -   (Optional) Line 4+: Bullet points for lists or data.
3.  **Progressive Disclosure:** For complex topics, provide the short, high-level answer first. You may then ask the user if they want a more detailed explanation, e.g., "Would you like me to elaborate on that?"
4.  **Data Formatting:** Always use bullet points (\`*\`) or numbered lists (\`1.\`) instead of writing lists out in paragraph form.
5.  **Query Scoping:** If a user's question is too broad (e.g., "Tell me about stocks"), ask a clarifying question to narrow the scope (e.g., "Are you asking what a stock is, how to buy one, or something else?") instead of providing a long, general answer.
6.  **No Wallet Access:** You do not have direct access to the user's wallet data (like stamps or reminders). If asked, guide them to use the app's features (e.g., "Check the 'Stamps' tab to see your collection.").

## Critical Safety Disclaimer
**Non-negotiable:** Every single response must end with a clear and concise disclaimer on a new line. Use one of these examples:
- "This is for informational purposes only and is not financial advice."
- "Consult with a qualified financial professional before making any decisions."`;

    const payload = {
        contents: [{ parts: [{ text: query }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    
    const candidate = result.candidates?.[0];
    if (candidate && candidate.content?.parts?.[0]?.text) {
        return candidate.content.parts[0].text;
    } else {
        return "I'm not sure how to respond to that. Please try another question.";
    }
}


// --- Main App Component ---
export default function App() {
    // --- STATE MANAGEMENT ---
    const [points, setPoints] = useState(500);
    const [reminders, setReminders] = useState([
        { id: 1, task: 'Pay credit card bill', date: '2025-09-25' },
        { id: 2, task: 'Review monthly budget', date: '2025-10-01' },
        { id: 3, task: 'Call insurance company', date: '2025-09-22' },
    ]);
    const [stamps] = useState([
        { id: 1, name: 'Budgeting Basics', icon: '💰', color: 'var(--flax)' },
        { id: 2, name: 'Credit Score 101', icon: '💳', color: 'var(--coral-pink)' },
        { id: 3, name: 'Intro to Investing', icon: '📈', color: 'var(--tea-green)' },
        { id: 4, name: 'Saving Smartly', icon: '🏦', color: 'var(--cadet-gray)' },
        { id: 5, name: 'Debt Management', icon: '📉', color: 'var(--flax)' },
    ]);
    const [activeTab, setActiveTab] = useState('calendar');

    // --- EVENT HANDLERS ---
    const handleAddReminder = (task, date) => {
        if (!task || !date) return;
        const newReminder = {
            id: Date.now(),
            task,
            date,
        };
        setReminders(prev => [...prev, newReminder]);
    };

    const handleRemoveReminder = (id) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    return (
        <>
            <GlobalStyles />
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"/>

            <div className="bg-cool-gray flex items-start justify-center min-h-screen p-4">
                <div id="wallet" className="w-full max-w-2xl bg-cadet-gray p-4 flex flex-col gap-4 pixel-border">
                    <Header points={points} />
                    <Chatbot />
                    
                    <nav className="flex">
                        <button 
                            className={`tab-button flex-1 p-3 pixel-border-inner ${activeTab === 'calendar' ? 'bg-flax' : 'bg-cool-gray'}`}
                            onClick={() => setActiveTab('calendar')}
                        >
                            CALENDAR
                        </button>
                        <button 
                            className={`tab-button flex-1 p-3 pixel-border-inner ${activeTab === 'stamps' ? 'bg-flax' : 'bg-cool-gray'}`}
                            onClick={() => setActiveTab('stamps')}
                        >
                            STAMPS
                        </button>
                    </nav>

                    <main className="flex-1 bg-tea-green p-4 pixel-border-inner">
                        {activeTab === 'calendar' && <CalendarTab reminders={reminders} onAddReminder={handleAddReminder} onRemoveReminder={handleRemoveReminder} />}
                        {activeTab === 'stamps' && <StampsTab stamps={stamps} />}
                    </main>
                </div>
            </div>
        </>
    );
}


