export type JlptLevel = 'STAGE0' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type SubDifficulty = 1 | 2 | 3;

export type MainTab = 'home' | 'study' | 'game' | 'practice' | 'print' | 'shop' | 'records';
export type StudySubTab = 'kana' | 'gojuon' | 'confusing' | 'srs' | 'vocab' | 'kanji' | 'grammar';
export type PrintSubTab =
  | 'rowSheet'
  | 'confusingSheet'
  | 'poster'
  | 'dictation'
  | 'wrongNotes'
  | 'dailySheet'
  | 'omrSheet';
export type AdminSubTab = 'dashboard' | 'records' | 'shop' | 'settings' | 'report';

export type KanaDropDifficulty = 'easy' | 'normal' | 'hard';

export interface KanaItem {
  id: string;
  char: string;
  counterpart: string; // katakana for hiragana, hiragana for katakana
  script: 'hiragana' | 'katakana';
  category: 'seion' | 'dakuon' | 'yoon';
  rowId: string;
  rowLabel: string;
  colIndex: number; // 0:a, 1:i, 2:u, 3:e, 4:o
  ko: string;
  romaji: string;
  exampleWord: string;
  exampleReading: string;
  exampleMeaning: string;
  mnemonicTip: string;
  strokeCount: number;
  strokeHint: string;
}

export interface ConfusingPair {
  id: string;
  title: string;
  script: 'hiragana' | 'katakana';
  chars: string[];
  summaryTip: string;
  points: {
    char: string;
    ko: string;
    romaji: string;
    visualCue: string;
  }[];
}

export interface AdventureStage {
  id: string;
  order: number;
  world: JlptLevel;
  worldLabel: string;
  title: string;
  badgeChar: string;
  rowId?: string;
  script?: 'hiragana' | 'katakana';
  description: string;
  rewardCardId: string;
  phase1Ready: boolean;
  quizPassPercent: number;
}

export interface CultureCard {
  id: string;
  title: string;
  jpTitle: string;
  category: string;
  emoji: string;
  description: string;
  funFact: string;
}

export interface BadgeDef {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  conditionText: string;
  accentColor: 'emerald' | 'gold' | 'coral' | 'navy';
  targetTab: MainTab;
  targetStudySubTab?: StudySubTab;
}

export interface LevelExamInfo {
  level: JlptLevel;
  title: string;
  subtitle: string;
  totalMinutes: number;
  sections: {
    name: string;
    minutes: number;
    maxScore: number;
    minPassScore: number;
  }[];
  passScore: number;
  maxScore: number;
  targetVocabCount: number;
  targetKanjiCount: number;
  subLevels: {
    sub: SubDifficulty;
    label: string;
    focus: string;
  }[];
}

export interface FourWeekPlan {
  level: Exclude<JlptLevel, 'STAGE0'>;
  weeks: {
    week: number;
    title: string;
    tip: string;
    tasks: string[];
  }[];
}

export interface VocabItem {
  id: string;
  level: JlptLevel;
  subLevel: SubDifficulty;
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  tip: string;
  exampleJp: string;
  exampleKo: string;
}

export interface KanjiItem {
  id: string;
  level: Exclude<JlptLevel, 'STAGE0'>;
  subLevel: SubDifficulty;
  kanji: string;
  meaningKo: string;
  soundKo: string;
  onyomi: string;
  kunyomi: string;
  strokes: number;
  compounds: string[];
}

export interface GrammarItem {
  id: string;
  level: JlptLevel;
  subLevel: SubDifficulty;
  pattern: string;
  meaning: string;
  formula: string;
  koreanTrap: string;
  compareNote?: string;
  exampleJp: string;
  exampleKo: string;
}

export type VerbFormKey =
  | 'dict'
  | 'masu'
  | 'nai'
  | 'ta'
  | 'te'
  | 'potential'
  | 'volitional'
  | 'conditional'
  | 'passive';

export interface VerbConjugationForm {
  key: VerbFormKey;
  label: string;
  meaningHint: string;
  stem: string;
  ending: string;
  reading: string;
  euphonicRule: string;
  exampleJp: string;
  exampleKo: string;
}

export interface VerbConjugationItem {
  id: string;
  level: Exclude<JlptLevel, 'STAGE0'>;
  group: 1 | 2 | 3;
  groupLabel: string;
  dictionary: string;
  reading: string;
  meaning: string;
  forms: Record<VerbFormKey, VerbConjugationForm>;
}

export interface PracticeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  level: JlptLevel;
  subLevel: SubDifficulty;
  title: string;
  category: string;
  originalJp: string;
  hiraganaText: string;
  literalKo: string;
  keyVocab: { word: string; reading: string; meaning: string }[];
  questions: PracticeQuestion[];
}

export interface ListeningDialogueLine {
  speaker: string;
  gender: 'F' | 'M';
  jp: string;
  ko: string;
}

export interface ListeningExercise {
  id: string;
  level: JlptLevel;
  subLevel: SubDifficulty;
  title: string;
  situation: string;
  lines: ListeningDialogueLine[];
  questions: PracticeQuestion[];
}

export interface MockExamSection {
  id: string;
  name: string;
  minutes: number;
  maxScore: number;
  minPassScore: number;
  questions: (PracticeQuestion & {
    audioText?: string;
    contextText?: string;
  })[];
}

export interface MockExamPaper {
  id: string;
  level: JlptLevel;
  title: string;
  subtitle: string;
  totalMinutes: number;
  passScore: number;
  maxScore: number;
  sections: MockExamSection[];
}

export interface MockExamSectionResult {
  sectionId: string;
  sectionName: string;
  correct: number;
  total: number;
  scaledScore: number;
  maxScore: number;
  minPassScore: number;
  failedCutoff: boolean;
}

export interface MockExamAttempt {
  id: string;
  paperId: string;
  level: JlptLevel;
  takenAt: string;
  totalScore: number;
  maxScore: number;
  passScore: number;
  passed: boolean;
  anySectionFailedCutoff: boolean;
  durationSeconds: number;
  sections: MockExamSectionResult[];
}

export type WrongReasonTag = 'char_confusion' | 'sound_confusion' | 'meaning_unknown' | 'mistake';
export type FontSizeScale = 'normal' | 'large' | 'xlarge';

export interface WrongNoteEntry {
  id: string;
  sourceType: 'kana' | 'game' | 'reading' | 'listening' | 'mock' | 'kanji' | 'vocab';
  level: JlptLevel;
  title: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  pickedIndex: number;
  explanation: string;
  reasonTag?: WrongReasonTag;
  createdAt: string;
}

export interface DiagnosticResult {
  score: number;
  total: number;
  recommendedLevel: JlptLevel;
  recommendedSubLevel: SubDifficulty;
  recommendedStageId: string;
  accepted: boolean;
  skipped: boolean;
  completedAt: string;
}

export interface LastStudyLocation {
  tab: 'study' | 'practice';
  studySubTab?: StudySubTab;
  practiceSubTab?: 'reading' | 'listening' | 'mock' | 'wrongNotes';
  rowId?: string;
  kanaChar?: string;
  vocabId?: string;
  kanjiId?: string;
  grammarId?: string;
  readingId?: string;
  listeningId?: string;
  label: string;
  updatedAt: string;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  priceCoins: number;
  effectType: 'streak_protection' | 'reward_coupon';
  active: boolean;
}

export interface PurchasedShopItem {
  id: string;
  itemId: string;
  title: string;
  emoji: string;
  priceCoins: number;
  effectType: 'streak_protection' | 'reward_coupon';
  status: 'unused' | 'redeemed';
  purchasedAt: string;
  redeemedAt?: string;
}

export interface KanaStat {
  attempts: number;
  correct: number;
  confusedWith: Record<string, number>;
  lastPracticedAt?: string;
}

export interface SrsItem {
  id: string;
  char: string;
  intervalDays: number; // 1 -> 3 -> 7 -> 14 -> 30
  nextReviewDate: string; // YYYY-MM-DD
  repetitions: number;
  lastReviewedAt: string;
}

export interface StudyLogDay {
  studyMinutes: number;
  gameMinutes: number;
  quizAttempts: number;
  quizCorrect: number;
  missionsCompleted: number;
}

export interface DailyMissionsState {
  date: string; // YYYY-MM-DD
  newCharsCount: number;
  gamesPlayed: number;
  reviewDone: boolean;
  routineVocab: boolean;
  routineGrammar: boolean;
  routineReading: boolean;
}

export type TextbookMissionKey = 'listen' | 'write' | 'game' | 'review';

export interface TextbookCodeProgress {
  completedAt?: string;
  lastVisitedAt?: string;
  missions: Record<TextbookMissionKey, boolean>;
}

export interface MissionSettings {
  dailyNewChars: number;
  dailyGameMissions: number;
  autoWeakReview: boolean;
  dailyMinutesGoal: number;
  dailyGameExpCap: number;
  breakReminderEnabled: boolean;
  breakReminderMinutes: number;
  textbookCompletionExp: number;
  kanaDropTimeLimits: {
    easy: number;
    normal: number;
    hard: number;
  };
}

export interface PraiseMessage {
  id: string;
  text: string;
  bonusExp: number;
  createdAt: string;
  senderName: string;
}

export interface GameRecords {
  kanaDropBest: number;
  kanaDropBestByDifficulty: {
    easy: number;
    normal: number;
    hard: number;
  };
  kanaDropPlaysToday: number;
  listeningBest: number;
  listeningPlaysToday: number;
  pairMatchBest: number;
  pairMatchPlaysToday: number;
  lastGameDate: string;
}

export const DEFAULT_STUDENT_NAME = 'ARI';
export const DEFAULT_PROFILE_EMOJI = '🌸';
export const PROFILE_EMOJI_OPTIONS = [
  '🌸',
  '🦊',
  '🐱',
  '🐰',
  '🐼',
  '🐨',
  '🌟',
  '🍡',
  '🍙',
  '🗻',
  '🎮',
  '🔥'
] as const;

export interface StudentState {
  uid: string;
  studentName: string;
  profileEmoji: string;
  profileConfigured?: boolean;
  diagnosticCompleted: boolean;
  diagnosticResult?: DiagnosticResult | null;
  level: number;
  exp: number;
  coins: number;
  gameExpToday: number;
  gameExpDate: string;
  fontSizeScale: FontSizeScale;
  lastStudyLocation?: LastStudyLocation | null;
  targetLevel: JlptLevel;
  subLevel: SubDifficulty;
  streak: number;
  lastStudyDate: string;
  streakDates: string[];
  streakProtections: number;
  currentStageId: string;
  unlockedStages: string[];
  completedStages: string[];
  learnedKana: string[];
  bookmarkedKana: string[];
  learnedVocab: string[];
  bookmarkedVocab: string[];
  learnedKanji: string[];
  bookmarkedKanji: string[];
  learnedGrammar: string[];
  fourWeekPlanChecks: string[];
  kanaStats: Record<string, KanaStat>;
  srsItems: Record<string, SrsItem>;
  badges: string[];
  cultureCards: string[];
  mockExamHistory: MockExamAttempt[];
  wrongNoteEntries: WrongNoteEntry[];
  shopCatalog: ShopItem[];
  purchasedItems: PurchasedShopItem[];
  gameRecords: GameRecords;
  studyLogs: Record<string, StudyLogDay>;
  dailyMissions: DailyMissionsState;
  missionSettings: MissionSettings;
  praiseMessages: PraiseMessage[];
  acknowledgedPraiseIds: string[];
  textbookProgress: Record<string, TextbookCodeProgress>;
  lastBackupAt: string;
  startDate: string;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}
