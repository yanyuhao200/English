import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useEnglishFlow } from '../../hooks/useEnglishFlow';
import Waveform from '../ui/Waveform';
import FlowSlider from '../ui/FlowSlider';
import HintCards from '../ui/HintCards';
import ChatTranscript from '../ui/ChatTranscript';
import FloatingTranslator from '../Translator/FloatingTranslator';
import { Mic, MicOff, Square, ChevronLeft, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import BilingualLabel from '../ui/BilingualLabel';

export default function Conversation() {
  const { isConnected, isListening, messages, isWhisperMode, setWhisperMode } = useStore();
  const { connect, disconnect, toggleListening } = useEnglishFlow();
  const navigate = useNavigate();

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex-1 flex flex-col items-center justify-center relative p-8 w-full max-w-md mx-auto h-full transition-colors duration-500 ${isWhisperMode ? 'bg-slate-900 rounded-3xl' : ''}`}
    >
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button 
          type="button"
          onClick={() => {
            disconnect();
            navigate('/');
          }}
          className={`p-2 rounded-full shadow-sm hover:shadow-md transition-all border ${isWhisperMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white/60 backdrop-blur-md border-white/50 text-slate-600'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          type="button"
          onClick={() => setWhisperMode(!isWhisperMode)}
          className={`p-2 rounded-full shadow-sm hover:shadow-md transition-all border ${isWhisperMode ? 'bg-indigo-900 border-indigo-700 text-indigo-300 shadow-indigo-900/50' : 'bg-white/60 backdrop-blur-md border-white/50 text-slate-400'}`}
          title="Whisper Mode"
        >
          <Moon className="w-6 h-6" />
        </button>
      </div>

      <ChatTranscript />
      <Waveform />
      <FlowSlider />
      <HintCards />
      
      {/* Tap to Start Overlay for Mobile */}
      <AnimatePresence>
        {!isListening && !useStore.getState().isAiSpeaking && !useStore.getState().isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
            onClick={toggleListening}
          >
            <div className="bg-white p-8 rounded-full shadow-2xl mb-6 animate-bounce">
              <Mic className="w-12 h-12 text-brand-primary" />
            </div>
            <BilingualLabel 
              en="Tap to start flowing" 
              cn="点击开始交流" 
              align="center"
              enClassName="text-xl font-bold text-slate-800"
              cnClassName="text-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Controls */}
      <div className="absolute bottom-8 flex items-center gap-4 z-20">
        <button 
          type="button"
          onClick={toggleListening}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
            isListening 
              ? 'bg-brand-primary text-white animate-pulse shadow-brand-primary/30' 
              : isWhisperMode ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-white text-slate-400 border border-slate-200'
          }`}
        >
          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        <button 
          type="button"
          onClick={() => {
            disconnect();
            navigate('/');
          }}
          className={`px-6 py-4 rounded-full font-medium shadow-md transition-all hover:shadow-lg active:scale-95 flex items-center gap-2 border ${isWhisperMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200'}`}
        >
          <Square className="w-4 h-4" />
          <BilingualLabel en="End Session" cn="结束练习" enClassName="font-medium" cnClassName="text-[10px]" />
        </button>
      </div>

      <FloatingTranslator />
    </motion.div>
  );
}
