import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { askAiTutor } from '../../services/api';
import { ChatMessage, TutorTone } from '../../types';
import Markdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Flame, 
  Terminal, 
  HelpCircle, 
  Copy, 
  Check, 
  Trash2, 
  Code, 
  User,
  Zap,
  CornerDownLeft
} from 'lucide-react';

const DEFAULT_QUICK_QUESTIONS = [
  'Why is QuickSort O(N log N) on average but O(N^2) worst case?',
  'Explain recursion and the call stack like I am 10 years old.',
  'What is the practical difference between BFS and DFS?',
  'How do I identify when to use a Monotonic Stack vs Heap?',
  'Roast my idea of storing graph adjacency matrices for 1,000,000 sparse nodes.',
  'Explain how Floyd’s Cycle detection mathematically guarantees finding a loop.'
];

export const AiChatView: React.FC = () => {
  const { userProfile, updateTutorTone } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hey **${userProfile.name.split(' ')[0]}**! I'm your AI Senior DSA Instructor.

I'm here to build your algorithmic intuition, break down complex data structures, and roast bad brute-force ideas before your interviewers do.

What algorithm or concept are we tackling today?`,
      timestamp: new Date().toISOString(),
      roastLevel: userProfile.tutorTone,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawQuery = textToSend || inputText;
    if ((!rawQuery.trim() && !codeInput.trim()) || isLoading) return;

    let fullPrompt = rawQuery.trim();
    if (codeInput.trim()) {
      fullPrompt += `\n\n\`\`\`${userProfile.preferredLanguage}\n${codeInput.trim()}\n\`\`\``;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: fullPrompt,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setCodeInput('');
    setIsCodeInputOpen(false);
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await askAiTutor({
        message: fullPrompt,
        conversationHistory: historyPayload,
        userLevel: userProfile.level,
        tone: userProfile.tutorTone,
        currentTopic: userProfile.currentTopicId,
      });

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        roastLevel: userProfile.tutorTone,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Error:** ${error.message || 'Unable to connect to AI tutor. Please verify GEMINI_API_KEY.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared. What's on your mind regarding Data Structures & Algorithms?`,
        timestamp: new Date().toISOString(),
        roastLevel: userProfile.tutorTone,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-2xl">
      {/* Chat Header & Persona Selector */}
      <div className="px-4 py-3 bg-zinc-950/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-mono">Senior DSA Instructor</h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Strictly DSA & Algorithmic problem solving.</p>
          </div>
        </div>

        {/* Tone Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => updateTutorTone('balanced')}
            id="tone-btn-balanced"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-mono ${
              userProfile.tutorTone === 'balanced'
                ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Balanced</span>
          </button>
          <button
            onClick={() => updateTutorTone('savage')}
            id="tone-btn-savage"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-mono ${
              userProfile.tutorTone === 'savage'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Savage Roast 🌶️</span>
          </button>
          <button
            onClick={() => updateTutorTone('socratic')}
            id="tone-btn-socratic"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-mono ${
              userProfile.tutorTone === 'socratic'
                ? 'bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3 h-3 text-violet-400" />
            <span>Socratic</span>
          </button>

          <button
            onClick={handleClearChat}
            id="btn-clear-chat"
            title="Clear Chat History"
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-md transition-colors ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`group relative max-w-[85%] md:max-w-[75%] rounded-xl px-5 py-4 ${
                  isUser
                    ? 'bg-indigo-950/40 text-indigo-100 border border-indigo-800/50'
                    : 'bg-zinc-950/70 text-zinc-200 border border-zinc-800/80 shadow-md'
                }`}
              >
                {/* Assistant Message Header / Roast indicator */}
                {!isUser && (
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-800/50 text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1 font-semibold text-indigo-400">
                      <Sparkles className="w-3 h-3" /> Senior Instructor
                    </span>
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-white"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Markdown content */}
                <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed space-y-3 font-sans">
                  <div className="markdown-body">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>

                <div className="mt-2 text-right">
                  <span className="text-[9px] font-mono text-zinc-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-indigo-300">Senior dev is inspecting memory & invariants...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-950/40 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0 font-semibold">
          💡 Quick Topics:
        </span>
        {DEFAULT_QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[11px] font-mono px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 whitespace-nowrap transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Code Attachment Drawer (Optional) */}
      {isCodeInputOpen && (
        <div className="px-4 pt-3 pb-2 border-t border-zinc-800 bg-zinc-950/90 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Code className="w-3.5 h-3.5" /> Attach Code Snippet ({userProfile.preferredLanguage})
            </span>
            <button
              onClick={() => setIsCodeInputOpen(false)}
              className="text-zinc-400 hover:text-white text-[11px]"
            >
              Cancel
            </button>
          </div>
          <textarea
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            placeholder="// Paste your algorithm implementation or buggy function here..."
            className="w-full h-24 p-3 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 md:p-4 border-t border-zinc-800 bg-zinc-950/90">
        <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
          <button
            type="button"
            onClick={() => setIsCodeInputOpen(!isCodeInputOpen)}
            id="btn-toggle-code-attachment"
            title="Attach Code Block"
            className={`p-2 rounded-lg transition-colors ${
              isCodeInputOpen
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Code className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about time complexity, dynamic programming, hint on Two Sum, or paste code..."
            className="flex-1 max-h-32 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none py-1.5 px-2"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={(!inputText.trim() && !codeInput.trim()) || isLoading}
            id="btn-send-message"
            className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm shadow-indigo-600/20 border border-indigo-500/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
