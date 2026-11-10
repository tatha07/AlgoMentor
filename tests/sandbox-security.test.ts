import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { executeJavaScriptSandbox, extractParamNames } from '../src/lib/sandbox';

describe('Sandbox Security & Isolation Tests', () => {
  test('Prevents sandbox breakout to host process via prototype chain', () => {
    // Attempting to reach host process or process.exit via constructor
    const breakoutCode = `
      let result = 'safe';
      try {
        if (typeof process !== 'undefined') result = 'escaped-global-process';
        else if (typeof require !== 'undefined') result = 'escaped-require';
        else {
          const fn = this.constructor.constructor;
          const proc = fn('return typeof process !== "undefined" ? process : null')();
          if (proc && proc.exit) {
            result = 'escaped-constructor';
          }
        }
      } catch (e) {
        result = 'blocked: ' + e.message;
      }
      console.log('STATUS:', result);
    `;

    const res = executeJavaScriptSandbox(breakoutCode);
    assert.equal(res.status, 'success');
    assert.ok(
      res.stdout.includes('safe') || res.stdout.includes('blocked'),
      `Expected sandbox escape to be blocked, got stdout: ${res.stdout}`
    );
    assert.ok(!res.stdout.includes('escaped-constructor'));
    assert.ok(!res.stdout.includes('escaped-global-process'));
  });

  test('Terminates infinite loops within timeout without crashing host', () => {
    const infiniteLoopCode = `
      let x = 0;
      while (true) {
        x++;
      }
    `;

    const res = executeJavaScriptSandbox(infiniteLoopCode, [], { timeoutMs: 500 });
    assert.equal(res.status, 'error');
    assert.ok(
      res.stderr?.includes('timed out') || res.stderr?.includes('timeout'),
      `Expected timeout error in stderr, got: ${res.stderr}`
    );
  });

  test('Protects against log flooding and memory DoS', () => {
    const floodCode = `
      for (let i = 0; i < 500; i++) {
        console.log('Flood iteration ' + i + ': ' + 'A'.repeat(500));
      }
    `;

    const res = executeJavaScriptSandbox(floodCode, [], { maxLogs: 20, maxLogLength: 100 });
    assert.equal(res.status, 'success');
    assert.ok(res.stdout.includes('[Output truncated: maximum log output limit reached]'));
    const lineCount = res.stdout.split('\n').length;
    assert.ok(lineCount <= 22, `Expected at most 22 lines, got ${lineCount}`);
  });

  test('Safely handles circular objects in console logs without throwing', () => {
    const circularCode = `
      const obj = { name: 'GraphNode' };
      obj.self = obj;
      console.log('Circular:', obj);
    `;

    const res = executeJavaScriptSandbox(circularCode);
    assert.equal(res.status, 'success');
    assert.ok(res.stdout.includes('Circular:'));
    assert.ok(res.stdout.includes('[Circular]'));
  });

  test('Rejects oversized code payload to prevent memory exhaustion', () => {
    const hugeCode = 'let a = 1;\n'.repeat(10000); // > 100KB
    const res = executeJavaScriptSandbox(hugeCode, [], { maxCodeLength: 5000 });
    assert.equal(res.status, 'error');
    assert.ok(res.stderr?.includes('maximum allowed size'));
  });

  test('Rejects excessive test cases to prevent execution exhaustion', () => {
    const cases = Array.from({ length: 30 }, (_, i) => ({
      input: `x = ${i}`,
      expected: `${i}`,
    }));

    const res = executeJavaScriptSandbox('function solve(x) { return x; }', cases, { maxTestCases: 10 });
    assert.equal(res.status, 'error');
    assert.ok(res.stderr?.includes('Maximum 10 test cases allowed'));
  });
});

describe('Sandbox Test Case Evaluation & Parameter Extraction', () => {
  test('Correctly extracts parameter names with array and comma inputs', () => {
    assert.deepEqual(
      extractParamNames('nums = [2, 7, 11, 15], target = 9'),
      ['nums', 'target']
    );
    assert.deepEqual(
      extractParamNames('nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3'),
      ['nums1', 'm', 'nums2', 'n']
    );
    assert.deepEqual(
      extractParamNames('head = [1, 2, 3, 4, 5]'),
      ['head']
    );
    assert.deepEqual(
      extractParamNames('s = "()[]{}"'),
      ['s']
    );
  });

  test('Evaluates Two Sum solution correctly with array and target inputs', () => {
    const twoSumSolution = `
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
      }
    `;

    const testCases = [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0,1]' },
    ];

    const res = executeJavaScriptSandbox(twoSumSolution, testCases);
    assert.equal(res.status, 'success');
    assert.equal(res.testResults?.length, 3);
    assert.ok(res.testResults?.every(tc => tc.passed));
  });

  test('Safely handles non-string expected values (numbers, booleans, objects)', () => {
    const code = `
      function countElements(nums) {
        return nums.length;
      }
    `;

    const testCases = [
      { input: 'nums = [1, 2, 3, 4]', expected: 4 as any },
      { input: 'nums = []', expected: 0 as any },
    ];

    const res = executeJavaScriptSandbox(code, testCases);
    assert.equal(res.status, 'success');
    assert.equal(res.testResults?.length, 2);
    assert.equal(res.testResults?.[0].passed, true);
    assert.equal(res.testResults?.[1].passed, true);
  });

  test('Reports wrong_answer status when solution fails test cases', () => {
    const buggyCode = `
      function twoSum(nums, target) {
        return [0, 0]; // Buggy hardcoded
      }
    `;

    const testCases = [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
    ];

    const res = executeJavaScriptSandbox(buggyCode, testCases);
    assert.equal(res.status, 'wrong_answer');
    assert.equal(res.testResults?.[0].passed, false);
  });

  test('Reports clean error status on JavaScript syntax errors', () => {
    const syntaxErrorCode = `
      function twoSum(nums, target) {
        return [
    `;

    const res = executeJavaScriptSandbox(syntaxErrorCode);
    assert.equal(res.status, 'error');
    assert.ok(res.stderr?.length);
  });
});
