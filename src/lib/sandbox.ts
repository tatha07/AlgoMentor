import vm from 'vm';

export interface TestCase {
  input: string;
  expected: any;
}

export interface TestCaseResult {
  testCaseIndex: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface SandboxExecutionResult {
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
  status: 'success' | 'wrong_answer' | 'error';
  testResults?: TestCaseResult[];
}

export interface SandboxOptions {
  timeoutMs?: number;
  maxCodeLength?: number;
  maxLogs?: number;
  maxLogLength?: number;
  maxTestCases?: number;
}

const DEFAULT_TIMEOUT_MS = 2500;
const DEFAULT_MAX_CODE_LENGTH = 50000;
const DEFAULT_MAX_LOGS = 100;
const DEFAULT_MAX_LOG_LENGTH = 1000;
const DEFAULT_MAX_TEST_CASES = 20;

/**
 * Safely stringifies an object handling circular references and error instances
 */
function safeStringify(val: any): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (val instanceof Error) return `${val.name}: ${val.message}`;

  try {
    const seen = new WeakSet();
    return JSON.stringify(val, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    });
  } catch {
    return String(val);
  }
}

/**
 * Extracts parameter identifier names from test case input string (e.g. "nums = [2, 7], target = 9")
 */
export function extractParamNames(inputStr: string): string[] {
  if (!inputStr || typeof inputStr !== 'string') return [];
  const regex = /(?:^|[,;])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(inputStr)) !== null) {
    if (m[1]) matches.push(m[1]);
  }
  return matches;
}

/**
 * Executes user JavaScript code in an isolated, security-hardened VM context.
 */
export function executeJavaScriptSandbox(
  code: string,
  testCases: TestCase[] = [],
  options: SandboxOptions = {}
): SandboxExecutionResult {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxCodeLength = options.maxCodeLength ?? DEFAULT_MAX_CODE_LENGTH;
  const maxLogs = options.maxLogs ?? DEFAULT_MAX_LOGS;
  const maxLogLength = options.maxLogLength ?? DEFAULT_MAX_LOG_LENGTH;
  const maxTestCases = options.maxTestCases ?? DEFAULT_MAX_TEST_CASES;

  const startTime = Date.now();

  // 1. Validation checks to prevent DoS via payload size
  if (!code || typeof code !== 'string') {
    return {
      stdout: '',
      stderr: 'Code is required.',
      executionTimeMs: 0,
      status: 'error',
    };
  }

  if (code.length > maxCodeLength) {
    return {
      stdout: '',
      stderr: `Code exceeds maximum allowed size of ${maxCodeLength} characters.`,
      executionTimeMs: 0,
      status: 'error',
    };
  }

  if (Array.isArray(testCases) && testCases.length > maxTestCases) {
    return {
      stdout: '',
      stderr: `Maximum ${maxTestCases} test cases allowed per run.`,
      executionTimeMs: 0,
      status: 'error',
    };
  }

  const logs: string[] = [];
  let logLimitReached = false;

  const appendLog = (prefix: string, args: any[]) => {
    if (logs.length >= maxLogs) {
      if (!logLimitReached) {
        logs.push('[Output truncated: maximum log output limit reached]');
        logLimitReached = true;
      }
      return;
    }
    const formatted = args
      .map(a => (typeof a === 'object' && a !== null ? safeStringify(a) : String(a)))
      .join(' ');
    const line = prefix ? `${prefix} ${formatted}` : formatted;
    logs.push(line.length > maxLogLength ? line.slice(0, maxLogLength) + '... [line truncated]' : line);
  };

  // 2. Build isolated sandbox context.
  // Note: We use Object.create(null) so the sandbox context global does not inherit host prototypes.
  // We do NOT inject host primitives (Array, Object, Function, Math, Date) into the sandbox;
  // Node's vm.createContext supplies isolated built-ins belonging strictly to the VM realm,
  // preventing prototype escapes into the host process.
  const sandbox = Object.create(null);
  sandbox.console = {
    log: (...args: any[]) => appendLog('', args),
    warn: (...args: any[]) => appendLog('[WARN]', args),
    error: (...args: any[]) => appendLog('[ERROR]', args),
    info: (...args: any[]) => appendLog('[INFO]', args),
  };

  try {
    const context = vm.createContext(sandbox);

    // Run user script
    const script = new vm.Script(code, { filename: 'solution.js' });
    script.runInContext(context, { timeout: timeoutMs });

    const executionTimeMs = Date.now() - startTime;

    // 3. Evaluate test cases if present
    let testResults: TestCaseResult[] = [];
    if (Array.isArray(testCases) && testCases.length > 0) {
      testResults = testCases.map((tc, index) => {
        try {
          const rawInput = typeof tc.input === 'string' ? tc.input : String(tc.input ?? '');
          const paramNames = extractParamNames(rawInput);

          // Find candidate solution function name
          const testHarness = `
            (function() {
              const candidateNames = ['twoSum', 'maxArea', 'search', 'numIslands', 'coinChange', 'isPalindrome', 'maxProfit', 'isValid', 'merge', 'reverseList', 'lengthOfLongestSubstring', 'climbStairs', 'isAnagram', 'containsDuplicate', 'productExceptSelf', 'groupAnagrams'];
              let fn = null;
              for (const name of candidateNames) {
                try {
                  if (typeof eval(name) === 'function') {
                    fn = eval(name);
                    break;
                  }
                } catch {}
              }
              if (!fn) {
                const match = (${JSON.stringify(code)}).match(/function\\s+([a-zA-Z0-9_$]+)\\s*\\(/) || 
                              (${JSON.stringify(code)}).match(/(?:const|let|var)\\s+([a-zA-Z0-9_$]+)\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>)/);
                if (match) {
                  try {
                    if (typeof eval(match[1]) === 'function') fn = eval(match[1]);
                  } catch {}
                }
              }
              if (typeof fn !== 'function') {
                throw new Error('Solution function not defined or not callable.');
              }
              ${paramNames.length > 0 ? `let ${rawInput}; return fn(${paramNames.join(', ')});` : `return fn(${rawInput});`}
            })()
          `;

          const testScript = new vm.Script(testHarness, { filename: `test_${index}.js` });
          const result = testScript.runInContext(context, { timeout: Math.min(timeoutMs, 1500) });
          const actualStr = safeStringify(result);

          // Normalize expected
          const normalizedExpected = typeof tc.expected === 'string' 
            ? tc.expected.trim() 
            : safeStringify(tc.expected);

          let passed = actualStr === normalizedExpected;
          if (!passed) {
            try {
              passed = JSON.stringify(JSON.parse(actualStr)) === JSON.stringify(JSON.parse(normalizedExpected));
            } catch {}
          }

          return {
            testCaseIndex: index,
            input: rawInput,
            expected: normalizedExpected,
            actual: actualStr,
            passed: Boolean(passed),
          };
        } catch (tcErr: any) {
          return {
            testCaseIndex: index,
            input: String(tc?.input ?? ''),
            expected: typeof tc?.expected === 'string' ? tc.expected : safeStringify(tc?.expected),
            actual: tcErr?.message || 'Error evaluating case',
            passed: false,
          };
        }
      });
    }

    const anyFailed = testResults.length > 0 && testResults.some(t => !t.passed);
    const finalStatus: 'success' | 'wrong_answer' = anyFailed ? 'wrong_answer' : 'success';

    return {
      stdout: logs.length > 0 ? logs.join('\n') : 'Code executed cleanly with no console output.',
      executionTimeMs,
      status: finalStatus,
      testResults: testResults.length > 0 ? testResults : undefined,
    };
  } catch (err: any) {
    const executionTimeMs = Date.now() - startTime;
    const isTimeout = err?.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || err?.message?.includes('timed out');
    const errorMessage = isTimeout
      ? `Execution timed out (exceeded ${timeoutMs}ms limit). Check for infinite loops or deep recursion.`
      : err?.message || String(err);

    return {
      stdout: logs.length > 0 ? logs.join('\n') : '',
      stderr: errorMessage,
      executionTimeMs,
      status: 'error',
    };
  }
}
