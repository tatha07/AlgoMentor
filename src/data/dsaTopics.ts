import { DsaTopic } from '../types';

export const DSA_TOPICS: DsaTopic[] = [
  // ==================== BEGINNER TRACK ====================
  {
    id: 'big-o-analysis',
    title: 'Time & Space Complexity (Big-O)',
    category: 'Foundations',
    trackLevel: 'beginner',
    order: 1,
    description: 'Learn how to measure algorithm efficiency, upper bounds, and memory overhead without running on hardware.',
    prerequisites: [],
    concept: 'Big-O notation describes the limiting behavior of a function when the argument tends towards infinity. It represents the worst-case upper bound of runtime or auxiliary space relative to input size N.',
    whyItMatters: 'Interviews and production systems live and die by scalability. An O(N^2) algorithm will crash when scaling from 1,000 to 1,000,000 items, while an O(N log N) or O(N) solution runs in milliseconds.',
    visualExplanation: `
Complexity Ladder (Best to Worst):
  O(1)        Constant Time       [Instant: Hash lookup, array indexing]
  O(log N)    Logarithmic Time    [Halving search space: Binary Search]
  O(N)        Linear Time         [Single pass: Loop through array]
  O(N log N)  Linearithmic Time   [Efficient sorting: Merge/Quick Sort]
  O(N^2)      Quadratic Time      [Nested loops: Bubble Sort, Matrix traversal]
  O(2^N)      Exponential Time    [Subset recursion, Fib naive]
  O(N!)       Factorial Time      [Permutations: Traveling Salesperson]
`,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(N)',
      worst: 'O(2^N)',
      description: 'Big-O drops non-dominant terms and constants: O(3N^2 + 5N + 100) simplifies strictly to O(N^2).'
    },
    spaceComplexity: {
      worst: 'O(N)',
      description: 'Auxiliary space counts extra memory allocated, including recursion call stack frames.'
    },
    codeSnippets: {
      javascript: `// O(1) - Constant Time
function getFirst(arr) {
  return arr[0];
}

// O(N) - Linear Time
function findMax(arr) {
  let max = arr[0];
  for (let num of arr) {
    if (num > max) max = num;
  }
  return max;
}

// O(N^2) - Quadratic Time
function hasDuplicateNaive(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}`,
      python: `# O(1) - Constant Time
def get_first(arr):
    return arr[0] if arr else None

# O(N) - Linear Time
def find_max(arr):
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val

# O(N^2) - Quadratic Time
def has_duplicate_naive(arr):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False`,
      cpp: `// O(1) - Constant Time
int getFirst(const std::vector<int>& arr) {
    return arr.empty() ? -1 : arr[0];
}

// O(N) - Linear Time
int findMax(const std::vector<int>& arr) {
    int maxVal = arr[0];
    for (int num : arr) {
        if (num > maxVal) maxVal = num;
    }
    return maxVal;
}

// O(N^2) - Quadratic Time
bool hasDuplicateNaive(const std::vector<int>& arr) {
    for (size_t i = 0; i < arr.size(); ++i) {
        for (size_t j = i + 1; j < arr.size(); ++j) {
            if (arr[i] == arr[j]) return true;
        }
    }
    return false;
}`,
      java: `// O(1) - Constant Time
public int getFirst(int[] arr) {
    return arr.length > 0 ? arr[0] : -1;
}

// O(N) - Linear Time
public int findMax(int[] arr) {
    int max = arr[0];
    for (int num : arr) {
        if (num > max) max = num;
    }
    return max;
}

// O(N^2) - Quadratic Time
public boolean hasDuplicateNaive(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) return true;
        }
    }
    return false;
}`
    },
    commonMistakes: [
      'Assuming two sequential loops of length N are O(N^2) instead of O(2N) = O(N).',
      'Forgetting that string concatenation in loops can create hidden O(N^2) time due to string copying.',
      'Ignoring recursion call stack memory in space complexity calculations.'
    ],
    patterns: [
      {
        name: 'Space-Time Tradeoff',
        description: 'Using a Hash Set (O(N) space) to drop duplicate search from O(N^2) to O(N) time.',
        exampleProblem: 'Two Sum'
      }
    ],
    practiceProblemIds: ['two-sum', 'valid-anagram'],
    recommendedResources: [
      {
        id: 'abdul-bari-big-o',
        title: 'Introduction to Algorithms and Asymptotic Notations',
        creator: 'Abdul Bari',
        channelName: 'Abdul Bari',
        description: 'The definitive deep dive on Big-O, Omega, and Theta notations with mathematical rigor.',
        duration: '18 mins',
        whyRecommended: 'Clear explanations without hand-waving proofs.',
        searchQuery: 'Abdul Bari Asymptotic Notations Big O',
        topicId: 'big-o-analysis',
        difficulty: 'easy'
      },
      {
        id: 'freecodecamp-big-o',
        title: 'Big O Notation - Full Course',
        creator: 'freeCodeCamp.org',
        channelName: 'freeCodeCamp.org',
        description: 'Visual representations of data structure operations and their complexities.',
        duration: '45 mins',
        whyRecommended: 'Great practical code walkthroughs in multiple languages.',
        searchQuery: 'freeCodeCamp Big O Notation tutorial',
        topicId: 'big-o-analysis',
        difficulty: 'easy'
      }
    ]
  },

  {
    id: 'arrays-and-strings',
    title: 'Arrays & Dynamic Arrays',
    category: 'Linear Data Structures',
    trackLevel: 'beginner',
    order: 2,
    description: 'Contiguous memory allocation, random access, dynamic resizing amortized analysis, and string operations.',
    prerequisites: ['big-o-analysis'],
    concept: 'An array stores elements in contiguous memory locations. Because memory addresses are calculated with index * size_of_element, element lookup by index is strictly O(1). Dynamic arrays (like JS Array, Python List, C++ std::vector) double capacity upon overflow.',
    whyItMatters: 'Arrays are the foundation of cache locality in modern CPUs. Fast traversal and instant index access make them the first choice in high-performance computing.',
    visualExplanation: `
Memory Layout (Contiguous):
Address:   0x100  0x104  0x108  0x10C  0x110
Indices:   [ 0 ]  [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]
Values:    [ 42 ] [ 17 ] [ 99 ] [ 03 ] [ 88 ]
Access:    Base + (index * 4 bytes) -> Direct O(1) jump!
`,
    timeComplexity: {
      best: 'O(1) for index access',
      average: 'O(N) for insertion/deletion at arbitrary index',
      worst: 'O(N) when resizing dynamic array',
      description: 'Append operation is amortized O(1) because doubling occurs exponentially less frequently.'
    },
    spaceComplexity: {
      worst: 'O(N)',
      description: 'Allocates continuous memory block proportional to capacity.'
    },
    codeSnippets: {
      javascript: `// Two-Pointer In-Place Array Reversal
function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
}`,
      python: `# Two-Pointer In-Place Array Reversal
def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr`,
      cpp: `// Two-Pointer In-Place Array Reversal
void reverseArray(std::vector<int>& arr) {
    int left = 0;
    int right = static_cast<int>(arr.size()) - 1;
    while (left < right) {
        std::swap(arr[left], arr[right]);
        left++;
        right--;
    }
}`,
      java: `// Two-Pointer In-Place Array Reversal
public void reverseArray(int[] arr) {
    int left = 0;
    int right = arr.length - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}`
    },
    commonMistakes: [
      'Forgetting that deleting from or inserting into the beginning (index 0) is O(N) because all remaining elements must shift.',
      'Buffer overruns / Off-by-one errors (accessing index arr.length instead of arr.length - 1).',
      'Thinking array resizing is O(N) every push (it is amortized O(1)).'
    ],
    patterns: [
      {
        name: 'In-Place Swap Two Pointers',
        description: 'Converging pointers from both ends to modify the array without allocating extra space.',
        exampleProblem: 'Reverse String / Move Zeroes'
      }
    ],
    practiceProblemIds: ['two-sum', 'valid-anagram', 'contains-duplicate'],
    recommendedResources: [
      {
        id: 'neetcode-arrays',
        title: 'Arrays & Hashing Roadmap & Core Patterns',
        creator: 'NeetCode',
        channelName: 'NeetCode',
        description: 'Clear, direct breakdown of array patterns, memory considerations, and top interview questions.',
        duration: '22 mins',
        whyRecommended: 'Concise, industry-standard visual problem walkthroughs.',
        searchQuery: 'NeetCode Arrays & Hashing Beginner Guide',
        topicId: 'arrays-and-strings',
        difficulty: 'easy'
      }
    ]
  },

  {
    id: 'hashing-hashmaps',
    title: 'Hash Tables & Hash Maps',
    category: 'Linear Data Structures',
    trackLevel: 'beginner',
    order: 3,
    description: 'Hash functions, collision resolution (chaining vs open addressing), load factor, and O(1) lookups.',
    prerequisites: ['arrays-and-strings'],
    concept: 'A Hash Table transforms a key into an integer index via a hash function, mapping data into an underlying array. When designed properly with low load factor, retrieval, insertion, and deletion run in average O(1) time.',
    whyItMatters: 'Hash maps are the single most frequently used data structure in coding interviews to achieve O(1) lookup speed and optimize nested loops.',
    visualExplanation: `
Key "apple" -> HashFunc("apple") -> Hash Code 49201 -> Index = 49201 % 8 = 1
Bucket Array:
[ 0 ] -> null
[ 1 ] -> ["apple", 3.99] -> ["apricot", 2.50] (Chaining for collisions)
[ 2 ] -> ["banana", 1.20]
[ 3 ] -> null
`,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(1)',
      worst: 'O(N) (all keys collide into single bucket)',
      description: 'Modern hash tables rehash when load factor exceeds ~0.75 to maintain O(1) average performance.'
    },
    spaceComplexity: {
      worst: 'O(N)',
      description: 'Requires extra capacity buckets to prevent clustering.'
    },
    codeSnippets: {
      javascript: `// Two Sum using Hash Map for O(N) Time
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `# Two Sum using Hash Map for O(N) Time
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      cpp: `// Two Sum using std::unordered_map
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      java: `// Two Sum using HashMap
import java.util.HashMap;
import java.util.Map;

public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`
    },
    commonMistakes: [
      'Using unhashable / mutable objects as keys in hash maps.',
      'Assuming keys in hash maps are sorted (they are unordered in hash tables; tree maps provide ordering).',
      'Forgetting that worst-case lookup can degrade to O(N) without collision management.'
    ],
    patterns: [
      {
        name: 'Frequency Counter / Seen Map',
        description: 'Tracking element counts or previous indices in a single pass to eliminate O(N^2) nested scans.',
        exampleProblem: 'Valid Anagram / Group Anagrams'
      }
    ],
    practiceProblemIds: ['two-sum', 'valid-anagram', 'contains-duplicate'],
    recommendedResources: [
      {
        id: 'striver-hashing',
        title: 'Hashing Complete Tutorial & Collision Resolution',
        creator: 'Striver (take U forward)',
        channelName: 'take U forward',
        description: 'Deep conceptual explanation of division hashing, folding methods, and collision chaining.',
        duration: '35 mins',
        whyRecommended: 'Covers edge cases, memory layouts, and interview-specific pitfalls.',
        searchQuery: 'Striver Hashing complete course take U forward',
        topicId: 'hashing-hashmaps',
        difficulty: 'easy'
      }
    ]
  },

  {
    id: 'binary-search-foundations',
    title: 'Binary Search & Monotonic Search Spaces',
    category: 'Searching & Sorting',
    trackLevel: 'beginner',
    order: 4,
    description: 'Divide and conquer on sorted ranges, condition boundary matching, and avoiding integer overflow.',
    prerequisites: ['arrays-and-strings', 'big-o-analysis'],
    concept: 'Binary Search repeatedly halves a sorted search space by comparing target with the middle element. It reduces a search of N items down to log2(N) steps.',
    whyItMatters: 'Finding an item among 1,000,000,000 elements takes at most 30 comparisons! It extends far beyond sorted arrays into "Binary Search on Answer" problems.',
    visualExplanation: `
Target = 23, Array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
Step 1: low=0, high=9, mid=4 (16) -> 23 > 16 -> low = mid+1 = 5
Step 2: low=5, high=9, mid=7 (56) -> 23 < 56 -> high = mid-1 = 6
Step 3: low=5, high=6, mid=5 (23) -> Found at index 5!
`,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log N)',
      worst: 'O(log N)',
      description: 'Halves the search space on each iteration.'
    },
    spaceComplexity: {
      worst: 'O(1) iterative / O(log N) recursive',
      description: 'Iterative implementation uses constant memory.'
    },
    codeSnippets: {
      javascript: `// Safe Binary Search (Iterative)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
      python: `# Safe Binary Search (Iterative)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
      cpp: `// Safe Binary Search (Iterative)
int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = static_cast<int>(arr.size()) - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // Prevents (left + right) integer overflow
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      java: `// Safe Binary Search (Iterative)
public int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
    },
    commonMistakes: [
      'Computing mid as (left + right) / 2 which causes 32-bit integer overflow when left + right > 2^31 - 1.',
      'Using while (left < right) instead of while (left <= right) and accidentally missing single-element checks.',
      'Trying to apply binary search on an unsorted or non-monotonic collection.'
    ],
    patterns: [
      {
        name: 'Lower/Upper Bound Search',
        description: 'Finding the first or last occurrence of a target or condition threshold.',
        exampleProblem: 'Search Insert Position / First and Last Position in Sorted Array'
      }
    ],
    practiceProblemIds: ['binary-search', 'search-in-rotated-sorted-array'],
    recommendedResources: [
      {
        id: 'abdul-bari-binary-search',
        title: 'Binary Search Algorithm & Recursive vs Iterative Analysis',
        creator: 'Abdul Bari',
        channelName: 'Abdul Bari',
        description: 'Comprehensive step-by-step masterclass on binary search invariants and recurrence relations.',
        duration: '20 mins',
        whyRecommended: 'The gold standard for understanding algorithmic correctness.',
        searchQuery: 'Abdul Bari Binary Search algorithm tutorial',
        topicId: 'binary-search-foundations',
        difficulty: 'easy'
      }
    ]
  },

  {
    id: 'linked-lists',
    title: 'Singly & Doubly Linked Lists',
    category: 'Linear Data Structures',
    trackLevel: 'beginner',
    order: 5,
    description: 'Pointer manipulation, sentinel nodes, fast & slow pointers, and cycle detection.',
    prerequisites: ['big-o-analysis'],
    concept: 'A Linked List is a linear collection of data elements called nodes, where each node points to the next via a reference or pointer. Unlike arrays, nodes are not stored contiguously in memory.',
    whyItMatters: 'Provides O(1) insertions/deletions when a pointer is already known. Fundamental for building LRU caches, queues, and graph adjacency lists.',
    visualExplanation: `
Singly Linked List:
[Head: 10 | next] -> [20 | next] -> [30 | next] -> null

Reversing Pointers:
null <- [10] <- [20] <- [30] (prev / curr / next pointer dance)
`,
    timeComplexity: {
      best: 'O(1) for prepending / deleting at head',
      average: 'O(N) for lookup / insertion at arbitrary index',
      worst: 'O(N)',
      description: 'Requires linear traversal to reach index i because memory is scattered.'
    },
    spaceComplexity: {
      worst: 'O(N)',
      description: 'Each node carries pointer metadata overhead (4 or 8 bytes per link).'
    },
    codeSnippets: {
      javascript: `// In-Place Linked List Reversal
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      python: `# In-Place Linked List Reversal
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
      cpp: `// In-Place Linked List Reversal
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      java: `// In-Place Linked List Reversal
public class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
    },
    commonMistakes: [
      'Losing the next node pointer before re-linking curr.next = prev (causing pointer disconnects).',
      'Forgetting edge cases like empty list (head == null) or single-node list.',
      'Not using a Dummy / Sentinel head node when deleting nodes or merging lists.'
    ],
    patterns: [
      {
        name: 'Fast & Slow Pointers (Floyd\'s Cycle Finding)',
        description: 'Using slow (1 step) and fast (2 steps) pointers to detect cycles or locate the middle node in O(N) time and O(1) space.',
        exampleProblem: 'Linked List Cycle / Middle of the Linked List'
      }
    ],
    practiceProblemIds: ['reverse-linked-list', 'linked-list-cycle'],
    recommendedResources: [
      {
        id: 'neetcode-linked-lists',
        title: 'Reverse Linked List & Fast/Slow Pointer Masterclass',
        creator: 'NeetCode',
        channelName: 'NeetCode',
        description: 'Visual walkthrough of pointer re-assignment and sentinel node patterns.',
        duration: '15 mins',
        whyRecommended: 'Crystal clear animations showing pointer transitions.',
        searchQuery: 'NeetCode Reverse Linked List visual tutorial',
        topicId: 'linked-lists',
        difficulty: 'easy'
      }
    ]
  },

  {
    id: 'stacks-and-queues',
    title: 'Stacks & Queues',
    category: 'Linear Data Structures',
    trackLevel: 'beginner',
    order: 6,
    description: 'LIFO vs FIFO principles, monotonic stacks, deque, and expression evaluation.',
    prerequisites: ['arrays-and-strings', 'linked-lists'],
    concept: 'A Stack follows Last-In-First-Out (LIFO) order (push/pop at top). A Queue follows First-In-First-Out (FIFO) order (enqueue at back, dequeue at front).',
    whyItMatters: 'Stacks power compiler parsers, function call stacks, and undo operations. Queues manage task scheduling, message brokers, and Breadth-First Search traversals.',
    visualExplanation: `
Stack (LIFO):           Queue (FIFO):
|  [30] Top  |          Front -> [10] -> [20] -> [30] -> Back (Enqueue)
|  [20]      |          (Dequeue)
|  [10] Base |
+------------+
`,
    timeComplexity: {
      best: 'O(1) push / pop / peek',
      average: 'O(1)',
      worst: 'O(1)',
      description: 'Both operations are strictly O(1) when backed by dynamic array or doubly linked list.'
    },
    spaceComplexity: {
      worst: 'O(N)',
      description: 'Holds up to N elements.'
    },
    codeSnippets: {
      javascript: `// Valid Parentheses using Stack
function isValidParentheses(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      python: `# Valid Parentheses using Stack
def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
      cpp: `// Valid Parentheses using std::stack
#include <stack>
#include <unordered_map>
#include <string>

bool isValid(const std::string& s) {
    std::stack<char> st;
    std::unordered_map<char, char> matching = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (matching.count(c)) {
            if (st.empty() || st.top() != matching[c]) return false;
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}`,
      java: `// Valid Parentheses using ArrayDeque (Stack)
import java.util.ArrayDeque;
import java.util.Deque;

public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}`
    },
    commonMistakes: [
      'Popping from an empty stack/queue without checking if it has elements (causing index errors).',
      'Using JavaScript Array.shift() for queue dequeue which runs in O(N) time instead of O(1) (use a circular buffer or linked list).',
      'Forgetting to check if stack is empty at the end of matching brackets problem.'
    ],
    patterns: [
      {
        name: 'Monotonic Stack',
        description: 'Maintaining a stack with monotonically increasing or decreasing elements to find Next Greater Element in O(N) time.',
        exampleProblem: 'Daily Temperatures / Largest Rectangle in Histogram'
      }
    ],
    practiceProblemIds: ['valid-parentheses', 'min-stack'],
    recommendedResources: [
      {
        id: 'neetcode-valid-parentheses',
        title: 'Valid Parentheses & Stack Patterns',
        creator: 'NeetCode',
        channelName: 'NeetCode',
        description: 'Detailed problem solving pattern for matching brackets and parsing.',
        duration: '10 mins',
        whyRecommended: 'Direct and focused on edge cases.',
        searchQuery: 'NeetCode Valid Parentheses stack tutorial',
        topicId: 'stacks-and-queues',
        difficulty: 'easy'
      }
    ]
  },

  {
    id: 'binary-trees-bfs-dfs',
    title: 'Binary Trees & Tree Traversals (BFS & DFS)',
    category: 'Trees & Graphs',
    trackLevel: 'beginner',
    order: 7,
    description: 'Hierarchical structures, Preorder/Inorder/Postorder traversals, and Level-Order BFS.',
    prerequisites: ['linked-lists', 'stacks-and-queues'],
    concept: 'A Binary Tree is a hierarchical non-linear data structure where each node has at most two children (left and right). Depth-First Search (DFS) explores branches fully using recursion/stack; Breadth-First Search (BFS) explores level by level using a queue.',
    whyItMatters: 'Trees represent DOM structures, file systems, ASTs in compilers, and decision engines.',
    visualExplanation: `
          1 (Root)
        /   \\
       2     3
      / \\     \\
     4   5     6

Traversals:
Pre-order (Root, L, R): 1 -> 2 -> 4 -> 5 -> 3 -> 6
In-order (L, Root, R):  4 -> 2 -> 5 -> 1 -> 3 -> 6 (Sorted in BST!)
Post-order (L, R, Root): 4 -> 5 -> 2 -> 6 -> 3 -> 1
Level-Order (BFS):      [1], [2, 3], [4, 5, 6]
`,
    timeComplexity: {
      best: 'O(N) visits every node once',
      average: 'O(N)',
      worst: 'O(N)',
      description: 'Traversing all N nodes takes linear time.'
    },
    spaceComplexity: {
      worst: 'O(H) recursion stack where H is tree height (O(log N) balanced, O(N) skewed)',
      description: 'Auxiliary stack matches tree height.'
    },
    codeSnippets: {
      javascript: `// Max Depth of Binary Tree (DFS)
function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Level Order Traversal (BFS)
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`,
      python: `# Max Depth of Binary Tree (DFS)
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# Level Order Traversal (BFS)
from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result`,
      cpp: `// Max Depth & Level Order BFS in C++
#include <algorithm>
#include <queue>
#include <vector>

int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + std::max(maxDepth(root->left), maxDepth(root->right));
}

std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    std::vector<std::vector<int>> res;
    std::queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int sz = q.size();
        std::vector<int> level;
        for (int i = 0; i < sz; ++i) {
            TreeNode* node = q.front();
            q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}`,
      java: `// Max Depth & Level Order BFS in Java
import java.util.*;

public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int sz = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < sz; i++) {
            TreeNode node = q.poll();
            level.add(node.val);
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
        res.add(level);
    }
    return res;
}`
    },
    commonMistakes: [
      'Forgetting the base case in recursion (if (root === null) return ...).',
      'Modifying the queue length during loop in BFS instead of freezing levelSize beforehand.',
      'Confusing tree height (edges from node to deepest leaf) with tree depth.'
    ],
    patterns: [
      {
        name: 'Divide and Conquer Tree DFS',
        description: 'Solve the problem for left subtree, solve for right subtree, then combine at root.',
        exampleProblem: 'Maximum Depth of Binary Tree / Invert Binary Tree / Diameter of Binary Tree'
      }
    ],
    practiceProblemIds: ['invert-binary-tree', 'max-depth-binary-tree'],
    recommendedResources: [
      {
        id: 'abdul-bari-trees',
        title: 'Tree Traversals (Preorder, Inorder, Postorder, Level Order)',
        creator: 'Abdul Bari',
        channelName: 'Abdul Bari',
        description: 'Visual hand-drawn recursion stack traces for every traversal technique.',
        duration: '28 mins',
        whyRecommended: 'Unlocks intuitive understanding of recursion call trees.',
        searchQuery: 'Abdul Bari Binary Tree Traversals Inorder Preorder Postorder',
        topicId: 'binary-trees-bfs-dfs',
        difficulty: 'medium'
      }
    ]
  },

  // ==================== INTERMEDIATE TRACK ====================
  {
    id: 'sliding-window',
    title: 'Sliding Window Technique',
    category: 'Array & String Algorithms',
    trackLevel: 'intermediate',
    order: 8,
    description: 'Fixed-size and variable-size windows on contiguous sequences to drop O(N^2) to O(N).',
    prerequisites: ['arrays-and-strings', 'hashing-hashmaps'],
    concept: 'The Sliding Window technique tracks a sub-array or sub-string using two pointers (left and right). As the right pointer expands the window to satisfy conditions, the left pointer shrinks the window from behind, processing each element at most twice.',
    whyItMatters: 'Sliding window is the definitive algorithm for substring optimization, network rate limiting, and signal stream processing.',
    visualExplanation: `
Find Longest Substring Without Repeating Characters in "abcabcbb"
Step 1: [a] -> len 1
Step 2: [a, b] -> len 2
Step 3: [a, b, c] -> len 3
Step 4: 'a' repeats -> shrink left pointer past first 'a' -> [b, c, a] -> len 3
`,
    timeComplexity: {
      best: 'O(N)',
      average: 'O(N)',
      worst: 'O(N)',
      description: 'Left and right pointers each move at most N steps forward (2N operations = O(N)).'
    },
    spaceComplexity: {
      worst: 'O(K) where K is unique character set size',
      description: 'Hash set or frequency map stores characters within current window.'
    },
    codeSnippets: {
      javascript: `// Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0;
  let maxLen = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `# Longest Substring Without Repeating Characters
def length_of_longest_substring(s: str) -> int:
    char_set = set()
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len`,
      cpp: `// Longest Substring Without Repeating Characters
#include <unordered_set>
#include <string>
#include <algorithm>

int lengthOfLongestSubstring(const std::string& s) {
    std::unordered_set<char> charSet;
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.size(); ++right) {
        while (charSet.count(s[right])) {
            charSet.erase(s[left]);
            left++;
        }
        charSet.insert(s[right]);
        maxLen = std::max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      java: `// Longest Substring Without Repeating Characters
import java.util.HashSet;
import java.util.Set;

public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        while (set.contains(s.charAt(right))) {
            set.remove(s.charAt(left));
            left++;
        }
        set.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`
    },
    commonMistakes: [
      'Trying to reset left back to right when a duplicate is found instead of shrinking left incrementally.',
      'Using sliding window on non-contiguous sub-sequences (sliding window only applies to contiguous subarrays/substrings).',
      'Forgetting to update maxLen when the window state changes.'
    ],
    patterns: [
      {
        name: 'Dynamic Window with State Validation',
        description: 'Expand right to find valid window, contract left to minimize or discard invalidity.',
        exampleProblem: 'Minimum Size Subarray Sum / Longest Repeating Character Replacement'
      }
    ],
    practiceProblemIds: ['longest-substring-without-repeating', 'minimum-window-substring'],
    recommendedResources: [
      {
        id: 'neetcode-sliding-window',
        title: 'Sliding Window Technique Explained with LeetCode problems',
        creator: 'NeetCode',
        channelName: 'NeetCode',
        description: 'Step-by-step masterclass covering fixed and dynamic sliding window templates.',
        duration: '18 mins',
        whyRecommended: 'Teaches the exact mental template for all window problems.',
        searchQuery: 'NeetCode Sliding Window technique tutorial',
        topicId: 'sliding-window',
        difficulty: 'medium'
      }
    ]
  },

  {
    id: 'two-pointers',
    title: 'Two Pointers (Opposite & Same Direction)',
    category: 'Array & String Algorithms',
    trackLevel: 'intermediate',
    order: 9,
    description: 'Converging pointers on sorted arrays, partition schemes, and fast/slow traversal.',
    prerequisites: ['arrays-and-strings'],
    concept: 'Two pointers operate at different locations within an iterable simultaneously. By evaluating conditions (e.g. sum < target in sorted array), one or both pointers move, pruning impossible search branches in O(N) time.',
    whyItMatters: 'Replaces nested O(N^2) searches in sorted data with single-pass O(N) scans (3Sum, Trapping Rain Water, Container With Most Water).',
    visualExplanation: `
Container With Most Water:
Height: [1, 8, 6, 2, 5, 4, 8, 3, 7]
left = 0 (h=1), right = 8 (h=7) -> width = 8, area = 1 * 8 = 8
Since height[left] < height[right], moving right cannot increase area -> move left++!
`,
    timeComplexity: {
      best: 'O(N)',
      average: 'O(N)',
      worst: 'O(N)',
      description: 'Pointers start at opposite ends and meet in the middle in exactly N steps.'
    },
    spaceComplexity: {
      worst: 'O(1)',
      description: 'No auxiliary data structures required.'
    },
    codeSnippets: {
      javascript: `// Container With Most Water
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  
  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * currentHeight);
    
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}`,
      python: `# Container With Most Water
def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
      cpp: `// Container With Most Water
#include <vector>
#include <algorithm>

int maxArea(const std::vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxWater = 0;
    while (left < right) {
        int h = std::min(height[left], height[right]);
        maxWater = std::max(maxWater, (right - left) * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`,
      java: `// Container With Most Water
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    while (left < right) {
        int h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, (right - left) * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`
    },
    commonMistakes: [
      'Applying two pointers to an unsorted array without sorting first when checking sums.',
      'Moving both pointers simultaneously when only one boundary constraint was invalidated.',
      'Overlooking duplicates in 3Sum problems (leading to repeated triplet answers).'
    ],
    patterns: [
      {
        name: 'Converging Bounds',
        description: 'Shift left pointer when value is too small, right pointer when value is too large.',
        exampleProblem: 'Two Sum II (Input Array is Sorted) / 3Sum'
      }
    ],
    practiceProblemIds: ['container-with-most-water', 'three-sum'],
    recommendedResources: [
      {
        id: 'striver-two-pointers',
        title: 'Two Pointer Approach & 3Sum Master Guide',
        creator: 'Striver (take U forward)',
        channelName: 'take U forward',
        description: 'Complete breakdown of eliminating duplicate triplet branches in 3Sum and 4Sum.',
        duration: '26 mins',
        whyRecommended: 'Eliminates TLE errors with elegant duplicate skipping logic.',
        searchQuery: 'Striver 3Sum Two Pointer Approach take U forward',
        topicId: 'two-pointers',
        difficulty: 'medium'
      }
    ]
  },

  {
    id: 'graphs-bfs-dfs',
    title: 'Graph Fundamentals & BFS/DFS Traversals',
    category: 'Trees & Graphs',
    trackLevel: 'intermediate',
    order: 10,
    description: 'Adjacency lists/matrices, connected components, cycle detection in directed & undirected graphs.',
    prerequisites: ['binary-trees-bfs-dfs', 'stacks-and-queues', 'hashing-hashmaps'],
    concept: 'A Graph G = (V, E) is a non-linear data structure consisting of vertices (nodes) and edges (connections). Graphs can be directed/undirected and weighted/unweighted. BFS finds the shortest path in unweighted graphs; DFS explores deep branches and identifies cycles/components.',
    whyItMatters: 'Graphs model social networks, road routing (Google Maps), dependency resolution (npm/pip), garbage collectors, and state machines.',
    visualExplanation: `
Adjacency List:
0: [1, 2]
1: [0, 2, 3]
2: [0, 1, 4]
3: [1]
4: [2]

BFS Queue Exploration:
Start 0 -> Visit neighbors [1, 2] -> Visit neighbors of 1 [3] and 2 [4]
Tracks shortest path level by level!
`,
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
      description: 'Visits every vertex V and traverses every edge E once.'
    },
    spaceComplexity: {
      worst: 'O(V)',
      description: 'Visited set and BFS queue / DFS recursion call stack.'
    },
    codeSnippets: {
      javascript: `// Number of Connected Islands (DFS on Grid)
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') {
      return;
    }
    grid[r][c] = '0'; // Sink island (mark visited)
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      python: `# Number of Connected Islands (DFS on Grid)
def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0' # Mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      cpp: `// Number of Islands (DFS)
#include <vector>

void dfs(std::vector<std::vector<char>>& grid, int r, int c) {
    int rows = grid.size(), cols = grid[0].size();
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}

int numIslands(std::vector<std::vector<char>>& grid) {
    if (grid.empty()) return 0;
    int count = 0;
    for (int r = 0; r < grid.size(); ++r) {
        for (int c = 0; c < grid[0].size(); ++c) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }
    return count;
}`,
      java: `// Number of Islands (DFS)
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}`
    },
    commonMistakes: [
      'Forgetting to mark nodes as visited, leading to infinite loops in cyclic graphs.',
      'Treating directed graphs as undirected when checking for back-edges / cycles.',
      'Using DFS to find the shortest path in an unweighted graph (BFS is required).'
    ],
    patterns: [
      {
        name: 'Grid Flood Fill',
        description: 'Treat 2D matrix as an implicit graph where each cell (r, c) connects to up to 4 neighbors.',
        exampleProblem: 'Number of Islands / Rotting Oranges'
      }
    ],
    practiceProblemIds: ['number-of-islands', 'rotting-oranges'],
    recommendedResources: [
      {
        id: 'william-fiset-graphs',
        title: 'Graph Theory Introduction & Depth First Search Algorithm',
        creator: 'William Fiset',
        channelName: 'William Fiset',
        description: 'Clear animated graph theory lecture on vertex structures, adjacency matrices, and DFS traversal.',
        duration: '21 mins',
        whyRecommended: 'Exceptional animations of graph algorithms.',
        searchQuery: 'William Fiset Graph Theory Introduction tutorial',
        topicId: 'graphs-bfs-dfs',
        difficulty: 'medium'
      }
    ]
  },

  {
    id: 'dynamic-programming-1d',
    title: 'Dynamic Programming (1D & Memoization)',
    category: 'Advanced Problem Solving',
    trackLevel: 'intermediate',
    order: 11,
    description: 'Overlapping subproblems, optimal substructure, top-down memoization, and bottom-up tabulation.',
    prerequisites: ['recursion-backtracking', 'arrays-and-strings'],
    concept: 'Dynamic Programming solves complex problems by breaking them down into overlapping subproblems, storing the result of each subproblem so it is never calculated twice. The transition relation defines state dp[i] from previous states.',
    whyItMatters: 'Transforms exponential O(2^N) brute force algorithms into polynomial O(N) or O(N^2) speed.',
    visualExplanation: `
Climbing Stairs (n=4):
Fibonacci recurrence: ways(n) = ways(n-1) + ways(n-2)
Tree without DP:
           f(4)
         /      \\
       f(3)      f(2)   <- f(2) calculated multiple times!
      /    \\     /   \\
    f(2)  f(1) f(1) f(0)

With DP Array: [1, 1, 2, 3, 5] -> Calculated strictly in O(N) linear time!
`,
    timeComplexity: {
      best: 'O(N)',
      average: 'O(N)',
      worst: 'O(N)',
      description: 'Number of unique states * work done per state.'
    },
    spaceComplexity: {
      worst: 'O(N) array or O(1) optimized variables',
      description: 'Can often be optimized to O(1) space if only the last 2 states are needed.'
    },
    codeSnippets: {
      javascript: `// Coin Change (Bottom-Up Tabulation)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `# Coin Change (Bottom-Up Tabulation)
def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], 1 + dp[i - coin])
                
    return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `// Coin Change (Bottom-Up Tabulation)
#include <vector>
#include <algorithm>

int coinChange(const std::vector<int>& coins, int amount) {
    std::vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; ++i) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = std::min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      java: `// Coin Change (Bottom-Up Tabulation)
import java.util.Arrays;

public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`
    },
    commonMistakes: [
      'Failing to identify the base cases (e.g. dp[0] = 0 or dp[0] = 1).',
      'Confusing the state definition (what does dp[i] represent?).',
      'Jumping directly to bottom-up code without defining the recursive mathematical transition first.'
    ],
    patterns: [
      {
        name: 'Unbounded Knapsack / Minimum Cost State',
        description: 'State dp[i] depends on choosing from a set of options and taking the min/max of 1 + dp[i - option].',
        exampleProblem: 'Coin Change / Word Break / House Robber'
      }
    ],
    practiceProblemIds: ['climbing-stairs', 'coin-change', 'house-robber'],
    recommendedResources: [
      {
        id: 'neetcode-dp-1d',
        title: 'Dynamic Programming 1D Complete Guide & Patterns',
        creator: 'NeetCode',
        channelName: 'NeetCode',
        description: 'Intuitive breakdown of transition states from recursive decision trees to bottom-up tables.',
        duration: '32 mins',
        whyRecommended: 'Demystifies dynamic programming with simple visual decision trees.',
        searchQuery: 'NeetCode Dynamic Programming 1D tutorial Coin Change',
        topicId: 'dynamic-programming-1d',
        difficulty: 'medium'
      }
    ]
  },

  // ==================== PRO TRACK ====================
  {
    id: 'union-find-dsu',
    title: 'Disjoint Set Union (DSU / Union-Find)',
    category: 'Advanced Graph Data Structures',
    trackLevel: 'pro',
    order: 12,
    description: 'Near O(1) dynamic connectivity, path compression, union by rank, and Kruskal\'s MST algorithm.',
    prerequisites: ['graphs-bfs-dfs', 'trees-and-bst'],
    concept: 'Disjoint Set Union (DSU) maintains a partition of a set into disjoint subsets. With Path Compression and Union by Rank heuristics, Find and Union operations run in nearly O(1) amortized time (strictly O(alpha(N)), the inverse Ackermann function).',
    whyItMatters: 'Essential for Kruskal\'s Minimum Spanning Tree, dynamic cycle detection in undirected graphs, and network connectivity queries.',
    visualExplanation: `
Initial Elements: {0}, {1}, {2}, {3}, {4}
Union(0, 1): [0] <- [1]
Union(1, 2): [0] <- [1], [0] <- [2] (Path compression flattens tree directly to root!)
Find(x): Climbs to root and rewires all parent pointers directly to root.
`,
    timeComplexity: {
      best: 'O(1)',
      average: 'O(alpha(N)) ≈ O(1)',
      worst: 'O(alpha(N))',
      description: 'alpha(N) is smaller than 5 for any practical input size N up to the number of atoms in the observable universe.'
    },
    spaceComplexity: {
      worst: 'O(N)',
      description: 'Stores parent and rank arrays of size N.'
    },
    codeSnippets: {
      javascript: `// DSU with Path Compression and Union by Rank
class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path Compression
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false; // Cycle detected!
    
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}`,
      python: `# DSU with Path Compression and Union by Rank
class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x]) # Path compression
        return self.parent[x]
        
    def union(self, x: int, y: int) -> bool:
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False # Already connected
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True`,
      cpp: `// DSU Class in C++
#include <vector>
#include <numeric>

class DSU {
    std::vector<int> parent, rank;
public:
    DSU(int n) : parent(n), rank(n, 0) {
        std::iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;
        if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;
        else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;
        else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
};`,
      java: `// DSU Class in Java
public class DSU {
    private int[] parent;
    private int[] rank;
    
    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    
    public int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    public boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;
        if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;
        else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;
        else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
}`
    },
    commonMistakes: [
      'Forgetting path compression in find(), leading to O(N) tall chain degradation.',
      'Uniting nodes directly without finding their respective roots first (this.parent[x] = y is wrong; must union find(x) with find(y)).',
      'Using DSU on directed graphs (DSU is strictly for undirected connectivity and equivalence relations).'
    ],
    patterns: [
      {
        name: 'Cycle Detection & Redundant Connection',
        description: 'Iterate through edges; if find(u) == find(v), edge (u, v) creates a cycle.',
        exampleProblem: 'Redundant Connection / Number of Provinces / Accounts Merge'
      }
    ],
    practiceProblemIds: ['redundant-connection', 'number-of-provinces'],
    recommendedResources: [
      {
        id: 'william-fiset-union-find',
        title: 'Union Find (Disjoint Set) Data Structure & Kruskal\'s Algorithm',
        creator: 'William Fiset',
        channelName: 'William Fiset',
        description: 'Exceptional visual animation of path compression and union by rank trees.',
        duration: '25 mins',
        whyRecommended: 'The cleanest visual representation of DSU data structure.',
        searchQuery: 'William Fiset Union Find Disjoint Set data structure tutorial',
        topicId: 'union-find-dsu',
        difficulty: 'hard'
      }
    ]
  },

  {
    id: 'topological-sort',
    title: 'Topological Sort & Kahn\'s Algorithm',
    category: 'Advanced Graph Algorithms',
    trackLevel: 'pro',
    order: 13,
    description: 'Linear ordering of vertices in Directed Acyclic Graphs (DAG), in-degree reduction, and cycle detection.',
    prerequisites: ['graphs-bfs-dfs', 'stacks-and-queues'],
    concept: 'A Topological Sort of a directed graph is a linear ordering of vertices such that for every directed edge u -> v, vertex u comes before v. It only exists for Directed Acyclic Graphs (DAG). Kahn\'s algorithm uses in-degree counting with a BFS queue.',
    whyItMatters: 'Build systems (Webpack, Make, Vite), task dependency scheduling, course prerequisite verification, and spreadsheet cell recalculation.',
    visualExplanation: `
Course 0 -> Course 1 -> Course 3
Course 0 -> Course 2 -> Course 3
In-degrees:
0: 0 (No prerequisites -> Push to queue!)
1: 1
2: 1
3: 2
Process 0 -> Decrement neighbors (1:0, 2:0) -> Push 1 & 2 -> Process 3
Valid Order: [0, 1, 2, 3] or [0, 2, 1, 3]
`,
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
      description: 'Processes each vertex and edge exactly once.'
    },
    spaceComplexity: {
      worst: 'O(V + E)',
      description: 'Stores adjacency list, in-degree array, and BFS queue.'
    },
    codeSnippets: {
      javascript: `// Course Schedule II (Kahn's Algorithm BFS)
function findOrder(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }
  
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  const order = [];
  while (queue.length > 0) {
    const curr = queue.shift();
    order.push(curr);
    
    for (const next of adj[curr]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  
  return order.length === numCourses ? order : [];
}`,
      python: `# Course Schedule II (Kahn's Algorithm BFS)
from collections import deque

def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    in_degree = [0] * num_courses
    adj = [[] for _ in range(num_courses)]
    
    for course, prereq in prerequisites:
        adj[prereq].append(course)
        in_degree[course] += 1
        
    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    order = []
    
    while queue:
        curr = queue.popleft()
        order.append(curr)
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return order if len(order) == num_courses else []`,
      cpp: `// Course Schedule II (Kahn's Algorithm)
#include <vector>
#include <queue>

std::vector<int> findOrder(int numCourses, const std::vector<std::vector<int>>& prerequisites) {
    std::vector<int> inDegree(numCourses, 0);
    std::vector<std::vector<int>> adj(numCourses);
    for (const auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }
    std::queue<int> q;
    for (int i = 0; i < numCourses; ++i) {
        if (inDegree[i] == 0) q.push(i);
    }
    std::vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }
    return order.size() == numCourses ? order : std::vector<int>();
}`,
      java: `// Course Schedule II (Kahn's Algorithm)
import java.util.*;

public int[] findOrder(int numCourses, int[][] prerequisites) {
    int[] inDegree = new int[numCourses];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        inDegree[p[0]]++;
    }
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) q.offer(i);
    }
    int[] order = new int[numCourses];
    int idx = 0;
    while (!q.isEmpty()) {
        int curr = q.poll();
        order[idx++] = curr;
        for (int next : adj.get(curr)) {
            if (--inDegree[next] == 0) q.offer(next);
        }
    }
    return idx == numCourses ? order : new int[0];
}`
    },
    commonMistakes: [
      'Assuming topological sort is unique (a DAG can have multiple valid topological orders).',
      'Forgetting that if order.length < V at the end, a cycle exists and no topological ordering is possible.',
      'Reversing the direction of edges in adjacency list setup.'
    ],
    patterns: [
      {
        name: 'Prerequisite Dependency Resolution',
        description: 'Initialize in-degree counts, push 0 in-degree items, reduce in-degrees as prerequisites complete.',
        exampleProblem: 'Course Schedule I & II / Alien Dictionary'
      }
    ],
    practiceProblemIds: ['course-schedule', 'course-schedule-ii'],
    recommendedResources: [
      {
        id: 'striver-topological-sort',
        title: 'Topological Sort Kahn\'s Algorithm BFS & DFS Proof',
        creator: 'Striver (take U forward)',
        channelName: 'take U forward',
        description: 'Complete proof of DAG ordering and in-degree queuing.',
        duration: '22 mins',
        whyRecommended: 'Clear step-by-step trace of Kahn\'s queue.',
        searchQuery: 'Striver Topological Sort Kahns Algorithm take U forward',
        topicId: 'topological-sort',
        difficulty: 'hard'
      }
    ]
  },

  {
    id: 'shortest-path-dijkstra',
    title: 'Shortest Path (Dijkstra & Priority Queues)',
    category: 'Advanced Graph Algorithms',
    trackLevel: 'pro',
    order: 14,
    description: 'Single-source shortest path on weighted graphs with non-negative edge weights using Min-Heaps.',
    prerequisites: ['graphs-bfs-dfs', 'heaps-priority-queues'],
    concept: 'Dijkstra\'s algorithm calculates the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It greedily selects the unvisited node with the smallest known distance using a Min-Heap (Priority Queue).',
    whyItMatters: 'Powers network routing protocols (OSPF, IS-IS), Google Maps driving navigation, and trading latency arbitrage.',
    visualExplanation: `
Source Node S (dist = 0)
Min-Heap maintains pairs (current_dist, node)
Pop smallest distance -> Relax all incident edges (dist[v] = min(dist[v], dist[u] + weight(u,v)))
Push newly reduced distances back into Min-Heap!
`,
    timeComplexity: {
      best: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      worst: 'O((V + E) log V)',
      description: 'Each vertex is extracted from Min-Heap once (V log V) and each edge is relaxed at most once (E log V).'
    },
    spaceComplexity: {
      worst: 'O(V + E)',
      description: 'Priority queue and distance array.'
    },
    codeSnippets: {
      javascript: `// Dijkstra's Shortest Path Algorithm
function dijkstra(n, edges, source) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, weight] of edges) {
    adj[u].push([v, weight]);
    adj[v].push([u, weight]); // If undirected
  }
  
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  
  // Array-based simple Priority Queue representation
  const pq = [[0, source]];
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]); // In production use a binary min-heap
    const [d, u] = pq.shift();
    
    if (d > dist[u]) continue;
    
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
      python: `# Dijkstra's Shortest Path using heapq
import heapq

def dijkstra(n: int, edges: list[list[int]], source: int) -> list[int]:
    adj = [[] for _ in range(n)]
    for u, v, weight in edges:
        adj[u].append((v, weight))
        adj[v].append((u, weight)) # If undirected
        
    dist = [float('inf')] * n
    dist[source] = 0
    pq = [(0, source)] # (distance, node)
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
            
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
                
    return dist`,
      cpp: `// Dijkstra's Shortest Path in C++
#include <vector>
#include <queue>

std::vector<int> dijkstra(int n, const std::vector<std::vector<int>>& edges, int src) {
    std::vector<std::vector<std::pair<int, int>>> adj(n);
    for (const auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
        adj[e[1]].push_back({e[0], e[2]});
    }
    std::vector<int> dist(n, 1e9);
    dist[src] = 0;
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<std::pair<int, int>>> pq;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto& edge : adj[u]) {
            int v = edge.first, w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      java: `// Dijkstra's Shortest Path in Java
import java.util.*;

public int[] dijkstra(int n, int[][] edges, int src) {
    List<List<int[]>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(new int[]{e[1], e[2]});
        adj.get(e[1]).add(new int[]{e[0], e[2]});
    }
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});
    
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue;
        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`
    },
    commonMistakes: [
      'Applying Dijkstra on graphs with negative edge weights (this causes incorrect greedy assumptions; use Bellman-Ford instead).',
      'Forgetting the if (d > dist[u]) continue optimization, causing redundant stale heap entries to be processed.',
      'Using a regular FIFO queue instead of a Min-Heap priority queue.'
    ],
    patterns: [
      {
        name: 'State Graph Shortest Path',
        description: 'Expand node definition into (node, remaining_fuel) or (node, k_stops) to solve constrained shortest path.',
        exampleProblem: 'Network Delay Time / Cheapest Flights Within K Stops / Path With Minimum Effort'
      }
    ],
    practiceProblemIds: ['network-delay-time', 'cheapest-flights-within-k-stops'],
    recommendedResources: [
      {
        id: 'abdul-bari-dijkstra',
        title: 'Dijkstra Algorithm Single Source Shortest Path',
        creator: 'Abdul Bari',
        channelName: 'Abdul Bari',
        description: 'The definitive manual trace of table updates, edge relaxations, and priority queue states.',
        duration: '29 mins',
        whyRecommended: 'Unmatched clarity in explaining the greedy edge relaxation principle.',
        searchQuery: 'Abdul Bari Dijkstra Algorithm single source shortest path',
        topicId: 'shortest-path-dijkstra',
        difficulty: 'hard'
      }
    ]
  },

  {
    id: 'trie-prefix-tree',
    title: 'Trie (Prefix Tree)',
    category: 'Advanced String & Tree Data Structures',
    trackLevel: 'pro',
    order: 15,
    description: 'N-ary tree structure for fast string retrieval, prefix autocomplete, and bitwise XOR queries.',
    prerequisites: ['trees-and-bst', 'hashing-hashmaps'],
    concept: 'A Trie (pronounced "try") is a specialized tree used to store associative arrays where keys are usually strings. Nodes represent characters, and paths from root to marked leaf nodes represent complete words.',
    whyItMatters: 'Powers search engine autocomplete, spell checkers, IP routing table longest-prefix matching, and word games (Boggle/Word Search II).',
    visualExplanation: `
Insert "cat", "car", "dog":
         (Root)
        /      \\
      [c]      [d]
       |        |
      [a]      [o]
     /   \\      |
  [t]*   [r]*  [g]*   (* indicates end-of-word)
Prefix search for "ca" takes O(L) time where L is word length!
`,
    timeComplexity: {
      best: 'O(L) where L is string length',
      average: 'O(L)',
      worst: 'O(L)',
      description: 'Operations depend strictly on the length of the string L, completely independent of the number of words N in the dictionary!'
    },
    spaceComplexity: {
      worst: 'O(N * L * AlphabetSize)',
      description: 'Can take significant memory if there are few common prefixes; optimized with radix trees / compressions.'
    },
    codeSnippets: {
      javascript: `// Implement Trie (Prefix Tree)
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  insert(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) {
        curr.children[char] = new TrieNode();
      }
      curr = curr.children[char];
    }
    curr.isEndOfWord = true;
  }
  
  search(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return curr.isEndOfWord;
  }
  
  startsWith(prefix) {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return true;
  }
}`,
      python: `# Implement Trie (Prefix Tree)
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
        
    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end = True
        
    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return curr.is_end
        
    def starts_with(self, prefix: str) -> bool:
        curr = self.root
        for char in prefix:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return True`,
      cpp: `// Implement Trie in C++
#include <string>
#include <vector>

class TrieNode {
public:
    std::vector<TrieNode*> children;
    bool isEnd;
    TrieNode() : children(26, nullptr), isEnd(false) {}
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    
    void insert(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx]) curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEnd = true;
    }
    
    bool search(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return curr->isEnd;
    }
    
    bool startsWith(const std::string& prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return true;
    }
};`,
      java: `// Implement Trie in Java
public class Trie {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }
    
    private final TrieNode root = new TrieNode();
    
    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }
    
    public boolean search(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return false;
            curr = curr.children[idx];
        }
        return curr.isEnd;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode curr = root;
        for (char c : prefix.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return false;
            curr = curr.children[idx];
        }
        return true;
    }
}`
    },
    commonMistakes: [
      'Confusing search() with startsWith() (search requires isEndOfWord === true; startsWith only requires reaching the end of the prefix).',
      'Forgetting character index calculation (char - \'a\') when using fixed size arrays.',
      'Memory leakage in C++ when destroying Trie (should write recursive destructor).'
    ],
    patterns: [
      {
        name: 'Prefix Tree Autocomplete & Backtracking Pruning',
        description: 'Traverse 2D character grid with DFS while simultaneously walking Trie to prune paths that do not form any dictionary prefix.',
        exampleProblem: 'Implement Trie / Word Search II / Maximum XOR of Two Numbers in an Array'
      }
    ],
    practiceProblemIds: ['implement-trie', 'word-search-ii'],
    recommendedResources: [
      {
        id: 'neetcode-trie',
        title: 'Trie (Prefix Tree) Implementation & Word Search II',
        creator: 'NeetCode',
        channelName: 'NeetCode',
        description: 'Complete explanation of building Trie nodes, search, and prefix matching.',
        duration: '19 mins',
        whyRecommended: 'Crystal clear visual node branching diagrams.',
        searchQuery: 'NeetCode Implement Trie Prefix Tree tutorial',
        topicId: 'trie-prefix-tree',
        difficulty: 'hard'
      }
    ]
  }
];
