import React, { useState } from 'react';
import { Table, ChevronRight, ChevronLeft, RotateCcw, Cpu } from 'lucide-react';

export const DpGridVisualizer: React.FC = () => {
  const coins = [1, 2, 5];
  const targetAmount = 7;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Trace for Coin Change: coins = [1, 2, 5], amount = 7
  // dp[0..7]
  const steps = [
    {
      dp: [0, '∞', '∞', '∞', '∞', '∞', '∞', '∞'],
      activeAmount: 0,
      activeCoin: null,
      description: 'Base Case: dp[0] = 0 (0 coins required to form amount 0). All other amounts initialized to infinity (∞).',
      formula: 'dp[0] = 0',
    },
    {
      dp: [0, 1, '∞', '∞', '∞', '∞', '∞', '∞'],
      activeAmount: 1,
      activeCoin: 1,
      description: 'Amount 1 using coin 1: dp[1] = dp[1 - 1] + 1 = dp[0] + 1 = 1 coin.',
      formula: 'dp[1] = min(∞, dp[0] + 1) = 1',
    },
    {
      dp: [0, 1, 1, '∞', '∞', '∞', '∞', '∞'],
      activeAmount: 2,
      activeCoin: 2,
      description: 'Amount 2 using coin 2: dp[2] = min(dp[2 - 1] + 1, dp[2 - 2] + 1) = min(2, dp[0] + 1) = 1 coin.',
      formula: 'dp[2] = min(dp[1] + 1, dp[0] + 1) = 1',
    },
    {
      dp: [0, 1, 1, 2, '∞', '∞', '∞', '∞'],
      activeAmount: 3,
      activeCoin: 2,
      description: 'Amount 3 using coins [1, 2]: dp[3] = min(dp[2] + 1, dp[1] + 1) = 1 + 1 = 2 coins.',
      formula: 'dp[3] = min(dp[2] + 1, dp[1] + 1) = 2',
    },
    {
      dp: [0, 1, 1, 2, 2, '∞', '∞', '∞'],
      activeAmount: 4,
      activeCoin: 2,
      description: 'Amount 4 using coins [1, 2]: dp[4] = dp[4 - 2] + 1 = dp[2] + 1 = 2 coins (two 2s).',
      formula: 'dp[4] = dp[2] + 1 = 2',
    },
    {
      dp: [0, 1, 1, 2, 2, 1, '∞', '∞'],
      activeAmount: 5,
      activeCoin: 5,
      description: 'Amount 5 using coin 5: A single 5-cent coin! dp[5] = dp[5 - 5] + 1 = dp[0] + 1 = 1 coin.',
      formula: 'dp[5] = min(dp[4] + 1, dp[0] + 1) = 1',
    },
    {
      dp: [0, 1, 1, 2, 2, 1, 2, '∞'],
      activeAmount: 6,
      activeCoin: 5,
      description: 'Amount 6: We can take 5 + 1 => dp[6] = dp[6 - 5] + 1 = dp[1] + 1 = 2 coins.',
      formula: 'dp[6] = min(dp[5] + 1, dp[1] + 1) = 2',
    },
    {
      dp: [0, 1, 1, 2, 2, 1, 2, 2],
      activeAmount: 7,
      activeCoin: 5,
      description: 'Amount 7: dp[7] = dp[7 - 5] + 1 = dp[2] + 1 = 1 + 1 = 2 coins (5 + 2)! Optimal solution achieved in O(Amount * Coins).',
      formula: 'dp[7] = dp[2] + 1 = 2 coins (5 + 2)',
    },
  ];

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-orange-500" /> DP Tabulation: Coin Change (Target = 7)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30">
            Coins: [1, 2, 5]
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

      {/* DP Table */}
      <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
        <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2">
          dp[i] = Minimum coins needed to make amount i
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto w-full py-2">
          {currentStep.dp.map((val, amountIdx) => {
            const isActive = currentStep.activeAmount === amountIdx;
            const isFilled = val !== '∞';

            return (
              <div key={amountIdx} className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-zinc-400 mb-1">amt: {amountIdx}</span>
                <div
                  className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-600 text-white border-orange-400 shadow-lg shadow-orange-500/30 scale-110'
                      : isFilled
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-zinc-400 mt-1">dp[{amountIdx}]</span>
              </div>
            );
          })}
        </div>

        {/* Recurrence Formula Box */}
        <div className="mt-4 w-full p-3 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-orange-600 dark:text-orange-400 font-bold">
            <span>RECURRENCE TRANSITION</span>
            <span>{currentStep.formula}</span>
          </div>
          <p className="text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
            {currentStep.description}
          </p>
        </div>
      </div>
    </div>
  );
};
