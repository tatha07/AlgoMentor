import React, { useState } from 'react';
import { ArrayPointersVisualizer } from './ArrayPointersVisualizer';
import { SortingVisualizer } from './SortingVisualizer';
import { RecursionTreeVisualizer } from './RecursionTreeVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { TreeGraphVisualizer } from './TreeGraphVisualizer';
import { DpGridVisualizer } from './DpGridVisualizer';
import { MonacoCodeEditor } from '../../common/MonacoCodeEditor';
import { 
  Eye, 
  Code2, 
  Play, 
  Send, 
  Terminal, 
  FileText, 
  BarChart2, 
  GitBranch, 
  GitCommit, 
  Network, 
  Cpu, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface AlgorithmVisualizerWorkbenchProps {
  onSendCodeToTutor?: (code: string, language: string) => void;
  activeTopicHint?: string;
}

const STARTER_CODES: Record<string, string> = {
  python: `# Gnani Live Sandbox - Python 3
def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

sample_array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target_val = 23
result = binary_search(sample_array, target_val)
print(f"Target {target_val} found at index: {result}")
`,
  cpp: `// Gnani Live Sandbox - C++ 20
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> nums = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;
    std::cout << "Target " << target << " found at index: " << binarySearch(nums, target) << std::endl;
    return 0;
}
`,
  java: `// Gnani Live Sandbox - Java 17
import java.util.Arrays;

public class Solution {
    public static int binarySearch(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int target = 23;
        System.out.println("Target " + target + " found at index: " + binarySearch(nums, target));
    }
}
`,
  c: `// Gnani Live Sandbox - C (C11)
#include <stdio.h>

int binarySearch(int nums[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int nums[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(nums) / sizeof(nums[0]);
    int target = 23;
    printf("Target %d found at index: %d\\n", target, binarySearch(nums, n, target));
    return 0;
}
`,
  javascript: `// Gnani Live Sandbox - JavaScript (Node.js)
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const target = 23;
console.log("Target " + target + " found at index:", binarySearch(nums, target));
`,
};

export const AlgorithmVisualizerWorkbench: React.FC<AlgorithmVisualizerWorkbenchProps> = ({
  onSendCodeToTutor,
}) => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'code' | 'complexity'>('visualizer');
  const [selectedVisualizer, setSelectedVisualizer] = useState<'array' | 'sorting' | 'recursion' | 'linkedlist' | 'tree' | 'dp'>('array');
  const [codeLanguage, setCodeLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>(STARTER_CODES.python);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sandboxOutput, setSandboxOutput] = useState<{ stdout: string; stderr?: string; timeMs?: number } | null>(null);

  const handleLanguageChange = (lang: string) => {
    setCodeLanguage(lang);
    setCode(STARTER_CODES[lang] || STARTER_CODES.python);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setSandboxOutput(null);
    try {
      const res = await fetch('/api/sandbox/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: codeLanguage,
        }),
      });
      const data = await res.json();
      setSandboxOutput({
        stdout: data.stdout || 'Process completed with no standard output.',
        stderr: data.stderr,
        timeMs: data.executionTimeMs,
      });
    } catch (err: any) {
      setSandboxOutput({
        stdout: '',
        stderr: err?.message || 'Failed to execute code in sandbox.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Workbench Navigation Header */}
      <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === 'visualizer'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white font-bold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Algorithm Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === 'code'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white font-bold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('complexity')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === 'complexity'
                ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white font-bold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Big-O Matrix</span>
          </button>
        </div>

        {activeTab === 'visualizer' && (
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline-block">
            Step through state & invariants
          </span>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {/* Tab 1: Algorithm Visualizers */}
        {activeTab === 'visualizer' && (
          <div className="space-y-4">
            {/* Visualizer Category Pill Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
              <button
                onClick={() => setSelectedVisualizer('array')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border shrink-0 transition-colors ${
                  selectedVisualizer === 'array'
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span>Searching & Pointers</span>
              </button>

              <button
                onClick={() => setSelectedVisualizer('sorting')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border shrink-0 transition-colors ${
                  selectedVisualizer === 'sorting'
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span>Sorting Animations</span>
              </button>

              <button
                onClick={() => setSelectedVisualizer('recursion')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border shrink-0 transition-colors ${
                  selectedVisualizer === 'recursion'
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <GitBranch className="w-3 h-3" />
                <span>Recursion & Stack</span>
              </button>

              <button
                onClick={() => setSelectedVisualizer('linkedlist')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border shrink-0 transition-colors ${
                  selectedVisualizer === 'linkedlist'
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <GitCommit className="w-3 h-3" />
                <span>Linked List</span>
              </button>

              <button
                onClick={() => setSelectedVisualizer('tree')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border shrink-0 transition-colors ${
                  selectedVisualizer === 'tree'
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Network className="w-3 h-3" />
                <span>Binary Trees</span>
              </button>

              <button
                onClick={() => setSelectedVisualizer('dp')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border shrink-0 transition-colors ${
                  selectedVisualizer === 'dp'
                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>Dynamic Programming</span>
              </button>
            </div>

            {/* Selected Visualizer Canvas */}
            {selectedVisualizer === 'array' && <ArrayPointersVisualizer />}
            {selectedVisualizer === 'sorting' && <SortingVisualizer />}
            {selectedVisualizer === 'recursion' && <RecursionTreeVisualizer />}
            {selectedVisualizer === 'linkedlist' && <LinkedListVisualizer />}
            {selectedVisualizer === 'tree' && <TreeGraphVisualizer />}
            {selectedVisualizer === 'dp' && <DpGridVisualizer />}
          </div>
        )}

        {/* Tab 2: Code Sandbox & Monaco Editor */}
        {activeTab === 'code' && (
          <div className="flex flex-col h-full space-y-3">
            {/* Language & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Language:</span>
                <select
                  value={codeLanguage}
                  onChange={e => handleLanguageChange(e.target.value)}
                  className="text-xs font-mono font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ (C++20)</option>
                  <option value="java">Java 17</option>
                  <option value="c">C (C11)</option>
                  <option value="javascript">JavaScript (ES6)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {onSendCodeToTutor && (
                  <button
                    onClick={() => onSendCodeToTutor(code, codeLanguage)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors shadow-sm"
                    title="Send code to Gnani for voice explanation or review"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Gnani to Inspect</span>
                  </button>
                )}

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-64 sm:h-72">
              <MonacoCodeEditor
                key={`${codeLanguage}-${code.slice(0, 20)}`}
                initialCode={code}
                language={codeLanguage === 'c' ? 'cpp' : (codeLanguage as any)}
                onCodeChange={val => setCode(val)}
                height="100%"
              />
            </div>

            {/* Sandbox Terminal Output */}
            {sandboxOutput && (
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1 border-b border-zinc-800">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-emerald-400" /> Output Terminal
                  </span>
                  {sandboxOutput.timeMs !== undefined && (
                    <span>Executed in {sandboxOutput.timeMs}ms</span>
                  )}
                </div>
                {sandboxOutput.stdout && (
                  <pre className="whitespace-pre-wrap text-emerald-300 font-mono text-xs">
                    {sandboxOutput.stdout}
                  </pre>
                )}
                {sandboxOutput.stderr && (
                  <pre className="whitespace-pre-wrap text-rose-400 font-mono text-xs">
                    {sandboxOutput.stderr}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Big-O Complexity Matrix */}
        {activeTab === 'complexity' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="p-2.5">Data Structure / Algorithm</th>
                    <th className="p-2.5">Time (Average)</th>
                    <th className="p-2.5">Time (Worst)</th>
                    <th className="p-2.5">Space (Worst)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  <tr>
                    <td className="p-2.5 font-bold">Array Indexing</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">O(1)</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400">O(1)</td>
                    <td className="p-2.5">O(N)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Binary Search</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">O(log N)</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400">O(log N)</td>
                    <td className="p-2.5">O(1)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Hash Map (Lookup / Insert)</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">O(1)</td>
                    <td className="p-2.5 text-rose-500">O(N) [Collisions]</td>
                    <td className="p-2.5">O(N)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">QuickSort</td>
                    <td className="p-2.5 text-indigo-600 dark:text-indigo-400">O(N log N)</td>
                    <td className="p-2.5 text-rose-500">O(N^2) [Bad Pivot]</td>
                    <td className="p-2.5">O(log N) stack</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">MergeSort</td>
                    <td className="p-2.5 text-indigo-600 dark:text-indigo-400">O(N log N)</td>
                    <td className="p-2.5 text-indigo-600 dark:text-indigo-400">O(N log N)</td>
                    <td className="p-2.5 text-amber-500">O(N) auxiliary</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Binary Search Tree (BST)</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400">O(log N)</td>
                    <td className="p-2.5 text-rose-500">O(N) [Degenerate]</td>
                    <td className="p-2.5">O(N)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Graph BFS / DFS</td>
                    <td className="p-2.5 text-indigo-600 dark:text-indigo-400">O(V + E)</td>
                    <td className="p-2.5 text-indigo-600 dark:text-indigo-400">O(V + E)</td>
                    <td className="p-2.5">O(V)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
