import { JourneyBadge, FiveDayJourneyState, SolvedProblemRecord, CoderArchetype } from '../types';

export const FIVE_DAY_JOURNEY_BADGES: JourneyBadge[] = [
  {
    id: 'badge-day-1',
    moduleId: 1,
    title: 'Hash Invariant Specialist',
    name: 'Hash Specialist',
    description: 'Mastered Day 1 module: Eliminated O(N²) nested loops with O(1) single-pass dictionary lookup invariants.',
    category: 'module',
    icon: 'Hash',
    tier: 'bronze',
    unlocked: false,
    criteria: 'Complete Day 1 Module or solve Two Sum in the Practice Arena.',
    moduleName: 'Day 1: Complexity Diagnostics & Hash Lookups',
    rarity: 'Common (Foundations)',
    skillsGained: ['O(N) Hash Table Invariants', 'Array Memory Contiguity', 'Big-O Diagnostics']
  },
  {
    id: 'badge-day-2',
    moduleId: 2,
    title: 'Two-Pointer Convergence Master',
    name: 'Pointer Master',
    description: 'Mastered Day 2 module: Governed converging pointer bounds and dynamic sliding windows without auxiliary buffer allocation.',
    category: 'module',
    icon: 'Sliders',
    tier: 'bronze',
    unlocked: false,
    criteria: 'Complete Day 2 Module or solve Container With Most Water.',
    moduleName: 'Day 2: Two Pointers & Sliding Window Invariants',
    rarity: 'Uncommon',
    skillsGained: ['Converging Pointers', 'Sliding Window Contraction', 'Monotonic Bounds']
  },
  {
    id: 'badge-day-3',
    moduleId: 3,
    title: 'Binary Divide & Conquerer',
    name: 'Binary Conquerer',
    description: 'Mastered Day 3 module: Eliminated off-by-one errors in rotated logarithmic intervals and handled tree DFS/BFS traversals.',
    category: 'module',
    icon: 'GitBranch',
    tier: 'silver',
    unlocked: false,
    criteria: 'Complete Day 3 Module or solve Search in Rotated Sorted Array.',
    moduleName: 'Day 3: Binary Search Boundaries & Tree Traversals',
    rarity: 'Rare',
    skillsGained: ['Logarithmic Halving', 'Tree Recursion Stack', 'Safe Midpoint Calculation']
  },
  {
    id: 'badge-day-4',
    moduleId: 4,
    title: 'Graph Topology Pioneer',
    name: 'Topology Pioneer',
    description: 'Mastered Day 4 module: Navigated multidimensional matrices, cycle detection, and queue-driven shortest path algorithms.',
    category: 'module',
    icon: 'Network',
    tier: 'silver',
    unlocked: false,
    criteria: 'Complete Day 4 Module or solve Number of Islands.',
    moduleName: 'Day 4: Graph Topologies, Grid BFS & DFS',
    rarity: 'Epic',
    skillsGained: ['4-Directional Delta Scan', 'Visited Set In-Place Marking', 'Connected Components']
  },
  {
    id: 'badge-day-5',
    moduleId: 5,
    title: 'Dynamic Programming Architect',
    name: 'DP Architect',
    description: 'Mastered Day 5 module: Formulated recurrence relations, memoized overlapping subproblems, and optimized space down to O(1) rolling states.',
    category: 'module',
    icon: 'Sparkles',
    tier: 'gold',
    unlocked: false,
    criteria: 'Complete Day 5 Module or solve Coin Change.',
    moduleName: 'Day 5: Dynamic Programming & Elite Invariants',
    rarity: 'Legendary',
    skillsGained: ['Optimal Substructure', 'Recurrence Relations', 'Space-Rolling DP Tables']
  },
  {
    id: 'badge-journey-complete',
    moduleId: 0,
    title: 'Grandmaster of Invariants',
    name: 'Journey Legend',
    description: 'Conquered the entire 5-day algorithmic curriculum! You have calibrated your skills across linear scans, logarithmic cuts, graphs, and dynamic programming.',
    category: 'mastery',
    icon: 'Trophy',
    tier: 'diamond',
    unlocked: false,
    criteria: 'Complete all 5 module milestones in your 5-Day Coding Journey.',
    moduleName: 'Full 5-Day Journey Calibration',
    rarity: 'Mythic',
    skillsGained: ['Holistic Pattern Recognition', 'FAANG-Calibrated Speed', 'Zero-Defect Code Velocity']
  },
  {
    id: 'badge-archetype-extraordinary',
    moduleId: 0,
    title: 'Elite Algorithmic Architect',
    name: 'Extraordinary Coder',
    description: 'Calibrated into the top tier of problem solvers with Extraordinary Coder status.',
    category: 'archetype',
    icon: 'Crown',
    tier: 'diamond',
    unlocked: false,
    criteria: 'Attain Extraordinary Coder archetype calibration (Overall score >= 85 or solve hard problems).',
    moduleName: 'Archetype Calibration',
    rarity: 'Mythic',
    skillsGained: ['Sub-Millisecond Big-O Optimization', 'Staff+ Level Mental Models', 'Complex State Machines']
  },
  {
    id: 'badge-archetype-builder',
    moduleId: 0,
    title: 'Algorithmic Builder',
    name: 'Builder Archetype',
    description: 'Achieved Intermediate Coder archetype calibration with solid algorithmic foundation and logarithmic thinking.',
    category: 'archetype',
    icon: 'Cpu',
    tier: 'silver',
    unlocked: false,
    criteria: 'Calibrate as Intermediate Coder or complete 2+ journey modules.',
    moduleName: 'Archetype Calibration',
    rarity: 'Rare',
    skillsGained: ['Pattern Detection under 2 min', 'Big-O Trade-off Intuition', 'Clean Code Synthesis']
  },
  {
    id: 'badge-first-solve',
    moduleId: 0,
    title: 'First Code Submission',
    name: 'Code Pioneer',
    description: 'Executed and passed your first algorithmic problem in the Practice Arena.',
    category: 'mastery',
    icon: 'Flame',
    tier: 'bronze',
    unlocked: false,
    criteria: 'Solve at least 1 problem in the Monaco Practice Arena.',
    moduleName: 'Practice Arena',
    rarity: 'Common',
    skillsGained: ['Sandboxed Execution', 'Test-Driven Debugging', 'Boundary Testing']
  }
];

/**
 * Evaluates which badges have been earned by the user based on journey state, solved problems, and archetype.
 * Preserves existing unlock timestamps and marks newly earned badges.
 */
export function evaluateEarnedBadges(
  journey: FiveDayJourneyState | undefined,
  solvedProblems: SolvedProblemRecord[] = [],
  coderArchetype?: CoderArchetype,
  existingBadges: JourneyBadge[] = []
): JourneyBadge[] {
  const solvedProblemIds = new Set(solvedProblems.map(p => p.problemId));
  const existingMap = new Map<string, JourneyBadge>();
  existingBadges.forEach(b => existingMap.set(b.id, b));

  const day1Complete = !!journey?.days[1]?.completed || solvedProblemIds.has('two-sum');
  const day2Complete = !!journey?.days[2]?.completed || solvedProblemIds.has('container-with-most-water');
  const day3Complete = !!journey?.days[3]?.completed || solvedProblemIds.has('search-in-rotated-sorted-array');
  const day4Complete = !!journey?.days[4]?.completed || solvedProblemIds.has('number-of-islands');
  const day5Complete = !!journey?.days[5]?.completed || solvedProblemIds.has('coin-change');

  const all5DaysComplete = 
    (journey?.days[1]?.completed &&
     journey?.days[2]?.completed &&
     journey?.days[3]?.completed &&
     journey?.days[4]?.completed &&
     journey?.days[5]?.completed) ||
    (day1Complete && day2Complete && day3Complete && day4Complete && day5Complete);

  const isExtraordinary = 
    coderArchetype === 'extraordinary' || 
    (journey?.overallScore && journey.overallScore >= 85) ||
    solvedProblems.some(p => p.difficulty === 'hard');

  const isBuilder = 
    coderArchetype === 'intermediate' || 
    coderArchetype === 'extraordinary' ||
    [day1Complete, day2Complete, day3Complete, day4Complete, day5Complete].filter(Boolean).length >= 2;

  const hasSolvedAny = solvedProblems.length > 0;

  return FIVE_DAY_JOURNEY_BADGES.map(badge => {
    const existing = existingMap.get(badge.id);
    let shouldUnlock = false;

    switch (badge.id) {
      case 'badge-day-1':
        shouldUnlock = day1Complete;
        break;
      case 'badge-day-2':
        shouldUnlock = day2Complete;
        break;
      case 'badge-day-3':
        shouldUnlock = day3Complete;
        break;
      case 'badge-day-4':
        shouldUnlock = day4Complete;
        break;
      case 'badge-day-5':
        shouldUnlock = day5Complete;
        break;
      case 'badge-journey-complete':
        shouldUnlock = !!all5DaysComplete;
        break;
      case 'badge-archetype-extraordinary':
        shouldUnlock = !!isExtraordinary;
        break;
      case 'badge-archetype-builder':
        shouldUnlock = !!isBuilder;
        break;
      case 'badge-first-solve':
        shouldUnlock = hasSolvedAny;
        break;
      default:
        shouldUnlock = false;
    }

    if (existing?.unlocked) {
      return {
        ...badge,
        unlocked: true,
        unlockedAt: existing.unlockedAt || new Date().toISOString()
      };
    }

    if (shouldUnlock) {
      return {
        ...badge,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };
    }

    return {
      ...badge,
      unlocked: false,
      unlockedAt: undefined
    };
  });
}
