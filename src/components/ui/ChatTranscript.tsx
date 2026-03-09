import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AiMessage = ({ msg }: { msg: any }) => {
  const [showTranslation, setShowTranslation] = useState(false);

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
    <div className="flex flex-col items-start gap-1 w-full">
      <div className="px-4 py-2 rounded-2xl max-w-[85%] text-sm bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm">
        {renderTextWithHighlights(msg.text)}
      </div>
      {msg.translation && (
        <div className="max-w-[85%] w-full">
          <button 
            onClick={() => setShowTranslation(!showTranslation)}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 ml-1 transition-colors"
          >
            {showTranslation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showTranslation ? '隐藏翻译' : '查看翻译'}
          </button>
          <AnimatePresence>
            {showTranslation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 mt-1">
                  {msg.translation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default function ChatTranscript() {
  const { messages, isThinking } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

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
          {msg.sender === 'user' ? (
            <div className="px-4 py-2 rounded-2xl max-w-[85%] text-sm bg-slate-800 text-white rounded-br-sm">
              {msg.text}
            </div>
          ) : (
            <AiMessage msg={msg} />
          )}
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
