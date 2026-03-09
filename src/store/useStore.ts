import { create } from 'zustand';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  translation?: string;
  isFinal: boolean;
}

interface AppState {
  isConnected: boolean;
  isAiSpeaking: boolean;
  isThinking: boolean;
  isListening: boolean;
  combo: number;
  aiSpeed: number; // 0.5 to 1.5
  messages: Message[];
  hintLevel: number; // 0: none, 1: keywords, 2: topic, 3: phrases
  setConnected: (val: boolean) => void;
  setAiSpeaking: (val: boolean) => void;
  setThinking: (val: boolean) => void;
  setListening: (val: boolean) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  setAiSpeed: (val: number) => void;
  addOrUpdateMessage: (id: string, sender: 'user' | 'ai', text: string, isFinal: boolean, translation?: string) => void;
  setHintLevel: (level: number) => void;
}

export const useStore = create<AppState>((set) => ({
  isConnected: false,
  isAiSpeaking: false,
  isThinking: false,
  isListening: false,
  combo: 0,
  aiSpeed: 1.0,
  messages: [],
  hintLevel: 0,
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
    return { messages: [...state.messages, { id, sender, text, isFinal, translation }] };
  }),
  setHintLevel: (level) => set({ hintLevel: level }),
}));
