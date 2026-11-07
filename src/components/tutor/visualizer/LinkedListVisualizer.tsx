import React, { useState } from 'react';
import { ArrowRight, RotateCcw, ChevronRight, ChevronLeft, GitCommit, Check } from 'lucide-react';

interface ListNode {
  val: number;
  nextIndex: number | null;
}

interface LinkedListStep {
  nodes: ListNode[];
  prevIndex: number | null;
  currIndex: number | null;
  nextIndex: number | null;
  description: string;
  stepName: string;
}

export const LinkedListVisualizer: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Trace for reversing a linked list: 1 -> 2 -> 3 -> 4 -> null
  const steps: LinkedListStep[] = [
    {
      nodes: [
        { val: 1, nextIndex: 1 },
        { val: 2, nextIndex: 2 },
        { val: 3, nextIndex: 3 },
        { val: 4, nextIndex: null },
      ],
      prevIndex: null,
      currIndex: 0,
      nextIndex: null,
      stepName: 'Initialization',
      description: 'Initialize: prev = null, curr = head (Node 1). We want to reverse pointers in O(N) time and O(1) space.',
    },
    {
      nodes: [
        { val: 1, nextIndex: 1 },
        { val: 2, nextIndex: 2 },
        { val: 3, nextIndex: 3 },
        { val: 4, nextIndex: null },
      ],
      prevIndex: null,
      currIndex: 0,
      nextIndex: 1,
      stepName: 'Save Next Pointer',
      description: 'next = curr.next (Save Node 2 before we sever the link, otherwise we lose the rest of the list!).',
    },
    {
      nodes: [
        { val: 1, nextIndex: null }, // reversed to prev (null)
        { val: 2, nextIndex: 2 },
        { val: 3, nextIndex: 3 },
        { val: 4, nextIndex: null },
      ],
      prevIndex: null,
      currIndex: 0,
      nextIndex: 1,
      stepName: 'Reverse Link',
      description: 'curr.next = prev: Node 1 now points to null (it will become the new tail).',
    },
    {
      nodes: [
        { val: 1, nextIndex: null },
        { val: 2, nextIndex: 2 },
        { val: 3, nextIndex: 3 },
        { val: 4, nextIndex: null },
      ],
      prevIndex: 0,
      currIndex: 1,
      nextIndex: 2,
      stepName: 'Advance Pointers',
      description: 'Advance: prev = curr (Node 1), curr = next (Node 2). Next iteration begins.',
    },
    {
      nodes: [
        { val: 1, nextIndex: null },
        { val: 2, nextIndex: 0 }, // reversed to Node 1
        { val: 3, nextIndex: 3 },
        { val: 4, nextIndex: null },
      ],
      prevIndex: 1,
      currIndex: 2,
      nextIndex: 3,
      stepName: 'Reverse Node 2 Link',
      description: 'curr.next = prev: Node 2 now points back to Node 1. Advance prev = 2, curr = 3.',
    },
    {
      nodes: [
        { val: 1, nextIndex: null },
        { val: 2, nextIndex: 0 },
        { val: 3, nextIndex: 1 }, // reversed to Node 2
        { val: 4, nextIndex: null },
      ],
      prevIndex: 2,
      currIndex: 3,
      nextIndex: null,
      stepName: 'Reverse Node 3 Link',
      description: 'curr.next = prev: Node 3 points to Node 2. Next pointer for Node 4 is saved as null.',
    },
    {
      nodes: [
        { val: 1, nextIndex: null },
        { val: 2, nextIndex: 0 },
        { val: 3, nextIndex: 1 },
        { val: 4, nextIndex: 2 }, // reversed to Node 3
      ],
      prevIndex: 3,
      currIndex: null,
      nextIndex: null,
      stepName: 'Finished (curr == null)',
      description: 'curr is now null. Loop terminates. prev points to Node 4, which is the new HEAD of the reversed list!',
    },
  ];

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-orange-500" /> Reversing Singly Linked List
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            O(N) Time • O(1) Space
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

      {/* Visual Canvas */}
      <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center min-h-[200px]">
        {/* Pointer Labels */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2 w-full overflow-x-auto pb-1">
          <div className="flex flex-col items-center w-16">
            {currentStep.prevIndex === null ? (
              <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                prev: NULL
              </span>
            ) : null}
          </div>

          {[0, 1, 2, 3].map(idx => {
            const isPrev = currentStep.prevIndex === idx;
            const isCurr = currentStep.currIndex === idx;
            const isNext = currentStep.nextIndex === idx;

            return (
              <div key={idx} className="flex flex-col items-center w-20">
                <div className="flex items-center gap-1">
                  {isPrev && (
                    <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-100 dark:bg-amber-950/60 px-1 rounded">
                      PREV
                    </span>
                  )}
                  {isCurr && (
                    <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-100 dark:bg-orange-950/60 px-1 rounded">
                      CURR
                    </span>
                  )}
                  {isNext && (
                    <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-950/60 px-1 rounded">
                      NEXT
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nodes and Pointers Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full overflow-x-auto py-3">
          {[0, 1, 2, 3].map((nodeIdx, i) => {
            const node = currentStep.nodes[nodeIdx];
            const isCurr = currentStep.currIndex === nodeIdx;
            const isPrev = currentStep.prevIndex === nodeIdx;

            let borderStyle = 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900';
            if (isCurr) {
              borderStyle = 'border-orange-500 bg-orange-500/10 shadow-md shadow-orange-500/20 scale-105';
            } else if (isPrev) {
              borderStyle = 'border-amber-500 bg-amber-500/10';
            }

            return (
              <React.Fragment key={nodeIdx}>
                {/* Node Box */}
                <div className={`flex items-center rounded-xl border-2 transition-all duration-300 ${borderStyle}`}>
                  <div className="w-10 h-12 flex items-center justify-center font-mono font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-700">
                    {node.val}
                  </div>
                  <div className="w-8 h-12 flex items-center justify-center font-mono text-[10px] text-zinc-400">
                    {node.nextIndex !== null ? `->${currentStep.nodes[node.nextIndex]?.val}` : 'null'}
                  </div>
                </div>

                {/* Arrow to next */}
                {i < 3 && (
                  <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Narrative Box */}
        <div className="mt-4 w-full p-3 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span>{currentStep.stepName}</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              STEP {currentStepIndex + 1}/{steps.length}
            </span>
          </div>
          <p className="text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
            {currentStep.description}
          </p>
        </div>
      </div>
    </div>
  );
};
