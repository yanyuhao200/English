/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Layout from "./components/layout/Layout";
import { useStore } from './store/useStore';
import Dashboard from './components/Dashboard/Dashboard';
import Conversation from './components/Conversation/Conversation';
import Review from './components/Dashboard/Review';
import Vocabulary from './components/Dashboard/Vocabulary';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const { currentView, combo } = useStore();

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
      <div className="flex-1 flex flex-col items-center justify-center relative p-8 h-full">
        <AnimatePresence mode="wait">
          {(!currentView || currentView === 'home') && <Dashboard key="home" />}
          {currentView === 'conversation' && <Conversation key="conversation" />}
          {currentView === 'review' && <Review key="review" />}
          {currentView === 'vocabulary' && <Vocabulary key="vocabulary" />}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
