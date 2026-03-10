import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AiMessage = ({ msg, isLast, isSpeaking, currentWordIndex, isWhisperMode }: { msg: any, isLast: boolean, isSpeaking: boolean, currentWordIndex: number, isWhisperMode: boolean }) => {
  const [showTranslation, setShowTranslation] = useState(false);

  const renderTextWithHighlightsAndKaraoke = (text: string) => {
    const words = text.split(' ');
    
    return words.map((word, i) => {
      const isHighlighted = word.includes('**');
      const cleanWord = word.replace(/\*\*/g, '');
      const isCurrentlySpoken = isLast && isSpeaking && i === currentWordIndex;
      
      let className = "transition-colors duration-200 ";
      if (isHighlighted) {
        className += isWhisperMode 
          ? "text-emerald-400 font-semibold bg-emerald-900/30 px-1 rounded mx-0.5 " 
          : "text-emerald-500 font-semibold bg-emerald-50 px-1 rounded mx-0.5 ";
      }
      if (isCurrentlySpoken) {
        className += isWhisperMode
          ? "bg-indigo-900/50 text-indigo-300 rounded px-0.5 "
          : "bg-brand-primary/20 text-brand-primary rounded px-0.5 ";
      }

      return (
        <span key={i} className={className}>
          {cleanWord}{' '}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <div className={`px-4 py-2 rounded-2xl max-w-[85%] transition-all hover:shadow-lg ${
        isWhisperMode 
          ? 'bg-slate-800 text-slate-300 border border-slate-700 shadow-sm rounded-bl-sm text-base' 
          : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm text-sm'
      }`}>
        {renderTextWithHighlightsAndKaraoke(msg.text)}
      </div>
      {msg.translation && (
        <div className="max-w-[85%] w-full">
          <button 
            onClick={() => setShowTranslation(!showTranslation)}
            className={`text-xs flex items-center gap-1 ml-1 transition-colors ${
              isWhisperMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'
            }`}
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
                <div className={`text-xs px-3 py-2 rounded-xl border mt-1 ${
                  isWhisperMode 
                    ? 'text-slate-400 bg-slate-800/50 border-slate-700' 
                    : 'text-slate-500 bg-slate-50 border-slate-100'
                }`}>
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
  const { messages, isThinking, isAiSpeaking, currentSpokenWordIndex, isWhisperMode } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, currentSpokenWordIndex]);

  return (
    <div 
      ref={scrollRef}
      className="w-full max-w-sm h-48 overflow-y-auto mb-6 flex flex-col gap-3 px-2 scroll-smooth"
    >
      {messages.map((msg, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={msg.id} 
          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
        >
          {msg.sender === 'user' ? (
            <div className={`px-4 py-2 rounded-2xl max-w-[85%] transition-all hover:shadow-lg rounded-br-sm ${
              isWhisperMode ? 'bg-indigo-900 text-indigo-100 text-base' : 'bg-slate-800 text-white text-sm'
            }`}>
              {msg.text}
            </div>
          ) : (
            <AiMessage 
              msg={msg} 
              isLast={index === messages.length - 1}
              isSpeaking={isAiSpeaking}
              currentWordIndex={currentSpokenWordIndex}
              isWhisperMode={isWhisperMode}
            />
          )}
        </motion.div>
      ))}
      
      {isThinking && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start ml-2"
        >
          <div className="relative flex items-center justify-center w-8 h-8">
            <motion.div 
              className={`absolute w-full h-full rounded-full ${isWhisperMode ? 'bg-indigo-500/20' : 'bg-brand-primary/20'}`}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className={`w-3 h-3 rounded-full ${isWhisperMode ? 'bg-indigo-400' : 'bg-brand-primary'}`} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
