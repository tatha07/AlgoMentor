import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DSA_TOPICS } from '../../data/dsaTopics';
import { ARCHETYPE_PROFILES, FIVE_DAY_CURRICULUM } from '../../data/fiveDayJourneyData';
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
  ShieldAlert,
  Compass,
  Crown,
  Trophy,
  Lock
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    userProfile, 
    setActiveTab, 
    setSelectedTopicId, 
    setSelectedProblemId, 
    startAssessment 
  } = useApp();

  const { currentUser, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const currentArchetype = userProfile.coderArchetype || 'intermediate';
  const archetypeInfo = ARCHETYPE_PROFILES[currentArchetype];
  const journey = userProfile.fiveDayJourney;
  const currentDay = journey?.currentDay || 1;
  const currentDayData = FIVE_DAY_CURRICULUM.find(d => d.day === currentDay) || FIVE_DAY_CURRICULUM[0];
  const completedDaysCount = Object.values(journey?.days || {}).filter(d => d.completed).length;

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
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Guest Mode Status Banner */}
      {!currentUser && (
        <div className="p-3.5 px-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-700 dark:text-zinc-300 font-mono">
              <strong className="text-zinc-900 dark:text-white">Guest Mode Active:</strong> Your 5-day journey, solved problems, and achievement badges are tracking locally.
            </span>
          </div>
          <button
            onClick={() => {
              setAuthModalMode('signup');
              setIsAuthModalOpen(true);
            }}
            id="btn-dash-guest-sync"
            className="shrink-0 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Sync with Cloud</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Welcome & Persona Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-slate-100 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded border ${archetypeInfo.badgeColor}`}>
                {archetypeInfo.title}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Tone: {userProfile.tutorTone === 'savage' ? '🌶️ Savage Senior Dev' : 'Balanced Senior Dev'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Ready to master DSA, <span className="text-indigo-600 dark:text-indigo-400">{userProfile.name.split(' ')[0]}</span>?
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              "Stop memorizing solutions. Start recognizing invariants, memory models, and algorithmic patterns."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('journey')}
              id="btn-dash-open-journey"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-mono text-xs font-bold shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity"
            >
              <Compass className="w-4 h-4 text-indigo-200" />
              <span>5-Day Journey</span>
            </button>
            {!userProfile.assessmentResult && (
              <button
                onClick={startAssessment}
                id="btn-dash-assessment"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white font-mono text-xs font-semibold border border-zinc-200 dark:border-zinc-800 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Quiz</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('chat')}
              id="btn-dash-ask-tutor"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white font-mono text-xs font-semibold border border-zinc-200 dark:border-zinc-800 transition-colors shadow-sm"
            >
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Ask Senior Dev</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Day Coder Journey Calibration Widget */}
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                5-Day Journey Archetype Calibration
              </span>
              <span className="text-xs text-zinc-400 font-mono">• Day {currentDay} active</span>
            </div>
            <h2 className="text-lg font-bold font-mono text-zinc-900 dark:text-white flex items-center gap-2">
              <span>Current Archetype:</span>
              <span className={`bg-gradient-to-r ${archetypeInfo.gradient} bg-clip-text text-transparent`}>
                {archetypeInfo.title}
              </span>
              <span className="text-xs text-zinc-400 font-normal">({journey?.overallScore || 50}/100)</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
              {archetypeInfo.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>{completedDaysCount}/5 Days Verified</span>
            </div>
            <button
              onClick={() => setActiveTab('journey')}
              id="btn-dash-jump-journey"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-semibold border border-indigo-200 dark:border-indigo-500/30 transition-colors"
            >
              <span>Explore 5-Day Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Day Progress Bar */}
        <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          {FIVE_DAY_CURRICULUM.map(d => {
            const isDone = !!journey?.days[d.day]?.completed;
            const isCurrent = currentDay === d.day;
            return (
              <button
                key={d.day}
                onClick={() => setActiveTab('journey')}
                className={`p-2 rounded-lg text-left transition-all border ${
                  isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : isCurrent
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                    : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                }`}
              >
                <div className="text-[10px] font-mono font-bold flex items-center justify-between">
                  <span>Day {d.day}</span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </div>
                <div className="text-[10px] truncate mt-0.5">{d.theme.split('&')[0]}</div>
              </button>
            );
          })}
        </div>

        {/* 5-Day Badges Quick Showcase */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Module Achievement Badges:
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {userProfile.earnedBadges?.filter(b => b.unlocked).length || 0} / {userProfile.earnedBadges?.length || 9} Unlocked
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-1.5 overflow-hidden">
              {userProfile.earnedBadges?.map(b => (
                <div
                  key={b.id}
                  title={`${b.title} (${b.unlocked ? 'Unlocked' : 'Locked'})`}
                  className={`w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold shadow-xs ${
                    b.unlocked
                      ? b.tier === 'diamond'
                        ? 'bg-purple-500 text-white'
                        : b.tier === 'gold'
                        ? 'bg-amber-500 text-white'
                        : b.tier === 'silver'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-emerald-500 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {b.unlocked ? <Award className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('achievements')}
              id="btn-dash-view-all-badges"
              className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-1 cursor-pointer"
            >
              View Badges →
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row: 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-amber-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase font-semibold">Active Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white flex items-baseline gap-1.5">
            {userProfile.streakDays}
            <span className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-normal">days straight</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Keep solving daily to maintain momentum.</p>
        </div>

        {/* Metric 2: Curriculum Mastery */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase font-semibold">Curriculum</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white flex items-baseline gap-1.5">
            {overallTrackProgress}%
            <span className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-normal">({completedTopicsCount}/{totalTopics} topics)</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallTrackProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Problems Solved */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-sky-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase font-semibold">Problems Solved</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white flex items-baseline gap-1.5">
            {userProfile.solvedProblems.length}
            <span className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-normal">verified</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono mt-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{easyCount}E</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{mediumCount}M</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">{hardCount}H</span>
          </div>
        </div>

        {/* Metric 4: Daily Target */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-violet-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase font-semibold">Daily Mission</span>
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white flex items-baseline gap-1.5">
            {Math.min(userProfile.dailyGoalProblems, userProfile.solvedProblems.length % (userProfile.dailyGoalProblems + 1))}
            <span className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-normal">/ {userProfile.dailyGoalProblems} problems</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Goal reset daily.</p>
        </div>
      </div>

      {/* Main Grid: Next Topic & Growth Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Topic Spotlight (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                Recommended Next Step
              </span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase border border-zinc-200 dark:border-zinc-700/50">
              {nextTopic.trackLevel}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-500 transition-colors">
              {nextTopic.title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {nextTopic.description}
            </p>
          </div>

          {/* Key Invariants / Patterns */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500">Time: </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{nextTopic.timeComplexity.average}</span>
            </div>
            <div>
              <span className="text-zinc-500">Space: </span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold">{nextTopic.spaceComplexity.worst}</span>
            </div>
            <div>
              <span className="text-zinc-500">Patterns: </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {nextTopic.patterns.slice(0, 2).map(p => p.name).join(', ')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Category: {nextTopic.category} • {Object.keys(nextTopic.codeSnippets).length} languages
            </span>
            <button
              onClick={() => handleStartNextTopic(nextTopic.id)}
              id="btn-start-next-topic"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors shadow-sm shadow-indigo-500/20"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Growth & Weaknesses Card (1 Col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Target Weak Points</span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Identified by your diagnostic quiz and recent practice logs:
          </p>

          <div className="space-y-2">
            {userProfile.weakTopics.length > 0 ? (
              userProfile.weakTopics.map((wt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 text-xs"
                >
                  <span className="font-mono text-zinc-800 dark:text-zinc-300">{wt}</span>
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Practice →
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-500 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 text-center font-mono">
                No weak points flagged yet!
              </div>
            )}
          </div>

          {userProfile.strongTopics.length > 0 && (
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-mono uppercase text-zinc-500 dark:text-zinc-400 block mb-2 font-semibold">
                Strengths Mastered
              </span>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.strongTopics.map((st, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
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
        <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold mb-3">
          Specialized Workspaces
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('chat')}
            id="launchpad-tutor"
            className="p-5 text-left rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-zinc-900/90 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-indigo-200 dark:border-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              AI Senior Tutor
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Ask any DSA question, get roasts for bad ideas, and master intuition.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            id="launchpad-practice"
            className="p-5 text-left rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-sky-400 dark:hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-zinc-900/90 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-sky-200 dark:border-sky-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Practice Arena
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Progressive hints, starter code in 4 languages, and AI code review.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('collab')}
            id="launchpad-collab"
            className="p-5 text-left rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-slate-50 dark:hover:bg-zinc-900/90 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-violet-200 dark:border-violet-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              Study Rooms
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Live peer coding sessions with real-time Monaco editor sync.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('code-explainer')}
            id="launchpad-explainer"
            className="p-5 text-left rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-zinc-900/90 transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-200 dark:border-amber-500/20">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Explain My Code
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Paste messy code for line-by-line breakdown, Big-O, and edge bug fixes.
            </p>
          </button>
        </div>
      </div>

      {/* Recent Solved Activity */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">
              Recent Problem Activity
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('practice')}
            className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Explore All Problems →
          </button>
        </div>

        {userProfile.solvedProblems.length > 0 ? (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {userProfile.solvedProblems.slice(0, 5).map((p, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <h5 className="text-sm font-medium text-zinc-900 dark:text-white">{p.problemTitle}</h5>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                      Solved in ~{Math.round(p.timeSpentSeconds / 60)} mins • Mode: {p.mode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded ${
                      p.difficulty === 'easy'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : p.difficulty === 'medium'
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                    }`}
                  >
                    {p.difficulty}
                  </span>
                  <button
                    onClick={() => handlePracticeProblem(p.problemId)}
                    className="text-xs font-mono text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
                  >
                    Re-solve
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            No problems solved yet. Jump into the Practice Arena to get your first green check!
          </div>
        )}
      </div>
    </div>
  );
};
