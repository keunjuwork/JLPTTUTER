import React from 'react';
import {
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Gift,
  Lock,
  Map,
  Medal,
  Printer,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ADVENTURE_STAGES, LEVEL_EXAM_INFO } from '../data/adventureRoadmapData';
import { BADGE_DEFS } from '../data/cultureAndBadgesData';
import {
  EXP_PER_LEVEL,
  getDueSrsChars,
  getMissionCountSummary,
  getNextJlptDDay,
  getOverallN1RoadmapPercent,
  getTodayKey
} from '../lib/storage';
import { AdventureStage, JlptLevel, MainTab, PrintSubTab, StudentState, StudySubTab, SubDifficulty } from '../types';
import { ExamInfoAndRoadmapModal } from './ExamInfoAndRoadmapModal';

interface HomeViewProps {
  state: StudentState;
  onNavigateTab: (tab: MainTab, opts?: { studySubTab?: StudySubTab; rowId?: string; printSubTab?: PrintSubTab }) => void;
  onSelectStage: (stage: AdventureStage) => void;
  onChangeLevelScope: (level: JlptLevel, subLevel: SubDifficulty) => void;
  onToggleRoutine: (routine: 'routineVocab' | 'routineGrammar' | 'routineReading') => void;
  onAcknowledgePraise: (praiseId: string, bonusExp: number) => void;
  onNotify: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const LEVELS: JlptLevel[] = ['STAGE0', 'N5', 'N4', 'N3', 'N2', 'N1'];

export const HomeView: React.FC<HomeViewProps> = ({
  state,
  onNavigateTab,
  onSelectStage,
  onChangeLevelScope,
  onToggleRoutine,
  onAcknowledgePraise,
  onNotify
}) => {
  const [modalMode, setModalMode] = React.useState<'exam' | 'roadmap' | null>(null);

  const expInLevel = state.exp % EXP_PER_LEVEL;
  const remainingExp = EXP_PER_LEVEL - expInLevel;
  const expPct = Math.round((expInLevel / EXP_PER_LEVEL) * 100);

  const currentStage = ADVENTURE_STAGES.find((s) => s.id === state.currentStageId) || ADVENTURE_STAGES[0];
  const dday = getNextJlptDDay();
  const missionSummary = getMissionCountSummary(state);
  const dueSrsCount = getDueSrsChars(state).length;
  const overallPct = getOverallN1RoadmapPercent(state);

  const unreadPraise = state.praiseMessages.find((m) => !state.acknowledgedPraiseIds.includes(m.id));

  // Build visible 5-node window on the Adventure Map (just like screenshot 1!)
  const visibleMapStages = React.useMemo(() => {
    const currentIdx = ADVENTURE_STAGES.findIndex((s) => s.id === state.currentStageId);
    if (currentIdx <= 2) {
      return [
        ADVENTURE_STAGES[0],
        ADVENTURE_STAGES[1],
        ADVENTURE_STAGES[2],
        ADVENTURE_STAGES.find((s) => s.id === 'stage_katakana') || ADVENTURE_STAGES[3],
        ADVENTURE_STAGES.find((s) => s.id === 'stage_n5') || ADVENTURE_STAGES[4]
      ];
    }
    const start = Math.max(0, Math.min(currentIdx - 1, ADVENTURE_STAGES.length - 5));
    return ADVENTURE_STAGES.slice(start, start + 5);
  }, [state.currentStageId]);

  // Compute current week Mon-Sun dates for Streak card
  const weekDayDates = React.useMemo(() => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Mon=0 ... Sun=6
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    return WEEK_DAYS.map((label, idx) => {
      const dt = new Date(monday);
      dt.setDate(monday.getDate() + idx);
      const key = getTodayKey(dt);
      const isDone = (state.streakDates || []).includes(key) || (state.studyLogs[key]?.studyMinutes || 0) > 0;
      const isToday = key === getTodayKey(now);
      return { label, key, isDone, isToday };
    });
  }, [state.streakDates, state.studyLogs]);

  const currentRowLabel = currentStage.rowId ? currentStage.title : 'か행';

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      {/* Compact Scope Bar + Notifications (Zero clutter, clean separation) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-[3px] border-[#FFE1C2] rounded-[22px] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#2B2340]/60 mr-1">학습 범위</span>
          <select
            aria-label="목표 급수 선택"
            value={state.targetLevel}
            onChange={(e) => onChangeLevelScope(e.target.value as JlptLevel, state.subLevel)}
            className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57]"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl === 'STAGE0' ? '0단계 (가나·기초)' : `JLPT ${lvl}`}
              </option>
            ))}
          </select>

          <select
            aria-label="세부 난이도 선택"
            value={state.subLevel}
            onChange={(e) => onChangeLevelScope(state.targetLevel, Number(e.target.value) as SubDifficulty)}
            className="px-3 py-1.5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57]"
          >
            {LEVEL_EXAM_INFO[state.targetLevel].subLevels.map((sub) => (
              <option key={sub.sub} value={sub.sub}>
                {sub.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setModalMode('exam')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7EC] hover:bg-[#FFEBD2] border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF6B57]" />
            <span>시험 정보·4주 플랜</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#2B2340]/75 tabular-nums">
          {dueSrsCount > 0 && (
            <button
              type="button"
              onClick={() => onNavigateTab('study', { studySubTab: 'srs' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6B57]/10 text-[#FF6B57] hover:bg-[#FF6B57]/20 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>오늘 복습할 글자 {dueSrsCount}개</span>
            </button>
          )}
          <span>전체 진도 {overallPct}%</span>
        </div>
      </div>

      {/* Unread Admin Praise Banner */}
      {unreadPraise && (
        <div className="bg-white border-[3px] border-[#FFD166] rounded-[22px] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3CC] flex items-center justify-center text-lg shrink-0">
              <Gift className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#D97706]">
                {unreadPraise.senderName}의 응원 메시지
              </div>
              <div className="text-sm font-bold text-[#2B2340]">{unreadPraise.text}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAcknowledgePraise(unreadPraise.id, unreadPraise.bonusExp)}
            className="px-4 py-2 rounded-full bg-[#FF6B57] hover:bg-[#f25843] text-white text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            {unreadPraise.bonusExp > 0 ? `확인 +${unreadPraise.bonusExp} EXP 받기` : '확인했어요!'}
          </button>
        </div>
      )}

      {/* Main 2-Column Dashboard Grid matching Screenshot 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (Hero + Adventure Map + Game Zone) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Coral Hero Banner */}
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#FF6B57] to-[#FF7E67] text-white p-6 sm:p-8 shadow-sm">
            <div className="relative z-10 max-w-xl">
              <h1 className="text-2xl sm:text-[32px] font-extrabold tracking-tight leading-snug text-balance">
                오늘도 한 글자씩, {state.studentName}!
              </h1>
              <p className="text-sm sm:text-base font-medium text-white/95 mt-1.5">
                {currentStage.worldLabel} – 「{currentStage.title}」 정복 중
              </p>

              {/* EXP Bar */}
              <div className="mt-6 max-w-md">
                <div className="h-3.5 w-full rounded-full bg-white/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#FFD166] transition-all duration-300"
                    style={{ width: `${Math.max(6, expPct)}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white/95 tabular-nums">
                  <span>EXP {expInLevel.toLocaleString()} / {EXP_PER_LEVEL.toLocaleString()} · 다음 레벨까지 {remainingExp.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectStage(currentStage)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-[#FF6B57] text-sm font-extrabold hover:bg-[#FFF7EC] transition-colors cursor-pointer shadow-sm"
                >
                  <span>「{currentStage.title}」 학습 시작</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('study', { studySubTab: 'gojuon' })}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  <span>오십음도 발음표</span>
                </button>
              </div>
            </div>

            {/* Right Stylized Kana Emblem matching Screenshot 1 */}
            <div
              aria-hidden="true"
              className="hidden sm:flex absolute right-7 top-1/2 -translate-y-1/2 font-jp text-[138px] font-extrabold leading-none text-white/20 select-none pointer-events-none"
            >
              {currentStage.badgeChar.slice(0, 1)}
            </div>
          </div>

          {/* 2. 나의 모험 지도 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-[#4CC38A]" />
                <h2 className="text-lg font-extrabold text-[#2B2340]">나의 모험 지도</h2>
              </div>
              <button
                type="button"
                onClick={() => setModalMode('roadmap')}
                className="text-xs font-bold text-[#FF6B57] hover:underline cursor-pointer"
              >
                전체 지도 (0단계 → N1) 보기
              </button>
            </div>

            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 sm:p-7 overflow-x-auto custom-scrollbar">
              <div className="min-w-[540px] flex items-center justify-between gap-2">
                {visibleMapStages.map((stage, idx) => {
                  const isDone = state.completedStages.includes(stage.id);
                  const isUnlocked = state.unlockedStages.includes(stage.id);
                  const isCurrent = state.currentStageId === stage.id;

                  return (
                    <React.Fragment key={stage.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isUnlocked) {
                            onNotify('앞 단계 퀴즈를 80% 이상 통과하면 다음 모험이 열려요!', 'info');
                            return;
                          }
                          onSelectStage(stage);
                        }}
                        className="group flex flex-col items-center gap-2 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57] rounded-2xl p-1.5"
                      >
                        <div
                          className={`relative w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-full flex items-center justify-center font-jp font-extrabold text-2xl transition-transform duration-150 group-hover:scale-105 ${
                            isDone
                              ? 'bg-[#4CC38A] text-white'
                              : isCurrent
                                ? 'bg-[#FF6B57] text-white ring-[6px] ring-[#FFE1C2]'
                                : isUnlocked
                                  ? 'bg-[#FFB09E] text-white'
                                  : 'bg-[#E8E3EF] text-[#2B2340]/35'
                          }`}
                        >
                          <span>{stage.badgeChar}</span>
                          {!isUnlocked && (
                            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#E8E3EF] flex items-center justify-center">
                              <Lock className="w-3 h-3 text-[#2B2340]/55" />
                            </span>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-extrabold text-[#2B2340]">{stage.title}</div>
                          <div className="text-xs font-medium text-[#2B2340]/60">
                            {isDone ? '완료' : isCurrent ? '진행 중' : isUnlocked ? '도전 가능' : '잠김'}
                          </div>
                        </div>
                      </button>

                      {idx < visibleMapStages.length - 1 && (
                        <div className="flex-1 flex items-center justify-center pb-8 min-w-[24px]">
                          <div className="w-full border-t-[4px] border-dashed border-[#FFBC97]" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. 게임존 (3 Colorful Cards matching Screenshot 1) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎮</span>
                <h2 className="text-lg font-extrabold text-[#2B2340]">게임존</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('game')}
                className="text-xs font-bold text-[#2B2340]/65 hover:text-[#FF6B57] cursor-pointer"
              >
                게임존 열기 →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Kana Drop Game */}
              <button
                type="button"
                onClick={() => onNavigateTab('game')}
                className="text-left rounded-[22px] bg-gradient-to-br from-[#6D5DF6] to-[#5B4CE0] text-white p-5 hover:scale-[1.015] transition-transform cursor-pointer shadow-sm"
              >
                <div className="font-jp text-3xl font-extrabold leading-none">ぽ</div>
                <div className="mt-4 text-base font-extrabold">가나 낙하 게임</div>
                <div className="mt-1 text-xs font-medium text-white/85 tabular-nums">
                  최고 기록 {state.gameRecords.kanaDropBest.toLocaleString()}점
                </div>
              </button>

              {/* Card 2: Listening Kana Game */}
              <button
                type="button"
                onClick={() => onNavigateTab('game')}
                className="text-left rounded-[22px] bg-gradient-to-br from-[#00A8E8] to-[#0096D6] text-white p-5 hover:scale-[1.015] transition-transform cursor-pointer shadow-sm"
              >
                <div className="text-3xl font-extrabold leading-none">♪</div>
                <div className="mt-4 text-base font-extrabold">듣고 글자 고르기</div>
                <div className="mt-1 text-xs font-medium text-white/85 tabular-nums">
                  {state.gameRecords.listeningBest > 0
                    ? `최고 ${state.gameRecords.listeningBest}점 · 도전하기`
                    : '오늘 1판 도전해 봐요'}
                </div>
              </button>

              {/* Card 3: Locked Kanji Game */}
              <button
                type="button"
                onClick={() =>
                  onNotify('「한자 짝맞추기」는 N5 월드(14단계)에 도착하면 열려요!', 'info')
                }
                className="text-left rounded-[22px] bg-[#9E97AE] text-white p-5 hover:bg-[#9088A1] transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#FFD166]" />
                </div>
                <div className="mt-4 text-base font-extrabold">한자 짝맞추기</div>
                <div className="mt-1 text-xs font-medium text-white/90">N5 월드에서 열려요</div>
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (Missions + Streak + Print Center + Badges) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. 오늘의 미션 */}
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-extrabold text-[#2B2340]">오늘의 미션</h2>
              <span className="px-3 py-1 rounded-full bg-[#2B2340] text-white text-xs font-bold tabular-nums">
                {missionSummary.completed} / {missionSummary.total}
              </span>
            </div>

            <div className="space-y-3">
              {/* Mission 1: Daily new chars */}
              <button
                type="button"
                onClick={() => onNavigateTab('study', { studySubTab: 'kana' })}
                className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      state.dailyMissions.newCharsCount >= state.missionSettings.dailyNewChars
                        ? 'bg-[#4CC38A] text-white'
                        : 'border-2 border-[#FFD1B0] bg-[#FFF9F0]'
                    }`}
                  >
                    {state.dailyMissions.newCharsCount >= state.missionSettings.dailyNewChars && (
                      <Check className="w-4 h-4 stroke-[3]" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-[#2B2340] truncate group-hover:text-[#FF6B57]">
                    새 글자 {state.missionSettings.dailyNewChars}개 배우기 ({Math.min(state.dailyMissions.newCharsCount, state.missionSettings.dailyNewChars)}/{state.missionSettings.dailyNewChars})
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#FF6B57] tabular-nums shrink-0">+50</span>
              </button>

              {/* Mission 2: Game mission */}
              <button
                type="button"
                onClick={() => onNavigateTab('game')}
                className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      state.dailyMissions.gamesPlayed >= state.missionSettings.dailyGameMissions
                        ? 'bg-[#4CC38A] text-white'
                        : 'border-2 border-[#FFD1B0] bg-[#FFF9F0]'
                    }`}
                  >
                    {state.dailyMissions.gamesPlayed >= state.missionSettings.dailyGameMissions && (
                      <Check className="w-4 h-4 stroke-[3]" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-[#2B2340] truncate group-hover:text-[#FF6B57]">
                    가나 낙하 게임 {state.missionSettings.dailyGameMissions}판
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#FF6B57] tabular-nums shrink-0">+30</span>
              </button>

              {/* Mission 3: Review / Speaking */}
              <button
                type="button"
                onClick={() => onNavigateTab('study', { studySubTab: dueSrsCount > 0 ? 'srs' : 'kana' })}
                className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      state.dailyMissions.reviewDone
                        ? 'bg-[#4CC38A] text-white'
                        : 'border-2 border-[#FFD1B0] bg-[#FFF9F0]'
                    }`}
                  >
                    {state.dailyMissions.reviewDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </span>
                  <span className="text-sm font-semibold text-[#2B2340] truncate group-hover:text-[#FF6B57]">
                    {dueSrsCount > 0 ? `망각 곡선 복습 (${dueSrsCount}개)` : '소리 듣고 따라 읽기'}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#FF6B57] tabular-nums shrink-0">+40</span>
              </button>
            </div>

            {/* Daily 3-part routine checks */}
            <div className="pt-3 border-t border-[#FFE1C2]">
              <div className="text-[11px] font-bold text-[#2B2340]/60 mb-2">일일 루틴 3종 체크</div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'routineVocab' as const, label: '단어/가나' },
                  { key: 'routineGrammar' as const, label: '비교/문법' },
                  { key: 'routineReading' as const, label: '쓰기/읽기' }
                ].map((r) => {
                  const active = state.dailyMissions[r.key];
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => onToggleRoutine(r.key)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#4CC38A]/15 border-[#4CC38A] text-[#228558]'
                          : 'bg-[#FFF9F0] border-[#FFE1C2] text-[#2B2340]/70 hover:bg-[#FFF1DF]'
                      }`}
                    >
                      {active ? '✓ ' : ''}{r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. 연속 학습일 (Streak Card) */}
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF6B57]" />
                <h2 className="text-base font-extrabold text-[#2B2340] tabular-nums">
                  연속 학습 {state.streak}일
                </h2>
              </div>
              {state.streakProtections > 0 && (
                <span className="text-[11px] font-bold text-[#2B2340]/65">
                  보호권 {state.streakProtections}개
                </span>
              )}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {weekDayDates.map((d) => (
                <div
                  key={d.key}
                  className={`h-9 rounded-xl flex items-center justify-center text-xs font-extrabold transition-colors ${
                    d.isDone
                      ? 'bg-[#FF6B57] text-white'
                      : d.isToday
                        ? 'bg-[#FFE6BA] text-[#2B2340] border-2 border-[#FFD166]'
                        : 'bg-[#FFF3E3] text-[#2B2340]/55'
                  }`}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          {/* 3. 인쇄 센터 Card */}
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#2B2340]" />
                <h2 className="text-base font-extrabold text-[#2B2340]">인쇄 센터</h2>
              </div>
              <span
                className="px-3 py-1 rounded-full bg-[#2B2340] text-white text-xs font-bold tabular-nums"
                title={dday.label}
              >
                D-{dday.days} · JLPT
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  onNavigateTab('print', { printSubTab: 'rowSheet', rowId: currentStage.rowId || 'row_ka' })
                }
                className="px-3.5 py-2 rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] hover:bg-[#FFF1DF] text-xs font-bold text-[#2B2340] cursor-pointer transition-colors"
              >
                {currentRowLabel} 쓰기표
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('print', { printSubTab: 'poster' })}
                className="px-3.5 py-2 rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] hover:bg-[#FFF1DF] text-xs font-bold text-[#2B2340] cursor-pointer transition-colors"
              >
                오십음도 포스터
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('print', { printSubTab: 'dictation' })}
                className="px-3.5 py-2 rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] hover:bg-[#FFF1DF] text-xs font-bold text-[#2B2340] cursor-pointer transition-colors"
              >
                받아쓰기 시험지
              </button>
            </div>
          </div>

          {/* 4. 내 배지 Card */}
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-[#FFD166]" />
                <h2 className="text-base font-extrabold text-[#2B2340]">내 배지</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('records')}
                className="text-xs font-bold text-[#FF6B57] hover:underline cursor-pointer"
              >
                전체 {state.badges.length}/{BADGE_DEFS.length}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {BADGE_DEFS.slice(0, 4).map((badge) => {
                const unlocked = state.badges.includes(badge.id);
                const bgClass = !unlocked
                  ? 'bg-[#E8E3EF] text-[#2B2340]/40'
                  : badge.accentColor === 'gold'
                    ? 'bg-[#FFD166] text-[#2B2340]'
                    : badge.accentColor === 'coral'
                      ? 'bg-[#FF6B57] text-white'
                      : 'bg-[#4CC38A] text-white';

                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => {
                      if (unlocked) {
                        onNavigateTab(badge.targetTab, { studySubTab: badge.targetStudySubTab });
                      } else {
                        onNavigateTab('records');
                      }
                    }}
                    title={unlocked ? `${badge.title} (누르면 이동)` : `${badge.title}: ${badge.conditionText}`}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-extrabold text-sm cursor-pointer transition-transform hover:scale-105 ${bgClass}`}
                  >
                    <span className="font-jp">{unlocked ? badge.shortLabel : '?'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Exam Info or Full Roadmap Modal */}
      {modalMode && (
        <ExamInfoAndRoadmapModal
          mode={modalMode}
          state={state}
          onClose={() => setModalMode(null)}
          onSelectStage={onSelectStage}
          onChangeLevel={(lvl) => onChangeLevelScope(lvl, state.subLevel)}
        />
      )}
    </div>
  );
};
