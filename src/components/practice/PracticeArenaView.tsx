import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PRACTICE_PROBLEMS } from '../../data/practiceProblems';
import { PracticeProblem, PracticeMode } from '../../types';
import { getProgressiveHint, evaluateSolution } from '../../services/api';
import { MonacoCodeEditor } from '../common/MonacoCodeEditor';
import { GnaniDoubtsArea } from '../tutor/GnaniDoubtsArea';
import { speechEngine, AudioPlaybackState } from '../../services/speechManager';
import Markdown from 'react-markdown';
import { 
  CheckCircle2, 
  Clock, 
  Check, 
  Terminal, 
  Lightbulb,
  Flame,
  ChevronRight,
  Volume2,
  Square,
  HelpCircle,
  BookOpen,
  Loader2
} from 'lucide-react';

export const PracticeArenaView: React.FC = () => {
  const { 
    userProfile, 
    selectedProblemId, 
    setSelectedProblemId, 
    recordSolvedProblem,
    triggerConfetti
  } = useApp();

  // Active problem
  const activeProblem: PracticeProblem = 
    PRACTICE_PROBLEMS.find(p => p.id === selectedProblemId) || PRACTICE_PROBLEMS[0];

  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>(userProfile.preferredLanguage);
  const [code, setCode] = useState<string>(activeProblem.starterCode[userProfile.preferredLanguage] || '');
  const [activeMode] = useState<PracticeMode>('solve');
  
  // Hints state
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [aiHints, setAiHints] = useState<Record<number, string>>({});
  const [isFetchingHint, setIsFetchingHint] = useState(false);

  // Tab state between Problem & Doubts Area
  const [leftTab, setLeftTab] = useState<'problem' | 'doubts'>('problem');
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(() => speechEngine.getState());

  useEffect(() => {
    return speechEngine.subscribe(setPlaybackState);
  }, []);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

  // Timer
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // When problem or language changes, reset code & hints
  useEffect(() => {
    setCode(activeProblem.starterCode[language] || '');
    setUnlockedHintLevel(0);
    setAiHints({});
    setEvaluationResult(null);
    setSeconds(0);
    setIsTimerRunning(true);
  }, [activeProblem.id, language]);

  // Stopwatch
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUnlockNextHint = async () => {
    if (unlockedHintLevel >= 5 || isFetchingHint) return;
    const nextLevel = unlockedHintLevel + 1;
    setIsFetchingHint(true);

    try {
      const hint = await getProgressiveHint({
        problemTitle: activeProblem.title,
        problemDescription: activeProblem.description,
        userCode: code,
        hintLevel: nextLevel,
        tone: userProfile.tutorTone,
      });

      setAiHints(prev => ({ ...prev, [nextLevel]: hint }));
      setUnlockedHintLevel(nextLevel);
    } catch {
      const staticHint = activeProblem.progressiveHints[nextLevel - 1] || 'Focus on understanding the problem constraints.';
      setAiHints(prev => ({ ...prev, [nextLevel]: staticHint }));
      setUnlockedHintLevel(nextLevel);
    } finally {
      setIsFetchingHint(false);
    }
  };

  const handleRunEvaluation = async () => {
    if (isEvaluating || !code.trim()) return;
    setIsEvaluating(true);

    try {
      const review = await evaluateSolution({
        problemTitle: activeProblem.title,
        problemDescription: activeProblem.description,
        userCode: code,
        language,
        timeComplexityExpected: activeProblem.expectedComplexity.time,
        spaceComplexityExpected: activeProblem.expectedComplexity.space,
        tone: userProfile.tutorTone,
      });

      setEvaluationResult(review);
    } catch (err: any) {
      setEvaluationResult(`Evaluation failed: ${err?.message || 'Could not verify solution.'}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleMarkSolved = () => {
    setIsTimerRunning(false);
    recordSolvedProblem(
      activeProblem.id,
      activeProblem.title,
      activeProblem.difficulty,
      activeProblem.topicId,
      seconds,
      activeMode
    );
    triggerConfetti();
  };

  const isSolvedAlready = userProfile.solvedProblems.some(p => p.problemId === activeProblem.id);

  return (
    <div className="space-y-4 pb-12 transition-colors duration-200">
      {/* Top Problem Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase text-orange-600 dark:text-orange-400">
            Problem:
          </span>
          
          <select
            value={activeProblem.id}
            onChange={e => setSelectedProblemId(e.target.value)}
            className="bg-zinc-50 dark:bg-[#0c0d0e] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 shadow-sm"
          >
            {PRACTICE_PROBLEMS.map(p => (
              <option key={p.id} value={p.id}>
                [{p.difficulty.toUpperCase()}] {p.title} ({p.topicName})
              </option>
            ))}
          </select>

          <span className="text-xs font-mono capitalize text-zinc-500">
            {activeProblem.difficulty} · {activeProblem.topicName}
          </span>

          {isSolvedAlready && (
            <span className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Solved
            </span>
          )}
        </div>

        {/* Stopwatch & Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-[#0c0d0e] border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <button
            onClick={handleMarkSolved}
            id="btn-mark-problem-solved"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold transition-colors shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark Solved</span>
          </button>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Problem Description, Hints Ladder OR Doubts Area (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Left Panel Segmented Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setLeftTab('problem')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all flex-1 justify-center ${
                leftTab === 'problem'
                  ? 'bg-orange-600 text-white font-bold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Problem & Hints</span>
            </button>

            <button
              onClick={() => setLeftTab('doubts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all flex-1 justify-center ${
                leftTab === 'doubts'
                  ? 'bg-orange-600 text-white font-bold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Doubts Area</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold">
                TTS Voice
              </span>
            </button>
          </div>

          {leftTab === 'doubts' ? (
            <GnaniDoubtsArea
              contextProblemTitle={activeProblem.title}
              contextCode={code}
              contextLanguage={language}
              compact={false}
            />
          ) : (
            <>
              {/* Problem Details Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
                <span>{activeProblem.topicName}</span>
                <span>Expected: {activeProblem.expectedComplexity.time}</span>
              </div>
              <h2 className="text-xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">
                {activeProblem.title}
              </h2>
            </div>

            <div className="prose dark:prose-invert prose-sm max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3 font-sans">
              <Markdown>{activeProblem.description}</Markdown>
            </div>

            {/* Examples */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase text-orange-600 dark:text-orange-400">
                Examples
              </span>
              {activeProblem.examples.map((ex, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#0c0d0e] border border-zinc-200 dark:border-zinc-800 text-xs font-mono space-y-1">
                  <div>
                    <span className="text-zinc-500">Input: </span>
                    <span className="text-zinc-800 dark:text-zinc-200">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Output: </span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200 dark:border-zinc-800">
                      Note: {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500">Constraints</span>
              <ul className="text-xs font-mono text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
                {activeProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Progressive Hint Ladder Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-4 h-4 text-orange-500" />
                <span>Progressive Hint Ladder</span>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {unlockedHintLevel}/5 Unlocked
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Unlock progressive hints layer-by-layer without revealing the whole answer:
            </p>

            {/* Unlocked Hints List */}
            <div className="space-y-2.5">
              {Array.from({ length: unlockedHintLevel }).map((_, idx) => {
                const lvl = idx + 1;
                const hintContent = aiHints[lvl] || activeProblem.progressiveHints[idx] || 'Clue loading...';
                const isSpeakingHint = playbackState.speakingMessageId === `hint-${lvl}` && playbackState.isPlaying;

                return (
                  <div
                    key={lvl}
                    className="p-3.5 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400">
                        Hint Level {lvl}
                      </span>
                      <button
                        onClick={() => {
                          speechEngine.unlockAudio();
                          if (isSpeakingHint) {
                            speechEngine.interrupt();
                          } else {
                            void speechEngine.speakText(hintContent, 'energetic', `hint-${lvl}`);
                          }
                        }}
                        className="flex items-center gap-1 text-[10px] font-mono text-orange-600 dark:text-orange-400 hover:text-orange-500"
                        title="Hear this hint aloud"
                      >
                        {isSpeakingHint ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeakingHint ? 'Stop' : 'Speak'}</span>
                      </button>
                    </div>
                    <div>{hintContent}</div>
                  </div>
                );
              })}
            </div>

            {/* Unlock Next Hint Button */}
            {unlockedHintLevel < 5 && (
              <button
                onClick={handleUnlockNextHint}
                id="btn-unlock-hint"
                disabled={isFetchingHint}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold border border-zinc-300 dark:border-zinc-700 transition-colors disabled:opacity-50"
              >
                <span>
                  {isFetchingHint ? 'Preparing clue...' : `Unlock Hint ${unlockedHintLevel + 1}`}
                </span>
                <ChevronRight className="w-4 h-4 text-orange-500" />
              </button>
            )}

            {unlockedHintLevel === 5 && (
              <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40 text-xs text-zinc-800 dark:text-zinc-200 space-y-2">
                <div className="font-mono text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400">
                  Optimal Solution Walkthrough
                </div>
                <div className="prose dark:prose-invert prose-xs">
                  <Markdown>{activeProblem.solutionExplanation}</Markdown>
                </div>
              </div>
            )}
          </div>
          </>
          )}
        </div>

        {/* Right Column: Monaco Code Editor & Solution Review (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-3">
            <MonacoCodeEditor
              initialCode={code}
              language={language}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              height="440px"
              starterCode={activeProblem.starterCode[language] || ''}
              problemTitle={activeProblem.title}
              testCases={activeProblem.examples.map(ex => ({
                input: ex.input,
                expected: ex.output,
                explanation: ex.explanation,
              }))}
            />

            {/* Code Review Trigger Bar */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-sm">
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                Ready for Big-O analysis and edge case audit?
              </span>

              <button
                onClick={handleRunEvaluation}
                id="btn-evaluate-solution"
                disabled={isEvaluating || !code.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition-all shadow-sm disabled:opacity-40"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isEvaluating ? 'Auditing Solution...' : 'Code Review & Big-O'}</span>
              </button>
            </div>
          </div>

          {/* AI Code Review & Evaluation Output Box */}
          {evaluationResult && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase">
                  <Terminal className="w-4 h-4" />
                  <span>Code Review & Big-O Derivation</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      speechEngine.unlockAudio();
                      if (playbackState.speakingMessageId === 'eval-result' && (playbackState.isPlaying || playbackState.isLoadingAudio)) {
                        speechEngine.interrupt();
                      } else {
                        void speechEngine.speakText(evaluationResult, 'energetic', 'eval-result');
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 hover:bg-orange-100 transition-colors"
                  >
                    {playbackState.speakingMessageId === 'eval-result' && playbackState.isLoadingAudio ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                        <span>Synthesizing...</span>
                      </>
                    ) : playbackState.speakingMessageId === 'eval-result' && playbackState.isPlaying ? (
                      <>
                        <Square className="w-3 h-3 fill-current text-orange-500" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-orange-500" />
                        <span>Listen to Review</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setEvaluationResult(null)}
                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              <div className="prose dark:prose-invert prose-sm max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans space-y-3">
                <Markdown>{evaluationResult}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
