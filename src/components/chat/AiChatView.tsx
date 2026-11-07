import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { askAiTutor, synthesizeSpeech, transcribeSpeech } from '../../services/api';
import { ChatMessage, TutorTone } from '../../types';
import Markdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Flame, 
  Terminal, 
  HelpCircle, 
  Copy, 
  Check, 
  Trash2, 
  Code, 
  User,
  Mic,
  Square,
  Volume2,
  Loader2
} from 'lucide-react';

async function convertRecordingToWav(recording: Blob): Promise<Blob> {
  const audioContext = new AudioContext();
  try {
    const audioBuffer = await audioContext.decodeAudioData(await recording.arrayBuffer());
    const frameCount = audioBuffer.length;
    const channelData = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) =>
      audioBuffer.getChannelData(index)
    );
    const wav = new ArrayBuffer(44 + frameCount * 2);
    const view = new DataView(wav);
    const writeString = (offset: number, value: string) => {
      for (let index = 0; index < value.length; index++) {
        view.setUint8(offset + index, value.charCodeAt(index));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + frameCount * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, frameCount * 2, true);

    for (let frame = 0; frame < frameCount; frame++) {
      let sample = 0;
      for (const channel of channelData) {
        sample += channel[frame] / channelData.length;
      }
      const pcmSample = Math.max(-1, Math.min(1, sample));
      view.setInt16(44 + frame * 2, pcmSample < 0 ? pcmSample * 0x8000 : pcmSample * 0x7fff, true);
    }

    return new Blob([wav], { type: 'audio/wav' });
  } finally {
    await audioContext.close();
  }
}

function getSpeechText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' Code block omitted. ')
    .replace(/[`*_#>\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const DEFAULT_QUICK_QUESTIONS = [
  'Why is QuickSort O(N log N) on average but O(N^2) worst case?',
  'Explain recursion and the call stack like I am 10 years old.',
  'What is the practical difference between BFS and DFS?',
  'How do I identify when to use a Monotonic Stack vs Heap?',
  'Roast my idea of storing graph adjacency matrices for 1,000,000 sparse nodes.',
  'Explain how Floyd’s Cycle detection mathematically guarantees finding a loop.'
];

export const AiChatView: React.FC = () => {
  const { userProfile, updateTutorTone } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hey **${userProfile.name.split(' ')[0]}**! I'm your AI Senior DSA Instructor.

I'm here to build your algorithmic intuition, break down complex data structures, and roast bad brute-force ideas before your interviewers do.

What algorithm or concept are we tackling today?`,
      timestamp: new Date().toISOString(),
      roastLevel: userProfile.tutorTone,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current !== null) {
        window.clearTimeout(recordingTimeoutRef.current);
      }
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = null;
        recorder.stop();
      }
      recorder?.stream.getTracks().forEach(track => track.stop());
      audioRef.current?.pause();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    setSpeechError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setSpeechError('Audio recording is not supported by this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4'].find(type =>
        MediaRecorder.isTypeSupported(type)
      );
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorderRef.current = recorder;
      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setIsTranscribing(true);
        try {
          const recording = new Blob(chunks, { type: recorder.mimeType });
          if (!recording.size) {
            throw new Error('No audio was recorded.');
          }
          const wav = await convertRecordingToWav(recording);
          const transcript = await transcribeSpeech(wav);
          if (!transcript.trim()) {
            throw new Error('No speech was detected. Try recording again.');
          }
          setInputText(current => `${current.trim()}${current.trim() ? ' ' : ''}${transcript}`);
          textareaRef.current?.focus();
        } catch (error) {
          setSpeechError(error instanceof Error ? error.message : 'Could not transcribe the recording.');
        } finally {
          setIsTranscribing(false);
        }
      };
      recorder.onerror = () => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setSpeechError('Audio recording failed. Please try again.');
      };
      recorder.start(250);
      setIsRecording(true);
      recordingTimeoutRef.current = window.setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, 30000);
    } catch (error) {
      setSpeechError(error instanceof Error ? error.message : 'Microphone access was denied.');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recordingTimeoutRef.current !== null) {
        window.clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }
      recorderRef.current?.stop();
      return;
    }
    void startRecording();
  };

  const handleSpeakMessage = async (message: ChatMessage) => {
    if (speakingId === message.id) {
      audioRef.current?.pause();
      setSpeakingId(null);
      return;
    }

    setSpeechError(null);
    audioRef.current?.pause();
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    const text = getSpeechText(message.content);
    if (!text) return;

    setSpeakingId(message.id);
    try {
      const audioBlob = await synthesizeSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioUrlRef.current = null;
        audioRef.current = null;
        setSpeakingId(null);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioUrlRef.current = null;
        audioRef.current = null;
        setSpeakingId(null);
        setSpeechError('Could not play the generated audio.');
      };
      await audio.play();
    } catch (error) {
      setSpeakingId(null);
      setSpeechError(error instanceof Error ? error.message : 'Could not synthesize speech.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawQuery = textToSend || inputText;
    if ((!rawQuery.trim() && !codeInput.trim()) || isLoading) return;

    let fullPrompt = rawQuery.trim();
    if (codeInput.trim()) {
      fullPrompt += `\n\n\`\`\`${userProfile.preferredLanguage}\n${codeInput.trim()}\n\`\`\``;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: fullPrompt,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setCodeInput('');
    setIsCodeInputOpen(false);
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await askAiTutor({
        message: fullPrompt,
        conversationHistory: historyPayload,
        userLevel: userProfile.level,
        tone: userProfile.tutorTone,
        currentTopic: userProfile.currentTopicId,
      });

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        roastLevel: userProfile.tutorTone,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Error**: ${err?.message || 'Could not communicate with the DSA tutor. Please verify your connection.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared. What's on your mind regarding Data Structures & Algorithms?`,
        timestamp: new Date().toISOString(),
        roastLevel: userProfile.tutorTone,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm transition-colors duration-200">
      {/* Chat Header & Persona Selector */}
      <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">Senior DSA Instructor</h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-semibold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Strictly DSA & Algorithmic problem solving.</p>
          </div>
        </div>

        {/* Tone Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => updateTutorTone('balanced')}
            id="tone-btn-balanced"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-mono ${
              userProfile.tutorTone === 'balanced'
                ? 'bg-white dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm border border-indigo-200 dark:border-indigo-500/40'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Balanced</span>
          </button>
          <button
            onClick={() => updateTutorTone('savage')}
            id="tone-btn-savage"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-mono ${
              userProfile.tutorTone === 'savage'
                ? 'bg-white dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold shadow-sm border border-amber-200 dark:border-amber-500/40'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-500" />
            <span>Savage Roast 🌶️</span>
          </button>
          <button
            onClick={() => updateTutorTone('socratic')}
            id="tone-btn-socratic"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-mono ${
              userProfile.tutorTone === 'socratic'
                ? 'bg-white dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold shadow-sm border border-violet-200 dark:border-violet-500/40'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3 h-3 text-violet-500" />
            <span>Socratic</span>
          </button>

          <button
            onClick={handleClearChat}
            id="btn-clear-chat"
            title="Clear Chat History"
            className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 bg-white dark:bg-zinc-900/40">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`group relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-zinc-50 dark:bg-zinc-950/70 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800/80 shadow-sm'
                }`}
              >
                {/* Assistant Message Header */}
                {!isUser && (
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-200 dark:border-zinc-800/50 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-3 h-3" /> Senior Instructor
                    </span>
                    <button
                      onClick={() => void handleSpeakMessage(msg)}
                      title={speakingId === msg.id ? 'Stop speaking' : 'Read this reply aloud'}
                      disabled={speakingId !== null && speakingId !== msg.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white disabled:opacity-40"
                    >
                      {speakingId === msg.id ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{speakingId === msg.id ? 'Stop' : 'Speak'}</span>
                    </button>
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Markdown content */}
                <div className="prose dark:prose-invert prose-sm max-w-none break-words leading-relaxed space-y-3 font-sans">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-indigo-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800/80 flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-indigo-600 dark:text-indigo-300">Senior dev is inspecting memory & invariants...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 shrink-0 font-semibold">
          💡 Quick Topics:
        </span>
        {DEFAULT_QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 transition-colors shrink-0 shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Code Attachment Drawer */}
      {isCodeInputOpen && (
        <div className="px-4 pt-3 pb-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/90 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Code className="w-3.5 h-3.5" /> Attach Code Snippet ({userProfile.preferredLanguage})
            </span>
            <button
              onClick={() => setIsCodeInputOpen(false)}
              className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white text-[11px]"
            >
              Cancel
            </button>
          </div>
          <textarea
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            placeholder="// Paste your algorithm implementation or buggy function here..."
            className="w-full h-24 p-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl font-mono text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none shadow-sm"
          />
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 md:p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/90">
        <div className="flex items-end gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
          <button
            type="button"
            onClick={() => setIsCodeInputOpen(!isCodeInputOpen)}
            id="btn-toggle-code-attachment"
            title="Attach Code Block"
            className={`p-2 rounded-lg transition-colors ${
              isCodeInputOpen
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Code className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about time complexity, dynamic programming, hint on Two Sum, or paste code..."
            className="flex-1 max-h-32 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none resize-none py-1.5 px-2"
          />

          <button
            type="button"
            onClick={toggleRecording}
            disabled={isTranscribing || isLoading}
            id="btn-record-message"
            title={isRecording ? 'Stop recording' : 'Dictate a message'}
            aria-label={isRecording ? 'Stop recording' : 'Dictate a message'}
            className={`p-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:pointer-events-none ${
              isRecording
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                : 'text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={(!inputText.trim() && !codeInput.trim()) || isLoading}
            id="btn-send-message"
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {speechError && (
          <p role="alert" className="mt-2 px-2 text-xs text-rose-600 dark:text-rose-400">
            {speechError}
          </p>
        )}
        {isRecording && (
          <p className="mt-2 px-2 text-xs text-rose-600 dark:text-rose-400">
            Recording… select stop when you’re done (30-second limit).
          </p>
        )}
        {isTranscribing && (
          <p className="mt-2 px-2 text-xs text-indigo-600 dark:text-indigo-400">
            Transcribing with Gnani…
          </p>
        )}
      </div>
    </div>
  );
};
