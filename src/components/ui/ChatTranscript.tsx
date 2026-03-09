import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';

export default function ChatTranscript() {
  const { messages, isThinking } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const renderTextWithHighlights = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="text-brand-primary font-semibold bg-brand-primary/10 px-1 rounded mx-0.5">
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div 
      ref={scrollRef}
      className="w-full max-w-sm h-48 overflow-y-auto mb-6 flex flex-col gap-3 px-2 scroll-smooth"
    >
      {messages.map((msg) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={msg.id} 
          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
        >
          <div 
            className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
              msg.sender === 'user' 
                ? 'bg-slate-800 text-white rounded-br-sm' 
                : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm'
            }`}
          >
            {msg.sender === 'ai' ? renderTextWithHighlights(msg.text) : msg.text}
          </div>
        </motion.div>
      ))}
      
      {isThinking && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start"
        >
          <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm rounded-bl-sm flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
