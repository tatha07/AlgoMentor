import { CoderArchetype, FiveDayDayData, FiveDayJourneyState, ProblemDifficulty } from '../types';

export interface ArchetypeInfo {
  id: CoderArchetype;
  title: string;
  badgeLabel: string;
  tagline: string;
  gradient: string;
  badgeColor: string;
  description: string;
  typicalTraits: string[];
  recommendedFocus: string;
  targetTopics: string[];
}

export const ARCHETYPE_PROFILES: Record<CoderArchetype, ArchetypeInfo> = {
  beginner: {
    id: 'beginner',
    title: 'Beginner Coder',
    badgeLabel: 'Foundations Pathfinder',
    tagline: 'Mastering algorithmic syntax, linear scans, and core memory invariants',
    gradient: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
    description: 'You have a grasp of core programming mechanics (loops, conditionals, arrays) and are developing your mental model for algorithmic complexity and time-space trade-offs.',
    typicalTraits: [
      'Relies on brute-force O(N²) nested loops before discovering hash lookups',
      'Benefits from step-by-step visual breakdowns and progressive hints',
      'Comfortable with simple array traversals, string reversals, and basic conditionals',
      'Building confidence in edge cases (empty lists, single elements, null boundaries)'
    ],
    recommendedFocus: 'Focus on Day 1 & 2: Hash maps for O(1) lookups and Two-Pointer convergence techniques.',
    targetTopics: ['Arrays & Hashing', 'Two Pointers', 'Simple Recursion']
  },
  intermediate: {
    id: 'intermediate',
    title: 'Intermediate Coder',
    badgeLabel: 'Algorithmic Builder',
    tagline: 'Proficient in Two Pointers, Binary Search, Trees, and Logarithmic Thinking',
    gradient: 'from-indigo-600 to-violet-600',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30',
    description: 'You intuitively recognize common patterns like Sliding Windows, Binary Search, and Tree Traversals. You write clean modular code and instinctively optimize from O(N²) down to O(N log N) or O(N).',
    typicalTraits: [
      'Detects whether a problem is two-pointer, frequency map, or binary search within 2 minutes',
      'Handles tree recursions (DFS/BFS) and binary search boundaries without off-by-one errors',
      'Actively balances time vs auxiliary space complexity',
      'Ready to tackle graph topologies and introduction to dynamic programming memoization'
    ],
    recommendedFocus: 'Focus on Day 3 & 4: Deep recursion trees, 2D Grid BFS/DFS, and cycle detection.',
    targetTopics: ['Binary Search', 'Sliding Window', 'Binary Trees', 'Graphs BFS/DFS']
  },
  extraordinary: {
    id: 'extraordinary',
    title: 'Extraordinary Coder',
    badgeLabel: 'Elite Algorithmic Architect',
    tagline: 'Dominating Dynamic Programming, Graph Topologies, and Sub-Millisecond Big-O',
    gradient: 'from-amber-500 via-rose-500 to-purple-600',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
    description: 'You operate at FAANG Staff/L6 algorithmic calibration. You formulate DP state transitions effortlessly, optimize memory from O(N) to O(1) rolling variables, and produce defect-free code on the first attempt.',
    typicalTraits: [
      'Identifies optimal substructure and overlapping subproblems in under 60 seconds',
      'Writes space-optimized Dynamic Programming solutions and Dijkstra/Topological sorts with ease',
      'Handles complex invariant states, monotonicity, and bit manipulation tricks',
      'Scores in the top 5% of technical interview and contest benchmarks'
    ],
    recommendedFocus: 'Conquer Day 5: Multi-dimensional DP, Hard LeetCode patterns, and mock FAANG interview challenges.',
    targetTopics: ['Dynamic Programming', 'Advanced Graphs', 'Trie & Segment Trees', 'System-Level Invariants']
  }
};

export const FIVE_DAY_CURRICULUM: Omit<FiveDayDayData, 'completed' | 'score' | 'notes' | 'completedAt'>[] = [
  {
    day: 1,
    title: 'Day 1: Complexity Diagnostics & Hash Lookups',
    theme: 'Foundations & Complexity Analysis',
    objective: 'Transform brute-force O(N²) quadratic nested loops into lightning-fast O(N) single-pass dictionary/hash lookups.',
    keyConcepts: [
      'Big-O Space vs Time Trade-offs',
      'Single-pass Hash Map Invariant',
      'Array Memory Contiguity & Cache Lines',
      'Boundary Checks & Negative Value Traps'
    ],
    recommendedProblemId: 'two-sum',
    recommendedProblemTitle: 'Two Sum',
    difficulty: 'easy',
    archetypeFocus: 'beginner'
  },
  {
    day: 2,
    title: 'Day 2: Two Pointers & Sliding Window Invariants',
    theme: 'Subarrays & Pointer Contraction',
    objective: 'Master converging pointers and dynamic sliding window boundaries to analyze linear structures without allocating extra buffers.',
    keyConcepts: [
      'Left & Right Converging Pointers',
      'Dynamic Sliding Window Expansion & Shrinkage',
      'Monotonicity Pruning',
      'Substrings without Repeating Characters'
    ],
    recommendedProblemId: 'container-with-most-water',
    recommendedProblemTitle: 'Container With Most Water',
    difficulty: 'medium',
    archetypeFocus: 'beginner'
  },
  {
    day: 3,
    title: 'Day 3: Binary Search Boundaries & Tree Traversals',
    theme: 'Logarithmic Divide & Conquer',
    objective: 'Eliminate off-by-one errors in binary search while mastering recursive tree exploration (DFS pre/in/post order and BFS level order).',
    keyConcepts: [
      'Safe Midpoint Calculation: low + (high - low) // 2',
      'Rotated Sorted Array Partitioning Logic',
      'Call Stack Invariants & Recursion Base Cases',
      'Tree Symmetry, Inversion, and Diameter'
    ],
    recommendedProblemId: 'search-in-rotated-sorted-array',
    recommendedProblemTitle: 'Search in Rotated Sorted Array',
    difficulty: 'medium',
    archetypeFocus: 'intermediate'
  },
  {
    day: 4,
    title: 'Day 4: Graph Topologies, Grid BFS & DFS',
    theme: 'Connected Components & Graph Traversal',
    objective: 'Navigate multidimensional matrices and adjacency lists with clean visited state tracking, queue-based BFS, and cycle detection.',
    keyConcepts: [
      '4-Directional Delta Arrays: [-1, 0, 1, 0] / [0, 1, 0, -1]',
      'Matrix Visited In-Place Modification vs Visited Sets',
      'Breadth-First Queue vs Depth-First Recursion Stack',
      'Shortest Path Invariants in Unweighted Graphs'
    ],
    recommendedProblemId: 'number-of-islands',
    recommendedProblemTitle: 'Number of Islands',
    difficulty: 'medium',
    archetypeFocus: 'intermediate'
  },
  {
    day: 5,
    title: 'Day 5: Dynamic Programming & Elite Invariants',
    theme: 'Optimal Substructure & State Transitions',
    objective: 'Formulate recurrence relations, build memoization tables, and optimize space down from O(N) to O(1) rolling states.',
    keyConcepts: [
      'Overlapping Subproblems vs Optimal Substructure',
      'Top-Down Memoization vs Bottom-Up Tabulation',
      'Coin Change Minimum Coin Formulation: dp[i] = min(dp[i], dp[i - coin] + 1)',
      'Sub-Millisecond Optimizations & Edge Case Elimination'
    ],
    recommendedProblemId: 'coin-change',
    recommendedProblemTitle: 'Coin Change',
    difficulty: 'medium',
    archetypeFocus: 'extraordinary'
  }
];

export const INITIAL_FIVE_DAY_JOURNEY: FiveDayJourneyState = {
  currentDay: 1,
  assessedArchetype: 'intermediate',
  overallScore: 50,
  days: {
    1: { completed: false, score: 0 },
    2: { completed: false, score: 0 },
    3: { completed: false, score: 0 },
    4: { completed: false, score: 0 },
    5: { completed: false, score: 0 }
  },
  skills: {
    algorithmicThinking: 55,
    bigOOptimization: 50,
    dataStructures: 52,
    edgeCaseMastery: 48,
    problemVelocity: 50
  },
  summary: 'Your 5-Day Coding Journey has started. Complete Day 1 to calibrate your initial archetype rating!'
};

/**
 * Calculates user archetype, skill ratings, and evaluation summary
 * based on completed 5-day journey tasks and problem count.
 */
export function calculateArchetypeFromJourney(
  days: Record<number, { completed: boolean; score: number }>,
  solvedProblemsCount: number,
  hardProblemsCount: number
): {
  archetype: CoderArchetype;
  overallScore: number;
  skills: FiveDayJourneyState['skills'];
  summary: string;
} {
  let completedCount = 0;
  let scoreSum = 0;

  for (let d = 1; d <= 5; d++) {
    const day = days[d];
    if (day?.completed) {
      completedCount++;
      scoreSum += Math.max(day.score || 80, 50);
    }
  }

  const averageDayScore = completedCount > 0 ? scoreSum / completedCount : 50;

  // Base score heavily weighted by journey progress (50%) + average performance (30%) + solved problems (20%)
  const journeyWeight = (completedCount / 5) * 50;
  const performanceWeight = (averageDayScore / 100) * 30;
  const problemWeight = Math.min(20, solvedProblemsCount * 3 + hardProblemsCount * 5);

  const overallScore = Math.min(100, Math.round(journeyWeight + performanceWeight + problemWeight));

  // Determine Archetype
  let archetype: CoderArchetype = 'beginner';
  let summary = '';

  if (overallScore >= 78 || (completedCount >= 4 && hardProblemsCount >= 1) || days[5]?.completed) {
    archetype = 'extraordinary';
    summary = `Calibrated as an Extraordinary Coder (${overallScore}/100). You demonstrate mastery across Dynamic Programming, complex invariant states, and elite Big-O efficiency!`;
  } else if (overallScore >= 42 || completedCount >= 2 || solvedProblemsCount >= 3) {
    archetype = 'intermediate';
    summary = `Calibrated as an Intermediate Coder (${overallScore}/100). Strong competence in Two Pointers, Trees, and Divide & Conquer. Ready to bridge into elite Dynamic Programming.`;
  } else {
    archetype = 'beginner';
    summary = `Calibrated as a Beginner Coder (${overallScore}/100). Building rock-solid algorithmic foundations, single-pass hash lookups, and complexity awareness.`;
  }

  const skills = {
    algorithmicThinking: Math.min(99, Math.round(overallScore * 0.95 + completedCount * 2)),
    bigOOptimization: Math.min(99, Math.round(overallScore * 0.92 + (days[1]?.completed ? 8 : 0))),
    dataStructures: Math.min(99, Math.round(overallScore * 0.98 + (days[3]?.completed ? 10 : 0))),
    edgeCaseMastery: Math.min(99, Math.round(overallScore * 0.88 + (days[2]?.completed ? 6 : 0))),
    problemVelocity: Math.min(99, Math.round(overallScore * 0.9 + Math.min(12, solvedProblemsCount * 2)))
  };

  return {
    archetype,
    overallScore,
    skills,
    summary
  };
}
