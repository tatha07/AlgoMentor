import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FIVE_DAY_CURRICULUM, 
  ARCHETYPE_PROFILES 
} from '../../data/fiveDayJourneyData';
import { CoderArchetype } from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Flame, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  RotateCcw,
  Target,
  BrainCircuit,
  Lock,
  Compass,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Trophy,
  Award,
  Database
} from 'lucide-react';

export const FiveDayJourneyView: React.FC = () => {
  const { 
    userProfile, 
    advanceJourneyDay, 
    setJourneyArchetype, 
    resetJourney,
    setActiveTab, 
    setSelectedProblemId 
  } = useApp();

  const journey = userProfile.fiveDayJourney;
  const currentArchetype = userProfile.coderArchetype || journey?.assessedArchetype || 'intermediate';
  const archetypeData = ARCHETYPE_PROFILES[currentArchetype];

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(journey?.currentDay || 1);
  const [selfScore, setSelfScore] = useState<number>(85);

  const selectedDayInfo = FIVE_DAY_CURRICULUM.find(d => d.day === selectedDayNumber) || FIVE_DAY_CURRICULUM[0];
  const dayProgress = journey?.days[selectedDayNumber];
  const isCompleted = !!dayProgress?.completed;

  const completedDaysCount = Object.values(journey?.days || {}).filter(d => d.completed).length;

  const handleLaunchProblem = (problemId: string) => {
    setSelectedProblemId(problemId);
    setActiveTab('practice');
  };

  const handleCompleteCurrentDay = () => {
    advanceJourneyDay(selectedDayNumber, selfScore);
  };

  return (
    <div className="space-y-8 pb-16 transition-colors duration-200">
      {/* Header & Archetype Identity Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-slate-100 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                5-Day Coder Journey Calibration
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Day {journey?.currentDay || 1} of 5 Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Coder Archetype:{' '}
                <span className={`bg-gradient-to-r ${archetypeData.gradient} bg-clip-text text-transparent`}>
                  {archetypeData.title}
                </span>
              </h1>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {archetypeData.description}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>{journey?.summary || archetypeData.tagline}</span>
            </div>
          </div>

          {/* Archetype Rating Score Card */}
          <div className="shrink-0 flex flex-col items-center justify-center p-5 rounded-xl bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 shadow-md min-w-[200px]">
            <div className="text-[11px] font-mono uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              Calibration Score
            </div>
            <div className="text-4xl font-extrabold font-mono text-zinc-900 dark:text-white my-1">
              {journey?.overallScore || 50}
              <span className="text-sm font-normal text-zinc-400">/100</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden my-2">
              <div 
                className={`h-full bg-gradient-to-r ${archetypeData.gradient} transition-all duration-500`}
                style={{ width: `${journey?.overallScore || 50}%` }}
              />
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${archetypeData.badgeColor}`}>
              {archetypeData.badgeLabel}
            </span>
          </div>
        </div>

        {/* Skill Dimensions Radar Bar */}
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-2.5 rounded-lg bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60">
            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Algorithmic Thinking</div>
            <div className="text-sm font-bold font-mono text-zinc-900 dark:text-white">
              {journey?.skills.algorithmicThinking || 55}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60">
            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Big-O Optimization</div>
            <div className="text-sm font-bold font-mono text-zinc-900 dark:text-white">
              {journey?.skills.bigOOptimization || 50}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60">
            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Data Structures</div>
            <div className="text-sm font-bold font-mono text-zinc-900 dark:text-white">
              {journey?.skills.dataStructures || 52}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60">
            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Edge Case Resilience</div>
            <div className="text-sm font-bold font-mono text-zinc-900 dark:text-white">
              {journey?.skills.edgeCaseMastery || 48}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60">
            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Problem Velocity</div>
            <div className="text-sm font-bold font-mono text-zinc-900 dark:text-white">
              {journey?.skills.problemVelocity || 50}%
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Interactive Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-mono text-zinc-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>5-Day Calibration Curriculum</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Complete each daily challenge to unlock your validated coder archetype.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetJourney}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Journey</span>
            </button>
          </div>
        </div>

        {/* Day Selector Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {FIVE_DAY_CURRICULUM.map(day => {
            const isDayCompleted = !!journey?.days[day.day]?.completed;
            const isCurrent = journey?.currentDay === day.day;
            const isSelected = selectedDayNumber === day.day;

            return (
              <button
                key={day.day}
                onClick={() => setSelectedDayNumber(day.day)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-300 dark:border-indigo-500/40 ring-2 ring-indigo-500/20 shadow-sm'
                    : isDayCompleted
                    ? 'bg-white dark:bg-zinc-900/80 border-emerald-300 dark:border-emerald-500/30'
                    : 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                    DAY {day.day}
                  </span>
                  {isDayCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                  {day.theme}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 flex items-center justify-between">
                  <span className="capitalize">{day.difficulty}</span>
                  {isDayCompleted && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Done</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Focus Workspace */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                Day {selectedDayInfo.day} Focus
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Target Archetype: {selectedDayInfo.archetypeFocus.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-white">
              {selectedDayInfo.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Day Completed ({dayProgress?.score || 85}%)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-mono font-semibold">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Pending Verification</span>
              </div>
            )}
          </div>
        </div>

        {/* Objective & Key Concepts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                Daily Mission Objective
              </h4>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                {selectedDayInfo.objective}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                Core Architectural Invariants
              </h4>
              <ul className="space-y-2">
                {selectedDayInfo.keyConcepts.map((concept, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Featured Challenge Problem Card */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase">
                Challenge Problem
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                selectedDayInfo.difficulty === 'hard'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                  : selectedDayInfo.difficulty === 'medium'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
              }`}>
                {selectedDayInfo.difficulty}
              </span>
            </div>

            <div>
              <div className="text-base font-bold font-mono text-zinc-900 dark:text-white">
                {selectedDayInfo.recommendedProblemTitle}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Solve this problem in Monaco editor to prove your Day {selectedDayInfo.day} competence.
              </p>
            </div>

            <button
              onClick={() => handleLaunchProblem(selectedDayInfo.recommendedProblemId)}
              id={`btn-open-day-${selectedDayInfo.day}-problem`}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Solve in Practice Arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Completion Action Bar */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
              Confidence Score:
            </label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={selfScore}
              onChange={(e) => setSelfScore(Number(e.target.value))}
              className="w-32 accent-indigo-600"
            />
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {selfScore}%
            </span>
          </div>

          <button
            onClick={handleCompleteCurrentDay}
            id="btn-complete-day"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Day {selectedDayInfo.day} Complete & Calibrate Archetype</span>
          </button>
        </div>
      </div>

      {/* 5-Day Journey Module Achievement Badges Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Journey Badges
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1">
                <Database className="w-3 h-3 text-indigo-500" />
                Stored in Firestore
              </span>
            </div>
            <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              Earned Badges & Invariant Milestones
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Badges awarded upon completing modules within your 5-day curriculum. Automatically persisted under your profile in Firestore.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('achievements')}
            id="btn-journey-view-all-achievements"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold border border-indigo-200 dark:border-indigo-500/30 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Open Achievement Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Badges Cards Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {userProfile.earnedBadges?.slice(0, 6).map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-emerald-50/40 to-teal-50/20 dark:from-zinc-900 dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-500/40 shadow-xs'
                  : 'bg-zinc-50/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  badge.unlocked
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                }`}>
                  {badge.unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  badge.unlocked
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                }`}>
                  {badge.unlocked ? 'Earned' : 'Locked'}
                </span>
              </div>

              <h4 className="text-sm font-bold font-mono text-zinc-900 dark:text-white mb-1">
                {badge.title}
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                {badge.description}
              </p>
              <div className="text-[10px] font-mono text-zinc-500 truncate">
                {badge.unlocked ? '✓ Verified in Firestore' : `Criteria: ${badge.criteria}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 3 Coder Archetypes Matrix */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold font-mono text-zinc-900 dark:text-white">
            The 3 Coder Archetypes
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            AlgoMentor calibrates your learning track and AI instructor tone against these three archetypes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['beginner', 'intermediate', 'extraordinary'] as CoderArchetype[]).map(arch => {
            const info = ARCHETYPE_PROFILES[arch];
            const isUserArchetype = currentArchetype === arch;

            return (
              <div
                key={arch}
                className={`p-5 rounded-2xl border transition-all ${
                  isUserArchetype
                    ? 'bg-white dark:bg-zinc-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg'
                    : 'bg-white/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${info.badgeColor}`}>
                    {info.badgeLabel}
                  </span>
                  {isUserArchetype && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded">
                      Current
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold font-mono text-zinc-900 dark:text-white">
                  {info.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {info.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="text-[11px] font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    Typical Traits:
                  </div>
                  <ul className="space-y-1.5">
                    {info.typicalTraits.map((trait, tIdx) => (
                      <li key={tIdx} className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-start gap-1.5">
                        <span className="text-indigo-500">•</span>
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => setJourneyArchetype(arch)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    Select as Baseline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
