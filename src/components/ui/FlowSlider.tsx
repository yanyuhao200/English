import React from 'react';
import { useStore } from '../../store/useStore';

export default function FlowSlider() {
  const { aiSpeed, setAiSpeed } = useStore();

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 bg-white/50 backdrop-blur-md p-3 rounded-full shadow-sm border border-white/60">
      <span className="text-xs font-medium text-slate-500">Fast</span>
      <input
        type="range"
        min="0.7"
        max="1.3"
        step="0.1"
        value={aiSpeed}
        onChange={(e) => setAiSpeed(parseFloat(e.target.value))}
        className="w-1 h-32 appearance-none bg-slate-200 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
        style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any}
      />
      <span className="text-xs font-medium text-slate-500">Clear</span>
    </div>
  );
}
