import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Volume2, Star, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useTranslator } from '../../hooks/useTranslator';
import { useStore } from '../../store/useStore';
import AudioVisualizer from './AudioVisualizer';
import { useNavigate } from 'react-router-dom';
import BilingualLabel from '../ui/BilingualLabel';

export default function Translator() {
  const [inputText, setInputText] = useState('');
  const { isRecording, isTranslating, result, translate, startRecording, stopRecording, setResult } = useTranslator();
  const { addFavorite, favorites, removeFavorite, addOrUpdateMessage } = useStore();
  const navigate = useNavigate();
  const [speakingVariant, setSpeakingVariant] = useState<string | null>(null);
  const [spokenWordIndex, setSpokenWordIndex] = useState(-1);

  const isFavorited = result ? favorites.some(f => f.original === result.original) : false;

  const handleTranslate = () => {
    if (inputText.trim()) {
      translate(inputText);
      setInputText('');
    }
  };

  const speak = (text: string, variant: string, rate = 1.0) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    setSpeakingVariant(variant);
    setSpokenWordIndex(0);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const textUpToChar = text.substring(0, event.charIndex);
        const wordIndex = textUpToChar.split(/\s+/).length - 1;
        setSpokenWordIndex(wordIndex);
      }
    };
    
    utterance.onend = () => {
      setSpeakingVariant(null);
      setSpokenWordIndex(-1);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleGoPractice = () => {
    if (!result) return;
    const msgId = Date.now().toString();
    addOrUpdateMessage(msgId, 'user', result.variants.casual, true);
    navigate('/practice');
  };

  return (
    <div className="flex-1 flex flex-col p-6 pb-32 max-w-md mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-amber-500" />
          <BilingualLabel en="Idiomatic" cn="地道说" enClassName="text-3xl" cnClassName="text-sm" />
        </h1>
        <p className="text-slate-500">From literal to natural.</p>
      </header>

      <div className="relative mb-8">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type Chinese here..."
          className="w-full bg-white border border-slate-200 rounded-3xl p-6 pr-16 shadow-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all min-h-[120px] text-lg resize-none"
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleTranslate())}
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-all ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mic className="w-6 h-6" />
          </button>
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            {isTranslating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
        {isRecording && (
          <div className="absolute -top-12 left-0 right-0">
            <AudioVisualizer isRecording={isRecording} />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Results</span>
              <div className="flex gap-2">
                <button
                  onClick={() => isFavorited ? removeFavorite(result.id) : addFavorite(result)}
                  className={`p-2 rounded-full transition-all ${isFavorited ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <Star className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleGoPractice}
                  className="flex items-center gap-1 text-sm font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full hover:bg-brand-primary/20 transition-all"
                >
                  Practice <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {[
              { label: 'Casual', value: result.variants.casual, color: 'bg-blue-50 text-blue-700 border-blue-100' },
              { label: 'Formal', value: result.variants.formal, color: 'bg-slate-50 text-slate-700 border-slate-100' },
              { label: 'Slang', value: result.variants.slang, color: 'bg-purple-50 text-purple-700 border-purple-100' },
            ].map((variant) => (
              <div
                key={variant.label}
                className={`p-5 rounded-3xl border ${variant.color} relative group overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{variant.label}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => speak(variant.value, variant.label, 0.8)}
                      className="p-1.5 hover:bg-black/5 rounded-full transition-all"
                      title="Slow"
                    >
                      <Volume2 className="w-4 h-4 opacity-40" />
                    </button>
                    <button
                      onClick={() => speak(variant.value, variant.label, 1.0)}
                      className="p-1.5 hover:bg-black/5 rounded-full transition-all"
                      title="Normal"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-xl font-medium leading-relaxed">
                  {variant.value.split(/\s+/).map((word, i) => (
                    <span
                      key={i}
                      className={`transition-colors duration-200 ${
                        speakingVariant === variant.label && spokenWordIndex === i
                          ? 'text-brand-primary bg-brand-primary/10 rounded px-0.5'
                          : ''
                      }`}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </p>
              </div>
            ))}

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
              <p className="text-xs text-amber-700 leading-relaxed italic">
                <span className="font-bold not-italic mr-1">Why:</span>
                {result.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
