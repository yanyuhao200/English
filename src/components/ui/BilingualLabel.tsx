import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';

interface BilingualLabelProps {
  en: string;
  cn: string;
  className?: string;
  enClassName?: string;
  cnClassName?: string;
  align?: 'left' | 'center' | 'right';
}

export default function BilingualLabel({ 
  en, 
  cn, 
  className = '', 
  enClassName = '', 
  cnClassName = '',
  align = 'left'
}: BilingualLabelProps) {
  const { showTranslation } = useStore();
  const [isPeeking, setIsPeeking] = React.useState(false);

  const alignmentClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  }[align];

  const handlePointerDown = () => {
    if (!showTranslation) setIsPeeking(true);
  };

  const handlePointerUp = () => {
    setIsPeeking(false);
  };

  return (
    <div 
      className={`flex flex-col space-y-0.5 cursor-default select-none ${alignmentClass} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <span className={`font-semibold leading-tight ${enClassName}`}>
        {en}
      </span>
      <div className="relative h-4 overflow-hidden w-full flex items-center justify-inherit">
        <AnimatePresence mode="wait">
          {(showTranslation || isPeeking) && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.1 }}
              className={`text-[10px] text-slate-400 font-normal leading-none block whitespace-nowrap ${cnClassName}`}
            >
              {cn}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
