import React from 'react';
import {
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Eye,
  EyeOff,
  Languages,
  Layers,
  List,
  RotateCcw,
  Sparkles,
  Volume2
} from 'lucide-react';
import { LEVEL_EXAM_INFO } from '../data/adventureRoadmapData';
import {
  GRAMMAR_PREVIEW,
  KANJI_PREVIEW,
  VERB_CONJUGATION_DATA,
  VOCAB_PREVIEW
} from '../data/curriculumPreviewData';
import { playSfx, speakJapanese } from '../lib/speech';
import { WRONG_REASON_META } from '../lib/storage';
import {
  JlptLevel,
  LastStudyLocation,
  StudentState,
  SubDifficulty,
  VerbFormKey,
  WrongNoteEntry,
  WrongReasonTag
} from '../types';

const LEVELS: JlptLevel[] = ['STAGE0', 'N5', 'N4', 'N3', 'N2', 'N1'];
type ScopeMode = 'sublevel' | 'level' | 'all';

const ScopeHeaderBar: React.FC<{
  targetLevel: JlptLevel;
  subLevel: SubDifficulty;
  scopeMode: ScopeMode;
  onChangeScopeMode: (m: ScopeMode) => void;
  onChangeLevelScope: (lvl: JlptLevel, sub: SubDifficulty) => void;
}> = ({ targetLevel, subLevel, scopeMode, onChangeScopeMode, onChangeLevelScope }) => (
  <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[22px] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-extrabold text-[#2B2340]/60 mr-1">학습 범위</span>
      <select
        aria-label="급수 선택"
        value={targetLevel}
        onChange={(e) => onChangeLevelScope(e.target.value as JlptLevel, subLevel)}
        className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
      >
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            {l === 'STAGE0' ? '0단계 (가나·기초)' : `JLPT ${l}`}
          </option>
        ))}
      </select>
      <select
        aria-label="세부 난이도 선택"
        value={subLevel}
        onChange={(e) => onChangeLevelScope(targetLevel, Number(e.target.value) as SubDifficulty)}
        className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
      >
        {LEVEL_EXAM_INFO[targetLevel].subLevels.map((s) => (
          <option key={s.sub} value={s.sub}>
            {s.label}
          </option>
        ))}
      </select>
    </div>

    <div className="flex items-center gap-1.5 bg-[#FFF7EC] p-1 rounded-full border border-[#FFE1C2]">
      {[
        { id: 'sublevel' as const, label: '선택 난이도만' },
        { id: 'level' as const, label: '현재 급수 전체' },
        { id: 'all' as const, label: '전체 보기 (0단계~N1)' }
      ].map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChangeScopeMode(m.id)}
          className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
            scopeMode === m.id ? 'bg-[#2B2340] text-white' : 'text-[#2B2340]/70 hover:text-[#2B2340]'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  </div>
);

// ==================== 1. VOCAB PANEL ====================
interface VocabPanelProps {
  state: StudentState;
  initialVocabId?: string;
  onChangeLevelScope: (lvl: JlptLevel, sub: SubDifficulty) => void;
  onToggleVocabLearned: (id: string) => void;
  onToggleVocabBookmark: (id: string) => void;
  onUpdateLastLocation: (loc: LastStudyLocation) => void;
}

export const VocabPanel: React.FC<VocabPanelProps> = ({
  state,
  initialVocabId,
  onChangeLevelScope,
  onToggleVocabLearned,
  onToggleVocabBookmark,
  onUpdateLastLocation
}) => {
  const [scopeMode, setScopeMode] = React.useState<ScopeMode>('level');
  const [viewMode, setViewMode] = React.useState<'list' | 'flashcard'>('list');
  const [hideFurigana, setHideFurigana] = React.useState(false);
  const [onlyBookmarks, setOnlyBookmarks] = React.useState(false);
  const [cardIdx, setCardIdx] = React.useState(0);
  const [cardFlipped, setCardFlipped] = React.useState(false);

  const filteredVocab = React.useMemo(() => {
    let base = VOCAB_PREVIEW;
    if (scopeMode === 'sublevel') {
      const exact = VOCAB_PREVIEW.filter(
        (v) => v.level === state.targetLevel && v.subLevel === state.subLevel
      );
      base = exact.length > 0 ? exact : VOCAB_PREVIEW.filter((v) => v.level === state.targetLevel);
    } else if (scopeMode === 'level') {
      base = VOCAB_PREVIEW.filter((v) => v.level === state.targetLevel);
    }
    if (onlyBookmarks) {
      base = base.filter((v) => state.bookmarkedVocab.includes(v.id));
    }
    return base;
  }, [scopeMode, state.targetLevel, state.subLevel, onlyBookmarks, state.bookmarkedVocab]);

  React.useEffect(() => {
    setCardIdx(0);
    setCardFlipped(false);
  }, [scopeMode, state.targetLevel, state.subLevel, onlyBookmarks]);

  React.useEffect(() => {
    if (!initialVocabId) return;
    const targetItem = VOCAB_PREVIEW.find((v) => v.id === initialVocabId);
    if (!targetItem) return;
    if (targetItem.level !== state.targetLevel) {
      setScopeMode('all');
    }
    const idxInCurrent = filteredVocab.findIndex((v) => v.id === initialVocabId);
    if (idxInCurrent >= 0) {
      setViewMode('flashcard');
      setCardIdx(idxInCurrent);
      setCardFlipped(false);
    }
  }, [initialVocabId, filteredVocab, state.targetLevel]);

  const safeIdx = filteredVocab.length > 0 ? Math.min(cardIdx, filteredVocab.length - 1) : 0;
  const activeCard = filteredVocab[safeIdx] || null;

  React.useEffect(() => {
    const target = viewMode === 'flashcard' && activeCard ? activeCard : filteredVocab[0];
    if (!target) return;
    onUpdateLastLocation({
      tab: 'study',
      studySubTab: 'vocab',
      vocabId: target.id,
      label: `단어장 · ${target.word} (${target.meaning})`,
      updatedAt: new Date().toISOString()
    });
  }, [viewMode, activeCard?.id]);

  return (
    <div className="space-y-5">
      <ScopeHeaderBar
        targetLevel={state.targetLevel}
        subLevel={state.subLevel}
        scopeMode={scopeMode}
        onChangeScopeMode={setScopeMode}
        onChangeLevelScope={onChangeLevelScope}
      />

      {/* Toolbar */}
      <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold cursor-pointer ${
              viewMode === 'list' ? 'bg-[#FF6B57] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>목록 보기</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('flashcard')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold cursor-pointer ${
              viewMode === 'flashcard' ? 'bg-[#FF6B57] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>플래시카드</span>
          </button>
          <button
            type="button"
            onClick={() => setHideFurigana((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-2 cursor-pointer ${
              hideFurigana
                ? 'bg-[#2B2340] border-[#2B2340] text-white'
                : 'bg-[#FFF7EC] border-[#FFE1C2] text-[#2B2340]'
            }`}
          >
            {hideFurigana ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hideFurigana ? '후리가나 숨김 중' : '후리가나 숨기기'}</span>
          </button>
          <button
            type="button"
            onClick={() => setOnlyBookmarks((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border-2 cursor-pointer ${
              onlyBookmarks
                ? 'bg-[#FFD166] border-[#FFD166] text-[#2B2340]'
                : 'bg-white border-[#FFE1C2] text-[#2B2340]/75'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>북마크만 ({state.bookmarkedVocab.length})</span>
          </button>
        </div>

        <div className="text-xs font-extrabold text-[#2B2340]/70 tabular-nums">
          표시 {filteredVocab.length}단어 · 외운 단어 {state.learnedVocab.length}/{VOCAB_PREVIEW.length}
        </div>
      </div>

      {filteredVocab.length === 0 ? (
        <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-10 text-center space-y-2">
          <div className="text-sm font-extrabold text-[#2B2340]">조건에 맞는 단어가 없어요.</div>
          <p className="text-xs text-[#2B2340]/65">북마크 필터를 끄거나 「전체 보기」를 선택해 보세요.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVocab.map((v) => {
            const learned = state.learnedVocab.includes(v.id);
            const bookmarked = state.bookmarkedVocab.includes(v.id);
            return (
              <div
                key={v.id}
                className={`bg-white border-[3px] rounded-[24px] p-5 space-y-3 transition-colors ${
                  learned ? 'border-[#4CC38A]' : 'border-[#FFE1C2]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-[10px] font-extrabold text-[#FF6B57]">
                        {v.level === 'STAGE0' ? '0단계' : v.level} · {v.subLevel}단계
                      </span>
                      {learned && (
                        <span className="text-[10px] font-extrabold text-[#4CC38A]">✓ 암기 완료</span>
                      )}
                    </div>
                    <div className="font-jp jp-card-glyph text-2xl sm:text-3xl font-extrabold text-[#2B2340] mt-1.5">
                      {v.word}
                    </div>
                    {!hideFurigana ? (
                      <div className="text-xs font-bold text-[#FF6B57] mt-0.5">
                        <span className="font-jp">{v.reading}</span> · [{v.romaji}]
                      </div>
                    ) : (
                      <div className="text-[11px] font-bold text-[#2B2340]/45 mt-0.5">
                        (후리가나 숨김 상태)
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          speakJapanese(v.word, 1.0);
                          onUpdateLastLocation({
                            tab: 'study',
                            studySubTab: 'vocab',
                            vocabId: v.id,
                            label: `단어장 · ${v.word} (${v.meaning})`,
                            updatedAt: new Date().toISOString()
                          });
                        }}
                        className="w-9 h-9 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white flex items-center justify-center cursor-pointer"
                        title="보통 속도 듣기"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => speakJapanese(v.word, 0.65)}
                        className="px-2.5 h-9 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] hover:bg-[#FFEBD2] text-[11px] font-extrabold text-[#2B2340] cursor-pointer"
                        title="천천히 듣기"
                      >
                        0.65x
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-base font-extrabold text-[#2B2340]">{v.meaning}</div>

                <div className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-jp text-sm font-bold text-[#2B2340]">{v.exampleJp}</div>
                    <button
                      type="button"
                      onClick={() => speakJapanese(v.exampleJp, 0.9)}
                      className="text-xs font-bold text-[#FF6B57] hover:underline shrink-0 cursor-pointer"
                    >
                      🔊 예문
                    </button>
                  </div>
                  <div className="text-xs text-[#2B2340]/75">{v.exampleKo}</div>
                  <div className="text-[11px] text-[#2B2340]/65 pt-1 border-t border-[#FFE1C2]/70">
                    💡 {v.tip}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!learned) playSfx('correct');
                      onToggleVocabLearned(v.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer ${
                      learned
                        ? 'bg-[#4CC38A] text-white'
                        : 'bg-[#2B2340] hover:bg-[#3f345d] text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{learned ? '외웠어요 완료!' : '외웠어요 (+15 EXP)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleVocabBookmark(v.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 cursor-pointer ${
                      bookmarked
                        ? 'bg-[#FFD166]/35 border-[#FFD166] text-[#2B2340]'
                        : 'bg-white border-[#FFE1C2] text-[#2B2340]/70 hover:bg-[#FFF7EC]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{bookmarked ? '헷갈려요 해제' : '헷갈려요'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        activeCard && (
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-8 max-w-xl mx-auto space-y-5 text-center">
            <div className="flex items-center justify-between text-xs font-bold text-[#2B2340]/60 tabular-nums">
              <span>
                {activeCard.level === 'STAGE0' ? '0단계' : activeCard.level} · {activeCard.subLevel}단계
              </span>
              <span>
                {safeIdx + 1} / {filteredVocab.length}
              </span>
            </div>

            <div
              onClick={() => setCardFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setCardFlipped((f) => !f);
              }}
              className="rounded-[24px] bg-[#FFF7EC] border-2 border-[#FFE1C2] p-8 min-h-[220px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FF6B57] transition-colors"
            >
              <div className="font-jp jp-card-glyph-center text-5xl font-extrabold text-[#2B2340]">{activeCard.word}</div>
              {(!hideFurigana || cardFlipped) && (
                <div className="text-sm font-bold text-[#FF6B57]">
                  <span className="font-jp">{activeCard.reading}</span> [{activeCard.romaji}]
                </div>
              )}

              {cardFlipped ? (
                <div className="space-y-2 pt-2 border-t border-[#FFE1C2] w-full">
                  <div className="text-xl font-extrabold text-[#2B2340]">{activeCard.meaning}</div>
                  <div className="font-jp text-sm font-bold text-[#2B2340]/85">{activeCard.exampleJp}</div>
                  <div className="text-xs text-[#2B2340]/70">{activeCard.exampleKo}</div>
                </div>
              ) : (
                <div className="text-xs font-bold text-[#2B2340]/50 mt-2">
                  카드를 누르면 뜻과 예문이 나와요!
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => speakJapanese(activeCard.word, 1.0)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF6B57] text-white text-xs font-extrabold cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>보통 (1.0x)</span>
              </button>
              <button
                type="button"
                onClick={() => speakJapanese(activeCard.word, 0.65)}
                className="px-4 py-2 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-extrabold text-[#2B2340] cursor-pointer"
              >
                🐢 천천히 (0.65x)
              </button>
              <button
                type="button"
                onClick={() => onToggleVocabLearned(activeCard.id)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold cursor-pointer ${
                  state.learnedVocab.includes(activeCard.id)
                    ? 'bg-[#4CC38A] text-white'
                    : 'bg-[#2B2340] text-white'
                }`}
              >
                {state.learnedVocab.includes(activeCard.id) ? '✓ 외웠어요' : '외웠어요'}
              </button>
              <button
                type="button"
                onClick={() => onToggleVocabBookmark(activeCard.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold border-2 cursor-pointer ${
                  state.bookmarkedVocab.includes(activeCard.id)
                    ? 'bg-[#FFD166] border-[#FFD166] text-[#2B2340]'
                    : 'bg-white border-[#FFE1C2] text-[#2B2340]/70'
                }`}
              >
                북마크
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#FFE1C2]">
              <button
                type="button"
                onClick={() => {
                  setCardIdx((i) => (i - 1 + filteredVocab.length) % filteredVocab.length);
                  setCardFlipped(false);
                }}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전 카드</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCardIdx((i) => (i + 1) % filteredVocab.length);
                  setCardFlipped(false);
                }}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#2B2340] text-white text-xs font-bold cursor-pointer"
              >
                <span>다음 카드</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

// ==================== 2. KANJI TRAINER PANEL ====================
interface KanjiPanelProps {
  state: StudentState;
  initialKanjiId?: string;
  onChangeLevelScope: (lvl: JlptLevel, sub: SubDifficulty) => void;
  onToggleKanjiLearned: (id: string) => void;
  onToggleKanjiBookmark: (id: string) => void;
  onRecordWrongNote: (entry: Omit<WrongNoteEntry, 'id' | 'createdAt'>) => string;
  onTagWrongNote: (entryId: string, reasonTag: WrongReasonTag) => void;
  onGrantStudyExp: (expGain: number, reason: string) => void;
  onUpdateLastLocation: (loc: LastStudyLocation) => void;
}

export const KanjiTrainerPanel: React.FC<KanjiPanelProps> = ({
  state,
  initialKanjiId,
  onChangeLevelScope,
  onToggleKanjiLearned,
  onToggleKanjiBookmark,
  onRecordWrongNote,
  onTagWrongNote,
  onGrantStudyExp,
  onUpdateLastLocation
}) => {
  const [scopeMode, setScopeMode] = React.useState<ScopeMode>('level');
  const effectiveLevel = state.targetLevel === 'STAGE0' ? 'N5' : state.targetLevel;

  const filteredKanji = React.useMemo(() => {
    if (scopeMode === 'all') return KANJI_PREVIEW;
    if (scopeMode === 'sublevel') {
      const exact = KANJI_PREVIEW.filter(
        (k) => k.level === effectiveLevel && k.subLevel === state.subLevel
      );
      return exact.length > 0 ? exact : KANJI_PREVIEW.filter((k) => k.level === effectiveLevel);
    }
    return KANJI_PREVIEW.filter((k) => k.level === effectiveLevel);
  }, [scopeMode, effectiveLevel, state.subLevel]);

  const [selectedId, setSelectedId] = React.useState(
    () => initialKanjiId || filteredKanji[0]?.id || KANJI_PREVIEW[0].id
  );
  React.useEffect(() => {
    if (!initialKanjiId) return;
    if (!filteredKanji.some((k) => k.id === initialKanjiId)) {
      setScopeMode('all');
    }
    setSelectedId(initialKanjiId);
  }, [initialKanjiId, filteredKanji]);

  React.useEffect(() => {
    if (!filteredKanji.some((k) => k.id === selectedId) && filteredKanji[0]) {
      setSelectedId(filteredKanji[0].id);
    }
  }, [filteredKanji, selectedId]);

  const activeKanji = filteredKanji.find((k) => k.id === selectedId) || filteredKanji[0] || KANJI_PREVIEW[0];

  React.useEffect(() => {
    onUpdateLastLocation({
      tab: 'study',
      studySubTab: 'kanji',
      kanjiId: activeKanji.id,
      label: `한자 트레이너 · ${activeKanji.kanji} (${activeKanji.meaningKo})`,
      updatedAt: new Date().toISOString()
    });
  }, [activeKanji.id]);

  // Kanji Stroke Drawing Canvas
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  const clearCanvas = React.useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx?.clearRect(0, 0, c.width, c.height);
  }, []);

  React.useEffect(() => {
    clearCanvas();
  }, [activeKanji.id, clearCanvas]);

  const getPt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * c.width,
      y: ((e.clientY - rect.top) / rect.height) * c.height
    };
  };

  // Kanji 5-question quick quiz
  const [quiz, setQuiz] = React.useState<{
    items: typeof KANJI_PREVIEW;
    idx: number;
    options: string[];
    picked: string | null;
    correct: number;
    done: boolean;
    wrongNoteId: string | null;
    selectedTag?: WrongReasonTag;
  } | null>(null);

  const buildOptions = (target: (typeof KANJI_PREVIEW)[0]) => {
    const others = KANJI_PREVIEW.filter((k) => k.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((k) => `${k.meaningKo} (${k.onyomi})`);
    return [`${target.meaningKo} (${target.onyomi})`, ...others].sort(() => Math.random() - 0.5);
  };

  const startKanjiQuiz = () => {
    const source = [...filteredKanji].sort(() => Math.random() - 0.5).slice(0, 5);
    while (source.length < 5) {
      source.push(KANJI_PREVIEW[source.length % KANJI_PREVIEW.length]);
    }
    setQuiz({
      items: source,
      idx: 0,
      options: buildOptions(source[0]),
      picked: null,
      correct: 0,
      done: false,
      wrongNoteId: null
    });
  };

  const advanceKanjiQuiz = React.useCallback((nextCorrectCount: number) => {
    setQuiz((prev) => {
      if (!prev) return null;
      if (prev.idx + 1 >= prev.items.length) {
        onGrantStudyExp(nextCorrectCount * 15 + 15, '한자 5문항 퀴즈 완료');
        return { ...prev, done: true, wrongNoteId: null, selectedTag: undefined };
      }
      const nextItem = prev.items[prev.idx + 1];
      return {
        ...prev,
        idx: prev.idx + 1,
        options: buildOptions(nextItem),
        picked: null,
        wrongNoteId: null,
        selectedTag: undefined
      };
    });
  }, [onGrantStudyExp]);

  const handleKanjiQuizAnswer = (opt: string) => {
    if (!quiz || quiz.picked) return;
    const current = quiz.items[quiz.idx];
    const rightAns = `${current.meaningKo} (${current.onyomi})`;
    const isOk = opt === rightAns;
    playSfx(isOk ? 'correct' : 'wrong');

    let wrongId: string | null = null;
    if (!isOk) {
      wrongId = onRecordWrongNote({
        sourceType: 'kanji',
        level: current.level,
        title: `한자 「${current.kanji}」 훈음 구별`,
        prompt: `한자 「${current.kanji}」의 뜻과 대표 음독은?`,
        options: quiz.options,
        correctIndex: quiz.options.indexOf(rightAns),
        pickedIndex: quiz.options.indexOf(opt),
        explanation: `「${current.kanji}」 = ${current.meaningKo} · 한국음 「${current.soundKo}」 · 일본 음독 ${current.onyomi} · 훈독 ${current.kunyomi}`
      });
    }

    const nextCorrect = quiz.correct + (isOk ? 1 : 0);
    setQuiz({ ...quiz, picked: opt, correct: nextCorrect, wrongNoteId: wrongId, selectedTag: undefined });

    if (isOk) {
      setTimeout(() => {
        advanceKanjiQuiz(nextCorrect);
      }, 650);
    }
  };

  return (
    <div className="space-y-5">
      <ScopeHeaderBar
        targetLevel={state.targetLevel}
        subLevel={state.subLevel}
        scopeMode={scopeMode}
        onChangeScopeMode={setScopeMode}
        onChangeLevelScope={onChangeLevelScope}
      />

      {state.targetLevel === 'STAGE0' && scopeMode !== 'all' && (
        <div className="rounded-2xl bg-[#FFF3CC] border-2 border-[#FFD166] px-4 py-2.5 text-xs font-bold text-[#7A4F01]">
          현재 0단계이므로 기초 「N5 한자」 미리보기를 표시하고 있어요. 상단에서 N5~N1을 고르거나 전체 보기를 눌러 다른 급수 한자도 탐색해 보세요!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Kanji Tiles + Quick Quiz */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#2B2340]">
                한자 선택 ({filteredKanji.length}자)
              </h3>
              <span className="text-xs font-bold text-[#4CC38A] tabular-nums">
                완료 {state.learnedKanji.length}/{KANJI_PREVIEW.length}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {filteredKanji.map((item) => {
                const learned = state.learnedKanji.includes(item.id);
                const active = item.id === activeKanji.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      speakJapanese(item.kanji);
                    }}
                    className={`rounded-2xl border-[3px] py-2.5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      active
                        ? 'bg-[#FF6B57] border-[#FF6B57] text-white scale-105'
                        : learned
                          ? 'bg-[#4CC38A]/10 border-[#4CC38A] text-[#2B2340]'
                          : 'bg-[#FFFDF9] border-[#FFE1C2] text-[#2B2340] hover:border-[#FFB09E]'
                    }`}
                  >
                    <span className="font-jp text-2xl font-extrabold leading-none">{item.kanji}</span>
                    <span className={`text-[10px] font-bold mt-1 ${active ? 'text-white/90' : 'text-[#2B2340]/60'}`}>
                      {item.soundKo}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={startKanjiQuiz}
              className="w-full py-3 rounded-2xl bg-[#2B2340] hover:bg-[#3f345d] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFD166]" />
              <span>한자 5문항 즉석 테스트</span>
            </button>
          </div>

          {quiz && (
            <div className="bg-white border-[3px] border-[#FF6B57] rounded-[26px] p-5 space-y-3">
              {quiz.done ? (
                <div className="text-center space-y-3 py-2">
                  <div className="text-2xl font-extrabold text-[#4CC38A]">
                    {quiz.correct} / {quiz.items.length} 정답!
                  </div>
                  <div className="text-xs font-bold text-[#2B2340]/70">
                    틀린 한자는 실전 탭 「오답노트」에 자동 저장되었어요.
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuiz(null)}
                    className="px-5 py-2 rounded-full bg-[#2B2340] text-white text-xs font-bold cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs font-bold text-[#2B2340]/60">
                    <span>문제 {quiz.idx + 1} / {quiz.items.length}</span>
                    <span>정답 {quiz.correct}</span>
                  </div>
                  <div className="text-center py-2">
                    <div className="font-jp text-5xl font-extrabold text-[#2B2340]">
                      {quiz.items[quiz.idx].kanji}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {quiz.options.map((opt) => {
                      const current = quiz.items[quiz.idx];
                      const right = `${current.meaningKo} (${current.onyomi})`;
                      let cls = 'bg-[#FFF7EC] border border-[#FFE1C2] text-[#2B2340] hover:border-[#FF6B57]';
                      if (quiz.picked) {
                        if (opt === right) cls = 'bg-[#4CC38A] text-white border-[#4CC38A]';
                        else if (opt === quiz.picked) cls = 'bg-[#FF6B57] text-white border-[#FF6B57]';
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={Boolean(quiz.picked)}
                          onClick={() => handleKanjiQuizAnswer(opt)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold text-left cursor-pointer ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {quiz.picked && quiz.wrongNoteId && (
                    <div className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-3 space-y-2">
                      <div className="text-[11px] font-extrabold text-[#2B2340]">
                        틀린 이유 선택 (선택 안 하고 넘어가도 돼요)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((tagKey) => {
                          const meta = WRONG_REASON_META[tagKey];
                          const sel = quiz.selectedTag === tagKey;
                          return (
                            <button
                              key={tagKey}
                              type="button"
                              onClick={() => {
                                onTagWrongNote(quiz.wrongNoteId!, tagKey);
                                setQuiz((prev) => (prev ? { ...prev, selectedTag: tagKey } : null));
                              }}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer transition-colors ${
                                sel
                                  ? 'bg-[#2B2340] border-[#2B2340] text-white'
                                  : 'bg-white border-[#FFE1C2] text-[#2B2340] hover:border-[#FF6B57]'
                              }`}
                            >
                              {meta.label}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => advanceKanjiQuiz(quiz.correct)}
                        className="w-full py-2 rounded-full bg-[#2B2340] text-white text-xs font-extrabold cursor-pointer"
                      >
                        {quiz.idx + 1 >= quiz.items.length ? '퀴즈 결과 보기 →' : '다음 문제 →'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Active Kanji Card + Stroke Pad */}
        <div className="lg:col-span-7 bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-[#FFF7EC] border-2 border-[#FFE1C2] flex items-center justify-center">
                <span className="font-jp jp-card-glyph-center text-6xl font-extrabold text-[#2B2340]">
                  {activeKanji.kanji}
                </span>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B57]/10 text-[#FF6B57] text-[11px] font-extrabold">
                  JLPT {activeKanji.level} · {activeKanji.strokes}획
                </span>
                <h2 className="text-2xl font-extrabold text-[#2B2340] mt-1">{activeKanji.meaningKo}</h2>
                <div className="text-xs font-bold text-[#2B2340]/70 mt-1 space-y-0.5">
                  <div>🇰🇷 한국 한자음: <strong className="text-[#FF6B57]">{activeKanji.soundKo}</strong></div>
                  <div>음독(音): <span className="font-jp">{activeKanji.onyomi}</span> · 훈독(訓): <span className="font-jp">{activeKanji.kunyomi}</span></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => speakJapanese(activeKanji.compounds[0]?.split(' ')[0] || activeKanji.kanji, 0.95)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF6B57] text-white text-xs font-extrabold cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>단어 듣기</span>
              </button>
            </div>
          </div>

          {/* Compounds */}
          <div>
            <div className="text-xs font-extrabold text-[#2B2340]/65 mb-2">필수 결합 어휘 (클릭해서 발음 듣기)</div>
            <div className="flex flex-wrap gap-2">
              {activeKanji.compounds.map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => speakJapanese(comp.split(' ')[0], 0.9)}
                  className="px-3.5 py-2 rounded-2xl bg-[#FFF7EC] hover:bg-[#FFEBD2] border border-[#FFE1C2] font-jp text-sm font-bold text-[#2B2340] cursor-pointer"
                >
                  🔊 {comp}
                </button>
              ))}
            </div>
          </div>

          {/* Kanji Writing Pad */}
          <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-[190px] h-[190px] shrink-0 rounded-2xl border-2 border-dashed border-[#FFD1B0] bg-white overflow-hidden touch-none select-none">
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#FFE1C2] pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#FFE1C2] pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center font-jp text-[128px] font-bold text-[#2B2340]/10 pointer-events-none">
                {activeKanji.kanji}
              </div>
              <canvas
                ref={canvasRef}
                width={190}
                height={190}
                onPointerDown={(e) => {
                  const c = canvasRef.current;
                  if (!c) return;
                  c.setPointerCapture(e.pointerId);
                  const ctx = c.getContext('2d');
                  if (!ctx) return;
                  const { x, y } = getPt(e);
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  ctx.strokeStyle = '#2B2340';
                  ctx.lineWidth = 7;
                  ctx.beginPath();
                  ctx.moveTo(x, y);
                  setIsDrawing(true);
                }}
                onPointerMove={(e) => {
                  if (!isDrawing || !canvasRef.current) return;
                  const ctx = canvasRef.current.getContext('2d');
                  if (!ctx) return;
                  const { x, y } = getPt(e);
                  ctx.lineTo(x, y);
                  ctx.stroke();
                }}
                onPointerUp={() => setIsDrawing(false)}
                onPointerCancel={() => setIsDrawing(false)}
                className="relative z-10 w-full h-full cursor-crosshair"
              />
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="text-sm font-extrabold text-[#2B2340]">한자 손글씨 연습장</div>
              <p className="text-xs text-[#2B2340]/70">
                한자의 균형을 잡으며 십자선 위로 천천히 따라 써 보세요. 한국 한자음「{activeKanji.soundKo}」과 일본 음독「{activeKanji.onyomi}」을 함께 소리 내어 읽으면 오래 기억나요!
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>지우기</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSfx('correct');
                    onToggleKanjiLearned(activeKanji.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold cursor-pointer ${
                    state.learnedKanji.includes(activeKanji.id)
                      ? 'bg-[#4CC38A] text-white'
                      : 'bg-[#2B2340] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{state.learnedKanji.includes(activeKanji.id) ? '외웠어요 완료!' : '외웠어요 (+15 EXP)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleKanjiBookmark(activeKanji.id)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 cursor-pointer ${
                    state.bookmarkedKanji.includes(activeKanji.id)
                      ? 'bg-[#FFD166] border-[#FFD166] text-[#2B2340]'
                      : 'bg-white border-[#FFE1C2] text-[#2B2340]/70'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>헷갈려요</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== 3. VERB CONJUGATION SIMULATOR + GRAMMAR NOTES ====================
interface VerbGrammarPanelProps {
  state: StudentState;
  initialGrammarId?: string;
  onChangeLevelScope: (lvl: JlptLevel, sub: SubDifficulty) => void;
  onToggleGrammarLearned: (id: string) => void;
  onGrantStudyExp: (expGain: number, reason: string) => void;
  onUpdateLastLocation: (loc: LastStudyLocation) => void;
}

const VERB_FORM_ORDER: VerbFormKey[] = [
  'dict',
  'masu',
  'nai',
  'ta',
  'te',
  'potential',
  'volitional',
  'conditional',
  'passive'
];

export const VerbGrammarPanel: React.FC<VerbGrammarPanelProps> = ({
  state,
  initialGrammarId,
  onChangeLevelScope,
  onToggleGrammarLearned,
  onGrantStudyExp,
  onUpdateLastLocation
}) => {
  const [innerMode, setInnerMode] = React.useState<'verb' | 'grammar'>(
    initialGrammarId ? 'grammar' : 'verb'
  );
  const [selectedVerbId, setSelectedVerbId] = React.useState(VERB_CONJUGATION_DATA[0].id);
  const [selectedFormKey, setSelectedFormKey] = React.useState<VerbFormKey>('te');
  const [scopeMode, setScopeMode] = React.useState<ScopeMode>('level');

  React.useEffect(() => {
    if (!initialGrammarId) return;
    setInnerMode('grammar');
    const found = GRAMMAR_PREVIEW.find((g) => g.id === initialGrammarId);
    if (found && found.level !== state.targetLevel) {
      setScopeMode('all');
    }
  }, [initialGrammarId, state.targetLevel]);

  // Verb Speed Drill
  const [verbDrill, setVerbDrill] = React.useState<{
    targetVerbIdx: number;
    targetForm: VerbFormKey;
    options: string[];
    picked: string | null;
    score: number;
  } | null>(null);

  const activeVerb = VERB_CONJUGATION_DATA.find((v) => v.id === selectedVerbId) || VERB_CONJUGATION_DATA[0];
  const activeForm = activeVerb.forms[selectedFormKey];

  React.useEffect(() => {
    if (innerMode === 'verb') {
      onUpdateLastLocation({
        tab: 'study',
        studySubTab: 'grammar',
        label: `동사 활용 · ${activeVerb.dictionary} (${activeForm.label})`,
        updatedAt: new Date().toISOString()
      });
    } else {
      onUpdateLastLocation({
        tab: 'study',
        studySubTab: 'grammar',
        grammarId: initialGrammarId,
        label: `문법 노트 · ${state.targetLevel === 'STAGE0' ? '0단계' : state.targetLevel}`,
        updatedAt: new Date().toISOString()
      });
    }
  }, [innerMode, activeVerb.id, activeForm.label, state.targetLevel]);

  const startVerbDrill = () => {
    const vIdx = Math.floor(Math.random() * VERB_CONJUGATION_DATA.length);
    const v = VERB_CONJUGATION_DATA[vIdx];
    const keys: VerbFormKey[] = ['masu', 'nai', 'ta', 'te', 'potential', 'volitional'];
    const fk = keys[Math.floor(Math.random() * keys.length)];
    const correctFormText = `${v.forms[fk].stem}${v.forms[fk].ending} (${v.forms[fk].reading})`;
    const distractors = keys
      .filter((k) => k !== fk)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((k) => `${v.forms[k].stem}${v.forms[k].ending} (${v.forms[k].reading})`);
    setVerbDrill({
      targetVerbIdx: vIdx,
      targetForm: fk,
      options: [correctFormText, ...distractors].sort(() => Math.random() - 0.5),
      picked: null,
      score: verbDrill?.score || 0
    });
  };

  const filteredGrammar = React.useMemo(() => {
    if (scopeMode === 'all') return GRAMMAR_PREVIEW;
    if (scopeMode === 'sublevel') {
      const exact = GRAMMAR_PREVIEW.filter(
        (g) => g.level === state.targetLevel && g.subLevel === state.subLevel
      );
      return exact.length > 0 ? exact : GRAMMAR_PREVIEW.filter((g) => g.level === state.targetLevel);
    }
    return GRAMMAR_PREVIEW.filter((g) => g.level === state.targetLevel);
  }, [scopeMode, state.targetLevel, state.subLevel]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInnerMode('verb')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold cursor-pointer ${
              innerMode === 'verb' ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
            }`}
          >
            <Languages className="w-4 h-4 text-[#FFD166]" />
            <span>동사 활용 시뮬레이터 (9단 변신)</span>
          </button>
          <button
            type="button"
            onClick={() => setInnerMode('grammar')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold cursor-pointer ${
              innerMode === 'grammar' ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#FF6B57]" />
            <span>문법 비교 노트 ({state.learnedGrammar.length}/{GRAMMAR_PREVIEW.length})</span>
          </button>
        </div>
      </div>

      {innerMode === 'verb' ? (
        <div className="space-y-5">
          {/* Verb Selector Pills */}
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-4 flex flex-wrap gap-2">
            {VERB_CONJUGATION_DATA.map((verb) => (
              <button
                key={verb.id}
                type="button"
                onClick={() => {
                  setSelectedVerbId(verb.id);
                  speakJapanese(verb.forms[selectedFormKey].reading, 0.95);
                }}
                className={`px-3.5 py-2 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  verb.id === activeVerb.id
                    ? 'bg-[#FF6B57] border-[#FF6B57] text-white shadow-sm'
                    : 'bg-[#FFF7EC] border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFEBD2]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-jp text-lg font-extrabold">{verb.dictionary}</span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      verb.id === activeVerb.id ? 'bg-white/25 text-white' : 'bg-white text-[#FF6B57]'
                    }`}
                  >
                    {verb.group}류
                  </span>
                </div>
                <div className={`text-[11px] font-bold ${verb.id === activeVerb.id ? 'text-white/90' : 'text-[#2B2340]/65'}`}>
                  {verb.meaning} ({verb.reading})
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Transformation Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: 9 Forms Matrix */}
            <div className="lg:col-span-5 bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#2B2340]">{activeVerb.groupLabel}</h3>
                <button
                  type="button"
                  onClick={startVerbDrill}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2B2340] text-white text-[11px] font-extrabold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-[#FFD166]" />
                  <span>스피드 변환 퀴즈</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {VERB_FORM_ORDER.map((fk) => {
                  const f = activeVerb.forms[fk];
                  const isSel = fk === selectedFormKey;
                  return (
                    <button
                      key={fk}
                      type="button"
                      onClick={() => {
                        setSelectedFormKey(fk);
                        speakJapanese(f.reading, 0.95);
                      }}
                      className={`rounded-2xl border-2 p-2.5 text-center transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#FF6B57] border-[#FF6B57] text-white shadow-sm'
                          : 'bg-[#FFFDF9] border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFF7EC]'
                      }`}
                    >
                      <div className={`text-[10px] font-bold ${isSel ? 'text-white/85' : 'text-[#2B2340]/55'}`}>
                        {f.label.split(' ')[0]}
                      </div>
                      <div className="font-jp text-sm font-extrabold mt-0.5 truncate">
                        {f.stem}
                        <span className={isSel ? 'text-[#FFD166]' : 'text-[#FF6B57]'}>{f.ending}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {verbDrill && (
                <div className="rounded-2xl bg-[#FFF7EC] border-2 border-[#FF6B57] p-4 space-y-2.5 mt-2">
                  {(() => {
                    const dv = VERB_CONJUGATION_DATA[verbDrill.targetVerbIdx];
                    const df = dv.forms[verbDrill.targetForm];
                    const correctVal = `${df.stem}${df.ending} (${df.reading})`;
                    return (
                      <>
                        <div className="flex items-center justify-between text-xs font-extrabold">
                          <span className="text-[#FF6B57]">
                            「{dv.dictionary}({dv.meaning})」의 {df.label}?
                          </span>
                          <span className="text-[#2B2340]">점수 {verbDrill.score}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {verbDrill.options.map((opt) => {
                            let cls = 'bg-white border border-[#FFE1C2] text-[#2B2340]';
                            if (verbDrill.picked) {
                              if (opt === correctVal) cls = 'bg-[#4CC38A] text-white border-[#4CC38A]';
                              else if (opt === verbDrill.picked) cls = 'bg-[#FF6B57] text-white border-[#FF6B57]';
                            }
                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={Boolean(verbDrill.picked)}
                                onClick={() => {
                                  const ok = opt === correctVal;
                                  playSfx(ok ? 'correct' : 'wrong');
                                  const nextScore = verbDrill.score + (ok ? 10 : 0);
                                  if (ok) onGrantStudyExp(10, '동사 활용 퀴즈 정답');
                                  setVerbDrill({ ...verbDrill, picked: opt, score: nextScore });
                                  setTimeout(startVerbDrill, 850);
                                }}
                                className={`py-2 px-2 rounded-xl font-jp text-xs font-extrabold cursor-pointer ${cls}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Right: Highlighted Morphological Breakdown */}
            <div className="lg:col-span-7 bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-extrabold text-[#FF6B57]">
                    {activeForm.label} · {activeForm.meaningHint}
                  </span>
                  <div className="font-jp jp-card-glyph text-5xl sm:text-6xl font-extrabold mt-4 tracking-wide">
                    <span className="text-[#2B2340]">{activeForm.stem}</span>
                    <span className="text-[#FF6B57] underline decoration-[#FFD166] decoration-4 underline-offset-8">
                      {activeForm.ending}
                    </span>
                  </div>
                  <div className="text-lg font-jp font-bold text-[#2B2340]/70 mt-2">
                    읽기: {activeForm.reading}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakJapanese(activeForm.reading, 1.0)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FF6B57] text-white text-xs font-extrabold cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>발음 듣기</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => speakJapanese(activeForm.reading, 0.65)}
                    className="px-3.5 py-2.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-extrabold text-[#2B2340] cursor-pointer"
                  >
                    0.65x
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-[#FFF3CC]/60 border-2 border-[#FFD166] p-4">
                <div className="text-xs font-extrabold text-[#7A4F01]">변형 공식 &amp; 음편 핵심 포인트</div>
                <div className="text-sm font-bold text-[#2B2340] mt-1">{activeForm.euphonicRule}</div>
              </div>

              <div className="rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-[#2B2340]/55">실전 예문</div>
                  <div className="font-jp text-lg font-extrabold text-[#2B2340] mt-0.5">{activeForm.exampleJp}</div>
                  <div className="text-xs font-semibold text-[#2B2340]/75 mt-1">{activeForm.exampleKo}</div>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(activeForm.exampleJp, 0.9)}
                  className="w-10 h-10 rounded-full bg-white border border-[#FFE1C2] hover:bg-[#FF6B57] hover:text-white text-[#FF6B57] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ScopeHeaderBar
            targetLevel={state.targetLevel}
            subLevel={state.subLevel}
            scopeMode={scopeMode}
            onChangeScopeMode={setScopeMode}
            onChangeLevelScope={onChangeLevelScope}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGrammar.map((g) => {
              const learned = state.learnedGrammar.includes(g.id);
              return (
                <div
                  key={g.id}
                  className={`bg-white border-[3px] rounded-[26px] p-5 sm:p-6 space-y-3.5 flex flex-col justify-between ${
                    learned ? 'border-[#4CC38A]' : 'border-[#FFE1C2]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-[10px] font-extrabold text-[#FF6B57]">
                          {g.level === 'STAGE0' ? '0단계' : g.level} · {g.subLevel}단계
                        </span>
                        <h3 className="font-jp text-2xl font-extrabold text-[#2B2340] mt-1">{g.pattern}</h3>
                        <div className="text-sm font-extrabold text-[#FF6B57]">{g.meaning}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakJapanese(g.exampleJp, 0.9)}
                        className="w-10 h-10 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] hover:bg-[#FF6B57] hover:text-white text-[#FF6B57] flex items-center justify-center shrink-0 cursor-pointer"
                        title="예문 듣기"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="rounded-xl bg-[#FFFDF9] border border-[#FFE1C2] px-3.5 py-2 text-xs font-bold text-[#2B2340]">
                      📐 접속: {g.formula}
                    </div>

                    <div className="rounded-xl bg-[#FFF3CC]/55 border border-[#FFD166] px-3.5 py-2.5 text-xs font-bold text-[#7A4F01]">
                      ⚠️ 한국인이 헷갈리는 포인트: {g.koreanTrap}
                    </div>

                    {g.compareNote && (
                      <div className="rounded-xl bg-[#EEF4FF] border border-[#D4E2FF] px-3.5 py-2 text-xs font-bold text-[#2B2340]">
                        🔍 비교 노트: {g.compareNote}
                      </div>
                    )}

                    <div className="rounded-2xl bg-[#FFF7EC] p-3.5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-jp text-sm font-extrabold text-[#2B2340]">{g.exampleJp}</div>
                        <button
                          type="button"
                          onClick={() => speakJapanese(g.exampleJp, 0.65)}
                          className="text-[11px] font-bold text-[#2B2340]/65 hover:text-[#FF6B57] cursor-pointer shrink-0"
                        >
                          0.65x
                        </button>
                      </div>
                      <div className="text-xs text-[#2B2340]/75">{g.exampleKo}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!learned) playSfx('correct');
                      onToggleGrammarLearned(g.id);
                    }}
                    className={`w-full py-2.5 rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer ${
                      learned
                        ? 'bg-[#4CC38A] text-white'
                        : 'bg-[#2B2340] hover:bg-[#3f345d] text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{learned ? '이해했어요 완료!' : '이해했어요 (+15 EXP)'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
