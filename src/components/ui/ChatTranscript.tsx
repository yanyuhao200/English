import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Trash2, X } from 'lucide-react';
import BilingualLabel from './BilingualLabel';

const AiMessage = ({ msg, isLast, isSpeaking, currentWordIndex, isWhisperMode, onDelete }: { msg: any, isLast: boolean, isSpeaking: boolean, currentWordIndex: number, isWhisperMode: boolean, onDelete: () => void }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <div 
      className="flex flex-col items-start gap-1 w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2 w-full">
        <div className={`px-4 py-2 rounded-2xl max-w-[85%] transition-all hover:shadow-lg relative ${
          isWhisperMode 
            ? 'bg-slate-800 text-slate-300 border border-slate-700 shadow-sm rounded-bl-sm text-base' 
            : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm text-sm'
        }`}>
          {renderTextWithHighlightsAndKaraoke(msg.text)}
        </div>
        <button 
          onClick={onDelete}
          className={`p-1 rounded-full hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 ${isWhisperMode ? 'hover:bg-red-900/30' : ''}`}
          title="Delete message"
        >
          <X className="w-3.5 h-3.5" />
        </button>
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
            <BilingualLabel en={showTranslation ? 'Hide Translation' : 'Show Translation'} cn={showTranslation ? '隐藏翻译' : '查看翻译'} enClassName="text-[10px]" cnClassName="text-[8px]" />
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
  const { messages, isThinking, isAiSpeaking, currentSpokenWordIndex, isWhisperMode, deleteMessage, clearHistory } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, currentSpokenWordIndex]);

  return (
    <div className="w-full max-w-sm flex flex-col mb-6">
      <div className="flex justify-between items-center mb-2 px-2">
        <BilingualLabel en="Transcript" cn="对话记录" enClassName={`text-[10px] font-medium uppercase tracking-wider ${isWhisperMode ? 'text-slate-500' : 'text-slate-400'}`} cnClassName="text-[8px]" />
        {messages.length > 0 && (
          <button 
            onClick={() => {
              if (confirm('Clear all messages?')) {
                clearHistory();
              }
            }}
            className={`text-[10px] font-medium uppercase tracking-wider flex items-center gap-1 hover:text-red-500 transition-colors ${isWhisperMode ? 'text-slate-500' : 'text-slate-400'}`}
          >
            <Trash2 className="w-3 h-3" />
            <BilingualLabel en="Clear All" cn="清空全部" enClassName="text-[10px]" cnClassName="text-[8px]" />
          </button>
        )}
      </div>
      
      <div 
        ref={scrollRef}
        className="h-48 overflow-y-auto flex flex-col gap-3 px-2 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={msg.id} 
              className={`flex flex-col group ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.sender === 'user' ? (
                <div className="flex items-start gap-2 max-w-full">
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className={`p-1 rounded-full hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 mt-1 ${isWhisperMode ? 'hover:bg-red-900/30' : ''}`}
                    title="Delete message"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className={`px-4 py-2 rounded-2xl max-w-[85%] transition-all hover:shadow-lg rounded-br-sm ${
                    isWhisperMode ? 'bg-indigo-900 text-indigo-100 text-base' : 'bg-slate-800 text-white text-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ) : (
                <AiMessage 
                  msg={msg} 
                  isLast={index === messages.length - 1}
                  isSpeaking={isAiSpeaking}
                  currentWordIndex={currentSpokenWordIndex}
                  isWhisperMode={isWhisperMode}
                  onDelete={() => deleteMessage(msg.id)}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
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
    </div>
  );
}
