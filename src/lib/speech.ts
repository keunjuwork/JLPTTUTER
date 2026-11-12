// Web Speech API (ja-JP) & Web Audio FX utilities

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopJapaneseSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

const speechPlayListeners = new Set<() => void>();
const soundAttemptListeners = new Set<() => void>();

export function subscribeSpeechPlay(listener: () => void): () => void {
  speechPlayListeners.add(listener);
  return () => {
    speechPlayListeners.delete(listener);
  };
}

export function subscribeSoundAttempt(listener: () => void): () => void {
  soundAttemptListeners.add(listener);
  return () => {
    soundAttemptListeners.delete(listener);
  };
}

function notifySpeechPlay(): void {
  speechPlayListeners.forEach((cb) => {
    try {
      cb();
    } catch {
      // ignore listener errors
    }
  });
}

function notifySoundAttempt(): void {
  soundAttemptListeners.forEach((cb) => {
    try {
      cb();
    } catch {
      // ignore listener errors
    }
  });
}

export function speakJapanese(text: string, rate = 0.95, pitch = 1.05): void {
  if (!text.trim()) return;
  notifySoundAttempt();
  notifySpeechPlay();
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = rate;
    utter.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ja'));
    if (jaVoice) {
      utter.voice = jaVoice;
    }
    window.speechSynthesis.speak(utter);
  } catch {
    // Graceful silent fallback if browser blocks synthesis
  }
}

export function speakJapanesePromise(
  text: string,
  rate = 0.95,
  pitch = 1.05
): Promise<void> {
  if (text.trim()) {
    notifySoundAttempt();
    notifySpeechPlay();
  }
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported() || !text.trim()) {
      setTimeout(resolve, Math.min(2500, Math.max(700, text.length * 60)));
      return;
    }
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.rate = rate;
      utter.pitch = pitch;

      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ja'));
      if (jaVoice) {
        utter.voice = jaVoice;
      }

      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      // Safety fallback timeout in case browser speechSynthesis stalls without firing onend
      const estMs = Math.max(2500, Math.round((text.length * 140) / Math.max(0.5, rate)) + 2000);
      const fallbackTimer = setTimeout(done, estMs);

      utter.onend = () => {
        clearTimeout(fallbackTimer);
        done();
      };
      utter.onerror = () => {
        clearTimeout(fallbackTimer);
        done();
      };
      window.speechSynthesis.speak(utter);
    } catch {
      resolve();
    }
  });
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}
interface SpeechRecognitionEventLike {
  results: {
    [index: number]: SpeechRecognitionResult;
    length: number;
  };
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

export function listenJapanesePronunciation(
  onTranscript: (transcripts: string[]) => void,
  onError: (message: string) => void,
  onEnd: () => void
): (() => void) | null {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) {
    onError('이 브라우저는 음성 인식을 지원하지 않습니다.');
    onEnd();
    return null;
  }

  try {
    const recognition = new Ctor();
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      const results: string[] = [];
      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        for (let j = 0; j < res.length; j++) {
          if (res[j]?.transcript) {
            results.push(res[j].transcript.trim());
          }
        }
      }
      onTranscript(results);
    };

    recognition.onerror = (err) => {
      if (err.error === 'not-allowed') {
        onError('마이크 권한이 필요합니다.');
      } else if (err.error === 'no-speech') {
        onError('목소리가 들리지 않았어요. 한 번 더 말해 보세요!');
      } else {
        onError('음성 인식을 다시 시도해 주세요.');
      }
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();
    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  } catch {
    onError('음성 인식을 시작할 수 없습니다.');
    onEnd();
    return null;
  }
}

// Gentle Web Audio API game & feedback sound FX
let sharedAudioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new Ctx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function playSfx(kind: 'correct' | 'wrong' | 'levelup' | 'pop', muted = false): void {
  if (muted) return;
  notifySoundAttempt();
  const ctx = getAudioCtx();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (kind === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.11); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (kind === 'wrong') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(175, now + 0.16);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.21);
    } else if (kind === 'levelup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.5, now + 0.3);
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.56);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  } catch {
    // Ignore audio context autoplay errors
  }
}
