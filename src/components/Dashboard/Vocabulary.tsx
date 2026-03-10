import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Vocabulary() {
  const { vocabulary, setCurrentView } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      vocabulary.forEach((v) => {
        const x = (v.x / 100) * canvas.width;
        const y = (v.y / 100) * canvas.height;
        const size = Math.min(20, 4 + v.count * 2);
        const opacity = Math.min(1, 0.4 + v.count * 0.1);

        // Draw star glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `rgba(245, 158, 11, ${opacity})`);
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw star core
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Draw text
        ctx.font = `${Math.max(10, size)}px Inter`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.textAlign = 'center';
        ctx.fillText(v.word, x, y + size * 2 + 10);
      });
    };

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 600;
      draw();
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [vocabulary]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col p-6 w-full max-w-md mx-auto h-full bg-slate-900 text-white rounded-3xl overflow-hidden relative"
    >
      <header className="flex items-center gap-4 mb-6 z-10">
        <button 
          onClick={() => setCurrentView('home')}
          className="bg-white/10 p-2 rounded-full shadow-sm hover:bg-white/20 transition-all border border-white/10 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">Vocabulary Galaxy</h2>
      </header>

      <div className="flex-1 relative w-full h-full">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
        {vocabulary.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
            Your galaxy is empty. Start talking to collect stars!
          </div>
        )}
      </div>
    </motion.div>
  );
}
