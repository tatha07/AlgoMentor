import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { explainCodeSnippet } from '../../services/api';
import Markdown from 'react-markdown';
import { 
  FileCode2, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  AlertTriangle, 
  RotateCcw,
  Code
} from 'lucide-react';

const SAMPLE_CODE_SNIPPETS = {
  binarySearchBuggy: `// What is the time complexity and hidden bug here?
function search(nums, target) {
  let left = 0;
  let right = nums.length; // Bug: Should this be length or length - 1?

  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid; // Bug: Potential infinite loop!
    } else {
      right = mid;
    }
  }
  return -1;
}`,
  recursiveFibonacci: `// Why does this simple recursion lag on N = 50?
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
  graphBfs: `// Graph Level-Order BFS traversal
function bfs(graph, startNode) {
  const queue = [startNode];
  const visited = new Set([startNode]);
  const result = [];

  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}`
};

export const CodeExplainerView: React.FC = () => {
  const { userProfile } = useApp();

  const [code, setCode] = useState(SAMPLE_CODE_SNIPPETS.binarySearchBuggy);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [context, setContext] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!code.trim() || isExplaining) return;
    setIsExplaining(true);
    setExplanation(null);

    try {
      const result = await explainCodeSnippet({
        code,
        language,
        context,
      });
      setExplanation(result);
    } catch (e: any) {
      setExplanation(`⚠️ Failed to analyze code: ${e.message}`);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              Code Intelligence & Debugger
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            DSA Code Explainer & Big-O Auditor
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Paste any algorithm implementation. Get line-by-line breakdown, asymptotic complexity proof, edge-case vulnerability audit, and clean optimizations.
          </p>
        </div>

        {/* Quick Samples */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">Sample Snippets:</span>
          <button
            onClick={() => setCode(SAMPLE_CODE_SNIPPETS.binarySearchBuggy)}
            className="px-2.5 py-1 text-xs font-mono bg-zinc-950 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 transition-colors"
          >
            Buggy Binary Search
          </button>
          <button
            onClick={() => setCode(SAMPLE_CODE_SNIPPETS.recursiveFibonacci)}
            className="px-2.5 py-1 text-xs font-mono bg-zinc-950 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 transition-colors"
          >
            Exponential Fib
          </button>
          <button
            onClick={() => setCode(SAMPLE_CODE_SNIPPETS.graphBfs)}
            className="px-2.5 py-1 text-xs font-mono bg-zinc-950 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 transition-colors"
          >
            Graph BFS
          </button>
        </div>
      </div>

      {/* Editor & Context Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Code Input (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">Your Code</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
                {(['javascript', 'python', 'cpp', 'java'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-2.5 py-1 rounded-md uppercase transition-all ${
                      language === l
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full p-4 bg-zinc-950 text-indigo-300 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-900/60"
              placeholder="// Paste your algorithm code here..."
            />

            <div className="p-3 bg-zinc-950/80 border-t border-zinc-800">
              <input
                type="text"
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Optional: Specific problem context or question (e.g., 'Why does this get TLE on test 45?')"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setCode('');
                  setExplanation(null);
                }}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                Clear
              </button>

              <button
                onClick={handleExplain}
                id="btn-analyze-code"
                disabled={isExplaining || !code.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-opacity shadow-sm shadow-indigo-600/20 border border-indigo-500/40 disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isExplaining ? 'Auditing Invariants...' : 'Analyze & Explain Code'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Explanation Stream (6 cols) */}
        <div className="lg:col-span-6">
          <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 min-h-[500px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
                <Terminal className="w-4 h-4" />
                <span>Senior Dev Analysis Report</span>
              </div>
            </div>

            {explanation ? (
              <div className="prose prose-invert prose-sm max-w-none text-zinc-200 leading-relaxed font-sans space-y-4">
                <div className="markdown-body">
                  <Markdown>{explanation}</Markdown>
                </div>
              </div>
            ) : isExplaining ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center font-mono">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs text-zinc-300">
                  Tracing recursion stacks, checking edge cases, and measuring Big-O...
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center font-mono space-y-2 text-zinc-500">
                <FileCode2 className="w-12 h-12 text-zinc-600 stroke-1" />
                <p className="text-xs">
                  Paste your code on the left and click "Analyze & Explain Code" to view a line-by-line audit.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
