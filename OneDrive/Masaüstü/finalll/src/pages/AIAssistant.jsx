import React from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';

export default function AIAssistant({ isModal = false }) {
  const [messages, setMessages] = React.useState([]);
  const [inputText, setInputText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;
    setInputText("");
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'ai' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server. Please check if the backend is running.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex ${isModal ? 'h-full' : 'h-[calc(100vh-64px)]'} overflow-hidden`}>
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-white/5 hidden md:flex flex-col">
        <div className="p-4 border-b border-white/10">
          <button className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl font-medium hover:bg-primary/20 transition-all">
            <Sparkles className="h-4 w-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Recent</div>
          {/* Mock history items */}
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-white/5 text-sm text-gray-300 hover:bg-white/10 cursor-pointer truncate">
              Learning about SQL Injection
            </div>
            <div className="p-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 cursor-pointer truncate">
              Red Team vs Blue Team
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Welcome Message or Chat History */}
          {messages.length === 0 ? (
            <div className="flex gap-4 max-w-3xl mx-auto">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-gray-300 leading-relaxed">
                  Hello! I'm megumi, your personal cybersecurity mentor. How can I help you advance your skills today?
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => setInputText("Explain Zero Trust Architecture")}
                    className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Explain Zero Trust Architecture
                  </button>
                  <button
                    onClick={() => setInputText("Create a study plan for OSCP")}
                    className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Create a study plan for OSCP
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl max-w-[80%] ${msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white/10 text-gray-200 rounded-tl-none'
                    }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-background/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-lg disabled:opacity-50"
              placeholder="Ask me anything about cybersecurity..."
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
