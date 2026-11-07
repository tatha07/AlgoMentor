import { useState, useRef, useEffect, useCallback } from 'react';
import { transcribeSpeech } from '../services/api';

// WAV conversion helper for fallback recording
async function convertRecordingToWav(recording: Blob): Promise<Blob> {
  const audioContext = new AudioContext();
  try {
    const audioBuffer = await audioContext.decodeAudioData(await recording.arrayBuffer());
    const frameCount = audioBuffer.length;
    const channelData = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) =>
      audioBuffer.getChannelData(index)
    );
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
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, frameCount * 2, true);

    for (let frame = 0; frame < frameCount; frame++) {
      let sample = 0;
      for (const channel of channelData) {
        sample += channel[frame] / channelData.length;
      }
      const pcmSample = Math.max(-1, Math.min(1, sample));
      view.setInt16(44 + frame * 2, pcmSample < 0 ? pcmSample * 0x8000 : pcmSample * 0x7fff, true);
    }

    return new Blob([wav], { type: 'audio/wav' });
  } finally {
    await audioContext.close();
  }
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isTranscribing: boolean;
  interimTranscript: string;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  audioVolume: number; // 0 to 1 for live waveform visualization
}

export function useSpeechRecognition(onResultCallback?: (text: string) => void): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isBrowserSpeechSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const cleanupAudioAnalyser = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.warn);
      audioContextRef.current = null;
    }
    setAudioVolume(0);
  }, []);

  const startVolumeTracking = useCallback((stream: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1, avg / 128);
        setAudioVolume(normalized);
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (e) {
      console.warn('Could not initialize audio volume analyser:', e);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    cleanupAudioAnalyser();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
      recognitionRef.current = null;
    }

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try {
        recorderRef.current.stop();
      } catch (e) {
        console.warn('Recorder stop error:', e);
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [cleanupAudioAnalyser]);

  const startListening = useCallback(async () => {
    setError(null);
    setInterimTranscript('');

    // First request microphone stream
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startVolumeTracking(stream);
    } catch (err: any) {
      setError('Microphone permission denied or microphone unavailable. Please allow microphone access.');
      return;
    }

    // Path A: Modern browser SpeechRecognition (Live Interim results)
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      try {
        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentFinal += transcriptPiece + ' ';
            } else {
              currentInterim += transcriptPiece;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
          }
          if (currentFinal) {
            setTranscript(prev => {
              const updated = (prev ? prev + ' ' : '') + currentFinal.trim();
              if (onResultCallback) onResultCallback(updated);
              return updated;
            });
            setInterimTranscript('');
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone access was blocked.');
          } else if (event.error !== 'no-speech') {
            setError(`Speech recognition encountered an issue (${event.error}).`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          cleanupAudioAnalyser();
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('Failed to start SpeechRecognition, falling back to MediaRecorder:', e);
      }
    }

    // Path B: MediaRecorder + Gnani STT API Fallback
    try {
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4'].find(type =>
        typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)
      );
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        cleanupAudioAnalyser();
        setIsListening(false);
        setIsTranscribing(true);

        try {
          const recording = new Blob(chunks, { type: recorder.mimeType });
          if (!recording.size) {
            throw new Error('No audio was captured.');
          }
          const wav = await convertRecordingToWav(recording);
          const transcriptResult = await transcribeSpeech(wav);
          if (transcriptResult && transcriptResult.trim()) {
            setTranscript(prev => {
              const updated = (prev ? prev + ' ' : '') + transcriptResult.trim();
              if (onResultCallback) onResultCallback(updated);
              return updated;
            });
          } else {
            setError('No speech was detected. Please try speaking again.');
          }
        } catch (err: any) {
          setError(err?.message || 'Failed to transcribe audio.');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      setIsListening(true);
    } catch (recorderErr: any) {
      setError(recorderErr?.message || 'Audio recording failed to start.');
      setIsListening(false);
      cleanupAudioAnalyser();
    }
  }, [cleanupAudioAnalyser, onResultCallback, startVolumeTracking]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    isTranscribing,
    interimTranscript,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: true,
    audioVolume,
  };
}
