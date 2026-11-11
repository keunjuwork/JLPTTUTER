import React from 'react';
import {
  CheckCircle2,
  Clock,
  Heart,
  Layers,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX
} from 'lucide-react';
import { KANJI_PREVIEW } from '../data/curriculumPreviewData';
import {
  ALL_KANA,
  HIRAGANA_BASIC,
  HIRAGANA_DAKUON,
  HIRAGANA_YOON,
  KATAKANA_BASIC
} from '../data/kanaData';
import { getTodayKey, WRONG_REASON_META } from '../lib/storage';
import { playSfx, speakJapanese } from '../lib/speech';
import {
  KanaDropDifficulty,
  KanaItem,
  StudentState,
  StudySubTab,
  WrongNoteEntry,
  WrongReasonTag
} from '../types';

interface GameZoneViewProps {
  state: StudentState;
  onFinishKanaDrop: (
    difficulty: KanaDropDifficulty,
    score: number,
    correctCount: number,
    durationMinutes: number
  ) => void;
  onFinishListeningGame: (score: number, durationMinutes: number) => void;
  onFinishPairMatch: (score: number, durationMinutes: number) => void;
  onRecordAttempt: (
    char: string,
    isCorrect: boolean,
    confusedChar?: string,
    isGameContext?: boolean
  ) => void;
  onRecordWrongNote: (entry: Omit<WrongNoteEntry, 'id' | 'createdAt'>) => string;
  onTagWrongNote: (entryId: string, reasonTag: WrongReasonTag) => void;
  onNavigateToStudy: (subTab?: StudySubTab) => void;
  onNotify: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

type GameMode = 'hub' | 'drop' | 'listening' | 'pair';
type PlayPhase = 'TITLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
type PairDeckMode = 'kana' | 'kanji';

interface FallingTile {
  uid: number;
  item: KanaItem;
  xPercent: number;
  yPercent: number;
  speed: number;
}

interface PairCard {
  uid: string;
  pairId: string;
  side: 'prompt' | 'match';
  text: string;
  subText?: string;
  ttsText?: string;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

const DIFFICULTY_META: Record<
  KanaDropDifficulty,
  {
    label: string;
    badge: string;
    scopeDesc: string;
    speedDesc: string;
    baseSpeed: number;
    speedGain: number;
    accentColor: string;
  }
> = {
  easy: {
    label: '쉬움',
    badge: '초급 추천',
    scopeDesc: '히라가나 기본 글자 (청음)',
    speedDesc: '느린 낙하',
    baseSpeed: 9.5,
    speedGain: 1.5,
    accentColor: '#4CC38A'
  },
  normal: {
    label: '보통',
    badge: '탁음 포함',
    scopeDesc: '히라가나 기본 + 탁음·반탁음',
    speedDesc: '보통 속도',
    baseSpeed: 13.5,
    speedGain: 2.0,
    accentColor: '#6D5DF6'
  },
  hard: {
    label: '어려움',
    badge: '스피드 도전',
    scopeDesc: '요음·가타카나 전체 포함',
    speedDesc: '빠른 낙하',
    baseSpeed: 18,
    speedGain: 2.6,
    accentColor: '#FF6B57'
  }
};

export const GameZoneView: React.FC<GameZoneViewProps> = ({
  state,
  onFinishKanaDrop,
  onFinishListeningGame,
  onFinishPairMatch,
  onRecordAttempt,
  onRecordWrongNote,
  onTagWrongNote,
  onNavigateToStudy,
  onNotify
}) => {
  const [mode, setMode] = React.useState<GameMode>('hub');
  const [muted, setMuted] = React.useState(false);

  const todayKey = getTodayKey();
  const todayGameExp = state.gameExpDate === todayKey ? state.gameExpToday || 0 : 0;
  const dailyGameExpCap = state.missionSettings.dailyGameExpCap ?? 100;
  const isGameExpCapped = todayGameExp >= dailyGameExpCap;

  const [roundMistakes, setRoundMistakes] = React.useState<
    {
      id: string;
      char: string;
      ko: string;
      pickedLabel?: string;
      tag?: WrongReasonTag;
    }[]
  >([]);

  // ==================== KANA DROP GAME ====================
  const [difficulty, setDifficulty] = React.useState<KanaDropDifficulty>('easy');
  const [phase, setPhase] = React.useState<PlayPhase>('TITLE');
  const [score, setScore] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [combo, setCombo] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(state.missionSettings.kanaDropTimeLimits.easy || 90);
  const [endReason, setEndReason] = React.useState<'time' | 'lives'>('time');
  const [resultConfirmed, setResultConfirmed] = React.useState(false);
  const [isNewRecord, setIsNewRecord] = React.useState(false);
  const [activeTile, setActiveTile] = React.useState<FallingTile | null>(null);
  const [choices, setChoices] = React.useState<KanaItem[]>([]);
  const [feedbackText, setFeedbackText] = React.useState<string>('');
  const [romajiTyped, setRomajiTyped] = React.useState('');

  const phaseRef = React.useRef<PlayPhase>('TITLE');
  const tileRef = React.useRef<FallingTile | null>(null);
  const scoreRef = React.useRef(0);
  const correctRef = React.useRef(0);
  const livesRef = React.useRef(3);
  const startTimeRef = React.useRef(Date.now());
  const nextUidRef = React.useRef(1);
  const bestBeforePlayRef = React.useRef(0);

  const totalTimeForDifficulty = React.useMemo(() => {
    const limits = state.missionSettings.kanaDropTimeLimits;
    return Math.max(15, limits?.[difficulty] ?? (difficulty === 'easy' ? 90 : difficulty === 'normal' ? 60 : 45));
  }, [state.missionSettings.kanaDropTimeLimits, difficulty]);

  // Strict learned-only pool per difficulty
  const learnedPoolByDifficulty = React.useMemo(() => {
    const learnedSet = new Set(state.learnedKana);
    const easy = HIRAGANA_BASIC.filter((k) => learnedSet.has(k.char));
    const normal = [...HIRAGANA_BASIC, ...HIRAGANA_DAKUON].filter((k) => learnedSet.has(k.char));
    const hard = [...HIRAGANA_BASIC, ...HIRAGANA_DAKUON, ...HIRAGANA_YOON, ...KATAKANA_BASIC].filter((k) =>
      learnedSet.has(k.char)
    );
    return { easy, normal, hard };
  }, [state.learnedKana]);

  const activePool = learnedPoolByDifficulty[difficulty];
  const canStartDrop = activePool.length >= 4;

  const spawnTile = React.useCallback(
    (currentScore: number, diff: KanaDropDifficulty) => {
      const pool = learnedPoolByDifficulty[diff];
      if (pool.length < 4) return;
      const target = pickRandom(pool);
      const distinctSound = shuffle(pool.filter((p) => p.char !== target.char && p.ko !== target.ko));
      const sameSoundFallback = shuffle(pool.filter((p) => p.char !== target.char && p.ko === target.ko));
      const distractors = [...distinctSound, ...sameSoundFallback].slice(0, 3);
      const opts = shuffle([target, ...distractors]);
      const meta = DIFFICULTY_META[diff];
      const tile: FallingTile = {
        uid: nextUidRef.current++,
        item: target,
        xPercent: 18 + Math.random() * 64,
        yPercent: 4,
        speed: meta.baseSpeed + Math.min(18, Math.floor(currentScore / 220) * meta.speedGain)
      };
      tileRef.current = tile;
      setActiveTile(tile);
      setChoices(opts);
      setRomajiTyped('');
      if (!muted) speakJapanese(target.char, 1.0);
    },
    [learnedPoolByDifficulty, muted]
  );

  const endDropGame = React.useCallback(
    (reason: 'time' | 'lives') => {
      if (phaseRef.current === 'GAME_OVER') return;
      phaseRef.current = 'GAME_OVER';
      setPhase('GAME_OVER');
      setEndReason(reason);
      setResultConfirmed(false);
      tileRef.current = null;
      setActiveTile(null);

      const elapsedSec = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const mins = Math.max(1, Math.round(elapsedSec / 60));
      const finalScore = scoreRef.current;
      const finalCorrect = correctRef.current;
      setIsNewRecord(finalScore > 0 && finalScore > bestBeforePlayRef.current);

      onFinishKanaDrop(difficulty, finalScore, finalCorrect, mins);
      playSfx('levelup', muted);
    },
    [difficulty, muted, onFinishKanaDrop]
  );

  const startDropGame = () => {
    if (!canStartDrop) {
      onNotify('아직 배운 글자가 4자 미만이에요! 학습실에서 글자를 먼저 배워 주세요.', 'warning');
      return;
    }
    scoreRef.current = 0;
    correctRef.current = 0;
    livesRef.current = 3;
    bestBeforePlayRef.current = state.gameRecords.kanaDropBestByDifficulty?.[difficulty] || 0;
    setScore(0);
    setCorrectCount(0);
    setLives(3);
    setCombo(0);
    setTimeLeft(totalTimeForDifficulty);
    setResultConfirmed(false);
    setIsNewRecord(false);
    setFeedbackText('');
    setRoundMistakes([]);
    startTimeRef.current = Date.now();
    phaseRef.current = 'PLAYING';
    setPhase('PLAYING');
    spawnTile(0, difficulty);
  };

  // Countdown timer effect (runs strictly while PLAYING)
  React.useEffect(() => {
    if (mode !== 'drop' || phase !== 'PLAYING') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, phase]);

  React.useEffect(() => {
    if (mode === 'drop' && phase === 'PLAYING' && timeLeft === 0) {
      endDropGame('time');
    }
  }, [mode, phase, timeLeft, endDropGame]);

  // Physics loop for falling tile
  React.useEffect(() => {
    if (mode !== 'drop' || phase !== 'PLAYING') return;
    let rafId = 0;
    let lastTs = performance.now();

    const step = (now: number) => {
      if (phaseRef.current !== 'PLAYING') return;
      const dt = Math.min(0.1, (now - lastTs) / 1000);
      lastTs = now;

      if (tileRef.current) {
        const nextY = tileRef.current.yPercent + tileRef.current.speed * dt;
        if (nextY >= 86) {
          const missedItem = tileRef.current.item;
          playSfx('wrong', muted);
          onRecordAttempt(missedItem.char, false, undefined, true);
          const fallbackPool = shuffle(
            HIRAGANA_BASIC.filter((k) => k.char !== missedItem.char && k.ko !== missedItem.ko)
          ).slice(0, 3);
          const wnOpts = shuffle([missedItem, ...fallbackPool]);
          const wnId = onRecordWrongNote({
            sourceType: 'game',
            level: 'STAGE0',
            title: '가나 낙하 게임',
            prompt: `하늘에서 떨어진 글자 「${missedItem.char}」의 발음은?`,
            options: wnOpts.map((o) => `${o.ko} (${o.romaji})`),
            correctIndex: wnOpts.findIndex((o) => o.char === missedItem.char),
            pickedIndex: -1,
            explanation: `「${missedItem.char}」는 "${missedItem.ko} [${missedItem.romaji}]"예요. ${missedItem.mnemonicTip}`
          });
          setRoundMistakes((prev) => [
            ...prev.filter((m) => m.char !== missedItem.char),
            { id: wnId, char: missedItem.char, ko: missedItem.ko, pickedLabel: '시간 초과' }
          ]);
          setCombo(0);
          setFeedbackText(`놓쳤어요! 「${missedItem.char}」 = ${missedItem.ko}`);
          livesRef.current -= 1;
          setLives(livesRef.current);

          if (livesRef.current <= 0) {
            endDropGame('lives');
            return;
          }
          spawnTile(scoreRef.current, difficulty);
        } else {
          tileRef.current = { ...tileRef.current, yPercent: nextY };
          setActiveTile(tileRef.current);
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [mode, phase, difficulty, muted, onRecordAttempt, onRecordWrongNote, spawnTile, endDropGame]);

  const handleDropChoice = React.useCallback(
    (picked: KanaItem) => {
      if (phaseRef.current !== 'PLAYING' || !tileRef.current) return;
      const current = tileRef.current.item;
      if (picked.ko === current.ko || picked.char === current.char) {
        playSfx('correct', muted);
        onRecordAttempt(current.char, true, undefined, true);
        const nextCombo = combo + 1;
        const diffBonus = difficulty === 'hard' ? 40 : difficulty === 'normal' ? 20 : 0;
        const points = 100 + diffBonus + Math.min(80, nextCombo * 15);
        scoreRef.current += points;
        correctRef.current += 1;
        setScore(scoreRef.current);
        setCorrectCount(correctRef.current);
        setCombo(nextCombo);
        setFeedbackText(`정답! +${points}점 (${nextCombo}콤보)`);
        spawnTile(scoreRef.current, difficulty);
      } else {
        playSfx('wrong', muted);
        onRecordAttempt(current.char, false, picked.char, true);
        const wnOpts = choices.length >= 2 ? choices : [current, picked];
        const wnId = onRecordWrongNote({
          sourceType: 'game',
          level: 'STAGE0',
          title: '가나 낙하 게임',
          prompt: `하늘에서 떨어진 글자 「${current.char}」의 발음은?`,
          options: wnOpts.map((o) => `${o.ko} (${o.romaji})`),
          correctIndex: Math.max(0, wnOpts.findIndex((o) => o.char === current.char)),
          pickedIndex: wnOpts.findIndex((o) => o.char === picked.char),
          explanation: `「${current.char}」는 "${current.ko} [${current.romaji}]"이고, 고른 「${picked.char}」는 "${picked.ko}"예요.`
        });
        setRoundMistakes((prev) => [
          ...prev.filter((m) => m.char !== current.char),
          { id: wnId, char: current.char, ko: current.ko, pickedLabel: picked.ko }
        ]);
        setCombo(0);
        setFeedbackText(`아쉬워요! 「${current.char}」는 「${current.ko}」예요`);
        livesRef.current -= 1;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          endDropGame('lives');
        } else {
          spawnTile(scoreRef.current, difficulty);
        }
      }
    },
    [combo, choices, difficulty, muted, onRecordAttempt, onRecordWrongNote, spawnTile, endDropGame]
  );

  // Keyboard shortcuts (1-4 & Romaji typing) during Kana Drop
  React.useEffect(() => {
    if (mode !== 'drop' || phase !== 'PLAYING') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        const idx = Number(e.key) - 1;
        if (choices[idx]) handleDropChoice(choices[idx]);
      } else if (/^[a-zA-Z]$/.test(e.key) && tileRef.current) {
        const nextTyped = (romajiTyped + e.key.toLowerCase()).slice(-4);
        setRomajiTyped(nextTyped);
        if (nextTyped.endsWith(tileRef.current.item.romaji)) {
          handleDropChoice(tileRef.current.item);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, phase, choices, romajiTyped, handleDropChoice]);

  // ==================== LISTENING KANA MINI-GAME ====================
  const [listenSession, setListenSession] = React.useState<{
    rounds: { target: KanaItem; options: KanaItem[] }[];
    idx: number;
    score: number;
    picked: string | null;
    done: boolean;
  } | null>(null);

  const startListeningGame = () => {
    const basePool =
      state.learnedKana.length >= 4
        ? ALL_KANA.filter((k) => state.learnedKana.includes(k.char))
        : HIRAGANA_BASIC.slice(0, 10);
    const rounds = Array.from({ length: 10 }, () => {
      const target = pickRandom(basePool);
      const others = shuffle(basePool.filter((k) => k.char !== target.char)).slice(0, 3);
      return { target, options: shuffle([target, ...others]) };
    });
    setMode('listening');
    setRoundMistakes([]);
    setListenSession({ rounds, idx: 0, score: 0, picked: null, done: false });
    if (!muted) speakJapanese(rounds[0].target.char, 0.95);
  };

  const handleListenAnswer = (picked: KanaItem) => {
    if (!listenSession || listenSession.picked) return;
    const roundObj = listenSession.rounds[listenSession.idx];
    const target = roundObj.target;
    const ok = picked.char === target.char;
    playSfx(ok ? 'correct' : 'wrong', muted);
    onRecordAttempt(target.char, ok, ok ? undefined : picked.char, true);

    if (!ok) {
      const wnId = onRecordWrongNote({
        sourceType: 'game',
        level: 'STAGE0',
        title: '듣고 글자 고르기',
        prompt: `발음 "${target.ko} [${target.romaji}]"에 맞는 글자는?`,
        options: roundObj.options.map((o) => `${o.char} (${o.ko})`),
        correctIndex: Math.max(0, roundObj.options.findIndex((o) => o.char === target.char)),
        pickedIndex: roundObj.options.findIndex((o) => o.char === picked.char),
        explanation: `정답은 「${target.char}」(${target.ko}), 고른 글자는 「${picked.char}」(${picked.ko})예요.`
      });
      setRoundMistakes((prev) => [
        ...prev.filter((m) => m.char !== target.char),
        { id: wnId, char: target.char, ko: target.ko, pickedLabel: picked.char }
      ]);
    }

    const nextScore = listenSession.score + (ok ? 100 : 0);
    setListenSession({ ...listenSession, picked: picked.char, score: nextScore });

    const isLastRound = listenSession.idx + 1 >= listenSession.rounds.length;
    const nextRoundItem = !isLastRound ? listenSession.rounds[listenSession.idx + 1] : null;

    setTimeout(() => {
      if (isLastRound) {
        onFinishListeningGame(nextScore, 1);
        playSfx('levelup', muted);
        setListenSession((prev) => (prev ? { ...prev, done: true } : null));
      } else {
        if (nextRoundItem && !muted) {
          speakJapanese(nextRoundItem.target.char, 0.95);
        }
        setListenSession((prev) => (prev ? { ...prev, idx: prev.idx + 1, picked: null } : null));
      }
    }, 650);
  };

  // ==================== PAIR MATCHING MINI-GAME ====================
  const [pairDeckMode, setPairDeckMode] = React.useState<PairDeckMode>('kana');
  const [pairSize, setPairSize] = React.useState<6 | 8>(6);
  const [pairSession, setPairSession] = React.useState<{
    cards: PairCard[];
    flippedUids: string[];
    matchedPairIds: string[];
    attempts: number;
    streak: number;
    score: number;
    lockedBoard: boolean;
    done: boolean;
    startedAt: number;
  } | null>(null);

  const startPairMatchGame = (deck = pairDeckMode, size = pairSize) => {
    let cards: PairCard[] = [];
    if (deck === 'kanji') {
      const lvlKanji = KANJI_PREVIEW.filter((k) => k.level === state.targetLevel);
      const source = shuffle(lvlKanji.length >= size ? lvlKanji : KANJI_PREVIEW).slice(0, size);
      cards = source.flatMap((kj) => [
        {
          uid: `p_${kj.id}`,
          pairId: kj.id,
          side: 'prompt' as const,
          text: kj.kanji,
          subText: `${kj.level} 한자`,
          ttsText: kj.kanji
        },
        {
          uid: `m_${kj.id}`,
          pairId: kj.id,
          side: 'match' as const,
          text: kj.meaningKo,
          subText: `음독 ${kj.onyomi}`
        }
      ]);
    } else {
      const learned = ALL_KANA.filter((k) => state.learnedKana.includes(k.char));
      const pool = learned.length >= size ? learned : HIRAGANA_BASIC;
      // Avoid duplicate 'ko' sounds in the same round
      const uniqueByKo: KanaItem[] = [];
      for (const k of shuffle(pool)) {
        if (!uniqueByKo.some((u) => u.ko === k.ko)) {
          uniqueByKo.push(k);
        }
        if (uniqueByKo.length >= size) break;
      }
      cards = uniqueByKo.flatMap((item) => [
        {
          uid: `p_${item.id}`,
          pairId: item.id,
          side: 'prompt' as const,
          text: item.char,
          subText: item.script === 'hiragana' ? '히라가나' : '가타카나',
          ttsText: item.char
        },
        {
          uid: `m_${item.id}`,
          pairId: item.id,
          side: 'match' as const,
          text: item.ko,
          subText: `[${item.romaji}]`
        }
      ]);
    }

    setMode('pair');
    setPairSession({
      cards: shuffle(cards),
      flippedUids: [],
      matchedPairIds: [],
      attempts: 0,
      streak: 0,
      score: 0,
      lockedBoard: false,
      done: false,
      startedAt: Date.now()
    });
  };

  const handlePairCardClick = (card: PairCard) => {
    if (!pairSession || pairSession.lockedBoard || pairSession.done) return;
    if (
      pairSession.flippedUids.includes(card.uid) ||
      pairSession.matchedPairIds.includes(card.pairId)
    ) {
      return;
    }
    if (card.ttsText && !muted) {
      speakJapanese(card.ttsText, 1.0);
    }

    const nextFlipped = [...pairSession.flippedUids, card.uid];
    if (nextFlipped.length < 2) {
      setPairSession({ ...pairSession, flippedUids: nextFlipped });
      return;
    }

    const firstCard = pairSession.cards.find((c) => c.uid === nextFlipped[0]);
    const isMatch = Boolean(firstCard && firstCard.pairId === card.pairId && firstCard.side !== card.side);
    const nextAttempts = pairSession.attempts + 1;

    if (isMatch) {
      playSfx('correct', muted);
      const nextMatched = [...pairSession.matchedPairIds, card.pairId];
      const nextStreak = pairSession.streak + 1;
      const gain = 120 + nextStreak * 20;
      const totalPairs = pairSession.cards.length / 2;
      const completedAll = nextMatched.length >= totalPairs;
      const elapsedSec = Math.max(5, Math.round((Date.now() - pairSession.startedAt) / 1000));
      const timeBonus = completedAll ? Math.max(0, 300 - elapsedSec * 3) : 0;
      const nextScore = pairSession.score + gain + timeBonus;

      setPairSession({
        ...pairSession,
        flippedUids: [],
        matchedPairIds: nextMatched,
        attempts: nextAttempts,
        streak: nextStreak,
        score: nextScore,
        done: completedAll
      });

      if (completedAll) {
        playSfx('levelup', muted);
        onFinishPairMatch(nextScore, Math.max(1, Math.round(elapsedSec / 60)));
      }
    } else {
      playSfx('wrong', muted);
      setPairSession({
        ...pairSession,
        flippedUids: nextFlipped,
        attempts: nextAttempts,
        streak: 0,
        lockedBoard: true
      });
      setTimeout(() => {
        setPairSession((prev) =>
          prev
            ? {
                ...prev,
                flippedUids: [],
                lockedBoard: false
              }
            : null
        );
      }, 720);
    }
  };

  const timerPct = Math.max(0, Math.min(100, Math.round((timeLeft / totalTimeForDifficulty) * 100)));
  const isDangerTime = timeLeft <= 10;

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Hub Selector */}
      {mode === 'hub' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-[#2B2340]">🎮 게임존</h1>
              <p className="text-sm text-[#2B2340]/70 mt-1">
                게임을 즐기며 일본어 반응 속도를 키워요! 점수와 정확도는 내 기록·관리자 대시보드·코인 상점에 반영돼요.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`px-4 py-2 rounded-full border-2 text-xs font-extrabold tabular-nums ${
                  isGameExpCapped
                    ? 'bg-[#FFF3CC] border-[#FFD166] text-[#7A4F01]'
                    : 'bg-white border-[#FFE1C2] text-[#2B2340]'
                }`}
              >
                오늘 게임 EXP {todayGameExp} / {dailyGameExpCap} EXP
              </div>
              <div className="px-4 py-2 rounded-full bg-white border-2 border-[#FFE1C2] text-xs font-extrabold text-[#2B2340] tabular-nums">
                현재 배운 가나 {state.learnedKana.length} / 127자
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Game 1: Kana Drop */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#6D5DF6] to-[#5746DC] text-white p-6 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-jp text-5xl font-extrabold">ぽ</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-bold">
                    쉬움·보통·어려움
                  </span>
                </div>
                <h2 className="text-xl font-extrabold mt-4">가나 낙하 게임</h2>
                <p className="text-xs text-white/85 mt-1.5 leading-relaxed">
                  난이도별 제한시간 안에 내가 배운 글자만 하늘에서 내려와요! (키보드 1~4 또는 로마자 지원)
                </p>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1.5 text-center bg-white/15 rounded-xl p-2 text-[11px] font-bold tabular-nums">
                  <div>
                    <div className="text-white/75">쉬움</div>
                    <div>{(state.gameRecords.kanaDropBestByDifficulty?.easy || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-white/75">보통</div>
                    <div>{(state.gameRecords.kanaDropBestByDifficulty?.normal || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-white/75">어려움</div>
                    <div>{(state.gameRecords.kanaDropBestByDifficulty?.hard || 0).toLocaleString()}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('drop');
                    phaseRef.current = 'TITLE';
                    setPhase('TITLE');
                  }}
                  className="w-full py-3 rounded-2xl bg-white text-[#5746DC] text-sm font-extrabold hover:bg-[#FFF7EC] cursor-pointer"
                >
                  난이도 고르고 시작
                </button>
              </div>
            </div>

            {/* Game 2: Listening */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#00A8E8] to-[#008EC9] text-white p-6 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="text-5xl font-extrabold">♪</div>
                <h2 className="text-xl font-extrabold mt-4">듣고 글자 고르기</h2>
                <p className="text-xs text-white/85 mt-1.5 leading-relaxed">
                  원어민 발음을 듣고 4개의 카드 중에서 알맞은 가나를 빠르게 찾아내는 청음 훈련 게임이에요!
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-white/90 tabular-nums">
                  🏆 최고 기록 {state.gameRecords.listeningBest.toLocaleString()}점
                </div>
                <button
                  type="button"
                  onClick={startListeningGame}
                  className="w-full py-3 rounded-2xl bg-white text-[#008EC9] text-sm font-extrabold hover:bg-[#FFF7EC] cursor-pointer"
                >
                  듣기 퀴즈 10판 도전
                </button>
              </div>
            </div>

            {/* Game 3: Pair Match (Unlocked!) */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#FF6B57] to-[#F0533F] text-white p-6 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <Layers className="w-11 h-11 text-[#FFD166]" />
                  <span className="px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-bold">
                    가나 · N5+ 한자
                  </span>
                </div>
                <h2 className="text-xl font-extrabold mt-4">카드 짝맞추기 게임</h2>
                <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
                  뒤집힌 카드 속에서 「글자 ↔ 발음」 또는 「한자 ↔ 뜻·음독」 짝을 빠르게 맞춰 보세요!
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-white/90 tabular-nums">
                  🏆 최고 기록 {state.gameRecords.pairMatchBest.toLocaleString()}점
                </div>
                <button
                  type="button"
                  onClick={() => startPairMatchGame(pairDeckMode, pairSize)}
                  className="w-full py-3 rounded-2xl bg-white text-[#FF6B57] text-sm font-extrabold hover:bg-[#FFF7EC] cursor-pointer"
                >
                  짝맞추기 시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KANA DROP GAME ARENA */}
      {mode === 'drop' && (
        <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-5 sm:p-6 space-y-5">
          {/* Top HUD */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  phaseRef.current = 'TITLE';
                  setPhase('TITLE');
                  setMode('hub');
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
              >
                ← 게임존으로
              </button>
              <h2 className="text-lg font-extrabold text-[#2B2340]">
                가나 낙하 게임 · {DIFFICULTY_META[difficulty].label}
              </h2>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 tabular-nums">
              <div className="flex items-center gap-1" aria-label={`남은 목숨 ${lives}개`}>
                {[1, 2, 3].map((h) => (
                  <Heart
                    key={h}
                    className={`w-5 h-5 ${h <= lives ? 'text-[#FF6B57] fill-[#FF6B57]' : 'text-[#E8E3EF]'}`}
                  />
                ))}
              </div>
              <div className="px-3 py-1 rounded-full bg-[#2B2340] text-white text-xs font-extrabold">
                점수 {score.toLocaleString()} · 정답 {correctCount}
              </div>
              {combo > 1 && (
                <div className="px-3 py-1 rounded-full bg-[#FFD166] text-[#2B2340] text-xs font-extrabold">
                  {combo} 콤보!
                </div>
              )}
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="w-9 h-9 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] flex items-center justify-center text-[#2B2340] cursor-pointer"
                aria-label="소리 끄기/켜기"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              {phase === 'PLAYING' && (
                <button
                  type="button"
                  onClick={() => {
                    phaseRef.current = 'PAUSED';
                    setPhase('PAUSED');
                  }}
                  className="w-9 h-9 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] flex items-center justify-center text-[#2B2340] cursor-pointer"
                  aria-label="일시정지"
                >
                  <Pause className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* TITLE SCREEN WITH 3-DIFFICULTY SELECTOR & LEARNED-ONLY GUARD */}
          {phase === 'TITLE' && (
            <div className="rounded-[24px] bg-[#FFF7EC] border-2 border-[#FFE1C2] p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="font-jp text-5xl font-extrabold text-[#6D5DF6]">ぽ</div>
                <h3 className="text-xl font-extrabold text-[#2B2340]">난이도를 선택해 주세요!</h3>
                <p className="text-xs font-medium text-[#2B2340]/75">
                  아직 배우지 않은 글자는 절대 출제되지 않아요. PC에서는 숫자키 1~4 또는 로마자 입력도 지원해요!
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3.5">
                {(['easy', 'normal', 'hard'] as KanaDropDifficulty[]).map((lvl) => {
                  const meta = DIFFICULTY_META[lvl];
                  const sec = state.missionSettings.kanaDropTimeLimits?.[lvl] || 60;
                  const learnedCnt = learnedPoolByDifficulty[lvl].length;
                  const best = state.gameRecords.kanaDropBestByDifficulty?.[lvl] || 0;
                  const isSel = difficulty === lvl;
                  const ready = learnedCnt >= 4;

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`text-left rounded-[22px] border-[3px] p-4 transition-all cursor-pointer space-y-2.5 ${
                        isSel
                          ? 'bg-white border-[#FF6B57] shadow-md scale-[1.01]'
                          : 'bg-white/75 border-[#FFE1C2] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-extrabold text-[#2B2340]">{meta.label}</span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-white tabular-nums"
                          style={{ backgroundColor: meta.accentColor }}
                        >
                          {sec}초
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#2B2340]/75 space-y-0.5">
                        <div>• {meta.speedDesc}</div>
                        <div>• {meta.scopeDesc}</div>
                      </div>
                      <div className="pt-2 border-t border-[#FFE1C2] flex items-center justify-between text-[11px] font-extrabold tabular-nums">
                        <span className={ready ? 'text-[#4CC38A]' : 'text-[#FF6B57]'}>
                          배운 글자 {learnedCnt}자
                        </span>
                        <span className="text-[#2B2340]/70">최고 {best.toLocaleString()}점</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Learned pool warning or Start CTA */}
              {!canStartDrop ? (
                <div className="rounded-2xl bg-white border-2 border-[#FF6B57]/40 p-5 text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#FF6B57]">
                    <Lock className="w-4 h-4" />
                    <span>
                      「{DIFFICULTY_META[difficulty].label}」 범위에서 배운 글자가 아직 {activePool.length}자예요!
                    </span>
                  </div>
                  <p className="text-xs text-[#2B2340]/75">
                    아직 배우지 않은 글자는 출제되지 않기 때문에, 최소 4글자 이상 「외웠어요」 체크 후 시작할 수 있어요.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateToStudy('kana')}
                    className="px-6 py-2.5 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-xs font-extrabold cursor-pointer"
                  >
                    학습실에서 가나 배우러 가기 →
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={startDropGame}
                    className="px-9 py-3.5 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-base font-extrabold cursor-pointer shadow-sm"
                  >
                    {DIFFICULTY_META[difficulty].label} ({totalTimeForDifficulty}초) 시작하기
                  </button>
                  <div className="text-[11px] font-bold text-[#2B2340]/60 tabular-nums">
                    출제 후보: 내가 외운 {activePool.length}글자에서만 출제됨
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PLAYING / PAUSED ARENA WITH TOP COUNTDOWN BAR */}
          {(phase === 'PLAYING' || phase === 'PAUSED') && (
            <div className="space-y-4">
              {/* Top Remaining Time Countdown Bar */}
              <div
                className={`rounded-2xl border-2 px-4 py-2.5 transition-colors ${
                  isDangerTime
                    ? 'bg-[#FF6B57]/12 border-[#FF6B57] animate-pulse'
                    : 'bg-[#FFF7EC] border-[#FFE1C2]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-extrabold mb-1.5 tabular-nums">
                  <span className={`inline-flex items-center gap-1.5 ${isDangerTime ? 'text-[#FF6B57]' : 'text-[#2B2340]'}`}>
                    <Clock className="w-4 h-4" />
                    <span>
                      {isDangerTime ? '⚠️ 마감 임박! 남은 시간' : '남은 제한시간'}
                    </span>
                  </span>
                  <span className={`text-sm font-num ${isDangerTime ? 'text-[#FF6B57]' : 'text-[#2B2340]'}`}>
                    {timeLeft}초 / {totalTimeForDifficulty}초
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white border border-[#FFE1C2] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDangerTime ? 'bg-[#FF6B57]' : 'bg-[#4CC38A]'
                    }`}
                    style={{ width: `${timerPct}%` }}
                  />
                </div>
              </div>

              {/* Falling Sky Arena */}
              <div className="relative h-[300px] sm:h-[340px] rounded-[24px] border-[3px] border-[#2B2340] bg-gradient-to-b from-[#EEF4FF] via-[#FFF9F0] to-[#FFE8D1] overflow-hidden">
                {activeTile && (
                  <div
                    className="absolute -translate-x-1/2 w-20 h-20 rounded-2xl bg-white border-[3px] border-[#6D5DF6] shadow-md flex items-center justify-center font-jp text-4xl font-extrabold text-[#2B2340] transition-none"
                    style={{
                      left: `${activeTile.xPercent}%`,
                      top: `${activeTile.yPercent}%`
                    }}
                  >
                    {activeTile.item.char}
                  </div>
                )}

                {feedbackText && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#2B2340]/85 text-white text-xs font-bold whitespace-nowrap">
                    {feedbackText}
                  </div>
                )}

                {/* Ground Danger Line */}
                <div className="absolute inset-x-0 bottom-4 border-t-2 border-dashed border-[#FF6B57]/60 flex justify-center">
                  <span className="-mt-2.5 px-2 bg-[#FFE8D1] text-[10px] font-extrabold text-[#FF6B57]">
                    바닥에 닿기 전에 맞히세요!
                  </span>
                </div>

                {phase === 'PAUSED' && (
                  <div className="absolute inset-0 bg-[#2B2340]/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 text-white">
                    <div className="text-xl font-extrabold">일시 정지</div>
                    <button
                      type="button"
                      onClick={() => {
                        phaseRef.current = 'PLAYING';
                        setPhase('PLAYING');
                      }}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#4CC38A] text-white text-sm font-extrabold cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>계속하기</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4 Answer Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {choices.map((opt, idx) => (
                  <button
                    key={`${opt.id}_${idx}`}
                    type="button"
                    onClick={() => handleDropChoice(opt)}
                    className="py-4 px-3 rounded-2xl bg-[#FFF7EC] hover:bg-[#FF6B57] hover:text-white border-2 border-[#FFE1C2] text-[#2B2340] transition-colors cursor-pointer flex flex-col items-center justify-center"
                  >
                    <span className="text-xl font-extrabold">{opt.ko}</span>
                    <span className="text-xs font-num opacity-70">
                      [{opt.romaji}] · 키 {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME OVER SCREEN WITH RESULT CONFIRMATION LOCK */}
          {phase === 'GAME_OVER' && (
            <div className="rounded-[24px] bg-[#FFF7EC] border-2 border-[#FFE1C2] p-6 sm:p-8 text-center max-w-lg mx-auto space-y-5">
              <div className="space-y-1">
                <Trophy className="w-12 h-12 text-[#FFD166] mx-auto" />
                <div className="text-xs font-extrabold text-[#FF6B57]">
                  {endReason === 'time' ? '⏰ 제한시간 0초 종료!' : '💔 목숨 소진 종료'} · {DIFFICULTY_META[difficulty].label} 난이도
                </div>
                <h3 className="text-2xl font-extrabold text-[#2B2340]">게임 결과 리포트</h3>
                {isNewRecord && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFD166] text-[#2B2340] text-xs font-extrabold mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>신기록 달성!</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div className="bg-white rounded-2xl border-2 border-[#FFE1C2] p-4">
                  <div className="text-xs font-bold text-[#2B2340]/60">이번 점수</div>
                  <div className="text-2xl font-num font-extrabold text-[#FF6B57] mt-1">
                    {score.toLocaleString()}점
                  </div>
                </div>
                <div className="bg-white rounded-2xl border-2 border-[#FFE1C2] p-4">
                  <div className="text-xs font-bold text-[#2B2340]/60">정답 수</div>
                  <div className="text-2xl font-num font-extrabold text-[#4CC38A] mt-1">
                    {correctCount}문제
                  </div>
                </div>
              </div>

              {/* Per-difficulty Best Records */}
              <div className="bg-white rounded-2xl border-2 border-[#FFE1C2] p-4 space-y-2.5 text-left">
                <div className="text-xs font-extrabold text-[#2B2340]/70">난이도별 최고 기록</div>
                <div className="grid grid-cols-3 gap-2 text-center tabular-nums">
                  {(['easy', 'normal', 'hard'] as KanaDropDifficulty[]).map((lvl) => {
                    const bestVal = Math.max(
                      state.gameRecords.kanaDropBestByDifficulty?.[lvl] || 0,
                      lvl === difficulty ? score : 0
                    );
                    return (
                      <div
                        key={lvl}
                        className={`rounded-xl p-2.5 border ${
                          lvl === difficulty
                            ? 'bg-[#FFF7EC] border-[#FF6B57]'
                            : 'bg-[#FFFDF9] border-[#FFE1C2]'
                        }`}
                      >
                        <div className="text-[11px] font-bold text-[#2B2340]/65">
                          {DIFFICULTY_META[lvl].label}
                        </div>
                        <div className="text-sm font-num font-extrabold text-[#2B2340] mt-0.5">
                          {bestVal.toLocaleString()}점
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Game EXP Cap Notice */}
              <div
                className={`rounded-2xl border-2 px-4 py-3 text-xs font-bold leading-relaxed ${
                  isGameExpCapped
                    ? 'bg-[#FFF3CC] border-[#FFD166] text-[#7A4F01]'
                    : 'bg-white border-[#FFE1C2] text-[#2B2340]/75'
                }`}
              >
                {isGameExpCapped
                  ? `오늘 게임 EXP 상한(${dailyGameExpCap} EXP)에 도달했어요! 점수 도전과 연습 게임은 계속할 수 있지만 오늘 게임 EXP는 더 오르지 않아요.`
                  : `오늘 획득한 게임 EXP: ${todayGameExp} / ${dailyGameExpCap} EXP`}
              </div>

              {/* Optional Wrong Reason Tagging for Mistakes */}
              {roundMistakes.length > 0 && (
                <div className="bg-white rounded-2xl border-2 border-[#FFE1C2] p-4 space-y-2.5 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#2B2340]">
                      틀린 글자 이유 남기기 ({roundMistakes.length}개 · 선택)
                    </span>
                    <span className="text-[11px] font-bold text-[#2B2340]/55">안 골라도 넘어갈 수 있어요</span>
                  </div>
                  <div className="space-y-2">
                    {roundMistakes.slice(0, 5).map((m) => (
                      <div key={m.id} className="rounded-xl bg-[#FFF7EC] border border-[#FFE1C2] p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-extrabold text-[#2B2340]">
                          <span>
                            <span className="font-jp text-base mr-1.5">{m.char}</span> ({m.ko})
                          </span>
                          <span className="text-[11px] font-bold text-[#FF6B57]">
                            {m.pickedLabel ? `선택: ${m.pickedLabel}` : ''}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((tagKey) => {
                            const meta = WRONG_REASON_META[tagKey];
                            const selected = m.tag === tagKey;
                            return (
                              <button
                                key={tagKey}
                                type="button"
                                onClick={() => {
                                  onTagWrongNote(m.id, tagKey);
                                  setRoundMistakes((prev) =>
                                    prev.map((item) => (item.id === m.id ? { ...item, tag: tagKey } : item))
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border transition-colors cursor-pointer ${
                                  selected
                                    ? 'bg-[#2B2340] border-[#2B2340] text-white'
                                    : 'bg-white border-[#FFE1C2] text-[#2B2340]/80 hover:border-[#FF6B57]'
                                }`}
                              >
                                {meta.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explicit Confirmation Gate */}
              {!resultConfirmed ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#2B2340]/70">
                    점수와 최고 기록을 확인한 뒤 아래 버튼을 눌러야 다시 시작할 수 있어요!
                  </p>
                  <button
                    type="button"
                    onClick={() => setResultConfirmed(true)}
                    className="w-full py-3.5 rounded-full bg-[#4CC38A] hover:bg-[#3cb37a] text-white text-sm font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>결과 확인했어요</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={startDropGame}
                    className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>다시 도전하기</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      phaseRef.current = 'TITLE';
                      setPhase('TITLE');
                    }}
                    className="px-5 py-3 rounded-full bg-white border-2 border-[#FFE1C2] hover:bg-[#FFFDF9] text-sm font-bold text-[#2B2340] cursor-pointer"
                  >
                    난이도 다시 고르기
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('hub')}
                    className="px-5 py-3 rounded-full bg-white border-2 border-[#FFE1C2] text-sm font-bold text-[#2B2340] cursor-pointer"
                  >
                    나가기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LISTENING KANA MINI-GAME */}
      {mode === 'listening' && listenSession && (
        <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-8 max-w-xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMode('hub')}
              className="px-3.5 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
            >
              ← 게임존으로
            </button>
            <span className="text-xs font-extrabold text-[#2B2340]/65 tabular-nums">
              {listenSession.idx + 1} / {listenSession.rounds.length} · 점수 {listenSession.score}
            </span>
          </div>

          {listenSession.done ? (
            <div className="space-y-4 py-4">
              <div className="text-4xl">🎧</div>
              <h2 className="text-2xl font-extrabold text-[#2B2340]">듣고 글자 고르기 완료!</h2>
              <div className="text-3xl font-num font-extrabold text-[#00A8E8]">{listenSession.score}점</div>
              <div
                className={`rounded-2xl border-2 px-4 py-3 text-xs font-bold ${
                  isGameExpCapped
                    ? 'bg-[#FFF3CC] border-[#FFD166] text-[#7A4F01]'
                    : 'bg-[#FFF7EC] border-[#FFE1C2] text-[#2B2340]/75'
                }`}
              >
                {isGameExpCapped
                  ? `오늘 게임 EXP 상한(${dailyGameExpCap} EXP)에 도달했어요! 점수 도전과 연습 게임은 계속할 수 있지만 오늘 게임 EXP는 더 오르지 않아요.`
                  : `오늘 획득한 게임 EXP: ${todayGameExp} / ${dailyGameExpCap} EXP`}
              </div>
              {roundMistakes.length > 0 && (
                <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#FFE1C2] p-4 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#2B2340]">
                    <span>틀린 문제 이유 남기기 (선택)</span>
                    <span className="text-[11px] font-bold text-[#2B2340]/55">건너뛰기 가능</span>
                  </div>
                  {roundMistakes.slice(0, 5).map((m) => (
                    <div key={m.id} className="rounded-xl bg-[#FFF7EC] border border-[#FFE1C2] p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-extrabold text-[#2B2340]">
                        <span>
                          <span className="font-jp text-base mr-1">{m.char}</span> ({m.ko})
                        </span>
                        {m.pickedLabel && (
                          <span className="text-[11px] font-bold text-[#FF6B57]">내 선택: {m.pickedLabel}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((tagKey) => {
                          const meta = WRONG_REASON_META[tagKey];
                          const selected = m.tag === tagKey;
                          return (
                            <button
                              key={tagKey}
                              type="button"
                              onClick={() => {
                                onTagWrongNote(m.id, tagKey);
                                setRoundMistakes((prev) =>
                                  prev.map((item) => (item.id === m.id ? { ...item, tag: tagKey } : item))
                                );
                              }}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer ${
                                selected
                                  ? 'bg-[#2B2340] border-[#2B2340] text-white'
                                  : 'bg-white border-[#FFE1C2] text-[#2B2340]/80 hover:border-[#FF6B57]'
                              }`}
                            >
                              {meta.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={startListeningGame}
                  className="px-6 py-3 rounded-full bg-[#00A8E8] text-white text-sm font-extrabold cursor-pointer"
                >
                  한 판 더 하기
                </button>
                <button
                  type="button"
                  onClick={() => setMode('hub')}
                  className="px-5 py-3 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-sm font-bold text-[#2B2340] cursor-pointer"
                >
                  게임존으로
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 py-2">
                <p className="text-sm font-bold text-[#2B2340]/75">들리는 소리에 알맞은 글자를 고르세요</p>
                <button
                  type="button"
                  onClick={() => speakJapanese(listenSession.rounds[listenSession.idx].target.char, 0.9)}
                  className="w-20 h-20 rounded-full bg-[#00A8E8] hover:bg-[#0094cc] text-white mx-auto flex items-center justify-center shadow-md cursor-pointer"
                  aria-label="발음 다시 듣기"
                >
                  <Volume2 className="w-9 h-9" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {listenSession.rounds[listenSession.idx].options.map((opt) => {
                  const target = listenSession.rounds[listenSession.idx].target;
                  const picked = listenSession.picked === opt.char;
                  const right = opt.char === target.char;
                  let cls = 'bg-[#FFF7EC] border-2 border-[#FFE1C2] text-[#2B2340] hover:border-[#00A8E8]';
                  if (listenSession.picked) {
                    if (right) cls = 'bg-[#4CC38A] border-[#4CC38A] text-white';
                    else if (picked) cls = 'bg-[#FF6B57] border-[#FF6B57] text-white';
                  }
                  return (
                    <button
                      key={opt.id + opt.char}
                      type="button"
                      disabled={Boolean(listenSession.picked)}
                      onClick={() => handleListenAnswer(opt)}
                      className={`py-6 rounded-2xl font-jp text-4xl font-extrabold cursor-pointer transition-colors ${cls}`}
                    >
                      {opt.char}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* PAIR MATCHING MINI-GAME */}
      {mode === 'pair' && pairSession && (
        <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-5 sm:p-7 max-w-4xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('hub')}
                className="px-3.5 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
              >
                ← 게임존으로
              </button>
              <h2 className="text-lg font-extrabold text-[#2B2340]">카드 짝맞추기 게임</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPairDeckMode('kana');
                  startPairMatchGame('kana', pairSize);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                  pairDeckMode === 'kana' ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
                }`}
              >
                가나 ↔ 발음
              </button>
              <button
                type="button"
                onClick={() => {
                  setPairDeckMode('kanji');
                  startPairMatchGame('kanji', pairSize);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                  pairDeckMode === 'kanji' ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
                }`}
              >
                한자 ↔ 뜻·음독
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextSize = pairSize === 6 ? 8 : 6;
                  setPairSize(nextSize);
                  startPairMatchGame(pairDeckMode, nextSize);
                }}
                className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
              >
                {pairSize}쌍 ({pairSize * 2}장)
              </button>
              <span className="px-3 py-1.5 rounded-full bg-[#2B2340] text-white text-xs font-extrabold tabular-nums">
                점수 {pairSession.score.toLocaleString()} · 시도 {pairSession.attempts}
              </span>
            </div>
          </div>

          {pairSession.done ? (
            <div className="rounded-[24px] bg-[#FFF7EC] border-2 border-[#FFE1C2] p-8 text-center space-y-4">
              <Trophy className="w-12 h-12 text-[#FFD166] mx-auto" />
              <h3 className="text-2xl font-extrabold text-[#2B2340]">모든 짝맞추기 성공!</h3>
              <div className="text-3xl font-num font-extrabold text-[#FF6B57]">
                {pairSession.score.toLocaleString()}점
              </div>
              <p className="text-xs font-bold text-[#2B2340]/70 tabular-nums">
                총 {pairSession.attempts}번 시도로 {pairSession.cards.length / 2}쌍 완료!
              </p>
              <div
                className={`rounded-2xl border-2 px-4 py-3 text-xs font-bold max-w-md mx-auto ${
                  isGameExpCapped
                    ? 'bg-[#FFF3CC] border-[#FFD166] text-[#7A4F01]'
                    : 'bg-white border-[#FFE1C2] text-[#2B2340]/75'
                }`}
              >
                {isGameExpCapped
                  ? `오늘 게임 EXP 상한(${dailyGameExpCap} EXP)에 도달했어요! 점수 도전과 연습 게임은 계속할 수 있지만 오늘 게임 EXP는 더 오르지 않아요.`
                  : `오늘 획득한 게임 EXP: ${todayGameExp} / ${dailyGameExpCap} EXP`}
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startPairMatchGame(pairDeckMode, pairSize)}
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#FF6B57] text-white text-sm font-extrabold cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>새 판 시작하기</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('hub')}
                  className="px-5 py-3 rounded-full bg-white border-2 border-[#FFE1C2] text-sm font-bold text-[#2B2340] cursor-pointer"
                >
                  게임존으로
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {pairSession.cards.map((card) => {
                const isMatched = pairSession.matchedPairIds.includes(card.pairId);
                const isFlipped = pairSession.flippedUids.includes(card.uid) || isMatched;
                return (
                  <button
                    key={card.uid}
                    type="button"
                    onClick={() => handlePairCardClick(card)}
                    disabled={isMatched}
                    className={`h-24 sm:h-28 rounded-2xl border-[3px] p-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                      isMatched
                        ? 'bg-[#4CC38A]/15 border-[#4CC38A] text-[#1f7d52]'
                        : isFlipped
                          ? 'bg-white border-[#FF6B57] text-[#2B2340] shadow-sm scale-[1.02]'
                          : 'bg-[#FFF7EC] border-[#FFE1C2] hover:border-[#FFB09E] text-[#2B2340]/45'
                    }`}
                  >
                    {isFlipped ? (
                      <>
                        <span
                          className={`font-extrabold leading-tight ${
                            card.side === 'prompt' ? 'font-jp text-3xl sm:text-4xl' : 'text-sm sm:text-base'
                          }`}
                        >
                          {card.text}
                        </span>
                        {card.subText && (
                          <span className="text-[11px] font-bold opacity-70 mt-1">{card.subText}</span>
                        )}
                      </>
                    ) : (
                      <span className="font-jp text-2xl font-extrabold text-[#FF6B57]/40">?</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
