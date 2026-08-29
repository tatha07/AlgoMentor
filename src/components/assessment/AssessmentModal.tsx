import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSESSMENT_QUESTIONS } from '../../data/assessmentQuestions';
import { AssessmentResult, DsaLevel } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Zap, 
  X,
  Target
} from 'lucide-react';

export const AssessmentModal: React.FC = () => {
  const { isAssessmentOpen, setIsAssessmentOpen, saveAssessmentResult } = useApp();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{
    questionId: string;
    topic: string;
    difficulty: string;
    isCorrect: boolean;
  }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResult, setFinalResult] = useState<AssessmentResult | null>(null);

  if (!isAssessmentOpen) return null;

  const currentQ = ASSESSMENT_QUESTIONS[currentIndex];
  const total = ASSESSMENT_QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex) / total) * 100);

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isAnswered) return;
    setIsAnswered(true);

    const chosenOption = currentQ.options.find(o => o.id === selectedOptionId);
    const isCorrect = !!chosenOption?.isCorrect;

    const updatedAnswers = [
      ...userAnswers,
      {
        questionId: currentQ.id,
        topic: currentQ.topic,
        difficulty: currentQ.difficulty,
        isCorrect,
      },
    ];
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex + 1 < total) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Calculate final results
      computeAndFinish(userAnswers);
    }
  };

  const computeAndFinish = (answers: typeof userAnswers) => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / total) * 100);

    let level: DsaLevel = 'newbie';
    let startingTopicId = 'arrays-and-strings';
    let startingTopicName = 'Arrays & Dynamic Arrays';
    const recommendations: string[] = [];

    if (score >= 80) {
      level = 'pro';
      startingTopicId = 'shortest-path-dijkstra';
      startingTopicName = 'Shortest Path (Dijkstra & Priority Queues)';
      recommendations.push('You demonstrated outstanding command of fundamental & intermediate DSA patterns.');
      recommendations.push('Target Hard Dynamic Programming state compressions, Dijkstra, and Segment Trees.');
      recommendations.push('Practice mock interviews with tight 25-minute constraints.');
    } else if (score >= 50) {
      level = 'intermediate';
      startingTopicId = 'graphs-bfs-dfs';
      startingTopicName = 'Graph Fundamentals & BFS/DFS Traversals';
      recommendations.push('Solid grasp of foundational arrays, binary search, and linked structures.');
      recommendations.push('Prioritize mastering Graph Flood Fill (BFS/DFS) and 1D Dynamic Programming memoization.');
      recommendations.push('Focus on pattern identification (Sliding Window & Monotonic Stacks).');
    } else {
      level = 'newbie';
      startingTopicId = 'arrays-and-strings';
      startingTopicName = 'Arrays & Dynamic Arrays';
      recommendations.push('Focus on core Big-O analysis and memory models before jumping into graphs.');
      recommendations.push('Master two-pointer techniques and hash map lookups to eliminate O(N^2) nested loops.');
      recommendations.push('Build strong visual intuition for binary search boundaries.');
    }

    // Strengths and Weaknesses
    const strengths = answers.filter(a => a.isCorrect).map(a => a.topic);
    const weaknesses = answers.filter(a => !a.isCorrect).map(a => a.topic);

    const result: AssessmentResult = {
      score,
      totalQuestions: total,
      level,
      strengths: Array.from(new Set(strengths)).slice(0, 4),
      weaknesses: Array.from(new Set(weaknesses)).slice(0, 4),
      recommendedStartingTopicId: startingTopicId,
      recommendedStartingTopicName: startingTopicName,
      recommendations,
      breakdown: answers.map(a => ({
        topic: a.topic,
        correct: a.isCorrect,
        difficulty: a.difficulty as any,
      })),
      date: new Date().toISOString(),
    };

    setFinalResult(result);
    setIsComplete(true);
  };

  const handleApplyCalibration = () => {
    if (finalResult) {
      saveAssessmentResult(finalResult);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setIsComplete(false);
    setFinalResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                {isComplete ? 'Diagnostic Calibration Complete' : 'AI DSA Level Diagnostic'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isComplete
                  ? 'Your personalized curriculum has been calibrated.'
                  : `Question ${currentIndex + 1} of ${total} • ${currentQ.topic}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAssessmentOpen(false)}
            id="btn-close-assessment"
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (during quiz) */}
        {!isComplete && (
          <div className="w-full bg-zinc-800 h-1">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Quiz Body */}
        {!isComplete ? (
          <div className="p-6 space-y-6">
            {/* Question */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                  {currentQ.difficulty}
                </span>
                <span className="text-xs text-indigo-400 font-mono">Testing: {currentQ.testedConcept}</span>
              </div>
              <h3 className="text-lg font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map(opt => {
                const isSelected = selectedOptionId === opt.id;
                let optStyle = 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/90 text-zinc-200';

                if (isAnswered) {
                  if (opt.isCorrect) {
                    optStyle = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-300 font-medium';
                  } else if (isSelected && !opt.isCorrect) {
                    optStyle = 'border-rose-500/80 bg-rose-500/10 text-rose-300';
                  } else {
                    optStyle = 'border-zinc-800/40 bg-zinc-950/40 text-zinc-500 opacity-60';
                  }
                } else if (isSelected) {
                  optStyle = 'border-indigo-500 bg-indigo-500/10 text-white font-medium ring-1 ring-indigo-500/50';
                }

                return (
                  <button
                    key={opt.id}
                    id={`opt-${currentQ.id}-${opt.id}`}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 ${optStyle}`}
                  >
                    <span className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 uppercase text-zinc-300">
                      {opt.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm">{opt.text}</p>
                      {isAnswered && (
                        <p className={`text-xs mt-2 pt-2 border-t border-zinc-800/60 ${opt.isCorrect ? 'text-emerald-400' : 'text-zinc-400'}`}>
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500 font-mono">
                {total - currentIndex - 1} questions remaining
              </span>
              <div className="flex items-center gap-3">
                {!isAnswered ? (
                  <button
                    onClick={handleConfirmAnswer}
                    id="btn-confirm-answer"
                    disabled={!selectedOptionId}
                    className="px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:pointer-events-none transition-colors font-mono border border-indigo-500/40"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    id="btn-next-question"
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-mono border border-indigo-500/40"
                  >
                    <span>{currentIndex + 1 < total ? 'Next Question' : 'View Calibration Report'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="p-6 space-y-6">
            {/* Top Score Banner */}
            <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-3">
              <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Assessed Skill Level</span>
                <h3 className="text-2xl font-bold text-white capitalize font-mono mt-0.5">
                  {finalResult?.level} Developer
                </h3>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm font-mono pt-1">
                <div className="px-3 py-1 bg-zinc-800 rounded-md text-indigo-400 font-bold border border-zinc-700">
                  Score: {finalResult?.score}%
                </div>
                <div className="px-3 py-1 bg-zinc-800 rounded-md text-zinc-300 border border-zinc-700">
                  {userAnswers.filter(a => a.isCorrect).length}/{total} Correct
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Identified Strengths</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {finalResult?.strengths.length ? (
                    finalResult.strengths.map((s, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500">Fundamental building blocks to review.</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase mb-2">
                  <Target className="w-4 h-4" />
                  <span>Target Growth Areas</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {finalResult?.weaknesses.length ? (
                    finalResult.weaknesses.map((w, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                        {w}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500">No major weaknesses detected!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Starting Point */}
            <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-800/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-indigo-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>Recommended Starting Point</span>
              </div>
              <h4 className="text-sm font-semibold text-white">
                {finalResult?.recommendedStartingTopicName}
              </h4>
              <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                {finalResult?.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                onClick={handleRestart}
                id="btn-restart-assessment"
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={handleApplyCalibration}
                id="btn-apply-calibration"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono shadow-md shadow-indigo-600/20 transition-colors border border-indigo-500/40"
              >
                <span>Apply Calibration & Start Track</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
