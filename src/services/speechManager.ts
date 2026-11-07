import { GnaniVoiceId } from '../types';
import { GNANI_VOICES } from '../data/gnaniVoicesData';
import { synthesizeSpeech } from './api';

// Helper to strip markdown and code blocks for clean text-to-speech pronunciation
export function extractCleanSpeechText(markdown: string): string {
  if (!markdown) return '';
  return markdown
    .replace(/```[\s\S]*?```/g, ' I have written a code snippet on your screen for this. ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[#*_~>]/g, ' ')
    .replace(/O\(1\)/g, 'O of 1')
    .replace(/O\(N\)/g, 'O of N')
    .replace(/O\(N\s*\^\s*2\)/g, 'O of N squared')
    .replace(/O\(N\s*log\s*N\)/g, 'O of N log N')
    .replace(/O\(log\s*N\)/g, 'O of log N')
    .replace(/O\(2\s*\^\s*N\)/g, 'O of 2 to the N')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  speakingMessageId: string | null;
  activeVoiceId: GnaniVoiceId;
  playbackProgress: number; // 0 to 100
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
    speakingMessageId: null,
    activeVoiceId: 'classic',
    playbackProgress: 0,
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
   * Interrupts and halts all ongoing speech playback immediately.
   */
  public interrupt() {
    // 1. Stop HTML5 Audio if playing server-generated sound
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
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
   * Speak text with the selected Gnani voice persona.
   * Attempts high-fidelity Gnani API synthesis first, falling back cleanly to Web Speech API.
   */
  public async speakText(
    text: string, 
    voiceId: GnaniVoiceId = 'classic', 
    messageId?: string
  ): Promise<void> {
    // Stop any existing playback first (interruptible)
    this.interrupt();

    const cleanText = extractCleanSpeechText(text);
    if (!cleanText) return;

    const voiceConfig = GNANI_VOICES[voiceId] || GNANI_VOICES.classic;

    this.state = {
      isPlaying: true,
      isPaused: false,
      speakingMessageId: messageId || 'preview',
      activeVoiceId: voiceId,
      playbackProgress: 0,
    };
    this.notify();

    // Try Gnani server synthesis first
    try {
      const blob = await synthesizeSpeech(cleanText, voiceConfig.gnaniVoiceName, voiceConfig.webSpeechRate);
      if (blob && blob.size > 0) {
        this.currentEngine = 'gnani-server';
        const url = URL.createObjectURL(blob);
        this.currentObjectUrl = url;
        const audio = new Audio(url);
        this.audioElement = audio;

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
          console.warn('Gnani server audio playback failed, falling back to Web Speech API');
          this.playWithWebSpeech(cleanText, voiceConfig, messageId);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.info('Gnani server speech synthesis not reachable or key absent, using browser Web Speech API:', err);
    }

    // Fallback: Web Speech API in the browser
    this.playWithWebSpeech(cleanText, voiceConfig, messageId);
  }

  private playWithWebSpeech(
    text: string, 
    voiceConfig: typeof GNANI_VOICES['classic'], 
    messageId?: string
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

      utterance.rate = voiceConfig.webSpeechRate;
      utterance.pitch = voiceConfig.webSpeechPitch;

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

      utterance.onend = () => {
        this.interrupt();
      };

      utterance.onerror = () => {
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
