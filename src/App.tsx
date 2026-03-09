/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Layout from "./components/layout/Layout";
import { useStore } from './store/useStore';
import { useEnglishFlow } from './hooks/useEnglishFlow';
import Waveform from './components/ui/Waveform';
import FlowSlider from './components/ui/FlowSlider';
import HintCards from './components/ui/HintCards';
import ChatTranscript from './components/ui/ChatTranscript';
import { Mic, Square } from 'lucide-react';

export default function App() {
  const { isConnected, combo } = useStore();
  const { connect, disconnect } = useEnglishFlow();

  return (
    <Layout>
      {/* Header */}
      <header className="p-6 flex justify-between items-center relative z-10">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
          EnglishFlow
        </h1>
        {isConnected && (
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 shadow-sm">
            <span className="text-sm font-medium text-slate-600">Flow Combo</span>
            <span className="text-brand-primary font-bold">{combo}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-8">
        {!isConnected ? (
          <div className="text-center max-w-xs">
            <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
              <Mic className="w-10 h-10 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">Ready to flow?</h2>
            <p className="text-slate-500 mb-8">
              No scores, no pressure. Just natural conversation at your pace.
            </p>
            <button 
              onClick={connect}
              className="w-full bg-slate-800 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:bg-slate-700 transition-colors active:scale-95 flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Start Practice
            </button>
          </div>
        ) : (
          <>
            <ChatTranscript />
            <Waveform />
            <FlowSlider />
            <HintCards />
            
            {/* Stop Button */}
            <button 
              onClick={disconnect}
              className="absolute bottom-8 bg-white text-slate-800 px-6 py-3 rounded-full font-medium shadow-md hover:bg-slate-50 transition-colors active:scale-95 flex items-center gap-2 border border-slate-200"
            >
              <Square className="w-4 h-4" />
              End Session
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}
