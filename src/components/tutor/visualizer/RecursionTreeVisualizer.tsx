import React, { useState } from 'react';
import { Play, RotateCcw, ChevronRight, ChevronLeft, Layers, GitBranch, ArrowDown } from 'lucide-react';

interface CallFrame {
  id: string;
  name: string;
  arg: number;
  returnValue?: number;
  status: 'calling' | 'returned' | 'base-case';
  depth: number;
}

interface RecursionStep {
  activeNodeId: string;
  callStack: CallFrame[];
  description: string;
  insight: string;
}

export const RecursionTreeVisualizer: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Fibonacci(4) complete recursion trace
  const steps: RecursionStep[] = [
    {
      activeNodeId: 'fib4',
      callStack: [{ id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' }],
      description: 'Initial Call: fib(4) pushed onto call stack. n > 1, so it must compute fib(3) + fib(2).',
      insight: 'Recursion requires stack memory O(N) proportional to the maximum tree depth.',
    },
    {
      activeNodeId: 'fib3',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' },
        { id: 'fib3', name: 'fib', arg: 3, depth: 1, status: 'calling' },
      ],
      description: 'Push fib(3): Invoking left child of fib(4). Still > 1, so must compute fib(2) + fib(1).',
      insight: 'The call stack pauses fib(4) execution until fib(3) returns a value.',
    },
    {
      activeNodeId: 'fib2_left',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' },
        { id: 'fib3', name: 'fib', arg: 3, depth: 1, status: 'calling' },
        { id: 'fib2_left', name: 'fib', arg: 2, depth: 2, status: 'calling' },
      ],
      description: 'Push fib(2): Invoking left child of fib(3). Requires fib(1) + fib(0).',
      insight: 'Stack depth is now 3. Tree branching depth increases.',
    },
    {
      activeNodeId: 'fib1_left1',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' },
        { id: 'fib3', name: 'fib', arg: 3, depth: 1, status: 'calling' },
        { id: 'fib2_left', name: 'fib', arg: 2, depth: 2, status: 'calling' },
        { id: 'fib1_left1', name: 'fib', arg: 1, depth: 3, status: 'base-case', returnValue: 1 },
      ],
      description: 'BASE CASE HIT! fib(1) returns 1 immediately. No further branching required.',
      insight: 'Base cases prevent stack overflow and terminate branches.',
    },
    {
      activeNodeId: 'fib0_left1',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' },
        { id: 'fib3', name: 'fib', arg: 3, depth: 1, status: 'calling' },
        { id: 'fib2_left', name: 'fib', arg: 2, depth: 2, status: 'calling' },
        { id: 'fib0_left1', name: 'fib', arg: 0, depth: 3, status: 'base-case', returnValue: 0 },
      ],
      description: 'BASE CASE HIT! fib(0) returns 0. Both operands for fib(2) are now computed.',
      insight: 'fib(2) evaluates: 1 + 0 = 1.',
    },
    {
      activeNodeId: 'fib2_left',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' },
        { id: 'fib3', name: 'fib', arg: 3, depth: 1, status: 'calling' },
        { id: 'fib2_left', name: 'fib', arg: 2, depth: 2, status: 'returned', returnValue: 1 },
      ],
      description: 'fib(2) returns 1 and pops from call stack back to fib(3).',
      insight: 'Now fib(3) computes its right branch: fib(1).',
    },
    {
      activeNodeId: 'fib1_left2',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' },
        { id: 'fib3', name: 'fib', arg: 3, depth: 1, status: 'calling' },
        { id: 'fib1_left2', name: 'fib', arg: 1, depth: 2, status: 'base-case', returnValue: 1 },
      ],
      description: 'fib(1) base case returns 1. fib(3) computes: fib(2) [1] + fib(1) [1] = 2.',
      insight: 'Left subtree for fib(3) is now fully resolved.',
    },
    {
      activeNodeId: 'fib3',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' },
        { id: 'fib3', name: 'fib', arg: 3, depth: 1, status: 'returned', returnValue: 2 },
      ],
      description: 'fib(3) returns 2 to fib(4). Now fib(4) must compute right child: fib(2).',
      insight: 'Notice we already computed fib(2) before! Without memoization, we recalculate it.',
    },
    {
      activeNodeId: 'fib2_right',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'calling' },
        { id: 'fib2_right', name: 'fib', arg: 2, depth: 1, status: 'calling' },
      ],
      description: 'REDUNDANT SUBPROBLEM: fib(2) called again! Branches into fib(1) + fib(0).',
      insight: 'This overlapping subproblem tree is why naive Fibonacci is O(2^N) exponential time!',
    },
    {
      activeNodeId: 'fib4',
      callStack: [
        { id: 'fib4', name: 'fib', arg: 4, depth: 0, status: 'returned', returnValue: 3 },
      ],
      description: 'FINAL RESOLUTION: fib(4) computes fib(3) [2] + fib(2) [1] = 3. Tree complete!',
      insight: 'Dynamic Programming / Memoization would cache fib(2) and eliminate half the tree.',
    },
  ];

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-indigo-500" /> Recursion Tree: fib(4)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
            O(2^N) Naive vs O(N) DP
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-500 px-1">
            {currentStepIndex + 1}/{steps.length}
          </span>
          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIndex >= steps.length - 1}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-500"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visualizer: Tree Diagram + Call Stack Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Visual Tree (2 cols on md) */}
        <div className="md:col-span-2 p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center min-h-[240px]">
          {/* Level 0: fib(4) */}
          <div className="flex flex-col items-center mb-4">
            <div
              className={`w-14 h-10 rounded-xl border-2 flex items-center justify-center font-mono text-xs font-bold transition-all ${
                currentStep.activeNodeId === 'fib4'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30 scale-110'
                  : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
              }`}
            >
              fib(4)
            </div>
            <div className="w-32 border-b border-zinc-300 dark:border-zinc-700 mt-2" />
          </div>

          {/* Level 1: fib(3) and fib(2) */}
          <div className="grid grid-cols-2 gap-12 sm:gap-20 mb-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-14 h-10 rounded-xl border-2 flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentStep.activeNodeId.startsWith('fib3')
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-105'
                    : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                fib(3)
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-14 h-10 rounded-xl border-2 flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  currentStep.activeNodeId === 'fib2_right'
                    ? 'bg-amber-500 text-white border-amber-300 shadow-md scale-105 animate-pulse'
                    : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                fib(2)
              </div>
              {currentStep.activeNodeId === 'fib2_right' && (
                <span className="text-[9px] font-mono font-bold text-amber-500 mt-0.5">REDUNDANT!</span>
              )}
            </div>
          </div>

          {/* Level 2: Sub-branches */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className={`p-1.5 rounded-lg border text-[11px] font-mono font-semibold ${
              currentStep.activeNodeId === 'fib2_left' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}>fib(2)</div>
            <div className={`p-1.5 rounded-lg border text-[11px] font-mono font-semibold ${
              currentStep.activeNodeId === 'fib1_left2' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}>fib(1)</div>
            <div className={`p-1.5 rounded-lg border text-[11px] font-mono font-semibold ${
              currentStep.activeNodeId === 'fib1_left1' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}>fib(1)</div>
            <div className={`p-1.5 rounded-lg border text-[11px] font-mono font-semibold ${
              currentStep.activeNodeId === 'fib0_left1' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}>fib(0)</div>
          </div>
        </div>

        {/* Live Call Stack (1 col) */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 mb-2.5 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Call Stack (LIFO)</span>
              <span className="ml-auto text-[10px] text-zinc-400">{currentStep.callStack.length} Frames</span>
            </div>

            <div className="space-y-1.5 flex flex-col-reverse">
              {currentStep.callStack.map((frame, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border text-xs font-mono transition-all ${
                    idx === currentStep.callStack.length - 1
                      ? 'bg-indigo-500/15 border-indigo-400 text-indigo-600 dark:text-indigo-300 font-bold shadow-sm'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{frame.name}({frame.arg})</span>
                    <span className="text-[10px] uppercase opacity-75">
                      {frame.returnValue !== undefined ? `ret: ${frame.returnValue}` : frame.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Frame #{idx} • Depth {frame.depth}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-400">
            Stack Memory: O(depth) • Max Depth: 4
          </div>
        </div>
      </div>

      {/* Narrative & Invariant Insight */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
        <p className="text-zinc-900 dark:text-zinc-100 font-medium">
          {currentStep.description}
        </p>
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-mono text-[11px]">
          💡 <strong>Professor's Invariant:</strong> {currentStep.insight}
        </div>
      </div>
    </div>
  );
};
