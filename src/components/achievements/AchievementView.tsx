import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { JourneyBadge } from '../../types';
import { ARCHETYPE_PROFILES, FIVE_DAY_CURRICULUM } from '../../data/fiveDayJourneyData';
import { 
  Award, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Compass, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame,
  Hash,
  Sliders,
  GitBranch,
  Network,
  Cpu,
  Crown,
  Database,
  Calendar,
  X
} from 'lucide-react';

export const AchievementView: React.FC = () => {
  const { 
    userProfile, 
    setActiveTab, 
    setSelectedProblemId,
    syncAchievementsWithFirestore 
  } = useApp();

  const { currentUser, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'all' | 'modules' | 'archetypes' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<JourneyBadge | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const badges = userProfile.earnedBadges || [];
  const journey = userProfile.fiveDayJourney;
  const currentArchetype = userProfile.coderArchetype || 'intermediate';
  const archetypeInfo = ARCHETYPE_PROFILES[currentArchetype];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    if (activeFilter === 'unlocked') return badge.unlocked;
    if (activeFilter === 'locked') return !badge.unlocked;
    if (activeFilter === 'modules') return badge.category === 'module';
    if (activeFilter === 'archetypes') return badge.category === 'archetype';
    return true;
  });

  const handleSyncWithFirestore = async () => {
    if (!currentUser) {
      setSyncFeedback('Sign in to connect and persist your achievements to your Cloud Firestore profile!');
      setAuthModalMode('signin');
      setIsAuthModalOpen(true);
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const updated = await syncAchievementsWithFirestore();
      const newlyEarned = updated.filter(b => b.unlocked).length;
      setSyncFeedback(`Successfully synced ${newlyEarned} earned badges to Firestore under your cloud profile!`);
      setTimeout(() => setSyncFeedback(null), 5000);
    } catch (err: any) {
      setSyncFeedback('Notice: Badges saved locally. Firestore sync will reconnect automatically.');
      setTimeout(() => setSyncFeedback(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleActionClick = (badge: JourneyBadge) => {
    if (badge.moduleId >= 1 && badge.moduleId <= 5) {
      const dayData = FIVE_DAY_CURRICULUM.find(d => d.day === badge.moduleId);
      if (dayData) {
        setSelectedProblemId(dayData.recommendedProblemId);
        setActiveTab('practice');
        return;
      }
    }
    setActiveTab('journey');
  };

  // Helper for badge icon rendering
  const renderBadgeIcon = (iconName: string, tier: string, unlocked: boolean) => {
    const iconClass = "w-7 h-7";
    switch (iconName) {
      case 'Hash':
        return <Hash className={iconClass} />;
      case 'Sliders':
        return <Sliders className={iconClass} />;
      case 'GitBranch':
        return <GitBranch className={iconClass} />;
      case 'Network':
        return <Network className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'Crown':
        return <Crown className={iconClass} />;
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Trophy':
      default:
        return <Trophy className={iconClass} />;
    }
  };

  const getTierStyles = (tier: string, unlocked: boolean) => {
    if (!unlocked) {
      return {
        cardBorder: 'border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 opacity-75',
        iconBg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700',
        glow: '',
        pill: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
      };
    }

    switch (tier) {
      case 'diamond':
        return {
          cardBorder: 'border-purple-300 dark:border-purple-500/40 bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/30 dark:from-zinc-900 dark:via-purple-950/20 dark:to-zinc-950 shadow-md shadow-purple-500/10',
          iconBg: 'bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 border-purple-300',
          glow: 'ring-1 ring-purple-400/30',
          pill: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30',
        };
      case 'gold':
        return {
          cardBorder: 'border-amber-300 dark:border-amber-500/40 bg-gradient-to-br from-white via-amber-50/20 to-yellow-50/30 dark:from-zinc-900 dark:via-amber-950/20 dark:to-zinc-950 shadow-md shadow-amber-500/10',
          iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25 border-amber-300',
          glow: 'ring-1 ring-amber-400/30',
          pill: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30',
        };
      case 'silver':
        return {
          cardBorder: 'border-indigo-300 dark:border-indigo-500/40 bg-gradient-to-br from-white via-indigo-50/20 to-slate-50/30 dark:from-zinc-900 dark:via-indigo-950/20 dark:to-zinc-950 shadow-sm shadow-indigo-500/5',
          iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20 border-indigo-300',
          glow: 'ring-1 ring-indigo-400/30',
          pill: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/30',
        };
      case 'bronze':
      default:
        return {
          cardBorder: 'border-emerald-300 dark:border-emerald-500/40 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-zinc-900 dark:via-emerald-950/20 dark:to-zinc-950 shadow-sm shadow-emerald-500/5',
          iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 border-emerald-300',
          glow: 'ring-1 ring-emerald-400/30',
          pill: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
        };
    }
  };

  return (
    <div className="space-y-8 pb-16 transition-colors duration-200">
      {/* Hero Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-slate-100 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                5-Day Journey Achievements
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                Firestore User Profile Sync
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Badges & Milestones:{' '}
              <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
                Proven Invariants
              </span>
            </h1>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Earn cryptographic mastery badges as you complete daily curriculum modules within your 5-day journey. 
              Each badge is permanently stored under your user profile in Cloud Firestore.
            </p>

            {syncFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{syncFeedback}</span>
              </div>
            )}
          </div>

          {/* Progress & Sync Card */}
          <div className="shrink-0 flex flex-col items-center justify-center p-5 rounded-xl bg-white/90 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 shadow-md min-w-[220px]">
            <div className="text-[11px] font-mono uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              Badges Unlocked
            </div>
            <div className="text-4xl font-extrabold font-mono text-zinc-900 dark:text-white my-1">
              {unlockedCount}
              <span className="text-sm font-normal text-zinc-400">/{totalCount}</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden my-2">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mb-3">
              {completionPercentage}% Journey Mastered
            </div>

            <button
              onClick={handleSyncWithFirestore}
              disabled={isSyncing}
              id="btn-sync-achievements-firestore"
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync with Cloud'}</span>
            </button>
          </div>
        </div>

        {/* 5-Day Module Breadcrumb Tracker */}
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[1, 2, 3, 4, 5].map(day => {
            const dayDone = !!journey?.days[day]?.completed;
            const dayData = FIVE_DAY_CURRICULUM.find(d => d.day === day);
            const badgeForDay = badges.find(b => b.moduleId === day);
            return (
              <div
                key={day}
                onClick={() => {
                  if (badgeForDay) setSelectedBadge(badgeForDay);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  dayDone
                    ? 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30'
                    : 'bg-white/50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400">
                    Day {day} Module
                  </span>
                  {dayDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {badgeForDay ? badgeForDay.name : dayData?.theme || `Module ${day}`}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  {dayDone ? 'Badge Unlocked' : 'Module Incomplete'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            All Badges ({badges.length})
          </button>
          <button
            onClick={() => setActiveFilter('modules')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeFilter === 'modules'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            5-Day Modules (5)
          </button>
          <button
            onClick={() => setActiveFilter('archetypes')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeFilter === 'archetypes'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Archetype Calibrations
          </button>
          <button
            onClick={() => setActiveFilter('unlocked')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeFilter === 'unlocked'
                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setActiveFilter('locked')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeFilter === 'locked'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Bronze / Silver
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Gold
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Diamond
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map(badge => {
          const styles = getTierStyles(badge.tier, badge.unlocked);
          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between hover:shadow-lg ${styles.cardBorder} ${styles.glow}`}
            >
              {/* Top Row: Icon + Tier Pill */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${styles.iconBg} relative`}>
                    {renderBadgeIcon(badge.icon, badge.tier, badge.unlocked)}
                    {badge.unlocked && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {!badge.unlocked && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 flex items-center justify-center shadow-md">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${styles.pill}`}>
                      {badge.tier}
                    </span>
                    {badge.moduleName && (
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                        {badge.moduleId > 0 ? `Module Day ${badge.moduleId}` : 'Journey Goal'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge Title & Description */}
                <h3 className="text-base font-bold font-mono text-zinc-900 dark:text-white mb-1.5 flex items-center gap-2">
                  <span>{badge.title}</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                  {badge.description}
                </p>

                {/* Skills Gained Tags */}
                {badge.skillsGained && badge.skillsGained.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {badge.skillsGained.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom State / Action */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                {badge.unlocked ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Unlocked & Saved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[170px]" title={badge.criteria}>
                      {badge.criteria}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleActionClick(badge)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1"
                >
                  <span>{badge.unlocked ? 'Inspect' : 'Complete'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${getTierStyles(selectedBadge.tier, selectedBadge.unlocked).iconBg}`}>
                {renderBadgeIcon(selectedBadge.icon, selectedBadge.tier, selectedBadge.unlocked)}
              </div>
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getTierStyles(selectedBadge.tier, selectedBadge.unlocked).pill}`}>
                  {selectedBadge.tier} Tier
                </span>
                <h2 className="text-lg font-bold font-mono text-zinc-900 dark:text-white mt-1">
                  {selectedBadge.title}
                </h2>
                <p className="text-xs text-zinc-500 font-mono">
                  {selectedBadge.rarity || 'Journey Badge'} • {selectedBadge.moduleName || 'Curriculum Goal'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 mb-1">
                  Proven Algorithmic Invariant
                </h4>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 mb-1">
                  Unlock Condition
                </h4>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                  {selectedBadge.criteria}
                </p>
              </div>

              {selectedBadge.skillsGained && (
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 mb-1.5">
                    Skills Calibrated
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBadge.skillsGained.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedBadge.unlockedAt && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-300">
                  <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Earned on: {new Date(selectedBadge.unlockedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedBadge(null);
                  handleActionClick(selectedBadge);
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <span>{selectedBadge.unlocked ? 'Practice Invariant' : 'Launch Module Problem'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Also export as default and named Achievement for flexible imports
export const Achievement = AchievementView;
export default AchievementView;
