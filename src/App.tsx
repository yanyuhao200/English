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
import { Routes, Route, useLocation } from 'react-router-dom';

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
  const { combo } = useStore();
  const location = useLocation();

  return (
    <Layout>
      {/* Header */}
      <header className="p-6 flex justify-between items-center relative z-10">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
          EnglishFlow
        </h1>
        {combo > 0 && (
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 shadow-sm">
            <span className="text-sm font-medium text-slate-600">Flow Combo</span>
            <span className="text-brand-primary font-bold">{combo}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center relative h-full overflow-x-hidden">
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
      </div>

      <Navigation />
    </Layout>
  );
}
