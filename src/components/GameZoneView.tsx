import React from 'react';
import { Heart, Lock, Pause, Play, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';
import { ALL_KANA, HIRAGANA_BASIC, KATAKANA_BASIC } from '../data/kanaData';
import { playSfx, speakJapanese } from '../lib/speech';
import { KanaItem, StudentState } from '../types';

interface GameZoneViewProps {
  state: StudentState;
  onFinishKanaDrop: (score: number, durationMinutes: number) => void;
  onFinishListeningGame: (score: number, durationMinutes: number) => void;
  onRecordAttempt: (char: string, isCorrect: boolean, confusedChar?: string) => void;
  onNotify: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

type GameMode = 'hub' | 'drop' | 'listening';
type DropScope = 'learned' | 'hiragana' | 'katakana' | 'confusing';
type PlayPhase = 'TITLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

interface FallingTile {
  uid: number;
  item: KanaItem;
  xPercent: number;
  yPercent: number;
  speed: number;
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

export const GameZoneView: React.FC<GameZoneViewProps> = ({
  state,
  onFinishKanaDrop,
  onFinishListeningGame,
  onRecordAttempt,
  onNotify
}) => {
  const [mode, setMode] = React.useState<GameMode>('hub');
  const [muted, setMuted] = React.useState(false);

  // ==================== KANA DROP GAME ====================
  const [scope, setScope] = React.useState<DropScope>('hiragana');
  const [phase, setPhase] = React.useState<PlayPhase>('TITLE');
  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [combo, setCombo] = React.useState(0);
  const [activeTile, setActiveTile] = React.useState<FallingTile | null>(null);
  const [choices, setChoices] = React.useState<KanaItem[]>([]);
  const [feedbackText, setFeedbackText] = React.useState<string>('');
  const [romajiTyped, setRomajiTyped] = React.useState('');

  const phaseRef = React.useRef<PlayPhase>('TITLE');
  const tileRef = React.useRef<FallingTile | null>(null);
  const scoreRef = React.useRef(0);
  const livesRef = React.useRef(3);
  const startTimeRef = React.useRef(Date.now());
  const nextUidRef = React.useRef(1);

  const pool = React.useMemo(() => {
    if (scope === 'katakana') return KATAKANA_BASIC;
    if (scope === 'confusing') {
      const targetChars = ['さ', 'き', 'ぬ', 'め', 'わ', 'ね', 'れ', 'は', 'ほ', 'る', 'ろ', 'シ', 'ツ', 'ソ', 'ン'];
      return ALL_KANA.filter((k) => targetChars.includes(k.char));
    }
    if (scope === 'learned') {
      const matched = ALL_KANA.filter((k) => state.learnedKana.includes(k.char));
      return matched.length >= 5 ? matched : HIRAGANA_BASIC.slice(0, 10);
    }
    return HIRAGANA_BASIC;
  }, [scope, state.learnedKana]);

  const spawnTile = React.useCallback(
    (currentScore: number) => {
      const target = pickRandom(pool);
      const distractors = shuffle(pool.filter((p) => p.ko !== target.ko)).slice(0, 3);
      const opts = shuffle([target, ...distractors]);
      const tile: FallingTile = {
        uid: nextUidRef.current++,
        item: target,
        xPercent: 18 + Math.random() * 64,
        yPercent: 4,
        speed: 13 + Math.min(20, Math.floor(currentScore / 180) * 2.2)
      };
      tileRef.current = tile;
      setActiveTile(tile);
      setChoices(opts);
      setRomajiTyped('');
      if (!muted) speakJapanese(target.char, 1.0);
    },
    [pool, muted]
  );

  const startDropGame = () => {
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    setCombo(0);
    setFeedbackText('');
    startTimeRef.current = Date.now();
    phaseRef.current = 'PLAYING';
    setPhase('PLAYING');
    spawnTile(0);
  };

  const endDropGame = React.useCallback(() => {
    if (phaseRef.current === 'GAME_OVER') return;
    phaseRef.current = 'GAME_OVER';
    setPhase('GAME_OVER');
    tileRef.current = null;
    setActiveTile(null);
    const mins = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    onFinishKanaDrop(scoreRef.current, mins);
    playSfx('levelup', muted);
  }, [muted, onFinishKanaDrop]);

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
          // Missed tile!
          const missedItem = tileRef.current.item;
          playSfx('wrong', muted);
          onRecordAttempt(missedItem.char, false);
          setCombo(0);
          setFeedbackText(`놓쳤어요! 「${missedItem.char}」 = ${missedItem.ko}`);
          livesRef.current -= 1;
          setLives(livesRef.current);

          if (livesRef.current <= 0) {
            endDropGame();
            return;
          }
          spawnTile(scoreRef.current);
        } else {
          tileRef.current = { ...tileRef.current, yPercent: nextY };
          setActiveTile(tileRef.current);
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [mode, phase, muted, onRecordAttempt, spawnTile, endDropGame]);

  const handleDropChoice = React.useCallback(
    (picked: KanaItem) => {
      if (phaseRef.current !== 'PLAYING' || !tileRef.current) return;
      const current = tileRef.current.item;
      if (picked.ko === current.ko || picked.char === current.char) {
        playSfx('correct', muted);
        onRecordAttempt(current.char, true);
        const nextCombo = combo + 1;
        const points = 100 + Math.min(80, nextCombo * 15);
        scoreRef.current += points;
        setScore(scoreRef.current);
        setCombo(nextCombo);
        setFeedbackText(`정답! +${points}점 (${nextCombo}콤보)`);
        spawnTile(scoreRef.current);
      } else {
        playSfx('wrong', muted);
        onRecordAttempt(current.char, false, picked.char);
        setCombo(0);
        setFeedbackText(`아쉬워요! 「${current.char}」는 「${current.ko}」예요`);
        livesRef.current -= 1;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          endDropGame();
        } else {
          spawnTile(scoreRef.current);
        }
      }
    },
    [combo, muted, onRecordAttempt, spawnTile, endDropGame]
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
    const basePool = state.learnedKana.length >= 6
      ? ALL_KANA.filter((k) => state.learnedKana.includes(k.char))
      : HIRAGANA_BASIC.slice(0, 15);
    const rounds = Array.from({ length: 10 }, () => {
      const target = pickRandom(basePool);
      const others = shuffle(HIRAGANA_BASIC.filter((k) => k.char !== target.char)).slice(0, 3);
      return { target, options: shuffle([target, ...others]) };
    });
    setMode('listening');
    setListenSession({ rounds, idx: 0, score: 0, picked: null, done: false });
    speakJapanese(rounds[0].target.char, 0.95);
  };

  const handleListenAnswer = (picked: KanaItem) => {
    if (!listenSession || listenSession.picked) return;
    const target = listenSession.rounds[listenSession.idx].target;
    const ok = picked.char === target.char;
    playSfx(ok ? 'correct' : 'wrong', muted);
    onRecordAttempt(target.char, ok, ok ? undefined : picked.char);

    const nextScore = listenSession.score + (ok ? 100 : 0);
    setListenSession({ ...listenSession, picked: picked.char, score: nextScore });

    setTimeout(() => {
      setListenSession((prev) => {
        if (!prev) return null;
        if (prev.idx + 1 >= prev.rounds.length) {
          onFinishListeningGame(nextScore, 1);
          playSfx('levelup', muted);
          return { ...prev, done: true };
        }
        const nextRound = prev.rounds[prev.idx + 1];
        speakJapanese(nextRound.target.char, 0.95);
        return { ...prev, idx: prev.idx + 1, picked: null };
      });
    }, 650);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Hub Selector */}
      {mode === 'hub' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#2B2340]">🎮 게임존</h1>
            <p className="text-sm text-[#2B2340]/70 mt-1">
              게임을 즐기며 일본어 반응 속도를 키워요! 모든 최고 기록과 정확도는 내 기록과 대시보드에 저장돼요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Game 1 */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#6D5DF6] to-[#5746DC] text-white p-6 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="font-jp text-5xl font-extrabold">ぽ</div>
                <h2 className="text-xl font-extrabold mt-4">가나 낙하 게임</h2>
                <p className="text-xs text-white/85 mt-1.5 leading-relaxed">
                  위에서 떨어지는 히라가나·가타카나가 바닥에 닿기 전에 알맞은 발음을 눌러 맞추세요! (키보드 1~4 또는 로마자 입력 지원)
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-white/90 tabular-nums">
                  🏆 최고 기록 {state.gameRecords.kanaDropBest.toLocaleString()}점
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('drop');
                    setPhase('TITLE');
                  }}
                  className="w-full py-3 rounded-2xl bg-white text-[#5746DC] text-sm font-extrabold hover:bg-[#FFF7EC] cursor-pointer"
                >
                  가나 낙하 게임 시작
                </button>
              </div>
            </div>

            {/* Game 2 */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#00A8E8] to-[#008EC9] text-white p-6 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="text-5xl font-extrabold">♪</div>
                <h2 className="text-xl font-extrabold mt-4">듣고 글자 고르기</h2>
                <p className="text-xs text-white/85 mt-1.5 leading-relaxed">
                  일본어 발음을 듣고 4개의 글자 카드 중에서 알맞은 가나를 빠르게 찾아내는 청음 훈련 게임이에요!
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

            {/* Game 3 (Locked N5) */}
            <div className="rounded-[26px] bg-[#9E97AE] text-white p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#FFD166]" />
                </div>
                <h2 className="text-xl font-extrabold mt-4">한자 짝맞추기 · 활용 스피드</h2>
                <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
                  N5 월드(14단계)에 입성하면 열리는 한자 음훈·동사 활용 미니게임이에요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNotify('0단계 가나 모험을 끝내고 N5 월드에 진입하면 열려요!', 'info')}
                className="w-full py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-sm font-extrabold cursor-pointer"
              >
                N5 월드에서 열려요
              </button>
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
                  setMode('hub');
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
              >
                ← 게임존으로
              </button>
              <h2 className="text-lg font-extrabold text-[#2B2340]">가나 낙하 게임</h2>
            </div>

            <div className="flex items-center gap-4 tabular-nums">
              <div className="flex items-center gap-1" aria-label={`남은 목숨 ${lives}개`}>
                {[1, 2, 3].map((h) => (
                  <Heart
                    key={h}
                    className={`w-5 h-5 ${h <= lives ? 'text-[#FF6B57] fill-[#FF6B57]' : 'text-[#E8E3EF]'}`}
                  />
                ))}
              </div>
              <div className="px-3 py-1 rounded-full bg-[#2B2340] text-white text-xs font-extrabold">
                점수 {score.toLocaleString()}
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

          {phase === 'TITLE' && (
            <div className="rounded-[24px] bg-[#FFF7EC] border-2 border-[#FFE1C2] p-8 text-center max-w-xl mx-auto space-y-5">
              <div className="font-jp text-6xl font-extrabold text-[#6D5DF6]">ぽ</div>
              <h3 className="text-xl font-extrabold text-[#2B2340]">떨어지는 글자의 발음을 맞히세요!</h3>
              <p className="text-xs text-[#2B2340]/75">
                범위를 선택하고 시작하세요. PC에서는 숫자키 1~4 또는 로마자(예: ka, shi) 입력도 가능해요!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: 'hiragana' as const, label: '히라가나 전체' },
                  { id: 'learned' as const, label: '내가 배운 글자' },
                  { id: 'katakana' as const, label: '가타카나 전체' },
                  { id: 'confusing' as const, label: '헷갈리는 글자 특훈' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScope(opt.id)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold cursor-pointer ${
                      scope === opt.id
                        ? 'bg-[#2B2340] text-white'
                        : 'bg-white border border-[#FFE1C2] text-[#2B2340]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={startDropGame}
                className="px-8 py-3.5 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-base font-extrabold cursor-pointer shadow-sm"
              >
                게임 시작하기
              </button>
            </div>
          )}

          {(phase === 'PLAYING' || phase === 'PAUSED') && (
            <div className="space-y-4">
              {/* Falling Sky Arena */}
              <div className="relative h-[320px] sm:h-[360px] rounded-[24px] border-[3px] border-[#2B2340] bg-gradient-to-b from-[#EEF4FF] via-[#FFF9F0] to-[#FFE8D1] overflow-hidden">
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

          {phase === 'GAME_OVER' && (
            <div className="rounded-[24px] bg-[#FFF7EC] border-2 border-[#FFE1C2] p-8 text-center max-w-md mx-auto space-y-4">
              <Trophy className="w-12 h-12 text-[#FFD166] mx-auto" />
              <h3 className="text-2xl font-extrabold text-[#2B2340]">게임 종료!</h3>
              <div className="text-3xl font-num font-extrabold text-[#FF6B57]">{score.toLocaleString()}점</div>
              <p className="text-xs font-bold text-[#2B2340]/70 tabular-nums">
                최고 기록: {Math.max(score, state.gameRecords.kanaDropBest).toLocaleString()}점 · 미션 & EXP 반영 완료!
              </p>
              <div className="flex justify-center gap-3 pt-2">
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
                  onClick={() => setMode('hub')}
                  className="px-5 py-3 rounded-full bg-white border-2 border-[#FFE1C2] text-sm font-bold text-[#2B2340] cursor-pointer"
                >
                  나가기
                </button>
              </div>
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
    </div>
  );
};
