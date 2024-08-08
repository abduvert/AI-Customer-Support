'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your University Support Assistant. How can I help?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  };

  const fetchMoreMessages = async () => {
    setHasMore(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cyan-600 font-mono">
      <div className="w-full fixed top-0 bg-white z-10 flex justify-center items-center p-4">
          <h1 className="text-4xl text-center">🎓</h1>
        </div>

      <div className="flex-grow flex flex-col items-center mt-16 px-4 md:px-8 pb-5 pt-20">
        <div className="bg-white w-full max-w-6xl h-[70vh] flex flex-col items-center shadow-md p-5">
          <div className="flex-grow overflow-auto w-full mb-4" id="scrollableDiv">
            <InfiniteScroll
              dataLength={messages.length}
              next={fetchMoreMessages}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={<p className="text-center">No more messages</p>}
              scrollableTarget="scrollableDiv"
              className="flex flex-col space-y-2"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[60%] md:max-w-[50%] lg:max-w-[40%] rounded-2xl p-3 text-gray-800 ${message.role === 'assistant' ? 'bg-blue-200' : 'bg-blue-100'} shadow-sm`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
          <div className="flex space-x-2 w-full">
            <input
              type="text"
              placeholder="Message"
              className="flex-grow p-2 border border-gray-300 rounded-l-md shadow-sm text-gray-800"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="p-2 bg-cyan-600 text-white rounded-r-md shadow-sm"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-cyan-600 text-center py-4 pt-10">
        <p className="text-white text-sm">
          &copy; {new Date().getFullYear()} University Support. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
