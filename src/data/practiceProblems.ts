import { PracticeProblem } from '../types';

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    topicId: 'hashing-hashmaps',
    topicName: 'Hash Tables & Hash Maps',
    difficulty: 'easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your code here
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Your code here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[0];
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1 (Conceptual): A naive approach with nested loops checks every pair in O(N^2) time. Can we do this in a single pass?',
      '💡 Hint 2 (Pattern): For any number X in the array, what specific value are we searching for? We need (target - X).',
      '💡 Hint 3 (Pseudocode): Maintain a Hash Map mapping { value: index }. As you iterate through index i with value nums[i], check if (target - nums[i]) exists in the map.',
      '💡 Hint 4 (Near Solution): If map.has(target - nums[i]), return [map.get(target - nums[i]), i]. Otherwise, map.set(nums[i], i).'
    ],
    solutionExplanation: `### Optimal Solution: One-Pass Hash Map

1. **Intuition**: We want to find two numbers \`a + b = target\`. When we examine \`a\`, we know \`b = target - a\`. If we store previously visited numbers in a hash map, we can check if \`b\` was already seen in O(1) average time.
2. **Time Complexity**: **O(N)** — We traverse the list of \`N\` elements once, performing O(1) hash map operations.
3. **Space Complexity**: **O(N)** — In the worst case, we store up to \`N\` elements in the hash map.`,
    expectedComplexity: {
      time: 'O(N)',
      space: 'O(N)'
    },
    tags: ['Array', 'Hash Table', 'NeetCode 150', 'Blind 75']
  },

  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    topicId: 'arrays-and-strings',
    topicName: 'Arrays & Dynamic Arrays',
    difficulty: 'easy',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true'
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  // Your code here
}`,
      python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # Your code here
        pass`,
      cpp: `#include <string>

class Solution {
public:
    bool isAnagram(std::string s, std::string t) {
        // Your code here
        return false;
    }
};`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Your code here
        return false;
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: If s and t have different lengths, could they ever be anagrams?',
      '💡 Hint 2: You could sort both strings in O(N log N) time and check equality, but can we count frequencies in O(N) time and O(1) extra alphabet space?',
      '💡 Hint 3: Create an integer array of size 26 for lowercase English letters. Increment counts for characters in s, and decrement for characters in t.',
      '💡 Hint 4: If all 26 frequency buckets equal 0 at the end, the strings are valid anagrams.'
    ],
    solutionExplanation: `### Optimal Solution: Fixed-Size Frequency Array (26 Buckets)

1. **Check Base Case**: If \`s.length !== t.length\`, return \`false\` immediately.
2. **Frequency Counting**: Allocate an array \`count\` of size 26.
3. **Traverse**: Increment \`count[s[i] - 'a']\` and decrement \`count[t[i] - 'a']\`.
4. **Validation**: Check if all buckets are 0.
- **Time Complexity**: **O(N)**
- **Space Complexity**: **O(1)** (constant 26 entries)`,
    expectedComplexity: {
      time: 'O(N)',
      space: 'O(1)'
    },
    tags: ['String', 'Hash Table', 'Frequency Counting']
  },

  {
    id: 'binary-search',
    title: 'Binary Search',
    topicId: 'binary-search-foundations',
    topicName: 'Binary Search & Monotonic Search Spaces',
    difficulty: 'easy',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Your code here
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        // Your code here
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Your code here
        return -1;
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: The array is sorted. How can you discard half the remaining numbers on every comparison?',
      '💡 Hint 2: Set two pointers \`left = 0\` and \`right = nums.length - 1\`. While \`left <= right\`, inspect the midpoint.',
      '💡 Hint 3: Compute \`mid = left + Math.floor((right - left) / 2)\` to prevent integer overflow in languages with fixed integer sizes.',
      '💡 Hint 4: If \`nums[mid] === target\`, return \`mid\`. If \`nums[mid] < target\`, set \`left = mid + 1\`. Else set \`right = mid - 1\`.'
    ],
    solutionExplanation: `### Optimal Solution: Iterative Binary Search

1. **Invariants**: Maintain search boundaries \`left\` and \`right\`.
2. **Division**: Cut remaining candidates in half each iteration by comparing \`target\` to \`nums[mid]\`.
- **Time Complexity**: **O(log N)**
- **Space Complexity**: **O(1)**`,
    expectedComplexity: {
      time: 'O(log N)',
      space: 'O(1)'
    },
    tags: ['Binary Search', 'Array']
  },

  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    topicId: 'linked-lists',
    topicName: 'Singly & Doubly Linked Lists',
    difficulty: 'easy',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]'
      },
      {
        input: 'head = []',
        output: '[]'
      }
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // Your code here
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Your code here
        pass`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Your code here
        return nullptr;
    }
};`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Your code here
        return null;
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: What happens if you reassign \`curr.next = prev\` without saving the original \`curr.next\` first? You lose the rest of the list!',
      '💡 Hint 2: You will need three pointer references: \`prev\`, \`curr\`, and \`nextTemp\`.',
      '💡 Hint 3: Start with \`prev = null\` and \`curr = head\`. In a while loop (\`curr !== null\`), save \`nextTemp = curr.next\`, reverse \`curr.next = prev\`, then advance \`prev = curr\` and \`curr = nextTemp\`.',
      '💡 Hint 4: When \`curr\` becomes null, \`prev\` points to the new head of the reversed list.'
    ],
    solutionExplanation: `### Optimal Solution: 3-Pointer In-Place Iteration

- **Time Complexity**: **O(N)** — Single pass through the linked list.
- **Space Complexity**: **O(1)** — Only 3 pointer variables.`,
    expectedComplexity: {
      time: 'O(N)',
      space: 'O(1)'
    },
    tags: ['Linked List', 'Recursion', 'Blind 75']
  },

  {
    id: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    topicId: 'sliding-window',
    topicName: 'Sliding Window Technique',
    difficulty: 'medium',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your code here
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Your code here
        pass`,
      cpp: `#include <string>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        // Your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your code here
        return 0;
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: We are looking for contiguous substrings. What algorithmic pattern handles contiguous sub-ranges dynamically?',
      '💡 Hint 2: Use a Sliding Window with two pointers \`left\` and \`right\`, and a Set/Map to track characters inside the active window.',
      '💡 Hint 3: As \`right\` expands forward, if \`s[right]\` is already in your Set, shrink the window by deleting \`s[left]\` and incrementing \`left++\` until the duplicate is gone.',
      '💡 Hint 4: After ensuring no duplicates, add \`s[right]\` to the set and update \`maxLen = Math.max(maxLen, right - left + 1)\`.'
    ],
    solutionExplanation: `### Optimal Solution: Sliding Window with Hash Set

- **Time Complexity**: **O(N)** — Each character is visited at most twice (once by \`right\` and once by \`left\`).
- **Space Complexity**: **O(min(N, AlphabetSize))** for the character set.`,
    expectedComplexity: {
      time: 'O(N)',
      space: 'O(min(N, K))'
    },
    tags: ['Sliding Window', 'Hash Table', 'String', 'Blind 75']
  },

  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    topicId: 'two-pointers',
    topicName: 'Two Pointers (Opposite & Same Direction)',
    difficulty: 'medium',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.

**Notice** that you may not slant the container.`,
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The vertical lines are [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49 (between index 1 and index 8).'
      },
      {
        input: 'height = [1,1]',
        output: '1'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // Your code here
}`,
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    int maxArea(std::vector<int>& height) {
        // Your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Your code here
        return 0;
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: The area is determined by \`width * min(height[left], height[right])\`. Where is the width the widest?',
      '💡 Hint 2: Start with pointers at the extreme ends: \`left = 0\` and \`right = height.length - 1\`.',
      '💡 Hint 3: If \`height[left] < height[right]\`, can moving the right pointer inward ever produce a larger area? No, because width shrinks and height is still bottlenecked by height[left].',
      '💡 Hint 4: Therefore, always move the pointer pointing to the shorter line inward (\`if height[left] < height[right] left++ else right--\`).'
    ],
    solutionExplanation: `### Optimal Solution: Greedy Two Pointers

1. **Widest Width First**: Start at edges \`left = 0\`, \`right = n - 1\`.
2. **Greedy Elimination**: Always discard the bottleneck line by incrementing/decrementing that pointer.
- **Time Complexity**: **O(N)**
- **Space Complexity**: **O(1)**`,
    expectedComplexity: {
      time: 'O(N)',
      space: 'O(1)'
    },
    tags: ['Two Pointers', 'Greedy', 'Array', 'Blind 75']
  },

  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    topicId: 'graphs-bfs-dfs',
    topicName: 'Graph Fundamentals & BFS/DFS Traversals',
    difficulty: 'medium',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    examples: [
      {
        input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
        output: '1'
      },
      {
        input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
        output: '3'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Your code here
}`,
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    int numIslands(std::vector<std::vector<char>>& grid) {
        // Your code here
        return 0;
    }
};`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Your code here
        return 0;
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: Treat the 2D grid as an unweighted undirected graph where each cell \`(r, c)\` connects to its 4 cardinal neighbors \`(r±1, c±1)\`.',
      '💡 Hint 2: Iterate through every cell. When you encounter a \`"1"\`, you have discovered a new connected component (island)! Increment your counter.',
      '💡 Hint 3: Launch a DFS or BFS from that cell to "sink" (mark as \`"0"\` or visited) all connected land cells in that island.',
      '💡 Hint 4: Ensure your DFS boundary check catches \`r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === "0"\`.'
    ],
    solutionExplanation: `### Optimal Solution: Grid Flood Fill (DFS/BFS)

- **Time Complexity**: **O(M * N)** — Every cell in the grid is visited at most a constant number of times.
- **Space Complexity**: **O(M * N)** worst-case recursion stack (e.g. if the entire grid is land).`,
    expectedComplexity: {
      time: 'O(M * N)',
      space: 'O(M * N)'
    },
    tags: ['Graph', 'BFS', 'DFS', 'Matrix', 'Blind 75']
  },

  {
    id: 'coin-change',
    title: 'Coin Change',
    topicId: 'dynamic-programming-1d',
    topicName: 'Dynamic Programming (1D & Memoization)',
    difficulty: 'medium',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins)'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Your code here
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # Your code here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        // Your code here
        return -1;
    }
};`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Your code here
        return -1;
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: A greedy approach (picking largest coin first) fails (e.g., coins = [1, 3, 4, 5], amount = 7 -> Greedy gives 5+1+1=3 coins, but optimal is 4+3=2 coins!).',
      '💡 Hint 2: We must try all possibilities using Dynamic Programming. Let \`dp[i]\` be the minimum coins needed to make amount \`i\`.',
      '💡 Hint 3: Base case: \`dp[0] = 0\`. Initialize \`dp[1...amount]\` with \`Infinity\` (or \`amount + 1\`).',
      '💡 Hint 4: Transition: For each amount \`i\` from 1 to \`amount\`, for each coin \`c\` in \`coins\`: if \`i - c >= 0\`, \`dp[i] = Math.min(dp[i], 1 + dp[i - c])\`.'
    ],
    solutionExplanation: `### Optimal Solution: 1D Bottom-Up DP (Unbounded Knapsack)

1. **State Definition**: \`dp[i]\` = min coins needed for value \`i\`.
2. **Transition**: \`dp[i] = min(dp[i], 1 + dp[i - coin])\` for all coins where \`i >= coin\`.
- **Time Complexity**: **O(amount * len(coins))**
- **Space Complexity**: **O(amount)**`,
    expectedComplexity: {
      time: 'O(Amount * N)',
      space: 'O(Amount)'
    },
    tags: ['Dynamic Programming', 'Knapsack', 'Blind 75']
  },

  {
    id: 'course-schedule',
    title: 'Course Schedule (Cycle in DAG)',
    topicId: 'topological-sort',
    topicName: 'Topological Sort & Kahn\'s Algorithm',
    difficulty: 'medium',
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you **must** take course \`bi\` first if you want to take course \`ai\`.

For example, the pair \`[0, 1]\`, indicates that to take course \`0\` you have to first take course \`1\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique.'
    ],
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'To take course 1 you should take 0, and to take 0 you should take 1. Cyclic dependency -> Impossible.'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
  // Your code here
}`,
      python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        # Your code here
        pass`,
      cpp: `#include <vector>

class Solution {
public:
    bool canFinish(int numCourses, std::vector<std::vector<int>>& prerequisites) {
        // Your code here
        return false;
    }
};`,
      java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Your code here
        return false;
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: This problem boils down to checking whether a directed graph contains a cycle.',
      '💡 Hint 2: If there is a cycle (e.g. A depends on B, B depends on A), neither course can ever be completed.',
      '💡 Hint 3: Use Kahn\'s algorithm (BFS with in-degree array). A course with 0 in-degree has no unfulfilled prerequisites.',
      '💡 Hint 4: Push all courses with in-degree 0 to a queue. As you pop a course, decrement the in-degree of its dependents. If count of processed courses equals numCourses, return true.'
    ],
    solutionExplanation: `### Optimal Solution: Kahn's Algorithm (Topological BFS)

1. Build adjacency list \`adj[b] -> [a]\` and \`inDegree[a]++\`.
2. Push all nodes with \`inDegree === 0\` to queue.
3. Decrement child in-degrees; if child reaches 0, push to queue.
- **Time Complexity**: **O(V + E)**
- **Space Complexity**: **O(V + E)**`,
    expectedComplexity: {
      time: 'O(V + E)',
      space: 'O(V + E)'
    },
    tags: ['Graph', 'Topological Sort', 'BFS', 'DFS', 'Blind 75']
  },

  {
    id: 'word-search-ii',
    title: 'Word Search II (Trie + 2D Backtracking)',
    topicId: 'trie-prefix-tree',
    topicName: 'Trie (Prefix Tree)',
    difficulty: 'hard',
    description: `Given an \`m x n\` \`board\` of characters and a list of strings \`words\`, return *all words on the board*.

Each word must be constructed from letters of sequentially adjacent cells, where **adjacent cells** are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.`,
    constraints: [
      'm == board.length',
      'n == board[i].length',
      '1 <= m, n <= 12',
      'board[i][j] is a lowercase English letter.',
      '1 <= words.length <= 3 * 10^4',
      '1 <= words[i].length <= 10',
      'words[i] consists of lowercase English letters.',
      'All the strings of words are unique.'
    ],
    examples: [
      {
        input: `board = [
  ["o","a","a","n"],
  ["e","t","a","e"],
  ["i","h","k","r"],
  ["i","f","l","v"]
], words = ["oath","pea","eat","rain"]`,
        output: '["eat","oath"]'
      },
      {
        input: `board = [["a","b"],["c","d"]], words = ["abcb"]`,
        output: '[]'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
function findWords(board, words) {
  // Your code here
}`,
      python: `class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        # Your code here
        pass`,
      cpp: `#include <vector>
#include <string>

class Solution {
public:
    std::vector<std::string> findWords(std::vector<std::vector<char>>& board, std::vector<std::string>& words) {
        // Your code here
        return {};
    }
};`,
      java: `import java.util.*;

class Solution {
    public List<String> findWords(char[][] board, String[] words) {
        // Your code here
        return new ArrayList<>();
    }
}`
    },
    progressiveHints: [
      '💡 Hint 1: Running a separate Word Search DFS for every single word in \`words\` will result in Time Limit Exceeded (TLE).',
      '💡 Hint 2: How can we search for all words simultaneously as we traverse the board?',
      '💡 Hint 3: Insert all words into a Trie (Prefix Tree). When exploring the board with DFS, walk down the Trie simultaneously.',
      '💡 Hint 4: If the current board character is not a child in the current Trie node, immediately backtrack/prune! When you hit a Trie node containing a completed word, collect it and clear it to prevent duplicates.'
    ],
    solutionExplanation: `### Optimal Solution: Trie + Backtracking with Prefix Pruning

1. **Build Trie**: Insert all target words into a Trie. Store the actual \`word\` string in the end node for instant retrieval.
2. **DFS with Trie Traversal**: For each cell on board, if \`Trie.root.children[board[r][c]]\` exists, launch DFS.
3. **Backtrack In-Place**: Temporarily replace \`board[r][c] = '#'\` to prevent re-visiting in same path, restore after exploring.
- **Time Complexity**: **O(M * N * 4^(L))** where L is max word length.
- **Space Complexity**: **O(Total characters in words)** for the Trie.`,
    expectedComplexity: {
      time: 'O(M * N * 4^L)',
      space: 'O(Words Length)'
    },
    tags: ['Trie', 'Backtracking', 'Matrix', 'Blind 75', 'Hard']
  }
];
