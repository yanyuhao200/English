import React from 'react';
import { useStore } from '../../store/useStore';
import { Settings as SettingsIcon, Volume2, Zap, Trash2, Moon, Sun, Mic } from 'lucide-react';

export default function Settings() {
  const { 
    aiSpeed, setAiSpeed, 
    isWhisperMode, setWhisperMode, 
    isHandsFreeMode, setHandsFreeMode,
    clearHistory 
  } = useStore();

  return (
    <div className="flex-1 flex flex-col p-6 pb-32 max-w-md mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-slate-400" />
          Settings
        </h1>
        <p className="text-slate-500">Personalize your flow.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">AI Speaking Speed</span>
            </div>
            <span className="text-sm font-bold text-brand-primary">{aiSpeed.toFixed(1)}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.1" 
            value={aiSpeed}
            onChange={(e) => setAiSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-slate-700">Whisper Mode</span>
            </div>
            <button 
              onClick={() => setWhisperMode(!isWhisperMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isWhisperMode ? 'bg-brand-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isWhisperMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <p className="text-xs text-slate-400">Lower volume and softer pitch for private practice.</p>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-slate-700">Hands-Free Mode</span>
            </div>
            <button 
              onClick={() => setHandsFreeMode(!isHandsFreeMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isHandsFreeMode ? 'bg-brand-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHandsFreeMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <p className="text-xs text-slate-400">AI automatically listens after speaking. No tapping required.</p>
        </section>

        <button 
          onClick={() => {
            if (confirm("Clear all conversation history?")) clearHistory();
          }}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium hover:bg-red-50 transition-all rounded-2xl border border-transparent hover:border-red-100"
        >
          <Trash2 className="w-5 h-5" />
          Clear History
        </button>
      </div>
    </div>
  );
}
