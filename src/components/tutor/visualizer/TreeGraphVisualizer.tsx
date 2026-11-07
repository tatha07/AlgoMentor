import React, { useState } from 'react';
import { Search, RotateCcw, Network } from 'lucide-react';

interface TreeNode {
  val: number;
  x: number;
  y: number;
  leftVal?: number;
  rightVal?: number;
}

export const TreeGraphVisualizer: React.FC = () => {
  const [searchTarget, setSearchTarget] = useState<number>(18);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [foundNode, setFoundNode] = useState<number | null>(null);
  const [traversalType, setTraversalType] = useState<'bst-search' | 'inorder'>('bst-search');
  const [narrative, setNarrative] = useState<string>('Ready to search in BST. Root = 15.');

  // Pre-configured balanced BST
  //        15
  //      /    \
  //     8      23
  //    / \    /  \
  //   4  10  18  30
  const treeNodes: Record<number, TreeNode> = {
    15: { val: 15, x: 200, y: 35, leftVal: 8, rightVal: 23 },
    8: { val: 8, x: 100, y: 95, leftVal: 4, rightVal: 10 },
    23: { val: 23, x: 300, y: 95, leftVal: 18, rightVal: 30 },
    4: { val: 4, x: 50, y: 155 },
    10: { val: 10, x: 150, y: 155 },
    18: { val: 18, x: 250, y: 155 },
    30: { val: 30, x: 350, y: 155 },
  };

  const handleRunSearch = () => {
    const visited: number[] = [];
    let curr: number | undefined = 15;
    let found: number | null = null;
    let desc = `Starting search for target ${searchTarget} at Root (15).\n`;

    while (curr !== undefined) {
      visited.push(curr);
      if (curr === searchTarget) {
        found = curr;
        desc += `Target ${searchTarget} found at node ${curr}! Search terminates in O(height) = O(log N).`;
        break;
      }
      if (searchTarget < curr) {
        desc += `${searchTarget} < ${curr}: Move LEFT to left subtree.\n`;
        curr = treeNodes[curr]?.leftVal;
      } else {
        desc += `${searchTarget} > ${curr}: Move RIGHT to right subtree.\n`;
        curr = treeNodes[curr]?.rightVal;
      }
    }

    if (found === null) {
      desc += `Target ${searchTarget} not found in the BST. Reached null leaf.`;
    }

    setVisitedNodes(visited);
    setFoundNode(found);
    setNarrative(desc);
  };

  const handleInorderTraversal = () => {
    setVisitedNodes([4, 8, 10, 15, 18, 23, 30]);
    setFoundNode(null);
    setNarrative(
      'In-Order Traversal (Left -> Root -> Right) of a BST ALWAYS visits nodes in strictly ascending sorted order: [4, 8, 10, 15, 18, 23, 30]. Time: O(N).'
    );
  };

  const handleReset = () => {
    setVisitedNodes([]);
    setFoundNode(null);
    setNarrative('Visualizer reset. Enter a target and test BST search.');
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-orange-500" /> Binary Search Tree (BST)
          </span>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">Target:</span>
            <input
              type="number"
              value={searchTarget}
              onChange={e => setSearchTarget(Number(e.target.value))}
              className="w-14 px-2 py-1 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSearch}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
          <button
            onClick={handleInorderTraversal}
            className="px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-orange-500 rounded-lg transition-colors"
          >
            In-Order (Sorted)
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-rose-500"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Tree Canvas */}
      <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full max-w-md h-48 select-none">
          {/* Edges */}
          <line x1="200" y1="35" x2="100" y2="95" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="2" />
          <line x1="200" y1="35" x2="300" y2="95" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="2" />

          <line x1="100" y1="95" x2="50" y2="155" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="2" />
          <line x1="100" y1="95" x2="150" y2="155" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="2" />

          <line x1="300" y1="95" x2="250" y2="155" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="2" />
          <line x1="300" y1="95" x2="350" y2="155" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="2" />

          {/* Node Circles */}
          {Object.values(treeNodes).map(node => {
            const isFound = foundNode === node.val;
            const isVisited = visitedNodes.includes(node.val);

            let fill = '#f4f4f5';
            let stroke = '#d4d4d8';
            let textColor = '#18181b';

            if (isFound) {
              fill = '#10b981';
              stroke = '#059669';
              textColor = '#ffffff';
            } else if (isVisited) {
              fill = '#ea580c';
              stroke = '#c2410c';
              textColor = '#ffffff';
            }

            return (
              <g key={node.val} className="transition-all duration-300">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                  className={isFound ? 'animate-bounce' : ''}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Narrative Box */}
        <div className="mt-2 w-full p-3 bg-zinc-50 dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
          {narrative}
        </div>
      </div>
    </div>
  );
};
