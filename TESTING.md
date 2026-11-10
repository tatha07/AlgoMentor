# AlgoMentor — Test Suite & Security Hardening Documentation

This document describes the test suite, security auditing findings, and bug fixes implemented for AlgoMentor.

---

## 1. How to Run Tests

The test suite uses Node.js's native test runner (`node:test` + `node:assert/strict`) powered by `tsx`:

```bash
# Run all unit and security regression tests
npm test

# Run a specific test suite
npx tsx --test tests/sandbox-security.test.ts
npx tsx --test tests/collab-security.test.ts
npx tsx --test tests/data-integrity.test.ts
```

All 20 tests across 4 test suites execute and pass in under 1 second.

---

## 2. Security Vulnerabilities & Bugs Discovered & Fixed

### Bug 1: VM Sandbox Prototype Escape
- **Issue**: The original JavaScript code execution engine in `/api/sandbox/run` passed host primitives (`Array`, `Object`, `Function`, `Math`, `Date`, etc.) directly into `vm.createContext(sandbox)`. Because these built-in objects originated from the host Node.js environment, their prototypes linked back to the host's `Function` constructor, enabling `Array.constructor("return process")()` to escape the sandbox and access the host process.
- **Fix**: Implemented `src/lib/sandbox.ts` with an isolated VM realm created via `Object.create(null)`. Host primitives are never injected into the sandbox; instead, `vm.createContext` initializes its own isolated realm built-ins where `process`, `require`, and host globals do not exist.

### Bug 2: Test Case Parameter Split Syntax Error
- **Issue**: The original test runner extracted parameters with `tc.input.split(',')`. For any input containing arrays or objects with commas (e.g. `nums = [2, 7, 11, 15], target = 9`), the array elements were split into invalid identifiers (`['nums', '7', '11', '15]', 'target']`), resulting in `fn(nums, 7, 11, 15], target)` and throwing `SyntaxError: Unexpected token ']'`.
- **Fix**: Replaced naive comma-splitting with regex parameter extraction (`/(?:^|[,;])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g`) in `src/lib/sandbox.ts`. Inputs like `nums = [2, 7, 11, 15], target = 9` now correctly parse into `['nums', 'target']`.

### Bug 3: TypeError on Non-String Expected Values
- **Issue**: The test harness invoked `tc.expected.trim()`. If a test case defined `expected` as a number (e.g. `expected: 42`) or boolean, Node threw `TypeError: tc.expected.trim is not a function`.
- **Fix**: Added safe normalization in `src/lib/sandbox.ts` using `safeStringify(tc.expected)`, safely comparing primitive numbers, booleans, and serialized arrays/objects.

### Bug 4: Memory DoS via Log Flooding & Circular References
- **Issue**: Code running `for (let i = 0; i < 1_000_000; i++) console.log(...)` appended infinitely to an in-memory `logs` array, risking Out-Of-Memory (OOM) crashes. Additionally, logging circular objects threw `TypeError: Converting circular structure to JSON`.
- **Fix**: Added `safeConsole` in `src/lib/sandbox.ts` that enforces:
  - Capped at maximum 100 log lines with a truncation notice.
  - Capped at 1,000 characters per log line.
  - Circular reference handling via `WeakSet` in `safeStringify()`.

### Bug 5: Unbounded Collab Rooms & Memory Leak
- **Issue**: In-memory `collabRooms` map in `server.ts` had no room count limit or pruning logic. Creating thousands of study rooms or sending oversized code/chat payloads could exhaust server memory.
- **Fix**: Implemented `CollabManager` in `src/lib/collabStore.ts`:
  - Maximum 100 active rooms; automatically prunes the oldest inactive rooms (0 connected clients) when capacity is reached.
  - Enforces 100-character limits on room names, 50KB limits on code payloads, and 2,000-character limits on chat messages.
  - Enforces a 100-message cap per room history.

### Bug 6: Infinite Loop Execution Timeout
- **Issue**: Synchronous infinite loops (`while (true) {}`) could hang Node worker threads.
- **Fix**: Configured script execution with `timeout: 2500` ms, detecting `ERR_SCRIPT_EXECUTION_TIMEOUT` and returning a clean `status: 'error'` with a helpful message: `"Execution timed out (exceeded 2500ms limit). Check for infinite loops or deep recursion."`.

---

## 3. Test Suites Breakdown

| Suite | Tests | Description | Status |
|---|---|---|---|
| `tests/sandbox-security.test.ts` | 6 | Prototype breakout prevention, infinite loop termination, log flood DoS protection, circular object safety, payload size limits | **PASSED** |
| `tests/sandbox-security.test.ts` | 5 | Array & comma parameter extraction, Two Sum solution verification, non-string expected handling, wrong answer reporting, syntax error reporting | **PASSED** |
| `tests/collab-security.test.ts` | 6 | Room lifecycle, empty name rejection, payload truncation, chat history capping, room capacity pruning, safe code updates | **PASSED** |
| `tests/data-integrity.test.ts` | 3 | Problem schemas (multilingual starter code), assessment questions (exactly one correct option), DSA topics curriculum metadata | **PASSED** |

**Total**: 20 tests, 4 suites, 0 failures.
