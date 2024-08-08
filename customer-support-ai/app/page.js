'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your University Support Assistant. How can I help?",
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return;  

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-cyan-600 font-mono">
      <div className="fixed top-0 left-0 right-0 bg-white p-5 shadow-md text-4xl">
      🎓
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full pt-16">
        <div className="flex flex-col w-3/4 h-3/4 p-4 space-y-3 bg-white rounded-lg shadow-md">
          <div className="flex flex-col space-y-2 overflow-auto flex-grow max-h-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                className={`max-w-[60%] md:max-w-[50%] lg:max-w-[40%] rounded-2xl p-3 text-gray-800 ${message.role === 'assistant' ? 'bg-blue-200' : 'bg-blue-100'} shadow-sm`}
                >
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Message"
              className="text-gray-800 flex-grow p-2 border border-gray-300 rounded shadow-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="p-2 bg-cyan-600 text-white rounded shadow-sm"
              onClick={sendMessage}
              onKeyP
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
