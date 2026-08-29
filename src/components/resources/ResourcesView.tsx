import React, { useState } from 'react';
import { DSA_TOPICS } from '../../data/dsaTopics';
import { 
  Youtube, 
  ExternalLink, 
  Search, 
  Play
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<string>('all');

  // Flatten all YouTube resources from topics
  const allResources = DSA_TOPICS.flatMap(topic =>
    topic.recommendedResources.map(r => ({
      ...r,
      topicId: topic.id,
      topicTitle: topic.title,
      topicTrack: topic.trackLevel,
      topicDifficulty: r.difficulty || 'medium',
    }))
  );

  const creators = Array.from(new Set(allResources.map(r => r.creator)));

  const filteredResources = allResources.filter(r => {
    const matchesCreator = selectedCreator === 'all' || r.creator === selectedCreator;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCreator && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              Verified Instructor Directory
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Curated Video Vault
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Gold-standard explanations from Abdul Bari, NeetCode, Striver, MIT OCW, and William Fiset matched directly to your curriculum topics.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by topic, algorithm, or concept..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Creator Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setSelectedCreator('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCreator === 'all'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All Creators
          </button>
          {creators.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCreator(c)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCreator === c
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res, idx) => (
          <a
            key={idx}
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(res.searchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all flex flex-col justify-between group space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 font-semibold border border-zinc-800">
                  {res.creator}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  {res.topicTrack}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                {res.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Topic: {res.topicTitle}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Play className="w-3.5 h-3.5 text-indigo-400 fill-current" /> Watch Breakdown
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
