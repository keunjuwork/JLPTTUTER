import React from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  EyeOff,
  Headphones,
  Pause,
  Play,
  Printer,
  RotateCcw,
  Trash2,
  Volume2,
  XCircle
} from 'lucide-react';
import { LEVEL_EXAM_INFO } from '../data/adventureRoadmapData';
import {
  LISTENING_EXERCISES,
  MOCK_EXAM_PAPERS,
  READING_PASSAGES
} from '../data/practiceExamData';
import { WRONG_REASON_META } from '../lib/storage';
import {
  playSfx,
  speakJapanese,
  speakJapanesePromise,
  stopJapaneseSpeech
} from '../lib/speech';
import {
  JlptLevel,
  LastStudyLocation,
  MockExamAttempt,
  MockExamPaper,
  StudentState,
  SubDifficulty,
  WrongNoteEntry,
  WrongReasonTag
} from '../types';

export type PracticeSubTab = 'reading' | 'listening' | 'mock' | 'wrongNotes';

interface PracticeViewProps {
  state: StudentState;
  subTab: PracticeSubTab;
  initialReadingId?: string;
  initialListeningId?: string;
  onChangeSubTab: (tab: PracticeSubTab) => void;
  onChangeLevelScope: (lvl: JlptLevel, sub: SubDifficulty) => void;
  onSubmitMockExam: (
    attempt: MockExamAttempt,
    wrongNotes: (Omit<WrongNoteEntry, 'id' | 'createdAt'> & { id?: string })[]
  ) => void;
  onRecordWrongNote: (entry: Omit<WrongNoteEntry, 'id' | 'createdAt'>) => string;
  onTagWrongNote: (entryId: string, reasonTag: WrongReasonTag) => void;
  onResolveWrongNote: (entryId: string) => void;
  onGrantPracticeExp: (expGain: number, reason: string, studyMinutes?: number) => void;
  onUpdateLastLocation: (loc: LastStudyLocation) => void;
  onOpenPrintWrongNotes: () => void;
  onOpenPrintOmr: () => void;
}

const LEVELS: JlptLevel[] = ['STAGE0', 'N5', 'N4', 'N3', 'N2', 'N1'];
type ScopeMode = 'sublevel' | 'level' | 'all';

function formatCountdown(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  state,
  subTab,
  initialReadingId,
  initialListeningId,
  onChangeSubTab,
  onChangeLevelScope,
  onSubmitMockExam,
  onRecordWrongNote,
  onTagWrongNote,
  onResolveWrongNote,
  onGrantPracticeExp,
  onUpdateLastLocation,
  onOpenPrintWrongNotes,
  onOpenPrintOmr
}) => {
  const [scopeMode, setScopeMode] = React.useState<ScopeMode>('level');

  // ---------- 1. READING STATE ----------
  const filteredPassages = React.useMemo(() => {
    if (scopeMode === 'all') return READING_PASSAGES;
    if (scopeMode === 'sublevel') {
      const exact = READING_PASSAGES.filter(
        (p) => p.level === state.targetLevel && p.subLevel === state.subLevel
      );
      return exact.length > 0
        ? exact
        : READING_PASSAGES.filter((p) => p.level === state.targetLevel);
    }
    return READING_PASSAGES.filter((p) => p.level === state.targetLevel);
  }, [scopeMode, state.targetLevel, state.subLevel]);

  const [passageScriptMode, setPassageScriptMode] = React.useState<
    Record<string, 'original' | 'hiragana'>
  >({});
  const [passageShowKo, setPassageShowKo] = React.useState<Record<string, boolean>>({});
  const [readingAnswers, setReadingAnswers] = React.useState<Record<string, number>>({});
  const [readingWrongIds, setReadingWrongIds] = React.useState<Record<string, string>>({});
  const [readingReasonTags, setReadingReasonTags] = React.useState<Record<string, WrongReasonTag>>({});
  const [listeningWrongIds, setListeningWrongIds] = React.useState<Record<string, string>>({});
  const [listeningReasonTags, setListeningReasonTags] = React.useState<Record<string, WrongReasonTag>>({});
  const [mockWrongIds, setMockWrongIds] = React.useState<Record<string, string>>({});
  const [mockReasonTags, setMockReasonTags] = React.useState<Record<string, WrongReasonTag>>({});
  const [wrongReasonFilter, setWrongReasonFilter] = React.useState<'all' | WrongReasonTag | 'untagged'>('all');

  // ---------- 2. LISTENING STATE ----------
  const filteredListening = React.useMemo(() => {
    if (scopeMode === 'all') return LISTENING_EXERCISES;
    if (scopeMode === 'sublevel') {
      const exact = LISTENING_EXERCISES.filter(
        (l) => l.level === state.targetLevel && l.subLevel === state.subLevel
      );
      return exact.length > 0
        ? exact
        : LISTENING_EXERCISES.filter((l) => l.level === state.targetLevel);
    }
    return LISTENING_EXERCISES.filter((l) => l.level === state.targetLevel);
  }, [scopeMode, state.targetLevel, state.subLevel]);

  const [listeningSpeed, setListeningSpeed] = React.useState<0.75 | 0.95 | 1.0>(0.95);
  const [showTranscriptMap, setShowTranscriptMap] = React.useState<Record<string, boolean>>({});
  const [listeningAnswers, setListeningAnswers] = React.useState<Record<string, number>>({});
  const [playingInfo, setPlayingInfo] = React.useState<{
    exerciseId: string;
    lineIdx: number;
  } | null>(null);
  const playSessionRef = React.useRef(0);

  const stopAudio = React.useCallback(() => {
    playSessionRef.current += 1;
    stopJapaneseSpeech();
    setPlayingInfo(null);
  }, []);

  React.useEffect(() => {
    return () => {
      playSessionRef.current += 1;
      stopJapaneseSpeech();
    };
  }, [subTab]);

  const handlePlayDialogue = async (exerciseId: string) => {
    if (playingInfo?.exerciseId === exerciseId) {
      stopAudio();
      return;
    }
    const target = LISTENING_EXERCISES.find((e) => e.id === exerciseId);
    if (!target) return;

    stopJapaneseSpeech();
    const mySession = playSessionRef.current + 1;
    playSessionRef.current = mySession;

    for (let i = 0; i < target.lines.length; i++) {
      if (playSessionRef.current !== mySession) break;
      setPlayingInfo({ exerciseId, lineIdx: i });
      const line = target.lines[i];
      const pitch = line.gender === 'F' ? 1.15 : 0.88;
      await speakJapanesePromise(line.jp, listeningSpeed, pitch);
      if (playSessionRef.current !== mySession) break;
    }

    if (playSessionRef.current === mySession) {
      setPlayingInfo(null);
    }
  };

  // Deep-link scroll & track lastStudyLocation
  React.useEffect(() => {
    if (subTab === 'reading' && initialReadingId) {
      if (!filteredPassages.some((p) => p.id === initialReadingId)) {
        setScopeMode('all');
      }
      window.setTimeout(() => {
        document.getElementById(`reading-${initialReadingId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    } else if (subTab === 'listening' && initialListeningId) {
      if (!filteredListening.some((l) => l.id === initialListeningId)) {
        setScopeMode('all');
      }
      window.setTimeout(() => {
        document.getElementById(`listening-${initialListeningId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  }, [subTab, initialReadingId, initialListeningId, filteredPassages, filteredListening]);

  // ---------- 3. MOCK EXAM STATE ----------
  const [selectedPaperLevel, setSelectedPaperLevel] = React.useState<JlptLevel>(
    state.targetLevel
  );
  React.useEffect(() => {
    setSelectedPaperLevel(state.targetLevel);
  }, [state.targetLevel]);

  React.useEffect(() => {
    if (subTab === 'reading') {
      const firstPassage = filteredPassages[0];
      onUpdateLastLocation({
        tab: 'practice',
        practiceSubTab: 'reading',
        readingId: firstPassage?.id,
        label: firstPassage ? `독해 · ${firstPassage.title}` : '실전 독해 연습',
        updatedAt: new Date().toISOString()
      });
    } else if (subTab === 'listening') {
      const firstEx = filteredListening[0];
      onUpdateLastLocation({
        tab: 'practice',
        practiceSubTab: 'listening',
        listeningId: firstEx?.id,
        label: firstEx ? `청해 · ${firstEx.title}` : '실전 청해 훈련',
        updatedAt: new Date().toISOString()
      });
    } else if (subTab === 'mock') {
      onUpdateLastLocation({
        tab: 'practice',
        practiceSubTab: 'mock',
        label: `${selectedPaperLevel === 'STAGE0' ? '0단계' : selectedPaperLevel} 실전 모의고사`,
        updatedAt: new Date().toISOString()
      });
    } else if (subTab === 'wrongNotes') {
      onUpdateLastLocation({
        tab: 'practice',
        practiceSubTab: 'wrongNotes',
        label: '나의 오답노트 복습',
        updatedAt: new Date().toISOString()
      });
    }
  }, [subTab, selectedPaperLevel]);

  const activePaper: MockExamPaper = React.useMemo(
    () =>
      MOCK_EXAM_PAPERS.find((p) => p.level === selectedPaperLevel) ||
      MOCK_EXAM_PAPERS[1],
    [selectedPaperLevel]
  );

  const [mockPhase, setMockPhase] = React.useState<'READY' | 'TAKING' | 'RESULT'>('READY');
  const [mockAnswers, setMockAnswers] = React.useState<Record<string, number>>({});
  const [mockSecondsLeft, setMockSecondsLeft] = React.useState(0);
  const [lastAttempt, setLastAttempt] = React.useState<MockExamAttempt | null>(null);
  const mockStartRef = React.useRef<number>(0);

  const allPaperQuestions = React.useMemo(() => {
    let num = 1;
    return activePaper.sections.flatMap((sec) =>
      sec.questions.map((q) => ({
        section: sec,
        q,
        globalNum: num++
      }))
    );
  }, [activePaper]);

  const startMockExam = () => {
    stopAudio();
    setMockAnswers({});
    setLastAttempt(null);
    setMockSecondsLeft(activePaper.totalMinutes * 60);
    mockStartRef.current = Date.now();
    setMockPhase('TAKING');
  };

  const finalizeMockExam = React.useCallback(() => {
    stopJapaneseSpeech();
    const durationSeconds = Math.max(
      10,
      Math.round((Date.now() - mockStartRef.current) / 1000)
    );

    const wrongNotesToAdd: (Omit<WrongNoteEntry, 'id' | 'createdAt'> & { id?: string })[] = [];
    const wrongIdMap: Record<string, string> = {};

    const sectionResults = activePaper.sections.map((sec) => {
      let correct = 0;
      for (const q of sec.questions) {
        const picked = mockAnswers[q.id];
        if (picked === q.correctIndex) {
          correct += 1;
        } else {
          const entryId = `wn_${Date.now()}_${q.id}_${Math.random().toString(36).slice(2, 5)}`;
          wrongIdMap[q.id] = entryId;
          wrongNotesToAdd.push({
            id: entryId,
            sourceType: 'mock',
            level: activePaper.level,
            title: `${activePaper.level} 모의고사 · ${sec.name}`,
            prompt: q.prompt,
            options: q.options,
            correctIndex: q.correctIndex,
            pickedIndex: typeof picked === 'number' ? picked : -1,
            explanation: q.explanation
          });
        }
      }
      const total = sec.questions.length;
      const scaledScore = total > 0 ? Math.round((correct / total) * sec.maxScore) : 0;
      const failedCutoff = scaledScore < sec.minPassScore;
      return {
        sectionId: sec.id,
        sectionName: sec.name,
        correct,
        total,
        scaledScore,
        maxScore: sec.maxScore,
        minPassScore: sec.minPassScore,
        failedCutoff
      };
    });

    const totalScore = sectionResults.reduce((acc, s) => acc + s.scaledScore, 0);
    const anySectionFailedCutoff = sectionResults.some((s) => s.failedCutoff);
    const passed = totalScore >= activePaper.passScore && !anySectionFailedCutoff;

    const attempt: MockExamAttempt = {
      id: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      paperId: activePaper.id,
      level: activePaper.level,
      takenAt: new Date().toISOString(),
      totalScore,
      maxScore: activePaper.maxScore,
      passScore: activePaper.passScore,
      passed,
      anySectionFailedCutoff,
      durationSeconds,
      sections: sectionResults
    };

    playSfx(passed ? 'levelup' : 'wrong');
    setMockWrongIds(wrongIdMap);
    setMockReasonTags({});
    setLastAttempt(attempt);
    setMockPhase('RESULT');
    onSubmitMockExam(attempt, wrongNotesToAdd);
  }, [activePaper, mockAnswers, onSubmitMockExam]);

  React.useEffect(() => {
    if (mockPhase !== 'TAKING') return;
    const id = window.setInterval(() => {
      setMockSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [mockPhase]);

  React.useEffect(() => {
    if (mockPhase === 'TAKING' && mockSecondsLeft === 0) {
      finalizeMockExam();
    }
  }, [mockPhase, mockSecondsLeft, finalizeMockExam]);

  // ---------- 4. WRONG NOTES RETRY STATE ----------
  const [wrongRetryPicked, setWrongRetryPicked] = React.useState<Record<string, number>>({});

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Practice Sub-Nav + Scope Selector */}
      <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'reading' as const, label: '독해 연습', icon: BookOpen },
              { id: 'listening' as const, label: '청해 훈련', icon: Headphones },
              { id: 'mock' as const, label: '실전 모의고사', icon: ClipboardCheck },
              {
                id: 'wrongNotes' as const,
                label: `오답노트 (${state.wrongNoteEntries.length})`,
                icon: AlertTriangle
              }
            ].map((t) => {
              const Icon = t.icon;
              const active = subTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    stopAudio();
                    onChangeSubTab(t.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#FF6B57] text-white'
                      : 'bg-[#FFF7EC] text-[#2B2340] hover:bg-[#FFEBD2]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="실전 목표 급수"
              value={state.targetLevel}
              onChange={(e) => {
                onChangeLevelScope(e.target.value as JlptLevel, state.subLevel);
                setMockPhase('READY');
              }}
              className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l === 'STAGE0' ? '0단계 (가나·기초)' : `JLPT ${l}`}
                </option>
              ))}
            </select>
            <select
              aria-label="세부 난이도"
              value={state.subLevel}
              onChange={(e) =>
                onChangeLevelScope(state.targetLevel, Number(e.target.value) as SubDifficulty)
              }
              className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
            >
              {LEVEL_EXAM_INFO[state.targetLevel].subLevels.map((s) => (
                <option key={s.sub} value={s.sub}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(subTab === 'reading' || subTab === 'listening') && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#FFE1C2]">
            <span className="text-xs font-bold text-[#2B2340]/65">
              표시 필터:
            </span>
            <div className="flex items-center gap-1.5 bg-[#FFF7EC] p-1 rounded-full border border-[#FFE1C2]">
              {[
                { id: 'sublevel' as const, label: '선택 난이도만' },
                { id: 'level' as const, label: '현재 급수 전체' },
                { id: 'all' as const, label: '전체 보기 (0단계~N1)' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setScopeMode(m.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                    scopeMode === m.id
                      ? 'bg-[#2B2340] text-white'
                      : 'text-[#2B2340]/70 hover:text-[#2B2340]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= 1. READING TAB ================= */}
      {subTab === 'reading' && (
        <div className="space-y-6">
          {filteredPassages.map((passage) => {
            const scriptMode = passageScriptMode[passage.id] || 'original';
            const showLiteralKo = Boolean(passageShowKo[passage.id]);

            return (
              <div
                key={passage.id}
                id={`reading-${passage.id}`}
                className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-8 space-y-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-extrabold text-[#FF6B57]">
                      {passage.level === 'STAGE0' ? '0단계' : passage.level} ·{' '}
                      {passage.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#2B2340] mt-2">
                      {passage.title}
                    </h2>
                  </div>

                  {/* Toggles: 원문/히라가나 + 직역 + 원어민 듣기 */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPassageScriptMode((prev) => ({
                          ...prev,
                          [passage.id]: scriptMode === 'original' ? 'hiragana' : 'original'
                        }))
                      }
                      className={`px-3.5 py-2 rounded-full text-xs font-extrabold border-2 cursor-pointer transition-colors ${
                        scriptMode === 'hiragana'
                          ? 'bg-[#2B2340] border-[#2B2340] text-white'
                          : 'bg-[#FFF7EC] border-[#FFE1C2] text-[#2B2340]'
                      }`}
                    >
                      {scriptMode === 'hiragana' ? '원문(한자 포함) 보기' : '전체 히라가나로 보기'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPassageShowKo((prev) => ({
                          ...prev,
                          [passage.id]: !showLiteralKo
                        }))
                      }
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold border-2 cursor-pointer transition-colors ${
                        showLiteralKo
                          ? 'bg-[#FFD166] border-[#FFD166] text-[#2B2340]'
                          : 'bg-white border-[#FFE1C2] text-[#2B2340]/80'
                      }`}
                    >
                      {showLiteralKo ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      <span>{showLiteralKo ? '한글 직역 숨기기' : '한글 직역 보기'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => speakJapanese(passage.originalJp, 0.92)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-xs font-extrabold cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>본문 듣기</span>
                    </button>
                  </div>
                </div>

                {/* Japanese Passage Box */}
                <div className="rounded-[22px] bg-[#FFFDF9] border-2 border-[#FFE1C2] p-5 sm:p-6 space-y-4">
                  <p className="font-jp text-lg sm:text-xl font-bold text-[#2B2340] leading-[2.0] tracking-wide">
                    {scriptMode === 'original' ? passage.originalJp : passage.hiraganaText}
                  </p>

                  {showLiteralKo && (
                    <div className="pt-3 border-t border-dashed border-[#FFE1C2] text-sm font-semibold text-[#2B2340]/85 leading-relaxed">
                      🇰🇷 <span className="font-extrabold text-[#FF6B57]">직역:</span>{' '}
                      {passage.literalKo}
                    </div>
                  )}
                </div>

                {/* Key Vocabulary */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-[#2B2340]/60 mr-1">핵심 단어:</span>
                  {passage.keyVocab.map((kv) => (
                    <button
                      key={kv.word}
                      type="button"
                      onClick={() => speakJapanese(kv.word.split(' ')[0], 0.9)}
                      className="px-3 py-1.5 rounded-full bg-[#FFF7EC] hover:bg-[#FFEBD2] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
                    >
                      <span className="font-jp font-extrabold">{kv.word}</span> · {kv.meaning} 🔊
                    </button>
                  ))}
                </div>

                {/* Comprehension Questions */}
                <div className="space-y-4 pt-2 border-t border-[#FFE1C2]">
                  {passage.questions.map((q, qIdx) => {
                    const picked = readingAnswers[q.id];
                    const answered = typeof picked === 'number';
                    return (
                      <div
                        key={q.id}
                        className="rounded-2xl bg-[#FFF7EC]/65 border border-[#FFE1C2] p-4 sm:p-5 space-y-3"
                      >
                        <div className="text-sm font-extrabold text-[#2B2340]">
                          Q{qIdx + 1}. {q.prompt}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isRight = optIdx === q.correctIndex;
                            const isSelected = picked === optIdx;
                            let cls =
                              'bg-white border-2 border-[#FFE1C2] text-[#2B2340] hover:border-[#FF6B57]';
                            if (answered) {
                              if (isRight) cls = 'bg-[#4CC38A] border-[#4CC38A] text-white';
                              else if (isSelected)
                                cls = 'bg-[#FF6B57] border-[#FF6B57] text-white';
                              else cls = 'bg-white/60 border border-[#FFE1C2] text-[#2B2340]/50';
                            }
                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={answered}
                                onClick={() => {
                                  const ok = optIdx === q.correctIndex;
                                  playSfx(ok ? 'correct' : 'wrong');
                                  setReadingAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                  if (ok) {
                                    onGrantPracticeExp(15, '독해 문제 정답', 0);
                                  } else {
                                    const wnId = onRecordWrongNote({
                                      sourceType: 'reading',
                                      level: passage.level,
                                      title: `독해 · ${passage.title}`,
                                      prompt: q.prompt,
                                      options: q.options,
                                      correctIndex: q.correctIndex,
                                      pickedIndex: optIdx,
                                      explanation: q.explanation
                                    });
                                    setReadingWrongIds((prev) => ({ ...prev, [q.id]: wnId }));
                                  }
                                  onUpdateLastLocation({
                                    tab: 'practice',
                                    practiceSubTab: 'reading',
                                    readingId: passage.id,
                                    label: `독해 · ${passage.title}`,
                                    updatedAt: new Date().toISOString()
                                  });
                                }}
                                className={`px-4 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold cursor-pointer transition-colors ${cls}`}
                              >
                                <span className="font-num mr-2">{optIdx + 1}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {answered && (
                          <div className="space-y-2">
                            <div
                              className={`rounded-xl px-3.5 py-2.5 text-xs font-bold ${
                                picked === q.correctIndex
                                  ? 'bg-[#4CC38A]/15 text-[#1f7d52]'
                                  : 'bg-[#FF6B57]/12 text-[#b83625]'
                              }`}
                            >
                              {picked === q.correctIndex ? '✓ 정답이에요! ' : '✗ 오답노트에 저장되었어요. '}
                              {q.explanation}
                            </div>
                            {picked !== q.correctIndex && readingWrongIds[q.id] && (
                              <div className="flex flex-wrap items-center gap-1.5 px-1">
                                <span className="text-[11px] font-extrabold text-[#2B2340]/65 mr-1">
                                  왜 틀렸나요? (선택):
                                </span>
                                {(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((tagKey) => {
                                  const meta = WRONG_REASON_META[tagKey];
                                  const selected = readingReasonTags[q.id] === tagKey;
                                  return (
                                    <button
                                      key={tagKey}
                                      type="button"
                                      onClick={() => {
                                        onTagWrongNote(readingWrongIds[q.id], tagKey);
                                        setReadingReasonTags((prev) => ({ ...prev, [q.id]: tagKey }));
                                      }}
                                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer transition-colors ${
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
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= 2. LISTENING TAB ================= */}
      {subTab === 'listening' && (
        <div className="space-y-6">
          {/* Speed Controller */}
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[22px] p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-extrabold text-[#2B2340]">
              🎧 대본을 숨긴 채 먼저 듣고, 실시간 강조 줄을 따라 말하며 확인해 보세요!
            </div>
            <div className="flex items-center gap-1.5 bg-[#FFF7EC] p-1 rounded-full border border-[#FFE1C2]">
              <span className="text-[11px] font-bold text-[#2B2340]/60 px-2">재생 속도</span>
              {([0.75, 0.95, 1.0] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setListeningSpeed(spd)}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold tabular-nums cursor-pointer ${
                    listeningSpeed === spd
                      ? 'bg-[#FF6B57] text-white'
                      : 'text-[#2B2340] hover:bg-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {filteredListening.map((ex) => {
            const isPlayingThis = playingInfo?.exerciseId === ex.id;
            const activeLine = isPlayingThis ? playingInfo.lineIdx : -1;
            const showTranscript = Boolean(showTranscriptMap[ex.id]);

            return (
              <div
                key={ex.id}
                id={`listening-${ex.id}`}
                className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-8 space-y-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#00A8E8]/12 text-[#0077A8] text-xs font-extrabold">
                      {ex.level === 'STAGE0' ? '0단계' : ex.level} · 청해
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#2B2340] mt-2">
                      {ex.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-[#2B2340]/70 mt-1">
                      {ex.situation}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePlayDialogue(ex.id)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold cursor-pointer transition-colors ${
                        isPlayingThis
                          ? 'bg-[#2B2340] text-white'
                          : 'bg-[#FF6B57] hover:bg-[#ef5944] text-white'
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-4 h-4 text-[#FFD166]" />
                          <span>재생 정지</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>음성 듣기 ({listeningSpeed}x)</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowTranscriptMap((prev) => ({
                          ...prev,
                          [ex.id]: !showTranscript
                        }))
                      }
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-extrabold border-2 cursor-pointer ${
                        showTranscript
                          ? 'bg-[#FFD166] border-[#FFD166] text-[#2B2340]'
                          : 'bg-[#FFF7EC] border-[#FFE1C2] text-[#2B2340]'
                      }`}
                    >
                      {showTranscript ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      <span>{showTranscript ? '대본 숨기기' : '대본 보기'}</span>
                    </button>
                  </div>
                </div>

                {/* Real-time Speaker Timeline / Highlighted Transcript */}
                <div className="rounded-[22px] bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 sm:p-5 space-y-2.5">
                  {!showTranscript ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {ex.lines.map((line, i) => {
                          const isSpeaking = activeLine === i;
                          return (
                            <span
                              key={`${ex.id}_dot_${i}`}
                              className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                                isSpeaking
                                  ? 'bg-[#FF6B57] text-white scale-105 shadow-sm'
                                  : 'bg-[#FFF7EC] text-[#2B2340]/65 border border-[#FFE1C2]'
                              }`}
                            >
                              {line.speaker} {isSpeaking ? '🔊 발화 중...' : `${i + 1}`}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-xs font-bold text-[#2B2340]/55">
                        먼저 귀로 듣고 문제를 푼 뒤 「대본 보기」를 눌러 확인하세요!
                      </span>
                    </div>
                  ) : (
                    ex.lines.map((line, i) => {
                      const isSpeaking = activeLine === i;
                      return (
                        <div
                          key={`${ex.id}_line_${i}`}
                          className={`rounded-2xl p-3.5 border-2 transition-all flex items-start justify-between gap-3 ${
                            isSpeaking
                              ? 'bg-[#FFEBD2] border-[#FF6B57] shadow-sm scale-[1.01]'
                              : 'bg-white border-[#FFE1C2]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                  line.gender === 'F'
                                    ? 'bg-[#FF6B57]/15 text-[#FF6B57]'
                                    : 'bg-[#00A8E8]/15 text-[#0077A8]'
                                }`}
                              >
                                {line.speaker}
                              </span>
                              {isSpeaking && (
                                <span className="text-[11px] font-extrabold text-[#FF6B57] animate-pulse">
                                  ▶ 읽는 중
                                </span>
                              )}
                            </div>
                            <div className="font-jp text-base sm:text-lg font-extrabold text-[#2B2340]">
                              {line.jp}
                            </div>
                            <div className="text-xs font-semibold text-[#2B2340]/70">
                              {line.ko}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              speakJapanese(
                                line.jp,
                                listeningSpeed,
                                line.gender === 'F' ? 1.15 : 0.88
                              )
                            }
                            className="w-8 h-8 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] flex items-center justify-center text-[#FF6B57] hover:bg-[#FF6B57] hover:text-white shrink-0 cursor-pointer"
                            title="이 문장만 듣기"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Listening Questions */}
                <div className="space-y-4">
                  {ex.questions.map((q, qIdx) => {
                    const picked = listeningAnswers[q.id];
                    const answered = typeof picked === 'number';
                    return (
                      <div
                        key={q.id}
                        className="rounded-2xl bg-[#FFF7EC]/65 border border-[#FFE1C2] p-4 sm:p-5 space-y-3"
                      >
                        <div className="text-sm font-extrabold text-[#2B2340]">
                          Q{qIdx + 1}. {q.prompt}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isRight = optIdx === q.correctIndex;
                            const isSelected = picked === optIdx;
                            let cls =
                              'bg-white border-2 border-[#FFE1C2] text-[#2B2340] hover:border-[#FF6B57]';
                            if (answered) {
                              if (isRight) cls = 'bg-[#4CC38A] border-[#4CC38A] text-white';
                              else if (isSelected)
                                cls = 'bg-[#FF6B57] border-[#FF6B57] text-white';
                              else cls = 'bg-white/60 border border-[#FFE1C2] text-[#2B2340]/50';
                            }
                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={answered}
                                onClick={() => {
                                  const ok = optIdx === q.correctIndex;
                                  playSfx(ok ? 'correct' : 'wrong');
                                  setListeningAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: optIdx
                                  }));
                                  if (ok) {
                                    onGrantPracticeExp(15, '청해 문제 정답', 0);
                                  } else {
                                    const wnId = onRecordWrongNote({
                                      sourceType: 'listening',
                                      level: ex.level,
                                      title: `청해 · ${ex.title}`,
                                      prompt: q.prompt,
                                      options: q.options,
                                      correctIndex: q.correctIndex,
                                      pickedIndex: optIdx,
                                      explanation: q.explanation
                                    });
                                    setListeningWrongIds((prev) => ({ ...prev, [q.id]: wnId }));
                                  }
                                  onUpdateLastLocation({
                                    tab: 'practice',
                                    practiceSubTab: 'listening',
                                    listeningId: ex.id,
                                    label: `청해 · ${ex.title}`,
                                    updatedAt: new Date().toISOString()
                                  });
                                }}
                                className={`px-4 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold cursor-pointer transition-colors ${cls}`}
                              >
                                <span className="font-num mr-2">{optIdx + 1}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {answered && (
                          <div className="space-y-2">
                            <div
                              className={`rounded-xl px-3.5 py-2.5 text-xs font-bold ${
                                picked === q.correctIndex
                                  ? 'bg-[#4CC38A]/15 text-[#1f7d52]'
                                  : 'bg-[#FF6B57]/12 text-[#b83625]'
                              }`}
                            >
                              {picked === q.correctIndex
                                ? '✓ 정답이에요! '
                                : '✗ 오답노트에 저장되었어요. '}
                              {q.explanation}
                            </div>
                            {picked !== q.correctIndex && listeningWrongIds[q.id] && (
                              <div className="flex flex-wrap items-center gap-1.5 px-1">
                                <span className="text-[11px] font-extrabold text-[#2B2340]/65 mr-1">
                                  왜 틀렸나요? (선택):
                                </span>
                                {(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((tagKey) => {
                                  const meta = WRONG_REASON_META[tagKey];
                                  const selected = listeningReasonTags[q.id] === tagKey;
                                  return (
                                    <button
                                      key={tagKey}
                                      type="button"
                                      onClick={() => {
                                        onTagWrongNote(listeningWrongIds[q.id], tagKey);
                                        setListeningReasonTags((prev) => ({ ...prev, [q.id]: tagKey }));
                                      }}
                                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer transition-colors ${
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
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= 3. MOCK EXAM TAB (TIMER + OMR + 180PT + 과락) ================= */}
      {subTab === 'mock' && (
        <div className="space-y-6">
          {/* Paper Picker */}
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {MOCK_EXAM_PAPERS.map((paper) => (
                <button
                  key={paper.id}
                  type="button"
                  onClick={() => {
                    stopAudio();
                    setSelectedPaperLevel(paper.level);
                    setMockPhase('READY');
                  }}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold cursor-pointer ${
                    activePaper.level === paper.level
                      ? 'bg-[#2B2340] text-white'
                      : 'bg-[#FFF7EC] text-[#2B2340] hover:bg-[#FFEBD2]'
                  }`}
                >
                  {paper.level === 'STAGE0' ? '0단계 총정리' : `JLPT ${paper.level}`}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenPrintOmr}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:bg-[#FFEBD2] text-xs font-extrabold text-[#2B2340] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#FF6B57]" />
              <span>종이 OMR 답안지 인쇄</span>
            </button>
          </div>

          {mockPhase === 'READY' && (
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#FF6B57]/12 text-[#FF6B57] text-xs font-extrabold">
                    실전 타이머 · OMR 마킹 · {activePaper.maxScore}점 환산 · 과락 자동 판정
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#2B2340] mt-2">
                    {activePaper.title}
                  </h2>
                  <p className="text-sm text-[#2B2340]/70 mt-1">{activePaper.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={startMockExam}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold cursor-pointer shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>모의고사 시작하기 ({activePaper.totalMinutes}분)</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {activePaper.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] p-4 space-y-1.5"
                  >
                    <div className="text-sm font-extrabold text-[#2B2340]">{sec.name}</div>
                    <div className="text-xs font-bold text-[#2B2340]/70 tabular-nums">
                      문항 수: {sec.questions.length}문항 · 제한 {sec.minutes}분
                    </div>
                    <div className="text-xs font-extrabold text-[#FF6B57] tabular-nums">
                      배점 {sec.maxScore}점 · 과락 기준 {sec.minPassScore}점 미만
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mockPhase === 'TAKING' && (
            <div className="space-y-5">
              {/* Sticky Timer & Submit Bar */}
              <div
                className={`sticky top-2 z-20 rounded-[22px] border-[3px] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md bg-white ${
                  mockSecondsLeft <= 120 ? 'border-[#FF6B57]' : 'border-[#FFE1C2]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-num font-extrabold ${
                      mockSecondsLeft <= 120
                        ? 'bg-[#FF6B57] text-white animate-pulse'
                        : 'bg-[#2B2340] text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#FFD166]" />
                    <span>{formatCountdown(mockSecondsLeft)}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#2B2340] tabular-nums">
                    마킹 완료 {Object.keys(mockAnswers).length} / {allPaperQuestions.length}문항
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMockPhase('READY')}
                    className="px-4 py-2 rounded-full border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] hover:bg-[#FFF7EC] cursor-pointer"
                  >
                    시험 중단
                  </button>
                  <button
                    type="button"
                    onClick={finalizeMockExam}
                    className="px-5 py-2 rounded-full bg-[#4CC38A] hover:bg-[#3cb37a] text-white text-xs sm:text-sm font-extrabold cursor-pointer"
                  >
                    채점 및 제출하기
                  </button>
                </div>
              </div>

              {/* Left: Question Sheet | Right: Sticky OMR Sheet */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-5">
                  {activePaper.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 sm:p-6 space-y-5"
                    >
                      <div className="flex items-center justify-between border-b border-[#FFE1C2] pb-3">
                        <h3 className="text-base sm:text-lg font-extrabold text-[#2B2340]">
                          {sec.name}
                        </h3>
                        <span className="text-xs font-bold text-[#FF6B57] tabular-nums">
                          {sec.maxScore}점 만점 (과락 {sec.minPassScore}점 미만)
                        </span>
                      </div>

                      <div className="space-y-4">
                        {sec.questions.map((q) => {
                          const meta = allPaperQuestions.find((x) => x.q.id === q.id);
                          const qNum = meta?.globalNum || 1;
                          const picked = mockAnswers[q.id];
                          return (
                            <div
                              key={q.id}
                              id={`mock-q-${q.id}`}
                              className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 space-y-3"
                            >
                              {q.contextText && (
                                <div className="rounded-xl bg-[#FFF7EC] border border-[#FFE1C2] p-3.5 font-jp text-sm font-bold text-[#2B2340] leading-relaxed">
                                  {q.contextText}
                                </div>
                              )}
                              {q.audioText && (
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => speakJapanese(q.audioText!, 0.95)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A8E8] text-white text-xs font-extrabold cursor-pointer"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>청해 음성 재생</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => speakJapanese(q.audioText!, 0.75)}
                                    className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
                                  >
                                    0.75x 느리게
                                  </button>
                                </div>
                              )}

                              <div className="text-sm font-extrabold text-[#2B2340]">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2B2340] text-white text-xs font-num mr-2">
                                  {qNum}
                                </span>
                                {q.prompt}
                              </div>

                              <div className="grid sm:grid-cols-2 gap-2">
                                {q.options.map((opt, idx) => {
                                  const sel = picked === idx;
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() =>
                                        setMockAnswers((prev) => ({ ...prev, [q.id]: idx }))
                                      }
                                      className={`px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold border-2 cursor-pointer transition-colors ${
                                        sel
                                          ? 'bg-[#2B2340] border-[#2B2340] text-white'
                                          : 'bg-white border-[#FFE1C2] text-[#2B2340] hover:border-[#FF6B57]'
                                      }`}
                                    >
                                      <span className="font-num mr-2">{idx + 1}.</span>
                                      <span className="font-jp">{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sticky Interactive OMR Answer Sheet */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 bg-white border-[3px] border-[#2B2340] rounded-[26px] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#FFE1C2] pb-3">
                    <div>
                      <div className="text-sm font-extrabold text-[#2B2340]">OMR 답안 카드</div>
                      <div className="text-[11px] font-bold text-[#2B2340]/60">
                        번호를 눌러 문항으로 이동하거나 바로 마킹해요
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-num font-extrabold text-[#FF6B57]">
                      {Object.keys(mockAnswers).length}/{allPaperQuestions.length}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1">
                    {allPaperQuestions.map(({ q, globalNum }) => {
                      const picked = mockAnswers[q.id];
                      return (
                        <div
                          key={`omr_${q.id}`}
                          className="flex items-center justify-between gap-2 rounded-xl bg-[#FFFDF9] border border-[#FFE1C2] px-3 py-2"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              document
                                .getElementById(`mock-q-${q.id}`)
                                ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                            }
                            className="text-xs font-num font-extrabold text-[#2B2340] hover:text-[#FF6B57] cursor-pointer w-8 text-left"
                          >
                            Q{globalNum}
                          </button>
                          <div className="flex items-center gap-2">
                            {[0, 1, 2, 3].map((optIdx) => {
                              const marked = picked === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() =>
                                    setMockAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                  }
                                  className={`w-7 h-7 rounded-full text-xs font-num font-extrabold border-2 cursor-pointer transition-all ${
                                    marked
                                      ? 'bg-[#2B2340] border-[#2B2340] text-white scale-105'
                                      : 'bg-white border-[#D9CEE6] text-[#2B2340]/60 hover:border-[#FF6B57]'
                                  }`}
                                  aria-label={`Q${globalNum} ${optIdx + 1}번 마킹`}
                                >
                                  {optIdx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={finalizeMockExam}
                    className="w-full py-3 rounded-2xl bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold cursor-pointer"
                  >
                    OMR 최종 제출 &amp; 180점 채점
                  </button>
                </div>
              </div>
            </div>
          )}

          {mockPhase === 'RESULT' && lastAttempt && (
            <div className="space-y-6">
              {/* Overall Result Banner */}
              <div
                className={`rounded-[28px] border-[3px] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 bg-white ${
                  lastAttempt.passed ? 'border-[#4CC38A]' : 'border-[#FF6B57]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        lastAttempt.passed
                          ? 'bg-[#4CC38A] text-white'
                          : 'bg-[#FF6B57] text-white'
                      }`}
                    >
                      {lastAttempt.passed
                        ? '🎉 모의고사 합격!'
                        : lastAttempt.anySectionFailedCutoff
                          ? '⚠️ 과락 발생 불합격'
                          : '합격선 미달'}
                    </span>
                    <span className="text-xs font-bold text-[#2B2340]/60 tabular-nums">
                      소요 시간 {Math.floor(lastAttempt.durationSeconds / 60)}분{' '}
                      {lastAttempt.durationSeconds % 60}초
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#2B2340] tabular-nums">
                    {lastAttempt.totalScore} / {lastAttempt.maxScore}점
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-[#2B2340]/75">
                    합격 기준: 총점 {lastAttempt.passScore}점 이상 AND 모든 영역 과락 기준 통과
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={startMockExam}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2B2340] text-white text-xs font-extrabold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#FFD166]" />
                    <span>다시 응시하기</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeSubTab('wrongNotes')}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF6B57] text-white text-xs font-extrabold cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>오답노트 복습 ({state.wrongNoteEntries.length})</span>
                  </button>
                </div>
              </div>

              {/* Section Score Cards + 과락 Check */}
              <div className="grid sm:grid-cols-3 gap-4">
                {lastAttempt.sections.map((sec) => {
                  const pct = Math.round((sec.scaledScore / sec.maxScore) * 100);
                  return (
                    <div
                      key={sec.sectionId}
                      className={`bg-white rounded-[24px] border-[3px] p-5 space-y-3 ${
                        sec.failedCutoff ? 'border-[#FF6B57]' : 'border-[#FFE1C2]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-extrabold text-[#2B2340]">
                          {sec.sectionName}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold shrink-0 ${
                            sec.failedCutoff
                              ? 'bg-[#FF6B57] text-white'
                              : 'bg-[#4CC38A]/15 text-[#1f7d52]'
                          }`}
                        >
                          {sec.failedCutoff ? '과락!' : '안전 통과'}
                        </span>
                      </div>

                      <div className="text-2xl font-extrabold text-[#2B2340] tabular-nums">
                        {sec.scaledScore}{' '}
                        <span className="text-sm font-bold text-[#2B2340]/50">
                          / {sec.maxScore}점
                        </span>
                      </div>

                      <div className="h-2.5 rounded-full bg-[#FFF7EC] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sec.failedCutoff ? 'bg-[#FF6B57]' : 'bg-[#4CC38A]'
                          }`}
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>

                      <div className="text-xs font-bold text-[#2B2340]/65 tabular-nums">
                        정답 {sec.correct} / {sec.total}문항 · 과락선 {sec.minPassScore}점
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Question-by-question Review */}
              <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-[#2B2340]">문항별 정답 및 해설</h3>
                <div className="space-y-3">
                  {allPaperQuestions.map(({ section, q, globalNum }) => {
                    const picked = mockAnswers[q.id];
                    const ok = picked === q.correctIndex;
                    return (
                      <div
                        key={`rev_${q.id}`}
                        className={`rounded-2xl border-2 p-4 space-y-1.5 ${
                          ok
                            ? 'bg-[#4CC38A]/5 border-[#4CC38A]/40'
                            : 'bg-[#FF6B57]/5 border-[#FF6B57]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-xs font-bold">
                          <span className="text-[#2B2340]/65">
                            Q{globalNum} · {section.name}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-extrabold ${
                              ok ? 'text-[#228558]' : 'text-[#FF6B57]'
                            }`}
                          >
                            {ok ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                정답
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                오답 (오답노트 자동 저장)
                              </>
                            )}
                          </span>
                        </div>
                        <div className="text-sm font-extrabold text-[#2B2340]">{q.prompt}</div>
                        <div className="text-xs font-bold text-[#2B2340]/80">
                          정답: <span className="text-[#228558]">{q.options[q.correctIndex]}</span>
                          {!ok && (
                            <span className="ml-3 text-[#FF6B57]">
                              내 답:{' '}
                              {typeof picked === 'number' ? q.options[picked] : '미마킹'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#2B2340]/70">💡 {q.explanation}</div>
                        {!ok && mockWrongIds[q.id] && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                            <span className="text-[11px] font-extrabold text-[#2B2340]/65 mr-1">
                              틀린 이유 (선택):
                            </span>
                            {(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((tagKey) => {
                              const meta = WRONG_REASON_META[tagKey];
                              const selected = mockReasonTags[q.id] === tagKey;
                              return (
                                <button
                                  key={tagKey}
                                  type="button"
                                  onClick={() => {
                                    onTagWrongNote(mockWrongIds[q.id], tagKey);
                                    setMockReasonTags((prev) => ({ ...prev, [q.id]: tagKey }));
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer transition-colors ${
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 4. WRONG NOTES TAB ================= */}
      {subTab === 'wrongNotes' && (
        <div className="space-y-5">
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-[#2B2340]">
                  나의 오답노트 ({state.wrongNoteEntries.length}문제)
                </h2>
                <p className="text-xs sm:text-sm text-[#2B2340]/70 mt-0.5">
                  한자, 독해, 청해, 모의고사에서 틀린 문제를 다시 풀어 보고 오답 이유별로 정리할 수 있어요!
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenPrintWrongNotes}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B2340] hover:bg-[#3f345d] text-white text-xs sm:text-sm font-extrabold cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#FFD166]" />
                <span>오답 프린트 (A4 출력)</span>
              </button>
            </div>

            {state.wrongNoteEntries.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#FFE1C2]">
                {[
                  { id: 'all' as const, label: `전체 (${state.wrongNoteEntries.length})` },
                  ...(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((k) => ({
                    id: k,
                    label: `${WRONG_REASON_META[k].label} (${
                      state.wrongNoteEntries.filter((e) => e.reasonTag === k).length
                    })`
                  })),
                  {
                    id: 'untagged' as const,
                    label: `미분류 (${state.wrongNoteEntries.filter((e) => !e.reasonTag).length})`
                  }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setWrongReasonFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold border cursor-pointer transition-colors ${
                      wrongReasonFilter === f.id
                        ? 'bg-[#2B2340] border-[#2B2340] text-white'
                        : 'bg-[#FFF7EC] border-[#FFE1C2] text-[#2B2340]/75 hover:border-[#FF6B57]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {state.wrongNoteEntries.length === 0 ? (
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-12 text-center space-y-3">
              <Award className="w-10 h-10 text-[#4CC38A] mx-auto" />
              <div className="text-lg font-extrabold text-[#2B2340]">
                저장된 오답 문제가 없어요!
              </div>
              <p className="text-xs text-[#2B2340]/65">
                독해·청해 연습이나 실전 모의고사에서 헷갈린 문제가 생기면 자동으로 여기에 모여요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.wrongNoteEntries
                .filter((entry) => {
                  if (wrongReasonFilter === 'all') return true;
                  if (wrongReasonFilter === 'untagged') return !entry.reasonTag;
                  return entry.reasonTag === wrongReasonFilter;
                })
                .map((entry) => {
                const retryPicked = wrongRetryPicked[entry.id];
                const retryAnswered = typeof retryPicked === 'number';
                const retryCorrect = retryPicked === entry.correctIndex;
                const reasonMeta = entry.reasonTag ? WRONG_REASON_META[entry.reasonTag] : null;

                return (
                  <div
                    key={entry.id}
                    className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B57]/12 text-[#FF6B57] text-[11px] font-extrabold">
                            {entry.level === 'STAGE0' ? '0단계' : entry.level} · {entry.title}
                          </span>
                          {reasonMeta && (
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
                              style={{
                                backgroundColor: `${reasonMeta.color}22`,
                                color: '#2B2340'
                              }}
                            >
                              {reasonMeta.label}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-num text-[#2B2340]/50">
                          {entry.createdAt.slice(0, 10)}
                        </span>
                      </div>

                      <div className="text-sm font-extrabold text-[#2B2340]">{entry.prompt}</div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {entry.options.map((opt, idx) => {
                          const isRight = idx === entry.correctIndex;
                          const isPicked = retryPicked === idx;
                          let cls =
                            'bg-[#FFFDF9] border border-[#FFE1C2] text-[#2B2340] hover:border-[#FF6B57]';
                          if (retryAnswered) {
                            if (isRight) cls = 'bg-[#4CC38A] text-white border-[#4CC38A]';
                            else if (isPicked)
                              cls = 'bg-[#FF6B57] text-white border-[#FF6B57]';
                          }
                          return (
                            <button
                              key={`${entry.id}_opt_${idx}`}
                              type="button"
                              onClick={() => {
                                const ok = idx === entry.correctIndex;
                                playSfx(ok ? 'correct' : 'wrong');
                                setWrongRetryPicked((prev) => ({
                                  ...prev,
                                  [entry.id]: idx
                                }));
                              }}
                              className={`px-3.5 py-2 rounded-xl text-left text-xs font-bold cursor-pointer transition-colors ${cls}`}
                            >
                              <span className="font-num mr-2">{idx + 1}.</span>
                              <span className="font-jp">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {retryAnswered && (
                        <div className="rounded-xl bg-[#FFF7EC] border border-[#FFE1C2] p-3 text-xs font-bold text-[#2B2340]/85">
                          💡 {entry.explanation}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[11px] font-extrabold text-[#2B2340]/55 mr-1">
                          오답 이유:
                        </span>
                        {(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((tagKey) => {
                          const meta = WRONG_REASON_META[tagKey];
                          const selected = entry.reasonTag === tagKey;
                          return (
                            <button
                              key={tagKey}
                              type="button"
                              onClick={() => onTagWrongNote(entry.id, tagKey)}
                              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold border cursor-pointer transition-colors ${
                                selected
                                  ? 'bg-[#2B2340] border-[#2B2340] text-white'
                                  : 'bg-[#FFFDF9] border-[#FFE1C2] text-[#2B2340]/75 hover:border-[#FF6B57]'
                              }`}
                            >
                              {meta.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#FFE1C2]">
                      <span className="text-[11px] font-bold text-[#2B2340]/55">
                        {retryCorrect
                          ? '🎉 다시 풀기 성공!'
                          : `이전 오답: ${
                              entry.pickedIndex >= 0
                                ? `${entry.pickedIndex + 1}번`
                                : '미마킹'
                            }`}
                      </span>
                      <button
                        type="button"
                        onClick={() => onResolveWrongNote(entry.id)}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer ${
                          retryCorrect
                            ? 'bg-[#4CC38A] text-white'
                            : 'bg-[#FFF7EC] border border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFEBD2]'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{retryCorrect ? '이해 완료 · 지우기' : '삭제'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
