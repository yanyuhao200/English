import React from 'react';
import { useStore } from '../../store/useStore';
import { Settings as SettingsIcon, Volume2, Zap, Trash2, Moon, Sun, Mic, Languages } from 'lucide-react';
import BilingualLabel from '../ui/BilingualLabel';

export default function Settings() {
  const { 
    aiSpeed, setAiSpeed, 
    isWhisperMode, setWhisperMode, 
    isHandsFreeMode, setHandsFreeMode,
    showTranslation, setShowTranslation,
    clearHistory 
  } = useStore();

  return (
    <div className="flex-1 flex flex-col p-6 pb-32 max-w-md mx-auto w-full">
      <header className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2 mb-1">
          <SettingsIcon className="w-8 h-8 text-slate-400" />
          <BilingualLabel en="Settings" cn="设置" enClassName="text-3xl" cnClassName="text-sm" align="center" />
        </h1>
        <BilingualLabel en="Personalize your flow." cn="个性化你的交流。" enClassName="text-slate-500" cnClassName="text-xs" align="center" />
      </header>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-brand-primary" />
              <BilingualLabel en="Bilingual Mirror" cn="双语对照系统" enClassName="text-sm" cnClassName="text-[10px]" />
            </div>
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className={`w-12 h-6 rounded-full transition-all relative ${showTranslation ? 'bg-brand-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showTranslation ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <BilingualLabel en="Show Chinese translations for all UI elements." cn="为所有界面元素显示中文翻译。" enClassName="text-xs text-slate-400" cnClassName="text-[10px]" />
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-slate-400" />
              <BilingualLabel en="AI Speed" cn="语速调节" enClassName="text-sm" cnClassName="text-[10px]" />
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
              <BilingualLabel en="Whisper Mode" cn="耳语模式" enClassName="text-sm" cnClassName="text-[10px]" />
            </div>
            <button 
              onClick={() => setWhisperMode(!isWhisperMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isWhisperMode ? 'bg-brand-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isWhisperMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <BilingualLabel en="Lower volume and softer pitch for private practice." cn="降低音量和音调，适合私密练习。" enClassName="text-xs text-slate-400" cnClassName="text-[10px]" />
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-blue-500" />
              <BilingualLabel en="Hands-Free" cn="免提模式" enClassName="text-sm" cnClassName="text-[10px]" />
            </div>
            <button 
              onClick={() => setHandsFreeMode(!isHandsFreeMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${isHandsFreeMode ? 'bg-brand-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHandsFreeMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <BilingualLabel en="AI automatically listens after speaking. No tapping required." cn="AI说完后自动开启收音，无需点击。" enClassName="text-xs text-slate-400" cnClassName="text-[10px]" />
        </section>

        <button 
          onClick={() => {
            if (confirm("Clear all conversation history?")) clearHistory();
          }}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium hover:bg-red-50 transition-all rounded-2xl border border-transparent hover:border-red-100"
        >
          <Trash2 className="w-5 h-5" />
          <BilingualLabel en="Clear History" cn="清除历程" enClassName="text-red-500" cnClassName="text-red-300" />
        </button>
      </div>
    </div>
  );
}
