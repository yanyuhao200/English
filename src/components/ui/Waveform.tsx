import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';

export default function Waveform() {
  const { isAiSpeaking, isConnected } = useStore();

  if (!isConnected) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 h-24 mb-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2.5 bg-brand-primary rounded-full"
          animate={{
            height: isAiSpeaking ? [16, 48 + Math.random() * 32, 16] : 16,
            opacity: isAiSpeaking ? 1 : 0.5
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
