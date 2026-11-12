import { StudySubTab, TextbookMissionKey } from '../types';

export interface TextbookMissionDef {
  key: TextbookMissionKey;
  symbol: string;
  label: string;
}

export interface TextbookTargetScreen {
  tab: 'study' | 'home';
  studySubTab?: StudySubTab;
  rowId?: string;
  kanaChar?: string;
  openStageQuiz?: boolean;
  quizMode?: 'row' | 'hiragana_review';
}

export interface TextbookCodeEntry {
  code: string;
  book: string;
  bookId: 'stage0_book1' | 'stage0_book2' | 'n5_plus';
  part: 'PART0' | 'PART1' | string;
  title: string;
  pages: string;
  target: TextbookTargetScreen;
  requiredStageId: string;
  fallbackNotice?: string;
  missions: TextbookMissionDef[];
}

export const DEFAULT_TEXTBOOK_MISSIONS: TextbookMissionDef[] = [
  { key: 'listen', symbol: '♪', label: '발음 듣기' },
  { key: 'write', symbol: '✎', label: '손글씨 쓰기' },
  { key: 'game', symbol: '▶', label: '가나 낙하 게임 1판' },
  { key: 'review', symbol: '↻', label: '복습 알림 확인' }
];

export const TEXTBOOK_BOOK1_CODES: TextbookCodeEntry[] = [
  {
    code: 'H-MAP',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART0',
    title: '오십음도',
    pages: '5',
    target: { tab: 'study', studySubTab: 'gojuon' },
    requiredStageId: 'stage_h_a',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-A',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'あ행',
    pages: '6–7',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_a' },
    requiredStageId: 'stage_h_a',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-KA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'か행',
    pages: '8–9',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_ka' },
    requiredStageId: 'stage_h_ka',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-SA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'さ행',
    pages: '10–11',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_sa' },
    requiredStageId: 'stage_h_sa',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-TA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'た행',
    pages: '12–13',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_ta' },
    requiredStageId: 'stage_h_ta',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-NA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'な행',
    pages: '14–15',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_na' },
    requiredStageId: 'stage_h_na',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-HA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'は행',
    pages: '16–17',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_ha' },
    requiredStageId: 'stage_h_ha',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-MA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'ま행',
    pages: '18–19',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_ma' },
    requiredStageId: 'stage_h_ma',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-YA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'や행',
    pages: '20–21',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_ya' },
    requiredStageId: 'stage_h_ya',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-RA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'ら행',
    pages: '22–23',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_ra' },
    requiredStageId: 'stage_h_ra',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-WA',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: 'わ행',
    pages: '24–25',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_wa' },
    requiredStageId: 'stage_h_wa',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-DK',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: '탁음·반탁음',
    pages: '26–27',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_dakuon' },
    requiredStageId: 'stage_h_dakuon',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-YO',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: '요음',
    pages: '28–29',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_yoon' },
    requiredStageId: 'stage_h_dakuon',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-SP',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: '촉음·장음·ん',
    pages: '30–31',
    target: { tab: 'study', studySubTab: 'kana', rowId: 'row_wa', kanaChar: 'ん' },
    requiredStageId: 'stage_h_dakuon',
    fallbackNotice:
      "촉음·장음·ん 전용 단원이 아직 없어 가장 가까운 'わ행·ん (끝소리 ん)' 가나 학습 화면으로 이동했어요.",
    missions: DEFAULT_TEXTBOOK_MISSIONS
  },
  {
    code: 'H-TEST',
    book: '0단계 1권',
    bookId: 'stage0_book1',
    part: 'PART1',
    title: '복습 테스트',
    pages: '32–33',
    target: {
      tab: 'study',
      studySubTab: 'kana',
      rowId: 'row_dakuon',
      openStageQuiz: true,
      quizMode: 'hiragana_review'
    },
    requiredStageId: 'stage_h_dakuon',
    missions: DEFAULT_TEXTBOOK_MISSIONS
  }
];

// Extensible registries for Book 2 (K-..., B-...) and N5+ textbook codes
export const TEXTBOOK_BOOK2_CODES: TextbookCodeEntry[] = [];
export const TEXTBOOK_N5_PLUS_CODES: TextbookCodeEntry[] = [];

export const ALL_TEXTBOOK_CODES: TextbookCodeEntry[] = [
  ...TEXTBOOK_BOOK1_CODES,
  ...TEXTBOOK_BOOK2_CODES,
  ...TEXTBOOK_N5_PLUS_CODES
];

export const PART1_TEXTBOOK_CODES: string[] = TEXTBOOK_BOOK1_CODES.filter(
  (entry) => entry.part === 'PART1'
).map((entry) => entry.code);

export function normalizeTextbookCodeInput(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function findTextbookCode(rawInput: string): TextbookCodeEntry | null {
  const normalized = normalizeTextbookCodeInput(rawInput);
  if (!normalized) return null;
  return (
    ALL_TEXTBOOK_CODES.find(
      (entry) => normalizeTextbookCodeInput(entry.code) === normalized
    ) || null
  );
}
