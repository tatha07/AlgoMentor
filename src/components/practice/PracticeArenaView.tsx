import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PRACTICE_PROBLEMS } from '../../data/practiceProblems';
import { PracticeProblem, PracticeMode, ProblemDifficulty } from '../../types';
import { getProgressiveHint, evaluateSolution } from '../../services/api';
import { MonacoCodeEditor } from '../common/MonacoCodeEditor';
import Markdown from 'react-markdown';
import { 
  Play, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Code2, 
  ChevronRight, 
  Copy, 
  Check, 
  Terminal, 
  Flame, 
  ArrowLeft,
  Lightbulb,
  Award
} from 'lucide-react';

export const PracticeArenaView: React.FC = () => {
  const { 
    userProfile, 
    selectedProblemId, 
    setSelectedProblemId, 
    recordSolvedProblem 
  } = useApp();

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active problem
  const activeProblem: PracticeProblem = 
    PRACTICE_PROBLEMS.find(p => p.id === selectedProblemId) || PRACTICE_PROBLEMS[0];

  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>(userProfile.preferredLanguage);
  const [code, setCode] = useState<string>(activeProblem.starterCode[userProfile.preferredLanguage] || '');
  const [activeMode, setActiveMode] = useState<PracticeMode>('solve');
  
  // Hints state
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [aiHints, setAiHints] = useState<Record<number, string>>({});
  const [isFetchingHint, setIsFetchingHint] = useState(false);

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
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredProblems = PRACTICE_PROBLEMS.filter(p => {
    const matchesDiff = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.topicName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  const handleUnlockNextHint = async () => {
    const nextLevel = unlockedHintLevel + 1;
    if (nextLevel > 5 || isFetchingHint) return;

    setIsFetchingHint(true);
    try {
      // Check if progressive hints dataset has it or call AI
      if (activeProblem.progressiveHints[nextLevel - 1] && nextLevel <= 4) {
        setAiHints(prev => ({ ...prev, [nextLevel]: activeProblem.progressiveHints[nextLevel - 1] }));
      } else {
        const hintText = await getProgressiveHint({
          problemTitle: activeProblem.title,
          problemDescription: activeProblem.description,
          userCode: code,
          hintLevel: nextLevel,
        });
        setAiHints(prev => ({ ...prev, [nextLevel]: hintText }));
      }
      setUnlockedHintLevel(nextLevel);
    } catch (e: any) {
      setAiHints(prev => ({
        ...prev,
        [nextLevel]: `⚠️ Could not fetch AI hint: ${e.message}`,
      }));
      setUnlockedHintLevel(nextLevel);
    } finally {
      setIsFetchingHint(false);
    }
  };

  const handleRunEvaluation = async () => {
    if (!code.trim() || isEvaluating) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const evaluation = await evaluateSolution({
        problemTitle: activeProblem.title,
        problemDescription: activeProblem.description,
        userCode: code,
        language,
      });
      setEvaluationResult(evaluation);
    } catch (e: any) {
      setEvaluationResult(`⚠️ Evaluation failed: ${e.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleMarkSolved = () => {
    recordSolvedProblem(
      activeProblem.id,
      activeProblem.title,
      activeProblem.difficulty,
      activeProblem.topicId,
      seconds,
      activeMode
    );
  };

  const isSolvedAlready = userProfile.solvedProblems.some(p => p.problemId === activeProblem.id);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Problem Selector Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase text-zinc-500">Problem:</span>
          
          <select
            value={activeProblem.id}
            onChange={e => setSelectedProblemId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-white text-xs font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            {PRACTICE_PROBLEMS.map(p => (
              <option key={p.id} value={p.id}>
                [{p.difficulty.toUpperCase()}] {p.title} ({p.topicName})
              </option>
            ))}
          </select>

          <span
            className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${
              activeProblem.difficulty === 'easy'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : activeProblem.difficulty === 'medium'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {activeProblem.difficulty}
          </span>

          {isSolvedAlready && (
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" /> Solved
            </span>
          )}
        </div>

        {/* Stopwatch & Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <button
            onClick={handleMarkSolved}
            id="btn-mark-problem-solved"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-colors shadow-sm shadow-indigo-600/20 border border-indigo-500/40"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark Solved</span>
          </button>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Problem Description, Hints Ladder, Invariants (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Problem Details Card */}
          <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
                <span>{activeProblem.topicName}</span>
                <span>Expected: {activeProblem.expectedComplexity.time}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {activeProblem.title}
              </h2>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed space-y-3">
              <div className="markdown-body">
                <Markdown>{activeProblem.description}</Markdown>
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500">Examples</span>
              {activeProblem.examples.map((ex, i) => (
                <div key={i} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-1">
                  <div>
                    <span className="text-zinc-500">Input: </span>
                    <span className="text-zinc-200">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Output: </span>
                    <span className="text-indigo-400 font-bold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-900">
                      Note: {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <span className="text-xs font-mono font-bold uppercase text-zinc-500">Constraints</span>
              <ul className="text-xs font-mono text-zinc-400 space-y-1 list-disc list-inside">
                {activeProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Progressive Hint Ladder Card */}
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>Progressive Hint Ladder</span>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {unlockedHintLevel}/5 Unlocked
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Don't spoil the whole answer at once. Unlock progressive clues layer-by-layer:
            </p>

            {/* Unlocked Hints List */}
            <div className="space-y-2.5">
              {Array.from({ length: unlockedHintLevel }).map((_, idx) => {
                const lvl = idx + 1;
                const hintContent = aiHints[lvl] || activeProblem.progressiveHints[idx] || 'Clue loading...';
                return (
                  <div
                    key={lvl}
                    className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 leading-relaxed font-sans space-y-1"
                  >
                    <div className="font-mono text-[10px] font-bold uppercase text-amber-400">
                      Hint Level {lvl}
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
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-semibold border border-zinc-700 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isFetchingHint ? 'Senior Dev thinking...' : `Unlock Hint ${unlockedHintLevel + 1}`}
                </span>
              </button>
            )}

            {unlockedHintLevel === 5 && (
              <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs text-zinc-200 space-y-2">
                <div className="font-mono text-[10px] font-bold uppercase text-indigo-400">
                  Full Optimal Solution Walkthrough
                </div>
                <div className="prose prose-invert prose-xs">
                  <div className="markdown-body">
                    <Markdown>{activeProblem.solutionExplanation}</Markdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Monaco Code Editor & AI Evaluation (7 Cols) */}
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

            {/* AI Senior Code Review Trigger Bar */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
              <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Want in-depth Big-O analysis and edge case audit?</span>
              </div>

              <button
                onClick={handleRunEvaluation}
                id="btn-evaluate-solution"
                disabled={isEvaluating || !code.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-sm shadow-indigo-600/20 border border-indigo-500/40 disabled:opacity-40"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isEvaluating ? 'Auditing Solution...' : 'Senior Dev Code Review'}</span>
              </button>
            </div>
          </div>

          {/* AI Code Review & Evaluation Output Box */}
          {evaluationResult && (
            <div className="p-6 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
                  <Terminal className="w-4 h-4" />
                  <span>Senior Developer Code Review & Big-O Breakdown</span>
                </div>
                <button
                  onClick={() => setEvaluationResult(null)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-zinc-200 leading-relaxed font-sans space-y-3">
                <div className="markdown-body">
                  <Markdown>{evaluationResult}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
