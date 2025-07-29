import React, { useState, useEffect, useRef } from 'react';

// Main App component
const App = () => {
    const [messages, setMessages] = useState([]); // State to store chat messages
    const [input, setInput] = useState(''); // State for the user input field
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

    // Scroll to the bottom of the chat window when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Function to send a message and get a response from the bot
    const sendMessage = async () => {
        if (input.trim() === '') return; // Don't send empty messages

        const userMessage = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message to chat
        setInput(''); // Clear input field
        setIsLoading(true); // Show loading indicator

        try {
            // Prepare chat history for the API call
            let chatHistory = [
                {
                    role: "user",
                    parts: [{ text: "You are a helpful assistant specializing in halal restaurants in Edmonton. Answer questions about their cuisine, location, features, pricing, and customer reviews. Provide the information as a list of bullet points. Each bullet point should be a concise sentence or phrase. Return the response as a JSON object with a single key 'points' which is an array of strings." }]
                },
                ...messages.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                })),
                { role: "user", parts: [{ text: input }] } // Add the current user input
            ];

            const payload = {
                contents: chatHistory,
                generationConfig: {
                    temperature: 0.7,
                    // MODIFIED: Requesting JSON output with a specific schema for bullet points
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            points: {
                                type: "ARRAY",
                                items: {
                                    type: "STRING"
                                }
                            }
                        },
                        required: ["points"]
                    }
                }
            };

            const apiKey = ""; // Canvas will provide this automatically
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Check if the response contains valid content and parse the JSON
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                let jsonResponseText = result.candidates[0].content.parts[0].text;

                // FIX: Remove Markdown code block delimiters if present
                if (jsonResponseText.startsWith('```json')) {
                    jsonResponseText = jsonResponseText.substring(jsonResponseText.indexOf('\n') + 1);
                    jsonResponseText = jsonResponseText.replace(/\n```$/, '');
                }

                try {
                    const parsedResponse = JSON.parse(jsonResponseText);
                    if (parsedResponse.points && Array.isArray(parsedResponse.points)) {
                        setMessages((prevMessages) => [...prevMessages, { text: parsedResponse.points, sender: 'bot', type: 'list' }]);
                    } else {
                        // Fallback if 'points' array is not found or not an array
                        setMessages((prevMessages) => [...prevMessages, { text: "Sorry, I couldn't format the response. Please try again.", sender: 'bot' }]);
                        console.error("API response did not contain a 'points' array:", parsedResponse);
                    }
                } catch (jsonError) {
                    // Handle cases where the response is not valid JSON
                    console.error("Error parsing JSON response:", jsonError, "Raw response:", jsonResponseText);
                    setMessages((prevMessages) => [...prevMessages, { text: "Sorry, I received an unreadable response. Please try again.", sender: 'bot' }]);
                }
            } else {
                // Handle cases where the response structure is unexpected or content is missing
                console.error("Unexpected API response structure:", result);
                setMessages((prevMessages) => [...prevMessages, { text: "Sorry, I couldn't get a response. Please try again.", sender: 'bot' }]);
            }
        } catch (error) {
            console.error("Error fetching from Gemini API:", error);
            setMessages((prevMessages) => [...prevMessages, { text: "An error occurred while connecting to the chatbot. Please try again.", sender: 'bot' }]);
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    // Handle Enter key press in the input field
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col h-[80vh] md:h-[90vh]">
                {/* Chat Header */}
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-xl shadow-md">
                    <h1 className="text-2xl font-bold text-center">Halal Restaurant Chatbot</h1>
                    <p className="text-sm text-center mt-1 opacity-90">Ask me about halal restaurants in Edmonton!</p>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            Type a message to start chatting!
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                            >
                                {/* CONDITIONAL RENDERING: Render as a list if type is 'list', otherwise as plain text */}
                                {msg.type === 'list' && Array.isArray(msg.text) ? (
                                    <ul className="list-disc list-inside space-y-1">
                                        {msg.text.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-gray-200 text-gray-800 rounded-bl-none">
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 text-gray-600 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Typing...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
                </div>

                {/* Chat Input Area */}
                <div className="p-4 border-t border-gray-200 flex items-center bg-gray-50 rounded-b-xl">
                    <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button
                        className="ml-3 px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={sendMessage}
                        disabled={isLoading}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
