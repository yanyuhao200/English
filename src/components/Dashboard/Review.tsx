import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { ChevronLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function Review() {
  const { messages, setCurrentView } = useStore();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  const playMessage = (msg: any) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      if (playingId === msg.id) {
        setPlayingId(null);
        return;
      }
      
      setPlayingId(msg.id);
      const cleanText = msg.text.replace(/\*\*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.onend = () => setPlayingId(null);
      synthRef.current.speak(utterance);
    }
  };

  const handleHighlightClick = (word: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(`Let's try this again: ${word}`);
      utterance.lang = 'en-US';
      synthRef.current.speak(utterance);
    }
  };

  const renderTextWithHighlights = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const word = part.slice(2, -2);
        return (
          <span 
            key={i} 
            className="text-emerald-500 font-semibold bg-emerald-50 px-1 rounded mx-0.5 cursor-pointer hover:bg-emerald-100 transition-colors" 
            onClick={() => handleHighlightClick(word)}
          >
            {word}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col p-6 w-full max-w-md mx-auto h-full"
    >
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setCurrentView('home')}
          className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all border border-slate-100 text-slate-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-slate-800">Time-Travel Review</h2>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`group relative px-4 py-3 rounded-2xl max-w-[85%] text-sm shadow-sm transition-all hover:shadow-lg ${
              msg.sender === 'user' 
                ? 'bg-slate-800 text-white rounded-br-sm' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'
            }`}>
              {msg.sender === 'ai' ? renderTextWithHighlights(msg.text) : msg.text}
              
              <button 
                onClick={() => playMessage(msg)}
                className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity ${
                  msg.sender === 'user' ? '-left-10' : '-right-10'
                }`}
              >
                {playingId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
            {msg.translation && (
              <div className="text-xs text-slate-400 mt-1 max-w-[85%] px-2">
                {msg.translation}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
