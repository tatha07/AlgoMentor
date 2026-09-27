import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PRACTICE_PROBLEMS } from '../../data/practiceProblems';
import { sendInterviewTurn, evaluateInterviewScorecard } from '../../services/api';
import { InterviewEvaluation } from '../../types';
import { MonacoCodeEditor } from '../common/MonacoCodeEditor';
import Markdown from 'react-markdown';
import { 
  Users, 
  Clock, 
  Send, 
  FileCheck
} from 'lucide-react';

export const InterviewModeView: React.FC = () => {
  const { userProfile, triggerConfetti } = useApp();

  const [selectedProblem, setSelectedProblem] = useState(PRACTICE_PROBLEMS[0]);
  const [conversation, setConversation] = useState<{ role: 'interviewer' | 'candidate'; text: string; timestamp: string }[]>([]);
  const [candidateInput, setCandidateInput] = useState('');
  const [candidateCode, setCandidateCode] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isLoadingTurn, setIsLoadingTurn] = useState(false);
  const [isEvaluatingScorecard, setIsEvaluatingScorecard] = useState(false);
  const [scorecard, setScorecard] = useState<InterviewEvaluation | null>(null);

  // 45 min timer
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(45 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoadingTurn]);

  // Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isTimerActive && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds(s => s - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeRemainingSeconds]);

  const formatInterviewTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartInterview = () => {
    setIsStarted(true);
    setIsTimerActive(true);
    setTimeRemainingSeconds(45 * 60);
    setScorecard(null);

    const initialInterviewerMessage = {
      role: 'interviewer' as const,
      text: `Hello ${userProfile.name.split(' ')[0]}! Welcome to your technical coding session.\n\nToday, we're going to work through **${selectedProblem.title}**.\n\nHere is the initial problem statement:\n> ${selectedProblem.description}\n\nBefore jumping into code, walk me through your understanding of the problem, any clarifying questions about edge cases, and your initial high-level intuition.`,
      timestamp: new Date().toISOString(),
    };

    setConversation([initialInterviewerMessage]);
    setCandidateCode(selectedProblem.starterCode[userProfile.preferredLanguage] || '');
  };

  const handleSendTurn = async () => {
    if (!candidateInput.trim() && !candidateCode.trim()) return;
    if (isLoadingTurn) return;

    const userText = candidateInput.trim();
    const newTurn = {
      role: 'candidate' as const,
      text: userText,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...conversation, newTurn];
    setConversation(updatedHistory);
    setCandidateInput('');
    setIsLoadingTurn(true);

    try {
      const historyPayload = updatedHistory.map(m => ({
        role: m.role === 'candidate' ? 'user' : 'model',
        content: m.text,
      }));

      const interviewerReply = await sendInterviewTurn({
        problemTitle: selectedProblem.title,
        problemDescription: selectedProblem.description,
        conversation: historyPayload,
        candidateCode,
        language: userProfile.preferredLanguage,
        userLevel: userProfile.level,
      });

      setConversation(prev => [
        ...prev,
        {
          role: 'interviewer',
          text: interviewerReply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (e: any) {
      setConversation(prev => [
        ...prev,
        {
          role: 'interviewer',
          text: `⚠️ Interviewer connection interrupted: ${e.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoadingTurn(false);
    }
  };

  const handleFinishAndEvaluate = async () => {
    if (isEvaluatingScorecard || conversation.length < 2) return;
    setIsEvaluatingScorecard(true);
    setIsTimerActive(false);

    try {
      const historyPayload = conversation.map(m => ({
        role: m.role === 'candidate' ? 'user' : 'model',
        content: m.text,
      }));

      const result = await evaluateInterviewScorecard({
        problemTitle: selectedProblem.title,
        problemDifficulty: selectedProblem.difficulty,
        conversation: historyPayload,
        userLevel: userProfile.level,
      });

      setScorecard(result);
      triggerConfetti();
    } catch (e: any) {
      alert(`Scorecard generation error: ${e.message}`);
    } finally {
      setIsEvaluatingScorecard(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
              Live Mock Interview Simulator
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            FAANG DSA Coding Interview
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
            Simulate a real 45-minute technical interview. Clarify requirements, defend your invariants, and receive a strict calibration rubric.
          </p>
        </div>

        {isStarted && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Time Left: {formatInterviewTimer(timeRemainingSeconds)}</span>
            </div>

            <button
              onClick={handleFinishAndEvaluate}
              id="btn-finish-interview"
              disabled={isEvaluatingScorecard || conversation.length < 2}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-colors shadow-sm shadow-indigo-600/20 disabled:opacity-40"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isEvaluatingScorecard ? 'Evaluating Rubric...' : 'End & Grade Interview'}</span>
            </button>
          </div>
        )}
      </div>

      {!isStarted ? (
        /* Configuration Screen */
        <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 max-w-2xl mx-auto space-y-6 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
            <Users className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Select Interview Question</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Choose your target problem to practice live technical communication.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <label className="text-xs font-mono uppercase text-zinc-500 block font-semibold">
              Problem
            </label>
            <select
              value={selectedProblem.id}
              onChange={e => {
                const found = PRACTICE_PROBLEMS.find(p => p.id === e.target.value);
                if (found) setSelectedProblem(found);
              }}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-indigo-500 shadow-sm"
            >
              {PRACTICE_PROBLEMS.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.difficulty.toUpperCase()}] {p.title} ({p.topicName})
                </option>
              ))}
            </select>
          </div>

          {/* Tips Box */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-left text-xs font-mono text-zinc-700 dark:text-zinc-300 space-y-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase block">Interview Expectations:</span>
            <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 list-disc list-inside text-[11px]">
              <li>Never start coding immediately. Clarify constraints & edge cases first.</li>
              <li>State brute-force time complexity, then explain your optimization.</li>
              <li>Explain your memory invariant before typing out loops.</li>
            </ul>
          </div>

          <button
            onClick={handleStartInterview}
            id="btn-start-interview-session"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            Start 45-Minute Interview
          </button>
        </div>
      ) : (
        /* Active Interview Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Transcript & Chat (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-[600px] rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-900 dark:text-white font-bold">Interview Transcript</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Problem: {selectedProblem.title}</span>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {conversation.map((msg, idx) => {
                const isInterviewer = msg.role === 'interviewer';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${isInterviewer ? 'justify-start' : 'justify-end'}`}
                  >
                    {isInterviewer && (
                      <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 text-xs font-mono font-bold">
                        AI
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isInterviewer
                          ? 'bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-sm'
                          : 'bg-indigo-600 text-white shadow-sm'
                      }`}
                    >
                      <div className="markdown-body">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoadingTurn && (
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Interviewer is calibrating your response...</span>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Input area */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950/90 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={candidateInput}
                  onChange={e => setCandidateInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendTurn();
                  }}
                  placeholder="Respond to interviewer, ask clarification, or explain complexity..."
                  className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 shadow-sm"
                />
                <button
                  onClick={handleSendTurn}
                  disabled={isLoadingTurn || (!candidateInput.trim() && !candidateCode.trim())}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold rounded-xl transition-colors disabled:opacity-40 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Shared Code Workspace (5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-[520px]">
            <MonacoCodeEditor
              initialCode={candidateCode}
              language={userProfile.preferredLanguage}
              onCodeChange={setCandidateCode}
              height="100%"
              problemTitle={selectedProblem.title}
              testCases={selectedProblem.examples.map(ex => ({
                input: ex.input,
                expected: ex.output,
                explanation: ex.explanation,
              }))}
            />
          </div>
        </div>
      )}

      {/* Scorecard Results Modal / Drawer */}
      {scorecard && (
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="text-xs font-mono uppercase text-indigo-600 dark:text-indigo-400 font-bold">
                FAANG Calibration Report
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                Interview Verdict: <span className="text-emerald-600 dark:text-emerald-400">{scorecard.interviewerVerdict}</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-mono text-sm font-bold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-sm">
                Overall: <span className="text-indigo-600 dark:text-indigo-400">{scorecard.overallScore}/10</span>
              </div>
            </div>
          </div>

          {/* 4 Rubric Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500 block">Problem Solving</span>
              <span className="text-base font-bold text-zinc-900 dark:text-white mt-1 block">{scorecard.problemSolvingScore}/10</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500 block">Communication</span>
              <span className="text-base font-bold text-zinc-900 dark:text-white mt-1 block">{scorecard.communicationScore}/10</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500 block">Complexity Analysis</span>
              <span className="text-base font-bold text-zinc-900 dark:text-white mt-1 block">{scorecard.complexityScore}/10</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500 block">Code Optimization</span>
              <span className="text-base font-bold text-zinc-900 dark:text-white mt-1 block">{scorecard.optimizationScore}/10</span>
            </div>
          </div>

          {/* Feedback & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                Demonstrated Strengths
              </span>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
                {scorecard.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400 block">
                Growth Areas & Pitfalls
              </span>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
                {scorecard.areasForImprovement.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Senior Feedback */}
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs text-zinc-800 dark:text-zinc-200 space-y-2">
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase block">
              Interviewer Synthesis
            </span>
            <p className="leading-relaxed">{scorecard.detailedFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};
