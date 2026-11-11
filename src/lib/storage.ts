import { ALL_KANA, HIRAGANA_BASIC, KATAKANA_BASIC } from '../data/kanaData';
import { ADVENTURE_STAGES } from '../data/adventureRoadmapData';
import { DEFAULT_PROFILE_EMOJI, DEFAULT_STUDENT_NAME, ShopItem, StudentState, WrongReasonTag } from '../types';

const STORAGE_KEY = 'ari_jlpt_state_v1';
const LEGACY_STORAGE_KEY = 'mirai_jlpt_state_v1';
const ADMIN_PIN_STORAGE_KEY = 'ari_admin_pin_v1';
const LEGACY_ADMIN_PIN_KEY = 'mirai_admin_pin_v1';
const PENDING_CLOUD_SYNC_KEY = 'ari_pending_cloud_sync_v1';
export const EXP_PER_LEVEL = 1000;
export const SRS_INTERVALS = [1, 3, 7, 14, 30] as const;

export const WRONG_REASON_META: Record<
  WrongReasonTag,
  {
    id: WrongReasonTag;
    label: string;
    color: string;
    prescription: string;
    printRecommendation?: 'confusingSheet' | 'dailySheet' | 'wrongNotes';
  }
> = {
  char_confusion: {
    id: 'char_confusion',
    label: '글자 헷갈림',
    color: '#FF6B57',
    prescription:
      '글자 모양 혼동이 가장 많아요 → 학습실 "헷갈리는 글자 비교" 훈련과 인쇄 센터 "비교 쓰기표" 출력을 추천해요!',
    printRecommendation: 'confusingSheet'
  },
  sound_confusion: {
    id: 'sound_confusion',
    label: '발음 헷갈림',
    color: '#6D5DF6',
    prescription:
      '소리와 글자 연결이 흔들리고 있어요 → "0.65x 천천히 듣기"와 게임존 "듣고 글자 고르기" 복습을 추천해요!',
    printRecommendation: 'wrongNotes'
  },
  meaning_unknown: {
    id: 'meaning_unknown',
    label: '뜻을 몰랐음',
    color: '#FFD166',
    prescription:
      '어휘·표현 복습 비중을 높여 주세요 → 단어장 "플래시카드(후리가나 숨김)"와 "오늘의 학습지" 인쇄가 효과적이에요!',
    printRecommendation: 'dailySheet'
  },
  mistake: {
    id: 'mistake',
    label: '실수',
    color: '#4CC38A',
    prescription:
      '아는 문제를 서둘러 놓치고 있어요 → 보기를 끝까지 읽고 정답 선택 전 3초 확인 습관을 만들어 보세요!',
    printRecommendation: 'wrongNotes'
  }
};

export const DEFAULT_KANA_DROP_TIME_LIMITS = {
  easy: 90,
  normal: 60,
  hard: 45
} as const;

export const DEFAULT_SHOP_CATALOG: ShopItem[] = [
  {
    id: 'shop_streak_shield',
    title: '연속 학습 보호권 +1',
    description: '하루 쉬더라도 연속 학습일(스트릭)이 0일로 초기화되지 않게 자동으로 지켜 줘요.',
    emoji: '🛡️',
    priceCoins: 150,
    effectType: 'streak_protection',
    active: true
  },
  {
    id: 'shop_snack_coupon',
    title: '달콤한 간식 교환권',
    description: '선생님·부모님께 보여 드리면 원하는 맛있는 간식을 받을 수 있는 쿠폰이에요!',
    emoji: '🍡',
    priceCoins: 300,
    effectType: 'reward_coupon',
    active: true
  },
  {
    id: 'shop_free_time_30',
    title: '자유 휴식 30분 이용권',
    description: '오늘의 미션을 다 끝낸 뒤 당당하게 30분 자유 시간을 즐기는 특별 쿠폰!',
    emoji: '🎮',
    priceCoins: 450,
    effectType: 'reward_coupon',
    active: true
  },
  {
    id: 'shop_praise_ticket',
    title: '선생님 특급 응원권',
    description: '선생님께 오늘 배운 내용 칭찬 메시지와 보너스 EXP 응원을 요청해요.',
    emoji: '🌟',
    priceCoins: 120,
    effectType: 'reward_coupon',
    active: true
  }
];

export function formatPraiseText(rawText: string, studentName: string): string {
  const safeName = studentName.trim() || DEFAULT_STUDENT_NAME;
  return rawText.replace(/\{이름\}|\{studentName\}|\{name\}/g, safeName);
}

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

export function createInitialStudentState(
  uid = 'local_student',
  studentName = DEFAULT_STUDENT_NAME,
  profileEmoji = DEFAULT_PROFILE_EMOJI,
  profileConfigured = false
): StudentState {
  const today = getTodayKey();
  return {
    uid,
    studentName,
    profileEmoji,
    profileConfigured,
    diagnosticCompleted: false,
    diagnosticResult: null,
    level: 1,
    exp: 0,
    coins: 100,
    gameExpToday: 0,
    gameExpDate: today,
    fontSizeScale: 'normal',
    lastStudyLocation: null,
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
    learnedVocab: [],
    bookmarkedVocab: [],
    learnedKanji: [],
    bookmarkedKanji: [],
    learnedGrammar: [],
    fourWeekPlanChecks: [],
    kanaStats: {},
    srsItems: {},
    badges: [],
    cultureCards: [],
    mockExamHistory: [],
    wrongNoteEntries: [],
    shopCatalog: DEFAULT_SHOP_CATALOG.map((item) => ({ ...item })),
    purchasedItems: [],
    gameRecords: {
      kanaDropBest: 0,
      kanaDropBestByDifficulty: {
        easy: 0,
        normal: 0,
        hard: 0
      },
      kanaDropPlaysToday: 0,
      listeningBest: 0,
      listeningPlaysToday: 0,
      pairMatchBest: 0,
      pairMatchPlaysToday: 0,
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
      dailyMinutesGoal: 15,
      dailyGameExpCap: 100,
      breakReminderEnabled: true,
      breakReminderMinutes: 40,
      kanaDropTimeLimits: {
        easy: DEFAULT_KANA_DROP_TIME_LIMITS.easy,
        normal: DEFAULT_KANA_DROP_TIME_LIMITS.normal,
        hard: DEFAULT_KANA_DROP_TIME_LIMITS.hard
      }
    },
    praiseMessages: [
      {
        id: 'praise_welcome',
        text: '{이름}, ARI JLPT(アリのにほんご) 모험 시작을 환영해요! 0단계부터 N1 합격까지 하루 한 걸음씩 함께 가 보자!',
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
export function createSamplePopulatedState(
  uid = 'local_student',
  studentName = DEFAULT_STUDENT_NAME,
  profileEmoji = DEFAULT_PROFILE_EMOJI
): StudentState {
  const today = getTodayKey();
  const base = createInitialStudentState(uid, studentName, profileEmoji, true);

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
    diagnosticCompleted: true,
    level: 3,
    exp: 2420,
    coins: 460,
    gameExpToday: 30,
    gameExpDate: today,
    lastStudyLocation: {
      tab: 'study',
      studySubTab: 'kana',
      rowId: 'row_ka',
      kanaChar: 'き',
      label: '학습실 · か행 (き) 쓰기',
      updatedAt: new Date().toISOString()
    },
    streak: 6,
    lastStudyDate: today,
    streakDates,
    currentStageId: 'stage_h_ka',
    unlockedStages: ['stage_h_a', 'stage_h_ka'],
    completedStages: ['stage_h_a'],
    learnedKana: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'],
    bookmarkedKana: ['き', 'さ'],
    learnedVocab: ['v_ohayou', 'v_arigatou'],
    learnedKanji: ['kj_nichi', 'kj_hon'],
    learnedGrammar: ['gr_wa_desu'],
    kanaStats,
    srsItems,
    badges: ['badge_early_bird', 'badge_streak_3', 'badge_hiragana_start', 'badge_drop_pro'],
    cultureCards: ['card_sakura'],
    wrongNoteEntries: [
      {
        id: 'wn_sample_1',
        sourceType: 'kana',
        level: 'STAGE0',
        title: 'か행·さ행 구별',
        prompt: '소리 "키 [ki]"에 알맞은 히라가나 글자는?',
        options: ['き', 'さ', 'ち', 'け'],
        correctIndex: 0,
        pickedIndex: 1,
        explanation: 'き는 가로줄이 두 개(열쇠 톱니 2개), さ는 가로줄이 한 개예요.',
        reasonTag: 'char_confusion',
        createdAt: `${addDaysToKey(today, -1)}T10:00:00.000Z`
      },
      {
        id: 'wn_sample_2',
        sourceType: 'kana',
        level: 'STAGE0',
        title: 'か행 구별',
        prompt: '소리 "케 [ke]"에 알맞은 글자는?',
        options: ['け', 'は', 'ほ', 'に'],
        correctIndex: 0,
        pickedIndex: 1,
        explanation: 'け는 오른쪽 아래가 꺾어 내려가며 닫히지 않고 열려 있어요.',
        reasonTag: 'char_confusion',
        createdAt: `${addDaysToKey(today, -2)}T11:20:00.000Z`
      },
      {
        id: 'wn_sample_3',
        sourceType: 'listening',
        level: 'STAGE0',
        title: '듣고 글자 고르기',
        prompt: '음성 발음 [tsu] (츠)에 맞는 글자는?',
        options: ['す', 'つ', 'う', 'く'],
        correctIndex: 1,
        pickedIndex: 0,
        explanation: 'つ(츠)는 파도처럼 한 번에 둥글게 감는 글자, す(스)는 세로 고리가 있어요.',
        reasonTag: 'sound_confusion',
        createdAt: `${addDaysToKey(today, -1)}T14:15:00.000Z`
      },
      {
        id: 'wn_sample_4',
        sourceType: 'vocab',
        level: 'N5',
        title: 'N5 기초 어휘',
        prompt: '단어 「がっこう」의 올바른 뜻은?',
        options: ['병원', '은행', '학교', '도서관'],
        correctIndex: 2,
        pickedIndex: 0,
        explanation: 'がっこう(학교) · びょういん(병원) · ぎんこう(은행)을 구분해 보세요.',
        reasonTag: 'meaning_unknown',
        createdAt: `${today}T09:30:00.000Z`
      },
      {
        id: 'wn_sample_5',
        sourceType: 'mock',
        level: 'N5',
        title: 'N5 모의고사 Q3',
        prompt: 'まいにち 日本語を (  ) います。',
        options: ['べんきょうし', 'べんきょうして', 'べんきょうする', 'べんきょうした'],
        correctIndex: 1,
        pickedIndex: 0,
        explanation: '~하고 있습니다(진행/습관)는 동사 て형 + います를 써야 해요.',
        reasonTag: 'mistake',
        createdAt: `${addDaysToKey(today, -1)}T17:12:00.000Z`
      }
    ],
    mockExamHistory: [
      {
        id: 'mock_sample_1',
        paperId: 'paper_n5_1',
        level: 'N5',
        takenAt: `${addDaysToKey(today, -7)}T15:20:00.000Z`,
        totalScore: 86,
        maxScore: 180,
        passScore: 80,
        passed: false,
        anySectionFailedCutoff: true,
        durationSeconds: 1120,
        sections: [
          { sectionId: 'sec_vocab', sectionName: '언어지식(문자·어휘)', correct: 4, total: 5, scaledScore: 48, maxScore: 60, minPassScore: 19, failedCutoff: false },
          { sectionId: 'sec_grammar', sectionName: '언어지식(문법)·독해', correct: 2, total: 5, scaledScore: 24, maxScore: 60, minPassScore: 19, failedCutoff: false },
          { sectionId: 'sec_listening', sectionName: '청해', correct: 1, total: 4, scaledScore: 14, maxScore: 60, minPassScore: 19, failedCutoff: true }
        ]
      },
      {
        id: 'mock_sample_2',
        paperId: 'paper_n5_1',
        level: 'N5',
        takenAt: `${addDaysToKey(today, -1)}T17:10:00.000Z`,
        totalScore: 124,
        maxScore: 180,
        passScore: 80,
        passed: true,
        anySectionFailedCutoff: false,
        durationSeconds: 980,
        sections: [
          { sectionId: 'sec_vocab', sectionName: '언어지식(문자·어휘)', correct: 4, total: 5, scaledScore: 48, maxScore: 60, minPassScore: 19, failedCutoff: false },
          { sectionId: 'sec_grammar', sectionName: '언어지식(문법)·독해', correct: 3, total: 5, scaledScore: 36, maxScore: 60, minPassScore: 19, failedCutoff: false },
          { sectionId: 'sec_listening', sectionName: '청해', correct: 3, total: 4, scaledScore: 40, maxScore: 60, minPassScore: 19, failedCutoff: false }
        ]
      }
    ],
    gameRecords: {
      kanaDropBest: 1240,
      kanaDropBestByDifficulty: {
        easy: 1240,
        normal: 680,
        hard: 0
      },
      kanaDropPlaysToday: 1,
      listeningBest: 780,
      listeningPlaysToday: 0,
      pairMatchBest: 920,
      pairMatchPlaysToday: 0,
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
        text: '{이름}, き와 さ를 헷갈리지 않게 오늘 쓰기표 한 장 해 보자! 이번 주 정말 잘하고 있어 👍',
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
  const isSameGameExpDay = state.gameExpDate === today;
  const hasProgress =
    (state.exp || 0) > 0 ||
    (state.learnedKana?.length || 0) > 0 ||
    (state.learnedVocab?.length || 0) > 0;
  const updated: StudentState = {
    ...state,
    diagnosticCompleted:
      typeof state.diagnosticCompleted === 'boolean' ? state.diagnosticCompleted : hasProgress,
    diagnosticResult: state.diagnosticResult || null,
    coins: typeof state.coins === 'number' && !Number.isNaN(state.coins) ? Math.max(0, state.coins) : 100,
    gameExpToday:
      isSameGameExpDay && typeof state.gameExpToday === 'number' && !Number.isNaN(state.gameExpToday)
        ? Math.max(0, state.gameExpToday)
        : 0,
    gameExpDate: today,
    fontSizeScale:
      state.fontSizeScale === 'large' || state.fontSizeScale === 'xlarge'
        ? state.fontSizeScale
        : 'normal',
    lastStudyLocation: state.lastStudyLocation || null,
    learnedVocab: Array.isArray(state.learnedVocab) ? state.learnedVocab : [],
    bookmarkedVocab: Array.isArray(state.bookmarkedVocab) ? state.bookmarkedVocab : [],
    learnedKanji: Array.isArray(state.learnedKanji) ? state.learnedKanji : [],
    bookmarkedKanji: Array.isArray(state.bookmarkedKanji) ? state.bookmarkedKanji : [],
    learnedGrammar: Array.isArray(state.learnedGrammar) ? state.learnedGrammar : [],
    fourWeekPlanChecks: Array.isArray(state.fourWeekPlanChecks) ? state.fourWeekPlanChecks : [],
    mockExamHistory: Array.isArray(state.mockExamHistory) ? state.mockExamHistory : [],
    wrongNoteEntries: Array.isArray(state.wrongNoteEntries) ? state.wrongNoteEntries : [],
    shopCatalog:
      Array.isArray(state.shopCatalog) && state.shopCatalog.length > 0
        ? state.shopCatalog
        : DEFAULT_SHOP_CATALOG.map((item) => ({ ...item })),
    purchasedItems: Array.isArray(state.purchasedItems) ? state.purchasedItems : [],
    gameRecords: {
      kanaDropBest: state.gameRecords?.kanaDropBest || 0,
      kanaDropBestByDifficulty: {
        easy: state.gameRecords?.kanaDropBestByDifficulty?.easy || 0,
        normal: state.gameRecords?.kanaDropBestByDifficulty?.normal || 0,
        hard: state.gameRecords?.kanaDropBestByDifficulty?.hard || 0
      },
      kanaDropPlaysToday: state.gameRecords?.kanaDropPlaysToday || 0,
      listeningBest: state.gameRecords?.listeningBest || 0,
      listeningPlaysToday: state.gameRecords?.listeningPlaysToday || 0,
      pairMatchBest: state.gameRecords?.pairMatchBest || 0,
      pairMatchPlaysToday: state.gameRecords?.pairMatchPlaysToday || 0,
      lastGameDate: state.gameRecords?.lastGameDate || today
    },
    missionSettings: {
      dailyNewChars: state.missionSettings?.dailyNewChars ?? 5,
      dailyGameMissions: state.missionSettings?.dailyGameMissions ?? 1,
      autoWeakReview: state.missionSettings?.autoWeakReview ?? true,
      dailyMinutesGoal: state.missionSettings?.dailyMinutesGoal ?? 15,
      dailyGameExpCap: state.missionSettings?.dailyGameExpCap ?? 100,
      breakReminderEnabled: state.missionSettings?.breakReminderEnabled ?? true,
      breakReminderMinutes: state.missionSettings?.breakReminderMinutes ?? 40,
      kanaDropTimeLimits: {
        easy: state.missionSettings?.kanaDropTimeLimits?.easy ?? DEFAULT_KANA_DROP_TIME_LIMITS.easy,
        normal: state.missionSettings?.kanaDropTimeLimits?.normal ?? DEFAULT_KANA_DROP_TIME_LIMITS.normal,
        hard: state.missionSettings?.kanaDropTimeLimits?.hard ?? DEFAULT_KANA_DROP_TIME_LIMITS.hard
      }
    }
  };

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
  if (updated.gameRecords.lastGameDate !== today) {
    updated.gameRecords = {
      ...updated.gameRecords,
      kanaDropPlaysToday: 0,
      listeningPlaysToday: 0,
      pairMatchPlaysToday: 0,
      lastGameDate: today
    };
  }

  // Evaluate idle streak decay (>=2 days missed resets to 0 unless protected)
  if (updated.lastStudyDate) {
    const gap = diffDaysBetweenKeys(updated.lastStudyDate, today);
    if (gap >= 2) {
      if (gap === 2 && updated.streakProtections > 0 && updated.streak > 0) {
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

export function mergeStudentState(
  parsed: Partial<StudentState>,
  uidOverride?: string
): StudentState {
  const isLegacyDefaultName = parsed.profileConfigured === undefined && parsed.studentName === '지우';
  const resolvedName =
    (isLegacyDefaultName ? DEFAULT_STUDENT_NAME : parsed.studentName || DEFAULT_STUDENT_NAME)
      .trim()
      .slice(0, 40) || DEFAULT_STUDENT_NAME;
  const resolvedEmoji =
    (parsed.profileEmoji || DEFAULT_PROFILE_EMOJI).trim().slice(0, 16) || DEFAULT_PROFILE_EMOJI;
  const resolvedConfigured =
    typeof parsed.profileConfigured === 'boolean' ? parsed.profileConfigured : false;

  const base = createInitialStudentState(
    uidOverride || parsed.uid || 'local_student',
    resolvedName,
    resolvedEmoji,
    resolvedConfigured
  );

  const merged: StudentState = {
    ...base,
    ...parsed,
    uid: uidOverride || parsed.uid || base.uid,
    studentName: resolvedName,
    profileEmoji: resolvedEmoji,
    profileConfigured: resolvedConfigured,
    coins: typeof parsed.coins === 'number' ? Math.max(0, parsed.coins) : base.coins,
    gameRecords: {
      ...base.gameRecords,
      ...(parsed.gameRecords || {}),
      kanaDropBestByDifficulty: {
        ...base.gameRecords.kanaDropBestByDifficulty,
        ...(parsed.gameRecords?.kanaDropBestByDifficulty || {})
      }
    },
    dailyMissions: { ...base.dailyMissions, ...(parsed.dailyMissions || {}) },
    missionSettings: {
      ...base.missionSettings,
      ...(parsed.missionSettings || {}),
      kanaDropTimeLimits: {
        ...base.missionSettings.kanaDropTimeLimits,
        ...(parsed.missionSettings?.kanaDropTimeLimits || {})
      }
    },
    kanaStats: parsed.kanaStats || {},
    srsItems: parsed.srsItems || {},
    studyLogs: parsed.studyLogs || {}
  };

  return normalizeDailyState(merged);
}

export function loadLocalStudentState(): StudentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return normalizeDailyState(createInitialStudentState());
    const parsed = JSON.parse(raw) as Partial<StudentState>;
    return mergeStudentState(parsed);
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
    return (
      localStorage.getItem(ADMIN_PIN_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_ADMIN_PIN_KEY) ||
      '1234'
    );
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

export function setPendingCloudSync(pending: boolean): void {
  try {
    if (pending) localStorage.setItem(PENDING_CLOUD_SYNC_KEY, '1');
    else localStorage.removeItem(PENDING_CLOUD_SYNC_KEY);
  } catch {
    // ignore
  }
}

export function getPendingCloudSync(): boolean {
  try {
    return localStorage.getItem(PENDING_CLOUD_SYNC_KEY) === '1';
  } catch {
    return false;
  }
}

export function recordStudyActivity(
  state: StudentState,
  opts: {
    expGain?: number;
    isGameExp?: boolean;
    coinGain?: number;
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

  const cap = state.missionSettings?.dailyGameExpCap ?? 100;
  const prevGameExp = state.gameExpDate === today ? (state.gameExpToday || 0) : 0;
  const requestedExp = opts.expGain || 0;
  const actualExpGain = opts.isGameExp
    ? Math.min(requestedExp, Math.max(0, cap - prevGameExp))
    : requestedExp;
  const nextGameExpToday = opts.isGameExp ? prevGameExp + actualExpGain : prevGameExp;

  const newExp = Math.max(0, state.exp + actualExpGain);
  const nextLevel = Math.floor(newExp / EXP_PER_LEVEL) + 1;
  const earnedCoins =
    opts.coinGain !== undefined
      ? opts.coinGain
      : actualExpGain > 0
        ? Math.max(2, Math.round(actualExpGain / 2))
        : 0;

  const nextState: StudentState = {
    ...state,
    exp: newExp,
    gameExpToday: nextGameExpToday,
    gameExpDate: today,
    coins: Math.max(0, (state.coins || 0) + earnedCoins),
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

  const prevSrs = state.srsItems[char];
  const kanaMeta = ALL_KANA.find((k) => k.char === char);
  let nextInterval = 1;
  let reps = prevSrs?.repetitions || 0;

  if (isCorrect) {
    const idx = prevSrs ? SRS_INTERVALS.indexOf(prevSrs.intervalDays as (typeof SRS_INTERVALS)[number]) : -1;
    nextInterval = idx >= 0 && idx < SRS_INTERVALS.length - 1 ? SRS_INTERVALS[idx + 1] : idx === SRS_INTERVALS.length - 1 ? 30 : 1;
    reps += 1;
  } else {
    nextInterval = 1;
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

  if (
    state.learnedKana.length > 0 ||
    Object.keys(state.kanaStats).length > 0 ||
    state.learnedVocab.length > 0
  ) {
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
  const contentBoost = Math.min(
    16,
    Math.round(
      (state.learnedVocab.length + state.learnedKanji.length + state.learnedGrammar.length) * 0.4 +
        state.mockExamHistory.length * 2
    )
  );
  return Math.min(
    100,
    Math.round(stage0Pct * 0.08 + (completedAll / ADVENTURE_STAGES.length) * 68 + Math.max(0, levelIndex) * 4 + contentBoost)
  );
}

export function exportBackupJson(state: StudentState): string {
  const payload = {
    app: 'ARI JLPT – アリのにほんご',
    version: 2,
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
    return mergeStudentState(candidate);
  } catch {
    return null;
  }
}
