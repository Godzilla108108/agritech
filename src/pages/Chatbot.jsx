import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop, FaPaperPlane, FaLeaf, FaSeedling, FaWater, FaChartLine, FaMagic } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Chatbot = () => {
  
  // Configuration
  const GEMINI_API_KEY =  'AIzaSyAzD26o28SzQAx2IVZcag6H0X8WjPi4haY';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  
  // State management
  const [messages, setMessages] = useState([{
    id: 1,
    text: "Welcome to AgriTech Assistant! 🌱 Ask about farming or say 'magic story' for a special tale.",
    sender: 'bot',
    isFormatted: false
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Quick actions
  const quickActions = [
    {
      icon: <FaSeedling className="text-green-500" />,
      label: "Crop Advice",
      prompt: "What are the best drought-resistant crops?"
    },
    {
      icon: <FaLeaf className="text-green-600" />,
      label: "Pest Control",
      prompt: "Organic methods to control whiteflies"
    },
    {
      icon: <FaWater className="text-blue-500" />,
      label: "Irrigation",
      prompt: "Smart irrigation techniques for small farms"
    },
    {
      icon: <FaMagic className="text-purple-500" />,
      label: "Magic Story",
      prompt: "Tell me a story about a magic tractor"
    }
    
  ];

  // Format response with highlights
  const formatResponse = (text) => {
    const formatted = text
      .replace(/(optimal|recommended|critical|important|warning)/gi, 
        '<strong class="text-blue-600 font-bold">$1</strong>')
      .replace(/(\d+%?)/g, '<span class="text-green-600 font-bold">$1</span>')
      .replace(/(ml|liters|inches|cm|kg|acres|hectares)/gi, 
        '<span class="text-yellow-600 font-medium">$1</span>')
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/\n/g, '<br/>');
    return { __html: `<p>${formatted}</p>` };
  };

  // Text-to-speech
  const speak = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synthRef.current.speak(utterance);
  };

  // API call with error handling
  const callGeminiAPI = async (prompt) => {
    setIsTyping(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Unexpected response format');
      }
      
      setConnectionStatus('online');
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('API Error:', error);
      setConnectionStatus('offline');
      return "I'm having trouble connecting. Please check your internet and try again.";
    } finally {
      setIsTyping(false);
    }
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      isFormatted: false
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate prompt based on input
    const isMagicStory = inputValue.toLowerCase().includes('magic');
    const prompt = isMagicStory
      ? `Write a 3-paragraph story about a magic agricultural tool. 
         Highlight key features in bold and include specific numbers where relevant.`
      : `As an agricultural expert, provide detailed advice about: ${inputValue}
         Format with paragraphs, bold important terms, and highlight measurements.`;

    // Get and display response
    const response = await callGeminiAPI(prompt);
    const botMessage = {
      id: Date.now() + 1,
      text: response,
      sender: 'bot',
      isFormatted: true
    };
    setMessages(prev => [...prev, botMessage]);
    speak(response);
  };

  // Voice input toggle
  const toggleVoiceInput = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ 
        continuous: true,
        language: 'en-US'
      });
    }
  };

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Message component
  const Message = ({ message }) => (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl p-4 my-1 ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white rounded-br-none'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        {message.isFormatted ? (
          <div
            dangerouslySetInnerHTML={formatResponse(message.text)}
            className="[&>p]:mb-3 [&>strong]:text-blue-600 [&>span]:font-medium"
          />
        ) : (
          message.text
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 p-2 rounded-full animate-bounce">
              <FaLeaf className="text-green-800 text-xl" />
            </div>
            <h1 className="text-xl font-bold">AgriTech Magic Assistant</h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-xs px-2 py-1 rounded-full ${
              connectionStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {connectionStatus === 'online' ? 'Online' : 'Offline'}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              listening ? 'bg-red-500 animate-pulse' : 'bg-gray-700'
            }`}>
              {listening ? 'Listening...' : 'Voice Ready'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden container mx-auto p-4 gap-4">
        {/* Sidebar */}
        <div className="hidden md:block w-72 bg-white rounded-xl shadow-md p-4 h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-green-700">
            <FaMagic className="mr-2" /> Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  setInputValue(action.prompt);
                  setTimeout(handleSendMessage, 100);
                }}
                className="w-full flex items-center p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-all border border-gray-200 text-gray-800 hover:text-green-700 group"
              >
                <span className="mr-3 group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleVoiceInput}
                disabled={!browserSupportsSpeechRecognition}
                className={`p-3 rounded-full ${
                  listening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
                title={browserSupportsSpeechRecognition ? 'Voice input' : 'Speech not supported'}
              >
                {listening ? <FaStop /> : <FaMicrophone />}
              </button>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about farming or say 'magic story'..."
                className="flex-1 border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-3 rounded-full ${
                  !inputValue.trim() || isTyping
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } transition-colors`}
              >
                <IoMdSend className="text-xl" />
              </button>
            </div>
            
            <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
              <span>
                {listening ? "Speak now..." : "Press mic to talk"}
              </span>
              <span>
                {synthRef.current?.speaking ? "Assistant speaking..." : ""}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;