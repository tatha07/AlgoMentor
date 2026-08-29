import React from 'react';
import { useApp } from '../../context/AppContext';
import { DSA_TOPICS } from '../../data/dsaTopics';
import { 
  GitFork, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Award,
  Zap,
  Lock
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { 
    userProfile, 
    setSelectedTopicId, 
    setActiveTab, 
    toggleTopicCompletion 
  } = useApp();

  const stages = [
    {
      stageNumber: 1,
      title: 'Foundations & Complexity Axioms',
      subtitle: 'Big-O bounds, contiguous memory models, and pointer fundamentals',
      topicIds: ['big-o-analysis', 'arrays-and-strings', 'hashing-hashmaps', 'linked-lists'],
      color: 'border-zinc-800 text-zinc-100 bg-zinc-900/60',
    },
    {
      stageNumber: 2,
      title: 'Searching & Linear Patterns',
      subtitle: 'Monotonic search boundaries, sub-array windows, and two-pointer sweeps',
      topicIds: ['binary-search-foundations', 'two-pointers', 'sliding-window', 'stacks-and-queues'],
      color: 'border-zinc-800 text-zinc-100 bg-zinc-900/60',
    },
    {
      stageNumber: 3,
      title: 'Trees & Hierarchical Graphs',
      subtitle: 'Recursive traversals, binary search trees, and 2D grid flood fills',
      topicIds: ['binary-trees-bfs-dfs', 'graphs-bfs-dfs'],
      color: 'border-zinc-800 text-zinc-100 bg-zinc-900/60',
    },
    {
      stageNumber: 4,
      title: 'State Optimization & Dynamic Programming',
      subtitle: 'Memoization, optimal substructure, 1D/2D recurrence relations',
      topicIds: ['dynamic-programming-1d'],
      color: 'border-zinc-800 text-zinc-100 bg-zinc-900/60',
    },
    {
      stageNumber: 5,
      title: 'Advanced CP Graphs & Prefix Trees',
      subtitle: 'Cycle topologies, disjoint sets, shortest path queues, and Tries',
      topicIds: ['topological-sort', 'union-find-dsu', 'shortest-path-dijkstra', 'trie-prefix-tree'],
      color: 'border-zinc-800 text-zinc-100 bg-zinc-900/60',
    },
  ];

  const handleOpenTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('tracks');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              Prerequisite Graph & Path
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Interactive DSA Roadmap
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            A structured, invariant-first progression from asymptotic fundamentals to FAANG-level competitive programming patterns.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
            <span className="text-zinc-500">Total Topics: </span>
            <span className="text-indigo-400 font-bold">{userProfile.completedTopicIds.length}/13 Mastered</span>
          </div>
        </div>
      </div>

      {/* Sequential Stages */}
      <div className="space-y-8 relative">
        {stages.map((stg) => (
          <div key={stg.stageNumber} className="space-y-4">
            {/* Stage Header */}
            <div className={`p-4 rounded-xl border ${stg.color} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-indigo-400">
                  0{stg.stageNumber}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{stg.title}</h3>
                  <p className="text-xs text-zinc-400">{stg.subtitle}</p>
                </div>
              </div>
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 font-semibold">
                Phase 0{stg.stageNumber}
              </span>
            </div>

            {/* Topic Nodes in this Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-2 md:pl-4">
              {stg.topicIds.map(tId => {
                const topic = DSA_TOPICS.find(t => t.id === tId);
                if (!topic) return null;
                const isCompleted = userProfile.completedTopicIds.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-zinc-900/40 border-indigo-500/40'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-850">
                          {topic.trackLevel}
                        </span>
                        <button
                          onClick={() => toggleTopicCompletion(topic.id)}
                          className="text-zinc-500 hover:text-indigo-400 transition-colors"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">{topic.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">{topic.description}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                        {topic.timeComplexity.average}
                      </span>
                      <button
                        onClick={() => handleOpenTopic(topic.id)}
                        className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                      >
                        <span>Learn</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
