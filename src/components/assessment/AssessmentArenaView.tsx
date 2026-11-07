import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ASSESSMENT_QUESTIONS } from '../../data/assessmentQuestions';
import { AssessmentResult, DsaLevel } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Zap, 
  Target, 
  Clock, 
  BarChart3,
  Check,
  ChevronRight
} from 'lucide-react';

export const AssessmentArenaView: React.FC = () => {
  const { userProfile, saveAssessmentResult, triggerConfetti } = useApp();

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
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');

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

  const handleNextQuestion = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Calculate assessment result
      const correctCount = userAnswers.filter(a => a.isCorrect).length;
      const scorePct = Math.round((correctCount / total) * 100);

      let assessedLevel: DsaLevel = 'intermediate';
      if (scorePct >= 80) assessedLevel = 'pro';
      else if (scorePct < 45) assessedLevel = 'newbie';

      const topicStats: Record<string, { total: number; correct: number }> = {};
      userAnswers.forEach(a => {
        if (!topicStats[a.topic]) topicStats[a.topic] = { total: 0, correct: 0 };
        topicStats[a.topic].total += 1;
        if (a.isCorrect) topicStats[a.topic].correct += 1;
      });

      const strengths: string[] = [];
      const weaknesses: string[] = [];
      Object.entries(topicStats).forEach(([top, stats]) => {
        if (stats.correct === stats.total) strengths.push(top);
        else if (stats.correct === 0) weaknesses.push(top);
      });

      const result: AssessmentResult = {
        score: scorePct,
        totalQuestions: total,
        level: assessedLevel,
        strengths: strengths.length > 0 ? strengths : ['Core Foundations'],
        weaknesses: weaknesses.length > 0 ? weaknesses : ['Dynamic Programming Optimizations'],
        recommendedStartingTopicId: weaknesses[0]?.toLowerCase().replace(/\s+/g, '-') || 'arrays-two-pointers',
        recommendedStartingTopicName: weaknesses[0] || 'Arrays & Two Pointers',
        recommendations: [
          assessedLevel === 'pro'
            ? 'Practice hard dynamic programming and complex graph algorithms.'
            : assessedLevel === 'newbie'
            ? 'Focus on linear data structures, pointer mechanics, and Big-O basics.'
            : 'Focus on recursion trees, tree traversals, and heap patterns.',
        ],
        breakdown: userAnswers.map(a => ({
          topic: a.topic,
          correct: a.isCorrect,
          difficulty: a.difficulty,
        })),
        date: new Date().toISOString(),
      };

      setFinalResult(result);
      setIsComplete(true);
      saveAssessmentResult(result);
      triggerConfetti();
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setIsComplete(false);
    setFinalResult(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Diagnostic Arena
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">·</span>
            <span className="text-xs font-mono text-zinc-500">
              {total} Calibrated Questions
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-white">
            DSA Skill Assessment
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Evaluate your knowledge of time complexity, data structures, recursion, and graph invariants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono text-zinc-400 block">Current Level</span>
            <span className="text-sm font-mono font-bold uppercase text-orange-600 dark:text-orange-400">
              {userProfile.level} Coder
            </span>
          </div>
          <button
            onClick={handleRetake}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Test</span>
          </button>
        </div>
      </div>

      {!isComplete ? (
        /* Question Card */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Question {currentIndex + 1} of {total}</span>
              <span className="capitalize">{currentQ.topic} · {currentQ.difficulty}</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              {currentQ.question}
            </h3>

            {currentQ.codeSnippet && (
              <pre className="p-4 bg-zinc-950 rounded-xl text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map(opt => {
              const isSelected = selectedOptionId === opt.id;
              let optionStyle = 'bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 hover:border-orange-400 text-zinc-800 dark:text-zinc-200';

              if (isAnswered) {
                if (opt.isCorrect) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-900 dark:text-rose-200';
                } else {
                  optionStyle = 'opacity-40 border-zinc-200 dark:border-zinc-800';
                }
              } else if (isSelected) {
                optionStyle = 'bg-orange-50 dark:bg-orange-950/30 border-orange-500 text-orange-900 dark:text-orange-200 font-medium shadow-sm';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${optionStyle}`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border ${
                    isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-zinc-300 dark:border-zinc-700 text-zinc-400'
                  }`}>
                    {opt.id.toUpperCase()}
                  </div>
                  <div className="flex-1 text-sm font-sans">
                    {opt.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation if Answered */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5 animate-in fade-in">
              <span className="text-xs font-mono font-bold uppercase text-orange-600 dark:text-orange-400">
                Explanation & Analysis
              </span>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {currentQ.options.find(o => o.isCorrect)?.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-zinc-400">
              Concept: {currentQ.testedConcept}
            </span>

            {!isAnswered ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedOptionId}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white transition-colors shadow-sm"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-orange-600 hover:bg-orange-500 text-white transition-colors shadow-sm"
              >
                <span>{currentIndex < total - 1 ? 'Next Question' : 'Complete Assessment'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
              Assessment Completed!
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Your algorithmic proficiency has been calibrated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 block mb-1">Score</span>
              <span className="text-3xl font-mono font-bold text-orange-600 dark:text-orange-400">
                {finalResult?.score}%
              </span>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 block mb-1">Assessed Level</span>
              <span className="text-3xl font-mono font-bold capitalize text-zinc-900 dark:text-white">
                {finalResult?.level}
              </span>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 block mb-1">Accuracy</span>
              <span className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {userAnswers.filter(a => a.isCorrect).length}/{total}
              </span>
            </div>
          </div>

          {/* Topic Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono font-bold text-zinc-900 dark:text-white">
              Topic Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {finalResult?.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 capitalize">{item.topic}</span>
                  <div className="flex items-center gap-1.5">
                    {item.correct ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleRetake}
              className="px-6 py-3 rounded-xl font-mono font-bold text-sm bg-orange-600 hover:bg-orange-500 text-white transition-colors shadow-sm"
            >
              Take Another Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
