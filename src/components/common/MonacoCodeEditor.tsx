import React, { useState } from 'react';
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
  Settings2,
  Maximize2,
  Minimize2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface CodeExecutionResult {
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
  status: 'success' | 'error' | 'timeout';
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
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'console' | 'tests'>('console');

  // Keep internal code updated if initialCode changes externally (e.g. switching problems or languages)
  React.useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

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

  // Safe client/server sandboxed execution fallback
  const handleExecute = async () => {
    setIsRunning(true);
    setExecutionResult(null);

    const startTime = performance.now();

    try {
      if (onRun) {
        const customResult = await onRun(code, language);
        if (customResult) {
          setExecutionResult(customResult);
          setIsRunning(false);
          return;
        }
      }

      // Default backend/client sandbox runner
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
        setExecutionResult({
          stdout: data.stdout || 'Program executed successfully with no stdout.',
          stderr: data.stderr,
          executionTimeMs: data.executionTimeMs || Math.round(endTime - startTime),
          status: data.status || 'success',
          testResults: data.testResults,
        });
        if (data.testResults && data.testResults.length > 0) {
          setActiveOutputTab('tests');
        }
      } else {
        setExecutionResult({
          stdout: '',
          stderr: data.error || 'Execution failed.',
          executionTimeMs: Math.round(endTime - startTime),
          status: 'error',
        });
      }
    } catch (err: any) {
      // Local fallback for JavaScript execution if network fails
      if (language === 'javascript') {
        try {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args: any[]) => logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            warn: (...args: any[]) => logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          };

          const runFn = new Function('console', code);
          runFn(customConsole);

          const endTime = performance.now();
          setExecutionResult({
            stdout: logs.length > 0 ? logs.join('\n') : 'Code executed cleanly with no console output.',
            executionTimeMs: Math.round(endTime - startTime),
            status: 'success',
          });
        } catch (execErr: any) {
          const endTime = performance.now();
          setExecutionResult({
            stdout: '',
            stderr: execErr.toString(),
            executionTimeMs: Math.round(endTime - startTime),
            status: 'error',
          });
        }
      } else {
        const endTime = performance.now();
        setExecutionResult({
          stdout: '',
          stderr: `Execution server is offline. Local interpreter is currently enabled for JavaScript. For ${language}, syntax checking is active.`,
          executionTimeMs: Math.round(endTime - startTime),
          status: 'error',
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const monacoLanguage = language === 'cpp' ? 'cpp' : language === 'python' ? 'python' : language === 'java' ? 'java' : 'javascript';

  return (
    <div className={`flex flex-col border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 gap-2">
        {/* Left: Language selector & info */}
        <div className="flex items-center gap-2">
          {onLanguageChange ? (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs font-mono rounded-md px-2.5 py-1 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="java">Java (OpenJDK)</option>
            </select>
          ) : (
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-zinc-950 text-indigo-400 font-bold border border-zinc-800">
              {language}
            </span>
          )}

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Monaco Engine
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Font size toggle */}
          <div className="hidden sm:flex items-center bg-zinc-950 border border-zinc-800 rounded-md p-0.5 text-[11px] font-mono text-zinc-400">
            <button
              onClick={() => setFontSize(Math.max(11, fontSize - 1))}
              className="px-1.5 py-0.5 hover:text-white"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="px-1 text-zinc-500">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(18, fontSize + 1))}
              className="px-1.5 py-0.5 hover:text-white"
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
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Run Code Button */}
          {!readOnly && (
            <button
              onClick={handleExecute}
              disabled={isRunning}
              id="btn-run-code"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md shadow-sm shadow-emerald-600/30 transition-all border border-emerald-500/40 disabled:opacity-50"
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
      <div style={{ height: isFullscreen ? 'calc(100vh - 260px)' : height }} className="w-full relative">
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
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Output / Terminal / Test Results Console */}
      {executionResult && (
        <div className="border-t border-zinc-800 bg-zinc-900/95 flex flex-col max-h-56 overflow-hidden">
          {/* Console Header Tabs */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/80 text-xs font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveOutputTab('console')}
                className={`flex items-center gap-1.5 pb-0.5 border-b-2 font-semibold transition-colors ${
                  activeOutputTab === 'console'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Output</span>
              </button>

              {executionResult.testResults && executionResult.testResults.length > 0 && (
                <button
                  onClick={() => setActiveOutputTab('tests')}
                  className={`flex items-center gap-1.5 pb-0.5 border-b-2 font-semibold transition-colors ${
                    activeOutputTab === 'tests'
                      ? 'border-indigo-500 text-white'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Test Cases (
                    {executionResult.testResults.filter(t => t.passed).length}/{executionResult.testResults.length})
                  </span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {executionResult.executionTimeMs}ms
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  executionResult.status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {executionResult.status === 'success' ? 'Accepted' : 'Error'}
              </span>
            </div>
          </div>

          {/* Console Content */}
          <div className="p-4 overflow-y-auto font-mono text-xs max-h-44 space-y-2">
            {activeOutputTab === 'console' && (
              <>
                {executionResult.stderr ? (
                  <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed">
                    {executionResult.stderr}
                  </pre>
                ) : (
                  <pre className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {executionResult.stdout || 'Program executed cleanly with no stdout.'}
                  </pre>
                )}
              </>
            )}

            {activeOutputTab === 'tests' && executionResult.testResults && (
              <div className="space-y-2">
                {executionResult.testResults.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                      t.passed
                        ? 'bg-emerald-500/5 border-emerald-500/30 text-zinc-200'
                        : 'bg-rose-500/5 border-rose-500/30 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {t.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="font-bold text-xs">Test Case #{t.testCaseIndex + 1}:</span>
                      <span className="text-zinc-400 text-[11px] truncate max-w-[200px]">Input: {t.input}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div>
                        <span className="text-zinc-500 mr-1">Expected:</span>
                        <code className="text-emerald-400">{t.expected}</code>
                      </div>
                      <div>
                        <span className="text-zinc-500 mr-1">Output:</span>
                        <code className={t.passed ? 'text-emerald-400' : 'text-rose-400'}>{t.actual}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
