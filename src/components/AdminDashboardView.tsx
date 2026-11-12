import React from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Coins,
  Download,
  FileText,
  KeyRound,
  Lock,
  Minus,
  Plus,
  Printer,
  RotateCcw,
  Send,
  ShieldPlus,
  ShoppingBag,
  Sparkles,
  Ticket,
  Trash2,
  Upload
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { ADVENTURE_STAGES, LEVEL_EXAM_INFO } from '../data/adventureRoadmapData';
import { CONFUSING_PAIRS } from '../data/confusingPairsData';
import { HIRAGANA_BASIC, KATAKANA_BASIC } from '../data/kanaData';
import { TEXTBOOK_BOOK1_CODES } from '../data/textbookCodes';
import {
  addDaysToKey,
  DEFAULT_KANA_DROP_TIME_LIMITS,
  diffDaysBetweenKeys,
  formatPraiseText,
  getOverallN1RoadmapPercent,
  getStage0ProgressPercent,
  getTextbookProgressSummary,
  getTodayKey,
  WRONG_REASON_META
} from '../lib/storage';
import {
  AdminSubTab,
  DEFAULT_PROFILE_EMOJI,
  DEFAULT_STUDENT_NAME,
  FontSizeScale,
  JlptLevel,
  PrintSubTab,
  PROFILE_EMOJI_OPTIONS,
  ShopItem,
  StudentState,
  SubDifficulty,
  WrongReasonTag
} from '../types';

interface AdminDashboardViewProps {
  state: StudentState;
  studentsList: StudentState[];
  selectedStudentUid: string;
  onSelectStudent: (uid: string) => void;
  adminSubTab: AdminSubTab;
  onChangeSubTab: (tab: AdminSubTab) => void;
  onExitAdmin: () => void;
  onUpdateProfile: (studentName: string, profileEmoji: string, fontSizeScale?: FontSizeScale) => void;
  onUpdateMissionSettings: (patch: Partial<StudentState['missionSettings']>) => void;
  onUpdateLevelAssignment: (level: JlptLevel, subLevel: SubDifficulty) => void;
  onChangeFontSizeScale: (scale: FontSizeScale) => void;
  onRetakeDiagnostic: () => void;
  onSendPraise: (text: string, bonusExp: number) => void;
  onUpdateShopCatalog: (catalog: ShopItem[]) => void;
  onRedeemPurchasedItem: (purchasedId: string) => void;
  onGrantCoins: (coinDelta: number) => void;
  onOpenRecommendedPrint: (subTab: PrintSubTab, pairId?: string) => void;
  onExportJson: () => void;
  onImportJson: (raw: string) => void;
  onChangePin: (newPin: string) => void;
  onAddAdminUid: (uid: string, email: string, name: string) => Promise<void>;
  onLoadSampleData: () => void;
  onResetStudentData: () => void;
}

const WEEKDAY_NAMES_KR = ['일', '월', '화', '수', '목', '금', '토'];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  state,
  studentsList,
  selectedStudentUid,
  onSelectStudent,
  adminSubTab,
  onChangeSubTab,
  onExitAdmin,
  onUpdateProfile,
  onUpdateMissionSettings,
  onUpdateLevelAssignment,
  onChangeFontSizeScale,
  onRetakeDiagnostic,
  onSendPraise,
  onUpdateShopCatalog,
  onRedeemPurchasedItem,
  onGrantCoins,
  onOpenRecommendedPrint,
  onExportJson,
  onImportJson,
  onChangePin,
  onAddAdminUid,
  onLoadSampleData,
  onResetStudentData
}) => {
  const [periodDays, setPeriodDays] = React.useState<7 | 14 | 30>(7);
  const [kanaGridScript, setKanaGridScript] = React.useState<'hiragana' | 'katakana'>('hiragana');
  const [draftStudentName, setDraftStudentName] = React.useState(state.studentName);
  const [draftProfileEmoji, setDraftProfileEmoji] = React.useState(
    state.profileEmoji || DEFAULT_PROFILE_EMOJI
  );
  const [praiseText, setPraiseText] = React.useState(() =>
    formatPraiseText(
      '{이름}, き와 さ를 헷갈리지 않게 오늘 쓰기표 한 장 해 보자! 이번 주 정말 잘하고 있어 👍',
      state.studentName
    )
  );
  const prevStudentNameRef = React.useRef(state.studentName);
  const [newPin, setNewPin] = React.useState('');
  const [newAdminUid, setNewAdminUid] = React.useState('');
  const [newAdminEmail, setNewAdminEmail] = React.useState('');
  const [newAdminName, setNewAdminName] = React.useState('');
  const [reportScope, setReportScope] = React.useState<'weekly' | 'monthly'>('weekly');
  const [shopTitle, setShopTitle] = React.useState('');
  const [shopDesc, setShopDesc] = React.useState('');
  const [shopEmoji, setShopEmoji] = React.useState('🎁');
  const [shopPrice, setShopPrice] = React.useState(200);
  const [shopEffect, setShopEffect] = React.useState<'streak_protection' | 'reward_coupon'>('reward_coupon');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setDraftStudentName(state.studentName);
    setDraftProfileEmoji(state.profileEmoji || DEFAULT_PROFILE_EMOJI);
    if (prevStudentNameRef.current !== state.studentName) {
      const oldName = prevStudentNameRef.current;
      setPraiseText((cur) => (oldName && cur.includes(oldName) ? cur.split(oldName).join(state.studentName) : cur));
      prevStudentNameRef.current = state.studentName;
    }
  }, [state.uid, state.studentName, state.profileEmoji]);

  const todayKey = getTodayKey();
  const currentStage = ADVENTURE_STAGES.find((s) => s.id === state.currentStageId) || ADVENTURE_STAGES[0];
  const daysSinceStart = Math.max(1, diffDaysBetweenKeys(state.startDate || todayKey, todayKey) + 1);

  // Weekly & Previous Week Aggregates
  const analytics = React.useMemo(() => {
    let thisWeekMins = 0;
    let prevWeekMins = 0;
    let thisWeekGameMins = 0;
    let thisWeekMissions = 0;
    let thisWeekAttempts = 0;
    let thisWeekCorrect = 0;
    let prevWeekAttempts = 0;
    let prevWeekCorrect = 0;

    const dailyBars: { key: string; label: string; studyMinutes: number; isToday: boolean }[] = [];
    for (let i = periodDays - 1; i >= 0; i--) {
      const key = addDaysToKey(todayKey, -i);
      const log = state.studyLogs[key];
      const mins = log?.studyMinutes || 0;
      const gMins = log?.gameMinutes || 0;
      thisWeekMins += mins;
      thisWeekGameMins += gMins;
      thisWeekMissions += log?.missionsCompleted || 0;
      thisWeekAttempts += log?.quizAttempts || 0;
      thisWeekCorrect += log?.quizCorrect || 0;

      if (i < 7) {
        const [y, m, d] = key.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        const dayLabel = WEEKDAY_NAMES_KR[dt.getDay()];
        dailyBars.push({
          key,
          label: i === 0 ? `${dayLabel}(오늘)` : dayLabel,
          studyMinutes: mins,
          isToday: i === 0
        });
      }
    }

    for (let i = periodDays * 2 - 1; i >= periodDays; i--) {
      const key = addDaysToKey(todayKey, -i);
      const log = state.studyLogs[key];
      prevWeekMins += log?.studyMinutes || 0;
      prevWeekAttempts += log?.quizAttempts || 0;
      prevWeekCorrect += log?.quizCorrect || 0;
    }

    const totalPossibleMissions = periodDays * 3;
    const missionRate = Math.min(100, Math.round((thisWeekMissions / totalPossibleMissions) * 100));

    // Also include overall kanaStats accuracy if recent log attempts are empty
    const statTotals = Object.values(state.kanaStats).reduce(
      (acc, s) => ({ a: acc.a + s.attempts, c: acc.c + s.correct }),
      { a: 0, c: 0 }
    );
    const quizAccuracy =
      thisWeekAttempts > 0
        ? Math.round((thisWeekCorrect / thisWeekAttempts) * 100)
        : statTotals.a > 0
          ? Math.round((statTotals.c / statTotals.a) * 100)
          : 0;
    const prevQuizAcc = prevWeekAttempts > 0 ? Math.round((prevWeekCorrect / prevWeekAttempts) * 100) : quizAccuracy;

    return {
      thisWeekMins,
      prevWeekMins,
      minsDelta: thisWeekMins - prevWeekMins,
      thisWeekGameMins,
      missionRate,
      thisWeekMissions,
      totalPossibleMissions,
      quizAccuracy,
      quizDelta: quizAccuracy - prevQuizAcc,
      dailyBars
    };
  }, [state.studyLogs, state.kanaStats, periodDays, todayKey]);

  // Weak Items TOP 10
  const weakItems = React.useMemo(() => {
    return Object.entries(state.kanaStats)
      .filter(([, s]) => s.attempts > 0)
      .map(([char, s]) => {
        const pct = Math.round((s.correct / s.attempts) * 100);
        const topConfused = Object.entries(s.confusedWith || {}).sort((a, b) => b[1] - a[1])[0];
        return {
          char,
          attempts: s.attempts,
          correct: s.correct,
          accuracy: pct,
          confusedChar: topConfused?.[0] || '',
          confusedCount: topConfused?.[1] || 0
        };
      })
      .sort((a, b) => a.accuracy - b.accuracy || b.confusedCount - a.confusedCount)
      .slice(0, 10);
  }, [state.kanaStats]);

  // Recommended print pair from #1 weak item
  const recommendedPair = React.useMemo(() => {
    const topWeak = weakItems[0];
    if (!topWeak) return CONFUSING_PAIRS[0];
    return (
      CONFUSING_PAIRS.find((p) => p.chars.includes(topWeak.char)) || CONFUSING_PAIRS[0]
    );
  }, [weakItems]);

  // Current month calendar heatmap
  const calendarHeatmap = React.useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const monthIdx = now.getMonth();
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const firstDayMonOffset = (new Date(year, monthIdx, 1).getDay() + 6) % 7; // Mon=0..Sun=6
    const cells: { day: number | null; key?: string; minutes: number; isToday?: boolean }[] = [];
    for (let b = 0; b < firstDayMonOffset; b++) {
      cells.push({ day: null, minutes: 0 });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const mins = state.studyLogs[key]?.studyMinutes || 0;
      cells.push({ day: d, key, minutes: mins, isToday: key === todayKey });
    }
    return { monthLabel: `${monthIdx + 1}월`, cells };
  }, [state.studyLogs, todayKey]);

  const stage0Pct = getStage0ProgressPercent(state);
  const overallPct = getOverallN1RoadmapPercent(state);
  const textbookSummary = getTextbookProgressSummary(state);
  const learnedCount = state.learnedKana.length;
  const gridSource = kanaGridScript === 'hiragana' ? HIRAGANA_BASIC.slice(0, 20) : KATAKANA_BASIC.slice(0, 20);

  // Target achievement prediction
  const predictionText = React.useMemo(() => {
    const remainingKana = Math.max(0, 92 - learnedCount);
    const dailyPace = Math.max(1, state.missionSettings.dailyNewChars);
    const daysLeftStage0 = Math.ceil(remainingKana / dailyPace);
    const targetDate = addDaysToKey(todayKey, daysLeftStage0);
    return remainingKana === 0
      ? '0단계 가나 완성! 지금 바로 N5 월드 응시가 가능해요.'
      : `현재 설정(하루 ${dailyPace}자) 기준, 약 ${daysLeftStage0}일 후(${targetDate}) N5 월드 진입 예상`;
  }, [learnedCount, state.missionSettings.dailyNewChars, todayKey]);

  // Backup overdue check (> 7 days)
  const backupOverdueDays = React.useMemo(() => {
    if (!state.lastBackupAt) return 999;
    const backupDate = state.lastBackupAt.slice(0, 10);
    return diffDaysBetweenKeys(backupDate, todayKey);
  }, [state.lastBackupAt, todayKey]);

  // Mock Exam Trend & Section Accuracy Analytics
  const mockAnalytics = React.useMemo(() => {
    const ordered = [...(state.mockExamHistory || [])].reverse();
    const trendData = ordered.map((m, idx) => ({
      id: m.id,
      label: `${idx + 1}회 (${m.takenAt.slice(5, 10)})`,
      level: m.level,
      totalScore: m.totalScore,
      passScore: m.passScore,
      maxScore: m.maxScore,
      passed: m.passed
    }));

    const sectionAcc: Record<string, { name: string; correct: number; total: number }> = {};
    for (const attempt of state.mockExamHistory || []) {
      for (const sec of attempt.sections) {
        if (!sectionAcc[sec.sectionName]) {
          sectionAcc[sec.sectionName] = { name: sec.sectionName, correct: 0, total: 0 };
        }
        sectionAcc[sec.sectionName].correct += sec.correct;
        sectionAcc[sec.sectionName].total += sec.total;
      }
    }
    const sectionBars = Object.values(sectionAcc).map((s) => ({
      name: s.name.replace('언어지식(', '').replace(')', ''),
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
    }));

    return { trendData, sectionBars };
  }, [state.mockExamHistory]);

  // Wrong Reason Distribution & Learning Prescription
  const wrongReasonStats = React.useMemo(() => {
    const counts: Record<WrongReasonTag | 'untagged', number> = {
      char_confusion: 0,
      sound_confusion: 0,
      meaning_unknown: 0,
      mistake: 0,
      untagged: 0
    };
    for (const entry of state.wrongNoteEntries || []) {
      if (entry.reasonTag && counts[entry.reasonTag] !== undefined) {
        counts[entry.reasonTag] += 1;
      } else {
        counts.untagged += 1;
      }
    }

    const chartData = [
      ...(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((k) => ({
        key: k,
        name: WRONG_REASON_META[k].label,
        value: counts[k],
        color: WRONG_REASON_META[k].color
      })),
      {
        key: 'untagged',
        name: '미분류',
        value: counts.untagged,
        color: '#C8C2D4'
      }
    ].filter((d) => d.value > 0);

    const topTagged = (Object.keys(WRONG_REASON_META) as WrongReasonTag[])
      .map((k) => ({ key: k, count: counts[k] }))
      .sort((a, b) => b.count - a.count)[0];

    const topReasonKey = topTagged && topTagged.count > 0 ? topTagged.key : null;

    return {
      total: (state.wrongNoteEntries || []).length,
      counts,
      chartData,
      topReasonKey
    };
  }, [state.wrongNoteEntries]);

  const timeLimits = state.missionSettings.kanaDropTimeLimits || DEFAULT_KANA_DROP_TIME_LIMITS;

  const handlePrintWeeklyReport = () => {
    onChangeSubTab('report');
    setTimeout(() => window.print(), 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onImportJson(reader.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#FFF7EC]">
      {/* Dark Navy Admin Top Bar matching Screenshot 2 */}
      <header className="sticky top-0 z-30 bg-[#2B2340] text-white print:hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight whitespace-nowrap flex items-baseline gap-1.5">
              <span className="text-[#FF6B57]">ARI JLPT</span>
              <span className="font-jp text-xs sm:text-sm font-bold text-white/85">
                アリのにほんご
              </span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#FFD166] text-[#2B2340] text-xs font-extrabold inline-flex items-center gap-1 whitespace-nowrap">
              <Lock className="w-3 h-3" />
              관리자
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1.5">
            {[
              { id: 'dashboard' as const, label: '성취도 대시보드' },
              { id: 'records' as const, label: '학습 · 모의고사 기록' },
              { id: 'shop' as const, label: '상점 관리' },
              { id: 'settings' as const, label: '과제 · 설정' },
              { id: 'report' as const, label: '리포트' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeSubTab(t.id)}
                className={`px-3.5 py-2 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  adminSubTab === t.id
                    ? 'bg-[#FF6B57] text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            {studentsList.length > 1 && (
              <select
                aria-label="학생 선택"
                value={selectedStudentUid}
                onChange={(e) => onSelectStudent(e.target.value)}
                className="px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold text-white cursor-pointer"
              >
                {studentsList.map((stu) => (
                  <option key={stu.uid} value={stu.uid} className="text-[#2B2340]">
                    {stu.profileEmoji || DEFAULT_PROFILE_EMOJI} {stu.studentName} (Lv.{stu.level})
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={handlePrintWeeklyReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFD166] hover:bg-[#f7c54f] text-[#2B2340] text-xs font-extrabold whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>주간 리포트 인쇄</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
            >
              학생 화면으로
            </button>
          </div>
        </div>

        {/* Mobile sub-nav */}
        <div className="md:hidden border-t border-white/10 px-4 py-2 flex gap-2 overflow-x-auto">
          {[
            { id: 'dashboard' as const, label: '성취도 대시보드' },
            { id: 'records' as const, label: '학습 · 모의고사' },
            { id: 'shop' as const, label: '상점 관리' },
            { id: 'settings' as const, label: '과제 · 설정' },
            { id: 'report' as const, label: '리포트' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChangeSubTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer ${
                adminSubTab === t.id ? 'bg-[#FF6B57] text-white' : 'bg-white/10 text-white/85'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ================= DASHBOARD TAB (Matches Screenshot 2) ================= */}
        {adminSubTab === 'dashboard' && (
          <>
            {/* Page Header + Period Filter */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#2B2340] flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-full bg-[#FFE9A8] border-2 border-[#FFD166] inline-flex items-center justify-center text-xl shrink-0">
                    {state.profileEmoji || DEFAULT_PROFILE_EMOJI}
                  </span>
                  <span>{state.studentName}의 학습 성취도</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#2B2340]/65 mt-1">
                  {state.targetLevel === 'STAGE0' ? '0단계' : state.targetLevel} · {currentStage.worldLabel} 「{currentStage.title}」 진행 중 · 학습 시작 후 {daysSinceStart}일째
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white border-2 border-[#FFE1C2] rounded-2xl px-3.5 py-2">
                <Calendar className="w-4 h-4 text-[#FF6B57]" />
                <select
                  aria-label="기간 선택"
                  value={periodDays}
                  onChange={(e) => setPeriodDays(Number(e.target.value) as 7 | 14 | 30)}
                  className="text-xs font-extrabold text-[#2B2340] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value={7}>이번 주 (최근 7일)</option>
                  <option value={14}>최근 2주 (14일)</option>
                  <option value={30}>이번 달 (30일)</option>
                </select>
              </div>
            </div>

            {/* Game vs Study Warning if Game > Study */}
            {analytics.thisWeekGameMins > analytics.thisWeekMins && analytics.thisWeekGameMins > 0 && (
              <div className="bg-[#FFF3CC] border-2 border-[#FFD166] rounded-2xl px-4 py-3 flex items-center gap-3 text-xs font-bold text-[#7A4F01]">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706]" />
                <span>
                  이번 주 게임 시간({analytics.thisWeekGameMins}분)이 학습 시간({analytics.thisWeekMins}분)보다 많아요. 학습실 카드·쓰기 복습 비중을 늘리도록 안내해 주세요.
                </span>
              </div>
            )}

            {/* 4 KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[22px] p-5">
                <div className="text-xs font-bold text-[#2B2340]/60">이번 주 학습 시간</div>
                <div className="text-3xl font-extrabold text-[#2B2340] tabular-nums mt-2">
                  {analytics.thisWeekMins}분
                </div>
                <div
                  className={`text-xs font-extrabold mt-2 tabular-nums ${
                    analytics.minsDelta >= 0 ? 'text-[#4CC38A]' : 'text-[#FF6B57]'
                  }`}
                >
                  {analytics.minsDelta >= 0 ? `▲ 지난 기간보다 +${analytics.minsDelta}분` : `▼ 지난 기간보다 ${analytics.minsDelta}분`}
                </div>
              </div>

              <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[22px] p-5">
                <div className="text-xs font-bold text-[#2B2340]/60">미션 달성률</div>
                <div className="text-3xl font-extrabold text-[#2B2340] tabular-nums mt-2">
                  {analytics.missionRate}%
                </div>
                <div className="text-xs font-extrabold text-[#4CC38A] mt-2 tabular-nums">
                  ▲ {analytics.thisWeekMissions} / {analytics.totalPossibleMissions} 미션 완료
                </div>
              </div>

              <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[22px] p-5">
                <div className="text-xs font-bold text-[#2B2340]/60">퀴즈 평균 정답률</div>
                <div className="text-3xl font-extrabold text-[#2B2340] tabular-nums mt-2">
                  {analytics.quizAccuracy}%
                </div>
                <div
                  className={`text-xs font-extrabold mt-2 tabular-nums ${
                    analytics.quizDelta >= 0 ? 'text-[#4CC38A]' : 'text-[#FF6B57]'
                  }`}
                >
                  {analytics.quizDelta >= 0
                    ? `▲ 지난 기간보다 +${analytics.quizDelta}%p`
                    : `▼ 지난 기간보다 ${analytics.quizDelta}%p`}
                </div>
              </div>

              <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[22px] p-5">
                <div className="text-xs font-bold text-[#2B2340]/60">외운 글자</div>
                <div className="text-3xl font-extrabold text-[#2B2340] tabular-nums mt-2">
                  {learnedCount} <span className="text-lg font-bold text-[#2B2340]/45">/ 92자</span>
                </div>
                <div className="text-xs font-extrabold text-[#4CC38A] mt-2 tabular-nums">
                  ▲ 목표 0단계 진도 {stage0Pct}%
                </div>
              </div>
            </div>

            {/* Middle Row: BarChart (Left) + Kana Accuracy Grid (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 요일별 학습 시간 */}
              <div className="lg:col-span-6 bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#2B2340]">요일별 학습 시간</h2>
                  <span className="text-xs font-bold text-[#2B2340]/60 tabular-nums">
                    목표: 하루 {state.missionSettings.dailyMinutesGoal}분
                  </span>
                </div>

                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailyBars} margin={{ top: 20, right: 8, left: -24, bottom: 0 }}>
                      <XAxis
                        dataKey="label"
                        tick={{ fill: '#2B2340', fontSize: 12, fontWeight: 700 }}
                        axisLine={{ stroke: '#FFE1C2' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#2B2340', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(val) => [`${val}분`, '학습 시간']}
                        contentStyle={{
                          borderRadius: '14px',
                          border: '2px solid #FFE1C2',
                          fontSize: '12px',
                          fontWeight: 700
                        }}
                      />
                      <ReferenceLine
                        y={state.missionSettings.dailyMinutesGoal}
                        stroke="#FF6B57"
                        strokeDasharray="4 4"
                      />
                      <Bar dataKey="studyMinutes" radius={[10, 10, 4, 4]} maxBarSize={48}>
                        {analytics.dailyBars.map((entry) => (
                          <Cell
                            key={entry.key}
                            fill={
                              entry.studyMinutes >= state.missionSettings.dailyMinutesGoal
                                ? '#FF6B57'
                                : '#FFB79D'
                            }
                          />
                        ))}
                        <LabelList
                          dataKey="studyMinutes"
                          position="top"
                          style={{ fill: '#2B2340', fontSize: 11, fontWeight: 700 }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 글자별 정답률 */}
              <div className="lg:col-span-6 bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-extrabold text-[#2B2340]">글자별 정답률</h2>
                  <div className="flex items-center gap-1 bg-[#FFF7EC] p-1 rounded-full border border-[#FFE1C2]">
                    <button
                      type="button"
                      onClick={() => setKanaGridScript('hiragana')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                        kanaGridScript === 'hiragana' ? 'bg-[#2B2340] text-white' : 'text-[#2B2340]/70'
                      }`}
                    >
                      히라가나 あ~た
                    </button>
                    <button
                      type="button"
                      onClick={() => setKanaGridScript('katakana')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                        kanaGridScript === 'katakana' ? 'bg-[#2B2340] text-white' : 'text-[#2B2340]/70'
                      }`}
                    >
                      가타카나 ア~タ
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                  {gridSource.slice(0, 16).map((item) => {
                    const stat = state.kanaStats[item.char];
                    const hasData = stat && stat.attempts > 0;
                    const pct = hasData ? Math.round((stat.correct / stat.attempts) * 100) : null;

                    let boxClass = 'bg-[#E8E3EF] text-[#2B2340]/45';
                    if (pct !== null) {
                      if (pct >= 85) boxClass = 'bg-[#4CC38A] text-white';
                      else if (pct >= 70) boxClass = 'bg-[#FFD166] text-[#2B2340]';
                      else boxClass = 'bg-[#FF6B57] text-white';
                    }

                    return (
                      <div
                        key={item.id}
                        title={
                          hasData
                            ? `${item.char} (${item.ko}): ${stat.correct}/${stat.attempts} 정답 (${pct}%)`
                            : `${item.char} (${item.ko}): 미학습`
                        }
                        className={`rounded-2xl py-2.5 px-1 flex flex-col items-center justify-center ${boxClass}`}
                      >
                        <span className="font-jp text-lg font-extrabold leading-none">{item.char}</span>
                        <span className="text-[10px] font-num font-bold mt-1">
                          {pct !== null ? `${pct}%` : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-[#2B2340]/75 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4CC38A]" /> 85% 이상
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166]" /> 70~84%
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B57]" /> 70% 미만
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E8E3EF]" /> 미학습
                  </span>
                </div>
              </div>
            </div>

            {/* Lower Row: Frequent Mistakes TOP 5 + Learning Calendar Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 자주 틀리는 글자 */}
              <div className="lg:col-span-5 bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-[#2B2340]">자주 틀리는 글자</h2>
                    <span className="text-xs font-bold text-[#2B2340]/55">헷갈리는 짝 TOP 5</span>
                  </div>

                  {weakItems.length === 0 ? (
                    <div className="rounded-2xl bg-[#FFF7EC] p-6 text-center text-xs font-bold text-[#2B2340]/60">
                      아직 오답 데이터가 없어요. 학습실 퀴즈나 게임을 진행하면 자동으로 분석돼요!
                    </div>
                  ) : (
                    <div className="divide-y divide-[#FFE1C2]">
                      {weakItems.slice(0, 5).map((item, idx) => (
                        <div key={item.char} className="py-2.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#2B2340] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-jp text-xl font-extrabold text-[#2B2340]">{item.char}</span>
                            <span className="text-xs font-semibold text-[#2B2340]/75">
                              {item.confusedChar
                                ? `${item.confusedChar}와 혼동 (${item.confusedCount}회)`
                                : `${item.attempts}회 중 ${item.attempts - item.correct}회 오답`}
                            </span>
                          </div>
                          <span className="text-xs font-num font-extrabold text-[#FF6B57]">
                            {item.accuracy}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenRecommendedPrint('confusingSheet', recommendedPair.id)}
                  className="text-left text-xs font-extrabold text-[#2B2340] hover:text-[#FF6B57] bg-[#FFF7EC] rounded-xl px-3.5 py-2.5 cursor-pointer transition-colors"
                >
                  💡 추천: {recommendedPair.title} 비교 쓰기표 출력 →
                </button>
              </div>

              {/* 학습 달력 히트맵 */}
              <div className="lg:col-span-7 bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-extrabold text-[#2B2340]">학습 달력</h2>
                  <div className="flex items-center gap-4 text-xs font-bold text-[#2B2340]/70">
                    <span>{calendarHeatmap.monthLabel} · 🔥 {state.streak}일 연속</span>
                    <div className="hidden sm:flex items-center gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#F0ECF6]" /> 안 함</span>
                      <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#FFD8BE]" /> ~10분</span>
                      <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#FFA285]" /> ~20분</span>
                      <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#FF6B57]" /> 20분+</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center">
                  {['월', '화', '수', '목', '금', '토', '일'].map((d) => (
                    <div key={d} className="text-[11px] font-bold text-[#2B2340]/55 pb-1">
                      {d}
                    </div>
                  ))}
                  {calendarHeatmap.cells.map((cell, i) => {
                    if (!cell.day) {
                      return <div key={`empty_${i}`} className="h-9 sm:h-10" />;
                    }
                    let bg = 'bg-[#F0ECF6] text-[#2B2340]/40';
                    if (cell.minutes > 0 && cell.minutes <= 10) bg = 'bg-[#FFD8BE] text-[#2B2340]';
                    else if (cell.minutes > 10 && cell.minutes <= 20) bg = 'bg-[#FFA285] text-white';
                    else if (cell.minutes > 20) bg = 'bg-[#FF6B57] text-white';

                    return (
                      <div
                        key={cell.key}
                        title={`${cell.key}: ${cell.minutes}분 학습`}
                        className={`h-9 sm:h-10 rounded-xl flex items-center justify-center text-xs font-num font-bold ${bg} ${
                          cell.isToday ? 'ring-2 ring-[#2B2340]' : ''
                        }`}
                      >
                        {cell.day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Roadmap Progress Bars & Target Prediction */}
            <div className="space-y-3 bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 sm:p-6">
              <div>
                <div className="flex items-center justify-between text-xs font-extrabold text-[#2B2340] mb-1.5">
                  <span>0단계 진도</span>
                  <span className="tabular-nums">{stage0Pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#FFE8D8] overflow-hidden">
                  <div className="h-full rounded-full bg-[#FF6B57] transition-all" style={{ width: `${Math.max(2, stage0Pct)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-extrabold text-[#2B2340] mb-1.5">
                  <span>N1까지 전체 로드맵</span>
                  <span className="tabular-nums">{overallPct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#E8E3EF] overflow-hidden">
                  <div className="h-full rounded-full bg-[#2B2340] transition-all" style={{ width: `${Math.max(2, overallPct)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-extrabold text-[#2B2340] mb-1.5">
                  <span>교재 진도율 (0단계 1권 · Part 1 {textbookSummary.completedPart1}/{textbookSummary.totalPart1}과)</span>
                  <span className="tabular-nums">{textbookSummary.completedAll}/{textbookSummary.totalAll}과 ({textbookSummary.pctAll}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#E9F9F1] overflow-hidden">
                  <div className="h-full rounded-full bg-[#4CC38A] transition-all" style={{ width: `${Math.max(2, textbookSummary.pctAll)}%` }} />
                </div>
              </div>

              <div className="text-xs font-bold text-[#2B2340]/75 pt-1">
                🎯 목표 달성 예측: {predictionText}
              </div>
            </div>

            {/* Mock Exam Score Trend + Section Accuracy Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6 bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-[#FF6B57]" />
                    <h2 className="text-base font-extrabold text-[#2B2340]">모의고사 성적 추이</h2>
                  </div>
                  <span className="text-xs font-bold text-[#2B2340]/60 tabular-nums">
                    총 {state.mockExamHistory.length}회 응시
                  </span>
                </div>

                {mockAnalytics.trendData.length === 0 ? (
                  <div className="h-[220px] rounded-2xl bg-[#FFF7EC] flex items-center justify-center text-xs font-bold text-[#2B2340]/60 px-6 text-center">
                    실전 탭에서 모의고사를 응시하면 회차별 총점과 합격선 추이 그래프가 나타나요.
                  </div>
                ) : (
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockAnalytics.trendData}
                        margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#FFE8D2" />
                        <XAxis
                          dataKey="label"
                          tick={{ fill: '#2B2340', fontSize: 11, fontWeight: 700 }}
                          axisLine={{ stroke: '#FFE1C2' }}
                        />
                        <YAxis
                          domain={[0, 180]}
                          tick={{ fill: '#2B2340', fontSize: 11 }}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(val) => [`${val}점`, '총점']}
                          contentStyle={{
                            borderRadius: '14px',
                            border: '2px solid #FFE1C2',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                        />
                        <ReferenceLine
                          y={mockAnalytics.trendData[mockAnalytics.trendData.length - 1]?.passScore || 80}
                          stroke="#4CC38A"
                          strokeDasharray="4 4"
                        />
                        <Line
                          type="monotone"
                          dataKey="totalScore"
                          stroke="#FF6B57"
                          strokeWidth={3}
                          dot={{ r: 5, fill: '#FF6B57', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="lg:col-span-6 bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-extrabold text-[#2B2340]">모의고사 영역별 평균 정답률</h2>
                  <span className="text-xs font-bold text-[#2B2340]/60">과락 예방 체크</span>
                </div>

                {mockAnalytics.sectionBars.length === 0 ? (
                  <div className="h-[220px] rounded-2xl bg-[#FFF7EC] flex items-center justify-center text-xs font-bold text-[#2B2340]/60 px-6 text-center">
                    모의고사 응시 데이터가 쌓이면 문자·어휘 / 문법·독해 / 청해 정답률이 비교돼요.
                  </div>
                ) : (
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockAnalytics.sectionBars}
                        margin={{ top: 18, right: 12, left: -20, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="name"
                          tick={{ fill: '#2B2340', fontSize: 11, fontWeight: 700 }}
                          axisLine={{ stroke: '#FFE1C2' }}
                          tickLine={false}
                        />
                        <YAxis domain={[0, 100]} tick={{ fill: '#2B2340', fontSize: 11 }} axisLine={false} />
                        <Tooltip
                          formatter={(val) => [`${val}%`, '정답률']}
                          contentStyle={{
                            borderRadius: '14px',
                            border: '2px solid #FFE1C2',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                        />
                        <Bar dataKey="accuracy" radius={[10, 10, 4, 4]} maxBarSize={52}>
                          {mockAnalytics.sectionBars.map((entry, i) => (
                            <Cell
                              key={entry.name}
                              fill={
                                entry.accuracy >= 70
                                  ? '#4CC38A'
                                  : entry.accuracy >= 45
                                    ? '#FFD166'
                                    : ['#FF6B57', '#6D5DF6', '#00A8E8'][i % 3]
                              }
                            />
                          ))}
                          <LabelList
                            dataKey="accuracy"
                            position="top"
                            formatter={(v: unknown) => `${v}%`}
                            style={{ fill: '#2B2340', fontSize: 11, fontWeight: 700 }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Wrong Reason Distribution Donut Chart + Prescription */}
            <section className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-[#2B2340]">오답 이유 분포 &amp; 맞춤 처방</h2>
                  <p className="text-xs font-semibold text-[#2B2340]/60">
                    학생이 퀴즈·게임·모의고사 후 선택한 틀린 이유를 한눈에 분석해 가장 효과적인 복습을 안내해요.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-extrabold text-[#2B2340] tabular-nums">
                  누적 오답 {wrongReasonStats.total}건
                </span>
              </div>

              {wrongReasonStats.chartData.length === 0 ? (
                <div className="rounded-2xl bg-[#FFF7EC] p-6 text-center text-xs font-bold text-[#2B2340]/60">
                  아직 오답노트에 저장된 오답 기록이 없어요. 오답이 쌓이면 이유별 비율 그래프와 맞춤 처방이 나타나요!
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  <div className="lg:col-span-5 h-[230px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={wrongReasonStats.chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={82}
                          paddingAngle={3}
                        >
                          {wrongReasonStats.chartData.map((entry) => (
                            <Cell key={entry.key} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val) => [`${val}건`, '오답 수']}
                          contentStyle={{
                            borderRadius: '14px',
                            border: '2px solid #FFE1C2',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 700 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 tabular-nums">
                      {(Object.keys(WRONG_REASON_META) as WrongReasonTag[]).map((k) => {
                        const meta = WRONG_REASON_META[k];
                        const count = wrongReasonStats.counts[k];
                        const isTop = wrongReasonStats.topReasonKey === k;
                        return (
                          <div
                            key={k}
                            className={`rounded-2xl p-3 border-2 ${
                              isTop ? 'bg-[#FFF7EC] border-[#FF6B57]' : 'bg-[#FFFDF9] border-[#FFE1C2]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2B2340]">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: meta.color }}
                              />
                              <span>{meta.label}</span>
                            </div>
                            <div className="text-xl font-num font-extrabold text-[#2B2340] mt-1">
                              {count}건
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {wrongReasonStats.topReasonKey ? (
                      <div className="rounded-2xl bg-[#FFF7EC] border-2 border-[#FFD166] p-4 space-y-2.5">
                        <div className="text-xs font-extrabold text-[#FF6B57]">
                          💡 1순위 맞춤 학습 처방 · {WRONG_REASON_META[wrongReasonStats.topReasonKey].label}
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-[#2B2340] leading-relaxed">
                          {WRONG_REASON_META[wrongReasonStats.topReasonKey].prescription}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const rec =
                              WRONG_REASON_META[wrongReasonStats.topReasonKey!].printRecommendation || 'wrongNotes';
                            onOpenRecommendedPrint(rec, recommendedPair.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2B2340] hover:bg-[#3f345d] text-white text-xs font-extrabold cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#FFD166]" />
                          <span>추천 학습지 바로 만들기</span>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 text-xs font-bold text-[#2B2340]/70">
                        아직 학생들이 오답 이유 태그를 선택하지 않았어요(미분류 {wrongReasonStats.counts.untagged}건). 실전 오답노트나 문제 풀이 후 이유를 고르면 맞춤 처방이 표시됩니다.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Bottom Card: 미션 설정 & 칭찬 보내기 (Matches Screenshot 2) */}
            <section className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-5">
              <h2 className="text-lg font-extrabold text-[#2B2340]">미션 설정 &amp; 칭찬 보내기</h2>

              <div className="divide-y divide-[#FFE1C2]">
                {/* Setting 1 */}
                <div className="py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-[#2B2340]">하루 새 글자 수</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateMissionSettings({
                          dailyNewChars: Math.max(1, state.missionSettings.dailyNewChars - 1)
                        })
                      }
                      className="w-8 h-8 rounded-full border-2 border-[#FFE1C2] bg-[#FFFDF9] hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                      aria-label="감소"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold tabular-nums">
                      {state.missionSettings.dailyNewChars}자
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateMissionSettings({
                          dailyNewChars: Math.min(20, state.missionSettings.dailyNewChars + 1)
                        })
                      }
                      className="w-8 h-8 rounded-full border-2 border-[#FFE1C2] bg-[#FFFDF9] hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                      aria-label="증가"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Setting 2 */}
                <div className="py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-[#2B2340]">게임 미션</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateMissionSettings({
                          dailyGameMissions: Math.max(1, state.missionSettings.dailyGameMissions - 1)
                        })
                      }
                      className="w-8 h-8 rounded-full border-2 border-[#FFE1C2] bg-[#FFFDF9] hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                      aria-label="감소"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold tabular-nums">
                      {state.missionSettings.dailyGameMissions}판
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateMissionSettings({
                          dailyGameMissions: Math.min(5, state.missionSettings.dailyGameMissions + 1)
                        })
                      }
                      className="w-8 h-8 rounded-full border-2 border-[#FFE1C2] bg-[#FFFDF9] hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                      aria-label="증가"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Setting 3 */}
                <div className="py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-[#2B2340]">약한 글자 자동 복습</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={state.missionSettings.autoWeakReview}
                    onClick={() =>
                      onUpdateMissionSettings({
                        autoWeakReview: !state.missionSettings.autoWeakReview
                      })
                    }
                    className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                      state.missionSettings.autoWeakReview ? 'bg-[#4CC38A]' : 'bg-[#E8E3EF]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        state.missionSettings.autoWeakReview ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Setting 4: Kana Drop Time Limits (easy / normal / hard) */}
                <div className="py-4 space-y-3">
                  <div>
                    <div className="text-sm font-bold text-[#2B2340]">
                      가나 낙하 게임 난이도별 제한시간 (초)
                    </div>
                    <div className="text-xs text-[#2B2340]/60">
                      기본값: 쉬움 90초 / 보통 60초 / 어려움 45초 (5초 단위로 15~180초 조정 가능)
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'easy' as const, label: '쉬움 (초급)' },
                      { key: 'normal' as const, label: '보통 (탁음 포함)' },
                      { key: 'hard' as const, label: '어려움 (요음·가타카나)' }
                    ].map((lvl) => {
                      const val = timeLimits[lvl.key];
                      return (
                        <div
                          key={lvl.key}
                          className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] px-4 py-3 flex items-center justify-between gap-2"
                        >
                          <span className="text-xs font-extrabold text-[#2B2340]">{lvl.label}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateMissionSettings({
                                  kanaDropTimeLimits: {
                                    ...timeLimits,
                                    [lvl.key]: Math.max(15, val - 5)
                                  }
                                })
                              }
                              className="w-7 h-7 rounded-full border border-[#FFE1C2] bg-white hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                              aria-label={`${lvl.label} 시간 감소`}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-11 text-center text-xs font-num font-extrabold text-[#FF6B57]">
                              {val}초
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateMissionSettings({
                                  kanaDropTimeLimits: {
                                    ...timeLimits,
                                    [lvl.key]: Math.min(180, val + 5)
                                  }
                                })
                              }
                              className="w-7 h-7 rounded-full border border-[#FFE1C2] bg-white hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                              aria-label={`${lvl.label} 시간 증가`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Praise Message Input */}
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={praiseText}
                  onChange={(e) => setPraiseText(e.target.value)}
                  placeholder={`${state.studentName}의 홈에 띄울 칭찬·응원 메시지를 입력하세요...`}
                  className="w-full rounded-2xl border-2 border-[#FFE1C2] bg-[#FFF9F0] p-4 text-sm font-medium text-[#2B2340] focus:outline-none focus:border-[#FF6B57]"
                />

                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: '👏 잘했어!',
                      message: `${state.studentName}, 정말 잘했어! 오늘도 일본어 모험 파이팅 👏`
                    },
                    {
                      label: '🔥 연속 기록 대단해',
                      message: `${state.studentName}, 연속 학습 기록 정말 대단해! 🔥`
                    },
                    {
                      label: '💪 조금만 더!',
                      message: `${state.studentName}, 조금만 더 힘내자! 오늘도 응원하고 있어 💪`
                    }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setPraiseText(chip.message)}
                      className="px-3.5 py-1.5 rounded-full bg-[#F4F1F8] hover:bg-[#FFEBD2] text-xs font-bold text-[#2B2340] cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!praiseText.trim()) return;
                    onSendPraise(praiseText.trim(), 50);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{state.studentName} 홈에 메시지 보내기 +보너스 EXP 50</span>
                </button>
              </div>
            </section>
          </>
        )}

        {/* ================= RECORDS TAB ================= */}
        {adminSubTab === 'records' && (
          <div className="space-y-6">
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#2B2340]">자주 틀리는 항목 TOP 10</h2>
                  <p className="text-xs text-[#2B2340]/65">정답률이 낮은 글자를 바로 받아쓰기 시험지로 인쇄할 수 있어요.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenRecommendedPrint('dictation')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2B2340] text-white text-xs font-extrabold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#FFD166]" />
                  <span>맞춤 프린트 만들기</span>
                </button>
              </div>

              {weakItems.length === 0 ? (
                <p className="text-sm text-[#2B2340]/60 py-6 text-center">아직 누적된 퀴즈/게임 오답 기록이 없습니다.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {weakItems.map((item, idx) => (
                    <div key={item.char} className="rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#2B2340] text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-jp text-2xl font-extrabold text-[#2B2340]">{item.char}</span>
                        <div className="text-xs">
                          <div className="font-bold text-[#2B2340]">
                            정답 {item.correct}/{item.attempts}회
                          </div>
                          <div className="text-[#2B2340]/60">
                            {item.confusedChar ? `${item.confusedChar}와 ${item.confusedCount}회 혼동` : '복습 권장'}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-num font-extrabold text-[#FF6B57]">{item.accuracy}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Logs Table */}
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
              <h2 className="text-lg font-extrabold text-[#2B2340]">최근 일일 학습·게임 로그</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#FFE1C2] text-[#2B2340]/65">
                      <th className="py-2 pr-4">날짜</th>
                      <th className="py-2 pr-4">학습 시간</th>
                      <th className="py-2 pr-4">게임 시간</th>
                      <th className="py-2 pr-4">퀴즈 정답 / 시도</th>
                      <th className="py-2">완료 미션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFE1C2]/60 tabular-nums">
                    {Object.entries(state.studyLogs)
                      .sort((a, b) => b[0].localeCompare(a[0]))
                      .slice(0, 14)
                      .map(([dateKey, log]) => (
                        <tr key={dateKey}>
                          <td className="py-2.5 pr-4 font-num font-bold">{dateKey}</td>
                          <td className="py-2.5 pr-4">{log.studyMinutes}분</td>
                          <td className="py-2.5 pr-4">{log.gameMinutes}분</td>
                          <td className="py-2.5 pr-4">
                            {log.quizCorrect} / {log.quizAttempts}
                          </td>
                          <td className="py-2.5">{log.missionsCompleted} / 3</td>
                        </tr>
                      ))}
                    {Object.keys(state.studyLogs).length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-[#2B2340]/55">
                          아직 기록된 학습 세션이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mock Exam Attempt History Table */}
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold text-[#2B2340]">
                  모의고사 응시 이력 ({state.mockExamHistory.length}회)
                </h2>
                <span className="text-xs font-bold text-[#2B2340]/60">
                  총점 합격선 + 영역별 과락 자동 반영
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#FFE1C2] text-[#2B2340]/65">
                      <th className="py-2 pr-4">응시 일자</th>
                      <th className="py-2 pr-4">급수</th>
                      <th className="py-2 pr-4">총점 / 만점</th>
                      <th className="py-2 pr-4">영역별 점수</th>
                      <th className="py-2">판정</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFE1C2]/60 tabular-nums">
                    {state.mockExamHistory.map((m) => (
                      <tr key={m.id}>
                        <td className="py-2.5 pr-4 font-num font-bold">{m.takenAt.slice(0, 10)}</td>
                        <td className="py-2.5 pr-4 font-extrabold">{m.level}</td>
                        <td className="py-2.5 pr-4 font-extrabold">
                          {m.totalScore} / {m.maxScore}점{' '}
                          <span className="text-[#2B2340]/50 font-normal">(기준 {m.passScore})</span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <div className="flex flex-wrap gap-1.5">
                            {m.sections.map((s) => (
                              <span
                                key={s.sectionId}
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  s.failedCutoff
                                    ? 'bg-[#FF6B57]/15 text-[#FF6B57]'
                                    : 'bg-[#FFF7EC] text-[#2B2340]/80'
                                }`}
                              >
                                {s.sectionName.replace('언어지식(', '').replace(')', '')}: {s.scaledScore}
                                {s.failedCutoff ? '(과락)' : ''}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                              m.passed
                                ? 'bg-[#4CC38A]/15 text-[#228558]'
                                : 'bg-[#FF6B57]/15 text-[#FF6B57]'
                            }`}
                          >
                            {m.passed ? '합격' : m.anySectionFailedCutoff ? '과락 불합격' : '불합격'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {state.mockExamHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-[#2B2340]/55">
                          아직 응시한 모의고사 기록이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Textbook Progress Table (0단계 1권) */}
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-[#2B2340]">
                    교재 진도 (0단계 1권)
                  </h2>
                  <p className="text-xs font-medium text-[#2B2340]/65">
                    Part 1(H-A ~ H-TEST) {textbookSummary.completedPart1}/{textbookSummary.totalPart1}과 ({textbookSummary.pctPart1}%) · 전체 {textbookSummary.completedAll}/{textbookSummary.totalAll}과 ({textbookSummary.pctAll}%)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E9F9F1] border border-[#4CC38A] text-xs font-extrabold text-[#1E6E4A] tabular-nums">
                  교재 완주율 {textbookSummary.pctAll}%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#FFE1C2] text-[#2B2340]/65">
                      <th className="py-2 pr-4">코드</th>
                      <th className="py-2 pr-4">쪽</th>
                      <th className="py-2 pr-4">단원</th>
                      <th className="py-2 pr-4">미션 4종</th>
                      <th className="py-2">완료 여부 · 날짜</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFE1C2]/60 tabular-nums">
                    {TEXTBOOK_BOOK1_CODES.map((entry) => {
                      const prog = state.textbookProgress?.[entry.code];
                      const doneMissions = entry.missions.filter((m) => prog?.missions?.[m.key]).length;
                      return (
                        <tr key={entry.code}>
                          <td className="py-2.5 pr-4 font-num font-extrabold text-[#FF6B57]">{entry.code}</td>
                          <td className="py-2.5 pr-4 font-num text-[#2B2340]/70">p.{entry.pages}</td>
                          <td className="py-2.5 pr-4 font-bold text-[#2B2340]">{entry.title}</td>
                          <td className="py-2.5 pr-4">{doneMissions} / {entry.missions.length}</td>
                          <td className="py-2.5">
                            {prog?.completedAt ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#4CC38A]/15 text-[#1E6E4A] text-[11px] font-extrabold">
                                완료 ({prog.completedAt.slice(0, 10)})
                              </span>
                            ) : prog ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3CC] text-[#7A4F01] text-[11px] font-bold">
                                진행 중
                              </span>
                            ) : (
                              <span className="text-[#2B2340]/45">미시작</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= SHOP MANAGEMENT TAB ================= */}
        {adminSubTab === 'shop' && (
          <div className="space-y-6">
            {/* Top Coin Control & New Item Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#D97706]" />
                    <h2 className="text-lg font-extrabold text-[#2B2340]">
                      {state.studentName} 코인 지급 · 관리
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FFF3CC] text-[#7A4F01] text-sm font-extrabold tabular-nums">
                    {state.coins.toLocaleString()} C
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[50, 100, 300].map((amt) => (
                    <button
                      key={`plus_${amt}`}
                      type="button"
                      onClick={() => onGrantCoins(amt)}
                      className="px-3.5 py-2 rounded-full bg-[#4CC38A] hover:bg-[#3eb37b] text-white text-xs font-extrabold cursor-pointer"
                    >
                      +{amt} 코인 선물
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => onGrantCoins(-50)}
                    className="px-3.5 py-2 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
                  >
                    -50 회수
                  </button>
                </div>

                <div className="pt-4 border-t border-[#FFE1C2] space-y-3">
                  <div className="flex items-center gap-2 text-base font-extrabold text-[#2B2340]">
                    <ShoppingBag className="w-4 h-4 text-[#FF6B57]" />
                    <span>새 보상 아이템 · 쿠폰 추가</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={shopEmoji}
                      onChange={(e) => setShopEmoji(e.target.value)}
                      placeholder="이모지"
                      className="col-span-1 px-3 py-2 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-center text-base"
                    />
                    <input
                      type="text"
                      maxLength={40}
                      value={shopTitle}
                      onChange={(e) => setShopTitle(e.target.value)}
                      placeholder="상품 이름 (예: 주말 치킨 쿠폰)"
                      className="col-span-3 px-3 py-2 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-xs font-bold"
                    />
                  </div>
                  <input
                    type="text"
                    maxLength={100}
                    value={shopDesc}
                    onChange={(e) => setShopDesc(e.target.value)}
                    placeholder="설명 문구 입력..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-xs font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={10}
                      max={5000}
                      step={10}
                      value={shopPrice}
                      onChange={(e) => setShopPrice(Math.max(10, Number(e.target.value) || 100))}
                      className="px-3 py-2 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-xs font-num font-bold"
                    />
                    <select
                      value={shopEffect}
                      onChange={(e) =>
                        setShopEffect(e.target.value as 'streak_protection' | 'reward_coupon')
                      }
                      className="px-3 py-2 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-xs font-bold"
                    >
                      <option value="reward_coupon">선생님/부모님 보상 쿠폰</option>
                      <option value="streak_protection">연속 학습 보호권 (+1)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    disabled={!shopTitle.trim()}
                    onClick={() => {
                      const newItem: ShopItem = {
                        id: `shop_${Date.now()}`,
                        title: shopTitle.trim(),
                        description: shopDesc.trim() || '열심히 공부한 노력 보상 쿠폰이에요!',
                        emoji: shopEmoji.trim() || '🎁',
                        priceCoins: shopPrice,
                        effectType: shopEffect,
                        active: true
                      };
                      onUpdateShopCatalog([...state.shopCatalog, newItem]);
                      setShopTitle('');
                      setShopDesc('');
                    }}
                    className="w-full py-2.5 rounded-full bg-[#FF6B57] disabled:bg-[#E8E3EF] text-white text-xs font-extrabold cursor-pointer"
                  >
                    상점에 상품 등록하기
                  </button>
                </div>
              </div>

              {/* Catalog Management List */}
              <div className="lg:col-span-7 bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-[#2B2340]">
                  진열 상품 목록 ({state.shopCatalog.length}개)
                </h2>
                <div className="space-y-2.5">
                  {state.shopCatalog.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-2xl border-2 p-3.5 flex flex-wrap items-center justify-between gap-3 ${
                        item.active
                          ? 'bg-[#FFFDF9] border-[#FFE1C2]'
                          : 'bg-[#F4F1F8] border-[#E8E3EF] opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{item.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-[#2B2340]">{item.title}</div>
                          <div className="text-[11px] text-[#2B2340]/65 truncate max-w-[260px]">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateShopCatalog(
                              state.shopCatalog.map((x) =>
                                x.id === item.id
                                  ? { ...x, priceCoins: Math.max(10, x.priceCoins - 50) }
                                  : x
                              )
                            )
                          }
                          className="w-7 h-7 rounded-full bg-white border border-[#FFE1C2] flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-num font-extrabold text-[#FF6B57] w-14 text-center">
                          {item.priceCoins} C
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateShopCatalog(
                              state.shopCatalog.map((x) =>
                                x.id === item.id
                                  ? { ...x, priceCoins: x.priceCoins + 50 }
                                  : x
                              )
                            )
                          }
                          className="w-7 h-7 rounded-full bg-white border border-[#FFE1C2] flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onUpdateShopCatalog(
                              state.shopCatalog.map((x) =>
                                x.id === item.id ? { ...x, active: !x.active } : x
                              )
                            )
                          }
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer ${
                            item.active
                              ? 'bg-[#4CC38A] text-white'
                              : 'bg-[#2B2340]/20 text-[#2B2340]'
                          }`}
                        >
                          {item.active ? '판매중' : '숨김'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onUpdateShopCatalog(state.shopCatalog.filter((x) => x.id !== item.id))
                          }
                          className="w-8 h-8 rounded-full bg-[#FF6B57]/10 hover:bg-[#FF6B57] hover:text-white text-[#FF6B57] flex items-center justify-center cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Purchased Coupons Redemption List */}
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#FFD166]" />
                  <h2 className="text-lg font-extrabold text-[#2B2340]">
                    학생이 교환한 쿠폰 · 사용 승인 내역 ({state.purchasedItems.length}건)
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340]">
                  <span>보유 잔액:</span>
                  <span className="font-extrabold text-[#FF6B57] tabular-nums">{state.coins.toLocaleString()} C</span>
                  <span className="text-[#2B2340]/40">·</span>
                  <span>누적:</span>
                  <span className="font-extrabold text-[#4CC38A] tabular-nums">{state.exp.toLocaleString()} EXP (Lv.{state.level})</span>
                </div>
              </div>

              {/* Student EXP / Activity Audit Trail Box */}
              <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#2B2340]">
                  <span>💡 최근 학습 활동 및 EXP/코인 획득 근거 요약</span>
                  <span className="text-[11px] font-bold text-[#2B2340]/60">
                    {state.studentName} 학생 (최근 {Object.keys(state.studyLogs).length}일간의 기록)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
                  <div className="rounded-xl bg-[#FFF7EC] p-2.5 border border-[#FFE1C2]">
                    <div className="text-[10px] font-bold text-[#2B2340]/60">완료한 모험 단계</div>
                    <div className="text-sm font-black text-[#2B2340] tabular-nums mt-0.5">
                      {state.completedStages.length}개 단계
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#FFF7EC] p-2.5 border border-[#FFE1C2]">
                    <div className="text-[10px] font-bold text-[#2B2340]/60">외운 글자·단어</div>
                    <div className="text-sm font-black text-[#2B2340] tabular-nums mt-0.5">
                      {state.learnedKana.length + state.learnedVocab.length}개
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#FFF7EC] p-2.5 border border-[#FFE1C2]">
                    <div className="text-[10px] font-bold text-[#2B2340]/60">모의고사 응시</div>
                    <div className="text-sm font-black text-[#2B2340] tabular-nums mt-0.5">
                      {state.mockExamHistory.length}회 응시
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#FFF7EC] p-2.5 border border-[#FFE1C2]">
                    <div className="text-[10px] font-bold text-[#2B2340]/60">가나 낙하 최고 기록</div>
                    <div className="text-sm font-black text-[#4CC38A] tabular-nums mt-0.5">
                      {state.gameRecords.kanaDropBest.toLocaleString()}점
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-[#2B2340]/65 pt-1">
                  * 학생이 문제를 맞히거나 미션을 완료할 때만 EXP와 코인이 정산되며, 관리자는 아래 교환 건을 확인한 후 안전하게 사용 완료 처리할 수 있습니다.
                </p>
              </div>

              {state.purchasedItems.length === 0 ? (
                <div className="rounded-2xl bg-[#FFF7EC] p-8 text-center text-xs font-bold text-[#2B2340]/60">
                  아직 학생이 상점에서 교환한 아이템이 없습니다.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[...state.purchasedItems].reverse().map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{p.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-[#2B2340] truncate">
                            {p.title}
                          </div>
                          <div className="text-[11px] font-bold text-[#2B2340]/60 tabular-nums">
                            {p.purchasedAt.slice(0, 10)} · {p.priceCoins} C
                          </div>
                        </div>
                      </div>

                      {p.status === 'unused' ? (
                        <button
                          type="button"
                          onClick={() => onRedeemPurchasedItem(p.id)}
                          className="px-3 py-1.5 rounded-full bg-[#2B2340] hover:bg-[#3f345d] text-white text-[11px] font-extrabold cursor-pointer shrink-0"
                        >
                          사용 완료 처리
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4CC38A]/15 text-[#228558] text-[11px] font-extrabold shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          완료됨
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SETTINGS & BACKUP TAB ================= */}
        {adminSubTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Level & Mission Details */}
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-5">
              {/* Student Profile Name & Emoji Section */}
              <div className="pb-5 border-b border-[#FFE1C2] space-y-3">
                <h2 className="text-lg font-extrabold text-[#2B2340]">학생 프로필 설정 (이름 · 이모지)</h2>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="admin-student-name-input"
                      className="block text-xs font-bold text-[#2B2340]/65 mb-1"
                    >
                      학생 이름 (홈 · 상단 · 인쇄물 · 리포트에 모두 반영)
                    </label>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!draftStudentName.trim()) return;
                        onUpdateProfile(draftStudentName.trim(), draftProfileEmoji);
                      }}
                      className="flex flex-wrap gap-2"
                    >
                      <input
                        id="admin-student-name-input"
                        type="text"
                        maxLength={40}
                        value={draftStudentName}
                        onChange={(e) => setDraftStudentName(e.target.value)}
                        placeholder={DEFAULT_STUDENT_NAME}
                        className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-sm font-bold text-[#2B2340] focus:outline-none focus:border-[#FF6B57]"
                      />
                      <button
                        type="submit"
                        disabled={!draftStudentName.trim()}
                        className="px-4 py-2.5 rounded-xl bg-[#FF6B57] disabled:bg-[#E8E3EF] hover:bg-[#ef5944] text-white text-xs font-extrabold whitespace-nowrap cursor-pointer"
                      >
                        프로필 저장
                      </button>
                    </form>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#2B2340]/65 mb-1.5">프로필 이모지</div>
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                      {PROFILE_EMOJI_OPTIONS.map((emojiOpt) => {
                        const active = draftProfileEmoji === emojiOpt;
                        return (
                          <button
                            key={emojiOpt}
                            type="button"
                            onClick={() => {
                              setDraftProfileEmoji(emojiOpt);
                              onUpdateProfile(
                                draftStudentName.trim() || state.studentName,
                                emojiOpt
                              );
                            }}
                            aria-label={`학생 이모지 ${emojiOpt} 선택`}
                            aria-pressed={active}
                            className={`h-9 rounded-xl text-lg flex items-center justify-center cursor-pointer transition-all ${
                              active
                                ? 'bg-[#FFE9A8] border-2 border-[#FF6B57] scale-105'
                                : 'bg-[#FFF7EC] border border-[#FFE1C2] hover:border-[#FFB09E]'
                            }`}
                          >
                            <span>{emojiOpt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-extrabold text-[#2B2340]">학생 급수·난이도 및 학습 목표</h2>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2340]/65 mb-1">지정 목표 급수</label>
                  <select
                    value={state.targetLevel}
                    onChange={(e) => onUpdateLevelAssignment(e.target.value as JlptLevel, state.subLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-sm font-bold"
                  >
                    {(['STAGE0', 'N5', 'N4', 'N3', 'N2', 'N1'] as JlptLevel[]).map((l) => (
                      <option key={l} value={l}>
                        {l === 'STAGE0' ? '0단계 (가나·기초)' : `JLPT ${l}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2340]/65 mb-1">세부 난이도</label>
                  <select
                    value={state.subLevel}
                    onChange={(e) =>
                      onUpdateLevelAssignment(state.targetLevel, Number(e.target.value) as SubDifficulty)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-sm font-bold"
                  >
                    {LEVEL_EXAM_INFO[state.targetLevel].subLevels.map((sub) => (
                      <option key={sub.sub} value={sub.sub}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2340]/65 mb-1">
                  하루 목표 학습 시간 (분) — 그래프 기준선
                </label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={state.missionSettings.dailyMinutesGoal}
                  onChange={(e) =>
                    onUpdateMissionSettings({ dailyMinutesGoal: Math.max(5, Number(e.target.value) || 15) })
                  }
                  className="w-32 px-3.5 py-2 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-sm font-num font-bold"
                />
              </div>

              {/* Operational Safety & Accessibility Settings */}
              <div className="pt-4 border-t border-[#FFE1C2] space-y-4">
                <h3 className="text-sm font-extrabold text-[#2B2340]">운영 · 안전 · 화면 설정</h3>

                {/* 1. Daily Game EXP Cap */}
                <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#2B2340]">
                      하루 게임 EXP 상한 (EXP)
                    </div>
                    <div className="text-[11px] font-semibold text-[#2B2340]/60">
                      상한에 도달해도 게임 연습은 계속할 수 있고 EXP만 멈춰요 (기본 100 EXP)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateMissionSettings({
                          dailyGameExpCap: Math.max(0, (state.missionSettings.dailyGameExpCap ?? 100) - 10)
                        })
                      }
                      className="w-8 h-8 rounded-full border-2 border-[#FFE1C2] bg-white hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                      aria-label="게임 EXP 상한 감소"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-16 text-center text-xs font-num font-extrabold text-[#FF6B57]">
                      {state.missionSettings.dailyGameExpCap ?? 100} EXP
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateMissionSettings({
                          dailyGameExpCap: Math.min(500, (state.missionSettings.dailyGameExpCap ?? 100) + 10)
                        })
                      }
                      className="w-8 h-8 rounded-full border-2 border-[#FFE1C2] bg-white hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                      aria-label="게임 EXP 상한 증가"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 1-B. Textbook Unit Completion Bonus EXP */}
                <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#2B2340]">
                      교재 완료 보상 EXP (EXP)
                    </div>
                    <div className="text-[11px] font-semibold text-[#2B2340]/60">
                      교재 코드 단원에서 「교재 완료」 버튼을 누를 때 지급하는 EXP (기본 20 EXP)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateMissionSettings({
                          textbookCompletionExp: Math.max(5, (state.missionSettings.textbookCompletionExp ?? 20) - 5)
                        })
                      }
                      className="w-8 h-8 rounded-full border-2 border-[#FFE1C2] bg-white hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                      aria-label="교재 보상 EXP 감소"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-16 text-center text-xs font-num font-extrabold text-[#FF6B57]">
                      {state.missionSettings.textbookCompletionExp ?? 20} EXP
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateMissionSettings({
                          textbookCompletionExp: Math.min(200, (state.missionSettings.textbookCompletionExp ?? 20) + 5)
                        })
                      }
                      className="w-8 h-8 rounded-full border-2 border-[#FFE1C2] bg-white hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                      aria-label="교재 보상 EXP 증가"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Break Reminder Setting */}
                <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#2B2340]">
                        연속 학습 쉬는 시간 알림
                      </div>
                      <div className="text-[11px] font-semibold text-[#2B2340]/60">
                        연속 공부 시 눈·스트레칭 5분 휴식 안내 모달 표시 (기본 40분)
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={state.missionSettings.breakReminderEnabled ?? true}
                      onClick={() =>
                        onUpdateMissionSettings({
                          breakReminderEnabled: !(state.missionSettings.breakReminderEnabled ?? true)
                        })
                      }
                      className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                        (state.missionSettings.breakReminderEnabled ?? true) ? 'bg-[#4CC38A]' : 'bg-[#E8E3EF]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          (state.missionSettings.breakReminderEnabled ?? true) ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {(state.missionSettings.breakReminderEnabled ?? true) && (
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#FFE1C2]">
                      <span className="text-xs font-bold text-[#2B2340]/80">알림 기준 시간 (분)</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateMissionSettings({
                              breakReminderMinutes: Math.max(10, (state.missionSettings.breakReminderMinutes ?? 40) - 5)
                            })
                          }
                          className="w-8 h-8 rounded-full border border-[#FFE1C2] bg-white hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                          aria-label="휴식 기준 시간 감소"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 text-center text-xs font-num font-extrabold text-[#2B2340]">
                          {state.missionSettings.breakReminderMinutes ?? 40}분
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateMissionSettings({
                              breakReminderMinutes: Math.min(90, (state.missionSettings.breakReminderMinutes ?? 40) + 5)
                            })
                          }
                          className="w-8 h-8 rounded-full border border-[#FFE1C2] bg-white hover:bg-[#FFF1DF] flex items-center justify-center cursor-pointer"
                          aria-label="휴식 기준 시간 증가"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Font Scale (3-step) */}
                <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#2B2340]">
                      글자 크기 조절 (화면 · 일본어 카드)
                    </div>
                    <div className="text-[11px] font-semibold text-[#2B2340]/60">
                      학생 태블릿·PC 시야에 맞춰 3단계로 조정해요
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {([
                      { id: 'normal' as const, label: '보통' },
                      { id: 'large' as const, label: '크게' },
                      { id: 'xlarge' as const, label: '아주 크게' }
                    ] as const).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChangeFontSizeScale(opt.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold border cursor-pointer ${
                          (state.fontSizeScale || 'normal') === opt.id
                            ? 'bg-[#2B2340] border-[#2B2340] text-white'
                            : 'bg-white border-[#FFE1C2] text-[#2B2340]/75 hover:border-[#FF6B57]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Diagnostic Test Retake */}
                <div className="rounded-2xl bg-[#FFFDF9] border-2 border-[#FFE1C2] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#2B2340]">출발선 진단 테스트</div>
                    <div className="text-[11px] font-semibold text-[#2B2340]/60">
                      {state.diagnosticResult
                        ? state.diagnosticResult.skipped
                          ? '첫 접속 시 건너뜀 (0단계 시작)'
                          : `최근 점수 ${state.diagnosticResult.score}/${state.diagnosticResult.total}점 · 추천 ${
                              state.diagnosticResult.recommendedLevel === 'STAGE0'
                                ? '0단계'
                                : state.diagnosticResult.recommendedLevel
                            }`
                        : '아직 응시 기록이 없어요'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onRetakeDiagnostic}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-xs font-extrabold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>진단 테스트 다시 하기</span>
                  </button>
                </div>
              </div>

              {/* PIN Change */}
              <div className="pt-4 border-t border-[#FFE1C2] space-y-2.5">
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#2B2340]">
                  <KeyRound className="w-4 h-4 text-[#FF6B57]" />
                  <span>관리자 4자리 PIN 변경</span>
                </div>
                <p className="text-[11px] font-semibold text-[#2B2340]/60">
                  ※ 관리자 권한은 서버(Firestore admins 컬렉션)에서 검증되며, 4자리 PIN은 화면 보호용 보조 잠금(5회 연속 오답 시 5분 잠금)으로만 사용됩니다.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    inputMode="numeric"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="새 4자리 숫자"
                    className="px-3.5 py-2 rounded-xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-sm font-num font-bold w-40"
                  />
                  <button
                    type="button"
                    disabled={newPin.length !== 4}
                    onClick={() => {
                      onChangePin(newPin);
                      setNewPin('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#2B2340] disabled:bg-[#E8E3EF] text-white text-xs font-extrabold cursor-pointer"
                  >
                    PIN 저장
                  </button>
                </div>
              </div>

              {/* Register additional admin UID */}
              <div className="pt-4 border-t border-[#FFE1C2] space-y-2.5">
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#2B2340]">
                  <ShieldPlus className="w-4 h-4 text-[#4CC38A]" />
                  <span>추가 관리자 등록 (Firestore admins)</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newAdminUid}
                    onChange={(e) => setNewAdminUid(e.target.value)}
                    placeholder="Firebase UID"
                    className="px-3 py-2 rounded-xl border border-[#FFE1C2] text-xs"
                  />
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="관리자 이메일"
                    className="px-3 py-2 rounded-xl border border-[#FFE1C2] text-xs"
                  />
                  <input
                    type="text"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="표시 이름"
                    className="px-3 py-2 rounded-xl border border-[#FFE1C2] text-xs"
                  />
                </div>
                <button
                  type="button"
                  disabled={!newAdminUid.trim() || !newAdminEmail.trim()}
                  onClick={() => {
                    onAddAdminUid(newAdminUid, newAdminEmail, newAdminName).then(() => {
                      setNewAdminUid('');
                      setNewAdminEmail('');
                      setNewAdminName('');
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#4CC38A] disabled:bg-[#E8E3EF] text-white text-xs font-extrabold cursor-pointer"
                >
                  관리자 권한 추가
                </button>
              </div>
            </div>

            {/* JSON Backup & Sample/Reset */}
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-5">
              <h2 className="text-lg font-extrabold text-[#2B2340]">데이터 백업 &amp; 관리</h2>

              {backupOverdueDays >= 7 && (
                <div className="rounded-2xl bg-[#FFF3CC] border-2 border-[#FFD166] p-3.5 flex items-center gap-2.5 text-xs font-bold text-[#7A4F01]">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706]" />
                  <span>
                    {state.lastBackupAt
                      ? `마지막 백업 후 ${backupOverdueDays}일이 지났어요. JSON 백업을 권장해요!`
                      : '아직 JSON 백업을 내보낸 적이 없어요. 안전한 보관을 위해 백업을 내려받으세요.'}
                  </span>
                </div>
              )}

              <div className="text-xs font-bold text-[#2B2340]/70">
                마지막 백업 날짜: {state.lastBackupAt ? state.lastBackupAt.slice(0, 10) : '기록 없음'}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onExportJson}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-xs font-extrabold cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>JSON 백업 내보내기</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B2340] hover:bg-[#3f345d] text-white text-xs font-extrabold cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#FFD166]" />
                  <span>JSON 백업 불러오기</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="pt-4 border-t border-[#FFE1C2] space-y-2.5">
                <div className="text-xs font-extrabold text-[#2B2340]/65">체험 및 초기화 도구</div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={onLoadSampleData}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:bg-[#FFEBD2] text-xs font-bold text-[#2B2340] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B57]" />
                    <span>15일 학습 샘플 데이터 채우기</span>
                  </button>
                  <button
                    type="button"
                    onClick={onResetStudentData}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border-2 border-[#FF6B57]/30 hover:bg-[#FF6B57]/10 text-xs font-bold text-[#FF6B57] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>0단계 초기 상태로 되돌리기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRINTABLE REPORT TAB ================= */}
        {adminSubTab === 'report' && (
          <div className="space-y-5">
            <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF6B57]" />
                <button
                  type="button"
                  onClick={() => setReportScope('weekly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                    reportScope === 'weekly' ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
                  }`}
                >
                  주간 리포트
                </button>
                <button
                  type="button"
                  onClick={() => setReportScope('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                    reportScope === 'monthly' ? 'bg-[#2B2340] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
                  }`}
                >
                  월간 리포트
                </button>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#2B2340] text-white text-xs font-extrabold cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#FFD166]" />
                <span>A4 리포트 인쇄하기</span>
              </button>
            </div>

            {/* A4 Printable Report */}
            <div className="print-sheet bg-white border-2 border-neutral-300 rounded-2xl p-8 text-black max-w-[820px] mx-auto space-y-6">
              <div className="border-b-2 border-black pb-3 flex items-end justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-600">ARI JLPT – アリのにほんご</div>
                  <h2 className="text-2xl font-extrabold mt-0.5">
                    {state.studentName} {reportScope === 'weekly' ? '주간' : '월간'} 학습 리포트
                  </h2>
                </div>
                <div className="text-xs font-semibold text-right">
                  <div>이름: {state.studentName}</div>
                  <div>작성일: {todayKey}</div>
                  <div>현재 단계: {currentStage.worldLabel} 「{currentStage.title}」</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="border border-black rounded-lg p-3">
                  <div className="text-xs text-neutral-600">누적 학습 시간</div>
                  <div className="text-xl font-extrabold mt-1 tabular-nums">{analytics.thisWeekMins}분</div>
                </div>
                <div className="border border-black rounded-lg p-3">
                  <div className="text-xs text-neutral-600">미션 달성률</div>
                  <div className="text-xl font-extrabold mt-1 tabular-nums">{analytics.missionRate}%</div>
                </div>
                <div className="border border-black rounded-lg p-3">
                  <div className="text-xs text-neutral-600">퀴즈 정답률</div>
                  <div className="text-xl font-extrabold mt-1 tabular-nums">{analytics.quizAccuracy}%</div>
                </div>
                <div className="border border-black rounded-lg p-3">
                  <div className="text-xs text-neutral-600">외운 글자 / 연속</div>
                  <div className="text-xl font-extrabold mt-1 tabular-nums">
                    {learnedCount}자 / {state.streak}일
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-black rounded-lg p-4 space-y-2">
                  <h3 className="font-extrabold text-sm">👏 잘한 점</h3>
                  <ul className="text-xs space-y-1.5 list-disc pl-4">
                    <li>연속 학습 {state.streak}일 달성 및 총 {state.badges.length}개의 배지를 모았어요.</li>
                    <li>0단계 진도 {stage0Pct}%, 외운 글자 {learnedCount}자로 꾸준히 성장 중이에요.</li>
                    <li>가나 낙하 게임 최고 {state.gameRecords.kanaDropBest.toLocaleString()}점으로 반응 속도가 빨라졌어요.</li>
                  </ul>
                </div>

                <div className="border border-black rounded-lg p-4 space-y-2">
                  <h3 className="font-extrabold text-sm">🎯 보완할 점 &amp; 다음 목표</h3>
                  <ul className="text-xs space-y-1.5 list-disc pl-4">
                    <li>
                      집중 복습 추천 글자:{' '}
                      {weakItems.length > 0
                        ? weakItems
                            .slice(0, 4)
                            .map((w) => `${w.char}(${w.accuracy}%)`)
                            .join(', ')
                        : '현재 약점 글자 없음'}
                    </li>
                    <li>추천 프린트: {recommendedPair.title} 비교 쓰기표 1장 연습하기</li>
                    <li>{predictionText}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
