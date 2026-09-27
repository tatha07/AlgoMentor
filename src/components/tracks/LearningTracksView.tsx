import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DSA_TOPICS } from '../../data/dsaTopics';
import { DsaTopic, TrackLevel } from '../../types';
import Markdown from 'react-markdown';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Clock, 
  Youtube, 
  Code2, 
  ArrowRight, 
  X, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  Award
} from 'lucide-react';

export const LearningTracksView: React.FC = () => {
  const { 
    userProfile, 
    toggleTopicCompletion, 
    selectedTopicId, 
    setSelectedTopicId,
    setActiveTab,
    setActiveTrack
  } = useApp();

  const [activeTrackTab, setActiveTrackTab] = useState<TrackLevel>(userProfile.activeTrack);
  const [activeModalTab, setActiveModalTab] = useState<'intuition' | 'code' | 'traps' | 'videos'>('intuition');
  const [activeLang, setActiveLang] = useState<'javascript' | 'python' | 'cpp' | 'java'>(userProfile.preferredLanguage);
  const [copied, setCopied] = useState(false);

  const filteredTopics = DSA_TOPICS.filter(t => t.trackLevel === activeTrackTab);
  const currentTopic = DSA_TOPICS.find(t => t.id === selectedTopicId) || null;

  const handleOpenTopic = (topic: DsaTopic) => {
    setSelectedTopicId(topic.id);
  };

  const handleCloseModal = () => {
    setSelectedTopicId(null);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePracticeThisTopic = (topicId: string) => {
    handleCloseModal();
    setActiveTab('practice');
  };

  const trackStats = {
    beginner: {
      total: DSA_TOPICS.filter(t => t.trackLevel === 'beginner').length,
      completed: DSA_TOPICS.filter(t => t.trackLevel === 'beginner' && userProfile.completedTopicIds.includes(t.id)).length,
      title: 'Beginner Foundations Track',
      desc: 'Master Big-O, continuous arrays, linked lists, and logarithmic binary search mechanics.',
    },
    intermediate: {
      total: DSA_TOPICS.filter(t => t.trackLevel === 'intermediate').length,
      completed: DSA_TOPICS.filter(t => t.trackLevel === 'intermediate' && userProfile.completedTopicIds.includes(t.id)).length,
      title: 'Intermediate Patterns Track',
      desc: 'Sliding window, two pointers, tree traversals, and 2D graph flood-fills.',
    },
    pro: {
      total: DSA_TOPICS.filter(t => t.trackLevel === 'pro').length,
      completed: DSA_TOPICS.filter(t => t.trackLevel === 'pro' && userProfile.completedTopicIds.includes(t.id)).length,
      title: 'Pro & Advanced CP Track',
      desc: 'Topological Kahn sorting, DSU Union-Find, Dijkstra, and Trie prefix trees.',
    },
  };

  const currentStats = trackStats[activeTrackTab];
  const trackProgressPercent = Math.round((currentStats.completed / currentStats.total) * 100) || 0;

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header & Track Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
              Structured Curriculum
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            DSA Learning Tracks
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            {currentStats.desc}
          </p>
        </div>

        {/* Track Switcher Buttons */}
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
          {(['beginner', 'intermediate', 'pro'] as TrackLevel[]).map(trk => (
            <button
              key={trk}
              onClick={() => {
                setActiveTrackTab(trk);
                setActiveTrack(trk);
              }}
              className={`px-3.5 py-2 rounded-lg font-semibold capitalize transition-all ${
                activeTrackTab === trk
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {trk} ({trackStats[trk].completed}/{trackStats[trk].total})
            </button>
          ))}
        </div>
      </div>

      {/* Track Progress Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
              {currentStats.title} Mastery
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {currentStats.completed} of {currentStats.total} modules completed
            </div>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mb-1">
            <span>Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{trackProgressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${trackProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic, index) => {
          const isCompleted = userProfile.completedTopicIds.includes(topic.id);
          return (
            <div
              key={topic.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group relative shadow-sm ${
                isCompleted
                  ? 'bg-indigo-50/30 dark:bg-zinc-900/40 border-indigo-300 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-500/60'
                  : 'bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                {/* Top Row: Index, Category, Checkbox */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 font-semibold">
                    MODULE 0{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                      {topic.category}
                    </span>
                    <button
                      onClick={() => toggleTopicCompletion(topic.id)}
                      title={isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                      className="text-zinc-400 hover:text-emerald-500 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Big-O Badges */}
                <div className="mt-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Time: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{topic.timeComplexity.average}</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Space: <span className="text-sky-600 dark:text-sky-400 font-bold">{topic.spaceComplexity.worst}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Row: Actions */}
              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ~{topic.estimatedHours}h
                </span>

                <button
                  onClick={() => handleOpenTopic(topic)}
                  id={`btn-open-topic-${topic.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                >
                  <span>Study Module</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Topic Detail Modal */}
      {currentTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 dark:bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh] transition-colors duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/70 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                    {currentTopic.trackLevel} Track
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    Category: {currentTopic.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white font-mono">
                  {currentTopic.title}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                id="btn-close-topic-modal"
                className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/40 px-6 text-xs font-mono shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveModalTab('intuition')}
                className={`py-3 px-4 border-b-2 font-bold transition-all ${
                  activeModalTab === 'intuition'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Intuition & Memory Model
              </button>
              <button
                onClick={() => setActiveModalTab('code')}
                className={`py-3 px-4 border-b-2 font-bold transition-all ${
                  activeModalTab === 'code'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Code Implementations
              </button>
              <button
                onClick={() => setActiveModalTab('traps')}
                className={`py-3 px-4 border-b-2 font-bold transition-all ${
                  activeModalTab === 'traps'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Invariants & Common Pitfalls
              </button>
              <button
                onClick={() => setActiveModalTab('videos')}
                className={`py-3 px-4 border-b-2 font-bold transition-all ${
                  activeModalTab === 'videos'
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Curated Videos ({currentTopic.recommendedResources.length})
              </button>
            </div>

            {/* Modal Tab Content (Scrollable) */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-zinc-800 dark:text-zinc-200">
              {/* TAB 1: INTUITION */}
              {activeModalTab === 'intuition' && (
                <div className="space-y-5">
                  <div className="prose dark:prose-invert prose-sm max-w-none leading-relaxed">
                    <Markdown>{currentTopic.visualExplanation || currentTopic.concept}</Markdown>
                  </div>

                  {/* Patterns */}
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                    <h4 className="text-xs font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                      Core Algorithmic Patterns
                    </h4>
                    <div className="space-y-2">
                      {currentTopic.patterns.map((pt, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1 shadow-sm"
                        >
                          <div className="font-mono font-bold text-zinc-900 dark:text-white">✓ {pt.name}</div>
                          <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">{pt.description}</p>
                          <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">Example: {pt.exampleProblem}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CODE IMPLEMENTATIONS */}
              {activeModalTab === 'code' && (
                <div className="space-y-4">
                  {/* Language Selector */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                      {(['javascript', 'python', 'cpp', 'java'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setActiveLang(lang)}
                          className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                            activeLang === lang
                              ? 'bg-indigo-600 text-white font-bold shadow-sm'
                              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const snippet = currentTopic.codeSnippets[activeLang] || '';
                        handleCopyCode(snippet);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>

                  {/* Code Box */}
                  <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed shadow-sm">
                    <pre>
                      <code>
                        {currentTopic.codeSnippets[activeLang] || '// No snippet available.'}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: TRAPS & INVARIANTS */}
              {activeModalTab === 'traps' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Critical Traps & Common Mistakes</span>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 list-disc list-inside">
                      {currentTopic.commonMistakes.map((tr, i) => (
                        <li key={i} className="leading-relaxed">{tr}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <h4 className="text-xs font-mono uppercase font-bold text-zinc-800 dark:text-zinc-300">
                      Why It Matters In Production
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {currentTopic.whyItMatters}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: VIDEOS */}
              {activeModalTab === 'videos' && (
                <div className="space-y-3">
                  {currentTopic.recommendedResources.map((res, i) => (
                    <a
                      key={i}
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(res.searchQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-rose-400 dark:hover:border-rose-500/50 flex items-center justify-between group transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20 transition-colors">
                          <Youtube className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors">
                            {res.title}
                          </h5>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                            Creator: {res.creator} • {res.duration} • Query: "{res.searchQuery}"
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex items-center justify-between shrink-0">
              <button
                onClick={() => toggleTopicCompletion(currentTopic.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                  userProfile.completedTopicIds.includes(currentTopic.id)
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/40'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {userProfile.completedTopicIds.includes(currentTopic.id)
                    ? 'Topic Completed ✓'
                    : 'Mark Completed'}
                </span>
              </button>

              <button
                onClick={() => handlePracticeThisTopic(currentTopic.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-opacity shadow-md shadow-indigo-600/20"
              >
                <span>Practice Problems</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
