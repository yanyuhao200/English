import React from 'react';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';
import { Star, Library as LibraryIcon, Trash2 } from 'lucide-react';

export default function Library() {
  const { favorites, removeFavorite } = useStore();

  return (
    <div className="flex-1 flex flex-col p-6 pb-32 max-w-md mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <LibraryIcon className="w-8 h-8 text-brand-secondary" />
          Library
        </h1>
        <p className="text-slate-500">Your collection of idiomatic gems.</p>
      </header>

      {favorites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
          <Star className="w-12 h-12 opacity-20" />
          <p>No favorites yet. Start translating!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <motion.div
              key={fav.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group"
            >
              <button
                onClick={() => removeFavorite(fav.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{fav.original}</p>
              <div className="space-y-2">
                <p className="text-lg font-medium text-slate-800">{fav.variants.casual}</p>
                <p className="text-sm text-slate-500 italic">{fav.explanation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
