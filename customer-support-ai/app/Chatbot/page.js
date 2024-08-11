'use client'

import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import NavBar from '../Components/NavBar';
import withPrivateRoute from '../Components/withPrivateRoute';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your COMSATS University Support Assistant. How can I help?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [ratings, setRating] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const bottomRef = useRef(null);

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

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim() || ratings === 0) {
      setError('Both rating and feedback are required.');
      return;
    }

    if (ratings < 1 || ratings > 5) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    setError('');
    setSubmitted(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback, ratings }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      setFeedback('');
      setRating(0);
      setShowFeedbackForm(false);
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error:', error);
      alert(`There was an error submitting your feedback: ${error.message}`);
    } finally {
      setSubmitted(false);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-cyan-600 font-mono">
      <NavBar />

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
                    className={`max-w-[60%] md:max-w-[50%] lg:max-w-[40%] rounded-2xl p-3 text-gray-800 ${message.role === 'assistant' ? 'bg-blue-200' : 'bg-gray-100'} shadow-sm`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            <div ref={bottomRef} />
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
          {showFeedbackForm && (
            <div className="mt-4">
              <h2 className="text-xl mb-2">Feedback</h2>
              {error && <p className="text-red-500 mb-2">{error}</p>}
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 font-semibold">Rating (1 to 5):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="text-black w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                    value={ratings}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    placeholder="Enter rating"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">/ 5</span>
                </div>
              </div>

              <textarea
                placeholder="Leave your feedback here"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                className="mt-2 p-2 bg-cyan-600 text-white rounded-md"
                onClick={handleFeedbackSubmit}
                disabled={submitted}
              >
                {submitted ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                className="mt-2 p-2 bg-gray-100 text-black rounded-md"
                onClick={() => setShowFeedbackForm(false)}
              >
                Cancel
              </button>
            </div>
          )}
          {!showFeedbackForm && (
            <button
              className="mt-4 p-2 bg-cyan-600 text-white rounded-md"
              onClick={() => setShowFeedbackForm(true)}
            >
              Leave Feedback
            </button>
          )}
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

export default withPrivateRoute(Chatbot);
