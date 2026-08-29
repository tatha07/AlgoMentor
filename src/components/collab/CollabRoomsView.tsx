import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MonacoCodeEditor, CodeExecutionResult } from '../common/MonacoCodeEditor';
import { PRACTICE_PROBLEMS } from '../../data/practiceProblems';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Share2, 
  Plus, 
  Sparkles, 
  Terminal, 
  Radio, 
  LogOut, 
  Check, 
  Copy, 
  Code2, 
  Play, 
  BookOpen, 
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CollabUser {
  userId: string;
  userName: string;
  color: string;
}

interface CollabMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

interface RoomSummary {
  id: string;
  name: string;
  problemId: string;
  problemTitle: string;
  language: 'javascript' | 'python' | 'cpp' | 'java';
  activeUsersCount: number;
  messageCount: number;
  createdAt: string;
}

export const CollabRoomsView: React.FC = () => {
  const { userProfile, triggerConfetti } = useApp();
  const { currentUser, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  // Rooms list state
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(true);
  const [customRoomIdInput, setCustomRoomIdInput] = useState<string>('');

  // Active room state
  const [roomName, setRoomName] = useState<string>('');
  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [code, setCode] = useState<string>('');
  const [activeUsers, setActiveUsers] = useState<CollabUser[]>([]);
  const [messages, setMessages] = useState<CollabMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'chat'>('chat');

  // Create room modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomProblem, setNewRoomProblem] = useState<string>('two-sum');
  const [newRoomLanguage, setNewRoomLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');

  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch rooms list
  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const res = await fetch('/api/collab/rooms');
      const data = await res.json();
      if (data.rooms) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.warn('Failed to fetch rooms list:', err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // WebSocket Connection Management
  useEffect(() => {
    if (!activeRoomId) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      const userColor = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 6)];
      socket.send(JSON.stringify({
        type: 'join_room',
        roomId: activeRoomId,
        userId: currentUser?.uid || userProfile.id || 'anon-' + Math.random().toString(36).substring(2, 6),
        userName: currentUser?.displayName || userProfile.name || 'Peer Coder',
        color: userColor,
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'room_state') {
          setRoomName(data.name || 'Study Room');
          setSelectedProblemId(data.problemId || 'two-sum');
          setSelectedLanguage(data.language || 'javascript');
          setCode(data.code || '');
          setActiveUsers(data.users || []);
          setMessages(data.messages || []);
        } else if (data.type === 'users_updated') {
          setActiveUsers(data.users || []);
        } else if (data.type === 'code_updated') {
          setCode(data.code || '');
        } else if (data.type === 'language_updated') {
          setSelectedLanguage(data.language);
        } else if (data.type === 'problem_updated') {
          setSelectedProblemId(data.problemId);
          if (data.code) setCode(data.code);
        } else if (data.type === 'new_chat_message') {
          setMessages(prev => [...prev, data.message]);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    return () => {
      socket.close();
      wsRef.current = null;
    };
  }, [activeRoomId, currentUser, userProfile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'code_change',
        roomId: activeRoomId,
        code: newCode,
        userId: currentUser?.uid || userProfile.id,
      }));
    }
  };

  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'cpp' | 'java') => {
    setSelectedLanguage(newLang);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'language_change',
        roomId: activeRoomId,
        language: newLang,
        userId: currentUser?.uid || userProfile.id,
      }));
    }
  };

  const handleProblemChange = (probId: string) => {
    const prob = PRACTICE_PROBLEMS.find(p => p.id === probId);
    if (!prob) return;
    setSelectedProblemId(probId);
    const starter = prob.starterCode[selectedLanguage] || '';
    setCode(starter);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'problem_change',
        roomId: activeRoomId,
        problemId: probId,
        problemTitle: prob.title,
        code: starter,
        userId: currentUser?.uid || userProfile.id,
      }));
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      type: 'chat_message',
      roomId: activeRoomId,
      userId: currentUser?.uid || userProfile.id,
      userName: currentUser?.displayName || userProfile.name || 'Peer Coder',
      text: chatInput.trim(),
    }));

    setChatInput('');
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const prob = PRACTICE_PROBLEMS.find(p => p.id === newRoomProblem);
    const starter = prob ? prob.starterCode[newRoomLanguage] : '';

    try {
      const res = await fetch('/api/collab/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoomName.trim(),
          problemId: newRoomProblem,
          problemTitle: prob ? prob.title : 'Two Sum',
          language: newRoomLanguage,
          starterCode: starter,
        }),
      });

      const data = await res.json();
      if (data.room) {
        setIsCreateModalOpen(false);
        setActiveRoomId(data.room.id);
        triggerConfetti();
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const currentProblem = PRACTICE_PROBLEMS.find(p => p.id === selectedProblemId) || PRACTICE_PROBLEMS[0];

  const handleCopyInvite = () => {
    if (!activeRoomId) return;
    navigator.clipboard.writeText(activeRoomId);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 1. Lobby / Room Directory View
  if (!activeRoomId) {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 md:p-8 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-1.5">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                  Live Collaboration
                </span>
                <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                  WebSockets + Monaco
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-mono">
                Peer Coding & Group Study Rooms
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Code together in real-time with fellow engineers. Share an interactive Monaco Editor, synchronize code test runs, brainstorm DSA solutions, and prepare for collaborative interviews.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                id="btn-create-collab-room"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/25 border border-indigo-500/40"
              >
                <Plus className="w-4 h-4" />
                <span>Create Study Room</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Join By Room ID bar */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Have a room code from a friend?</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={customRoomIdInput}
              onChange={(e) => setCustomRoomIdInput(e.target.value)}
              placeholder="e.g. room-two-sum-study"
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono w-full sm:w-60 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => {
                if (customRoomIdInput.trim()) {
                  setActiveRoomId(customRoomIdInput.trim());
                }
              }}
              disabled={!customRoomIdInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-semibold disabled:opacity-40 transition-colors shrink-0"
            >
              Join
            </button>
          </div>
        </div>

        {/* Active Study Rooms Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" />
              Active Public Study Rooms
            </h2>
            <button
              onClick={fetchRooms}
              className="text-xs font-mono text-zinc-400 hover:text-white"
            >
              Refresh
            </button>
          </div>

          {isLoadingRooms ? (
            <div className="p-12 text-center text-xs font-mono text-zinc-500">
              Loading active collaboration rooms...
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-12 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
              <Code2 className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs font-mono text-zinc-400">No rooms active right now.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-mono font-bold hover:bg-indigo-500"
              >
                Create the first room
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map(room => (
                <div
                  key={room.id}
                  className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold font-mono text-white group-hover:text-indigo-300 transition-colors">
                        {room.name}
                      </h3>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                        {room.language}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400">
                      Problem Target:{' '}
                      <span className="text-zinc-200 font-semibold">{room.problemTitle}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-mono">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        {room.activeUsersCount} Active
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                        {room.messageCount}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveRoomId(room.id)}
                      id={`btn-join-${room.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-sm"
                    >
                      <span>Join Room</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Room Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-sm font-bold font-mono text-white">Create Collaborative Study Room</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Room Title / Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g. Dynamic Programming Study Circle"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Target DSA Problem
                  </label>
                  <select
                    value={newRoomProblem}
                    onChange={(e) => setNewRoomProblem(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {PRACTICE_PROBLEMS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.difficulty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Primary Programming Language
                  </label>
                  <select
                    value={newRoomLanguage}
                    onChange={(e) => setNewRoomLanguage(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python 3</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-mono hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-mono font-bold hover:bg-indigo-500 shadow-sm"
                  >
                    Launch Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Active Collaborative Room View
  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-140px)]">
      {/* Active Room Top Bar */}
      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveRoomId(null)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Leave Room"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold font-mono text-white">{roomName}</h2>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Problem:{' '}
              <span className="text-indigo-300 font-semibold">{currentProblem.title}</span> ({currentProblem.difficulty})
            </p>
          </div>
        </div>

        {/* Active Participants Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {activeUsers.map((user, idx) => (
              <div
                key={idx}
                title={user.userName}
                style={{ backgroundColor: user.color }}
                className="w-7 h-7 rounded-full border-2 border-zinc-900 flex items-center justify-center text-white text-[10px] font-mono font-bold shadow-sm"
              >
                {user.userName[0]?.toUpperCase() || 'P'}
              </div>
            ))}
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            {activeUsers.length} Online
          </span>

          {/* Share / Copy Room ID */}
          <button
            onClick={handleCopyInvite}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border border-zinc-700"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copiedLink ? 'Copied ID' : 'Share Room'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* Left 2 Cols: Monaco Live Synchronized Code Editor */}
        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
          <MonacoCodeEditor
            initialCode={code}
            language={selectedLanguage}
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            height="100%"
            testCases={currentProblem.examples.map(ex => ({
              input: ex.input,
              expected: ex.output,
              explanation: ex.explanation,
            }))}
            problemTitle={currentProblem.title}
          />
        </div>

        {/* Right 1 Col: Problem Specs & Live Peer Chat */}
        <div className="flex flex-col rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden h-full">
          {/* Tabs */}
          <div className="flex items-center border-b border-zinc-800 bg-zinc-950/80 p-1">
            <button
              onClick={() => setActiveTab('problem')}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'problem'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Problem Specs</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'chat'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Room Chat ({messages.length})</span>
            </button>
          </div>

          {/* Problem Specs View */}
          {activeTab === 'problem' && (
            <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs font-mono text-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Switch Problem:</span>
                <select
                  value={selectedProblemId}
                  onChange={(e) => handleProblemChange(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {PRACTICE_PROBLEMS.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Description</h4>
                <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                  {currentProblem.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Examples</h4>
                <div className="space-y-2">
                  {currentProblem.examples.map((ex, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                      <div>
                        <span className="text-zinc-500">Input:</span> <code>{ex.input}</code>
                      </div>
                      <div>
                        <span className="text-zinc-500">Output:</span> <code className="text-emerald-400">{ex.output}</code>
                      </div>
                      {ex.explanation && (
                        <div className="text-[11px] text-zinc-500 italic font-sans">{ex.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Constraints</h4>
                <ul className="list-disc pl-4 text-zinc-400 space-y-0.5 text-[11px]">
                  {currentProblem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Room Live Chat View */}
          {activeTab === 'chat' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Message History */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs font-mono">
                {messages.map(msg => (
                  <div key={msg.id} className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span className="font-bold text-indigo-300">{msg.userName}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-zinc-200 text-xs whitespace-pre-wrap font-sans">{msg.text}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-2.5 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Chat with room peers..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
