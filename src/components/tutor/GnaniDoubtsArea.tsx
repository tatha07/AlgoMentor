import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GnaniVoiceId } from '../../types';
import { GNANI_VOICES } from '../../data/gnaniVoicesData';
import { askAiTutor } from '../../services/api';
import { speechEngine, AudioPlaybackState } from '../../services/speechManager';
import { GnaniVoiceSelectorModal } from './GnaniVoiceSelectorModal';
import Markdown from 'react-markdown';
import {
  HelpCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Square,
  Radio,
  Send,
  Sparkles,
  Loader2,
  Check,
  Copy,
  Terminal,
  Zap,
  CornerDownLeft,
  Flame,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface DoubtMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  voicePersona: GnaniVoiceId;
  topic?: string;
}

interface GnaniDoubtsAreaProps {
  contextProblemTitle?: string;
  contextCode?: string;
  contextLanguage?: string;
  onSendCodeToEditor?: (code: string) => void;
  className?: string;
  compact?: boolean;
}

const QUICK_DOUBTS = [
  'Why does the Two Pointers technique require a sorted array?',
  'What is the fundamental difference between Tabulation and Memoization?',
  'Why can a Binary Search Tree degrade to O(N) time complexity?',
  'How do I handle edge cases with duplicate elements in two sum?',
  'Why is HashMap average lookup O(1) but worst-case O(N)?',
  'What is amortized time complexity in dynamic arrays like ArrayList?',
];

export const GnaniDoubtsArea: React.FC<GnaniDoubtsAreaProps> = ({
  contextProblemTitle,
  contextCode,
  contextLanguage = 'python',
  className = '',
  compact = false,
}) => {
  const { userProfile } = useApp();

  const [selectedVoiceId, setSelectedVoiceId] = useState<GnaniVoiceId>(() => {
    try {
      const saved = localStorage.getItem('gnani_voice_v2');
      if (saved && saved in GNANI_VOICES) return saved as GnaniVoiceId;
    } catch {}
    return 'energetic';
  });

  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Playback state from speechManager
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(() => speechEngine.getState());

  useEffect(() => {
    return speechEngine.subscribe(setPlaybackState);
  }, []);

  // Doubts History
  const [doubts, setDoubts] = useState<DoubtMessage[]>([
    {
      id: 'doubt-welcome',
      question: contextProblemTitle 
        ? `I have a doubt about ${contextProblemTitle}. How should I optimize my approach?`
        : 'Why does Two Pointers require a sorted array to guarantee finding the target?',
      answer: contextProblemTitle
        ? `Welcome to the Doubts Arena! I'm your AI DSA instructor. You can ask any conceptual doubt, edge case, or ask for a dry run on **${contextProblemTitle}**. I'll answer both in text and speak the core intuition aloud in my **${GNANI_VOICES[selectedVoiceId]?.name}** voice.`
        : `When an array is sorted, comparing elements gives you a **directional invariant**:
        
- If \`nums[left] + nums[right] < target\`, the sum is too small. Because the array is sorted ascendingly, decrementing \`right\` would only make it smaller! Therefore, the ONLY way to increase the sum is to increment \`left++\`.
- Conversely, if \`nums[left] + nums[right] > target\`, incrementing \`left\` would only increase the sum further. The ONLY logical move is to decrement \`right--\`.

Without a sorted order, moving pointers loses this monotonic property, reducing you to brute force O(N²) search.`,
      timestamp: new Date().toISOString(),
      voicePersona: selectedVoiceId,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const doubtsEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    doubtsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [doubts, isLoading]);

  const handleSelectVoice = (voiceId: GnaniVoiceId) => {
    setSelectedVoiceId(voiceId);
    try {
      localStorage.setItem('gnani_voice_v2', voiceId);
    } catch {}
  };

  const handleAskDoubt = async (queryText?: string) => {
    const rawQuestion = (queryText || inputText).trim();
    if (!rawQuestion || isLoading) return;

    speechEngine.interrupt();
    speechEngine.unlockAudio();

    setInputText('');
    setIsLoading(true);

    const doubtId = `doubt-${Date.now()}`;
    const pendingDoubt: DoubtMessage = {
      id: doubtId,
      question: rawQuestion,
      answer: '',
      timestamp: new Date().toISOString(),
      voicePersona: selectedVoiceId,
    };
    setDoubts(prev => [...prev, pendingDoubt]);

    let contextualizedMessage = rawQuestion;

    if (contextProblemTitle) {
      contextualizedMessage = `[Problem: ${contextProblemTitle}]\n` + contextualizedMessage;
    }
    if (contextCode) {
      contextualizedMessage += `\n\n[My Current ${contextLanguage} Code]:\n\`\`\`${contextLanguage}\n${contextCode}\n\`\`\``;
    }

    try {
      const historyPayload = doubts.slice(-4).flatMap(d => [
        { role: 'user', content: d.question },
        { role: 'assistant', content: d.answer },
      ]);

      const answer = await askAiTutor({
        message: contextualizedMessage,
        conversationHistory: historyPayload,
        userLevel: userProfile.level,
        tone: userProfile.tutorTone,
        mode: 'doubt',
        voicePersona: selectedVoiceId,
        preferredLanguage: userProfile.preferredLanguage,
      }, chunk => {
        setDoubts(prev => prev.map(doubt =>
          doubt.id === doubtId ? { ...doubt, answer: doubt.answer + chunk } : doubt
        ));
      });

      setDoubts(prev => prev.map(doubt =>
        doubt.id === doubtId ? { ...doubt, answer } : doubt
      ));

      // Automatically speak the doubt explanation if auto-speak is enabled
      if (autoSpeak) {
        void speechEngine.speakText(answer, selectedVoiceId, doubtId, playbackSpeed);
      }
    } catch (err: any) {
      const errorMessage = `⚠️ Could not reach Gnani. Please check your network or try again: ${err?.message || 'Error'}`;
      setDoubts(prev => prev.map(doubt =>
        doubt.id === doubtId ? { ...doubt, answer: errorMessage } : doubt
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakDoubt = (doubt: DoubtMessage) => {
    speechEngine.unlockAudio();
    if (playbackState.speakingMessageId === doubt.id && (playbackState.isPlaying || playbackState.isLoadingAudio)) {
      speechEngine.interrupt();
      return;
    }
    void speechEngine.speakText(doubt.answer, doubt.voicePersona || selectedVoiceId, doubt.id, playbackSpeed);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeVoiceConfig = GNANI_VOICES[selectedVoiceId] || GNANI_VOICES.classic;

  return (
    <div className={`flex flex-col bg-white dark:bg-[#141517] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden ${className}`}>
      {/* Doubts Area Header & Audio Control Bar */}
      <div className="p-3.5 bg-zinc-50 dark:bg-[#0c0d0e] border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        {/* Title & Persona Selector */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-md shadow-orange-600/30">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold tracking-tight uppercase text-zinc-900 dark:text-white">
                Chat with Gnani
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-[11px] font-mono text-orange-600 dark:text-orange-400 font-semibold">
                Doubts Area
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              Ask doubts in text · Hear answers in real-time voice
            </p>
          </div>
        </div>

        {/* Voice Persona & Audio Settings */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            id="btn-doubts-voice-selector"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-orange-500 text-xs font-mono text-zinc-800 dark:text-zinc-200 transition-all shadow-sm group"
            title="Change Gnani voice persona"
          >
            <Radio className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-bold group-hover:text-orange-500">{activeVoiceConfig.name}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono">
            {[0.9, 1.0, 1.2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-orange-600 text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Auto-Voice Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border ${
              autoSpeak
                ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-800/60'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
            }`}
            title="Toggle automatic speech on new doubts"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-orange-500" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoSpeak ? 'Voice ON' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Spoken Audio Master Controller Banner (Shows whenever voice is synthesizing or speaking) */}
      {(playbackState.isPlaying || playbackState.isLoadingAudio) && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/15 border-b border-orange-200 dark:border-orange-800/60 flex items-center justify-between gap-3 text-xs font-mono animate-in fade-in">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {playbackState.isLoadingAudio ? (
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Gnani's voice explanation...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Waveform Equalizer */}
                <div className="flex items-center gap-0.5 h-3.5 shrink-0">
                  <span className="w-1 bg-orange-600 h-3 animate-pulse rounded-full" />
                  <span className="w-1 bg-orange-500 h-4 animate-pulse [animation-delay:0.15s] rounded-full" />
                  <span className="w-1 bg-orange-600 h-2 animate-pulse [animation-delay:0.3s] rounded-full" />
                  <span className="w-1 bg-orange-500 h-3.5 animate-pulse [animation-delay:0.45s] rounded-full" />
                </div>
                <div className="truncate">
                  <span className="font-bold text-orange-700 dark:text-orange-300">
                    {activeVoiceConfig.name}:
                  </span>{' '}
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {playbackState.spokenSnippet || 'Explaining doubt...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {playbackState.isPlaying && (
              playbackState.isPaused ? (
                <button
                  onClick={() => speechEngine.resume()}
                  className="p-1 rounded-md bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-orange-500 border border-zinc-200 dark:border-zinc-700"
                  title="Resume"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => speechEngine.pause()}
                  className="p-1 rounded-md bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-orange-500 border border-zinc-200 dark:border-zinc-700"
                  title="Pause"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
              )
            )}

            <button
              onClick={() => speechEngine.interrupt()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-sm"
              title="Stop speech"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      )}

      {/* Doubts Conversation Stream */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-[#141517] ${compact ? 'max-h-[360px]' : 'min-h-[300px] max-h-[520px]'}`}>
        {doubts.map(doubt => {
          const isSpeakingThis = playbackState.speakingMessageId === doubt.id && playbackState.isPlaying;
          const isLoadingThis = playbackState.speakingMessageId === doubt.id && playbackState.isLoadingAudio;

          return (
            <div key={doubt.id} className="space-y-3">
              {/* Question bubble from student */}
              <div className="flex items-start gap-2.5 justify-end">
                <div className="max-w-[85%] rounded-xl px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-medium shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-600 mb-1 font-mono uppercase">
                    <MessageSquare className="w-3 h-3 text-orange-500" />
                    <span>Your Doubt</span>
                  </div>
                  <p>{doubt.question}</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5">
                  U
                </div>
              </div>

              {/* Answer card from Gnani */}
              <div className="flex items-start gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                  <Flame className="w-4 h-4 fill-current" />
                </div>

                <div className={`max-w-[88%] rounded-xl px-4 py-3.5 border transition-all ${
                  isSpeakingThis
                    ? 'bg-orange-50/70 dark:bg-orange-950/20 border-orange-500 shadow-md shadow-orange-500/10'
                    : 'bg-white dark:bg-[#0c0d0e] border-zinc-200 dark:border-zinc-800 shadow-sm'
                }`}>
                  {/* Card Header with Spoken Audio Action Bar */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {GNANI_VOICES[doubt.voicePersona]?.name || 'Gnani'}
                      </span>
                      <span className="text-[10px] text-zinc-400">· Clarification</span>
                    </div>

                    {doubt.answer && <div className="flex items-center gap-1.5">
                      {/* Hear Explanation with Voice Button */}
                      <button
                        onClick={() => handleSpeakDoubt(doubt)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono font-bold transition-all border ${
                          isSpeakingThis
                            ? 'bg-orange-600 text-white border-orange-500'
                            : isLoadingThis
                            ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 border-orange-400'
                            : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
                        }`}
                        title="Listen to this explanation aloud"
                      >
                        {isLoadingThis ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                            <span>Loading...</span>
                          </>
                        ) : isSpeakingThis ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-orange-500" />
                            <span>Listen to Voice</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyText(doubt.answer, doubt.id)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Copy answer text"
                      >
                        {copiedId === doubt.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>}
                  </div>

                  {/* Markdown Explanation Body */}
                  <div className="prose dark:prose-invert prose-xs sm:prose-sm max-w-none break-words leading-relaxed space-y-2 font-sans text-zinc-800 dark:text-zinc-200">
                    {doubt.answer ? (
                      <Markdown>{doubt.answer}</Markdown>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                        <span>{activeVoiceConfig.name} is preparing your doubt explanation...</span>
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-up Doubt Chips */}
                  {doubt.answer && <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-zinc-400">Ask follow-up:</span>
                    <button
                      onClick={() => handleAskDoubt('Explain this in simpler terms with a real-life analogy.')}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-zinc-600 dark:text-zinc-300 hover:text-orange-600 border border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                      Explain simpler
                    </button>
                    <button
                      onClick={() => handleAskDoubt('What is the exact time and space complexity of this approach?')}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-zinc-600 dark:text-zinc-300 hover:text-orange-600 border border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                      Big-O Derivation
                    </button>
                    <button
                      onClick={() => handleAskDoubt('Can you walk me through a small concrete trace step by step?')}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-zinc-600 dark:text-zinc-300 hover:text-orange-600 border border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                      Concrete Trace
                    </button>
                  </div>}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={doubtsEndRef} />
      </div>

      {/* Quick Doubts Prompt Chips Bar */}
      <div className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0d0e] overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <span className="text-[10px] font-mono uppercase text-orange-600 dark:text-orange-400 font-bold shrink-0">
          Quick Doubts:
        </span>
        {QUICK_DOUBTS.map((doubtPrompt, idx) => (
          <button
            key={idx}
            onClick={() => handleAskDoubt(doubtPrompt)}
            disabled={isLoading}
            className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 border border-zinc-200 dark:border-zinc-800 transition-colors shrink-0 shadow-sm disabled:opacity-40"
          >
            {doubtPrompt}
          </button>
        ))}
      </div>

      {/* Doubts Text Input Area (Text-to-Speech Doubts Box) */}
      <div className="p-3 bg-white dark:bg-[#0c0d0e] border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-end gap-2 bg-zinc-50 dark:bg-[#141517] border border-zinc-300 dark:border-zinc-800 rounded-xl p-2 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAskDoubt();
              }
            }}
            placeholder="Type your DSA doubt in text (e.g., Why does this loop condition work? How does recursion unfold?)..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none resize-none py-1 px-2 font-sans leading-relaxed"
          />

          <button
            onClick={() => handleAskDoubt()}
            disabled={isLoading || !inputText.trim()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-orange-600/30 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Ask doubt"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Ask Doubt</span>
              </>
            )}
          </button>
        </div>
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
