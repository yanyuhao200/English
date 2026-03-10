import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { Lightbulb, MessageCircle, HelpCircle } from 'lucide-react';

export default function HintCards() {
  const { hintLevel, setHintLevel } = useStore();

  return (
    <div className="absolute bottom-24 left-0 w-full px-8 flex flex-col gap-3">
      <AnimatePresence>
        {hintLevel >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-white/60 flex items-start gap-3"
          >
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">Keywords to try:</p>
              <p className="text-sm text-slate-500">experience, challenge, overcome</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {hintLevel >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-white/60 flex items-start gap-3"
          >
            <MessageCircle className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">思路引导：</p>
              <p className="text-sm text-slate-500">你可以试着描述一下你最近遇到的一件小事，或者你的感受。</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {hintLevel > 0 && hintLevel < 3 && (
        <button 
          onClick={() => setHintLevel(3)}
          className="self-center mt-2 flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Need a phrase?
        </button>
      )}

      <AnimatePresence>
        {hintLevel === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-brand-primary text-white p-4 rounded-2xl shadow-lg flex flex-col gap-2"
          >
            <p className="text-sm font-medium opacity-90 mb-1">Try saying:</p>
            <button className="text-left text-sm bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">"I've been working on..."</button>
            <button className="text-left text-sm bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">"To be honest, I think..."</button>
            <button className="text-left text-sm bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">"That's an interesting question..."</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
