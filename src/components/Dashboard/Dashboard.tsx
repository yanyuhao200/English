import React from 'react';
import { useStore } from '../../store/useStore';
import { Mic, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import BilingualLabel from '../ui/BilingualLabel';

export default function Dashboard() {
  const { messages, vocabulary } = useStore();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center w-full max-w-md mx-auto"
    >
      <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
        <Mic className="w-10 h-10 text-brand-primary" />
      </div>
      
      <BilingualLabel 
        en="Ready to flow?" 
        cn="准备好开聊了吗？" 
        align="center"
        enClassName="text-2xl font-semibold text-slate-800 mb-1"
        cnClassName="text-sm"
        className="mb-3"
      />
      
      <BilingualLabel 
        en="No scores, no pressure. Just natural conversation at your pace." 
        cn="没有分数，没有压力。按你的节奏自然交流。" 
        align="center"
        enClassName="text-slate-500 text-sm"
        cnClassName="text-xs"
        className="mb-8"
      />
      
      <div className="flex flex-col w-full gap-4">
        <button 
          onClick={() => navigate('/practice')}
          className="w-full bg-slate-800 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:bg-slate-700 transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-4"
        >
          <Mic className="w-5 h-5" />
          <BilingualLabel 
            en="Start Practice" 
            cn="开始练习" 
            enClassName="text-white"
            cnClassName="text-slate-400"
          />
        </button>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <button 
            onClick={() => navigate('/review')}
            disabled={messages.length === 0}
            className="bg-white text-slate-700 p-4 rounded-2xl font-medium shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center gap-3 border border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock className="w-6 h-6 text-brand-secondary" />
            <BilingualLabel 
              en="Time-Travel" 
              cn="练习历程" 
              align="center"
              enClassName="text-sm"
              cnClassName="text-[10px]"
            />
          </button>
          
          <button 
            onClick={() => navigate('/vocabulary')}
            className="bg-white text-slate-700 p-4 rounded-2xl font-medium shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center gap-3 border border-slate-100"
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
            <div className="flex flex-col items-center">
              <BilingualLabel 
                en="Vocab Tree" 
                cn="词汇之树" 
                align="center"
                enClassName="text-sm"
                cnClassName="text-[10px]"
              />
              <BilingualLabel en={`${vocabulary.length} words`} cn={`${vocabulary.length} 个词汇`} align="center" enClassName="text-[10px] text-slate-400 mt-1" cnClassName="text-[8px]" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
