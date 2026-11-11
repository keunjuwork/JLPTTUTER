import React from 'react';
import {
  Award,
  Bookmark,
  Check,
  CheckCircle2,
  Eraser,
  Mic,
  Printer,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle
} from 'lucide-react';
import { ADVENTURE_STAGES } from '../data/adventureRoadmapData';
import { CONFUSING_PAIRS } from '../data/confusingPairsData';
import { CULTURE_CARDS } from '../data/cultureAndBadgesData';
import { VOCAB_PREVIEW } from '../data/curriculumPreviewData';
import {
  ALL_KANA,
  HIRAGANA_BASIC,
  HIRAGANA_DAKUON,
  HIRAGANA_ROWS,
  HIRAGANA_YOON,
  KATAKANA_BASIC,
  KATAKANA_ROWS,
  VOWEL_HEADERS
} from '../data/kanaData';
import {
  isSpeechRecognitionSupported,
  listenJapanesePronunciation,
  playSfx,
  speakJapanese
} from '../lib/speech';
import { getDueSrsChars, SRS_INTERVALS } from '../lib/storage';
import { KanaItem, PrintSubTab, StudentState, StudySubTab } from '../types';

interface LearningLabViewProps {
  state: StudentState;
  subTab: StudySubTab;
  selectedRowId: string;
  onChangeSubTab: (tab: StudySubTab) => void;
  onSelectRow: (rowId: string) => void;
  onMarkKanaLearned: (char: string) => void;
  onToggleBookmark: (char: string) => void;
  onRecordAttempt: (char: string, isCorrect: boolean, confusedChar?: string) => void;
  onCompleteStageQuiz: (stageId: string, scorePercent: number, correctCount: number, totalCount: number) => void;
  onCompleteSrsSession: (reviewedCount: number) => void;
  onCompleteSpeakingMission: () => void;
  onOpenPrintForPair: (pairId: string, subTab: PrintSubTab) => void;
  onNotify: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

const ROW_OPTIONS = [
  { id: 'row_a', label: 'あ행' },
  { id: 'row_ka', label: 'か행' },
  { id: 'row_sa', label: 'さ행' },
  { id: 'row_ta', label: 'た행' },
  { id: 'row_na', label: 'な행' },
  { id: 'row_ha', label: 'は행' },
  { id: 'row_ma', label: 'ま행' },
  { id: 'row_ya', label: 'や행' },
  { id: 'row_ra', label: 'ら행' },
  { id: 'row_wa', label: 'わ행·ん' },
  { id: 'row_dakuon', label: '탁음·반탁음' },
  { id: 'row_yoon', label: '요음' },
  { id: 'k_row_a', label: '가타카나 ア~オ' },
  { id: 'k_row_ka', label: '가타카나 カ~コ' },
  { id: 'k_row_sa', label: '가타카나 サ~ソ' },
  { id: 'k_row_ta', label: '가타카나 タ~ト' },
  { id: 'k_row_na', label: '가타카나 ナ~ノ' },
  { id: 'k_row_ha', label: '가타카나 ハ~ホ' },
  { id: 'k_row_ma', label: '가타카나 マ~モ' },
  { id: 'k_row_ya', label: '가타카나 ヤ~ヨ' },
  { id: 'k_row_ra', label: '가타카나 ラ~ロ' },
  { id: 'k_row_wa', label: '가타카나 ワ~ン' },
  { id: 'basics_preview', label: '기초 인사·숫자' }
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const LearningLabView: React.FC<LearningLabViewProps> = ({
  state,
  subTab,
  selectedRowId,
  onChangeSubTab,
  onSelectRow,
  onMarkKanaLearned,
  onToggleBookmark,
  onRecordAttempt,
  onCompleteStageQuiz,
  onCompleteSrsSession,
  onCompleteSpeakingMission,
  onOpenPrintForPair,
  onNotify
}) => {
  // 1. Kana Cards state
  const rowItems = React.useMemo(() => {
    if (selectedRowId === 'basics_preview') return [];
    const matched = ALL_KANA.filter((k) => k.rowId === selectedRowId);
    return matched.length > 0 ? matched : HIRAGANA_BASIC.slice(0, 5);
  }, [selectedRowId]);

  const [selectedCharIdx, setSelectedCharIdx] = React.useState(0);
  React.useEffect(() => {
    setSelectedCharIdx(0);
  }, [selectedRowId]);

  const activeKana: KanaItem | null = rowItems[selectedCharIdx] || rowItems[0] || null;

  // Handwriting Canvas
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [hasDrawn, setHasDrawn] = React.useState(false);

  const clearCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, []);

  React.useEffect(() => {
    clearCanvas();
  }, [activeKana?.id, clearCanvas]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPoint(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2B2340';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  // Speech Recognition (only rendered if browser supports it)
  const speechRecSupported = React.useMemo(() => isSpeechRecognitionSupported(), []);
  const [isListening, setIsListening] = React.useState(false);
  const [speechResult, setSpeechResult] = React.useState<{ ok: boolean; text: string } | null>(null);
  const stopListeningRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    setSpeechResult(null);
    if (stopListeningRef.current) {
      stopListeningRef.current();
      stopListeningRef.current = null;
    }
    setIsListening(false);
  }, [activeKana?.id]);

  const handleVoiceCheck = () => {
    if (!activeKana) return;
    if (isListening && stopListeningRef.current) {
      stopListeningRef.current();
      return;
    }
    setIsListening(true);
    setSpeechResult(null);
    stopListeningRef.current = listenJapanesePronunciation(
      (transcripts) => {
        const joined = transcripts.join(' ');
        const targetKana = activeKana.char;
        const targetWord = activeKana.exampleWord;
        const counterpart = activeKana.counterpart;
        const matched = transcripts.some(
          (t) =>
            t.includes(targetKana) ||
            t.includes(counterpart) ||
            t.includes(targetWord) ||
            t.toLowerCase().includes(activeKana.romaji)
        );
        if (matched) {
          playSfx('correct');
          setSpeechResult({ ok: true, text: `인식됨: "${joined}" — 정확한 발음이에요!` });
          onCompleteSpeakingMission();
        } else {
          setSpeechResult({
            ok: false,
            text: `인식됨: "${joined}" — 「${activeKana.char} (${activeKana.ko})」 소리로 다시 도전!`
          });
        }
      },
      (errMsg) => {
        setSpeechResult({ ok: false, text: errMsg });
      },
      () => {
        setIsListening(false);
        stopListeningRef.current = null;
      }
    );
  };

  // Stage Quiz (80%+ to unlock next stage & win Culture Card)
  const [quizState, setQuizState] = React.useState<{
    active: boolean;
    questions: { target: KanaItem; options: KanaItem[] }[];
    index: number;
    correct: number;
    answeredChar: string | null;
    finished: boolean;
  } | null>(null);

  const matchingStage = React.useMemo(() => {
    if (selectedRowId === 'basics_preview') {
      return ADVENTURE_STAGES.find((s) => s.id === 'stage_basics') || null;
    }
    return (
      ADVENTURE_STAGES.find((s) => s.rowId === selectedRowId) ||
      (selectedRowId.startsWith('k_row_') ? ADVENTURE_STAGES.find((s) => s.id === 'stage_katakana') : null) ||
      null
    );
  }, [selectedRowId]);

  const startStageQuiz = () => {
    const pool = rowItems.length >= 3 ? rowItems : HIRAGANA_BASIC.slice(0, 10);
    const distractorPool = (pool[0]?.script === 'katakana' ? KATAKANA_BASIC : HIRAGANA_BASIC);
    const questionItems = shuffleArray(pool).slice(0, Math.min(5, pool.length));
    // Repeat to make 5 questions when row has 3 items (like や행)
    while (questionItems.length < 5) {
      questionItems.push(pool[questionItems.length % pool.length]);
    }
    const questions = questionItems.map((target) => {
      const others = shuffleArray(distractorPool.filter((d) => d.char !== target.char)).slice(0, 3);
      return {
        target,
        options: shuffleArray([target, ...others])
      };
    });
    setQuizState({
      active: true,
      questions,
      index: 0,
      correct: 0,
      answeredChar: null,
      finished: false
    });
    speakJapanese(questions[0].target.char);
  };

  const handleStageQuizAnswer = (picked: KanaItem) => {
    if (!quizState || quizState.answeredChar) return;
    const current = quizState.questions[quizState.index];
    const isOk = picked.char === current.target.char;
    playSfx(isOk ? 'correct' : 'wrong');
    onRecordAttempt(current.target.char, isOk, isOk ? undefined : picked.char);

    const nextCorrect = quizState.correct + (isOk ? 1 : 0);
    setQuizState({ ...quizState, answeredChar: picked.char, correct: nextCorrect });

    setTimeout(() => {
      setQuizState((prev) => {
        if (!prev) return null;
        if (prev.index + 1 >= prev.questions.length) {
          const pct = Math.round((nextCorrect / prev.questions.length) * 100);
          if (matchingStage) {
            onCompleteStageQuiz(matchingStage.id, pct, nextCorrect, prev.questions.length);
          }
          return { ...prev, finished: true };
        }
        const nextQ = prev.questions[prev.index + 1];
        speakJapanese(nextQ.target.char);
        return {
          ...prev,
          index: prev.index + 1,
          answeredChar: null
        };
      });
    }, 650);
  };

  // 2. Gojuon Chart filter
  const [gojuonMode, setGojuonMode] = React.useState<'hiragana' | 'katakana' | 'dakuon' | 'yoon'>('hiragana');

  // 3. Confusing Pairs Quiz
  const [confusingQuiz, setConfusingQuiz] = React.useState<{
    pairId: string;
    questions: { targetChar: string; ko: string; romaji: string; options: string[] }[];
    index: number;
    correct: number;
    picked: string | null;
    done: boolean;
  } | null>(null);

  const startConfusingQuiz = (pairId: string) => {
    const pair = CONFUSING_PAIRS.find((p) => p.id === pairId);
    if (!pair) return;
    const questions = Array.from({ length: 6 }, (_, i) => {
      const point = pair.points[i % pair.points.length];
      return {
        targetChar: point.char,
        ko: point.ko,
        romaji: point.romaji,
        options: shuffleArray(pair.chars)
      };
    });
    setConfusingQuiz({
      pairId,
      questions: shuffleArray(questions),
      index: 0,
      correct: 0,
      picked: null,
      done: false
    });
  };

  const handleConfusingAnswer = (pickedChar: string) => {
    if (!confusingQuiz || confusingQuiz.picked) return;
    const current = confusingQuiz.questions[confusingQuiz.index];
    const isOk = pickedChar === current.targetChar;
    playSfx(isOk ? 'correct' : 'wrong');
    onRecordAttempt(current.targetChar, isOk, isOk ? undefined : pickedChar);

    const nextCorrect = confusingQuiz.correct + (isOk ? 1 : 0);
    setConfusingQuiz({ ...confusingQuiz, picked: pickedChar, correct: nextCorrect });

    setTimeout(() => {
      setConfusingQuiz((prev) => {
        if (!prev) return null;
        if (prev.index + 1 >= prev.questions.length) {
          onNotify(
            `구별 훈련 완료! ${nextCorrect}/${prev.questions.length} 정답`,
            nextCorrect >= 5 ? 'success' : 'info'
          );
          return { ...prev, done: true };
        }
        return { ...prev, index: prev.index + 1, picked: null };
      });
    }, 600);
  };

  // 4. SRS Forgetting Curve Review Session
  const dueChars = React.useMemo(() => getDueSrsChars(state), [state]);
  const [srsSession, setSrsSession] = React.useState<{
    queue: KanaItem[];
    index: number;
    correct: number;
    showAnswer: boolean;
    done: boolean;
  } | null>(null);

  const startSrsReview = (forceAllLearned = false) => {
    const sourceChars =
      dueChars.length > 0 && !forceAllLearned
        ? dueChars
        : state.learnedKana.length > 0
          ? state.learnedKana
          : HIRAGANA_BASIC.slice(0, 5).map((k) => k.char);

    const items = sourceChars
      .map((ch) => ALL_KANA.find((k) => k.char === ch))
      .filter((k): k is KanaItem => Boolean(k))
      .slice(0, 12);

    if (items.length === 0) {
      onNotify('복습할 글자를 먼저 가나 카드에서 배워 보아요!', 'info');
      return;
    }
    setSrsSession({
      queue: shuffleArray(items),
      index: 0,
      correct: 0,
      showAnswer: false,
      done: false
    });
    speakJapanese(items[0].char);
  };

  const handleSrsGrade = (remembered: boolean) => {
    if (!srsSession) return;
    const item = srsSession.queue[srsSession.index];
    playSfx(remembered ? 'correct' : 'wrong');
    onRecordAttempt(item.char, remembered);

    const nextCorrect = srsSession.correct + (remembered ? 1 : 0);
    if (srsSession.index + 1 >= srsSession.queue.length) {
      onCompleteSrsSession(srsSession.queue.length);
      setSrsSession({ ...srsSession, correct: nextCorrect, done: true });
    } else {
      const nextItem = srsSession.queue[srsSession.index + 1];
      speakJapanese(nextItem.char);
      setSrsSession({
        ...srsSession,
        index: srsSession.index + 1,
        correct: nextCorrect,
        showAnswer: false
      });
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Learning Lab Sub-Nav */}
      <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'kana' as const, label: '가나 카드 · 쓰기' },
            { id: 'gojuon' as const, label: '오십음도 발음표' },
            { id: 'confusing' as const, label: '헷갈리는 글자 비교' },
            { id: 'srs' as const, label: `망각 곡선 복습 (${dueChars.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeSubTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                subTab === tab.id
                  ? 'bg-[#FF6B57] text-white'
                  : 'bg-[#FFF7EC] text-[#2B2340] hover:bg-[#FFEBD2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-[#2B2340]/65 px-2 tabular-nums">
          외운 글자 {state.learnedKana.length} / 92자
        </div>
      </div>

      {/* TAB 1: KANA CARDS + HANDWRITING + SPEAKING + STAGE QUIZ */}
      {subTab === 'kana' && (
        <div className="space-y-6">
          {/* Row Picker */}
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-[#2B2340]/60 mr-1">단계 선택</span>
            {ROW_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelectRow(opt.id);
                  setQuizState(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedRowId === opt.id
                    ? 'bg-[#2B2340] text-white'
                    : 'bg-[#FFF7EC] text-[#2B2340] hover:bg-[#FFEBD2]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {selectedRowId === 'basics_preview' ? (
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-[#2B2340]">0단계 인사말 · 숫자 기초 입문</h2>
                  <p className="text-sm text-[#2B2340]/70 mt-0.5">소리를 눌러 따라 말하며 필수 일본어 인사를 익혀요.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onCompleteStageQuiz('stage_basics', 100, 5, 5);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#4CC38A] hover:bg-[#3eb37b] text-white text-sm font-extrabold cursor-pointer"
                >
                  인사말 완료하고 N5 월드 열기
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {VOCAB_PREVIEW.filter((v) => v.level === 'STAGE0').map((v) => (
                  <div key={v.id} className="rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-jp text-2xl font-extrabold text-[#2B2340]">{v.word}</div>
                        <div className="text-xs font-bold text-[#FF6B57]">{v.romaji}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakJapanese(v.word)}
                        className="w-10 h-10 rounded-full bg-[#FF6B57] text-white flex items-center justify-center cursor-pointer shrink-0"
                        aria-label="발음 듣기"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-sm font-bold text-[#2B2340]">{v.meaning}</div>
                    <div className="text-xs text-[#2B2340]/75 bg-[#FFF7EC] rounded-xl p-2.5">💡 {v.tip}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            activeKana && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Character Selector + Main Card */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Character Pills in Current Row */}
                  <div className="flex flex-wrap gap-2">
                    {rowItems.map((item, idx) => {
                      const learned = state.learnedKana.includes(item.char);
                      const isSel = idx === selectedCharIdx;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedCharIdx(idx);
                            speakJapanese(item.char);
                          }}
                          className={`min-w-[60px] h-14 px-3 rounded-2xl border-[3px] flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#FF6B57] border-[#FF6B57] text-white shadow-sm scale-105'
                              : learned
                                ? 'bg-white border-[#4CC38A] text-[#2B2340]'
                                : 'bg-white border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFFDF9]'
                          }`}
                        >
                          <span className="font-jp text-xl font-extrabold leading-none">{item.char}</span>
                          <span className={`text-[11px] font-bold mt-0.5 ${isSel ? 'text-white/90' : 'text-[#2B2340]/60'}`}>
                            {item.ko}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Flashcard */}
                  <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-8 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-extrabold text-[#FF6B57]">
                          {activeKana.rowLabel} · {activeKana.script === 'hiragana' ? '히라가나' : '가타카나'} (짝: {activeKana.counterpart})
                        </span>
                        <div className="mt-2 flex items-baseline gap-4">
                          <span className="font-jp text-[86px] sm:text-[104px] font-extrabold leading-none text-[#2B2340]">
                            {activeKana.char}
                          </span>
                          <div>
                            <div className="text-3xl font-extrabold text-[#FF6B57]">{activeKana.ko}</div>
                            <div className="text-lg font-num font-bold text-[#2B2340]/65">
                              [{activeKana.romaji}] · {activeKana.strokeCount}획
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => speakJapanese(activeKana.char, 1.0)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FF6B57] hover:bg-[#ee5944] text-white text-sm font-extrabold cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>발음 듣기</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => speakJapanese(activeKana.char, 0.65)}
                            className="px-3.5 py-2.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:bg-[#FFEBD2] text-xs font-extrabold text-[#2B2340] cursor-pointer"
                          >
                            0.65x 천천히
                          </button>
                        </div>

                        {speechRecSupported && (
                          <button
                            type="button"
                            onClick={handleVoiceCheck}
                            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold border-2 cursor-pointer transition-colors ${
                              isListening
                                ? 'bg-[#2B2340] border-[#2B2340] text-white animate-pulse'
                                : 'bg-white border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFF7EC]'
                            }`}
                          >
                            <Mic className="w-3.5 h-3.5 text-[#FF6B57]" />
                            <span>{isListening ? '듣고 있어요... 말해 보세요' : '발음 따라 말하기'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {speechResult && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-xs font-bold flex items-center gap-2 ${
                          speechResult.ok ? 'bg-[#4CC38A]/15 text-[#1f7d52]' : 'bg-[#FFF3CC] text-[#9a5b00]'
                        }`}
                      >
                        {speechResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Mic className="w-4 h-4 shrink-0" />}
                        <span>{speechResult.text}</span>
                      </div>
                    )}

                    {/* Example Word & Mnemonic */}
                    <div className="grid sm:grid-cols-2 gap-3.5">
                      <div className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-4 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-bold text-[#2B2340]/55">대표 단어</div>
                          <div className="font-jp text-xl font-extrabold text-[#2B2340] mt-0.5">
                            {activeKana.exampleWord}
                          </div>
                          <div className="text-xs font-semibold text-[#2B2340]/75 mt-0.5">
                            {activeKana.exampleReading} · {activeKana.exampleMeaning}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakJapanese(activeKana.exampleWord, 0.9)}
                          className="w-9 h-9 rounded-full bg-white border border-[#FFE1C2] flex items-center justify-center text-[#FF6B57] hover:bg-[#FF6B57] hover:text-white cursor-pointer shrink-0"
                          aria-label="단어 듣기"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-4">
                        <div className="text-[11px] font-bold text-[#2B2340]/55">기억 팁 & 획순</div>
                        <p className="text-xs font-bold text-[#2B2340] mt-1 leading-relaxed">{activeKana.mnemonicTip}</p>
                        <p className="text-[11px] text-[#2B2340]/65 mt-1">✏️ {activeKana.strokeHint}</p>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#FFE1C2]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            playSfx('correct');
                            onMarkKanaLearned(activeKana.char);
                          }}
                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-extrabold cursor-pointer transition-colors ${
                            state.learnedKana.includes(activeKana.char)
                              ? 'bg-[#4CC38A] text-white'
                              : 'bg-[#2B2340] hover:bg-[#3f345d] text-white'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{state.learnedKana.includes(activeKana.char) ? '외웠어요 완료!' : '외웠어요 (+15 EXP)'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleBookmark(activeKana.char)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-extrabold border-2 cursor-pointer transition-colors ${
                            state.bookmarkedKana.includes(activeKana.char)
                              ? 'bg-[#FFD166]/30 border-[#FFD166] text-[#2B2340]'
                              : 'bg-white border-[#FFE1C2] text-[#2B2340]/75 hover:bg-[#FFF7EC]'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{state.bookmarkedKana.includes(activeKana.char) ? '헷갈려요 해제' : '헷갈려요'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={startStageQuiz}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FF6B57]/12 hover:bg-[#FF6B57]/20 text-[#FF6B57] text-xs font-extrabold cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>이 단계 정복 퀴즈 (80%+)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Handwriting Canvas + Stage Quiz Panel */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Handwriting Canvas */}
                  <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-[#2B2340]">손글씨 따라 쓰기</h3>
                        <p className="text-xs text-[#2B2340]/60">손가락, 펜 또는 마우스로 흐린 글자 위를 따라 써 보세요.</p>
                      </div>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] hover:bg-[#FFEBD2] cursor-pointer"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                        <span>지우기</span>
                      </button>
                    </div>

                    <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl border-2 border-dashed border-[#FFD1B0] bg-[#FFFDF9] overflow-hidden touch-none select-none">
                      {/* Crosshair Guide Lines */}
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#FFE1C2] pointer-events-none" />
                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#FFE1C2] pointer-events-none" />
                      {/* Faint Target Kana Guide */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center font-jp text-[165px] font-bold text-[#2B2340]/10 pointer-events-none select-none"
                      >
                        {activeKana.char}
                      </div>
                      <canvas
                        ref={canvasRef}
                        width={280}
                        height={280}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className="relative z-10 w-full h-full cursor-crosshair"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={!hasDrawn}
                        onClick={() => {
                          playSfx('correct');
                          onMarkKanaLearned(activeKana.char);
                          clearCanvas();
                          onNotify(`${activeKana.char} 쓰기 연습 완료! (+15 EXP)`, 'success');
                        }}
                        className="w-full py-2.5 rounded-full bg-[#4CC38A] hover:bg-[#3cb37a] disabled:bg-[#E8E3EF] disabled:text-[#2B2340]/40 text-white text-xs font-extrabold cursor-pointer transition-colors"
                      >
                        쓰기 연습 완료 체크
                      </button>
                    </div>
                  </div>

                  {/* Stage Conquest Quiz Card */}
                  <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-extrabold text-[#2B2340]">
                          {matchingStage ? `「${matchingStage.title}」 단계 퀴즈` : '단계 확인 퀴즈'}
                        </h3>
                        <p className="text-xs text-[#2B2340]/65">
                          5문제 중 4개(80%) 이상 맞히면 다음 단계가 열리고 문화 카드를 받아요!
                        </p>
                      </div>
                      <Award className="w-6 h-6 text-[#FFD166] shrink-0" />
                    </div>

                    {!quizState ? (
                      <button
                        type="button"
                        onClick={startStageQuiz}
                        className="w-full py-3 rounded-2xl bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold cursor-pointer"
                      >
                        단계 정복 퀴즈 시작하기
                      </button>
                    ) : quizState.finished ? (
                      <div className="rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] p-4 text-center space-y-3">
                        {(() => {
                          const pct = Math.round((quizState.correct / quizState.questions.length) * 100);
                          const passed = pct >= 80;
                          const rewardCard = matchingStage
                            ? CULTURE_CARDS.find((c) => c.id === matchingStage.rewardCardId)
                            : null;
                          return (
                            <>
                              <div className={`text-2xl font-extrabold tabular-nums ${passed ? 'text-[#4CC38A]' : 'text-[#FF6B57]'}`}>
                                {pct}점 ({quizState.correct} / {quizState.questions.length})
                              </div>
                              <div className="text-xs font-bold text-[#2B2340]">
                                {passed
                                  ? `축하해요! 단계 클리어! ${rewardCard ? `문화 카드 「${rewardCard.title}」 획득!` : ''}`
                                  : '아쉬워요! 80점 이상이면 다음 모험이 열려요. 다시 도전해 볼까요?'}
                              </div>
                              <button
                                type="button"
                                onClick={startStageQuiz}
                                className="px-5 py-2 rounded-full bg-[#2B2340] text-white text-xs font-bold cursor-pointer"
                              >
                                다시 풀기
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-[#2B2340]/65 tabular-nums">
                          <span>문제 {quizState.index + 1} / {quizState.questions.length}</span>
                          <span>정답 {quizState.correct}개</span>
                        </div>

                        <div className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-4 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-[#2B2340]/60">소리를 듣고 알맞은 글자를 고르세요</div>
                            <div className="text-xl font-extrabold text-[#FF6B57] mt-1">
                              {quizState.questions[quizState.index].target.ko} [{quizState.questions[quizState.index].target.romaji}]
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => speakJapanese(quizState.questions[quizState.index].target.char)}
                            className="w-10 h-10 rounded-full bg-[#FF6B57] text-white flex items-center justify-center cursor-pointer shrink-0"
                            aria-label="다시 듣기"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {quizState.questions[quizState.index].options.map((opt) => {
                            const target = quizState.questions[quizState.index].target;
                            const isPicked = quizState.answeredChar === opt.char;
                            const isRight = opt.char === target.char;
                            let btnClass = 'bg-white border-2 border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFF7EC]';
                            if (quizState.answeredChar) {
                              if (isRight) btnClass = 'bg-[#4CC38A] border-[#4CC38A] text-white';
                              else if (isPicked) btnClass = 'bg-[#FF6B57] border-[#FF6B57] text-white';
                            }
                            return (
                              <button
                                key={opt.id + opt.char}
                                type="button"
                                disabled={Boolean(quizState.answeredChar)}
                                onClick={() => handleStageQuizAnswer(opt)}
                                className={`py-3 rounded-2xl font-jp text-2xl font-extrabold cursor-pointer transition-colors ${btnClass}`}
                              >
                                {opt.char}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* TAB 2: GOJUON 50-SOUND CHART */}
      {subTab === 'gojuon' && (
        <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#2B2340]">오십음도 발음표</h2>
              <p className="text-xs text-[#2B2340]/65 mt-0.5">글자를 누르면 일본어 원어민 발음이 나와요. 초록 테두리는 이미 외운 글자예요!</p>
            </div>
            <div className="flex flex-wrap gap-1.5 bg-[#FFF7EC] p-1.5 rounded-full border border-[#FFE1C2]">
              {[
                { id: 'hiragana' as const, label: '히라가나' },
                { id: 'katakana' as const, label: '가타카나' },
                { id: 'dakuon' as const, label: '탁음·반탁음' },
                { id: 'yoon' as const, label: '요음' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGojuonMode(m.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                    gojuonMode === m.id ? 'bg-[#2B2340] text-white' : 'text-[#2B2340]/75 hover:text-[#2B2340]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {(gojuonMode === 'hiragana' || gojuonMode === 'katakana') && (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[540px] border-separate border-spacing-2">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-extrabold text-[#2B2340]/55 px-2 w-20">행</th>
                    {VOWEL_HEADERS.map((vh) => (
                      <th key={vh} className="text-center text-xs font-extrabold text-[#2B2340]/55 pb-1">
                        {vh}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(gojuonMode === 'hiragana' ? HIRAGANA_ROWS : KATAKANA_ROWS).map((row) => (
                    <tr key={row.id}>
                      <td className="text-xs font-extrabold text-[#FF6B57] px-2 whitespace-nowrap">{row.label}</td>
                      {row.chars.map((ch, idx) => {
                        if (!ch) {
                          return (
                            <td key={`${row.id}_${idx}`} className="text-center">
                              <div className="h-[68px] rounded-2xl bg-[#FFFDF9] border border-dashed border-[#FFE1C2]/60" />
                            </td>
                          );
                        }
                        const meta = ALL_KANA.find((k) => k.char === ch);
                        const learned = state.learnedKana.includes(ch);
                        return (
                          <td key={ch}>
                            <button
                              type="button"
                              onClick={() => speakJapanese(ch)}
                              className={`w-full h-[68px] rounded-2xl border-2 flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer ${
                                learned
                                  ? 'bg-[#4CC38A]/10 border-[#4CC38A] text-[#2B2340]'
                                  : 'bg-[#FFFDF9] border-[#FFE1C2] text-[#2B2340] hover:border-[#FF6B57]'
                              }`}
                            >
                              <span className="font-jp text-2xl font-extrabold leading-none">{ch}</span>
                              <span className="text-[11px] font-bold text-[#2B2340]/70 mt-1">
                                {meta?.ko} <span className="font-num text-[#2B2340]/45">{meta?.romaji}</span>
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(gojuonMode === 'dakuon' || gojuonMode === 'yoon') && (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2.5">
              {(gojuonMode === 'dakuon' ? HIRAGANA_DAKUON : HIRAGANA_YOON).map((item) => {
                const learned = state.learnedKana.includes(item.char);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => speakJapanese(item.char)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                      learned
                        ? 'bg-[#4CC38A]/10 border-[#4CC38A]'
                        : 'bg-[#FFFDF9] border-[#FFE1C2] hover:border-[#FF6B57]'
                    }`}
                  >
                    <span className="font-jp text-2xl font-extrabold text-[#2B2340]">
                      {item.char} <span className="text-sm text-[#2B2340]/40">/ {item.counterpart}</span>
                    </span>
                    <span className="text-xs font-bold text-[#FF6B57] mt-1">
                      {item.ko} ({item.romaji})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONFUSING PAIRS COMPARISON */}
      {subTab === 'confusing' && (
        <div className="space-y-5">
          {confusingQuiz && !confusingQuiz.done && (
            <div className="bg-white border-[3px] border-[#FF6B57] rounded-[26px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#2B2340]">
                  헷갈리는 글자 1:1 구별 훈련 ({confusingQuiz.index + 1} / {confusingQuiz.questions.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setConfusingQuiz(null)}
                  className="text-xs font-bold text-[#2B2340]/60 hover:text-[#2B2340] cursor-pointer"
                >
                  닫기
                </button>
              </div>
              <div className="text-center space-y-2 py-2">
                <div className="text-xs font-bold text-[#2B2340]/60">다음 발음에 맞는 글자를 고르세요</div>
                <div className="text-3xl font-extrabold text-[#FF6B57]">
                  {confusingQuiz.questions[confusingQuiz.index].ko} [{confusingQuiz.questions[confusingQuiz.index].romaji}]
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
                {confusingQuiz.questions[confusingQuiz.index].options.map((ch) => {
                  const target = confusingQuiz.questions[confusingQuiz.index].targetChar;
                  const picked = confusingQuiz.picked === ch;
                  const right = ch === target;
                  let cls = 'bg-[#FFF7EC] border-2 border-[#FFE1C2] text-[#2B2340] hover:border-[#FF6B57]';
                  if (confusingQuiz.picked) {
                    if (right) cls = 'bg-[#4CC38A] border-[#4CC38A] text-white';
                    else if (picked) cls = 'bg-[#FF6B57] border-[#FF6B57] text-white';
                  }
                  return (
                    <button
                      key={ch}
                      type="button"
                      disabled={Boolean(confusingQuiz.picked)}
                      onClick={() => handleConfusingAnswer(ch)}
                      className={`py-5 rounded-2xl font-jp text-4xl font-extrabold cursor-pointer ${cls}`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CONFUSING_PAIRS.map((pair) => (
              <div
                key={pair.id}
                className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 sm:p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-[#FF6B57]">
                        {pair.script === 'hiragana' ? '히라가나 주의 짝' : '가타카나 주의 짝'}
                      </span>
                      <h3 className="font-jp text-2xl font-extrabold text-[#2B2340] mt-0.5">{pair.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenPrintForPair(pair.id, 'confusingSheet')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] hover:bg-[#FFEBD2] text-xs font-bold text-[#2B2340] cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>비교 쓰기표</span>
                    </button>
                  </div>

                  <p className="text-xs font-bold text-[#2B2340] bg-[#FFF7EC] rounded-2xl p-3.5 leading-relaxed">
                    💡 {pair.summaryTip}
                  </p>

                  <div className="space-y-2.5">
                    {pair.points.map((pt) => (
                      <div key={pt.char} className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#FFE1C2] bg-[#FFFDF9]">
                        <button
                          type="button"
                          onClick={() => speakJapanese(pt.char)}
                          className="w-14 h-14 rounded-2xl bg-[#FF6B57]/10 hover:bg-[#FF6B57] hover:text-white text-[#2B2340] font-jp text-3xl font-extrabold flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                          title="소리 듣기"
                        >
                          {pt.char}
                        </button>
                        <div>
                          <div className="text-sm font-extrabold text-[#2B2340]">
                            {pt.ko} <span className="font-num text-xs text-[#2B2340]/55">[{pt.romaji}]</span>
                          </div>
                          <div className="text-xs text-[#2B2340]/75 mt-0.5">{pt.visualCue}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => startConfusingQuiz(pair.id)}
                  className="w-full py-2.5 rounded-full bg-[#2B2340] hover:bg-[#3f345d] text-white text-xs font-extrabold cursor-pointer"
                >
                  {pair.title} 구별 집중 퀴즈 풀기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SRS FORGETTING CURVE REVIEW */}
      {subTab === 'srs' && (
        <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#2B2340]">망각 곡선 스마트 복습 (1 · 3 · 7 · 14 · 30일)</h2>
              <p className="text-sm text-[#2B2340]/70 mt-1">
                기억이 희미해지기 직전에 딱 맞춰 다시 꺼내 주는 장기 기억 훈련이에요. 틀리면 1일 주기로 자동 초기화돼요.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => startSrsReview(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>오늘 복습 시작 ({dueChars.length}개)</span>
              </button>
              <button
                type="button"
                onClick={() => startSrsReview(true)}
                className="px-4 py-2.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-extrabold text-[#2B2340] hover:bg-[#FFEBD2] cursor-pointer"
              >
                배운 글자 전체 복습
              </button>
            </div>
          </div>

          {/* Interval Buckets */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SRS_INTERVALS.map((days) => {
              const count = Object.values(state.srsItems).filter((i) => i.intervalDays === days).length;
              return (
                <div key={days} className="rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] p-4 text-center">
                  <div className="text-xs font-bold text-[#2B2340]/60">{days}일 주기</div>
                  <div className="text-2xl font-extrabold text-[#2B2340] tabular-nums mt-1">{count}개</div>
                </div>
              );
            })}
          </div>

          {/* Active SRS Review Arena */}
          {srsSession && (
            <div className="rounded-[24px] border-[3px] border-[#FFE1C2] bg-[#FFFDF9] p-6 max-w-xl mx-auto text-center space-y-5">
              {srsSession.done ? (
                <div className="space-y-3 py-4">
                  <div className="text-3xl">🎉</div>
                  <h3 className="text-xl font-extrabold text-[#2B2340]">오늘의 망각 곡선 복습 완료!</h3>
                  <p className="text-sm text-[#2B2340]/75 tabular-nums">
                    총 {srsSession.queue.length}개 중 {srsSession.correct}개 완벽 기억 (+40 EXP)
                  </p>
                  <button
                    type="button"
                    onClick={() => setSrsSession(null)}
                    className="px-6 py-2.5 rounded-full bg-[#4CC38A] text-white text-sm font-extrabold cursor-pointer"
                  >
                    확인
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs font-bold text-[#2B2340]/60 tabular-nums">
                    <span>진행 {srsSession.index + 1} / {srsSession.queue.length}</span>
                    <span>
                      현재 주기: {state.srsItems[srsSession.queue[srsSession.index].char]?.intervalDays || 1}일
                    </span>
                  </div>

                  <div className="py-4">
                    <div className="font-jp text-[92px] font-extrabold text-[#2B2340] leading-none">
                      {srsSession.queue[srsSession.index].char}
                    </div>
                    <button
                      type="button"
                      onClick={() => speakJapanese(srsSession.queue[srsSession.index].char)}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#FF6B57]" />
                      <span>소리 힌트 듣기</span>
                    </button>
                  </div>

                  {!srsSession.showAnswer ? (
                    <button
                      type="button"
                      onClick={() => setSrsSession({ ...srsSession, showAnswer: true })}
                      className="w-full py-3 rounded-2xl bg-[#2B2340] hover:bg-[#3f345d] text-white text-sm font-extrabold cursor-pointer"
                    >
                      정답 확인하기
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-4">
                        <div className="text-2xl font-extrabold text-[#FF6B57]">
                          {srsSession.queue[srsSession.index].ko} [{srsSession.queue[srsSession.index].romaji}]
                        </div>
                        <div className="text-xs text-[#2B2340]/75 mt-1">
                          {srsSession.queue[srsSession.index].exampleWord} ({srsSession.queue[srsSession.index].exampleMeaning})
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleSrsGrade(false)}
                          className="py-3 rounded-2xl bg-[#FF6B57]/12 hover:bg-[#FF6B57]/20 text-[#FF6B57] text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>헷갈려요 (1일 초기화)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSrsGrade(true)}
                          className="py-3 rounded-2xl bg-[#4CC38A] hover:bg-[#3eb37b] text-white text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>완벽 기억! (다음 주기)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
