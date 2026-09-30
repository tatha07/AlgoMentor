import React, { useState, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Maximize2, 
  Minimize2, 
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Code2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface CodeExecutionResult {
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
  status: 'success' | 'error' | 'timeout' | 'wrong_answer';
  testResults?: {
    testCaseIndex: number;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }[];
}

interface MonacoCodeEditorProps {
  initialCode: string;
  language: 'javascript' | 'python' | 'cpp' | 'java';
  onLanguageChange?: (lang: 'javascript' | 'python' | 'cpp' | 'java') => void;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string, language: string) => Promise<CodeExecutionResult | null> | CodeExecutionResult | void;
  height?: string;
  testCases?: { input: string; expected: string; explanation?: string }[];
  readOnly?: boolean;
  starterCode?: string;
  problemTitle?: string;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  initialCode,
  language,
  onLanguageChange,
  onCodeChange,
  onRun,
  height = '380px',
  testCases = [],
  readOnly = false,
  starterCode,
  problemTitle,
}) => {
  const { theme } = useApp();
  const [code, setCode] = useState<string>(initialCode);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Console state
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState<boolean>(false);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState<boolean>(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'tests' | 'console'>('tests');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);
  const [viewAllCases, setViewAllCases] = useState<boolean>(false);

  // Keep internal code updated if initialCode changes externally
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Handle Ctrl+Enter or Cmd+Enter to run code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!readOnly && !isRunning) {
          handleExecute();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language, readOnly, isRunning]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetStarter = () => {
    if (starterCode) {
      setCode(starterCode);
      if (onCodeChange) {
        onCodeChange(starterCode);
      }
    }
  };

  const handleExecute = async () => {
    setIsRunning(true);
    const startTime = performance.now();

    try {
      if (onRun) {
        const customResult = await onRun(code, language);
        if (customResult) {
          setExecutionResult(customResult);
          setIsConsoleOpen(true);
          setIsConsoleCollapsed(false);
          if (customResult.testResults && customResult.testResults.length > 0) {
            setActiveOutputTab('tests');
            const firstFail = customResult.testResults.findIndex(t => !t.passed);
            setSelectedTestCaseIndex(firstFail >= 0 ? firstFail : 0);
          } else {
            setActiveOutputTab('console');
          }
          setIsRunning(false);
          return;
        }
      }

      // Default sandbox runner
      const res = await fetch('/api/sandbox/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases,
          problemTitle,
        }),
      });

      const data = await res.json();
      const endTime = performance.now();

      if (res.ok) {
        const result: CodeExecutionResult = {
          stdout: data.stdout || 'Program executed successfully with no stdout.',
          stderr: data.stderr,
          executionTimeMs: data.executionTimeMs || Math.round(endTime - startTime),
          status: data.status || 'success',
          testResults: data.testResults,
        };
        setExecutionResult(result);
        setIsConsoleOpen(true);
        setIsConsoleCollapsed(false);
        if (data.testResults && data.testResults.length > 0) {
          setActiveOutputTab('tests');
          const firstFail = data.testResults.findIndex((t: any) => !t.passed);
          setSelectedTestCaseIndex(firstFail >= 0 ? firstFail : 0);
        } else {
          setActiveOutputTab('console');
        }
      } else {
        setExecutionResult({
          stdout: '',
          stderr: data.error || 'Execution failed.',
          executionTimeMs: Math.round(endTime - startTime),
          status: 'error',
        });
        setIsConsoleOpen(true);
        setIsConsoleCollapsed(false);
        setActiveOutputTab('console');
      }
    } catch (err: any) {
      const endTime = performance.now();
      setExecutionResult({
        stdout: '',
        stderr: err?.message || 'Could not connect to sandbox runner.',
        executionTimeMs: Math.round(endTime - startTime),
        status: 'error',
      });
      setIsConsoleOpen(true);
      setIsConsoleCollapsed(false);
      setActiveOutputTab('console');
    } finally {
      setIsRunning(false);
    }
  };

  const monacoLanguage = 
    language === 'cpp' ? 'cpp' : 
    language === 'python' ? 'python' : 
    language === 'java' ? 'java' : 'javascript';

  const isHeight100 = height === '100%' || height?.includes('100%');

  // Test statistics
  const testResults = executionResult?.testResults || [];
  const totalTests = testResults.length;
  const passedTests = testResults.filter(t => t.passed).length;
  const allTestsPassed = totalTests > 0 && passedTests === totalTests;
  const hasTestFailures = totalTests > 0 && !allTestsPassed;
  const isRuntimeError = executionResult?.status === 'error' || Boolean(executionResult?.stderr);

  // Selected test case
  const currentCase = testResults[selectedTestCaseIndex] || testResults[0];

  return (
    <div 
      className={`flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm transition-all duration-200 ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : isHeight100 ? 'h-full flex-1' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 gap-2 shrink-0 select-none">
        {/* Left: Language selector & info */}
        <div className="flex items-center gap-2">
          {onLanguageChange ? (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as any)}
              className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 font-semibold shadow-xs"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="java">Java (OpenJDK)</option>
            </select>
          ) : (
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 font-bold border border-zinc-200 dark:border-zinc-800">
              {language}
            </span>
          )}

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Monaco Editor
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Toggle Console Output */}
          <button
            onClick={() => {
              setIsConsoleOpen(!isConsoleOpen);
              if (!isConsoleOpen) setIsConsoleCollapsed(false);
            }}
            title={isConsoleOpen ? 'Hide Console' : 'Show Console'}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-medium transition-colors border ${
              isConsoleOpen
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Console</span>
            {executionResult && (
              <span className={`w-1.5 h-1.5 rounded-full ${allTestsPassed ? 'bg-emerald-500' : hasTestFailures || isRuntimeError ? 'bg-rose-500' : 'bg-indigo-500'}`} />
            )}
          </button>

          {/* Font size toggle */}
          <div className="hidden sm:flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 shadow-xs">
            <button
              onClick={() => setFontSize(Math.max(11, fontSize - 1))}
              className="px-1.5 py-0.5 hover:text-zinc-900 dark:hover:text-white"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="px-1 text-zinc-400 dark:text-zinc-500">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(18, fontSize + 1))}
              className="px-1.5 py-0.5 hover:text-zinc-900 dark:hover:text-white"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Reset Starter */}
          {starterCode && (
            <button
              onClick={handleResetStarter}
              title="Reset to Starter Code"
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Run Code Button */}
          {!readOnly && (
            <button
              onClick={handleExecute}
              disabled={isRunning}
              id="btn-run-code"
              title="Run Code (Ctrl+Enter)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/30 transition-all border border-emerald-500/40 disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div 
        className="w-full relative flex-1 min-h-[160px]"
        style={
          isFullscreen 
            ? { height: isConsoleOpen ? (isConsoleExpanded ? 'calc(100vh - 460px)' : 'calc(100vh - 340px)') : 'calc(100vh - 60px)' }
            : !isHeight100 
            ? { height: isConsoleOpen ? (isConsoleExpanded ? '200px' : '260px') : height } 
            : undefined
        }
      >
        <Editor
          height="100%"
          language={monacoLanguage}
          value={code}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onChange={handleEditorChange}
          options={{
            fontSize: fontSize,
            fontFamily: 'JetBrains Mono, Fira Code, Menlo, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: 'on',
            readOnly: readOnly,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>

      {/* Output / Terminal / Test Results Console */}
      {isConsoleOpen && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/95 flex flex-col shrink-0 transition-all duration-200">
          {/* Console Header Tabs & Status Bar */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-mono select-none">
            {/* Left: Tab switchers */}
            <div className="flex items-center gap-2 sm:gap-4">
              {totalTests > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveOutputTab('tests');
                    setIsConsoleCollapsed(false);
                  }}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 font-semibold text-xs transition-colors cursor-pointer ${
                    activeOutputTab === 'tests' && !isConsoleCollapsed
                      ? 'border-indigo-500 text-zinc-900 dark:text-white'
                      : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {allTestsPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : hasTestFailures ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  <span>
                    Test Cases ({passedTests}/{totalTests})
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setActiveOutputTab('console');
                  setIsConsoleCollapsed(false);
                }}
                className={`flex items-center gap-1.5 pb-1 border-b-2 font-semibold text-xs transition-colors cursor-pointer ${
                  activeOutputTab === 'console' && !isConsoleCollapsed
                    ? 'border-indigo-500 text-zinc-900 dark:text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                <span>Console Output</span>
                {executionResult?.stderr && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
              </button>
            </div>

            {/* Right: Runtime stats, Status badge & Control buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {executionResult && (
                <>
                  <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{executionResult.executionTimeMs}ms</span>
                  </span>

                  {/* Accurate Status Badge */}
                  {isRuntimeError ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                      <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>Runtime Error</span>
                    </span>
                  ) : hasTestFailures ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                      <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>Wrong Answer ({passedTests}/{totalTests})</span>
                    </span>
                  ) : allTestsPassed ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>Accepted ({passedTests}/{totalTests})</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>Finished</span>
                    </span>
                  )}
                </>
              )}

              {/* Expand / Minimize Console */}
              <button
                type="button"
                onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
                title={isConsoleExpanded ? 'Restore Normal Height' : 'Expand Console Height'}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors hidden sm:block"
              >
                {isConsoleExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Collapse Toggle */}
              <button
                type="button"
                onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                title={isConsoleCollapsed ? 'Expand Console Body' : 'Collapse Console Body'}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors"
              >
                {isConsoleCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Close Console */}
              <button
                type="button"
                onClick={() => setIsConsoleOpen(false)}
                title="Dismiss Console"
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Console Content Body */}
          {!isConsoleCollapsed && (
            <div 
              className={`p-4 overflow-y-auto font-mono text-xs bg-zinc-50/50 dark:bg-zinc-950/90 transition-all ${
                isConsoleExpanded ? 'h-[320px]' : 'h-[230px]'
              }`}
            >
              {/* TAB 1: TEST CASES VIEW */}
              {activeOutputTab === 'tests' && (
                <div>
                  {testResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-400">
                      <Code2 className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-xs">No test cases executed yet.</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Click "Run Code" above to evaluate test cases.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {/* Case selector tabs */}
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {testResults.map((tc, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedTestCaseIndex(idx);
                                setViewAllCases(false);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                !viewAllCases && selectedTestCaseIndex === idx
                                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shadow-xs border border-zinc-300 dark:border-zinc-700'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                              }`}
                            >
                              <span 
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  tc.passed ? 'bg-emerald-500' : 'bg-rose-500'
                                }`} 
                              />
                              <span>Case {idx + 1}</span>
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewAllCases(!viewAllCases)}
                          className={`text-[11px] font-mono px-2 py-1 rounded transition-colors hidden sm:inline-block ${
                            viewAllCases
                              ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                          }`}
                        >
                          {viewAllCases ? 'Single Case View' : 'View All Cases'}
                        </button>
                      </div>

                      {/* View Single Active Case */}
                      {!viewAllCases && currentCase && (
                        <div className="space-y-3">
                          {/* Case Verdict Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {currentCase.passed ? (
                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  <span>Test Case #{currentCase.testCaseIndex + 1}: Passed</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs">
                                  <XCircle className="w-4 h-4 text-rose-500" />
                                  <span>Test Case #{currentCase.testCaseIndex + 1}: Wrong Answer</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Input Block */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400">
                              Input Arguments
                            </span>
                            <pre className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {currentCase.input}
                            </pre>
                          </div>

                          {/* Output Comparison Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400">
                                Your Output
                              </span>
                              <pre 
                                className={`p-2.5 rounded-lg border text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed ${
                                  currentCase.passed
                                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold'
                                }`}
                              >
                                {currentCase.actual}
                              </pre>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 dark:text-zinc-400">
                                Expected Output
                              </span>
                              <pre className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-emerald-700 dark:text-emerald-400 font-semibold overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                {currentCase.expected}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* View All Cases Stash */}
                      {viewAllCases && (
                        <div className="space-y-2.5">
                          {testResults.map((tc, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                                tc.passed
                                  ? 'bg-emerald-500/5 border-emerald-500/30'
                                  : 'bg-rose-500/5 border-rose-500/30'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {tc.passed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                )}
                                <span className="font-bold text-xs text-zinc-900 dark:text-white">Case #{tc.testCaseIndex + 1}:</span>
                                <span className="text-zinc-500 dark:text-zinc-400 text-xs truncate max-w-[240px]">
                                  {tc.input}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-xs">
                                <div>
                                  <span className="text-zinc-500 mr-1 text-[11px]">Expected:</span>
                                  <code className="text-emerald-500 font-semibold">{tc.expected}</code>
                                </div>
                                <div>
                                  <span className="text-zinc-500 mr-1 text-[11px]">Output:</span>
                                  <code className={tc.passed ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-bold'}>
                                    {tc.actual}
                                  </code>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CONSOLE OUTPUT (STDOUT / STDERR) */}
              {activeOutputTab === 'console' && (
                <div className="space-y-3">
                  {executionResult?.stderr && (
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Execution Error</span>
                      </div>
                      <pre className="text-xs whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
                        {executionResult.stderr}
                      </pre>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 space-y-1.5">
                    <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                      <span>Standard Output (stdout)</span>
                      {executionResult && (
                        <span>Execution: {executionResult.executionTimeMs}ms</span>
                      )}
                    </div>
                    <pre className="text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
                      {executionResult?.stdout || 'No console output logged. Tip: Use console.log() or print() to inspect variables.'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonacoCodeEditor;
