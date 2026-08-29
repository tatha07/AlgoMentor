import React from 'react';
import { useApp } from '../../context/AppContext';
import { DSA_TOPICS } from '../../data/dsaTopics';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Code2, 
  Bot, 
  Users, 
  FileCode2, 
  Zap, 
  Award, 
  Clock,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    userProfile, 
    setActiveTab, 
    setSelectedTopicId, 
    setSelectedProblemId, 
    startAssessment 
  } = useApp();

  const totalTopics = DSA_TOPICS.length;
  const completedTopicsCount = userProfile.completedTopicIds.length;
  const overallTrackProgress = Math.round((completedTopicsCount / totalTopics) * 100);

  // Difficulty counts of solved problems
  const easyCount = userProfile.solvedProblems.filter(p => p.difficulty === 'easy').length;
  const mediumCount = userProfile.solvedProblems.filter(p => p.difficulty === 'medium').length;
  const hardCount = userProfile.solvedProblems.filter(p => p.difficulty === 'hard').length;

  // Next topic recommendation
  const nextTopic = DSA_TOPICS.find(t => !userProfile.completedTopicIds.includes(t.id)) || DSA_TOPICS[0];

  const handleStartNextTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('tracks');
  };

  const handlePracticeProblem = (problemId: string) => {
    setSelectedProblemId(problemId);
    setActiveTab('practice');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Persona Banner */}
      <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                {userProfile.level} Track
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Tone: {userProfile.tutorTone === 'savage' ? '🌶️ Savage Senior Dev' : 'Balanced Senior Dev'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Ready to crush DSA, <span className="text-indigo-400">{userProfile.name.split(' ')[0]}</span>?
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              "Stop memorizing solutions. Start recognizing invariants, memory models, and algorithmic patterns."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!userProfile.assessmentResult && (
              <button
                onClick={startAssessment}
                id="btn-dash-assessment"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-mono text-xs font-bold shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity border border-indigo-500/30"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Take Diagnostic Test</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('chat')}
              id="btn-dash-ask-tutor"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-semibold border border-zinc-800 transition-colors"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Ask Senior Dev</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row: 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Streak */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">Active Streak</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
            {userProfile.streakDays}
            <span className="text-xs font-sans text-zinc-400 font-normal">days straight</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Keep solving daily to maintain momentum.</p>
        </div>

        {/* Metric 2: Curriculum Mastery */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">Curriculum</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
            {overallTrackProgress}%
            <span className="text-xs font-sans text-zinc-400 font-normal">({completedTopicsCount}/{totalTopics} topics)</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallTrackProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Problems Solved */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">Problems Solved</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
            {userProfile.solvedProblems.length}
            <span className="text-xs font-sans text-zinc-400 font-normal">verified</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono mt-2">
            <span className="text-emerald-400">{easyCount}E</span>
            <span className="text-amber-400">{mediumCount}M</span>
            <span className="text-rose-400">{hardCount}H</span>
          </div>
        </div>

        {/* Metric 4: Daily Target */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">Daily Mission</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
            {Math.min(userProfile.dailyGoalProblems, userProfile.solvedProblems.length % (userProfile.dailyGoalProblems + 1))}
            <span className="text-xs font-sans text-zinc-400 font-normal">/ {userProfile.dailyGoalProblems} problems</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Goal reset in ~14h.</p>
        </div>
      </div>

      {/* Main Grid: Next Topic & Growth Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Topic Spotlight (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                Recommended Next Step
              </span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase border border-zinc-700/50">
              {nextTopic.trackLevel}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              {nextTopic.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {nextTopic.description}
            </p>
          </div>

          {/* Key Invariants / Patterns */}
          <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500">Time: </span>
              <span className="text-indigo-400 font-semibold">{nextTopic.timeComplexity.average}</span>
            </div>
            <div>
              <span className="text-zinc-500">Space: </span>
              <span className="text-sky-400 font-semibold">{nextTopic.spaceComplexity.worst}</span>
            </div>
            <div>
              <span className="text-zinc-500">Patterns: </span>
              <span className="text-zinc-300">
                {nextTopic.patterns.slice(0, 2).map(p => p.name).join(', ')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-400 font-mono">
              Category: {nextTopic.category} • {Object.keys(nextTopic.codeSnippets).length} languages
            </span>
            <button
              onClick={() => handleStartNextTopic(nextTopic.id)}
              id="btn-start-next-topic"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors shadow-sm shadow-indigo-500/20 border border-indigo-500/40"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Growth & Weaknesses Card (1 Col) */}
        <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Target Weak Points</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Identified by your diagnostic quiz and recent practice logs:
          </p>

          <div className="space-y-2">
            {userProfile.weakTopics.length > 0 ? (
              userProfile.weakTopics.map((wt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs"
                >
                  <span className="font-mono text-zinc-300">{wt}</span>
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="text-[11px] font-mono text-indigo-400 hover:underline"
                  >
                    Practice →
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-500 p-3 rounded-lg bg-zinc-950/40 text-center font-mono">
                No weak points flagged yet!
              </div>
            )}
          </div>

          {userProfile.strongTopics.length > 0 && (
            <div className="pt-3 border-t border-zinc-800">
              <span className="text-[11px] font-mono uppercase text-zinc-500 block mb-2 font-semibold">
                Strengths Mastered
              </span>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.strongTopics.map((st, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    ✓ {st}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Launchpad Cards */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-3">
          Specialized Workspaces
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('chat')}
            id="launchpad-tutor"
            className="p-5 text-left rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900/90 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
              AI Senior Tutor
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Ask any DSA question, get roasts for bad ideas, and master intuition.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            id="launchpad-practice"
            className="p-5 text-left rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-sky-500/50 hover:bg-zinc-900/90 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-sky-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
              Practice Arena
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Progressive hints, starter code in 4 languages, and AI code review.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            id="launchpad-interview"
            className="p-5 text-left rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-900/90 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-violet-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
              DSA Mock Interview
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Live timed technical interview with strict FAANG rubric scorecard.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('code-explainer')}
            id="launchpad-explainer"
            className="p-5 text-left rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/90 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-500/20">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
              Explain My Code
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Paste messy code for line-by-line breakdown, Big-O, and edge bug fixes.
            </p>
          </button>
        </div>
      </div>

      {/* Recent Solved Activity */}
      <div className="p-6 rounded-xl bg-zinc-900/70 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Recent Problem Activity
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('practice')}
            className="text-xs font-mono text-indigo-400 hover:underline"
          >
            Explore All Problems →
          </button>
        </div>

        {userProfile.solvedProblems.length > 0 ? (
          <div className="divide-y divide-zinc-800">
            {userProfile.solvedProblems.slice(0, 5).map((p, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between gap-4 hover:bg-zinc-800/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="text-sm font-medium text-white">{p.problemTitle}</h5>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Solved in ~{Math.round(p.timeSpentSeconds / 60)} mins • Mode: {p.mode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded ${
                      p.difficulty === 'easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : p.difficulty === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {p.difficulty}
                  </span>
                  <button
                    onClick={() => handlePracticeProblem(p.problemId)}
                    className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
                  >
                    Re-solve
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-zinc-500 font-mono">
            No problems solved yet. Jump into the Practice Arena to get your first green check!
          </div>
        )}
      </div>
    </div>
  );
};
