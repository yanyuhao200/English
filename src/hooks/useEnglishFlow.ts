import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';

export function useEnglishFlow() {
  const { setConnected, setAiSpeaking, setThinking, setListening, setHintLevel, incrementCombo, addOrUpdateMessage } = useStore();
  const recognitionRef = useRef<any>(null);
  const isRecognitionActiveRef = useRef(false);
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
    useStore.getState().setCurrentSpokenWordIndex(0);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = useStore.getState().aiSpeed;
    utterance.volume = useStore.getState().isWhisperMode ? 0.3 : 1.0;
    utterance.pitch = useStore.getState().isWhisperMode ? 0.8 : 1.0;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const textUpToChar = cleanText.substring(0, event.charIndex);
        const wordIndex = textUpToChar.split(/\s+/).length - 1;
        useStore.getState().setCurrentSpokenWordIndex(wordIndex);
      }
    };

    utterance.onend = () => {
      setAiSpeaking(false);
      useStore.getState().setCurrentSpokenWordIndex(-1);
      try {
        if (recognitionRef.current && isListeningRef.current && !isRecognitionActiveRef.current) {
          recognitionRef.current.start();
          isRecognitionActiveRef.current = true;
          setListening(true);
        }
      } catch (e) {}
      resetSilenceTimer();
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setAiSpeaking(false);
      try {
        if (recognitionRef.current && isListeningRef.current && !isRecognitionActiveRef.current) {
          recognitionRef.current.start();
          isRecognitionActiveRef.current = true;
          setListening(true);
        }
      } catch (err) {}
    }

    synthRef.current.speak(utterance);
  }, [setAiSpeaking, setListening, resetSilenceTimer]);

  const handleUserAudioText = useCallback(async (text: string) => {
    const userMsgId = Date.now().toString();
    addOrUpdateMessage(userMsgId, 'user', text, true);

    if (recognitionRef.current && isRecognitionActiveRef.current) {
      try { 
        recognitionRef.current.stop(); 
        isRecognitionActiveRef.current = false;
      } catch (e) {}
    }
    setListening(false);
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
              6. You MUST return your response in JSON format with three fields: "english" (your English response), "chinese" (the Chinese translation of your response), and "vocabulary" (an array of 1-3 useful English words or phrases used in your response).`
            },
            ...history.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: text }
          ]
        })
      });

      const data = await response.json();
      let aiText = "Sorry, I didn't catch that.";
      let aiTranslation = "";
      let aiVocab: string[] = [];

      try {
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          aiText = parsed.english || content;
          aiTranslation = parsed.chinese || "";
          aiVocab = parsed.vocabulary || [];
        }
      } catch (e) {
        aiText = data.choices?.[0]?.message?.content || aiText;
      }

      const aiMsgId = (Date.now() + 1).toString();
      addOrUpdateMessage(aiMsgId, 'ai', aiText, true, aiTranslation);
      if (aiVocab.length > 0) {
        useStore.getState().addVocabulary(aiVocab);
      }
      
      setThinking(false);
      speak(aiText);

    } catch (error) {
      console.error("DeepSeek API Error:", error);
      setThinking(false);
      speak("Sorry, I'm having trouble connecting to my brain.");
    }
  }, [addOrUpdateMessage, speak, setThinking, setListening]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (useStore.getState().isListening) {
      isListeningRef.current = false;
      setListening(false);
      if (isRecognitionActiveRef.current) {
        try { 
          recognitionRef.current.stop(); 
          isRecognitionActiveRef.current = false;
        } catch (e) {}
      }
    } else {
      isListeningRef.current = true;
      setListening(true);
      if (!isRecognitionActiveRef.current) {
        try { 
          recognitionRef.current.start(); 
          isRecognitionActiveRef.current = true;
        } catch (e) {}
      }
    }
  }, [setListening]);

  const connect = useCallback(() => {
    if (useStore.getState().isConnected) return;
    
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setTimeout(() => {
          alert("Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari 14.5+ with Siri enabled.");
        }, 100);
        return;
      }

      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
        // Warmup TTS for mobile browsers (requires user interaction to initialize)
        // Note: This might still be blocked on some mobile browsers if not in a direct click handler
        try {
          const warmup = new SpeechSynthesisUtterance('');
          synthRef.current.speak(warmup);
        } catch (e) {
          console.warn("TTS warmup failed", e);
        }
      }

      recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      isRecognitionActiveRef.current = true;
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const lowerTranscript = transcript.toLowerCase();
      
      if (lowerTranscript.includes('stop for now') || lowerTranscript.includes('end session')) {
        speak("Okay, ending the session. See you next time!");
        setTimeout(() => {
          disconnect();
          useStore.getState().setCurrentView('home');
        }, 3000);
        return;
      }

      if (transcript.trim()) {
        handleUserAudioText(transcript);
      }
    };

    recognitionRef.current.onend = () => {
      isRecognitionActiveRef.current = false;
      
      // Only restart if we are supposed to be listening and AI is not talking
      const state = useStore.getState();
      if (isListeningRef.current && !state.isAiSpeaking && !state.isThinking) {
        // Add a slightly longer delay on mobile to prevent rapid restart loops
        setTimeout(() => {
          const currentState = useStore.getState();
          if (isListeningRef.current && !currentState.isAiSpeaking && !currentState.isThinking && !isRecognitionActiveRef.current) {
            try { 
              recognitionRef.current.start(); 
              isRecognitionActiveRef.current = true;
              // Don't call setListening(true) here if it's already true to avoid unnecessary re-renders
              if (!currentState.isListening) setListening(true);
            } catch (e) {
              console.error("Failed to restart recognition:", e);
              // If it fails to start, we should probably stop trying for a bit
              isRecognitionActiveRef.current = false;
            }
          }
        }, 300);
      } else {
        // Only update store if state actually changed
        if (state.isListening) setListening(false);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      isRecognitionActiveRef.current = false;
      
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        console.error("Speech recognition fatal error:", event.error);
        isListeningRef.current = false;
        setListening(false);
        alert("Microphone access was denied or is not available. Please check your browser settings.");
      } else if (event.error === 'network') {
        console.error("Speech recognition network error");
        // Network errors might be transient, but let's not loop too fast
      } else if (event.error !== 'no-speech') {
        console.error("Speech recognition error:", event.error);
      }
      
      // Note: onend will still be called after onerror
    };

    setConnected(true);
    isListeningRef.current = true;
    setListening(true);
    resetSilenceTimer();

    comboTimerRef.current = setInterval(() => {
      if (!useStore.getState().isThinking) {
        incrementCombo();
      }
    }, 5000);

    try { 
      // On mobile, this might fail if not in a direct click handler
      // We'll handle the failure gracefully and let the user click the mic button
      recognitionRef.current.start(); 
      isRecognitionActiveRef.current = true;
    } catch (e) {
      console.warn("Initial recognition start failed, waiting for user gesture", e);
      isListeningRef.current = false;
      setListening(false);
    }
    
    const hasHistory = useStore.getState().messages.length > 0;
    const greeting = hasHistory 
      ? "Hey, welcome back! Shall we continue our talk?" 
      : "Hello! I'm EnglishFlow. What would you like to talk about today?";
    const greetingTrans = hasHistory
      ? "嘿，欢迎回来！我们继续刚才的话题吗？"
      : "你好！我是 EnglishFlow。今天想聊点什么？";
      
    const aiMsgId = Date.now().toString();
    addOrUpdateMessage(aiMsgId, 'ai', greeting, true, greetingTrans);
    speak(greeting);

    } catch (error) {
      console.error("Initialization error:", error);
      setConnected(false);
    }
  }, [setConnected, setListening, resetSilenceTimer, incrementCombo, handleUserAudioText, speak, addOrUpdateMessage]);

  const disconnect = useCallback(() => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      if (isRecognitionActiveRef.current) {
        try { 
          recognitionRef.current.stop(); 
          isRecognitionActiveRef.current = false;
        } catch (e) {}
      }
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setConnected(false);
    setAiSpeaking(false);
    setThinking(false);
    setListening(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (comboTimerRef.current) clearInterval(comboTimerRef.current);
  }, [setConnected, setAiSpeaking, setThinking, setListening]);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect, toggleListening };
}
