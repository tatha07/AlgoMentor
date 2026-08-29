import { AssessmentQuestion } from '../types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1-big-o',
    topic: 'Big-O Complexity',
    difficulty: 'easy',
    question: 'What is the time complexity of searching for an element by key in a well-distributed Hash Table?',
    options: [
      {
        id: 'a',
        text: 'O(1) average time',
        isCorrect: true,
        explanation: 'Hash functions compute bucket indices directly in O(1) time.'
      },
      {
        id: 'b',
        text: 'O(log N) time',
        isCorrect: false,
        explanation: 'O(log N) is typical for balanced Binary Search Trees, not hash tables.'
      },
      {
        id: 'c',
        text: 'O(N) time',
        isCorrect: false,
        explanation: 'O(N) is only the catastrophic worst case if every key collides into the same bucket.'
      },
      {
        id: 'd',
        text: 'O(N log N) time',
        isCorrect: false,
        explanation: 'O(N log N) is typical for sorting algorithms.'
      }
    ],
    testedConcept: 'Hash Table lookup mechanics'
  },
  {
    id: 'q2-arrays',
    topic: 'Arrays & Dynamic Arrays',
    difficulty: 'easy',
    question: 'What is the time complexity of inserting an element at the very beginning (index 0) of a standard array of size N?',
    options: [
      {
        id: 'a',
        text: 'O(1)',
        isCorrect: false,
        explanation: 'In contiguous memory arrays, inserting at index 0 requires shifting all N elements one position to the right.'
      },
      {
        id: 'b',
        text: 'O(N)',
        isCorrect: true,
        explanation: 'Every element from index 0 to N-1 must shift right, taking linear O(N) time.'
      },
      {
        id: 'c',
        text: 'O(log N)',
        isCorrect: false,
        explanation: 'Memory shifting is physical and linear, not logarithmic.'
      },
      {
        id: 'd',
        text: 'O(N^2)',
        isCorrect: false,
        explanation: 'Shifting N elements takes a single linear pass.'
      }
    ],
    testedConcept: 'Array memory layout & shifts'
  },
  {
    id: 'q3-binary-search',
    topic: 'Binary Search',
    difficulty: 'easy',
    question: 'Why is `mid = left + (right - left) / 2` preferred over `mid = (left + right) / 2` in typed languages?',
    options: [
      {
        id: 'a',
        text: 'It avoids 32-bit signed integer overflow when left + right > 2^31 - 1',
        isCorrect: true,
        explanation: 'When left and right are large positive integers, (left + right) overflows to a negative integer in 32-bit arithmetic.'
      },
      {
        id: 'b',
        text: 'It executes in fewer CPU clock cycles',
        isCorrect: false,
        explanation: 'It involves an extra subtraction, but provides mathematical safety.'
      },
      {
        id: 'c',
        text: 'It is required to handle negative numbers in the array',
        isCorrect: false,
        explanation: 'Indices left and right are non-negative; the issue is upper bound integer overflow.'
      },
      {
        id: 'd',
        text: 'It automatically rounds up instead of rounding down',
        isCorrect: false,
        explanation: 'Integer division still rounds towards zero.'
      }
    ],
    testedConcept: 'Integer overflow prevention in binary search'
  },
  {
    id: 'q4-linked-lists',
    topic: 'Linked Lists',
    difficulty: 'medium',
    question: 'How does Floyd\'s Cycle Detection (Tortoise and Hare) find a cycle in a linked list?',
    options: [
      {
        id: 'a',
        text: 'Two pointers move at different speeds (1 step vs 2 steps); they meet if a cycle exists in O(N) time and O(1) space',
        isCorrect: true,
        explanation: 'Inside a loop of length C, the relative speed decreases the gap by 1 each step until fast catches slow.'
      },
      {
        id: 'b',
        text: 'By storing node pointers in a HashSet and checking for seen addresses in O(1) space',
        isCorrect: false,
        explanation: 'HashSet approach takes O(N) space, not O(1) auxiliary space.'
      },
      {
        id: 'c',
        text: 'By reversing the list and checking if head becomes null',
        isCorrect: false,
        explanation: 'Reversing a cyclic list results in an infinite loop.'
      },
      {
        id: 'd',
        text: 'By counting total nodes and checking if count exceeds 10,000',
        isCorrect: false,
        explanation: 'Hardcoded limits do not guarantee cycle detection.'
      }
    ],
    testedConcept: 'Fast and slow pointer cycle detection'
  },
  {
    id: 'q5-stacks-monotonic',
    topic: 'Stacks & Monotonic Queues',
    difficulty: 'medium',
    question: 'Which data structure is optimal for solving the "Next Greater Element" problem for all elements of an array in O(N) time?',
    options: [
      {
        id: 'a',
        text: 'Monotonic Decreasing Stack',
        isCorrect: true,
        explanation: 'Maintaining elements in decreasing order pops smaller elements when a larger element arrives, resolving their next greater in O(N) amortized time.'
      },
      {
        id: 'b',
        text: 'Min-Heap Priority Queue',
        isCorrect: false,
        explanation: 'A Heap takes O(N log N) time and does not preserve relative array order easily.'
      },
      {
        id: 'c',
        text: 'Binary Search Tree',
        isCorrect: false,
        explanation: 'BST would take O(N log N) or O(N^2) skewed.'
      },
      {
        id: 'd',
        text: 'Circular Queue',
        isCorrect: false,
        explanation: 'Circular queues maintain FIFO order without monotonicity.'
      }
    ],
    testedConcept: 'Monotonic stack patterns'
  },
  {
    id: 'q6-trees-traversals',
    topic: 'Binary Search Trees',
    difficulty: 'medium',
    question: 'Which tree traversal yields elements of a Binary Search Tree (BST) in strictly ascending sorted order?',
    options: [
      {
        id: 'a',
        text: 'In-order Traversal (Left -> Root -> Right)',
        isCorrect: true,
        explanation: 'Because in a BST, Left < Root < Right, visiting Left, then Root, then Right yields ascending order.'
      },
      {
        id: 'b',
        text: 'Pre-order Traversal (Root -> Left -> Right)',
        isCorrect: false,
        explanation: 'Pre-order visits root before smaller left children.'
      },
      {
        id: 'c',
        text: 'Post-order Traversal (Left -> Right -> Root)',
        isCorrect: false,
        explanation: 'Post-order visits root last, useful for deletions and bottom-up aggregations.'
      },
      {
        id: 'd',
        text: 'Level-order Traversal (BFS)',
        isCorrect: false,
        explanation: 'Level-order visits horizontal depth layers regardless of value order.'
      }
    ],
    testedConcept: 'BST properties and tree traversals'
  },
  {
    id: 'q7-graphs-traversals',
    topic: 'Graphs & BFS/DFS',
    difficulty: 'medium',
    question: 'In an unweighted graph, which algorithm is guaranteed to find the shortest path between two vertices in O(V + E) time?',
    options: [
      {
        id: 'a',
        text: 'Breadth-First Search (BFS)',
        isCorrect: true,
        explanation: 'BFS explores neighbors level-by-level, ensuring the first time target is popped, it is via the minimum number of edges.'
      },
      {
        id: 'b',
        text: 'Depth-First Search (DFS)',
        isCorrect: false,
        explanation: 'DFS may plunge down a very long path first before exploring a direct 1-hop neighbor.'
      },
      {
        id: 'c',
        text: 'Bellman-Ford Algorithm',
        isCorrect: false,
        explanation: 'Bellman-Ford takes O(V * E) time, which is overkill for unweighted graphs.'
      },
      {
        id: 'd',
        text: 'Floyd-Warshall Algorithm',
        isCorrect: false,
        explanation: 'Floyd-Warshall takes O(V^3) time for all-pairs shortest paths.'
      }
    ],
    testedConcept: 'Shortest path properties of BFS'
  },
  {
    id: 'q8-dynamic-programming',
    topic: 'Dynamic Programming',
    difficulty: 'medium',
    question: 'What two fundamental characteristics must a problem exhibit to be solvable via Dynamic Programming?',
    options: [
      {
        id: 'a',
        text: 'Overlapping Subproblems and Optimal Substructure',
        isCorrect: true,
        explanation: 'Optimal substructure means optimal solution can be built from optimal solutions of subproblems; overlapping subproblems means the same subproblems are solved repeatedly.'
      },
      {
        id: 'b',
        text: 'Greedy Choice Property and Continuous Space',
        isCorrect: false,
        explanation: 'Greedy choice property defines Greedy algorithms, which don\'t need memoization.'
      },
      {
        id: 'c',
        text: 'Sorted Input and Monotonicity',
        isCorrect: false,
        explanation: 'These are requirements for binary search / two pointers.'
      },
      {
        id: 'd',
        text: 'Divide and Conquer with Non-overlapping Subproblems',
        isCorrect: false,
        explanation: 'Non-overlapping subproblems describes Merge Sort / Divide & Conquer, where memoization is not needed.'
      }
    ],
    testedConcept: 'Core DP axioms and conditions'
  },
  {
    id: 'q9-topological-sort',
    topic: 'Topological Sort & DAGs',
    difficulty: 'hard',
    question: 'If Kahn\'s algorithm processes only 4 vertices out of a directed graph of 6 vertices before the queue becomes empty, what does this indicate?',
    options: [
      {
        id: 'a',
        text: 'The graph contains a directed cycle among the remaining 2 vertices',
        isCorrect: true,
        explanation: 'Vertices in a cycle never reach an in-degree of 0, so they are never pushed to the queue. A valid topological sort is impossible.'
      },
      {
        id: 'b',
        text: 'The graph is disconnected but has no cycles',
        isCorrect: false,
        explanation: 'Disconnected DAG components all have in-degree 0 sources and would all be processed.'
      },
      {
        id: 'c',
        text: 'The queue experienced an integer overflow',
        isCorrect: false,
        explanation: 'This is an algorithmic topological invariant, not an overflow error.'
      },
      {
        id: 'd',
        text: 'The graph is a tree',
        isCorrect: false,
        explanation: 'A tree is always an acyclic DAG and all nodes would be processed.'
      }
    ],
    testedConcept: 'Cycle detection via Kahn\'s algorithm'
  },
  {
    id: 'q10-dsu-union-find',
    topic: 'Disjoint Set Union (DSU)',
    difficulty: 'hard',
    question: 'With both Path Compression and Union by Rank applied, what is the amortized time complexity per Find/Union operation in DSU?',
    options: [
      {
        id: 'a',
        text: 'O(alpha(N)) — Inverse Ackermann function (effectively O(1))',
        isCorrect: true,
        explanation: 'Path compression flattens trees on lookup, while union by rank keeps trees shallow. alpha(N) < 5 for any realistic N.'
      },
      {
        id: 'b',
        text: 'O(log N)',
        isCorrect: false,
        explanation: 'O(log N) is without path compression (union by rank alone).'
      },
      {
        id: 'c',
        text: 'O(N)',
        isCorrect: false,
        explanation: 'O(N) occurs only in naive unbalanced DSU without optimizations.'
      },
      {
        id: 'd',
        text: 'O(1) strict deterministic worst case',
        isCorrect: false,
        explanation: 'It is amortized O(alpha(N)), which is practically constant but mathematically non-trivial.'
      }
    ],
    testedConcept: 'DSU asymptotic efficiency and heuristics'
  }
];
