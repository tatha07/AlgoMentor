import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { askAiTutor } from '../../services/api';
import { ChatMessage, GnaniVoiceId, TeachingMode } from '../../types';
import { GNANI_VOICES, GNANI_TEACHING_MODES, DSA_CURRICULUM_PROMPTS } from '../../data/gnaniVoicesData';
import { speechEngine, AudioPlaybackState } from '../../services/speechManager';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { GnaniVoiceSelectorModal } from './GnaniVoiceSelectorModal';
import { GnaniDoubtsArea } from './GnaniDoubtsArea';
import { AlgorithmVisualizerWorkbench } from './visualizer/AlgorithmVisualizerWorkbench';
import Markdown from 'react-markdown';
import {
  Mic,
  Square,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
  Terminal,
  Copy,
  Check,
  Split,
  Loader2,
  AlertCircle,
  Flame,
  Radio,
  HelpCircle
} from 'lucide-react';

const VOICE_PREF_KEY = 'gnani_selected_voice_v2';
const AUTO_SPEAK_PREF_KEY = 'gnani_auto_speak_v2';

export const GnaniTutorView: React.FC = () => {
  const { userProfile, updateTutorTone } = useApp();

  // Voice Selection State
  const [selectedVoiceId, setSelectedVoiceId] = useState<GnaniVoiceId>(() => {
    try {
      const saved = localStorage.getItem(VOICE_PREF_KEY);
      if (saved && saved in GNANI_VOICES) return saved as GnaniVoiceId;
    } catch {}
    return 'energetic';
  });

  // Auto-speak responses aloud
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTO_SPEAK_PREF_KEY);
      if (saved !== null) return saved === 'true';
    } catch {}
    return true;
  });

  // Teaching Mode (Learn, Solve, Hint, Interview, Revision)
  const [teachingMode, setTeachingMode] = useState<TeachingMode>('doubt');

  // Voice Modal
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Workbench Side-by-Side Split View
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(true);

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'gnani-welcome',
      role: 'assistant',
      content: `Hey **${userProfile.name.split(' ')[0]}**! I am **Gnani**, your personal AI Data Structures & Algorithms Professor.

I am built to train your algorithmic intuition through live voice conversation, step-by-step invariant derivations, and interactive visual dry runs.

- Tap the **microphone button** or press enter to ask any DSA question.
- Select your learning mode (**Learn**, **Solve**, **Hint**, **Interview**, **Revision**).
- Use the **interactive visualizer workbench** on the right to step through algorithms in real-time.

What concept or LeetCode problem are we tackling right now?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Speech Playback State
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(speechEngine.getState());

  useEffect(() => {
    const unsubscribe = speechEngine.subscribe(setPlaybackState);
    return () => unsubscribe();
  }, []);

  const handleSelectVoice = (voiceId: GnaniVoiceId) => {
    setSelectedVoiceId(voiceId);
    try {
      localStorage.setItem(VOICE_PREF_KEY, voiceId);
    } catch {}
  };

  const handleToggleAutoSpeak = () => {
    setAutoSpeak(prev => {
      const next = !prev;
      try {
        localStorage.setItem(AUTO_SPEAK_PREF_KEY, String(next));
      } catch {}
      return next;
    });
  };

  // Speech Recognition hook
  const handleDictatedText = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const {
    isListening,
    isTranscribing,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition(handleDictatedText);

  // When listening starts, interrupt talking Gnani
  useEffect(() => {
    if (isListening) {
      speechEngine.interrupt();
    }
  }, [isListening]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, interimTranscript]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawQuery = textToSend || inputText;
    if (!rawQuery.trim() || isLoading) return;

    speechEngine.interrupt();
    speechEngine.unlockAudio();

    const userMsgText = rawQuery.trim();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const assistantMessageId = `gnani-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };

      const reply = await askAiTutor({
        message: userMsgText,
        conversationHistory: historyPayload,
        userLevel: userProfile.level,
        tone: userProfile.tutorTone,
        currentTopic: userProfile.currentTopicId,
        mode: teachingMode,
        voicePersona: selectedVoiceId,
        preferredLanguage: userProfile.preferredLanguage,
      }, chunk => {
        setMessages(prev => {
          const messageExists = prev.some(message => message.id === assistantMessageId);
          return messageExists
            ? prev.map(message => message.id === assistantMessageId
              ? { ...message, content: message.content + chunk }
              : message)
            : [...prev, { ...assistantMessage, content: chunk }];
        });
      });

      setMessages(prev => prev.map(message =>
        message.id === assistantMessageId ? { ...message, content: reply } : message
      ));

      if (autoSpeak) {
        void speechEngine.speakText(reply, selectedVoiceId, assistantMessageId);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Could not reach Gnani. Please check your network or API keys: ${err?.message}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
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

  const handleSpeakSingleMessage = (msg: ChatMessage) => {
    speechEngine.unlockAudio();
    if (playbackState.speakingMessageId === msg.id && (playbackState.isPlaying || playbackState.isLoadingAudio)) {
      speechEngine.interrupt();
      return;
    }
    void speechEngine.speakText(msg.content, selectedVoiceId, msg.id);
  };

  const handleSendCodeFromWorkbench = (code: string, language: string) => {
    const prompt = `Gnani, please review my ${language} implementation. Explain its time/space complexity and any potential bugs:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    handleSendMessage(prompt);
  };

  const activeVoiceConfig = GNANI_VOICES[selectedVoiceId] || GNANI_VOICES.classic;

  return (
    <div className="flex flex-col h-[calc(100vh-6.2rem)] w-full max-w-7xl mx-auto space-y-3">
      {/* Top Bar: Voice Persona & Teaching Mode Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#141517] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
        {/* Left: Active Voice Badge & Audition Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            id="btn-voice-selector"
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/80 hover:border-orange-500 transition-all text-left group"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeVoiceConfig.avatarGradient} flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm`}>
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono group-hover:text-orange-500">
                  {activeVoiceConfig.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {activeVoiceConfig.badge}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[140px]">
                {activeVoiceConfig.tagline}
              </p>
            </div>
          </button>

          {/* Auto-Speak Toggle */}
          <button
            onClick={handleToggleAutoSpeak}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors border ${
              autoSpeak
                ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-800/60'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-orange-500" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoSpeak ? 'Voice ON' : 'Muted'}</span>
          </button>
        </div>

        {/* Center: Teaching Mode Segmented Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
          {(Object.keys(GNANI_TEACHING_MODES) as TeachingMode[]).map(modeKey => {
            const mode = GNANI_TEACHING_MODES[modeKey];
            const isActive = teachingMode === modeKey;

            return (
              <button
                key={mode.id}
                onClick={() => setTeachingMode(mode.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white font-bold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title={mode.description}
              >
                <span>{mode.name.replace(' Mode', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Toggle Visualizer Workbench Split */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWorkbenchOpen(!isWorkbenchOpen)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
              isWorkbenchOpen
                ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-800/60'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <Split className="w-3.5 h-3.5 text-orange-500" />
            <span>{isWorkbenchOpen ? 'Hide Visualizer' : 'Open Visualizer'}</span>
          </button>
        </div>
      </div>

      {playbackState.fallbackNotice && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{playbackState.fallbackNotice}</span>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left Pane: Conversational Voice Tutor OR Doubts Area (Col 6 or 12) */}
        <div className={`flex flex-col h-full bg-white dark:bg-[#141517] rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm transition-all ${
          isWorkbenchOpen ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-12'
        }`}>
          {teachingMode === 'doubt' ? (
            <GnaniDoubtsArea className="h-full border-0 rounded-none" />
          ) : (
            <>
              {/* Active Speaking Energetic Bar (Interruptible) */}
              {(playbackState.isPlaying || playbackState.isLoadingAudio) && (
                <div className="px-4 py-2 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/15 border-b border-orange-200 dark:border-orange-800/60 flex items-center justify-between text-xs font-mono animate-in fade-in">
                  <div className="flex items-center gap-2">
                    {playbackState.isLoadingAudio ? (
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Synthesizing {activeVoiceConfig.name}'s voice explanation...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-0.5 h-3">
                          <span className="w-1 bg-orange-500 h-3 animate-pulse rounded-full" />
                          <span className="w-1 bg-orange-500 h-2 animate-pulse [animation-delay:0.2s] rounded-full" />
                          <span className="w-1 bg-orange-500 h-4 animate-pulse [animation-delay:0.4s] rounded-full" />
                          <span className="w-1 bg-orange-500 h-2 animate-pulse [animation-delay:0.1s] rounded-full" />
                        </div>
                        <span className="font-bold text-orange-700 dark:text-orange-400">
                          {activeVoiceConfig.name} is explaining...
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {playbackState.isPlaying && (
                      playbackState.isPaused ? (
                        <button
                          onClick={() => speechEngine.resume()}
                          className="p-1 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-orange-500"
                          title="Resume playback"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => speechEngine.pause()}
                          className="p-1 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-orange-500"
                          title="Pause playback"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}

                    {/* THE INTERRUPT BUTTON */}
                    <button
                      onClick={() => speechEngine.interrupt()}
                      id="btn-interrupt-speech"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-sm"
                      title="Interrupt Gnani instantly"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      <span>Interrupt</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white dark:bg-[#141517]">
                {messages.map(msg => {
                  const isUser = msg.role === 'user';
                  const isCurrentlySpeaking = playbackState.speakingMessageId === msg.id && playbackState.isPlaying;
                  const isCurrentlyLoadingAudio = playbackState.speakingMessageId === msg.id && playbackState.isLoadingAudio;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-mono font-bold text-xs">
                          <Flame className="w-4 h-4 fill-current" />
                        </div>
                      )}

                      <div
                        className={`group relative max-w-[88%] rounded-xl px-4 py-3.5 transition-all ${
                          isUser
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
                            : isCurrentlySpeaking
                            ? 'bg-orange-50/70 dark:bg-orange-950/30 text-zinc-900 dark:text-zinc-100 border-2 border-orange-500 shadow-lg shadow-orange-500/10'
                            : 'bg-zinc-50 dark:bg-[#0c0d0e] text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-sm'
                        }`}
                      >
                        {/* Header Bar for AI response */}
                        {!isUser && (
                          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500">
                            <span className="font-bold text-orange-600 dark:text-orange-400">
                              {activeVoiceConfig.name}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSpeakSingleMessage(msg)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                                  isCurrentlySpeaking
                                    ? 'bg-orange-600 text-white'
                                    : isCurrentlyLoadingAudio
                                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/40'
                                    : 'hover:text-zinc-900 dark:hover:text-white'
                                }`}
                                title={isCurrentlySpeaking ? 'Stop speaking' : 'Read aloud with current Gnani voice'}
                              >
                                {isCurrentlyLoadingAudio ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                                    <span>Generating...</span>
                                  </>
                                ) : isCurrentlySpeaking ? (
                                  <>
                                    <Square className="w-3 h-3 fill-current" />
                                    <span>Stop</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3 h-3 text-orange-500" />
                                    <span>Speak</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white"
                              >
                                {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Markdown Body */}
                        <div className="prose dark:prose-invert prose-sm max-w-none break-words leading-relaxed space-y-2.5 font-sans">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5 font-mono text-xs font-bold">
                          U
                        </div>
                      )}
                    </div>
                  );
                })}

            {/* Live Interim Speech Bubble as User Speaks */}
            {isListening && interimTranscript && (
              <div className="flex items-start gap-3 justify-end animate-in fade-in">
                <div className="max-w-[85%] rounded-xl px-4 py-3 bg-orange-500/20 text-orange-950 dark:text-orange-200 border border-orange-500/40 text-sm font-sans flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
                  <span>{interimTranscript}</span>
                </div>
              </div>
            )}

            {/* AI Generating Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 animate-in fade-in">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#0c0d0e] border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-orange-600 dark:text-orange-400 font-bold">
                    {activeVoiceConfig.name} is computing the algorithmic explanation...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Curriculum Prompts Bar */}
          <div className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0d0e] overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            <span className="text-[10px] font-mono uppercase text-orange-600 dark:text-orange-400 shrink-0 font-bold">
              Prompt Ideas:
            </span>
            {DSA_CURRICULUM_PROMPTS[0].prompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 border border-zinc-200 dark:border-zinc-800 transition-colors shrink-0 shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Microphone & Input Bar */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0d0e] space-y-2">
            {/* Listening Waveform Bar */}
            {isListening && (
              <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center justify-between text-xs font-mono text-orange-700 dark:text-orange-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                  <span className="font-bold">Listening... Speak naturally.</span>
                </div>
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}

            {speechError && (
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            <div className="flex items-end gap-2 bg-white dark:bg-[#141517] border border-zinc-300 dark:border-zinc-800 rounded-xl p-2 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all shadow-sm">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gnani: 'Explain binary search', 'Help me solve Two Sum', or speak with the mic..."
                className="flex-1 max-h-32 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none resize-none py-1.5 px-2 font-sans"
              />

              {/* Main Microphone Button */}
              <button
                type="button"
                onClick={() => {
                  if (isListening) stopListening();
                  else void startListening();
                }}
                disabled={isTranscribing || isLoading}
                id="btn-voice-record"
                aria-label={isListening ? 'Stop recording voice' : 'Speak to Gnani'}
                className={`p-3 rounded-xl transition-all shadow-sm ${
                  isListening
                    ? 'bg-orange-600 text-white animate-pulse ring-4 ring-orange-500/30 scale-105'
                    : 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice conversation with Gnani'}
              >
                {isTranscribing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isListening ? (
                  <Square className="w-5 h-5 fill-current" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                id="btn-send-message"
                className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm shadow-orange-600/20"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Right Pane: Visual Learning & Code Workbench (Col 6) */}
        {isWorkbenchOpen && (
          <div className="lg:col-span-6 xl:col-span-6 h-full min-h-[400px]">
            <AlgorithmVisualizerWorkbench
              onSendCodeToTutor={handleSendCodeFromWorkbench}
            />
          </div>
        )}
      </div>

      {/* Voice Selection Modal */}
      <GnaniVoiceSelectorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={handleSelectVoice}
      />
    </div>
  );
};
