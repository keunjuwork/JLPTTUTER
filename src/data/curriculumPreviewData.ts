import { GrammarItem, KanjiItem, VerbConjugationItem, VocabItem } from '../types';

export const VOCAB_PREVIEW: VocabItem[] = [
  // STAGE 0
  {
    id: 'v_ohayou', level: 'STAGE0', subLevel: 1,
    word: 'おはようございます', reading: 'おはようございます', romaji: 'ohayou gozaimasu',
    meaning: '안녕하세요 (아침 인사)', tip: '친구에게는 줄여서 "おはよう!"라고 말해요.',
    exampleJp: '先生、おはようございます。', exampleKo: '선생님, 아침 인사드립니다.'
  },
  {
    id: 'v_arigatou', level: 'STAGE0', subLevel: 1,
    word: 'ありがとうございます', reading: 'ありがとうございます', romaji: 'arigatou gozaimasu',
    meaning: '감사합니다', tip: '가까운 사이에서는 "ありがとう"라고 편하게 말해요.',
    exampleJp: 'プレゼント、ありがとうございます。', exampleKo: '선물, 감사합니다.'
  },
  {
    id: 'v_sumimasen', level: 'STAGE0', subLevel: 2,
    word: 'すみません', reading: 'すみません', romaji: 'sumimasen',
    meaning: '죄송합니다 / 저기요', tip: '사과할 때도, 식당이나 가게에서 직원을 부를 때도 써요!',
    exampleJp: 'すみません、えきはどこですか。', exampleKo: '실례지만, 역은 어디인가요?'
  },
  {
    id: 'v_sayounara', level: 'STAGE0', subLevel: 2,
    word: 'さようなら', reading: 'さようなら', romaji: 'sayounara',
    meaning: '안녕히 가세요 / 계세요', tip: '친구나 학교에서는 "また あした(내일 봐!)"를 더 자주 써요.',
    exampleJp: 'みんな、さようなら。また あした！', exampleKo: '모두 안녕, 내일 또 봐!'
  },
  {
    id: 'v_ichi_juu', level: 'STAGE0', subLevel: 3,
    word: 'いち・に・さん', reading: 'いち・に・さん', romaji: 'ichi, ni, san',
    meaning: '숫자 1, 2, 3', tip: '1(이치) 2(니) 3(산) 4(욘/시) 5(고) 순서로 외워요.',
    exampleJp: 'いち、に、さんで スタート！', exampleKo: '하나, 둘, 셋 하면 출발!'
  },
  {
    id: 'v_tomodachi', level: 'STAGE0', subLevel: 3,
    word: 'ともだち', reading: 'ともだち', romaji: 'tomodachi',
    meaning: '친구', tip: '단수·복수 모두 ともだち로 표현할 수 있어요.',
    exampleJp: 'アリさんは わたしの ともだちです。', exampleKo: '아리 씨는 제 친구입니다.'
  },

  // N5
  {
    id: 'v_n5_gakusei', level: 'N5', subLevel: 1,
    word: '学生', reading: 'がくせい', romaji: 'gakusei',
    meaning: '학생', tip: '중학생은 中学生(ちゅうがくせい)라고 읽어요.',
    exampleJp: 'わたしは 中学生です。', exampleKo: '저는 중학생입니다.'
  },
  {
    id: 'v_n5_sensei', level: 'N5', subLevel: 1,
    word: '先生', reading: 'せんせい', romaji: 'sensei',
    meaning: '선생님', tip: '자신을 가리킬 때는 쓰지 않고 상대방 선생님이나 의사·작가에게 써요.',
    exampleJp: '日本語の 先生は やさしいです。', exampleKo: '일본어 선생님은 친절하십니다.'
  },
  {
    id: 'v_n5_benkyou', level: 'N5', subLevel: 2,
    word: '勉強', reading: 'べんきょう', romaji: 'benkyou',
    meaning: '공부', tip: 'する를 붙여서 勉強する(공부하다)로 가장 자주 써요.',
    exampleJp: '毎日 日本語を 勉強します。', exampleKo: '매일 일본어를 공부합니다.'
  },
  {
    id: 'v_n5_kaimono', level: 'N5', subLevel: 2,
    word: '買い物', reading: 'かいもの', romaji: 'kaimono',
    meaning: '쇼핑 / 장보기', tip: '買う(사다) + 物(물건)가 합쳐진 단어예요.',
    exampleJp: '日曜日に デパートで 買い物を します。', exampleKo: '일요일에 백화점에서 쇼핑을 합니다.'
  },
  {
    id: 'v_n5_yakusoku', level: 'N5', subLevel: 3,
    word: '約束', reading: 'やくそく', romaji: 'yakusoku',
    meaning: '약속', tip: '한국어 "약속"과 발음 느낌이 비슷해서 외우기 쉬워요!',
    exampleJp: 'あした 友達と 約束が あります。', exampleKo: '내일 친구와 약속이 있습니다.'
  },
  {
    id: 'v_n5_shinkansen', level: 'N5', subLevel: 3,
    word: '新幹線', reading: 'しんかんせん', romaji: 'shinkansen',
    meaning: '신칸센 (고속열차)', tip: 'N5 교통수단 어휘로 자주 등장해요.',
    exampleJp: '新幹線で 東京へ 行きます。', exampleKo: '신칸센으로 도쿄에 갑니다.'
  },

  // N4
  {
    id: 'v_n4_keiken', level: 'N4', subLevel: 1,
    word: '経験', reading: 'けいけん', romaji: 'keiken',
    meaning: '경험', tip: '~たことがある(해 본 적이 있다) 문형과 단짝 단어예요.',
    exampleJp: 'いい 経験を しました。', exampleKo: '좋은 경험을 했습니다.'
  },
  {
    id: 'v_n4_junbi', level: 'N4', subLevel: 1,
    word: '準備', reading: 'じゅんび', romaji: 'junbi',
    meaning: '준비', tip: 'じゅん(준) + び(비)로 탁음에 주의하세요.',
    exampleJp: '旅行の 準備は もう 終わりましたか。', exampleKo: '여행 준비는 벌써 끝났나요?'
  },
  {
    id: 'v_n4_annai', level: 'N4', subLevel: 2,
    word: '案内', reading: 'あんない', romaji: 'annai',
    meaning: '안내', tip: '案(안) + 内(내), 案内する(안내하다)로 써요.',
    exampleJp: '町を 案内して あげます。', exampleKo: '마을을 안내해 줄게요.'
  },
  {
    id: 'v_n4_renraku', level: 'N4', subLevel: 2,
    word: '連絡', reading: 'れんらく', romaji: 'renraku',
    meaning: '연락', tip: '일본어 한자음 れ(연)+ん(ㄴ)+らく(락) 형태를 익혀 두세요.',
    exampleJp: 'ついたら すぐ 連絡して ください。', exampleKo: '도착하면 바로 연락해 주세요.'
  },
  {
    id: 'v_n4_tasukeru', level: 'N4', subLevel: 3,
    word: '助ける', reading: 'たすける', romaji: 'tasukeru',
    meaning: '돕다 / 구하다', tip: '2류(일단) 동사! 일상에서 도움이 필요할 때는 助けて!라고 해요.',
    exampleJp: 'こまった とき 友達が 助けて くれました。', exampleKo: '곤란할 때 친구가 도와주었습니다.'
  },

  // N3
  {
    id: 'v_n3_kankyou', level: 'N3', subLevel: 1,
    word: '環境', reading: 'かんきょう', romaji: 'kankyou',
    meaning: '환경', tip: '장음 きょう에 주의! N3 독해 환경 주제에서 1순위로 나와요.',
    exampleJp: '新しい 環境に すぐ 慣れました。', exampleKo: '새로운 환경에 금방 익숙해졌습니다.'
  },
  {
    id: 'v_n3_doryoku', level: 'N3', subLevel: 2,
    word: '努力', reading: 'どりょく', romaji: 'doryoku',
    meaning: '노력', tip: '한국어 "노력"과 달리 ど(도)로 탁음이 들어가요.',
    exampleJp: '合格する ために 毎日 努力しています。', exampleKo: '합격하기 위해 매일 노력하고 있습니다.'
  },
  {
    id: 'v_n3_igai', level: 'N3', subLevel: 3,
    word: '意外', reading: 'いがい', romaji: 'igai',
    meaning: '의외 / 뜻밖임', tip: '以外(이외)와 발음은 똑같이 いがい이지만 뜻과 한자가 달라요!',
    exampleJp: 'テストは 意外に 簡単でした。', exampleKo: '시험은 의외로 간단했습니다.'
  },

  // N2
  {
    id: 'v_n2_kakunin', level: 'N2', subLevel: 1,
    word: '確認', reading: 'かくにん', romaji: 'kakunin',
    meaning: '확인', tip: 'かく(확) + にん(인). 실용문 안내판이나 메일에서 필수예요.',
    exampleJp: 'スケジュールを もう一度 確認しましょう。', exampleKo: '일정을 한 번 더 확인합시다.'
  },
  {
    id: 'v_n2_kouritsu', level: 'N2', subLevel: 2,
    word: '効率', reading: 'こうりつ', romaji: 'kouritsu',
    meaning: '효율', tip: '効率がいい(효율이 좋다) / 効率的(효율적) 세트로 기억해요.',
    exampleJp: '復習カードを 使うと 学習の 効率が 上がります。', exampleKo: '복습 카드를 사용하면 학습 효율이 올라갑니다.'
  },
  {
    id: 'v_n2_eikyou', level: 'N2', subLevel: 3,
    word: '影響', reading: 'えいきょう', romaji: 'eikyou',
    meaning: '영향', tip: '影響を 与える(영향을 주다) / 影響を 受ける(영향을 받다)와 짝을 이뤄요.',
    exampleJp: '日本の 文化に 大きな 影響を 受けました。', exampleKo: '일본 문화에 큰 영향을 받았습니다.'
  },

  // N1
  {
    id: 'v_n1_hihan', level: 'N1', subLevel: 1,
    word: '批判', reading: 'ひはん', romaji: 'hihan',
    meaning: '비판', tip: '논설문에서 필자가 반박하거나 평가할 때 자주 쓰여요.',
    exampleJp: 'その 政策に 対して 厳しい 批判が 集まった。', exampleKo: '그 정책에 대해 엄격한 비판이 모였다.'
  },
  {
    id: 'v_n1_honshitsu', level: 'N1', subLevel: 2,
    word: '本質', reading: 'ほんしつ', romaji: 'honshitsu',
    meaning: '본질', tip: '表面的(표면적)과 반대되는 N1 추상 독해 단골 단어예요.',
    exampleJp: '問題の 本質を 冷静に 見極める 必要が ある。', exampleKo: '문제의 본질을 냉정하게 파악할 필요가 있다.'
  },
  {
    id: 'v_n1_kaishaku', level: 'N1', subLevel: 3,
    word: '解釈', reading: 'かいしゃく', romaji: 'kaishaku',
    meaning: '해석', tip: '문학·비평 지문에서 글쓴이의 관점을 묻는 선택지에 자주 나와요.',
    exampleJp: '同じ 作品でも 時代によって 解釈が 異なる。', exampleKo: '같은 작품이라도 시대에 따라 해석이 다르다.'
  }
];

export const KANJI_PREVIEW: KanjiItem[] = [
  // N5
  { id: 'kj_nichi', level: 'N5', subLevel: 1, kanji: '日', meaningKo: '날 일 / 해', soundKo: '일', onyomi: 'ニチ・ジツ', kunyomi: 'ひ・か', strokes: 4, compounds: ['日本 (にほん)', '毎日 (まいにち)', '日曜日 (にちようび)'] },
  { id: 'kj_hon', level: 'N5', subLevel: 1, kanji: '本', meaningKo: '책 / 근본 본', soundKo: '본', onyomi: 'ホン', kunyomi: 'もと', strokes: 5, compounds: ['本 (ほん)', '日本 (にほん)', '本屋 (ほんや)'] },
  { id: 'kj_gaku', level: 'N5', subLevel: 1, kanji: '学', meaningKo: '배울 학', soundKo: '학', onyomi: 'ガク', kunyomi: 'まな(ぶ)', strokes: 8, compounds: ['学生 (がくせい)', '学校 (がっこう)', '中学 (ちゅうがく)'] },
  { id: 'kj_yama', level: 'N5', subLevel: 2, kanji: '山', meaningKo: '뫼 산 / 산', soundKo: '산', onyomi: 'サン・ザン', kunyomi: 'やま', strokes: 3, compounds: ['山 (やま)', '富士山 (ふじさん)', '火山 (かざん)'] },
  { id: 'kj_mizu', level: 'N5', subLevel: 2, kanji: '水', meaningKo: '물 수', soundKo: '수', onyomi: 'スイ', kunyomi: 'みず', strokes: 4, compounds: ['水 (みず)', '水曜日 (すいようび)', '水泳 (すいえい)'] },
  { id: 'kj_jikan', level: 'N5', subLevel: 3, kanji: '時', meaningKo: '때 시 / 시간', soundKo: '시', onyomi: 'ジ', kunyomi: 'とき', strokes: 10, compounds: ['時間 (じかん)', '時計 (とけい)', '一時 (いちじ)'] },
  { id: 'kj_miru', level: 'N5', subLevel: 3, kanji: '見', meaningKo: '볼 견', soundKo: '견', onyomi: 'ケン', kunyomi: 'み(る)・み(せる)', strokes: 7, compounds: ['見る (みる)', '意見 (いけん)', '見学 (けんがく)'] },

  // N4
  { id: 'kj_koku', level: 'N4', subLevel: 1, kanji: '心', meaningKo: '마음 심', soundKo: '심', onyomi: 'シン', kunyomi: 'こころ', strokes: 4, compounds: ['心 (こころ)', '安心 (あんしん)', '関心 (かんしん)'] },
  { id: 'kj_omi', level: 'N4', subLevel: 1, kanji: '思', meaningKo: '생각할 사', soundKo: '사', onyomi: 'シ', kunyomi: 'おも(う)', strokes: 9, compounds: ['思う (おもう)', '思い出 (おもいで)', '不思議 (ふしぎ)'] },
  { id: 'kj_tabi', level: 'N4', subLevel: 2, kanji: '旅', meaningKo: '나그네 려 / 여행', soundKo: '려', onyomi: 'リョ', kunyomi: 'たび', strokes: 10, compounds: ['旅行 (りょこう)', '旅館 (りょかん)', '旅 (たび)'] },
  { id: 'kj_tsuku', level: 'N4', subLevel: 3, kanji: '作', meaningKo: '지을 작', soundKo: '작', onyomi: 'サク・サ', kunyomi: 'つく(る)', strokes: 7, compounds: ['作る (つくる)', '作文 (さくぶん)', '作品 (さくひん)'] },

  // N3
  { id: 'kj_yume', level: 'N3', subLevel: 1, kanji: '夢', meaningKo: '꿈 몽', soundKo: '몽', onyomi: 'ム', kunyomi: 'ゆめ', strokes: 13, compounds: ['夢 (ゆめ)', '夢中 (むちゅう)', '悪夢 (あくむ)'] },
  { id: 'kj_shitsu', level: 'N3', subLevel: 2, kanji: '決', meaningKo: '결단할 결', soundKo: '결', onyomi: 'ケツ', kunyomi: 'き(める)・き(まる)', strokes: 7, compounds: ['決める (きめる)', '決定 (けってい)', '解決 (かいけつ)'] },
  { id: 'kj_kansha', level: 'N3', subLevel: 3, kanji: '感', meaningKo: '느낄 감', soundKo: '감', onyomi: 'カン', kunyomi: '—', strokes: 13, compounds: ['感じる (かんじる)', '感謝 (かんしゃ)', '感想 (かんそう)'] },

  // N2
  { id: 'kj_kaku', level: 'N2', subLevel: 1, kanji: '確', meaningKo: '굳을 확', soundKo: '확', onyomi: 'カク', kunyomi: 'たし(か)', strokes: 15, compounds: ['確認 (かくにん)', '確か (たしか)', '正確 (せいかく)'] },
  { id: 'kj_ryoku', level: 'N2', subLevel: 2, kanji: '効', meaningKo: '본받을 효 / 효과', soundKo: '효', onyomi: 'コウ', kunyomi: 'き(く)', strokes: 8, compounds: ['効果 (こうか)', '効率 (こうりつ)', '有効 (ゆうこう)'] },
  { id: 'kj_shuu', level: 'N2', subLevel: 3, kanji: '習', meaningKo: '익힐 습', soundKo: '습', onyomi: 'シュウ', kunyomi: 'なら(う)', strokes: 11, compounds: ['練習 (れんしゅう)', '復習 (ふくしゅう)', '習慣 (しゅうかん)'] },

  // N1
  { id: 'kj_ron', level: 'N1', subLevel: 1, kanji: '批', meaningKo: '칠 비 / 비평', soundKo: '비', onyomi: 'ヒ', kunyomi: '—', strokes: 7, compounds: ['批判 (ひはん)', '批評 (ひひょう)'] },
  { id: 'kj_choku', level: 'N1', subLevel: 2, kanji: '哲', meaningKo: '밝을 철', soundKo: '철', onyomi: 'テツ', kunyomi: '—', strokes: 10, compounds: ['哲学 (てつがく)', '哲学者 (てつがくしゃ)'] },
  { id: 'kj_kagami', level: 'N1', subLevel: 3, kanji: '鑑', meaningKo: '거울 감 / 감상', soundKo: '감', onyomi: 'カン', kunyomi: 'かんが(みる)', strokes: 23, compounds: ['鑑賞 (かんしょう)', '図鑑 (ずかん)', '年鑑 (ねんかん)'] }
];

export const GRAMMAR_PREVIEW: GrammarItem[] = [
  // STAGE 0
  {
    id: 'gr_wa_desu', level: 'STAGE0', subLevel: 1,
    pattern: 'N₁ は N₂ です', meaning: 'N₁은/는 N₂입니다',
    formula: '명사 + は(발음: 와) + 명사 + です', koreanTrap: '글자는 は(하)로 쓰고 발음만 "와"로 읽어요!',
    compareNote: '부정형은 じゃありません / ではありません 으로 바꿔요.',
    exampleJp: 'わたしは アリ です。', exampleKo: '저는 아리입니다.'
  },
  {
    id: 'gr_ka_question', level: 'STAGE0', subLevel: 2,
    pattern: '~ ですか', meaning: '~입니까? (의문문)',
    formula: '문장 끝 + か (물음표 없이 마침표 。 사용)', koreanTrap: '일본어 정식 문장에서는 보통 か 뒤에 ? 대신 。를 찍어요.',
    compareNote: '반말(구어체)에서는 か 대신 ?와 함께 억양만 올려 물어요.',
    exampleJp: 'お名前は 何ですか。', exampleKo: '성함이 무엇입니까?'
  },
  {
    id: 'gr_kore_sore', level: 'STAGE0', subLevel: 3,
    pattern: 'これ / それ / あれ', meaning: '이것 / 그것 / 저것',
    formula: '단독 사용 (명사 수식 시에는 この / その / あの + 명사)', koreanTrap: '"이 책"을 これ本이라고 하면 틀려요! 반드시 この本이라고 써요.',
    compareNote: '사물(これ), 장소(ここ), 방향(こちら) 고소아도 세트로 묶어 기억하세요.',
    exampleJp: 'これは わたしの ノートです。', exampleKo: '이것은 제 공책입니다.'
  },

  // N5
  {
    id: 'gr_masu', level: 'N5', subLevel: 1,
    pattern: 'Vます / Vません', meaning: '~합니다 / ~하지 않습니다',
    formula: '동사 어간 + ます / ません', koreanTrap: '현재 습관과 미래 예정("내일 ~할 거예요")을 모두 ます형으로 말할 수 있어요.',
    compareNote: '과거는 ました / ませんでした 를 써요.',
    exampleJp: 'あした テストを します。', exampleKo: '내일 시험을 봅니다.'
  },
  {
    id: 'gr_te_iru', level: 'N5', subLevel: 2,
    pattern: 'Vている', meaning: '~하고 있다 (진행 / 상태)',
    formula: '동사 て형 + います / いる', koreanTrap: '"알고 있다(知っている)"나 "결혼해 있다(結婚している)" 같은 상태 결과도 ~ている를 써요.',
    compareNote: '우리말 "알다"를 그냥 知る라고 하면 부자연스럽고, 知っています를 씁니다.',
    exampleJp: '今 日本語の 歌を 聞いて います。', exampleKo: '지금 일본어 노래를 듣고 있습니다.'
  },
  {
    id: 'gr_tai', level: 'N5', subLevel: 3,
    pattern: 'Vたいです', meaning: '~하고 싶습니다',
    formula: '동사 ます형 어간 + たい (이형용사처럼 활용)', koreanTrap: '남(제3자)의 마음을 말할 때는 ~たい가 아니라 ~たがっています를 써요.',
    compareNote: '목적어 조사는 を 대신 が를 쓰는 경우도 아주 많아요.',
    exampleJp: '夏休みに 日本へ 行きたいです。', exampleKo: '여름방학에 일본에 가고 싶습니다.'
  },

  // N4
  {
    id: 'gr_n4_koto', level: 'N4', subLevel: 1,
    pattern: 'Vたことが ある', meaning: '~한 적이 있다 (경험)',
    formula: '동사 た형 + ことが あります', koreanTrap: '반복되는 습관은 현재형(Vることがある: 가끔 ~할 때가 있다)을 써서 헷갈리기 쉬워요!',
    compareNote: 'Vたことがある(과거 경험) vs Vることがある(가끔 있는 일)',
    exampleJp: '富士山を 見た ことが あります。', exampleKo: '후지산을 본 적이 있습니다.'
  },
  {
    id: 'gr_n4_youni', level: 'N4', subLevel: 2,
    pattern: '~ように する / なる', meaning: '~하도록 노력하다 / ~하게 되다',
    formula: '동사 사전형·ない형 + ように する / なる', koreanTrap: 'する는 "내가 의식해서 노력함", なる는 "자연스러운 능력·습관 변화"예요.',
    compareNote: '예전엔 못 읽었지만 이제 읽을 수 있게 됐다 → 読めるように なりました',
    exampleJp: '毎日 15分 勉強する ように しています。', exampleKo: '매일 15분 공부하도록 노력하고 있습니다.'
  },
  {
    id: 'gr_n4_temorau', level: 'N4', subLevel: 3,
    pattern: '~て あげる / くれる / もらう', meaning: '~해 주다 / ~해 주시다 / ~해 받다',
    formula: '동사 て형 + あげる(남에게) / くれる(나에게) / もらう(내가 남에게 받음)', koreanTrap: '다른 사람이 나에게 해 줄 때는 절대 あげる를 쓰면 안 되고 くれる를 써야 해요!',
    compareNote: '주어가 누구인가에 따라 くれる(남이 주어) vs もらう(내가 주어)로 갈려요.',
    exampleJp: '先生が 漢字を 教えて くれました。', exampleKo: '선생님이 한자를 가르쳐 주셨습니다.'
  },

  // N3
  {
    id: 'gr_n3_tame', level: 'N3', subLevel: 1,
    pattern: '~ために / ~ように', meaning: '~하기 위해서 (목적)',
    formula: '의지동사 사전형 + ために vs 무의지·가능동사 + ように', koreanTrap: '"합격하기 위해"에서 合格する는 내 노력 목적이므로 ために, "잊지 않기 위해"처럼 무의지/부정은 ように를 자주 써요.',
    compareNote: '명사 뒤에는 ~のために만 쓸 수 있어요! (~のよう에는 다른 뜻)',
    exampleJp: '日本語が 上手に なる ように 練習します。', exampleKo: '일본어를 잘하게 되도록 연습합니다.'
  },
  {
    id: 'gr_n3_uchini', level: 'N3', subLevel: 2,
    pattern: '~うちに', meaning: '~하는 사이에 / ~하는 동안에',
    formula: '동사 ている·ない형 + うちに', koreanTrap: '~あいだ에와 달리, ~うちに는 상태가 바뀌기 전 그 틈을 타서 행동할 때 써요!',
    compareNote: '暖かいうちに 食べて ください(식기 전 따뜻한 동안에 드세요)',
    exampleJp: '忘れない うちに メモを 書いて おきます。', exampleKo: '잊어버리지 않는 사이에(잊기 전에) 메모를 적어 둡니다.'
  },
  {
    id: 'gr_n3_youda', level: 'N3', subLevel: 3,
    pattern: '~ようだ / ~そうだ', meaning: '~인 것 같다 (추측 vs 양태·전문)',
    formula: '보통형 + ようだ vs 어간 + そうだ(양태) / 보통형 + そうだ(전해 들음)', koreanTrap: '모양을 보고 곧 일어날 것 같으면 雨が降りそうだ, 누군가에게 들은 건 雨が降るそうだ예요!',
    compareNote: 'おいしい(맛있다) → おいしそうだ (い 탈락) vs よさそうだ (いい 예외)',
    exampleJp: 'みんな もう 帰った ようです。', exampleKo: '모두 벌써 돌아간 것 같습니다.'
  },

  // N2
  {
    id: 'gr_n2_kagiru', level: 'N2', subLevel: 1,
    pattern: '~に 限らず (~に限らず)', meaning: '~뿐만 아니라 / ~에 한하지 않고',
    formula: '명사 + に 限らず', koreanTrap: '"일본에 한하지 않고"처럼 앞 범위를 넓혀 말할 때 쓰며, 뒤에는 "다양하다/전 세계" 같은 폭넓은 내용이 와요.',
    compareNote: '~だけでなく보다 조금 더 문어적이고 격식 있는 어감이에요.',
    exampleJp: 'アニメは 子供に 限らず 大人にも 人気が ある。', exampleKo: '애니메이션은 어린이에 한하지 않고 어른에게도 인기가 있다.'
  },
  {
    id: 'gr_n2_tsurete', level: 'N2', subLevel: 2,
    pattern: '~に つれて', meaning: '~함에 따라',
    formula: '동사 사전형 / 변화 명사 + に つれて', koreanTrap: '한쪽이 변하면 다른 쪽도 한 방향으로 함께 변할 때 쓰며, 일시적 의지 문장에는 못 써요.',
    compareNote: '~に したがって와 비슷하지만 개인적·자연 변화에도 널리 쓰여요.',
    exampleJp: '年を 取るに つれて 物忘れが 増えた。', exampleKo: '나이가 듦에 따라 건망증이 늘었다.'
  },
  {
    id: 'gr_n2_mono_de', level: 'N2', subLevel: 3,
    pattern: '~ものだ / ~わけだ', meaning: '~하기 마련이다 / ~한 셈이다',
    formula: '동사 사전형 + ものだ(당연함) vs 보통형 + わけだ(논리적 결론)', koreanTrap: 'ものだ는 일반 상식·회상·충고에, わけだ는 앞 근거로 당연한 이치를 짚을 때 써요.',
    compareNote: 'N2에서 가장 혼동하기 쉬운 명사 문말 패턴 1위예요!',
    exampleJp: '毎日 コツコツ 続ければ 力がつく ものだ。', exampleKo: '매일 꾸준히 계속하면 실력이 늘기 마련이다.'
  },

  // N1
  {
    id: 'gr_n1_ni_itatte', level: 'N1', subLevel: 1,
    pattern: '~に いたって(至って)', meaning: '~에 이르러(서야)',
    formula: '명사 / 동사 사전형 + に 至って', koreanTrap: '단계가 쌓이고 쌓여 마침내 심각하거나 최종적인 지점에 도달했음을 강조하는 N1 격식 표현이에요.',
    compareNote: '~に 至っては는 극단적인 한 예를 짚으며 부정적 놀라움을 나타내요.',
    exampleJp: 'ここに 至って ようやく 計画の全貌が 見えた。', exampleKo: '여기에 이르러 비로소 계획의 전모가 보였다.'
  },
  {
    id: 'gr_n1_wo_kagiri', level: 'N1', subLevel: 2,
    pattern: '~を 禁じ得ない', meaning: '~을 금할 수 없다',
    formula: '감정 명사(驚き・同情・怒り) + を 禁じ得ない', koreanTrap: '화자의 감정이 자연스레 복받쳐 참기 어려울 때 논설문·뉴스에 등장해요.',
    compareNote: '~ずにはいられない가 회화·일반 행동에 넓게 쓰이는 것과 구분하세요.',
    exampleJp: 'その 勇気ある 行動に 驚きを 禁じ得ない。', exampleKo: '그 용기 있는 행동에 놀라움을 금할 수 없다.'
  }
];

export const VERB_CONJUGATION_DATA: VerbConjugationItem[] = [
  {
    id: 'vb_kaku',
    level: 'N5',
    group: 1,
    groupLabel: '1류 동사 (五段 · く 어미)',
    dictionary: '書く',
    reading: 'かく',
    meaning: '쓰다',
    forms: {
      dict: { key: 'dict', label: '사전형 (기본형)', meaningHint: '~쓰다', stem: '書', ending: 'く', reading: 'かく', euphonicRule: '기본 사전형 어미는 う단(く)으로 끝나요.', exampleJp: '毎日 日記を 書く。', exampleKo: '매일 일기를 쓴다.' },
      masu: { key: 'masu', label: 'ます형 (정중형)', meaningHint: '~씁니다', stem: '書', ending: 'きます', reading: 'かきます', euphonicRule: 'く → き (い단) + ます', exampleJp: 'ノートに 名前を 書きます。', exampleKo: '공책에 이름을 씁니다.' },
      nai: { key: 'nai', label: 'ない형 (부정형)', meaningHint: '~쓰지 않는다', stem: '書', ending: 'かない', reading: 'かかない', euphonicRule: 'く → か (あ단) + ない', exampleJp: 'ここには 何も 書かないで ください。', exampleKo: '여기에는 아무것도 쓰지 말아 주세요.' },
      ta: { key: 'ta', label: 'た형 (과거형)', meaningHint: '~썼다', stem: '書', ending: 'いた', reading: 'かいた', euphonicRule: 'い음편: く → い + た (예외: 行く→行った)', exampleJp: '昨日 手紙を 書いた。', exampleKo: '어제 편지를 썼다.' },
      te: { key: 'te', label: 'て형 (연결·진행)', meaningHint: '~쓰고 / 써서', stem: '書', ending: 'いて', reading: 'かいて', euphonicRule: 'い음편: く → い + て (ぐ일 땐 いで)', exampleJp: 'ゆっくり 書いて みて ください。', exampleKo: '천천히 써 보세요.' },
      potential: { key: 'potential', label: '가능형', meaningHint: '~쓸 수 있다', stem: '書', ending: 'ける', reading: 'かける', euphonicRule: '1류 동사는 う단 → え단 + る (く → ける)', exampleJp: 'もう ひらがなが 全部 書けるよ！', exampleKo: '이제 히라가나를 전부 쓸 수 있어!' },
      volitional: { key: 'volitional', label: '의지형', meaningHint: '~쓰자 / 쓰려고 한다', stem: '書', ending: 'こう', reading: 'かこう', euphonicRule: 'う단 → お단 + う (く → こう)', exampleJp: 'いっしょに メッセージを 書こう！', exampleKo: '같이 메시지를 쓰자!' },
      conditional: { key: 'conditional', label: '조건형 (ば형)', meaningHint: '~쓰면', stem: '書', ending: 'けば', reading: 'かけば', euphonicRule: 'う단 → え단 + ば (く → けば)', exampleJp: '3回 書けば すぐ 覚えられます。', exampleKo: '3번 쓰면 금방 외울 수 있어요.' },
      passive: { key: 'passive', label: '수동형', meaningHint: '~쓰여지다', stem: '書', ending: 'かれる', reading: 'かかれる', euphonicRule: 'あ단 + れる (く → かれる)', exampleJp: 'この 本は 子ども向けに 書かれている。', exampleKo: '이 책은 어린이용으로 쓰여 있다.' }
    }
  },
  {
    id: 'vb_nomu',
    level: 'N5',
    group: 1,
    groupLabel: '1류 동사 (五段 · む 어미)',
    dictionary: '飲む',
    reading: 'のむ',
    meaning: '마시다',
    forms: {
      dict: { key: 'dict', label: '사전형 (기본형)', meaningHint: '~마시다', stem: '飲', ending: 'む', reading: 'のむ', euphonicRule: '기본 사전형 어미는 む예요.', exampleJp: '冷たい 水を 飲む。', exampleKo: '시원한 물을 마신다.' },
      masu: { key: 'masu', label: 'ます형 (정중형)', meaningHint: '~마십니다', stem: '飲', ending: 'みます', reading: 'のみます', euphonicRule: 'む → み (い단) + ます', exampleJp: '朝 牛乳を 飲みます。', exampleKo: '아침에 우유를 마십니다.' },
      nai: { key: 'nai', label: 'ない형 (부정형)', meaningHint: '~마시지 않는다', stem: '飲', ending: 'まない', reading: 'のまない', euphonicRule: 'む → ま (あ단) + ない', exampleJp: 'コーヒーは あまり 飲まない。', exampleKo: '커피는 별로 마시지 않는다.' },
      ta: { key: 'ta', label: 'た형 (과거형)', meaningHint: '~마셨다', stem: '飲', ending: 'んだ', reading: 'のんだ', euphonicRule: '발음편(ん음편): む/ぶ/ぬ → ん + だ (탁음!)', exampleJp: 'さっき お茶を 飲んだ。', exampleKo: '아까 차를 마셨다.' },
      te: { key: 'te', label: 'て형 (연결·진행)', meaningHint: '~마시고 / 마셔서', stem: '飲', ending: 'んで', reading: 'のんで', euphonicRule: '발음편(ん음편): む/ぶ/ぬ → ん + で (탁음 주의!)', exampleJp: '薬を 飲んで 早く 寝てね。', exampleKo: '약을 마시고 일찍 자렴.' },
      potential: { key: 'potential', label: '가능형', meaningHint: '~마실 수 있다', stem: '飲', ending: 'める', reading: 'のめる', euphonicRule: 'む → め + る', exampleJp: 'この 水は そのまま 飲めます。', exampleKo: '이 물은 그대로 마실 수 있습니다.' },
      volitional: { key: 'volitional', label: '의지형', meaningHint: '~마시자', stem: '飲', ending: 'もう', reading: 'のもう', euphonicRule: 'む → も + う', exampleJp: 'ジュースでも 飲もうか。', exampleKo: '주스라도 마실까?' },
      conditional: { key: 'conditional', label: '조건형 (ば형)', meaningHint: '~마시면', stem: '飲', ending: 'めば', reading: 'のめば', euphonicRule: 'む → め + ば', exampleJp: '温かい スープを 飲めば 元気が 出るよ。', exampleKo: '따뜻한 수프를 마시면 기운이 날 거야.' },
      passive: { key: 'passive', label: '수동형', meaningHint: '~마셔지다 (남이 마셔버림)', stem: '飲', ending: 'まれる', reading: 'のまれる', euphonicRule: 'む → ま + れる', exampleJp: '妹に ジュースを 飲まれて しまった。', exampleKo: '여동생에게 주스를 (마셔져서) 뺏겨 버렸다.' }
    }
  },
  {
    id: 'vb_matsu',
    level: 'N5',
    group: 1,
    groupLabel: '1류 동사 (五段 · つ 어미)',
    dictionary: '待つ',
    reading: 'まつ',
    meaning: '기다리다',
    forms: {
      dict: { key: 'dict', label: '사전형 (기본형)', meaningHint: '~기다리다', stem: '待', ending: 'つ', reading: 'まつ', euphonicRule: 'つ 어미는 ない형에서 わ가 아니라 た로 변해요!', exampleJp: '駅の前で 友達を 待つ。', exampleKo: '역 앞에서 친구를 기다린다.' },
      masu: { key: 'masu', label: 'ます형 (정중형)', meaningHint: '~기다립니다', stem: '待', ending: 'ちます', reading: 'まちます', euphonicRule: 'つ → ち + ます (치마스가 됨에 주의!)', exampleJp: 'ここで 少し 待ちます。', exampleKo: '여기서 조금 기다립니다.' },
      nai: { key: 'nai', label: 'ない형 (부정형)', meaningHint: '~기다리지 않는다', stem: '待', ending: 'たない', reading: 'またない', euphonicRule: 'つ → た + ない (た행 아단)', exampleJp: '長くは 待たない つもりです。', exampleKo: '오래는 기다리지 않을 생각입니다.' },
      ta: { key: 'ta', label: 'た형 (과거형)', meaningHint: '~기다렸다', stem: '待', ending: 'った', reading: 'まった', euphonicRule: '촉음편: う/つ/る → った', exampleJp: '30分も 待ったよ！', exampleKo: '30분이나 기다렸어!' },
      te: { key: 'te', label: 'て형 (연결·진행)', meaningHint: '~기다리고 / 기다려서', stem: '待', ending: 'って', reading: 'まって', euphonicRule: '촉음편: う/つ/る → って ("잠깐만!"은 ちょっと 待って!)', exampleJp: 'ちょっと 待って ください。', exampleKo: '잠깐만 기다려 주세요.' },
      potential: { key: 'potential', label: '가능형', meaningHint: '~기다릴 수 있다', stem: '待', ending: 'てる', reading: 'まてる', euphonicRule: 'つ → て + る', exampleJp: 'あしたまで 待てますか。', exampleKo: '내일까지 기다릴 수 있나요?' },
      volitional: { key: 'volitional', label: '의지형', meaningHint: '~기다리자', stem: '待', ending: 'とう', reading: 'まとう', euphonicRule: 'つ → と + う', exampleJp: 'もう少し 待とうよ。', exampleKo: '조금만 더 기다리자.' },
      conditional: { key: 'conditional', label: '조건형 (ば형)', meaningHint: '~기다리면', stem: '待', ending: 'てば', reading: 'まてば', euphonicRule: 'つ → て + ば', exampleJp: '5分 待てば バスが 来ます。', exampleKo: '5분 기다리면 버스가 옵니다.' },
      passive: { key: 'passive', label: '수동형', meaningHint: '~기다려지다', stem: '待', ending: 'たれる', reading: 'またれる', euphonicRule: 'つ → た + れる', exampleJp: '春休みが 待ち望まれる。', exampleKo: '봄방학이 간절히 기다려진다.' }
    }
  },
  {
    id: 'vb_iku',
    level: 'N5',
    group: 1,
    groupLabel: '1류 동사 (특수 촉음편 예외 · 行く)',
    dictionary: '行く',
    reading: 'いく',
    meaning: '가다',
    forms: {
      dict: { key: 'dict', label: '사전형 (기본형)', meaningHint: '~가다', stem: '行', ending: 'く', reading: 'いく', euphonicRule: 'く로 끝나지만 て/た형만 특수하게 촉음편 예외가 돼요!', exampleJp: '学校へ 行く。', exampleKo: '학교에 간다.' },
      masu: { key: 'masu', label: 'ます형 (정중형)', meaningHint: '~갑니다', stem: '行', ending: 'きます', reading: 'いきます', euphonicRule: 'く → き + ます', exampleJp: 'あした 図書館へ 行きます。', exampleKo: '내일 도서관에 갑니다.' },
      nai: { key: 'nai', label: 'ない형 (부정형)', meaningHint: '~가지 않는다', stem: '行', ending: 'かない', reading: 'いかない', euphonicRule: 'く → か + ない', exampleJp: '今日は どこにも 行かない。', exampleKo: '오늘은 아무 데도 안 간다.' },
      ta: { key: 'ta', label: 'た형 (과거형)', meaningHint: '~갔다', stem: '行', ending: 'った', reading: 'いった', euphonicRule: '★최대 예외! いいた가 아니라 いった(갔다)로 변해요!', exampleJp: '先週 京都へ 行った。', exampleKo: '지난주에 교토에 갔다.' },
      te: { key: 'te', label: 'て형 (연결·진행)', meaningHint: '~가고 / 가서', stem: '行', ending: 'って', reading: 'いって', euphonicRule: '★최대 예외! いいて가 아니라 いって(가서)예요!', exampleJp: '行って きます！', exampleKo: '다녀오겠습니다!' },
      potential: { key: 'potential', label: '가능형', meaningHint: '~갈 수 있다', stem: '行', ending: 'ける', reading: 'いける', euphonicRule: 'く → け + る', exampleJp: '一人で 行けますか。', exampleKo: '혼자 갈 수 있나요?' },
      volitional: { key: 'volitional', label: '의지형', meaningHint: '~가자', stem: '行', ending: 'こう', reading: 'いこう', euphonicRule: 'く → こ + う', exampleJp: 'いっしょに 行こう！', exampleKo: '같이 가자!' },
      conditional: { key: 'conditional', label: '조건형 (ば형)', meaningHint: '~가면', stem: '行', ending: 'けば', reading: 'いけば', euphonicRule: 'く → け + ば', exampleJp: 'まっすぐ 行けば 駅が 見えます。', exampleKo: '곧장 가면 역이 보입니다.' },
      passive: { key: 'passive', label: '수동형', meaningHint: '~가버리다 (피해)', stem: '行', ending: 'かれる', reading: 'いかれる', euphonicRule: 'く → か + れる', exampleJp: '先に行かれて しまった。', exampleKo: '먼저 가 버렸다.' }
    }
  },
  {
    id: 'vb_taberu',
    level: 'N5',
    group: 2,
    groupLabel: '2류 동사 (一段 · 규칙 활용)',
    dictionary: '食べる',
    reading: 'たべる',
    meaning: '먹다',
    forms: {
      dict: { key: 'dict', label: '사전형 (기본형)', meaningHint: '~먹다', stem: '食べ', ending: 'る', reading: 'たべる', euphonicRule: 'る 앞이 え단(べ)이므로 2류 동사! る만 떼고 붙이면 끝!', exampleJp: '朝ごはんを 食べる。', exampleKo: '아침밥을 먹는다.' },
      masu: { key: 'masu', label: 'ます형 (정중형)', meaningHint: '~먹습니다', stem: '食べ', ending: 'ます', reading: 'たべます', euphonicRule: '어간(食べ) + ます (음편 없음)', exampleJp: '昼に ラーメンを 食べます。', exampleKo: '점심에 라멘을 먹습니다.' },
      nai: { key: 'nai', label: 'ない형 (부정형)', meaningHint: '~먹지 않는다', stem: '食べ', ending: 'ない', reading: 'たべない', euphonicRule: '어간(食べ) + ない', exampleJp: '甘い お菓子は 食べない。', exampleKo: '단 과자는 먹지 않는다.' },
      ta: { key: 'ta', label: 'た형 (과거형)', meaningHint: '~먹었다', stem: '食べ', ending: 'た', reading: 'たべた', euphonicRule: '어간(食べ) + た', exampleJp: 'さっき おにぎりを 食べた。', exampleKo: '아까 주먹밥을 먹었다.' },
      te: { key: 'te', label: 'て형 (연결·진행)', meaningHint: '~먹고 / 먹어서', stem: '食べ', ending: 'て', reading: 'たべて', euphonicRule: '어간(食べ) + て', exampleJp: '手を 洗ってから 食べてね。', exampleKo: '손을 씻고 나서 먹으렴.' },
      potential: { key: 'potential', label: '가능형', meaningHint: '~먹을 수 있다', stem: '食べ', ending: 'られる', reading: 'たべられる', euphonicRule: '2류 동사는 어간 + られる (회화에서는 ら 탈락 食べれる도 들려요)', exampleJp: '辛い 料理も 食べられます。', exampleKo: '매운 음식도 먹을 수 있습니다.' },
      volitional: { key: 'volitional', label: '의지형', meaningHint: '~먹자', stem: '食べ', ending: 'よう', reading: 'たべよう', euphonicRule: '2류 동사는 어간 + よう', exampleJp: 'みんなで ケーキを 食べよう！', exampleKo: '다 같이 케이크를 먹자!' },
      conditional: { key: 'conditional', label: '조건형 (ば형)', meaningHint: '~먹으면', stem: '食べ', ending: 'れば', reading: 'たべれば', euphonicRule: '2류 동사는 어간 + れば', exampleJp: 'これを 食べれば 元気に なります。', exampleKo: '이걸 먹으면 기운이 날 거예요.' },
      passive: { key: 'passive', label: '수동형', meaningHint: '~먹히다', stem: '食べ', ending: 'られる', reading: 'たべられる', euphonicRule: '2류 동사 가능형과 형태가 같아요(어간 + られる) → 문맥으로 구분!', exampleJp: 'ケーキを 弟に 食べられた。', exampleKo: '케이크를 남동생에게 먹혀버렸다.' }
    }
  },
  {
    id: 'vb_suru',
    level: 'N5',
    group: 3,
    groupLabel: '3류 동사 (변격 활용 · する)',
    dictionary: 'する',
    reading: 'する',
    meaning: '하다',
    forms: {
      dict: { key: 'dict', label: '사전형 (기본형)', meaningHint: '~하다', stem: 'す', ending: 'る', reading: 'する', euphonicRule: '가장 중요한 불규칙 3류 동사! 한자어(勉強·運動)+する도 똑같이 활용해요.', exampleJp: '毎日 練習を する。', exampleKo: '매일 연습을 한다.' },
      masu: { key: 'masu', label: 'ます형 (정중형)', meaningHint: '~합니다', stem: 'し', ending: 'ます', reading: 'します', euphonicRule: 'する → します', exampleJp: '日本語の 勉強を します。', exampleKo: '일본어 공부를 합니다.' },
      nai: { key: 'nai', label: 'ない형 (부정형)', meaningHint: '~하지 않는다', stem: 'し', ending: 'ない', reading: 'しない', euphonicRule: 'する → しない', exampleJp: '今日は ゲームを しない。', exampleKo: '오늘은 게임을 하지 않는다.' },
      ta: { key: 'ta', label: 'た형 (과거형)', meaningHint: '~했다', stem: 'し', ending: 'た', reading: 'した', euphonicRule: 'する → した', exampleJp: '昨日 宿題を 全部 した。', exampleKo: '어제 숙제를 전부 했다.' },
      te: { key: 'te', label: 'て형 (연결·진행)', meaningHint: '~하고 / 해서', stem: 'し', ending: 'て', reading: 'して', euphonicRule: 'する → して', exampleJp: '質問が あったら 連絡してね。', exampleKo: '질문이 있으면 연락해 줘.' },
      potential: { key: 'potential', label: '가능형', meaningHint: '~할 수 있다', stem: 'でき', ending: 'る', reading: 'できる', euphonicRule: '★완전 별도 형태: する의 가능형은 できる(할 수 있다)예요!', exampleJp: '日本語が 少しずつ できるように なった。', exampleKo: '일본어를 조금씩 할 수 있게 되었다.' },
      volitional: { key: 'volitional', label: '의지형', meaningHint: '~하자', stem: 'し', ending: 'よう', reading: 'しよう', euphonicRule: 'する → しよう', exampleJp: 'いっしょに クイズを しよう！', exampleKo: '같이 퀴즈를 풀자!' },
      conditional: { key: 'conditional', label: '조건형 (ば형)', meaningHint: '~하면', stem: 'す', ending: 'れば', reading: 'すれば', euphonicRule: 'する → すれば', exampleJp: '復習すれば 忘れないよ。', exampleKo: '복습하면 잊어버리지 않아요.' },
      passive: { key: 'passive', label: '수동형', meaningHint: '~당하다 / ~되다', stem: 'さ', ending: 'れる', reading: 'される', euphonicRule: '★주의: する의 수동형은 される(당하다/되다)예요!', exampleJp: 'この 映画は 世界中で 愛されている。', exampleKo: '이 영화는 전 세계에서 사랑받고 있다.' }
    }
  },
  {
    id: 'vb_kuru',
    level: 'N5',
    group: 3,
    groupLabel: '3류 동사 (변격 활용 · 来る)',
    dictionary: '来る',
    reading: 'くる',
    meaning: '오다',
    forms: {
      dict: { key: 'dict', label: '사전형 (기본형)', meaningHint: '~오다', stem: '来', ending: 'る', reading: 'くる', euphonicRule: '한자 来의 읽기가 く·き·こ 세 가지로 변하는 유일한 동사예요!', exampleJp: 'あした 友達が 家に 来る。', exampleKo: '내일 친구가 집에 온다.' },
      masu: { key: 'masu', label: 'ます형 (정중형)', meaningHint: '~옵니다', stem: '来', ending: 'ます', reading: 'きます', euphonicRule: '읽기 주의: 来(き) + ます', exampleJp: 'もうすぐ 電車が 来ます。', exampleKo: '곧 전철이 옵니다.' },
      nai: { key: 'nai', label: 'ない형 (부정형)', meaningHint: '~오지 않는다', stem: '来', ending: 'ない', reading: 'こない', euphonicRule: '★읽기 주의: 来(こ) + ない (きない 아님!)', exampleJp: '今日は 雨が 来ない ようだ。', exampleKo: '오늘은 비가 오지 않을 것 같다.' },
      ta: { key: 'ta', label: 'た형 (과거형)', meaningHint: '~왔다', stem: '来', ending: 'た', reading: 'きた', euphonicRule: '읽기: 来(き) + た', exampleJp: '日本から 友達が 来た！', exampleKo: '일본에서 친구가 왔다!' },
      te: { key: 'te', label: 'て형 (연결·진행)', meaningHint: '~오고 / 와서', stem: '来', ending: 'て', reading: 'きて', euphonicRule: '읽기: 来(き) + て', exampleJp: 'ここに 来て みて ください。', exampleKo: '여기로 와 보세요.' },
      potential: { key: 'potential', label: '가능형', meaningHint: '~올 수 있다', stem: '来', ending: 'られる', reading: 'こられる', euphonicRule: '★읽기 주의: 来(こ) + られる', exampleJp: '土曜日なら 遊びに 来られるよ。', exampleKo: '토요일이라면 놀러 올 수 있어.' },
      volitional: { key: 'volitional', label: '의지형', meaningHint: '~오자', stem: '来', ending: 'よう', reading: 'こよう', euphonicRule: '★읽기 주의: 来(こ) + よう', exampleJp: 'また 来年も 来ようね。', exampleKo: '다음 해에도 또 오자.' },
      conditional: { key: 'conditional', label: '조건형 (ば형)', meaningHint: '~오면', stem: '来', ending: 'れば', reading: 'くれば', euphonicRule: '읽기: 来(く) + れば', exampleJp: '春が 来れば 桜が 咲きます。', exampleKo: '봄이 오면 벚꽃이 핍니다.' },
      passive: { key: 'passive', label: '수동형', meaningHint: '~오다 (남이 와서 곤란)', stem: '来', ending: 'られる', reading: 'こられる', euphonicRule: '읽기: 来(こ) + られる (가능형과 동일 형태)', exampleJp: '急な 客に 来られて 困った。', exampleKo: '갑작스러운 손님이 와서 곤란했다.' }
    }
  }
];
