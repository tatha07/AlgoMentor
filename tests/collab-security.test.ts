import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CollabManager } from '../src/lib/collabStore';

describe('Collaboration Rooms Security & State Tests', () => {
  test('Creates room with valid name and default initial state', () => {
    const manager = new CollabManager();
    const result = manager.createRoom({
      name: 'Dynamic Programming Masterclass',
      problemId: 'coin-change',
      problemTitle: 'Coin Change',
      language: 'javascript',
    });

    assert.ok(result.room);
    assert.ok(result.room?.id.startsWith('room-'));
    assert.equal(result.room?.name, 'Dynamic Programming Masterclass');
    assert.equal(result.room?.problemId, 'coin-change');
    assert.equal(result.room?.messages.length, 1);
  });

  test('Rejects invalid or empty room names', () => {
    const manager = new CollabManager();
    const emptyResult = manager.createRoom({ name: '' });
    assert.ok(emptyResult.error);
    assert.ok(emptyResult.error?.includes('required'));

    const whitespaceResult = manager.createRoom({ name: '    ' });
    assert.ok(whitespaceResult.error);

    const nullResult = manager.createRoom({ name: null as any });
    assert.ok(nullResult.error);
  });

  test('Truncates oversized room names and code payloads', () => {
    const manager = new CollabManager();
    const longName = 'A'.repeat(500);
    const hugeCode = 'console.log("hi");\n'.repeat(5000); // > 100KB

    const result = manager.createRoom({
      name: longName,
      starterCode: hugeCode,
    });

    assert.ok(result.room);
    assert.ok(result.room.name.length <= 100);
    assert.ok(result.room.code.length <= 50000);
  });

  test('Caps chat message length and history to prevent memory DoS', () => {
    const manager = new CollabManager();
    const createRes = manager.createRoom({ name: 'Chat Test Room' });
    const roomId = createRes.room!.id;

    // Send a message longer than 2000 chars
    const longText = 'Spam '.repeat(600); // 3000 chars
    const msg = manager.addChatMessage(roomId, {
      userId: 'u1',
      userName: 'Alice',
      text: longText,
    });

    assert.ok(msg);
    assert.ok(msg.text.length <= 2000);

    // Flood with 150 messages to verify capped history
    for (let i = 0; i < 150; i++) {
      manager.addChatMessage(roomId, {
        userId: `u-${i}`,
        userName: `User ${i}`,
        text: `Message index ${i}`,
      });
    }

    const room = manager.getRoom(roomId)!;
    assert.ok(room.messages.length <= 100, `Expected max 100 messages, got ${room.messages.length}`);
  });

  test('Prunes inactive rooms when room capacity limit is reached', () => {
    const manager = new CollabManager();
    const initialCount = manager.getRoomCount();
    assert.ok(initialCount >= 2);

    // Create rooms up to and beyond the max capacity
    for (let i = 0; i < 110; i++) {
      manager.createRoom({
        name: `Automated Room ${i}`,
      });
    }

    // Capacity must be bounded at or below 100
    const finalCount = manager.getRoomCount();
    assert.ok(finalCount <= 100, `Expected at most 100 rooms, got ${finalCount}`);
  });

  test('Updates room code and language safely', () => {
    const manager = new CollabManager();
    const { room } = manager.createRoom({ name: 'Code Update Room' });
    const roomId = room!.id;

    const okCode = manager.updateCode(roomId, 'function solve() { return 42; }');
    assert.equal(okCode, true);

    const okLang = manager.updateLanguage(roomId, 'python');
    assert.equal(okLang, true);

    const updated = manager.getRoom(roomId)!;
    assert.equal(updated.code, 'function solve() { return 42; }');
    assert.equal(updated.language, 'python');
  });
});
