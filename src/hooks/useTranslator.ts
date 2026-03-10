import { useState, useCallback, useRef } from 'react';
import { useStore, FavoriteTranslation } from '../store/useStore';

export function useTranslator() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<FavoriteTranslation | null>(null);
  const recognitionRef = useRef<any>(null);

  const translate = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsTranslating(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are the "Idiomatic Translator". 
              Task: Translate the user's Chinese input into natural, idiomatic American/British English.
              Rules:
              1. Provide 3 variants: "casual" (friends), "formal" (work), and "slang" (street/very idiomatic).
              2. Provide a "why" explanation (极简小字, 文化背景).
              3. Return ONLY JSON with fields: "casual", "formal", "slang", "explanation".`
            },
            { role: 'user', content: text }
          ]
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        const parsed = JSON.parse(content);
        setResult({
          id: Date.now().toString(),
          original: text,
          variants: {
            casual: parsed.casual,
            formal: parsed.formal,
            slang: parsed.slang
          },
          explanation: parsed.explanation,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'zh-CN';
    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      translate(transcript);
    };
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.onerror = () => setIsRecording(false);
    
    recognitionRef.current.start();
  }, [translate]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isRecording,
    isTranslating,
    result,
    translate,
    startRecording,
    stopRecording,
    setResult
  };
}
