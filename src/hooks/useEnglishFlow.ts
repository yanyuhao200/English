import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';

export function useEnglishFlow() {
  const { setConnected, setAiSpeaking, setThinking, aiSpeed, setHintLevel, incrementCombo, addOrUpdateMessage } = useStore();
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef(false);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setHintLevel(0);
    
    silenceTimerRef.current = setTimeout(() => {
      setHintLevel(1);
      silenceTimerRef.current = setTimeout(() => {
        setHintLevel(2);
      }, 5000);
    }, 5000);
  }, [setHintLevel]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    
    // Remove markdown asterisks for speech
    const cleanText = text.replace(/\*\*/g, '');
    
    setAiSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = aiSpeed;

    utterance.onend = () => {
      setAiSpeaking(false);
      try {
        if (recognitionRef.current && isListeningRef.current) {
          recognitionRef.current.start();
        }
      } catch (e) {}
      resetSilenceTimer();
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setAiSpeaking(false);
      try {
        if (recognitionRef.current && isListeningRef.current) {
          recognitionRef.current.start();
        }
      } catch (err) {}
    }

    synthRef.current.speak(utterance);
  }, [aiSpeed, setAiSpeaking, resetSilenceTimer]);

  const handleUserAudioText = useCallback(async (text: string) => {
    const userMsgId = Date.now().toString();
    addOrUpdateMessage(userMsgId, 'user', text, true);

    try { recognitionRef.current?.stop(); } catch (e) {}
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setThinking(true);

    try {
      const history = useStore.getState().messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are EnglishFlow, a stress-free AI English speaking assistant.
              Rules:
              1. i+1 Input: Keep your vocabulary just slightly above the user's level.
              2. No Scoring: Never grade or score the user.
              3. The Bridge: If the user speaks Chinese, translate it to natural English and gently guide them to repeat it.
              4. Implicit Recast: If the user makes a grammar mistake, reply naturally using the correct grammar. Wrap the corrected words in double asterisks like **this** so the UI can highlight them. Do not point out the mistake explicitly.
              5. Be concise, friendly, and conversational (1-3 sentences max).
              6. If the user hesitates, say "Take your time" or "Hmm...".`
            },
            ...history.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: text }
          ]
        })
      });

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "Sorry, I didn't catch that.";

      const aiMsgId = (Date.now() + 1).toString();
      addOrUpdateMessage(aiMsgId, 'ai', aiText, true);
      
      setThinking(false);
      speak(aiText);

    } catch (error) {
      console.error("DeepSeek API Error:", error);
      setThinking(false);
      speak("Sorry, I'm having trouble connecting to my brain.");
    }
  }, [addOrUpdateMessage, speak, setThinking]);

  const connect = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    synthRef.current = window.speechSynthesis;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        handleUserAudioText(transcript);
      }
    };

    recognitionRef.current.onend = () => {
      if (isListeningRef.current && !useStore.getState().isAiSpeaking && !useStore.getState().isThinking) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.error("Speech recognition error", event.error);
      }
    };

    setConnected(true);
    isListeningRef.current = true;
    resetSilenceTimer();

    comboTimerRef.current = setInterval(() => {
      if (!useStore.getState().isThinking) {
        incrementCombo();
      }
    }, 5000);

    try { recognitionRef.current.start(); } catch (e) {}
    
    const greeting = "Hello! I'm EnglishFlow. What would you like to talk about today?";
    const aiMsgId = Date.now().toString();
    addOrUpdateMessage(aiMsgId, 'ai', greeting, true);
    speak(greeting);

  }, [setConnected, resetSilenceTimer, incrementCombo, handleUserAudioText, speak, addOrUpdateMessage]);

  const disconnect = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setConnected(false);
    setAiSpeaking(false);
    setThinking(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (comboTimerRef.current) clearInterval(comboTimerRef.current);
  }, [setConnected, setAiSpeaking, setThinking]);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect };
}
