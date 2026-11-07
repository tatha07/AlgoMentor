import React, { useState } from 'react';
import { GnaniVoiceId } from '../../types';
import { GNANI_VOICES } from '../../data/gnaniVoicesData';
import { speechEngine } from '../../services/speechManager';
import { 
  X, 
  Volume2, 
  Check, 
  Sparkles, 
  Radio, 
  Square,
  Flame,
  GraduationCap,
  Heart,
  Zap,
  Coffee
} from 'lucide-react';

interface GnaniVoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoiceId: GnaniVoiceId;
  onSelectVoice: (voiceId: GnaniVoiceId) => void;
}

export const GnaniVoiceSelectorModal: React.FC<GnaniVoiceSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedVoiceId,
  onSelectVoice,
}) => {
  const [previewingVoiceId, setPreviewingVoiceId] = useState<GnaniVoiceId | null>(null);

  if (!isOpen) return null;

  const handlePreviewVoice = async (voiceId: GnaniVoiceId) => {
    if (previewingVoiceId === voiceId) {
      speechEngine.interrupt();
      setPreviewingVoiceId(null);
      return;
    }

    const config = GNANI_VOICES[voiceId];
    setPreviewingVoiceId(voiceId);

    try {
      await speechEngine.speakText(config.sampleText, voiceId, 'voice-preview');
    } finally {
      setPreviewingVoiceId(null);
    }
  };

  const getVoiceIcon = (id: GnaniVoiceId) => {
    switch (id) {
      case 'mentor':
        return <Heart className="w-5 h-5 text-emerald-400" />;
      case 'professor':
        return <GraduationCap className="w-5 h-5 text-blue-400" />;
      case 'energetic':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'calm':
        return <Coffee className="w-5 h-5 text-purple-400" />;
      case 'classic':
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white font-mono flex items-center gap-2">
                Choose Your Gnani Voice
                <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                  5 Personas
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Pick the voice and pedagogical teaching personality that suits your style.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              speechEngine.interrupt();
              onClose();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {(Object.keys(GNANI_VOICES) as GnaniVoiceId[]).map(voiceKey => {
            const voice = GNANI_VOICES[voiceKey];
            const isSelected = selectedVoiceId === voiceKey;
            const isPreviewing = previewingVoiceId === voiceKey;

            return (
              <div
                key={voice.id}
                onClick={() => onSelectVoice(voice.id)}
                className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Left: Avatar & Details */}
                <div className="flex items-start gap-3.5 flex-1">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${voice.avatarGradient} flex items-center justify-center text-white shrink-0 shadow-md`}>
                    {getVoiceIcon(voice.id)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">
                        {voice.name}
                      </h4>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {voice.badge}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      {voice.tagline}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {voice.description}
                    </p>
                  </div>
                </div>

                {/* Right: Preview Audio & Select Button */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handlePreviewVoice(voice.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                      isPreviewing
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/40 animate-pulse'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {isPreviewing ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPreviewing ? 'Stop' : 'Listen'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectVoice(voice.id);
                      speechEngine.interrupt();
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Use Voice'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Voice preference is automatically saved.</span>
          <button
            onClick={() => {
              speechEngine.interrupt();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-mono font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
