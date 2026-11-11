import { GrammarItem, KanjiItem, VocabItem } from '../types';

export const VOCAB_PREVIEW: VocabItem[] = [
  {
    id: 'v_ohayou', level: 'STAGE0', subLevel: 1,
    word: 'おはようございます', reading: 'おはようございます', romaji: 'ohayou gozaimasu',
    meaning: '안녕하세요 (아침 인사)', tip: '친구에게는 줄여서 "おはよう!"라고 해요.',
    exampleJp: '先生、おはようございます。', exampleKo: '선생님, 안녕하세요.'
  },
  {
    id: 'v_arigatou', level: 'STAGE0', subLevel: 1,
    word: 'ありがとうございます', reading: 'ありがとうございます', romaji: 'arigatou gozaimasu',
    meaning: '감사합니다', tip: '가까운 사이에서는 "ありがとう"라고 말해요.',
    exampleJp: 'プレゼント、ありがとうございます。', exampleKo: '선물, 감사합니다.'
  },
  {
    id: 'v_sumimasen', level: 'STAGE0', subLevel: 2,
    word: 'すみません', reading: 'すみません', romaji: 'sumimasen',
    meaning: '죄송합니다 / 저기요', tip: '사과할 때도, 식당에서 직원을 부를 때도 써요!',
    exampleJp: 'すみません、えきはどこですか。', exampleKo: '실례지만, 역은 어디인가요?'
  },
  {
    id: 'v_ichi_juu', level: 'STAGE0', subLevel: 3,
    word: 'いち・に・さん', reading: 'いち・に・さん', romaji: 'ichi, ni, san',
    meaning: '숫자 1, 2, 3', tip: '1(이치) 2(니) 3(산) 4(욘/시) 5(고) 순서로 외워요.',
    exampleJp: '一、二、三でスタート！', exampleKo: '하나, 둘, 셋 하면 스타트!'
  },
  {
    id: 'v_n5_gakusei', level: 'N5', subLevel: 1,
    word: '学生', reading: 'がくせい', romaji: 'gakusei',
    meaning: '학생', tip: '중학생은 ちゅうがくせい(추우가쿠세이)예요.',
    exampleJp: 'わたしは中学生です。', exampleKo: '저는 중학생입니다.'
  },
  {
    id: 'v_n5_benkyou', level: 'N5', subLevel: 2,
    word: '勉強', reading: 'べんきょう', romaji: 'benkyou',
    meaning: '공부', tip: 'する를 붙여서 勉強する(공부하다)로 자주 써요.',
    exampleJp: '毎日日本語を勉強します。', exampleKo: '매일 일본어를 공부합니다.'
  }
];

export const KANJI_PREVIEW: KanjiItem[] = [
  { id: 'kj_nichi', level: 'N5', subLevel: 1, kanji: '日', meaningKo: '날 일 / 해', soundKo: '일', onyomi: 'ニチ・ジツ', kunyomi: 'ひ・か', strokes: 4, compounds: ['日本 (にほん)', '毎日 (まいにち)', '日曜日 (にちようび)'] },
  { id: 'kj_hon', level: 'N5', subLevel: 1, kanji: '本', meaningKo: '책 / 근본 본', soundKo: '본', onyomi: 'ホン', kunyomi: 'もと', strokes: 5, compounds: ['本 (ほん)', '日本 (にほん)', '本屋 (ほんや)'] },
  { id: 'kj_gaku', level: 'N5', subLevel: 2, kanji: '学', meaningKo: '배울 학', soundKo: '학', onyomi: 'ガク', kunyomi: 'まな(ぶ)', strokes: 8, compounds: ['学生 (がくせい)', '学校 (がっこう)', '中学 (ちゅうがく)'] }
];

export const GRAMMAR_PREVIEW: GrammarItem[] = [
  {
    id: 'gr_wa_desu', level: 'STAGE0', subLevel: 1,
    pattern: 'N₁ は N₂ です', meaning: 'N₁은/는 N₂입니다',
    formula: '명사 + は(와) + 명사 + です', koreanTrap: '조사를 쓸 때는 は를 적고 발음은 "와"로 읽어요!',
    exampleJp: 'わたしは ジウ です。', exampleKo: '저는 지우입니다.'
  },
  {
    id: 'gr_masu', level: 'N5', subLevel: 1,
    pattern: 'Vます / Vません', meaning: '~합니다 / ~하지 않습니다',
    formula: '동사 어간 + ます / ません', koreanTrap: '현재와 미래를 모두 ます형으로 표현할 수 있어요.',
    exampleJp: 'あした テストを します。', exampleKo: '내일 시험을 봅니다.'
  }
];
