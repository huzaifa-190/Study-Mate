import React from 'react';

const TypingAnimation = () => {
  return (
    <div className="flex space-x-1">
      <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"></div>
      <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce delay-300"></div>
      <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce delay-500"></div>
    </div>
  );
};

export default TypingAnimation
