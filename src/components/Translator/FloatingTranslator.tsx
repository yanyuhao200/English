import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, X, ChevronUp } from 'lucide-react';
import Translator from './Translator';

export default function FloatingTranslator() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-xl border border-white/50 text-brand-primary hover:scale-110 transition-all active:scale-95"
      >
        <Languages className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-slate-50 rounded-t-[3rem] shadow-2xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 left-0 right-0 p-4 flex justify-center bg-slate-50/80 backdrop-blur-md z-10">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-6 top-4 p-2 bg-slate-200/50 rounded-full text-slate-500 hover:bg-slate-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Translator />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
