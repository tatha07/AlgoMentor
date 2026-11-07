import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Search, Sliders } from 'lucide-react';

interface ArrayPointersVisualizerProps {
  initialAlgorithm?: 'binary-search' | 'two-pointers' | 'sliding-window';
}

interface StepState {
  array: number[];
  left: number;
  right: number;
  mid?: number;
  highlightedIndices: number[];
  foundIndex?: number;
  description: string;
  codeLine: number;
}

export const ArrayPointersVisualizer: React.FC<ArrayPointersVisualizerProps> = ({
  initialAlgorithm = 'binary-search',
}) => {
  const [algorithm, setAlgorithm] = useState<'binary-search' | 'two-pointers' | 'sliding-window'>(initialAlgorithm);
  const [target, setTarget] = useState<number>(23);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeedMs, setPlaySpeedMs] = useState(1200);

  const initialArray = [3, 7, 11, 15, 19, 23, 29, 35, 42, 50];

  // Precompute steps for Binary Search
  const computeBinarySearchSteps = (arr: number[], searchTarget: number): StepState[] => {
    const steps: StepState[] = [];
    let l = 0;
    let r = arr.length - 1;

    steps.push({
      array: arr,
      left: l,
      right: r,
      highlightedIndices: [],
      description: `Initial State: Search space is entire array from index ${l} to ${r}. Target = ${searchTarget}.`,
      codeLine: 1,
    });

    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      const midVal = arr[mid];

      steps.push({
        array: arr,
        left: l,
        right: r,
        mid,
        highlightedIndices: [mid],
        description: `Calculated mid = floor((${l} + ${r}) / 2) = ${mid}. Checking arr[${mid}] = ${midVal}.`,
        codeLine: 3,
      });

      if (midVal === searchTarget) {
        steps.push({
          array: arr,
          left: l,
          right: r,
          mid,
          foundIndex: mid,
          highlightedIndices: [mid],
          description: `Target ${searchTarget} found at index ${mid}! O(log N) operations complete.`,
          codeLine: 4,
        });
        return steps;
      }

      if (midVal < searchTarget) {
        steps.push({
          array: arr,
          left: l,
          right: r,
          mid,
          highlightedIndices: [mid],
          description: `arr[${mid}] (${midVal}) < ${searchTarget}. Target must be in right half. Discard left half, move left = ${mid + 1}.`,
          codeLine: 6,
        });
        l = mid + 1;
      } else {
        steps.push({
          array: arr,
          left: l,
          right: r,
          mid,
          highlightedIndices: [mid],
          description: `arr[${mid}] (${midVal}) > ${searchTarget}. Target must be in left half. Discard right half, move right = ${mid - 1}.`,
          codeLine: 8,
        });
        r = mid - 1;
      }
    }

    steps.push({
      array: arr,
      left: l,
      right: r,
      highlightedIndices: [],
      description: `Search space exhausted (left > right). Target ${searchTarget} does not exist in array.`,
      codeLine: 10,
    });

    return steps;
  };

  // Precompute steps for Two Pointers (Two Sum on sorted array)
  const computeTwoPointersSteps = (arr: number[], searchTarget: number): StepState[] => {
    const steps: StepState[] = [];
    let l = 0;
    let r = arr.length - 1;

    steps.push({
      array: arr,
      left: l,
      right: r,
      highlightedIndices: [l, r],
      description: `Two Pointers initialized: Left at index 0 (${arr[0]}), Right at index ${r} (${arr[r]}). Target sum = ${searchTarget}.`,
      codeLine: 1,
    });

    while (l < r) {
      const sum = arr[l] + arr[r];
      steps.push({
        array: arr,
        left: l,
        right: r,
        highlightedIndices: [l, r],
        description: `Current sum = arr[${l}] (${arr[l]}) + arr[${r}] (${arr[r]}) = ${sum}. Compare with ${searchTarget}.`,
        codeLine: 3,
      });

      if (sum === searchTarget) {
        steps.push({
          array: arr,
          left: l,
          right: r,
          foundIndex: l,
          highlightedIndices: [l, r],
          description: `Pair found! arr[${l}] (${arr[l]}) + arr[${r}] (${arr[r]}) = ${searchTarget}.`,
          codeLine: 4,
        });
        return steps;
      }

      if (sum < searchTarget) {
        steps.push({
          array: arr,
          left: l,
          right: r,
          highlightedIndices: [l, r],
          description: `Sum ${sum} is too small (< ${searchTarget}). Increment Left to index ${l + 1} to increase sum.`,
          codeLine: 6,
        });
        l++;
      } else {
        steps.push({
          array: arr,
          left: l,
          right: r,
          highlightedIndices: [l, r],
          description: `Sum ${sum} is too large (> ${searchTarget}). Decrement Right to index ${r - 1} to decrease sum.`,
          codeLine: 8,
        });
        r--;
      }
    }

    steps.push({
      array: arr,
      left: l,
      right: r,
      highlightedIndices: [],
      description: `Pointers met (L >= R). No pair adds up to ${searchTarget}.`,
      codeLine: 10,
    });

    return steps;
  };

  const steps = algorithm === 'binary-search' 
    ? computeBinarySearchSteps(initialArray, target)
    : computeTwoPointersSteps(initialArray, target);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  // Auto-play timer
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
      }, playSpeedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playSpeedMs]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <select
            value={algorithm}
            onChange={e => {
              setAlgorithm(e.target.value as any);
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="text-xs font-mono font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none"
          >
            <option value="binary-search">Binary Search (O(log N))</option>
            <option value="two-pointers">Two Pointers: Target Sum (O(N))</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500 dark:text-zinc-400">Target:</span>
            <input
              type="number"
              value={target}
              onChange={e => {
                setTarget(Number(e.target.value));
                setCurrentStepIndex(0);
              }}
              className="w-16 px-2 py-1 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-orange-500 disabled:opacity-40"
            title="Step Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIndex >= steps.length - 1}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-orange-500 disabled:opacity-40"
            title="Step Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-500"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Array Canvas */}
      <div className="p-4 md:p-6 bg-white dark:bg-[#0c0d0e] rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center min-h-[180px]">
        {/* Pointers Row */}
        <div className="flex items-center justify-center gap-2 mb-2 w-full overflow-x-auto pb-1">
          {initialArray.map((_, idx) => {
            const isLeft = currentStep.left === idx;
            const isRight = currentStep.right === idx;
            const isMid = currentStep.mid === idx;

            return (
              <div key={idx} className="flex flex-col items-center w-10 sm:w-12 h-6">
                {isLeft && isRight ? (
                  <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-100 dark:bg-amber-950/60 px-1 rounded">L&R</span>
                ) : isMid ? (
                  <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-100 dark:bg-orange-950/60 px-1 rounded animate-bounce">MID</span>
                ) : isLeft ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-950/60 px-1 rounded">L</span>
                ) : isRight ? (
                  <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-100 dark:bg-rose-950/60 px-1 rounded">R</span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Array Cells */}
        <div className="flex items-center justify-center gap-2 w-full overflow-x-auto py-2">
          {initialArray.map((val, idx) => {
            const isInRange = idx >= currentStep.left && idx <= currentStep.right;
            const isMid = currentStep.mid === idx;
            const isFound = currentStep.foundIndex === idx;

            let cellBg = 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600';
            if (isFound) {
              cellBg = 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105';
            } else if (isMid) {
              cellBg = 'bg-orange-600 text-white border-orange-400 shadow-md shadow-orange-500/25 scale-105';
            } else if (isInRange) {
              cellBg = 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-500/40 font-bold';
            }

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center rounded-xl border-2 font-mono text-sm sm:text-base font-semibold transition-all duration-300 ${cellBg}`}
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-zinc-400 mt-1">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Step Indicator & Narrative */}
        <div className="mt-4 w-full p-3 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span className="font-bold text-orange-600 dark:text-orange-400">
              {currentStep.foundIndex !== undefined ? 'TARGET ACQUIRED' : 'ANALYZING INVARIANTS'}
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
