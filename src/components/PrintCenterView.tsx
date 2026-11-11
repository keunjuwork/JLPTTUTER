import React from 'react';
import { Printer, RefreshCw } from 'lucide-react';
import { CONFUSING_PAIRS } from '../data/confusingPairsData';
import {
  ALL_KANA,
  HIRAGANA_BASIC,
  HIRAGANA_ROWS,
  KATAKANA_BASIC,
  KATAKANA_ROWS,
  VOWEL_HEADERS
} from '../data/kanaData';
import { KanaItem, PrintSubTab, StudentState } from '../types';

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
  const [dictScope, setDictScope] = React.useState<'learned' | 'weak' | 'hiragana' | 'katakana'>('hiragana');
  const [dictCount, setDictCount] = React.useState<number>(10);
  const [showAnswerKey, setShowAnswerKey] = React.useState(false);
  const [seed, setSeed] = React.useState(1);

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
      const m = weakChars.map((ch) => ALL_KANA.find((k) => k.char === ch)).filter((k): k is KanaItem => Boolean(k));
      source = m.length > 0 ? m : ALL_KANA.filter((k) => ['さ', 'き', 'ぬ', 'め', 'け', 'は', 'ほ'].includes(k.char));
    }

    // Deterministic shuffle using seed
    const copy = [...source];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = (i * 7 + seed * 13) % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(dictCount, copy.length));
  }, [dictScope, dictCount, seed, state.learnedKana, state.kanaStats]);

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Control Toolbar (Hidden on Print) */}
      <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-4 space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'rowSheet' as const, label: '가나 쓰기표 (행별)' },
              { id: 'confusingSheet' as const, label: '헷갈리는 글자 비교 쓰기표' },
              { id: 'poster' as const, label: '오십음도 포스터' },
              { id: 'dictation' as const, label: '받아쓰기 시험지 · 답안지' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeSubTab(t.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
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
      </div>

      {/* A4 PRINT SHEET PREVIEW (Crisp Black & White) */}
      <div className="print-sheet bg-white border-2 border-neutral-300 rounded-2xl p-8 text-black max-w-[820px] mx-auto shadow-sm">
        {/* Sheet Header */}
        <div className="border-b-2 border-black pb-3 mb-5 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-wide text-neutral-600">
              미라이 JLPT – にほんご 모험 · A4 학습지
            </div>
            <h2 className="text-xl font-extrabold mt-0.5">
              {subTab === 'rowSheet' && `${rowKanaItems[0]?.rowLabel || 'あ행'} 가나 쓰기 연습장`}
              {subTab === 'confusingSheet' && `헷갈리는 글자 비교 쓰기표 (${activePair.title})`}
              {subTab === 'poster' && `${posterScript === 'hiragana' ? '히라가나' : '가타카나'} 오십음도 한눈에 포스터`}
              {subTab === 'dictation' && `가나 받아쓰기 ${showAnswerKey ? '답안지 (교사용)' : '시험지 (학생용)'}`}
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
                    <span className="font-bold text-sm mr-2">{item.ko} [{item.romaji}]</span>
                    <span className="text-neutral-600">대표 단어: {item.exampleWord} ({item.exampleMeaning})</span>
                  </div>
                  <span className="text-neutral-500">획순: {item.strokeHint}</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {/* Reference Box */}
                  <div className="aspect-square border-2 border-black flex items-center justify-center font-jp text-4xl font-bold">
                    {item.char}
                  </div>
                  {/* 3 Traced Faint Guide Boxes */}
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
                  {/* 4 Blank Grid Boxes */}
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
                    <div key={`ct_${n}`} className="aspect-square border border-neutral-400 relative flex items-center justify-center">
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
                  <td className="border border-black py-2 px-1 font-bold text-xs bg-neutral-50">{row.label}</td>
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
                      {item.ko} <span className="font-num text-sm font-normal">[{item.romaji}]</span>
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
      </div>
    </div>
  );
};
