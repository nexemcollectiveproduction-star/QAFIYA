import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Building2, 
  Sparkles, 
  Compass, 
  Heart, 
  Phone, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  Footprints,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Radio,
  Mic,
  Music
} from 'lucide-react';
import { MANASIK_STEPS, MUSTAJAB_PRAYERS, HOTEL_DETAILS, COMPANY_INFO } from '../data/mockData';

interface Props {
  onOpenGateway: (options?: any) => void;
}

export const ManasikCenter: React.FC<Props> = ({ onOpenGateway }) => {
  const [activeTab, setActiveTab] = useState<'tata_cara' | 'doa_mustajab' | 'hotel_peta' | 'kesehatan'>('tata_cara');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // REAL AUDIO TALBIYAH ENGINE
  const [isPlayingTalbiyah, setIsPlayingTalbiyah] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(48);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [audioMode, setAudioMode] = useState<'melodi' | 'suara' | 'stream'>('melodi');
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);
  const phraseIntervalRef = useRef<any>(null);

  // Talbiyah 4 key phrases with Arabic, Latin, and meaning
  const TALBIYAH_PHRASES = [
    {
      id: 0,
      arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْك',
      latin: 'Labbaikallāhumma labbaīk',
      meaning: 'Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu',
      dur: 6,
    },
    {
      id: 1,
      arabic: 'لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْك',
      latin: 'Labbaīka lā syarīka laka labbaīk',
      meaning: 'Aku penuhi panggilan-Mu, tiada sekutu bagi-Mu, aku penuhi panggilan-Mu',
      dur: 7,
    },
    {
      id: 2,
      arabic: 'إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْك',
      latin: 'Innal-ḥamda wan-ni‘mata laka wal-mulk',
      meaning: 'Sesungguhnya segala puji, nikmat, dan kerajaan adalah milik-Mu',
      dur: 8,
    },
    {
      id: 3,
      arabic: 'لَا شَرِيكَ لَك',
      latin: 'Lā syarīka lak',
      meaning: 'Tiada sekutu bagi-Mu',
      dur: 5,
    },
  ];

  // Initialize and clean up HTML5 audio
  useEffect(() => {
    const audio = new Audio();
    audio.src = 'https://ia800201.us.archive.org/12/items/LabbaikAllahummaLabbaik/Labbaik.mp3';
    audio.loop = isLooping;
    audio.volume = volume;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.round(audio.duration));
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(Math.round(audio.currentTime));
    };

    audio.onended = () => {
      if (!isLooping) {
        setIsPlayingTalbiyah(false);
        setCurrentTime(0);
      }
    };

    audio.onerror = () => {
      console.warn('Remote audio stream unavailable, switched smoothly to Melodi Harmoni Synth.');
      setAudioMode('melodi');
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
      stopSynth();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Play spoken Arabic phrase via SpeechSynthesis
  const speakArabicPhrase = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : volume;

      // Attempt to find Arabic or fallback voice
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith('ar')) || voices.find((v) => v.lang.startsWith('id'));
      if (arVoice) utterance.voice = arVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  // Web Audio Synthesizer: Generates spiritual chanting melody for Talbiyah
  const startSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Melodic notes sequence for "Labbaikallahumma Labbaik..."
      // Musical frequencies (Hz) in soulful Maqam: C4, D4, E4, F4, G4
      const chantNotes = [
        { f: 261.63, d: 0.6, p: 0 }, // Lab-
        { f: 293.66, d: 0.8, p: 0 }, // baik
        { f: 329.63, d: 0.6, p: 0 }, // Al-
        { f: 293.66, d: 0.5, p: 0 }, // lah-
        { f: 261.63, d: 1.2, p: 0 }, // hum-ma
        { f: 293.66, d: 0.6, p: 0 }, // Lab-
        { f: 261.63, d: 1.4, p: 0 }, // baik
        { f: 0, d: 0.6, p: 0 },      // jeda

        { f: 261.63, d: 0.6, p: 1 }, // Lab-
        { f: 293.66, d: 0.8, p: 1 }, // bai-
        { f: 329.63, d: 0.7, p: 1 }, // ka
        { f: 349.23, d: 0.6, p: 1 }, // Laa
        { f: 329.63, d: 0.6, p: 1 }, // sya-
        { f: 293.66, d: 0.7, p: 1 }, // rii-
        { f: 261.63, d: 0.6, p: 1 }, // ka
        { f: 293.66, d: 0.6, p: 1 }, // la-
        { f: 261.63, d: 0.6, p: 1 }, // ka
        { f: 246.94, d: 0.6, p: 1 }, // Lab-
        { f: 261.63, d: 1.8, p: 1 }, // baik...
        { f: 0, d: 0.8, p: 1 },      // jeda

        { f: 329.63, d: 0.7, p: 2 }, // In-
        { f: 349.23, d: 0.7, p: 2 }, // nal-
        { f: 392.00, d: 1.1, p: 2 }, // ham-da
        { f: 349.23, d: 0.6, p: 2 }, // wan-
        { f: 329.63, d: 0.8, p: 2 }, // ni'-ma-
        { f: 293.66, d: 1.1, p: 2 }, // ta
        { f: 261.63, d: 0.6, p: 2 }, // la-ka
        { f: 293.66, d: 0.6, p: 2 }, // wal-
        { f: 261.63, d: 1.6, p: 2 }, // mulk...
        { f: 0, d: 0.8, p: 2 },

        { f: 293.66, d: 0.7, p: 3 }, // Laa
        { f: 261.63, d: 0.7, p: 3 }, // sya-
        { f: 293.66, d: 0.8, p: 3 }, // rii-
        { f: 246.94, d: 0.6, p: 3 }, // ka
        { f: 261.63, d: 2.2, p: 3 }, // lak...
        { f: 0, d: 1.2, p: 3 },      // pause
      ];

      let noteIndex = 0;
      let virtualTimer = 0;

      const playNextMelodyNote = () => {
        if (!audioContextRef.current) return;
        const current = chantNotes[noteIndex % chantNotes.length];
        setActivePhraseIndex(current.p);
        noteIndex++;

        if (current.f > 0 && !isMuted) {
          const currentGainVal = volume * 0.28;

          // Oscillator 1: Main fundamental
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(current.f, ctx.currentTime);

          // Oscillator 2: Soft harmonic fifth overtone for acoustic choir effect
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(current.f * 1.5, ctx.currentTime);

          // Gain Envelopes
          gain1.gain.setValueAtTime(0.001, ctx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(currentGainVal, ctx.currentTime + 0.08);
          gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + current.d - 0.04);

          gain2.gain.setValueAtTime(0.001, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(currentGainVal * 0.35, ctx.currentTime + 0.1);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + current.d - 0.05);

          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);

          osc1.start();
          osc1.stop(ctx.currentTime + current.d);
          osc2.start();
          osc2.stop(ctx.currentTime + current.d);
        }

        virtualTimer = (virtualTimer + 1) % 48;
        setCurrentTime(virtualTimer);

        synthIntervalRef.current = setTimeout(playNextMelodyNote, current.d * 1000);
      };

      playNextMelodyNote();
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  };

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (phraseIntervalRef.current) {
      clearTimeout(phraseIntervalRef.current);
      phraseIntervalRef.current = null;
    }
  };

  // Toggle Play / Pause
  const togglePlayTalbiyah = () => {
    if (isPlayingTalbiyah) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSynth();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingTalbiyah(false);
    } else {
      // Start Playing
      setIsPlayingTalbiyah(true);

      // 1. Resume AudioContext immediately inside user interaction
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }

      if (audioMode === 'stream' && audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.warn('Streaming blocked, falling back to melodic synth:', err);
          setAudioMode('melodi');
          startSynth();
        });
      } else if (audioMode === 'suara') {
        // Voice recitation mode
        let pIdx = 0;
        const playVoiceCycle = () => {
          if (pIdx >= TALBIYAH_PHRASES.length) {
            pIdx = 0;
            if (!isLooping) {
              setIsPlayingTalbiyah(false);
              return;
            }
          }
          const currentP = TALBIYAH_PHRASES[pIdx];
          setActivePhraseIndex(currentP.id);
          speakArabicPhrase(currentP.arabic);
          pIdx++;
          phraseIntervalRef.current = setTimeout(playVoiceCycle, currentP.dur * 1000);
        };
        playVoiceCycle();
      } else {
        // Melodi mode (guaranteed instant playback)
        startSynth();
      }
    }
  };

  // User clicks on a specific phrase to recite it individually
  const handleReciteIndividualPhrase = (phrase: typeof TALBIYAH_PHRASES[0]) => {
    setActivePhraseIndex(phrase.id);
    speakArabicPhrase(phrase.arabic);
  };

  const handleSeek = (newVal: number) => {
    setCurrentTime(newVal);
    if (audioRef.current && audioMode === 'stream') {
      audioRef.current.currentTime = newVal;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.8;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            Pusat Edukasi & Manasik Digital
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Panduan Lengkap Ibadah Umrah Sesuai Sunnah
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Bekal ilmu sebelum menginjakkan kaki di Baitullah. Disusun runtut, disertai lafadz doa Arab, transliterasi Latin, dan audio lantunan Talbiyah yang berfungsi langsung dan jernih.
          </p>
        </div>

        {/* FULLY FUNCTIONAL REAL AUDIO TALBIYAH PLAYER */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-600/60 relative overflow-hidden space-y-6">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Player Header with Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/60 pb-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Pemutar Lantunan Audio Talbiyah Resmi</span>
              {isPlayingTalbiyah && (
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                  Sedang Mengumandang
                </span>
              )}
            </div>

            {/* Audio Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/50 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setAudioMode('melodi');
                  if (isPlayingTalbiyah) {
                    stopSynth();
                    startSynth();
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  audioMode === 'melodi' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="Melodi harmoni vokal langsung via Web Audio"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Lantunan Melodi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAudioMode('suara');
                  if (isPlayingTalbiyah) {
                    stopSynth();
                    speakArabicPhrase(TALBIYAH_PHRASES[activePhraseIndex].arabic);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  audioMode === 'suara' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="Bimbingan suara lafadz bahasa Arab"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Bimbingan Suara</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAudioMode('stream');
                  if (isPlayingTalbiyah && audioRef.current) {
                    stopSynth();
                    audioRef.current.play().catch(() => {});
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  audioMode === 'stream' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
                title="Streaming siaran rekaman"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Streaming</span>
              </button>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl flex-1">
              <div className="font-arabic text-2xl sm:text-4xl text-amber-200 leading-relaxed font-normal">
                لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ
              </div>

              {/* Phrase Cards Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {TALBIYAH_PHRASES.map((phrase) => {
                  const isActive = isPlayingTalbiyah && activePhraseIndex === phrase.id;
                  return (
                    <div
                      key={phrase.id}
                      onClick={() => handleReciteIndividualPhrase(phrase)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-amber-400/20 border-amber-300 ring-2 ring-amber-300/40'
                          : 'bg-white/5 border-emerald-800/80 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 mb-1">
                        <span>Lafadz {phrase.id + 1}</span>
                        <span className="text-[10px] text-emerald-300">Tekan untuk Dengarkan 🔊</span>
                      </div>
                      <div className="font-arabic text-lg text-white font-normal mb-0.5">
                        {phrase.arabic}
                      </div>
                      <div className="text-xs text-emerald-100 font-mono italic">
                        {phrase.latin}
                      </div>
                      <div className="text-[10px] text-emerald-200/70 mt-1">
                        {phrase.meaning}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Play / Pause Circle with Visual Waves */}
            <div className="flex flex-col items-center gap-3 shrink-0 self-center">
              <button
                type="button"
                onClick={togglePlayTalbiyah}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 ${
                  isPlayingTalbiyah
                    ? 'bg-amber-400 text-slate-950 scale-105 ring-4 ring-amber-300/40'
                    : 'bg-white text-emerald-900 hover:bg-emerald-50 ring-4 ring-white/20'
                }`}
                title={isPlayingTalbiyah ? 'Jeda Lantunan Talbiyah' : 'Putar Lantunan Audio Talbiyah'}
              >
                {isPlayingTalbiyah ? (
                  <Pause className="w-10 h-10 fill-current" />
                ) : (
                  <Play className="w-10 h-10 fill-current ml-1" />
                )}
              </button>

              <div className="text-center">
                <span className="text-xs font-bold text-amber-300 block">
                  {isPlayingTalbiyah ? 'Sedang Bersuara' : 'Tekan untuk Putar Audio'}
                </span>
                <span className="text-[10px] text-emerald-300">
                  {audioMode === 'melodi' && 'Mode Melodi Harmoni (Aktif)'}
                  {audioMode === 'suara' && 'Mode Talaqqi Suara (Aktif)'}
                  {audioMode === 'stream' && 'Mode Streaming Makkah'}
                </span>
              </div>

              {/* Animated Equalizer Wave Bars */}
              {isPlayingTalbiyah && (
                <div className="flex items-center gap-1 h-6 pt-1">
                  <span className="w-1 bg-amber-300 rounded-full animate-pulse h-3"></span>
                  <span className="w-1 bg-amber-300 rounded-full animate-pulse h-6 [animation-delay:0.2s]"></span>
                  <span className="w-1 bg-amber-300 rounded-full animate-pulse h-4 [animation-delay:0.4s]"></span>
                  <span className="w-1 bg-amber-300 rounded-full animate-pulse h-5 [animation-delay:0.1s]"></span>
                  <span className="w-1 bg-amber-300 rounded-full animate-pulse h-3 [animation-delay:0.3s]"></span>
                  <span className="w-1 bg-amber-300 rounded-full animate-pulse h-6 [animation-delay:0.25s]"></span>
                  <span className="w-1 bg-amber-300 rounded-full animate-pulse h-4 [animation-delay:0.15s]"></span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Audio Progress Bar & Volume Controls */}
          <div className="pt-3 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            {/* Time progress */}
            <div className="flex items-center gap-3 w-full sm:flex-1">
              <span className="font-mono text-emerald-200 font-bold min-w-[35px]">
                {formatSeconds(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-emerald-800 rounded-lg"
              />
              <span className="font-mono text-emerald-300/80 min-w-[35px]">
                {formatSeconds(duration)}
              </span>
            </div>

            {/* Loop and Volume */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                  isLooping ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-emerald-200'
                }`}
                title="Ulangi terus menerus"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ulangi Otomatis</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-emerald-200 hover:text-white cursor-pointer"
                  title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-16 sm:w-20 accent-amber-400 cursor-pointer h-1.5 bg-emerald-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
          {[
            { id: 'tata_cara', label: '1. Rukun & Tata Cara Umrah' },
            { id: 'doa_mustajab', label: '2. Kumpulan Doa Mustajab' },
            { id: 'hotel_peta', label: '3. Info Hotel & Peta Lokasi' },
            { id: 'kesehatan', label: '4. Tips Kesehatan & Adab' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: RUKUN & TATA CARA */}
        {activeTab === 'tata_cara' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Step navigation chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MANASIK_STEPS.map((st, idx) => (
                <button
                  key={st.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeStepIndex === idx
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">Tahap {st.step}</div>
                  <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{st.title.split('(')[0]}</div>
                </button>
              ))}
            </div>

            {/* Current Step Detailed Card */}
            {(() => {
              const currentStep = MANASIK_STEPS[activeStepIndex];
              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                      <Footprints className="w-4 h-4" />
                      Tahap Ke-{currentStep.step} dari 4 Rukun Umrah
                    </div>
                    <div className="font-arabic text-2xl text-emerald-800 font-normal mt-1">
                      {currentStep.arabicName}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                      {currentStep.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lokasi Pelaksanaan: <strong>{currentStep.location}</strong></span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {currentStep.description}
                  </p>

                  {/* Rules & Prohibitions */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-amber-700" />
                      <span>Ketentuan Penting & Larangan pada Tahap Ini:</span>
                    </div>
                    <ul className="space-y-1 text-amber-900/90 pl-1">
                      {currentStep.rules.map((rule, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <span className="text-amber-700 font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prayers for this step */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      Doa & Bacaan yang Disunnahkan pada Tahap {currentStep.step}:
                    </h4>

                    <div className="space-y-3">
                      {currentStep.prayers.map((prayer) => (
                        <div key={prayer.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>{prayer.title}</span>
                            <span className="text-[10px] text-slate-400">{prayer.occasion}</span>
                          </div>
                          <div className="font-arabic text-xl sm:text-2xl text-slate-900 leading-relaxed text-right py-1 font-normal">
                            {prayer.arabic}
                          </div>
                          <div className="text-xs font-mono text-emerald-800 font-medium">
                            {prayer.latin}
                          </div>
                          <div className="text-xs text-slate-600 italic">
                            "{prayer.translation}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation next/prev */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={activeStepIndex === 0}
                      onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                    >
                      ← Tahap Sebelumnya
                    </button>
                    <button
                      type="button"
                      disabled={activeStepIndex === MANASIK_STEPS.length - 1}
                      onClick={() => setActiveStepIndex((prev) => Math.min(MANASIK_STEPS.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Tahap Berikutnya →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: KUMPULAN DOA MUSTAJAB */}
        {activeTab === 'doa_mustajab' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {MUSTAJAB_PRAYERS.map((pr) => (
              <div key={pr.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-800">{pr.title}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{pr.occasion}</span>
                  </div>
                  <div className="font-arabic text-xl sm:text-2xl text-slate-900 leading-relaxed text-right py-2 font-normal">
                    {pr.arabic}
                  </div>
                  <div className="text-xs font-mono text-emerald-800 font-medium">
                    {pr.latin}
                  </div>
                  <div className="text-xs text-slate-600 italic">
                    "{pr.translation}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: HOTEL & PETA LOKASI */}
        {activeTab === 'hotel_peta' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HOTEL_DETAILS.map((h, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="relative h-48 bg-slate-900">
                    <img src={h.photo} alt={h.hotelName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-emerald-800/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Kota Suci {h.city}
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold">{h.hotelName}</h3>
                      <div className="text-amber-300 text-xs font-semibold">{h.distance}</div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 text-xs text-slate-600">
                    <div className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                      ⭐ {h.rating}
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 mb-1">Fasilitas Jamaah:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {h.features.map((f, fIdx) => (
                          <span key={fIdx} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px]">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TIPS KESEHATAN & ADAB */}
        {activeTab === 'kesehatan' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Panduan Menjaga Fisik & Adab di Tanah Suci</h3>
              <p className="text-slate-500 mt-1">Ibadah Umrah memerlukan ketahanan fisik yang prima. Perhatikan anjuran berikut:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">💧 Hidrasi & Suhu Udara</div>
                <p className="text-slate-600 text-xs">
                  Minum air Zamzam secara berkala meski belum haus. Bawa semprotan air wajah saat thawaf siang hari di pelataran Ka'bah.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">👟 Alas Kaki & Sandal</div>
                <p className="text-slate-600 text-xs">
                  Gunakan kantong sandal serut pribadi dan selalu bawa masuk ke dalam masjid. Jangan tinggalkan sandal di rak jika takut lupa titik pintu masuk.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">💊 Obat-obatan Pribadi</div>
                <p className="text-slate-600 text-xs">
                  Bawa obat rutin (tensi, diabetes, asma, vitamin) dalam tas kabin lengkap dengan resep dokter. Tim medis kami juga siap mendampingi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">🤝 Adab Berinteraksi</div>
                <p className="text-slate-600 text-xs">
                  Hindari berdesak-desakan, saling mengalah saat mencium Hajar Aswad (cukup berisyarat bila padat), dan jaga tutur kata (hindari rafats, fusuq, dan jidal).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
