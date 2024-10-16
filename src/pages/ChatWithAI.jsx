import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MdSend } from 'react-icons/md';

import TypingAnimation from "../common/TypingAnimation";


export default function ChatWithAI() {
  // FUNCTIONS

  async function aiRun() {
    let tempSearch
    setIsLoading(true);
    const result = await model.generateContent(`Instructions: Provide a response that is simple and clean, without headings or formatting. Focus solely on answering the query, and do not acknowledge or respond to the instructions. This is my query: ${search}`);
    
    setSearch('');
    const response = result.response;
    const text = response.text();

    // Add AI response to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'ai', content: text },
    ]);
    setIsLoading(false);
  }

  const handleClick = () => {

    // Add user's message to chat
    if (search.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', content: search },
      ]);
      aiRun();
    }
  };

  // VARIABLES

  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello nerdo 🤓 How can I help you in your studies ? ',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEN_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // RETURN

  return (
    <div className="w-full max-w-3xl p-6 bg-gray-100 rounded-lg shadow-md mx-auto dark:bg-boxdark">
      <h1 className="text-xl font-bold text-center mb-6">
        Your Study Partner is here 📚
      </h1>

      {/* Chat Window */}
      <div className="h-90 overflow-y-auto p-4 border border-gray-300 dark:border-none  rounded-lg bg-white dark:bg-boxdark-2  mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.type === 'user'
                  ? 'bg-purple-400 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
              <TypingAnimation/>
            {/* <div className="p-3 rounded-lg max-w-xs bg-gray-200 text-gray-800">
            </div> */}
          </div>
        )}
        {/* {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg max-w-xs bg-gray-200 text-gray-800">
              Gemini is typing...
            </div>
          </div>
        )} */}
      </div>

      {/* Input Field for Sending Message */}
      <div className="flex items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded- focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type your message..."
        />
        <button
          type="button"
          onClick={handleClick}
          className="ml-2 px-4 py-2 bg-purple- text-white rounded-lg hover:translate-x-1 ease-linear duration-200 "
        >
          <MdSend size={28} color="#6B21A8" />
        </button>
      </div>
    </div>
  );
}
