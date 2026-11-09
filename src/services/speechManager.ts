import { GnaniVoiceId } from '../types';
import { GNANI_VOICES } from '../data/gnaniVoicesData';
import { synthesizeSpeech } from './api';

// Helper to strip markdown, code blocks, and huge paragraphs for clean, fast, punchy speech
export function extractCleanSpeechText(markdown: string, maxChars: number = 450): string {
  if (!markdown) return '';
  let cleaned = markdown
    // Strip fenced code blocks
    .replace(/```[\s\S]*?```/g, ' I have written the code snippet on your screen. ')
    // Strip inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Strip links
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Strip list markers and headers
    .replace(/^[#*-]\s+/gm, '')
    .replace(/[#*_~>]/g, ' ')
    // Clear Big-O pronunciation
    .replace(/O\(1\)/g, 'O of 1')
    .replace(/O\(N\)/g, 'O of N')
    .replace(/O\(N\s*\^\s*2\)/g, 'O of N squared')
    .replace(/O\(N\s*log\s*N\)/g, 'O of N log N')
    .replace(/O\(log\s*N\)/g, 'O of log N')
    .replace(/O\(2\s*\^\s*N\)/g, 'O of 2 to the N')
    .replace(/O\(V\s*\+\s*E\)/g, 'O of V plus E')
    .replace(/\s+/g, ' ')
    .trim();

  // If text is long, stop at the natural sentence boundary near maxChars for instant response
  if (cleaned.length > maxChars) {
    const cut = cleaned.slice(0, maxChars);
    const lastPunctuation = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
    if (lastPunctuation > 160) {
      cleaned = cut.slice(0, lastPunctuation + 1);
    } else {
      cleaned = cut + '...';
    }
  }

  return cleaned;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoadingAudio: boolean;
  fallbackNotice: string | null;
  speakingMessageId: string | null;
  activeVoiceId: GnaniVoiceId;
  playbackProgress: number; // 0 to 100
  spokenSnippet?: string;
  lastSpokenText?: string;
  rate: number;
}

class GnaniSpeechEngine {
  private audioElement: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentEngine: 'gnani-server' | 'browser-synthesis' | null = null;
  private stateListeners: Set<(state: AudioPlaybackState) => void> = new Set();

  private state: AudioPlaybackState = {
    isPlaying: false,
    isPaused: false,
    isLoadingAudio: false,
    fallbackNotice: null,
    speakingMessageId: null,
    activeVoiceId: 'classic',
    playbackProgress: 0,
    rate: 1.0,
  };

  private notify() {
    this.stateListeners.forEach(listener => listener({ ...this.state }));
  }

  public subscribe(listener: (state: AudioPlaybackState) => void): () => void {
    this.stateListeners.add(listener);
    listener({ ...this.state });
    return () => this.stateListeners.delete(listener);
  }

  public getState(): AudioPlaybackState {
    return { ...this.state };
  }

  /**
   * Pre-warms audio permissions on user gesture to avoid browser autoplay restrictions
   */
  public unlockAudio() {
    if (typeof window === 'undefined') return;
    try {
      const audio = this.audioElement || new Audio();
      this.audioElement = audio;
      const sampleRate = 8000;
      const frameCount = 800;
      const wav = new ArrayBuffer(44 + frameCount * 2);
      const view = new DataView(wav);
      const writeString = (offset: number, value: string) => {
        for (let index = 0; index < value.length; index++) {
          view.setUint8(offset + index, value.charCodeAt(index));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + frameCount * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, frameCount * 2, true);

      const url = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
      audio.muted = false;
      audio.src = url;
      const releaseSilentAudio = () => {
        if (audio.src === url) {
          audio.pause();
          audio.removeAttribute('src');
          audio.load();
          audio.muted = false;
        }
        URL.revokeObjectURL(url);
      };

      void audio.play().then(
        () => window.setTimeout(releaseSilentAudio, 100),
        releaseSilentAudio
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Audio could not be initialized.';
      this.state.fallbackNotice = message;
      this.notify();
    }
  }

  /**
   * Interrupts and halts all ongoing speech playback immediately.
   */
  public interrupt() {
    // 1. Stop HTML5 Audio if playing server-generated sound
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.onended = null;
        this.audioElement.onerror = null;
        this.audioElement.oncanplay = null;
        this.audioElement.ontimeupdate = null;
        this.audioElement.removeAttribute('src');
        this.audioElement.load();
      } catch {}
    }
    if (this.currentObjectUrl) {
      try {
        URL.revokeObjectURL(this.currentObjectUrl);
      } catch {}
      this.currentObjectUrl = null;
    }

    // 2. Stop browser speech synthesis if active
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('SpeechSynthesis cancel error:', e);
      }
      this.currentUtterance = null;
    }

    this.currentEngine = null;
    this.state = {
      ...this.state,
      isPlaying: false,
      isPaused: false,
      isLoadingAudio: false,
      speakingMessageId: null,
      playbackProgress: 0,
    };
    this.notify();
  }

  /**
   * Pause ongoing audio
   */
  public pause() {
    if (this.currentEngine === 'gnani-server' && this.audioElement) {
      this.audioElement.pause();
    } else if (this.currentEngine === 'browser-synthesis' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.state.isPaused = true;
    this.notify();
  }

  /**
   * Resume paused audio
   */
  public resume() {
    if (this.currentEngine === 'gnani-server' && this.audioElement) {
      this.audioElement.play().catch(console.warn);
    } else if (this.currentEngine === 'browser-synthesis' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.state.isPaused = false;
    this.notify();
  }

  /**
   * Replay last spoken text
   */
  public replay() {
    if (this.state.lastSpokenText) {
      void this.speakText(this.state.lastSpokenText, this.state.activeVoiceId, this.state.speakingMessageId || undefined);
    }
  }

  /**
   * Speak text with the selected Gnani voice persona.
   * Attempts high-fidelity Gnani API synthesis first, falling back cleanly to Web Speech API.
   */
  public async speakText(
    text: string, 
    voiceId: GnaniVoiceId = 'classic', 
    messageId?: string,
    speedMultiplier: number = 1.0
  ): Promise<void> {
    // Stop any existing playback first (interruptible)
    this.interrupt();

    const cleanText = extractCleanSpeechText(text);
    if (!cleanText) return;

    const voiceConfig = GNANI_VOICES[voiceId] || GNANI_VOICES.classic;
    const effectiveSpeed = Math.max(0.7, Math.min(1.5, (voiceConfig.webSpeechRate || 1.0) * speedMultiplier));

    this.state = {
      isPlaying: false,
      isPaused: false,
      isLoadingAudio: true,
      fallbackNotice: null,
      speakingMessageId: messageId || 'preview',
      activeVoiceId: voiceId,
      playbackProgress: 0,
      spokenSnippet: cleanText.length > 80 ? cleanText.slice(0, 80) + '...' : cleanText,
      lastSpokenText: text,
      rate: effectiveSpeed,
    };
    this.notify();

    // Try Gnani server synthesis first
    try {
      const blob = await synthesizeSpeech(cleanText, voiceConfig.gnaniVoiceName, effectiveSpeed);
      if (blob && blob.size > 0) {
        this.currentEngine = 'gnani-server';
        const url = URL.createObjectURL(blob);
        this.currentObjectUrl = url;
        const audio = this.audioElement || new Audio();
        this.audioElement = audio;
        audio.muted = false;
        audio.src = url;
        audio.load();

        audio.playbackRate = effectiveSpeed;

        audio.ontimeupdate = () => {
          if (audio.duration > 0) {
            this.state.playbackProgress = Math.round((audio.currentTime / audio.duration) * 100);
            this.notify();
          }
        };

        audio.onended = () => {
          this.interrupt();
        };

        audio.onerror = () => {
          this.state.fallbackNotice = 'Gnani audio could not be played. Trying your browser voice instead.';
          this.notify();
          this.playWithWebSpeech(cleanText, voiceConfig, messageId, effectiveSpeed);
        };

        // When audio is loaded and ready, update state and play
        audio.oncanplay = () => {
          this.state.isLoadingAudio = false;
          this.state.isPlaying = true;
          this.notify();
        };

        await audio.play();
        this.state.isLoadingAudio = false;
        this.state.isPlaying = true;
        this.notify();
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'The speech service returned an unknown error.';
      this.state.fallbackNotice = `Gnani voice unavailable: ${message}. Using your browser voice instead.`;
      this.notify();
      console.warn('Gnani server speech synthesis failed:', err);
    }

    // Fallback: Web Speech API in the browser
    this.playWithWebSpeech(cleanText, voiceConfig, messageId, effectiveSpeed);
  }

  private playWithWebSpeech(
    text: string, 
    voiceConfig: typeof GNANI_VOICES['classic'], 
    messageId?: string,
    speed: number = 1.0
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.interrupt();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      this.currentEngine = 'browser-synthesis';

      utterance.rate = speed;
      utterance.pitch = voiceConfig.webSpeechPitch || 1.0;

      // Match best available browser voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredLang = 'en';
        const match = voices.find(v => v.lang.startsWith(preferredLang) && (
          voiceConfig.id === 'mentor' || voiceConfig.id === 'calm'
            ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira')
            : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george')
        )) || voices.find(v => v.lang.startsWith(preferredLang)) || voices[0];

        if (match) {
          utterance.voice = match;
        }
      }

      utterance.onstart = () => {
        this.state.isLoadingAudio = false;
        this.state.isPlaying = true;
        this.notify();
      };

      utterance.onend = () => {
        this.interrupt();
      };

      utterance.onerror = () => {
        this.state.fallbackNotice = 'Browser voice playback failed. Check that audio is enabled in your browser.';
        this.notify();
        this.interrupt();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Web Speech error:', e);
      this.interrupt();
    }
  }
}

export const speechEngine = new GnaniSpeechEngine();
