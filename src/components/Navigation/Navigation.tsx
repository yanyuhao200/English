import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, Languages, Library, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import BilingualLabel from '../ui/BilingualLabel';

const tabs = [
  { id: 'practice', path: '/practice', icon: Mic, label: 'Practice', cn: '练口语' },
  { id: 'translate', path: '/translate', icon: Languages, label: 'Translate', cn: '地道说' },
  { id: 'library', path: '/library', icon: Library, label: 'Library', cn: '收藏夹' },
  { id: 'settings', path: '/settings', icon: Settings, label: 'Settings', cn: '设置' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl flex items-center justify-around p-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path === '/practice' && location.pathname === '/');
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all flex-1 ${
                isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-slate-100 rounded-2xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : 'scale-100'}`} />
              <BilingualLabel 
                en={tab.label} 
                cn={tab.cn} 
                align="center"
                enClassName="text-[10px] uppercase tracking-wider"
                cnClassName="text-[8px]"
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
