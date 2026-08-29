import { UserProfile } from '../types';

export const DEMO_PROFILES: Record<'newbie' | 'intermediate' | 'pro', UserProfile> = {
  newbie: {
    id: 'demo-newbie-user',
    name: 'Alex (Newbie)',
    level: 'newbie',
    preferredLanguage: 'javascript',
    activeTrack: 'beginner',
    completedTopicIds: ['big-o-analysis'],
    solvedProblems: [
      {
        problemId: 'valid-anagram',
        problemTitle: 'Valid Anagram',
        difficulty: 'easy',
        topicId: 'arrays-and-strings',
        solvedAt: '2026-08-28T14:20:00Z',
        timeSpentSeconds: 420,
        mode: 'solve'
      }
    ],
    streakDays: 2,
    lastActiveDate: new Date().toISOString(),
    assessmentResult: {
      score: 30,
      totalQuestions: 10,
      level: 'newbie',
      strengths: ['Big-O Analysis', 'Basic Array Traversal'],
      weaknesses: ['Binary Trees', 'Graphs', 'Dynamic Programming', 'Cycle Detection'],
      recommendedStartingTopicId: 'arrays-and-strings',
      recommendedStartingTopicName: 'Arrays & Dynamic Arrays',
      recommendations: [
        'Solidify array indexing and two-pointer basics before jumping to graphs.',
        'Master the difference between O(1) array access and O(N) array shifts.',
        'Practice Hash Map lookups to replace nested loops.'
      ],
      breakdown: [
        { topic: 'Big-O Complexity', correct: true, difficulty: 'easy' },
        { topic: 'Arrays & Dynamic Arrays', correct: true, difficulty: 'easy' },
        { topic: 'Binary Search', correct: true, difficulty: 'easy' },
        { topic: 'Linked Lists', correct: false, difficulty: 'medium' },
        { topic: 'Stacks & Monotonic Queues', correct: false, difficulty: 'medium' },
        { topic: 'Binary Search Trees', correct: false, difficulty: 'medium' },
        { topic: 'Graphs & BFS/DFS', correct: false, difficulty: 'medium' },
        { topic: 'Dynamic Programming', correct: false, difficulty: 'medium' },
        { topic: 'Topological Sort & DAGs', correct: false, difficulty: 'hard' },
        { topic: 'Disjoint Set Union (DSU)', correct: false, difficulty: 'hard' }
      ],
      date: new Date().toISOString()
    },
    weakTopics: ['Binary Trees', 'Graphs', 'Dynamic Programming'],
    strongTopics: ['Big-O Complexity', 'Arrays & Strings'],
    currentTopicId: 'arrays-and-strings',
    tutorTone: 'balanced',
    dailyGoalProblems: 2
  },

  intermediate: {
    id: 'demo-intermediate-user',
    name: 'Jordan (Intermediate)',
    level: 'intermediate',
    preferredLanguage: 'python',
    activeTrack: 'intermediate',
    completedTopicIds: [
      'big-o-analysis',
      'arrays-and-strings',
      'hashing-hashmaps',
      'binary-search-foundations',
      'linked-lists',
      'stacks-and-queues',
      'binary-trees-bfs-dfs'
    ],
    solvedProblems: [
      {
        problemId: 'two-sum',
        problemTitle: 'Two Sum',
        difficulty: 'easy',
        topicId: 'hashing-hashmaps',
        solvedAt: '2026-08-27T10:00:00Z',
        timeSpentSeconds: 180,
        mode: 'solve'
      },
      {
        problemId: 'binary-search',
        problemTitle: 'Binary Search',
        difficulty: 'easy',
        topicId: 'binary-search-foundations',
        solvedAt: '2026-08-27T11:30:00Z',
        timeSpentSeconds: 120,
        mode: 'solve'
      },
      {
        problemId: 'reverse-linked-list',
        problemTitle: 'Reverse Linked List',
        difficulty: 'easy',
        topicId: 'linked-lists',
        solvedAt: '2026-08-28T09:15:00Z',
        timeSpentSeconds: 240,
        mode: 'solve'
      },
      {
        problemId: 'longest-substring-without-repeating',
        problemTitle: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        topicId: 'sliding-window',
        solvedAt: '2026-08-28T16:45:00Z',
        timeSpentSeconds: 580,
        mode: 'solve'
      },
      {
        problemId: 'container-with-most-water',
        problemTitle: 'Container With Most Water',
        difficulty: 'medium',
        topicId: 'two-pointers',
        solvedAt: '2026-08-29T08:10:00Z',
        timeSpentSeconds: 460,
        mode: 'solve'
      }
    ],
    streakDays: 7,
    lastActiveDate: new Date().toISOString(),
    assessmentResult: {
      score: 70,
      totalQuestions: 10,
      level: 'intermediate',
      strengths: ['Arrays & Strings', 'Hashing', 'Binary Search', 'Sliding Window', 'Two Pointers'],
      weaknesses: ['Graphs (BFS/DFS on Complex Grids)', 'Dynamic Programming (Tabulation)', 'Topological Sort'],
      recommendedStartingTopicId: 'graphs-bfs-dfs',
      recommendedStartingTopicName: 'Graph Fundamentals & BFS/DFS Traversals',
      recommendations: [
        'You have solid command over linear data structures and two-pointer patterns.',
        'Focus next on Graph Flood Fill and connected component traversals.',
        'Practice identifying state recurrence in 1D Dynamic Programming.'
      ],
      breakdown: [
        { topic: 'Big-O Complexity', correct: true, difficulty: 'easy' },
        { topic: 'Arrays & Dynamic Arrays', correct: true, difficulty: 'easy' },
        { topic: 'Binary Search', correct: true, difficulty: 'easy' },
        { topic: 'Linked Lists', correct: true, difficulty: 'medium' },
        { topic: 'Stacks & Monotonic Queues', correct: true, difficulty: 'medium' },
        { topic: 'Binary Search Trees', correct: true, difficulty: 'medium' },
        { topic: 'Graphs & BFS/DFS', correct: true, difficulty: 'medium' },
        { topic: 'Dynamic Programming', correct: false, difficulty: 'medium' },
        { topic: 'Topological Sort & DAGs', correct: false, difficulty: 'hard' },
        { topic: 'Disjoint Set Union (DSU)', correct: false, difficulty: 'hard' }
      ],
      date: new Date().toISOString()
    },
    weakTopics: ['Dynamic Programming', 'Topological Sort', 'DSU'],
    strongTopics: ['Arrays', 'Hashing', 'Binary Search', 'Two Pointers', 'Trees'],
    currentTopicId: 'graphs-bfs-dfs',
    tutorTone: 'savage',
    dailyGoalProblems: 3
  },

  pro: {
    id: 'demo-pro-user',
    name: 'Devin (Pro)',
    level: 'pro',
    preferredLanguage: 'cpp',
    activeTrack: 'pro',
    completedTopicIds: [
      'big-o-analysis',
      'arrays-and-strings',
      'hashing-hashmaps',
      'binary-search-foundations',
      'linked-lists',
      'stacks-and-queues',
      'binary-trees-bfs-dfs',
      'sliding-window',
      'two-pointers',
      'graphs-bfs-dfs',
      'dynamic-programming-1d',
      'union-find-dsu',
      'topological-sort'
    ],
    solvedProblems: [
      {
        problemId: 'two-sum',
        problemTitle: 'Two Sum',
        difficulty: 'easy',
        topicId: 'hashing-hashmaps',
        solvedAt: '2026-08-20T10:00:00Z',
        timeSpentSeconds: 90,
        mode: 'solve'
      },
      {
        problemId: 'longest-substring-without-repeating',
        problemTitle: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        topicId: 'sliding-window',
        solvedAt: '2026-08-22T11:00:00Z',
        timeSpentSeconds: 240,
        mode: 'solve'
      },
      {
        problemId: 'number-of-islands',
        problemTitle: 'Number of Islands',
        difficulty: 'medium',
        topicId: 'graphs-bfs-dfs',
        solvedAt: '2026-08-24T14:00:00Z',
        timeSpentSeconds: 320,
        mode: 'solve'
      },
      {
        problemId: 'coin-change',
        problemTitle: 'Coin Change',
        difficulty: 'medium',
        topicId: 'dynamic-programming-1d',
        solvedAt: '2026-08-25T16:00:00Z',
        timeSpentSeconds: 400,
        mode: 'solve'
      },
      {
        problemId: 'course-schedule',
        problemTitle: 'Course Schedule',
        difficulty: 'medium',
        topicId: 'topological-sort',
        solvedAt: '2026-08-27T09:30:00Z',
        timeSpentSeconds: 380,
        mode: 'solve'
      },
      {
        problemId: 'word-search-ii',
        problemTitle: 'Word Search II',
        difficulty: 'hard',
        topicId: 'trie-prefix-tree',
        solvedAt: '2026-08-28T18:00:00Z',
        timeSpentSeconds: 850,
        mode: 'solve'
      }
    ],
    streakDays: 19,
    lastActiveDate: new Date().toISOString(),
    assessmentResult: {
      score: 95,
      totalQuestions: 10,
      level: 'pro',
      strengths: ['All Fundamental DS', 'Graph Algorithms', 'Topological Sort', 'DSU', 'Dynamic Programming', 'Tries'],
      weaknesses: ['Bitmask DP Optimization', 'Segment Trees (Range Updates)'],
      recommendedStartingTopicId: 'shortest-path-dijkstra',
      recommendedStartingTopicName: 'Shortest Path (Dijkstra & Priority Queues)',
      recommendations: [
        'Mastery of core LeetCode Medium/Hard patterns verified.',
        'Target advanced Competitive Programming graph algorithms: Dijkstra, Bellman-Ford, and Segment Trees.',
        'Conduct full-length timed mock interviews to refine communication efficiency.'
      ],
      breakdown: [
        { topic: 'Big-O Complexity', correct: true, difficulty: 'easy' },
        { topic: 'Arrays & Dynamic Arrays', correct: true, difficulty: 'easy' },
        { topic: 'Binary Search', correct: true, difficulty: 'easy' },
        { topic: 'Linked Lists', correct: true, difficulty: 'medium' },
        { topic: 'Stacks & Monotonic Queues', correct: true, difficulty: 'medium' },
        { topic: 'Binary Search Trees', correct: true, difficulty: 'medium' },
        { topic: 'Graphs & BFS/DFS', correct: true, difficulty: 'medium' },
        { topic: 'Dynamic Programming', correct: true, difficulty: 'medium' },
        { topic: 'Topological Sort & DAGs', correct: true, difficulty: 'hard' },
        { topic: 'Disjoint Set Union (DSU)', correct: true, difficulty: 'hard' }
      ],
      date: new Date().toISOString()
    },
    weakTopics: ['Bitmask DP', 'Segment Trees'],
    strongTopics: ['Graphs', 'Trees', 'DP', 'Topological Sort', 'DSU', 'Trie'],
    currentTopicId: 'shortest-path-dijkstra',
    tutorTone: 'savage',
    dailyGoalProblems: 4
  }
};
