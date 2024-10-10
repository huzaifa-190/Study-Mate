import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FormElements = () => {
    const [messages, setMessages] = useState([
        { type: "ai", content: "How can I help you in studies?" },
    ]); // Initial AI greeting message
    const [isLoading, setIsLoading] = useState(false); // To show loading status for AI response
    const [search, setSearch] = useState(''); // User input

    const genAI = new GoogleGenerativeAI('AIzaSyCA2Sbx6KZfo67BAkAR9fbmlGqyMCybDkE');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generative AI Call to fetch AI response
    async function aiRun() {
        setIsLoading(true);
        const result = await model.generateContent(`${search}
            do not use headings, give a simple and clean response`);
        const response = result.response;
        const text = response.text();

        // Add AI response to the chat
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: "ai", content: text },
        ]);
        setIsLoading(false);
    }

    // Button event trigger to consume Gemini API and show user message
    const handleClick = () => {
        // Add user's message to chat
        if (search.trim() !== "") {
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: "user", content: search },
            ]);
            aiRun(); // Call AI after user sends message
        }
    };

    return (
        <div className="w-full max-w-3xl p-6 bg-gray-100 rounded-lg shadow-md mx-auto">
            <h1 className="text-xl font-bold text-center mb-6">Gemini AI Chat</h1>

            {/* Chat Window */}
            <div className="h-96 overflow-y-auto p-4 border border-gray-300 rounded-lg bg-white mb-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-xs ${msg.type === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg max-w-xs bg-gray-200 text-gray-800">
                            Gemini is typing...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Field for Sending Message */}
            <div className="flex items-center">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Type your message..."
                />
                <button
                    type="button"
                    onClick={handleClick}
                    className="ml-2 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default FormElements;
