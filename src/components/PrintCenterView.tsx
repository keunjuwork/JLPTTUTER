import React from 'react';
import { Printer, RefreshCw } from 'lucide-react';
import { LEVEL_EXAM_INFO } from '../data/adventureRoadmapData';
import { CONFUSING_PAIRS } from '../data/confusingPairsData';
import {
  GRAMMAR_PREVIEW,
  KANJI_PREVIEW,
  VOCAB_PREVIEW
} from '../data/curriculumPreviewData';
import {
  ALL_KANA,
  HIRAGANA_BASIC,
  HIRAGANA_ROWS,
  KATAKANA_BASIC,
  KATAKANA_ROWS,
  VOWEL_HEADERS
} from '../data/kanaData';
import { MOCK_EXAM_PAPERS } from '../data/practiceExamData';
import { JlptLevel, KanaItem, PrintSubTab, StudentState, SubDifficulty } from '../types';

interface PrintCenterViewProps {
  state: StudentState;
  subTab: PrintSubTab;
  selectedRowId: string;
  selectedPairId: string;
  onChangeSubTab: (tab: PrintSubTab) => void;
  onChangeRow: (rowId: string) => void;
  onChangePair: (pairId: string) => void;
}

const PRINT_ROW_OPTIONS = [
  ...HIRAGANA_ROWS.map((r) => ({ id: r.id, label: `히라가나 ${r.label}` })),
  ...KATAKANA_ROWS.map((r) => ({ id: r.id, label: `가타카나 ${r.label}` }))
];

const LEVELS: JlptLevel[] = ['STAGE0', 'N5', 'N4', 'N3', 'N2', 'N1'];

export const PrintCenterView: React.FC<PrintCenterViewProps> = ({
  state,
  subTab,
  selectedRowId,
  selectedPairId,
  onChangeSubTab,
  onChangeRow,
  onChangePair
}) => {
  const [posterScript, setPosterScript] = React.useState<'hiragana' | 'katakana'>('hiragana');
  const [dictScope, setDictScope] = React.useState<'learned' | 'weak' | 'hiragana' | 'katakana'>(
    'hiragana'
  );
  const [dictCount, setDictCount] = React.useState<number>(10);
  const [showAnswerKey, setShowAnswerKey] = React.useState(false);
  const [showWrongAnswersKey, setShowWrongAnswersKey] = React.useState(false);
  const [dailyLevel, setDailyLevel] = React.useState<JlptLevel>(state.targetLevel);
  const [dailySubLevel, setDailySubLevel] = React.useState<SubDifficulty>(state.subLevel);
  const [omrLevel, setOmrLevel] = React.useState<JlptLevel>(state.targetLevel);
  const [seed, setSeed] = React.useState(1);

  React.useEffect(() => {
    setDailyLevel(state.targetLevel);
    setDailySubLevel(state.subLevel);
    setOmrLevel(state.targetLevel);
  }, [state.targetLevel, state.subLevel]);

  const rowKanaItems = React.useMemo(() => {
    const matched = ALL_KANA.filter((k) => k.rowId === selectedRowId);
    return matched.length > 0 ? matched : HIRAGANA_BASIC.slice(0, 5);
  }, [selectedRowId]);

  const activePair = React.useMemo(
    () => CONFUSING_PAIRS.find((p) => p.id === selectedPairId) || CONFUSING_PAIRS[0],
    [selectedPairId]
  );

  const dictationItems = React.useMemo(() => {
    let source: KanaItem[] = HIRAGANA_BASIC;
    if (dictScope === 'katakana') {
      source = KATAKANA_BASIC;
    } else if (dictScope === 'learned') {
      const m = ALL_KANA.filter((k) => state.learnedKana.includes(k.char));
      source = m.length >= 5 ? m : HIRAGANA_BASIC.slice(0, 15);
    } else if (dictScope === 'weak') {
      const weakChars = Object.entries(state.kanaStats)
        .filter(([, s]) => s.attempts > 0 && s.correct / s.attempts < 0.85)
        .sort((a, b) => a[1].correct / a[1].attempts - b[1].correct / b[1].attempts)
        .map(([ch]) => ch);
      const m = weakChars
        .map((ch) => ALL_KANA.find((k) => k.char === ch))
        .filter((k): k is KanaItem => Boolean(k));
      source =
        m.length > 0
          ? m
          : ALL_KANA.filter((k) => ['さ', 'き', 'ぬ', 'め', 'け', 'は', 'ほ'].includes(k.char));
    }

    const copy = [...source];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = (i * 7 + seed * 13) % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(dictCount, copy.length));
  }, [dictScope, dictCount, seed, state.learnedKana, state.kanaStats]);

  const weakKanaList = React.useMemo(() => {
    return Object.entries(state.kanaStats)
      .filter(([, s]) => s.attempts > 0 && s.correct / s.attempts < 0.85)
      .map(([ch, s]) => ({
        char: ch,
        meta: ALL_KANA.find((k) => k.char === ch),
        accuracy: Math.round((s.correct / s.attempts) * 100)
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 8);
  }, [state.kanaStats]);

  const dailyVocab = React.useMemo(() => {
    const exact = VOCAB_PREVIEW.filter((v) => v.level === dailyLevel && v.subLevel === dailySubLevel);
    return exact.length > 0 ? exact : VOCAB_PREVIEW.filter((v) => v.level === dailyLevel);
  }, [dailyLevel, dailySubLevel]);

  const dailyKanji = React.useMemo(() => {
    const eff = dailyLevel === 'STAGE0' ? 'N5' : dailyLevel;
    return KANJI_PREVIEW.filter((k) => k.level === eff).slice(0, 4);
  }, [dailyLevel]);

  const dailyGrammar = React.useMemo(() => {
    return GRAMMAR_PREVIEW.filter((g) => g.level === dailyLevel).slice(0, 2);
  }, [dailyLevel]);

  const activeOmrPaper = React.useMemo(() => {
    return MOCK_EXAM_PAPERS.find((p) => p.level === omrLevel) || MOCK_EXAM_PAPERS[1];
  }, [omrLevel]);

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Control Toolbar (Hidden on Print) */}
      <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-4 space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'rowSheet' as const, label: '가나 쓰기표 (행별)' },
              { id: 'confusingSheet' as const, label: '비교 쓰기표' },
              { id: 'poster' as const, label: '오십음도 포스터' },
              { id: 'dictation' as const, label: '받아쓰기 시험지' },
              { id: 'wrongNotes' as const, label: '오답 프린트' },
              { id: 'dailySheet' as const, label: '오늘의 학습지' },
              { id: 'omrSheet' as const, label: 'OMR 답안지' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeSubTab(t.id)}
                className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                  subTab === t.id
                    ? 'bg-[#FF6B57] text-white'
                    : 'bg-[#FFF7EC] text-[#2B2340] hover:bg-[#FFEBD2]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B2340] hover:bg-[#3f345d] text-white text-sm font-extrabold cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#FFD166]" />
            <span>A4 흑백 인쇄하기</span>
          </button>
        </div>

        {/* Sub-options */}
        {subTab === 'rowSheet' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#FFE1C2]">
            <label htmlFor="print-row-select" className="text-xs font-extrabold text-[#2B2340]/65">
              행 선택:
            </label>
            <select
              id="print-row-select"
              value={selectedRowId}
              onChange={(e) => onChangeRow(e.target.value)}
              className="px-3.5 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340]"
            >
              {PRINT_ROW_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {subTab === 'confusingSheet' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#FFE1C2]">
            <span className="text-xs font-extrabold text-[#2B2340]/65">비교 짝:</span>
            {CONFUSING_PAIRS.map((pair) => (
              <button
                key={pair.id}
                type="button"
                onClick={() => onChangePair(pair.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                  activePair.id === pair.id ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
                }`}
              >
                {pair.title}
              </button>
            ))}
          </div>
        )}

        {subTab === 'poster' && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#FFE1C2]">
            <button
              type="button"
              onClick={() => setPosterScript('hiragana')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                posterScript === 'hiragana' ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
              }`}
            >
              히라가나 포스터
            </button>
            <button
              type="button"
              onClick={() => setPosterScript('katakana')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                posterScript === 'katakana' ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
              }`}
            >
              가타카나 포스터
            </button>
          </div>
        )}

        {subTab === 'dictation' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#FFE1C2]">
            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="출제 범위"
                value={dictScope}
                onChange={(e) => setDictScope(e.target.value as typeof dictScope)}
                className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold"
              >
                <option value="hiragana">히라가나 전체</option>
                <option value="katakana">가타카나 전체</option>
                <option value="learned">내가 배운 글자</option>
                <option value="weak">자주 틀리는 약점 맞춤</option>
              </select>
              <select
                aria-label="문항 수"
                value={dictCount}
                onChange={(e) => setDictCount(Number(e.target.value))}
                className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold"
              >
                <option value={10}>10문항</option>
                <option value={15}>15문항</option>
                <option value={20}>20문항</option>
              </select>
              <button
                type="button"
                onClick={() => setSeed((s) => s + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>문제 새로 섞기</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowAnswerKey((v) => !v)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold cursor-pointer ${
                showAnswerKey ? 'bg-[#4CC38A] text-white' : 'bg-[#FFF7EC] border border-[#FFE1C2] text-[#2B2340]'
              }`}
            >
              {showAnswerKey ? '답안지 보기 중 (정답 표시)' : '시험지 보기 중 (빈칸)'}
            </button>
          </div>
        )}

        {subTab === 'wrongNotes' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#FFE1C2]">
            <span className="text-xs font-bold text-[#2B2340]/70">
              저장된 오답 문제 {state.wrongNoteEntries.length}개 · 약점 가나 {weakKanaList.length}개
            </span>
            <button
              type="button"
              onClick={() => setShowWrongAnswersKey((v) => !v)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold cursor-pointer ${
                showWrongAnswersKey
                  ? 'bg-[#4CC38A] text-white'
                  : 'bg-[#FFF7EC] border border-[#FFE1C2] text-[#2B2340]'
              }`}
            >
              {showWrongAnswersKey ? '정답·해설 함께 인쇄 중' : '문제지만 인쇄 (해설 숨김)'}
            </button>
          </div>
        )}

        {subTab === 'dailySheet' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#FFE1C2]">
            <span className="text-xs font-extrabold text-[#2B2340]/65">학습지 범위:</span>
            <select
              aria-label="학습지 급수"
              value={dailyLevel}
              onChange={(e) => setDailyLevel(e.target.value as JlptLevel)}
              className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l === 'STAGE0' ? '0단계 (가나·기초)' : `JLPT ${l}`}
                </option>
              ))}
            </select>
            <select
              aria-label="학습지 세부 난이도"
              value={dailySubLevel}
              onChange={(e) => setDailySubLevel(Number(e.target.value) as SubDifficulty)}
              className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold"
            >
              {LEVEL_EXAM_INFO[dailyLevel].subLevels.map((s) => (
                <option key={s.sub} value={s.sub}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {subTab === 'omrSheet' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#FFE1C2]">
            <span className="text-xs font-extrabold text-[#2B2340]/65">OMR 모의고사 급수:</span>
            {MOCK_EXAM_PAPERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOmrLevel(p.level)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                  omrLevel === p.level ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
                }`}
              >
                {p.level === 'STAGE0' ? '0단계' : p.level}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* A4 PRINT SHEET PREVIEW (Crisp Black & White) */}
      <div className="print-sheet bg-white border-2 border-neutral-300 rounded-2xl p-8 text-black max-w-[820px] mx-auto shadow-sm">
        {/* Sheet Header */}
        <div className="border-b-2 border-black pb-3 mb-5 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-wide text-neutral-600">
              ARI JLPT – アリのにほんご · A4 학습지
            </div>
            <h2 className="text-xl font-extrabold mt-0.5">
              {subTab === 'rowSheet' && `${rowKanaItems[0]?.rowLabel || 'あ행'} 가나 쓰기 연습장`}
              {subTab === 'confusingSheet' && `헷갈리는 글자 비교 쓰기표 (${activePair.title})`}
              {subTab === 'poster' &&
                `${posterScript === 'hiragana' ? '히라가나' : '가타카나'} 오십음도 한눈에 포스터`}
              {subTab === 'dictation' &&
                `가나 받아쓰기 ${showAnswerKey ? '답안지 (교사용)' : '시험지 (학생용)'}`}
              {subTab === 'wrongNotes' &&
                `맞춤 오답 노트 복습 프린트 (${showWrongAnswersKey ? '정답 포함' : '재도전용'})`}
              {subTab === 'dailySheet' &&
                `오늘의 학습지 (${dailyLevel === 'STAGE0' ? '0단계' : dailyLevel} · ${dailySubLevel}단계)`}
              {subTab === 'omrSheet' && `${activeOmrPaper.title} · OMR 답안지`}
            </h2>
          </div>
          <div className="text-xs font-semibold text-right">
            <div>이름: {state.studentName}</div>
            <div>날짜: ____년 __월 __일</div>
          </div>
        </div>

        {/* 1. ROW WRITING SHEET */}
        {subTab === 'rowSheet' && (
          <div className="space-y-5">
            {rowKanaItems.map((item) => (
              <div key={item.id} className="border border-neutral-400 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs mb-2 pb-1.5 border-b border-neutral-200">
                  <div>
                    <span className="font-bold text-sm mr-2">
                      {item.ko} [{item.romaji}]
                    </span>
                    <span className="text-neutral-600">
                      대표 단어: {item.exampleWord} ({item.exampleMeaning})
                    </span>
                  </div>
                  <span className="text-neutral-500">획순: {item.strokeHint}</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  <div className="aspect-square border-2 border-black flex items-center justify-center font-jp text-4xl font-bold">
                    {item.char}
                  </div>
                  {[1, 2, 3].map((n) => (
                    <div
                      key={`trace_${n}`}
                      className="aspect-square border border-neutral-400 relative flex items-center justify-center"
                    >
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-neutral-300" />
                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-neutral-300" />
                      <span className="font-jp text-4xl font-bold text-neutral-300">{item.char}</span>
                    </div>
                  ))}
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={`blank_${n}`}
                      className="aspect-square border border-neutral-400 relative flex items-center justify-center"
                    >
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-neutral-300" />
                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-neutral-300" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. CONFUSING PAIR COMPARISON SHEET */}
        {subTab === 'confusingSheet' && (
          <div className="space-y-5">
            <div className="border-2 border-black rounded-lg p-3.5 text-sm">
              <div className="font-bold mb-1">💡 구별 핵심 포인트</div>
              <p>{activePair.summaryTip}</p>
            </div>
            {activePair.points.map((pt) => (
              <div key={pt.char} className="border border-neutral-400 rounded-lg p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-1.5">
                  <span className="font-bold text-sm">
                    {pt.char} — {pt.ko} [{pt.romaji}]
                  </span>
                  <span className="text-neutral-700">{pt.visualCue}</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  <div className="aspect-square border-2 border-black flex items-center justify-center font-jp text-4xl font-bold">
                    {pt.char}
                  </div>
                  {[1, 2, 3].map((n) => (
                    <div
                      key={`ct_${n}`}
                      className="aspect-square border border-neutral-400 relative flex items-center justify-center"
                    >
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-neutral-300" />
                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-neutral-300" />
                      <span className="font-jp text-4xl font-bold text-neutral-300">{pt.char}</span>
                    </div>
                  ))}
                  {[1, 2, 3, 4].map((n) => (
                    <div key={`cb_${n}`} className="aspect-square border border-neutral-400 relative">
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-neutral-300" />
                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-neutral-300" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. GOJUON A4 POSTER */}
        {subTab === 'poster' && (
          <table className="w-full border-collapse border-2 border-black text-center">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-black py-2 px-1 text-xs w-16">행</th>
                {VOWEL_HEADERS.map((vh) => (
                  <th key={vh} className="border border-black py-2 px-1 text-xs font-bold">
                    {vh}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(posterScript === 'hiragana' ? HIRAGANA_ROWS : KATAKANA_ROWS).map((row) => (
                <tr key={row.id}>
                  <td className="border border-black py-2 px-1 font-bold text-xs bg-neutral-50">
                    {row.label}
                  </td>
                  {row.chars.map((ch, idx) => {
                    const meta = ALL_KANA.find((k) => k.char === ch);
                    return (
                      <td key={`${row.id}_${idx}`} className="border border-black py-2 px-1 h-16">
                        {ch ? (
                          <div>
                            <div className="font-jp text-2xl font-bold leading-tight">{ch}</div>
                            <div className="text-[11px] font-semibold text-neutral-700">
                              {meta?.ko} ({meta?.romaji})
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 4. DICTATION TEST + ANSWER KEY */}
        {subTab === 'dictation' && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-700">
              {showAnswerKey
                ? '※ 정답을 확인하고 틀린 글자는 쓰기 연습장에서 3번씩 써 보세요.'
                : '※ 아래 한글 발음과 로마자를 보고 빈칸에 알맞은 일본어 가나를 바르게 써 보세요.'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {dictationItems.map((item, idx) => (
                <div
                  key={`${item.id}_${idx}`}
                  className="border border-black rounded-lg p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-neutral-500">
                      {idx + 1}번 · {item.script === 'hiragana' ? '히라가나' : '가타카나'}
                    </div>
                    <div className="text-lg font-extrabold mt-0.5">
                      {item.ko}{' '}
                      <span className="font-num text-sm font-normal">[{item.romaji}]</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 border-2 border-black relative flex items-center justify-center shrink-0">
                    <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-neutral-300" />
                    <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-neutral-300" />
                    {showAnswerKey && (
                      <span className="font-jp text-3xl font-bold relative z-10">{item.char}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. WRONG NOTES PRINT */}
        {subTab === 'wrongNotes' && (
          <div className="space-y-5">
            {weakKanaList.length > 0 && (
              <div className="border-2 border-black rounded-lg p-3.5 space-y-2">
                <div className="text-xs font-extrabold">
                  1) 정답률 85% 미만 약점 가나 집중 쓰기 연습
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {weakKanaList.map((wk) => (
                    <div
                      key={wk.char}
                      className="border border-neutral-400 rounded p-2 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-jp text-2xl font-bold">{wk.char}</span>
                        <div className="text-[11px] text-neutral-600">
                          {wk.meta?.ko} ({wk.accuracy}%)
                        </div>
                      </div>
                      <div className="w-10 h-10 border border-dashed border-neutral-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="text-xs font-extrabold">
                2) 실전 · 한자 · 독해 · 청해 오답 다시 풀기 ({state.wrongNoteEntries.length}문항)
              </div>
              {state.wrongNoteEntries.length === 0 ? (
                <div className="border border-neutral-300 rounded-lg p-8 text-center text-xs text-neutral-600">
                  현재 저장된 오답 문제가 없습니다! 학습이나 모의고사에서 오답이 생기면 자동으로 이 용지에 모아져요.
                </div>
              ) : (
                state.wrongNoteEntries.slice(0, 12).map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="border border-neutral-400 rounded-lg p-3.5 space-y-2 break-inside-avoid"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                      <span>
                        문제 {idx + 1} · {entry.level} · {entry.title}
                      </span>
                      <span>내 답안 확인: [ ____ ]</span>
                    </div>
                    <div className="text-sm font-bold">{entry.prompt}</div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {entry.options.map((opt, optIdx) => (
                        <div key={optIdx} className="font-jp">
                          {optIdx + 1}) {opt}
                        </div>
                      ))}
                    </div>
                    {showWrongAnswersKey && (
                      <div className="border-t border-dashed border-neutral-300 pt-1.5 text-xs">
                        <strong>정답: {entry.correctIndex + 1}번</strong> · {entry.explanation}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 6. TODAY'S CUSTOM STUDY SHEET */}
        {subTab === 'dailySheet' && (
          <div className="space-y-5">
            <div className="border border-black rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-2">
              <span>
                오늘 목표: 새 글자 <strong>{state.missionSettings.dailyNewChars}자</strong> · 일일 루틴 [ ] 단어 [ ] 문법 [ ] 독해
              </span>
              <span>학습 범위: {dailyLevel === 'STAGE0' ? '0단계' : `JLPT ${dailyLevel}`}</span>
            </div>

            {/* Section A: Today's Vocab */}
            <div className="space-y-2">
              <div className="text-sm font-extrabold">A. 오늘의 핵심 단어 쓰기 &amp; 뜻 확인</div>
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="border border-black p-2 text-left">단어</th>
                    <th className="border border-black p-2 text-left">읽기</th>
                    <th className="border border-black p-2 text-left">뜻</th>
                    <th className="border border-black p-2 w-40 text-left">따라 쓰기</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyVocab.slice(0, 6).map((v) => (
                    <tr key={v.id}>
                      <td className="border border-black p-2 font-jp text-sm font-bold">{v.word}</td>
                      <td className="border border-black p-2 font-jp">{v.reading}</td>
                      <td className="border border-black p-2 font-semibold">{v.meaning}</td>
                      <td className="border border-black p-2 h-9" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section B: Target Kanji */}
            <div className="space-y-2">
              <div className="text-sm font-extrabold">B. 필수 한자 한 글자씩 다지기</div>
              <div className="grid grid-cols-2 gap-3">
                {dailyKanji.map((kj) => (
                  <div key={kj.id} className="border border-black rounded-lg p-2.5 flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center font-jp text-3xl font-bold shrink-0">
                      {kj.kanji}
                    </div>
                    <div className="text-xs flex-1 space-y-0.5">
                      <div className="font-bold">
                        {kj.meaningKo} (한국음: {kj.soundKo})
                      </div>
                      <div className="text-neutral-700 font-jp">
                        음: {kj.onyomi} / 훈: {kj.kunyomi}
                      </div>
                      <div className="border-b border-dashed border-neutral-400 pt-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Today's Grammar Notes */}
            <div className="space-y-2">
              <div className="text-sm font-extrabold">C. 오늘의 핵심 문법 &amp; 한국인 주의 포인트</div>
              <div className="space-y-2">
                {dailyGrammar.map((g) => (
                  <div key={g.id} className="border border-neutral-500 rounded-lg p-3 text-xs space-y-1">
                    <div className="font-extrabold text-sm font-jp">
                      {g.pattern} — <span className="font-sans text-xs">{g.meaning}</span>
                    </div>
                    <div>접속: {g.formula}</div>
                    <div>주의: {g.koreanTrap}</div>
                    <div className="font-jp text-neutral-700">
                      예문: {g.exampleJp} ({g.exampleKo})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. MOCK EXAM PRINTABLE OMR SHEET */}
        {subTab === 'omrSheet' && (
          <div className="space-y-5">
            <div className="border-2 border-black rounded-lg p-3.5 text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-extrabold text-sm">
                  응시 급수: {activeOmrPaper.level === 'STAGE0' ? '0단계 가나 총정리' : `JLPT ${activeOmrPaper.level}`}
                </div>
                <div className="text-neutral-700 mt-0.5">
                  ※ 검은색 펜이나 연필로 해당하는 번호의 원 안을 빈틈없이 칠하세요. (예: ●)
                </div>
              </div>
              <div className="border border-black px-3 py-2 text-right tabular-nums">
                <div>합격 기준: {activeOmrPaper.passScore} / {activeOmrPaper.maxScore}점</div>
                <div>총점: _____ / {activeOmrPaper.maxScore}점 (합격 / 불합격)</div>
              </div>
            </div>

            <div className="space-y-4">
              {(() => {
                let globalQ = 1;
                return activeOmrPaper.sections.map((sec) => (
                  <div key={sec.id} className="border border-black rounded-lg overflow-hidden">
                    <div className="bg-neutral-100 border-b border-black px-3.5 py-2 flex items-center justify-between text-xs font-extrabold">
                      <span>{sec.name}</span>
                      <span className="tabular-nums">
                        배점 {sec.maxScore}점 · 과락 기준 {sec.minPassScore}점 미만 · 득점: ___점
                      </span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-neutral-300">
                      {sec.questions.map((q) => {
                        const qNo = globalQ++;
                        return (
                          <div
                            key={q.id}
                            className="px-3.5 py-2.5 border-b border-neutral-300 flex items-center justify-between text-xs"
                          >
                            <span className="font-num font-extrabold w-10">
                              Q{String(qNo).padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-3 font-num">
                              {[1, 2, 3, 4].map((num) => (
                                <span
                                  key={num}
                                  className="w-6 h-6 rounded-full border border-black inline-flex items-center justify-center text-[11px] font-bold"
                                >
                                  {num}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
