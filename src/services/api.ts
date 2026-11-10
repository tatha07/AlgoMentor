import { InterviewEvaluation } from '../types';

export async function transcribeSpeech(audio: Blob): Promise<string> {
  const res = await fetch('/api/speech/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'audio/wav' },
    body: audio,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to transcribe audio (${res.status})`);
  }

  const data = await res.json();
  return data.transcript;
}

export async function synthesizeSpeech(text: string, voice: string = 'Avinash', speed: number = 1.0): Promise<Blob> {
  const res = await fetch('/api/speech/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, speed }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to synthesize speech (${res.status})`);
  }

  return res.blob();
}

export async function askAiTutor(params: {
  message: string;
  conversationHistory?: { role: string; content: string }[];
  userLevel?: string;
  tone?: string;
  currentTopic?: string;
  mode?: string;
  voicePersona?: string;
  preferredLanguage?: string;
}, onChunk?: (text: string) => void): Promise<string> {
  const res = await fetch('/api/tutor/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error || `Server responded with status ${res.status}`;
    const details = typeof errorData.details === 'string' ? errorData.details : '';
    throw new Error(details ? `${message}\n${details}` : message);
  }

  if (!res.body) {
    throw new Error('Tutor response stream is unavailable.');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let reply = '';

  const processEvents = (final = false) => {
    let separatorIndex = buffer.indexOf('\n\n');
    while (separatorIndex !== -1) {
      const event = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);
      processEvent(event);
      separatorIndex = buffer.indexOf('\n\n');
    }

    if (final && buffer.trim()) {
      processEvent(buffer);
      buffer = '';
    }
  };

  const processEvent = (event: string) => {
    const lines = event.split(/\r?\n/);
    const eventType = lines.find(line => line.startsWith('event:'))?.slice(6).trim();
    const data = lines
      .filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).trim())
      .join('\n');

    if (!data || eventType === 'done') return;

    const payload = JSON.parse(data) as { text?: string; error?: string };
    if (eventType === 'error') {
      throw new Error(payload.error || 'Tutor response stream failed.');
    }

    if (payload.text) {
      reply += payload.text;
      onChunk?.(payload.text);
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      processEvents();
    }

    buffer += decoder.decode();
    processEvents(true);
  } finally {
    reader.releaseLock();
  }

  if (!reply) {
    throw new Error('Tutor returned an empty response.');
  }

  return reply;
}

export async function getProgressiveHint(params: {
  problemTitle: string;
  problemDescription?: string;
  userCode?: string;
  hintLevel: number;
  tone?: string;
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
  timeComplexityExpected?: string;
  spaceComplexityExpected?: string;
  tone?: string;
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
  problemDescription?: string;
  conversation: { role: string; content: string }[];
  candidateCode?: string;
  language?: string;
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
