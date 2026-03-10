import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface AudioVisualizerProps {
  isRecording: boolean;
}

export default function AudioVisualizer({ isRecording }: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>(new Array(12).fill(10));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 40 + 10));
      }, 100);
    } else {
      setBars(new Array(12).fill(10));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{ height }}
          className={`w-1 rounded-full ${isRecording ? 'bg-brand-primary' : 'bg-slate-200'}`}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}
