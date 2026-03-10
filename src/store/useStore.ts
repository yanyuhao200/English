import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewState = 'home' | 'conversation' | 'review' | 'vocabulary' | 'translate' | 'settings';

export interface FavoriteTranslation {
  id: string;
  original: string;
  variants: {
    casual: string;
    formal: string;
    slang: string;
  };
  explanation: string;
  timestamp: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  translation?: string;
  isFinal: boolean;
  timestamp: number;
}

export interface VocabWord {
  word: string;
  count: number;
  x: number;
  y: number;
}

interface AppState {
  currentView: ViewState;
  isConnected: boolean;
  isAiSpeaking: boolean;
  isThinking: boolean;
  isListening: boolean;
  combo: number;
  aiSpeed: number; // 0.5 to 1.5
  messages: Message[];
  hintLevel: number; // 0: none, 1: keywords, 2: topic, 3: phrases
  isWhisperMode: boolean;
  isHandsFreeMode: boolean;
  showTranslation: boolean;
  vocabulary: VocabWord[];
  favorites: FavoriteTranslation[];
  currentSpokenWordIndex: number;
  
  setCurrentView: (view: ViewState) => void;
  setConnected: (val: boolean) => void;
  setAiSpeaking: (val: boolean) => void;
  setThinking: (val: boolean) => void;
  setListening: (val: boolean) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  setAiSpeed: (val: number) => void;
  addOrUpdateMessage: (id: string, sender: 'user' | 'ai', text: string, isFinal: boolean, translation?: string) => void;
  setHintLevel: (level: number) => void;
  setWhisperMode: (val: boolean) => void;
  setHandsFreeMode: (val: boolean) => void;
  setShowTranslation: (val: boolean) => void;
  addVocabulary: (words: string[]) => void;
  addFavorite: (translation: FavoriteTranslation) => void;
  removeFavorite: (id: string) => void;
  setCurrentSpokenWordIndex: (index: number) => void;
  clearHistory: () => void;
  deleteMessage: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'home',
      isConnected: false,
      isAiSpeaking: false,
      isThinking: false,
      isListening: false,
      combo: 0,
      aiSpeed: 1.0,
      messages: [],
      hintLevel: 0,
      isWhisperMode: false,
      isHandsFreeMode: false,
      showTranslation: true,
      vocabulary: [],
      favorites: [],
      currentSpokenWordIndex: -1,

      setCurrentView: (view) => set({ currentView: view }),
      setConnected: (val) => set({ isConnected: val }),
      setAiSpeaking: (val) => set({ isAiSpeaking: val }),
      setThinking: (val) => set({ isThinking: val }),
      setListening: (val) => set({ isListening: val }),
      incrementCombo: () => set((state) => ({ combo: state.combo + 1 })),
      resetCombo: () => set({ combo: 0 }),
      setAiSpeed: (val) => set({ aiSpeed: val }),
      addOrUpdateMessage: (id, sender, text, isFinal, translation) => set((state) => {
        const existing = state.messages.find(m => m.id === id);
        if (existing) {
          return {
            messages: state.messages.map(m => m.id === id ? { ...m, text, isFinal, translation: translation || m.translation } : m)
          };
        }
        return { messages: [...state.messages, { id, sender, text, isFinal, translation, timestamp: Date.now() }] };
      }),
      setHintLevel: (level) => set({ hintLevel: level }),
      setWhisperMode: (val) => set({ isWhisperMode: val }),
      setHandsFreeMode: (val) => set({ isHandsFreeMode: val }),
      setShowTranslation: (val) => set({ showTranslation: val }),
      addVocabulary: (words) => set((state) => {
        const newVocab = [...state.vocabulary];
        words.forEach(w => {
          const word = w.toLowerCase().replace(/[^a-z]/g, '');
          if (!word) return;
          const existing = newVocab.find(v => v.word === word);
          if (existing) {
            existing.count += 1;
          } else {
            newVocab.push({
              word,
              count: 1,
              x: Math.random() * 100,
              y: Math.random() * 100
            });
          }
        });
        return { vocabulary: newVocab };
      }),
      addFavorite: (translation) => set((state) => ({
        favorites: [translation, ...state.favorites]
      })),
      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter(f => f.id !== id)
      })),
      setCurrentSpokenWordIndex: (index) => set({ currentSpokenWordIndex: index }),
      clearHistory: () => set({ messages: [], combo: 0 }),
      deleteMessage: (id) => set((state) => ({
        messages: state.messages.filter(m => m.id !== id)
      })),
    }),
    {
      name: 'englishflow-storage',
      partialize: (state) => ({ 
        messages: state.messages, 
        combo: state.combo, 
        vocabulary: state.vocabulary,
        favorites: state.favorites,
        showTranslation: state.showTranslation,
        currentView: state.currentView || 'home'
      }),
    }
  )
);
