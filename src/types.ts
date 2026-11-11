export type JlptLevel = 'STAGE0' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type SubDifficulty = 1 | 2 | 3;

export type MainTab = 'home' | 'study' | 'game' | 'print' | 'records';
export type StudySubTab = 'kana' | 'gojuon' | 'confusing' | 'srs';
export type PrintSubTab = 'rowSheet' | 'confusingSheet' | 'poster' | 'dictation';
export type AdminSubTab = 'dashboard' | 'records' | 'settings' | 'report';

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
  exampleJp: string;
  exampleKo: string;
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

export interface MissionSettings {
  dailyNewChars: number;
  dailyGameMissions: number;
  autoWeakReview: boolean;
  dailyMinutesGoal: number;
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
  kanaDropPlaysToday: number;
  listeningBest: number;
  listeningPlaysToday: number;
  lastGameDate: string;
}

export interface StudentState {
  uid: string;
  studentName: string;
  level: number;
  exp: number;
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
  kanaStats: Record<string, KanaStat>;
  srsItems: Record<string, SrsItem>;
  badges: string[];
  cultureCards: string[];
  gameRecords: GameRecords;
  studyLogs: Record<string, StudyLogDay>;
  dailyMissions: DailyMissionsState;
  missionSettings: MissionSettings;
  praiseMessages: PraiseMessage[];
  acknowledgedPraiseIds: string[];
  lastBackupAt: string;
  startDate: string;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
