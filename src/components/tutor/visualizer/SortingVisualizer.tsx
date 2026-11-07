import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, ChevronRight, ChevronLeft } from 'lucide-react';

interface SortingStep {
  array: number[];
  comparing: number[]; // indices being compared
  swapping: number[];  // indices being swapped
  sorted: number[];    // indices confirmed in final sorted position
  description: string;
}

export const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection' | 'quick'>('bubble');
  const [array, setArray] = useState<number[]>([45, 12, 85, 32, 89, 39, 69, 22, 58]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(600);

  // Generate random array
  const generateNewArray = () => {
    setIsPlaying(false);
    const newArr = Array.from({ length: 9 }, () => Math.floor(Math.random() * 85) + 10);
    setArray(newArr);
    setCurrentStepIndex(0);
  };

  // Precompute Bubble Sort steps
  const generateBubbleSortSteps = (initial: number[]): SortingStep[] => {
    const list = [...initial];
    const stepsList: SortingStep[] = [];
    const n = list.length;
    const sortedIndices: number[] = [];

    stepsList.push({
      array: [...list],
      comparing: [],
      swapping: [],
      sorted: [],
      description: `Bubble Sort: Repeatedly step through list, compare adjacent elements and swap if out of order.`,
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        stepsList.push({
          array: [...list],
          comparing: [j, j + 1],
          swapping: [],
          sorted: [...sortedIndices],
          description: `Compare element at index ${j} (${list[j]}) with index ${j + 1} (${list[j + 1]}).`,
        });

        if (list[j] > list[j + 1]) {
          const temp = list[j];
          list[j] = list[j + 1];
          list[j + 1] = temp;

          stepsList.push({
            array: [...list],
            comparing: [],
            swapping: [j, j + 1],
            sorted: [...sortedIndices],
            description: `${temp} > ${list[j]}, swap them! Largest element bubbles toward the end.`,
          });
        }
      }
      sortedIndices.push(n - i - 1);
      stepsList.push({
        array: [...list],
        comparing: [],
        swapping: [],
        sorted: [...sortedIndices],
        description: `Pass complete. Index ${n - i - 1} (${list[n - i - 1]}) is guaranteed in its final sorted position.`,
      });
    }
    sortedIndices.push(0);
    stepsList.push({
      array: [...list],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      description: `Array is fully sorted! Time Complexity: O(N^2), Space Complexity: O(1) in-place.`,
    });

    return stepsList;
  };

  // Precompute Selection Sort steps
  const generateSelectionSortSteps = (initial: number[]): SortingStep[] => {
    const list = [...initial];
    const stepsList: SortingStep[] = [];
    const n = list.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      stepsList.push({
        array: [...list],
        comparing: [i],
        swapping: [],
        sorted: [...sortedIndices],
        description: `Looking for minimum element in unsorted subarray starting at index ${i}.`,
      });

      for (let j = i + 1; j < n; j++) {
        stepsList.push({
          array: [...list],
          comparing: [minIdx, j],
          swapping: [],
          sorted: [...sortedIndices],
          description: `Comparing current minimum ${list[minIdx]} with index ${j} (${list[j]}).`,
        });

        if (list[j] < list[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        const temp = list[i];
        list[i] = list[minIdx];
        list[minIdx] = temp;

        stepsList.push({
          array: [...list],
          comparing: [],
          swapping: [i, minIdx],
          sorted: [...sortedIndices],
          description: `Found minimum ${list[i]}. Swap with index ${i}.`,
        });
      }

      sortedIndices.push(i);
    }
    sortedIndices.push(n - 1);
    stepsList.push({
      array: [...list],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      description: `Selection Sort finished. Total comparisons: O(N^2), swaps: O(N).`,
    });

    return stepsList;
  };

  useEffect(() => {
    if (algorithm === 'bubble') {
      setSteps(generateBubbleSortSteps(array));
    } else {
      setSteps(generateSelectionSortSteps(array));
    }
    setCurrentStepIndex(0);
  }, [algorithm, array]);

  const currentStep = steps[Math.min(currentStepIndex, Math.max(0, steps.length - 1))] || {
    array,
    comparing: [],
    swapping: [],
    sorted: [],
    description: 'Ready to sort.',
  };

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speedMs]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <select
            value={algorithm}
            onChange={e => {
              setAlgorithm(e.target.value as any);
              setIsPlaying(false);
            }}
            className="text-xs font-mono font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none"
          >
            <option value="bubble">Bubble Sort (O(N^2))</option>
            <option value="selection">Selection Sort (O(N^2))</option>
          </select>

          <button
            onClick={generateNewArray}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-orange-500 transition-colors shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
            title="Step Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIndex >= steps.length - 1}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
            title="Step Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-500"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Bars Canvas */}
      <div className="p-4 md:p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-between min-h-[220px]">
        {/* Bars Container */}
        <div className="flex items-end justify-center gap-2 sm:gap-3 w-full h-36 pt-4">
          {currentStep.array.map((val, idx) => {
            const isComparing = currentStep.comparing.includes(idx);
            const isSwapping = currentStep.swapping.includes(idx);
            const isSorted = currentStep.sorted.includes(idx);

            let barColor = 'bg-orange-500/70 dark:bg-orange-500/50 border-orange-400';
            if (isSwapping) {
              barColor = 'bg-rose-500 border-rose-400 animate-pulse';
            } else if (isComparing) {
              barColor = 'bg-amber-500 border-amber-300 shadow-md shadow-amber-500/30';
            } else if (isSorted) {
              barColor = 'bg-emerald-500 border-emerald-400';
            }

            const heightPct = Math.max(15, (val / 100) * 100);

            return (
              <div key={idx} className="flex flex-col items-center flex-1 max-w-[48px]">
                <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  {val}
                </span>
                <div
                  className={`w-full rounded-t-lg border-t-2 border-x-2 transition-all duration-200 ${barColor}`}
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] font-mono text-zinc-400 mt-1">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Sorted</span>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="mt-3 w-full p-3 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400 uppercase">
              {currentStep.swapping.length > 0 ? 'SWAP OPERATION' : currentStep.comparing.length > 0 ? 'COMPARISON' : 'INVARIANT CHECK'}
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
