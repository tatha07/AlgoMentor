import { InterviewEvaluation } from '../types';

export async function askAiTutor(params: {
  message: string;
  conversationHistory?: { role: string; content: string }[];
  userLevel?: string;
  tone?: string;
  currentTopic?: string;
}): Promise<string> {
  const res = await fetch('/api/tutor/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${res.status}`);
  }

  const data = await res.json();
  return data.reply;
}

export async function getProgressiveHint(params: {
  problemTitle: string;
  problemDescription?: string;
  userCode?: string;
  hintLevel: number;
}): Promise<string> {
  const res = await fetch('/api/tutor/hint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch hint (${res.status})`);
  }

  const data = await res.json();
  return data.hint;
}

export async function explainCodeSnippet(params: {
  code: string;
  language?: string;
  context?: string;
}): Promise<string> {
  const res = await fetch('/api/tutor/explain-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to explain code (${res.status})`);
  }

  const data = await res.json();
  return data.explanation;
}

export async function evaluateSolution(params: {
  problemTitle: string;
  problemDescription: string;
  userCode: string;
  language?: string;
}): Promise<string> {
  const res = await fetch('/api/tutor/evaluate-solution', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to evaluate solution (${res.status})`);
  }

  const data = await res.json();
  return data.evaluation;
}

export async function sendInterviewTurn(params: {
  problemTitle: string;
  problemDifficulty?: string;
  conversation: { role: string; content: string }[];
  userLevel?: string;
}): Promise<string> {
  const res = await fetch('/api/tutor/interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, isFinalEvaluation: false }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed interview turn (${res.status})`);
  }

  const data = await res.json();
  return data.reply;
}

export async function evaluateInterviewScorecard(params: {
  problemTitle: string;
  problemDifficulty?: string;
  conversation: { role: string; content: string }[];
  userLevel?: string;
}): Promise<InterviewEvaluation> {
  const res = await fetch('/api/tutor/interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, isFinalEvaluation: true }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate interview scorecard (${res.status})`);
  }

  const data = await res.json();
  return data.scorecard;
}
