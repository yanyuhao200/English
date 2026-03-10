/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Layout from "./components/layout/Layout";
import { useStore } from './store/useStore';
import Dashboard from './components/Dashboard/Dashboard';
import Conversation from './components/Conversation/Conversation';
import Review from './components/Dashboard/Review';
import Vocabulary from './components/Dashboard/Vocabulary';
import Translator from './components/Translator/Translator';
import Library from './components/Library/Library';
import Settings from './components/Settings/Settings';
import Navigation from './components/Navigation/Navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Languages } from 'lucide-react';
import BilingualLabel from './components/ui/BilingualLabel';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    className="w-full h-full flex flex-col"
  >
    {children}
  </motion.div>
);

export default function App() {
  const { combo, showTranslation, setShowTranslation } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDragEnd = (event: any, info: any) => {
    // Increase threshold to 150px and check velocity to avoid accidental triggers
    if (info.offset.x > 150 && info.velocity.x > 500 && location.pathname !== '/') {
      navigate(-1);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <header className="p-6 flex items-center relative z-10">
        <div className="flex-1">
          <BilingualLabel en="EnglishFlow" cn="AI 英语流" enClassName="text-xl font-semibold text-slate-800 tracking-tight" cnClassName="text-[10px]" align="left" />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              showTranslation 
                ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <Languages className="w-4 h-4" />
            <BilingualLabel 
              en={showTranslation ? 'Bilingual' : 'English'} 
              cn={showTranslation ? '双语对照' : '仅英语'} 
              enClassName="text-[10px] font-bold uppercase tracking-wider" 
              cnClassName="text-[8px]" 
              align="center"
            />
          </button>
          {combo > 0 && (
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 shadow-sm">
              <BilingualLabel en="Flow Combo" cn="连击" enClassName="text-sm font-medium text-slate-600" cnClassName="text-[10px]" align="center" />
              <span className="text-brand-primary font-bold">{combo}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col items-center relative h-full overflow-x-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/practice" element={<PageWrapper><Conversation /></PageWrapper>} />
            <Route path="/translate" element={<PageWrapper><Translator /></PageWrapper>} />
            <Route path="/library" element={<PageWrapper><Library /></PageWrapper>} />
            <Route path="/vocabulary" element={<PageWrapper><Vocabulary /></PageWrapper>} />
            <Route path="/review" element={<PageWrapper><Review /></PageWrapper>} />
            <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </motion.div>

      <Navigation />
    </Layout>
  );
}
