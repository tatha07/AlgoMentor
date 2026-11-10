import { WebSocket } from 'ws';

export interface CollabUser {
  userId: string;
  userName: string;
  color: string;
}

export interface CollabChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface CollabRoom {
  id: string;
  name: string;
  problemId: string;
  problemTitle: string;
  language: 'javascript' | 'python' | 'cpp' | 'java';
  code: string;
  clients: Set<WebSocket>;
  users: Map<string, CollabUser>;
  messages: CollabChatMessage[];
  createdAt: string;
  lastActivityAt: number;
}

export interface CreateRoomInput {
  name: string;
  problemId?: string;
  problemTitle?: string;
  language?: 'javascript' | 'python' | 'cpp' | 'java';
  starterCode?: string;
}

const MAX_COLLAB_ROOMS = 100;
const MAX_MESSAGES_PER_ROOM = 100;
const MAX_CODE_LENGTH = 50000;
const MAX_CHAT_TEXT_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;

export class CollabManager {
  private rooms = new Map<string, CollabRoom>();

  constructor() {
    this.initDefaultRooms();
  }

  private initDefaultRooms() {
    this.createRoomInternal('room-two-sum-study', {
      name: 'Two Sum & Hash Maps Deep Dive',
      problemId: 'two-sum',
      problemTitle: 'Two Sum',
      language: 'javascript',
      starterCode: `/**
 * Solves Two Sum in O(n) time using Hash Map.
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
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

console.log('Result:', twoSum([2, 7, 11, 15], 9));
`,
    });

    this.createRoomInternal('room-number-of-islands', {
      name: 'Graph Traversal & Number of Islands',
      problemId: 'number-of-islands',
      problemTitle: 'Number of Islands',
      language: 'python',
      starterCode: `# Number of Islands - BFS / DFS Matrix traversal
class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        rows, cols = len(grid), len(grid[0])
        islands = 0

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
                return
            grid[r][c] = '0' # mark visited
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    islands += 1
                    dfs(r, c)
        return islands

sol = Solution()
print("Total Islands:", sol.numIslands([["1","1","0"],["1","1","0"],["0","0","1"]]))
`,
    });
  }

  private createRoomInternal(id: string, input: CreateRoomInput): CollabRoom {
    const room: CollabRoom = {
      id,
      name: input.name,
      problemId: input.problemId || 'two-sum',
      problemTitle: input.problemTitle || 'Two Sum',
      language: input.language || 'javascript',
      code: input.starterCode || '',
      clients: new Set(),
      users: new Map(),
      messages: [
        {
          id: 'msg-' + Date.now(),
          userId: 'system',
          userName: 'AlgoMentor Bot',
          text: `Room "${input.name}" is active. Happy collaborative problem solving!`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      lastActivityAt: Date.now(),
    };
    this.rooms.set(id, room);
    return room;
  }

  private pruneInactiveRoomsIfNeeded() {
    if (this.rooms.size < MAX_COLLAB_ROOMS) return;

    // Find rooms with 0 connected clients, sorted by oldest activity
    const candidates = Array.from(this.rooms.values())
      .filter(r => r.clients.size === 0 && !r.id.startsWith('room-two-sum') && !r.id.startsWith('room-number-of'))
      .sort((a, b) => a.lastActivityAt - b.lastActivityAt);

    if (candidates.length > 0) {
      this.rooms.delete(candidates[0].id);
    }
  }

  public createRoom(input: CreateRoomInput): { room?: CollabRoom; error?: string } {
    if (!input || typeof input.name !== 'string' || !input.name.trim()) {
      return { error: 'Room name is required and must be non-empty.' };
    }

    const sanitizedName = input.name.trim().slice(0, MAX_NAME_LENGTH);
    const validLanguages = ['javascript', 'python', 'cpp', 'java'];
    const language = validLanguages.includes(input.language || '') 
      ? (input.language as CollabRoom['language']) 
      : 'javascript';

    let code = input.starterCode || '';
    if (code.length > MAX_CODE_LENGTH) {
      code = code.slice(0, MAX_CODE_LENGTH);
    }

    this.pruneInactiveRoomsIfNeeded();

    const roomId = 'room-' + Math.random().toString(36).substring(2, 9);
    const room = this.createRoomInternal(roomId, {
      name: sanitizedName,
      problemId: (input.problemId || 'two-sum').slice(0, 50),
      problemTitle: (input.problemTitle || 'Two Sum').slice(0, 100),
      language,
      starterCode: code || `// Collaborative session for ${(input.problemTitle || 'Two Sum').slice(0, 100)}\n\nfunction solution() {\n  // Code together in real-time\n}\n`,
    });

    return { room };
  }

  public getRoom(roomId: string): CollabRoom | undefined {
    return this.rooms.get(roomId);
  }

  public getOrCreateRoom(roomId: string, defaultName?: string): CollabRoom {
    const existing = this.rooms.get(roomId);
    if (existing) return existing;

    this.pruneInactiveRoomsIfNeeded();
    const safeName = (defaultName || `Study Room #${roomId.substring(0, 6)}`).slice(0, MAX_NAME_LENGTH);
    return this.createRoomInternal(roomId, {
      name: safeName,
      problemId: 'two-sum',
      problemTitle: 'Two Sum',
      language: 'javascript',
      starterCode: `// Real-Time Collaborative Room\n// Room ID: ${roomId}\n\nfunction solve() {\n  // Type code here...\n}\n`,
    });
  }

  public getRoomsList() {
    return Array.from(this.rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      problemId: r.problemId,
      problemTitle: r.problemTitle,
      language: r.language,
      activeUsersCount: r.users.size,
      messageCount: r.messages.length,
      createdAt: r.createdAt,
    }));
  }

  public updateCode(roomId: string, code: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.code = typeof code === 'string' ? code.slice(0, MAX_CODE_LENGTH) : '';
    room.lastActivityAt = Date.now();
    return true;
  }

  public updateLanguage(roomId: string, language: 'javascript' | 'python' | 'cpp' | 'java'): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.language = language;
    room.lastActivityAt = Date.now();
    return true;
  }

  public addChatMessage(roomId: string, message: { userId: string; userName: string; text: string }): CollabChatMessage | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const newMsg: CollabChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      userId: (message.userId || 'anon').slice(0, 50),
      userName: (message.userName || 'Peer Developer').slice(0, 50),
      text: (message.text || '').slice(0, MAX_CHAT_TEXT_LENGTH),
      timestamp: new Date().toISOString(),
    };

    room.messages.push(newMsg);
    if (room.messages.length > MAX_MESSAGES_PER_ROOM) {
      room.messages.shift();
    }
    room.lastActivityAt = Date.now();
    return newMsg;
  }

  public getRoomCount(): number {
    return this.rooms.size;
  }
}

export const collabManager = new CollabManager();
