import { ALL_KANA, HIRAGANA_BASIC, KATAKANA_BASIC } from '../data/kanaData';
import { ADVENTURE_STAGES } from '../data/adventureRoadmapData';
import { StudentState } from '../types';

const STORAGE_KEY = 'mirai_jlpt_state_v1';
const ADMIN_PIN_STORAGE_KEY = 'mirai_admin_pin_v1';
export const EXP_PER_LEVEL = 1000;
export const SRS_INTERVALS = [1, 3, 7, 14, 30] as const;

export function getTodayKey(baseDate = new Date()): string {
  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, '0');
  const d = String(baseDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysToKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + days);
  return getTodayKey(dt);
}

export function diffDaysBetweenKeys(fromKey: string, toKey: string): number {
  if (!fromKey || !toKey) return 0;
  const [y1, m1, d1] = fromKey.split('-').map(Number);
  const [y2, m2, d2] = toKey.split('-').map(Number);
  const dt1 = new Date(y1, (m1 || 1) - 1, d1 || 1);
  const dt2 = new Date(y2, (m2 || 1) - 1, d2 || 1);
  return Math.round((dt2.getTime() - dt1.getTime()) / (1000 * 60 * 60 * 24));
}

/** Calculates days remaining until the next official JLPT (1st Sunday of July or December) */
export function getNextJlptDDay(now = new Date()): { days: number; label: string } {
  const getFirstSunday = (year: number, monthIndex: number) => {
    const first = new Date(year, monthIndex, 1);
    const offset = (7 - first.getDay()) % 7;
    return new Date(year, monthIndex, 1 + offset);
  };

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const candidates = [
    { date: getFirstSunday(now.getFullYear(), 6), label: `${now.getFullYear()}년 7월 JLPT` },
    { date: getFirstSunday(now.getFullYear(), 11), label: `${now.getFullYear()}년 12월 JLPT` },
    { date: getFirstSunday(now.getFullYear() + 1, 6), label: `${now.getFullYear() + 1}년 7월 JLPT` }
  ];

  const upcoming = candidates.find((c) => c.date.getTime() >= today.getTime()) || candidates[2];
  const days = Math.max(0, Math.ceil((upcoming.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  return { days, label: upcoming.label };
}

export function createInitialStudentState(uid = 'local_student', studentName = '지우'): StudentState {
  const today = getTodayKey();
  return {
    uid,
    studentName,
    level: 1,
    exp: 0,
    targetLevel: 'STAGE0',
    subLevel: 1,
    streak: 0,
    lastStudyDate: '',
    streakDates: [],
    streakProtections: 1,
    currentStageId: 'stage_h_a',
    unlockedStages: ['stage_h_a'],
    completedStages: [],
    learnedKana: [],
    bookmarkedKana: [],
    kanaStats: {},
    srsItems: {},
    badges: [],
    cultureCards: [],
    gameRecords: {
      kanaDropBest: 0,
      kanaDropPlaysToday: 0,
      listeningBest: 0,
      listeningPlaysToday: 0,
      lastGameDate: today
    },
    studyLogs: {},
    dailyMissions: {
      date: today,
      newCharsCount: 0,
      gamesPlayed: 0,
      reviewDone: false,
      routineVocab: false,
      routineGrammar: false,
      routineReading: false
    },
    missionSettings: {
      dailyNewChars: 5,
      dailyGameMissions: 1,
      autoWeakReview: true,
      dailyMinutesGoal: 15
    },
    praiseMessages: [
      {
        id: 'praise_welcome',
        text: '일본어 모험 시작을 환영해요! 하루 한 걸음씩 0단계부터 N1까지 함께 가 보자!',
        bonusExp: 0,
        createdAt: new Date().toISOString(),
        senderName: '선생님'
      }
    ],
    acknowledgedPraiseIds: [],
    lastBackupAt: '',
    startDate: today
  };
}

/** Optional rich sample 15-day progression state for testing Admin Dashboard analytics immediately */
export function createSamplePopulatedState(uid = 'local_student', studentName = '지우'): StudentState {
  const today = getTodayKey();
  const base = createInitialStudentState(uid, studentName);

  const studyLogs: StudentState['studyLogs'] = {};
  const sampleMins = [12, 16, 10, 19, 14, 15, 20, 11, 14, 17, 8, 16, 6, 13, 4];
  for (let i = 14; i >= 0; i--) {
    const key = addDaysToKey(today, -i);
    const mins = sampleMins[14 - i] ?? 12;
    studyLogs[key] = {
      studyMinutes: mins,
      gameMinutes: i % 3 === 0 ? 5 : 3,
      quizAttempts: 10,
      quizCorrect: i % 4 === 0 ? 7 : 9,
      missionsCompleted: mins >= 12 ? 3 : 2
    };
  }

  const streakDates = [0, 1, 2, 3, 4, 5].map((offset) => addDaysToKey(today, -offset));

  const kanaStats: StudentState['kanaStats'] = {
    'あ': { attempts: 18, correct: 17, confusedWith: { 'お': 1 }, lastPracticedAt: today },
    'い': { attempts: 16, correct: 15, confusedWith: {}, lastPracticedAt: today },
    'う': { attempts: 14, correct: 13, confusedWith: {}, lastPracticedAt: today },
    'え': { attempts: 14, correct: 11, confusedWith: { 'ん': 2 }, lastPracticedAt: today },
    'お': { attempts: 12, correct: 11, confusedWith: { 'あ': 1 }, lastPracticedAt: today },
    'か': { attempts: 17, correct: 16, confusedWith: {}, lastPracticedAt: today },
    'き': { attempts: 19, correct: 11, confusedWith: { 'さ': 6 }, lastPracticedAt: today },
    'く': { attempts: 15, correct: 11, confusedWith: { 'へ': 2 }, lastPracticedAt: today },
    'け': { attempts: 13, correct: 8, confusedWith: { 'は': 4 }, lastPracticedAt: today },
    'こ': { attempts: 17, correct: 13, confusedWith: {}, lastPracticedAt: today },
    'さ': { attempts: 20, correct: 11, confusedWith: { 'き': 7 }, lastPracticedAt: today },
    'し': { attempts: 16, correct: 14, confusedWith: {}, lastPracticedAt: today },
    'す': { attempts: 14, correct: 10, confusedWith: { 'む': 3 }, lastPracticedAt: today }
  };

  const srsItems: StudentState['srsItems'] = {
    'あ': { id: 'h_a', char: 'あ', intervalDays: 7, nextReviewDate: addDaysToKey(today, 4), repetitions: 3, lastReviewedAt: addDaysToKey(today, -3) },
    'い': { id: 'h_i', char: 'い', intervalDays: 7, nextReviewDate: addDaysToKey(today, 3), repetitions: 3, lastReviewedAt: addDaysToKey(today, -4) },
    'き': { id: 'h_ki', char: 'き', intervalDays: 1, nextReviewDate: today, repetitions: 1, lastReviewedAt: addDaysToKey(today, -1) },
    'さ': { id: 'h_sa', char: 'さ', intervalDays: 1, nextReviewDate: today, repetitions: 1, lastReviewedAt: addDaysToKey(today, -1) },
    'け': { id: 'h_ke', char: 'け', intervalDays: 3, nextReviewDate: today, repetitions: 2, lastReviewedAt: addDaysToKey(today, -3) }
  };

  return {
    ...base,
    level: 3,
    exp: 2420,
    streak: 6,
    lastStudyDate: today,
    streakDates,
    currentStageId: 'stage_h_ka',
    unlockedStages: ['stage_h_a', 'stage_h_ka'],
    completedStages: ['stage_h_a'],
    learnedKana: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'],
    bookmarkedKana: ['き', 'さ'],
    kanaStats,
    srsItems,
    badges: ['badge_early_bird', 'badge_streak_3', 'badge_hiragana_start', 'badge_drop_pro'],
    cultureCards: ['card_sakura'],
    gameRecords: {
      kanaDropBest: 1240,
      kanaDropPlaysToday: 1,
      listeningBest: 780,
      listeningPlaysToday: 0,
      lastGameDate: today
    },
    studyLogs,
    dailyMissions: {
      date: today,
      newCharsCount: 5,
      gamesPlayed: 1,
      reviewDone: false,
      routineVocab: true,
      routineGrammar: false,
      routineReading: false
    },
    praiseMessages: [
      {
        id: 'praise_sample_1',
        text: 'き와 さ를 헷갈리지 않게 오늘 쓰기표 한 장 해 보자! 이번 주 정말 잘하고 있어 👍',
        bonusExp: 50,
        createdAt: new Date().toISOString(),
        senderName: '선생님'
      }
    ],
    acknowledgedPraiseIds: [],
    startDate: addDaysToKey(today, -14)
  };
}

export function normalizeDailyState(state: StudentState): StudentState {
  const today = getTodayKey();
  let updated = { ...state };

  // Reset daily counters if date changed
  if (updated.dailyMissions?.date !== today) {
    updated.dailyMissions = {
      date: today,
      newCharsCount: 0,
      gamesPlayed: 0,
      reviewDone: false,
      routineVocab: false,
      routineGrammar: false,
      routineReading: false
    };
  }
  if (updated.gameRecords?.lastGameDate !== today) {
    updated.gameRecords = {
      ...updated.gameRecords,
      kanaDropPlaysToday: 0,
      listeningPlaysToday: 0,
      lastGameDate: today
    };
  }

  // Evaluate idle streak decay (>=2 days missed resets to 0 unless protected)
  if (updated.lastStudyDate) {
    const gap = diffDaysBetweenKeys(updated.lastStudyDate, today);
    if (gap >= 2) {
      if (gap === 2 && updated.streakProtections > 0 && updated.streak > 0) {
        // Auto-apply 1 streak protection when missing exactly 1 day
        updated.streakProtections = Math.max(0, updated.streakProtections - 1);
        updated.lastStudyDate = addDaysToKey(today, -1);
      } else {
        updated.streak = 0;
      }
    }
  }

  // Keep level in sync with EXP
  updated.level = Math.floor(updated.exp / EXP_PER_LEVEL) + 1;

  return updated;
}

export function loadLocalStudentState(): StudentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeDailyState(createInitialStudentState());
    const parsed = JSON.parse(raw) as Partial<StudentState>;
    const base = createInitialStudentState(parsed.uid || 'local_student', parsed.studentName || '지우');
    const merged: StudentState = {
      ...base,
      ...parsed,
      gameRecords: { ...base.gameRecords, ...(parsed.gameRecords || {}) },
      dailyMissions: { ...base.dailyMissions, ...(parsed.dailyMissions || {}) },
      missionSettings: { ...base.missionSettings, ...(parsed.missionSettings || {}) },
      kanaStats: parsed.kanaStats || {},
      srsItems: parsed.srsItems || {},
      studyLogs: parsed.studyLogs || {}
    };
    return normalizeDailyState(merged);
  } catch {
    return normalizeDailyState(createInitialStudentState());
  }
}

export function saveLocalStudentState(state: StudentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function getLocalAdminPin(): string {
  try {
    return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || '1234';
  } catch {
    return '1234';
  }
}

export function setLocalAdminPin(pin: string): void {
  try {
    localStorage.setItem(ADMIN_PIN_STORAGE_KEY, pin);
  } catch {
    // ignore
  }
}

export function recordStudyActivity(
  state: StudentState,
  opts: {
    expGain?: number;
    studyMinutes?: number;
    gameMinutes?: number;
    quizAttempts?: number;
    quizCorrect?: number;
  }
): StudentState {
  const today = getTodayKey();
  const prevLog = state.studyLogs[today] || {
    studyMinutes: 0,
    gameMinutes: 0,
    quizAttempts: 0,
    quizCorrect: 0,
    missionsCompleted: 0
  };

  let streak = state.streak;
  let lastStudyDate = state.lastStudyDate;
  const streakDates = new Set(state.streakDates || []);

  if (!lastStudyDate) {
    streak = 1;
  } else if (lastStudyDate === today) {
    streak = Math.max(1, streak);
  } else {
    const gap = diffDaysBetweenKeys(lastStudyDate, today);
    if (gap === 1) {
      streak = streak + 1;
    } else if (gap >= 2) {
      streak = 1;
    }
  }
  lastStudyDate = today;
  streakDates.add(today);

  const newExp = Math.max(0, state.exp + (opts.expGain || 0));
  const nextLevel = Math.floor(newExp / EXP_PER_LEVEL) + 1;

  const nextState: StudentState = {
    ...state,
    exp: newExp,
    level: nextLevel,
    streak,
    lastStudyDate,
    streakDates: Array.from(streakDates).sort().slice(-366),
    studyLogs: {
      ...state.studyLogs,
      [today]: {
        studyMinutes: prevLog.studyMinutes + (opts.studyMinutes || 0),
        gameMinutes: prevLog.gameMinutes + (opts.gameMinutes || 0),
        quizAttempts: prevLog.quizAttempts + (opts.quizAttempts || 0),
        quizCorrect: prevLog.quizCorrect + (opts.quizCorrect || 0),
        missionsCompleted: prevLog.missionsCompleted
      }
    }
  };

  return evaluateBadges(nextState);
}

export function recordKanaAttempt(
  state: StudentState,
  char: string,
  isCorrect: boolean,
  confusedAnswerChar?: string
): StudentState {
  const today = getTodayKey();
  const prev = state.kanaStats[char] || { attempts: 0, correct: 0, confusedWith: {} };
  const confusedWith = { ...prev.confusedWith };
  if (!isCorrect && confusedAnswerChar && confusedAnswerChar !== char) {
    confusedWith[confusedAnswerChar] = (confusedWith[confusedAnswerChar] || 0) + 1;
  }

  // Update or initialize SRS schedule
  const prevSrs = state.srsItems[char];
  const kanaMeta = ALL_KANA.find((k) => k.char === char);
  let nextInterval = 1;
  let reps = prevSrs?.repetitions || 0;

  if (isCorrect) {
    const idx = prevSrs ? SRS_INTERVALS.indexOf(prevSrs.intervalDays as (typeof SRS_INTERVALS)[number]) : -1;
    nextInterval = idx >= 0 && idx < SRS_INTERVALS.length - 1 ? SRS_INTERVALS[idx + 1] : idx === SRS_INTERVALS.length - 1 ? 30 : 1;
    reps += 1;
  } else {
    nextInterval = 1; // Reset to 1 day on error
  }

  const nextSrs = {
    id: kanaMeta?.id || char,
    char,
    intervalDays: nextInterval,
    nextReviewDate: addDaysToKey(today, nextInterval),
    repetitions: reps,
    lastReviewedAt: today
  };

  return {
    ...state,
    kanaStats: {
      ...state.kanaStats,
      [char]: {
        attempts: prev.attempts + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        confusedWith,
        lastPracticedAt: today
      }
    },
    srsItems: {
      ...state.srsItems,
      [char]: nextSrs
    }
  };
}

export function getDueSrsChars(state: StudentState): string[] {
  const today = getTodayKey();
  const due = Object.values(state.srsItems)
    .filter((item) => item.nextReviewDate <= today)
    .map((item) => item.char);

  if (state.missionSettings.autoWeakReview) {
    const weakChars = Object.entries(state.kanaStats)
      .filter(([, stat]) => stat.attempts >= 2 && stat.correct / stat.attempts < 0.7)
      .map(([ch]) => ch);
    for (const w of weakChars) {
      if (!due.includes(w)) due.push(w);
    }
  }
  return due;
}

export function evaluateBadges(state: StudentState): StudentState {
  const earned = new Set(state.badges || []);

  if (state.learnedKana.length > 0 || Object.keys(state.kanaStats).length > 0) {
    earned.add('badge_early_bird');
  }
  if (state.streak >= 3) earned.add('badge_streak_3');
  if (state.streak >= 7) earned.add('badge_streak_7');
  if (state.completedStages.includes('stage_h_a')) earned.add('badge_hiragana_start');

  const learnedSet = new Set(state.learnedKana);
  const hiraCount = HIRAGANA_BASIC.filter((k) => learnedSet.has(k.char)).length;
  const kataCount = KATAKANA_BASIC.filter((k) => learnedSet.has(k.char)).length;
  if (hiraCount >= 40 || state.completedStages.includes('stage_h_wa')) {
    earned.add('badge_hiragana_master');
  }
  if (kataCount >= 40 || state.completedStages.includes('stage_katakana')) {
    earned.add('badge_katakana_master');
  }
  if (state.gameRecords.kanaDropBest >= 1000) {
    earned.add('badge_drop_pro');
  }
  const totalSrsReps = Object.values(state.srsItems).reduce((acc, i) => acc + i.repetitions, 0);
  if (totalSrsReps >= 10) {
    earned.add('badge_srs_champ');
  }
  if (state.unlockedStages.includes('stage_n5') || state.targetLevel !== 'STAGE0') {
    earned.add('badge_n5_challenger');
  }

  return {
    ...state,
    badges: Array.from(earned)
  };
}

export function getMissionCountSummary(state: StudentState): { completed: number; total: number } {
  const m = state.dailyMissions;
  const s = state.missionSettings;
  let completed = 0;
  if (m.newCharsCount >= s.dailyNewChars) completed++;
  if (m.gamesPlayed >= s.dailyGameMissions) completed++;
  if (m.reviewDone) completed++;
  return { completed, total: 3 };
}

export function getStage0ProgressPercent(state: StudentState): number {
  const stage0Stages = ADVENTURE_STAGES.filter((s) => s.world === 'STAGE0');
  const stageScore = state.completedStages.filter((id) => stage0Stages.some((s) => s.id === id)).length;
  const learnedHira = HIRAGANA_BASIC.filter((k) => state.learnedKana.includes(k.char)).length;
  const learnedKata = KATAKANA_BASIC.filter((k) => state.learnedKana.includes(k.char)).length;
  const charPct = (learnedHira + learnedKata) / 92;
  const stagePct = stageScore / stage0Stages.length;
  return Math.min(100, Math.round(((charPct * 0.65) + (stagePct * 0.35)) * 100));
}

export function getOverallN1RoadmapPercent(state: StudentState): number {
  const stage0Pct = getStage0ProgressPercent(state);
  const levelIndex = ['STAGE0', 'N5', 'N4', 'N3', 'N2', 'N1'].indexOf(state.targetLevel);
  const completedAll = state.completedStages.length;
  return Math.min(100, Math.round((stage0Pct * 0.08) + (completedAll / ADVENTURE_STAGES.length) * 80 + Math.max(0, levelIndex) * 4));
}

export function exportBackupJson(state: StudentState): string {
  const payload = {
    app: '미라이 JLPT – にほんご 모험',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: state
  };
  return JSON.stringify(payload, null, 2);
}

export function parseBackupJson(rawText: string): StudentState | null {
  try {
    const parsed = JSON.parse(rawText);
    const candidate = (parsed?.data ? parsed.data : parsed) as Partial<StudentState>;
    if (!candidate || typeof candidate.studentName !== 'string' || typeof candidate.exp !== 'number') {
      return null;
    }
    const base = createInitialStudentState(candidate.uid || 'local_student', candidate.studentName);
    return normalizeDailyState({
      ...base,
      ...candidate,
      gameRecords: { ...base.gameRecords, ...(candidate.gameRecords || {}) },
      dailyMissions: { ...base.dailyMissions, ...(candidate.dailyMissions || {}) },
      missionSettings: { ...base.missionSettings, ...(candidate.missionSettings || {}) },
      kanaStats: candidate.kanaStats || {},
      srsItems: candidate.srsItems || {},
      studyLogs: candidate.studyLogs || {}
    });
  } catch {
    return null;
  }
}
