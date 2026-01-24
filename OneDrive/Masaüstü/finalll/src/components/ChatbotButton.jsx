import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import AIAssistant from '../pages/AIAssistant';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-5xl h-[85vh] bg-background border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold">AI Assistant</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close AI Assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* AI Assistant Content */}
            <div className="flex-1 overflow-hidden">
              <AIAssistant isModal={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
