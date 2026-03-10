import React from 'react';
import { useStore } from '../../store/useStore';
import { Mic, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { messages, vocabulary } = useStore();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center w-full max-w-md mx-auto"
    >
      <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
        <Mic className="w-10 h-10 text-brand-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-3">Ready to flow?</h2>
      <p className="text-slate-500 mb-8">
        No scores, no pressure. Just natural conversation at your pace.
      </p>
      
      <div className="flex flex-col w-full gap-4">
        <button 
          onClick={() => navigate('/practice')}
          className="w-full bg-slate-800 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:bg-slate-700 transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
        >
          <Mic className="w-5 h-5" />
          Start Practice
        </button>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <button 
            onClick={() => navigate('/review')}
            disabled={messages.length === 0}
            className="bg-white text-slate-700 p-4 rounded-2xl font-medium shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center gap-2 border border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock className="w-6 h-6 text-brand-secondary" />
            <span>Time-Travel Review</span>
          </button>
          
          <button 
            onClick={() => navigate('/vocabulary')}
            className="bg-white text-slate-700 p-4 rounded-2xl font-medium shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center gap-2 border border-slate-100"
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>Vocabulary Tree</span>
            <span className="text-xs text-slate-400">{vocabulary.length} words</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
