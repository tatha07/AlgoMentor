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
  BookOpen,
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
    <div className="space-y-6 pb-12">
      {/* Header & Track Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              Structured Curriculum
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            DSA Learning Tracks
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            {currentStats.desc}
          </p>
        </div>

        {/* Track Switcher Buttons */}
        <div className="flex items-center p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-mono">
          {(['beginner', 'intermediate', 'pro'] as TrackLevel[]).map(trk => (
            <button
              key={trk}
              onClick={() => {
                setActiveTrackTab(trk);
                setActiveTrack(trk);
              }}
              className={`px-3.5 py-2 rounded-md font-semibold capitalize transition-all ${
                activeTrackTab === trk
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {trk} ({trackStats[trk].completed}/{trackStats[trk].total})
            </button>
          ))}
        </div>
      </div>

      {/* Track Progress Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white font-mono">
              {currentStats.title} Mastery
            </div>
            <div className="text-[11px] text-zinc-400">
              {currentStats.completed} of {currentStats.total} modules completed
            </div>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
            <span>Progress</span>
            <span className="text-indigo-400 font-bold">{trackProgressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
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
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between group relative ${
                isCompleted
                  ? 'bg-zinc-900/40 border-indigo-500/30 hover:border-indigo-500/60'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div>
                {/* Top Row: Index, Category, Checkbox */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                    MODULE 0{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {topic.category}
                    </span>
                    <button
                      onClick={() => toggleTopicCompletion(topic.id)}
                      title={isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                      className="text-zinc-500 hover:text-emerald-400 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Big-O Badges */}
                <div className="flex items-center gap-2 mt-3 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 border border-zinc-800">
                    Time: {topic.timeComplexity.average}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 text-sky-400 border border-zinc-800">
                    Space: {topic.spaceComplexity.worst}
                  </span>
                </div>

                {/* Patterns */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {topic.patterns.slice(0, 2).map((p, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono border border-zinc-700/50">
                      #{p.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Track: {topic.trackLevel}
                </span>
                <button
                  onClick={() => handleOpenTopic(topic)}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Study Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Topic Details Modal */}
      {currentTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white font-mono">{currentTopic.title}</h2>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                      {currentTopic.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Track: {currentTopic.trackLevel} • Time: {currentTopic.timeComplexity.average} • Space: {currentTopic.spaceComplexity.worst}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Buttons */}
            <div className="flex items-center px-6 border-b border-zinc-800 bg-zinc-950/40 text-xs font-mono overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setActiveModalTab('intuition')}
                className={`py-3 px-4 border-b-2 font-bold transition-all ${
                  activeModalTab === 'intuition'
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Intuition & Memory Model
              </button>
              <button
                onClick={() => setActiveModalTab('code')}
                className={`py-3 px-4 border-b-2 font-bold transition-all ${
                  activeModalTab === 'code'
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Code Implementations
              </button>
              <button
                onClick={() => setActiveModalTab('traps')}
                className={`py-3 px-4 border-b-2 font-bold transition-all ${
                  activeModalTab === 'traps'
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Invariants & Common Pitfalls
              </button>
              <button
                onClick={() => setActiveModalTab('videos')}
                className={`py-3 px-4 border-b-2 font-bold transition-all ${
                  activeModalTab === 'videos'
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Curated Videos ({currentTopic.recommendedResources.length})
              </button>
            </div>

            {/* Modal Tab Content (Scrollable) */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-zinc-200">
              {/* TAB 1: INTUITION */}
              {activeModalTab === 'intuition' && (
                <div className="space-y-5">
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                    <div className="markdown-body">
                      <Markdown>{currentTopic.visualExplanation || currentTopic.concept}</Markdown>
                    </div>
                  </div>

                  {/* Patterns */}
                  <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800">
                    <h4 className="text-xs font-mono uppercase font-bold text-indigo-400 mb-2">
                      Core Algorithmic Patterns
                    </h4>
                    <div className="space-y-2">
                      {currentTopic.patterns.map((pt, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-md bg-zinc-900 border border-zinc-800 text-xs space-y-1"
                        >
                          <div className="font-mono font-bold text-white">✓ {pt.name}</div>
                          <p className="text-zinc-400 text-[11px]">{pt.description}</p>
                          <div className="text-[10px] font-mono text-indigo-400">Example: {pt.exampleProblem}</div>
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
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-mono">
                      {(['javascript', 'python', 'cpp', 'java'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setActiveLang(lang)}
                          className={`px-3 py-1.5 rounded-md uppercase transition-all ${
                            activeLang === lang
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-zinc-400 hover:text-white'
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
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors border border-zinc-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>

                  {/* Code Box */}
                  <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto text-indigo-300 leading-relaxed">
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
                  <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Critical Traps & Common Mistakes</span>
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside">
                      {currentTopic.commonMistakes.map((tr, i) => (
                        <li key={i} className="leading-relaxed">{tr}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-2">
                    <h4 className="text-xs font-mono uppercase font-bold text-zinc-300">
                      Why It Matters In Production
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
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
                      className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-rose-500/50 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                          <Youtube className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                            {res.title}
                          </h5>
                          <span className="text-xs text-zinc-400 font-mono">
                            Creator: {res.creator} • {res.duration} • Query: "{res.searchQuery}"
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between shrink-0">
              <button
                onClick={() => toggleTopicCompletion(currentTopic.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  userProfile.completedTopicIds.includes(currentTopic.id)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-opacity shadow-md shadow-indigo-600/20 border border-indigo-500/40"
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
