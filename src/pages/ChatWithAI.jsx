import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MdSend } from 'react-icons/md';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import TypingAnimation from '../common/TypingAnimation';

export default function ChatWithAI() {
  //---------------------------------------------------------------- STATES

  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello nerdo 🤓 How can I help you in your studies ? ',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const bottomRef = useRef(null);

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //---------------------------------------------------------------- FUNCTIONS

  async function aiRun() {
    setIsLoading(true);
    setSearch('');
    console.log(' \n\n Searching on GenAI => ' + search);

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // contents: `Provide a response that is simple and clean, without headings or formatting. Focus solely on answering the query, and do not acknowledge or respond to the instructions. This is my query: ${search}`,
      contents: search,
    });
    console.log(' \n\n Reponse from GenAI => ' + result.text);

    // const response = result.response;
    const text = result.text;

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
  //---------------------------------------------------------------- RETURN

  return (
    <div className="w-full max-w-3xl p-6 bg-gray-100 rounded-lg shadow-md mx-auto dark:bg-boxdark">
      <h1 className="text-xl font-bold text-center mb-6">
        Your Study Partner is here 📚
      </h1>

      {/* Chat Window */}
      <div className="h-90 overflow-y-auto p-4 border border-gray-300 dark:border-none rounded-lg bg-white dark:bg-boxdark-2 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xl prose prose-sm dark:prose-invert ${
                msg.type === 'user'
                  ? 'bg-purple-400 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.type === 'ai' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-200 px-1 rounded" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
            <div ref={bottomRef} />
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <TypingAnimation />
          </div>
        )}
      </div>

      {/* Input Field for Sending Message */}
      <div className="flex items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!isLoading) handleClick();
            }
          }}
          className="flex-grow px-3 py-2 border border-gray-300 rounded- focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type your message..."
        />
        <button
          type="button"
          onClick={handleClick}
          className={`ml-2 px-4 py-2 bg-purple- text-white rounded-lg hover:translate-x-1 ease-linear duration-200 ${
            isLoading ? 'cursor-not-allowed' : ''
          } `}
          disabled={isLoading}
        >
          <MdSend size={28} color="#6B21A8" />
        </button>
      </div>
    </div>
  );
}
