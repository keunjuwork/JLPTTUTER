import { ListeningExercise, MockExamPaper, ReadingPassage } from '../types';

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'read_s0_1',
    level: 'STAGE0',
    subLevel: 1,
    title: '아리의 첫 자기소개',
    category: '0단계 기초 읽기',
    originalJp: 'おはようございます。わたしは アリです。ちゅうがくせいです。にほんごが だいすきです。',
    hiraganaText: 'おはようございます。わたしは ありです。ちゅうがくせいです。にほんごが だいすきです。',
    literalKo: '안녕하세요(아침). 저는 아리입니다. 중학생입니다. 일본어를 정말 좋아합니다.',
    keyVocab: [
      { word: 'わたし', reading: '와타시', meaning: '나 / 저' },
      { word: 'ちゅうがくせい', reading: '추우가쿠세이', meaning: '중학생' },
      { word: 'だいすき', reading: '다이스키', meaning: '정말 좋아함' }
    ],
    questions: [
      {
        id: 'rq_s0_1a',
        prompt: '아리는 무엇을 정말 좋아한다고 했나요?',
        options: ['수학', '일본어', '우유', '축구'],
        correctIndex: 1,
        explanation: '마지막 문장 「にほんごが だいすきです」(일본어를 정말 좋아합니다)에서 정답은 일본어입니다.'
      },
      {
        id: 'rq_s0_1b',
        prompt: '아리의 학생 신분으로 알맞은 것은?',
        options: ['초등학생', '중학생', '대학생', '선생님'],
        correctIndex: 1,
        explanation: '「ちゅうがくせいです」는 "중학생입니다"라는 뜻이에요.'
      }
    ]
  },
  {
    id: 'read_n5_1',
    level: 'N5',
    subLevel: 1,
    title: '일요일의 공원 산책',
    category: 'N5 단문 독해',
    originalJp: 'きのうは 日曜日でした。天気が よかったので、わたしは 犬と 公園へ 行きました。公園で パンを 食べました。とても おいしかったです。',
    hiraganaText: 'きのうは にちようびでした。てんきが よかったので、わたしは いぬと こうえんへ いきました。こうえんで ぱんを たべました。とても おいしかったです。',
    literalKo: '어제는 일요일이었습니다. 날씨가 좋았기 때문에, 저는 강아지와 공원에 갔습니다. 공원에서 빵을 먹었습니다. 무척 맛있었습니다.',
    keyVocab: [
      { word: '天気 (てんき)', reading: '텡키', meaning: '날씨' },
      { word: '公園 (こうえん)', reading: '코우엔', meaning: '공원' },
      { word: 'おいしい', reading: '오이시이', meaning: '맛있다' }
    ],
    questions: [
      {
        id: 'rq_n5_1a',
        prompt: '글쓴이는 누구와 함께 공원에 갔나요?',
        options: ['선생님', '여동생', '강아지', '혼자'],
        correctIndex: 2,
        explanation: '「犬と 公園へ 行きました」(개/강아지와 공원에 갔습니다)가 본문에 나와 있어요.'
      },
      {
        id: 'rq_n5_1b',
        prompt: '어제 날씨는 어땠나요?',
        options: ['비가 왔다', '눈이 왔다', '좋았다', '바람이 셌다'],
        correctIndex: 2,
        explanation: '「天気が よかったので」(날씨가 좋았기 때문에)에서 확인할 수 있어요.'
      }
    ]
  },
  {
    id: 'read_n5_2',
    level: 'N5',
    subLevel: 3,
    title: '도서관 이용 안내문',
    category: 'N5 실용 안내문',
    originalJp: '図書館は 朝 9時から 夜 8時までです。月曜日は 休みです。本は 1人 5さつまで 2週間 かりることが できます。',
    hiraganaText: 'としょかんは あさ くじから よる はちじまでです。げつようびは やすみです。ほんは ひとり ごさつまで にしゅうかん かりることが できます。',
    literalKo: '도서관은 아침 9시부터 밤 8시까지입니다. 월요일은 쉬는 날입니다. 책은 1인 5권까지 2주간 빌릴 수 있습니다.',
    keyVocab: [
      { word: '図書館 (としょかん)', reading: '토쇼칸', meaning: '도서관' },
      { word: '〜さつ (冊)', reading: '사츠', meaning: '책 세는 단위 (~권)' },
      { word: 'かりる', reading: '카리루', meaning: '빌리다' }
    ],
    questions: [
      {
        id: 'rq_n5_2a',
        prompt: '이 도서관이 문을 닫는 요일은 언제인가요?',
        options: ['일요일', '월요일', '수요일', '금요일'],
        correctIndex: 1,
        explanation: '「月曜日は 休みです」 → 월요일이 휴관일이에요.'
      },
      {
        id: 'rq_n5_2b',
        prompt: '한 사람이 한 번에 빌릴 수 있는 책 권수와 기간은?',
        options: ['3권 · 1주', '5권 · 1주', '5권 · 2주', '10권 · 2주'],
        correctIndex: 2,
        explanation: '「1人 5さつまで 2週間」 → 1인 5권까지 2주 동안 대여할 수 있습니다.'
      }
    ]
  },
  {
    id: 'read_n4_1',
    level: 'N4',
    subLevel: 2,
    title: '처음 만든 일본 요리',
    category: 'N4 중문 독해',
    originalJp: '先週、母の 誕生日に わたしは はじめて カレーを 作って あげました。作り方を見ながら 1時間 かけましたが、少し 辛く なって しまいました。でも、母は「とても おいしいよ」と 言って 笑って くれました。',
    hiraganaText: 'せんしゅう、ははの たんじょうびに わたしは はじめて かれーを つくって あげました。つくりかたを みながら いちじかん かけましたが、すこし からく なって しまいました。でも、ははは「とても おいしいよ」と いって わらって くれました。',
    literalKo: '지난주 어머니 생신에 저는 처음으로 카레를 만들어 드렸습니다. 만드는 법을 보면서 1시간이나 들였지만, 조금 매워져 버렸습니다. 하지만 어머니는 "무척 맛있어"라고 말하며 웃어 주셨습니다.',
    keyVocab: [
      { word: '誕生日 (たんじょうび)', reading: '탄죠우비', meaning: '생일' },
      { word: '〜て しまう', reading: '~테 시마우', meaning: '~해 버리다 (아쉬움)' },
      { word: '辛い (からい)', reading: '카라이', meaning: '맵다' }
    ],
    questions: [
      {
        id: 'rq_n4_1a',
        prompt: '요리를 만들면서 생긴 예상 밖의 일은 무엇인가요?',
        options: ['밥이 다 탔다', '조금 매워져 버렸다', '재료를 못 샀다', '어머니가 밖에 나가셨다'],
        correctIndex: 1,
        explanation: '「少し 辛く なって しまいました」에서 음식이 조금 매워졌음을 알 수 있어요.'
      }
    ]
  },
  {
    id: 'read_n3_1',
    level: 'N3',
    subLevel: 2,
    title: '메모하는 습관의 힘',
    category: 'N3 에세이 독해',
    originalJp: '人間は どんなに 大切な ことでも、時間が たつと 忘れて しまう ものです。だからこそ、忘れない うちに 短くても メモを 取る 習慣が 役に 立ちます。書く ことで 頭の中も 整理されます。',
    hiraganaText: 'にんげんは どんなに たいせつな ことでも、じかんが たつと わすれて しまう ものです。だからこそ、わすれない うちに みじかくても めもを とる しゅうかんが やくに たちます。かく ことで あたまのなかも せいりされます。',
    literalKo: '인간은 아무리 소중한 일이라도 시간이 지나면 잊어버리기 마련입니다. 그렇기에 잊지 않는 사이에 짧더라도 메모를 하는 습관이 도움이 됩니다. 쓰는 것으로 머릿속도 정리됩니다.',
    keyVocab: [
      { word: '〜うちに', reading: '~우치니', meaning: '~하는 사이에 (변하기 전에)' },
      { word: '習慣 (しゅうかん)', reading: '슈우칸', meaning: '습관' },
      { word: '整理 (せいり)', reading: '세이리', meaning: '정리' }
    ],
    questions: [
      {
        id: 'rq_n3_1a',
        prompt: '이 글의 글쓴이가 강조하는 메모의 장점이 아닌 것은?',
        options: ['시간이 지나 잊기 전에 기록할 수 있다', '머릿속 생각이 정리된다', '반드시 길게 써야 효과가 있다', '생활에 큰 도움이 된다'],
        correctIndex: 2,
        explanation: '글쓴이는 「短くても メモを 取る」(짧더라도 메모를 하는) 습관이 좋다고 했으므로 "길게 써야 한다"는 틀렸어요.'
      }
    ]
  },
  {
    id: 'read_n2_1',
    level: 'N2',
    subLevel: 2,
    title: '질문하는 용기와 학습 효율',
    category: 'N2 논설 독해',
    originalJp: '分からない ことを そのままに しておくと、次の 段階へ 進むに つれて 理解が 追いつかなく なる。恥ずかしさを 恐れて 質問を ためらうより、疑問を その場で 確認する 方が 学習の 効率は 確実に 高まる。',
    hiraganaText: 'わからない ことを そのままに しておくと、つぎの だんかいへ すすむに つれて りかいが おいつかなく なる。はずかしさを おそれて しつもんを ためらうより、ぎもんを そのばで かくにんする ほうが がくしゅうの こうりつは かくじつに たかまる。',
    literalKo: '모르는 것을 그대로 두면, 다음 단계로 나아감에 따라 이해가 따라가지 못하게 된다. 부끄러움을 두려워해 질문을 망설이기보다 의문을 그 자리에서 확인하는 편이 학습의 효율은 확실히 높아진다.',
    keyVocab: [
      { word: '〜に つれて', reading: '~니 츠레테', meaning: '~함에 따라' },
      { word: '追いつく (おいつく)', reading: '오이츠쿠', meaning: '따라잡다' },
      { word: 'ためらう', reading: '타메라우', meaning: '망설이다' }
    ],
    questions: [
      {
        id: 'rq_n2_1a',
        prompt: '글쓴이의 중심 생각으로 가장 알맞은 것은?',
        options: ['혼자 조용히 오래 외우는 것이 최고다', '모르는 것은 망설이지 말고 즉시 확인해야 효율이 오른다', '쉬운 부분만 반복하면 다음 단계가 필요 없다', '부끄러운 질문은 피하는 것이 좋다'],
        correctIndex: 1,
        explanation: '「疑問を その場で 確認する 方が 学習の 効率は 確実に 高まる」가 글쓴이의 핵심 주장입니다.'
      }
    ]
  },
  {
    id: 'read_n1_1',
    level: 'N1',
    subLevel: 3,
    title: '언어 학습과 문화의 본질',
    category: 'N1 추상 비평',
    originalJp: '外国語を 学ぶ という ことは、単に 単語や 文法の 規則を 暗記するに 留まらない。言葉の 背後にある 文化的 文脈を 読み解く 過程を 通じて、自らの 思考の 枠組みさえ 広げられる のである。',
    hiraganaText: 'がいこくごを まなぶ という ことは、たんに たんごや ぶんぽうの きそくを あんきするに とどまらない。ことばの はいごにある ぶんかてき ぶんみゃくを よみとく かていを つうじて、みずからの しこうの わくぐみさえ ひろげられる のである。',
    literalKo: '외국어를 배운다는 것은 단순히 단어나 문법 규칙을 암기하는 데 그치지 않는다. 말의 배후에 있는 문화적 맥락을 읽어내는 과정을 통해 자기 자신의 사고의 틀마저 넓힐 수 있는 것이다.',
    keyVocab: [
      { word: '〜に 留まらない (とどまらない)', reading: '니 토도마라나이', meaning: '~에 그치지 않는다' },
      { word: '読み解く (よみとく)', reading: '요미토쿠', meaning: '읽고 깊이 이해하다' },
      { word: '枠組み (わくぐみ)', reading: '와쿠구미', meaning: '틀 / 프레임워크' }
    ],
    questions: [
      {
        id: 'rq_n1_1a',
        prompt: '필자가 말하는 외국어 학습의 궁극적인 가치는 무엇인가요?',
        options: ['시험 점수만을 빠르게 올리는 기술', '문화적 맥락 이해를 통한 자신만의 사고 확장', '단어를 1만 개 이상 기계적으로 외우는 것', '문법 규칙을 변형 없이 그대로 따르는 것'],
        correctIndex: 1,
        explanation: '「文化的 文脈を 読み解く 過程を 通じて、自らの 思考の 枠組みさえ 広げられる」에서 사고의 틀을 넓히는 가치임을 알 수 있어요.'
      }
    ]
  }
];

export const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'list_s0_1',
    level: 'STAGE0',
    subLevel: 1,
    title: '아침 인사 & 학교 가기',
    situation: '아리와 엄마가 아침에 나누는 가벼운 대화예요.',
    lines: [
      { speaker: '아리', gender: 'F', jp: 'おかあさん、おはようございます。', ko: '엄마, 안녕히 주무셨어요?' },
      { speaker: '엄마', gender: 'F', jp: 'おはよう、アリ。きょうは ごぜん 9じに がっこうへ いくの？', ko: '안녕, 아리. 오늘은 오전 9시에 학교에 가니?' },
      { speaker: '아리', gender: 'F', jp: 'いいえ、8じはんに いきます！じゃ、いってきます！', ko: '아니요, 8시 반에 가요! 그럼 다녀오겠습니다!' }
    ],
    questions: [
      {
        id: 'lq_s0_1a',
        prompt: '아리는 몇 시에 학교에 가나요?',
        options: ['8시', '8시 반', '9시', '9시 반'],
        correctIndex: 1,
        explanation: '아리가 마지막에 「8じはんに いきます」(8시 반에 갑니다)라고 말했어요.'
      }
    ]
  },
  {
    id: 'list_n5_1',
    level: 'N5',
    subLevel: 1,
    title: '문구점에서 연필 사기',
    situation: '손님과 가게 직원이 연필 개수와 가격에 대해 이야기해요.',
    lines: [
      { speaker: '손님', gender: 'M', jp: 'すみません。この えんぴつは いくらですか。', ko: '실례합니다. 이 연필은 얼마인가요?' },
      { speaker: '직원', gender: 'F', jp: '1ぽん 100えんです。きょうは 3ぼん かうと 250えんに なりますよ。', ko: '1자루에 100엔입니다. 오늘은 3자루를 사면 250엔이 됩니다.' },
      { speaker: '손님', gender: 'M', jp: 'そうですか。じゃ、3ぼん ください。あと、けしごむも 1つ おねがいします。', ko: '그래요? 그럼 3자루 주세요. 그리고 지우개도 1개 부탁합니다.' }
    ],
    questions: [
      {
        id: 'lq_n5_1a',
        prompt: '손님은 연필을 몇 자루 사기로 했나요?',
        options: ['1자루', '2자루', '3자루', '5자루'],
        correctIndex: 2,
        explanation: '손님이 「じゃ、3ぼん ください」라며 3자루를 주문했어요.'
      },
      {
        id: 'lq_n5_1b',
        prompt: '연필 외에 손님이 추가로 주문한 물건은?',
        options: ['자', '공책', '지우개', '가위'],
        correctIndex: 2,
        explanation: '「けしごむも 1つ おねがいします」(지우개도 1개 부탁합니다)라고 했어요.'
      }
    ]
  },
  {
    id: 'list_n4_1',
    level: 'N4',
    subLevel: 2,
    title: '주말 약속 정하기',
    situation: '남학생과 여학생이 토요일에 만날 장소를 바꾸고 있어요.',
    lines: [
      { speaker: '유이', gender: 'F', jp: 'けんたさん、どようびの えいが、1じに えきの まどぐちの まえで いいですか。', ko: '켄타 씨, 토요일 영화 1시에 역 창구 앞에서 괜찮나요?' },
      { speaker: '켄타', gender: 'M', jp: 'どようびは ひとが おおいから、まどぐちより ほんやの まえが わかりやすいと おもいます。', ko: '토요일은 사람이 많으니까 창구보다 서점 앞이 찾기 쉬울 것 같아요.' },
      { speaker: '유이', gender: 'F', jp: 'わかりました。じゃあ、12じはんに ほんやの まえで あいましょう。おひるも たべたいですし。', ko: '알겠어요. 그럼 12시 반에 서점 앞에서 만나요. 점심도 먹고 싶으니까요.' }
    ],
    questions: [
      {
        id: 'lq_n4_1a',
        prompt: '두 사람은 토요일 언제 어디서 만나기로 결정했나요?',
        options: ['1시 · 역 창구 앞', '1시 · 서점 앞', '12시 반 · 서점 앞', '12시 반 · 영화관 앞'],
        correctIndex: 2,
        explanation: '최종 결정은 「12じはんに ほんやの まえで あいましょう」(12시 반에 서점 앞에서 만나요)입니다.'
      }
    ]
  },
  {
    id: 'list_n3_1',
    level: 'N3',
    subLevel: 2,
    title: '동아리 설명회 장소 안내',
    situation: '방송실에서 교내 동아리 오리엔테이션 변경 사항을 안내해요.',
    lines: [
      { speaker: '안내 방송', gender: 'F', jp: 'がくせいの みなさん、おしらせです。きょう ほうかごの にほんご クラブ せつめいかいは、2かいの 3ばん きょうしつで おこなう よていでしたが、あめのため たいいくかんに へんこうに なりました。', ko: '학생 여러분, 안내드립니다. 오늘 방과후 일본어 동아리 설명회는 2층 3번 교실에서 열릴 예정이었으나, 비 때문에 체육관으로 변경되었습니다.' },
      { speaker: '안내 방송', gender: 'F', jp: 'なお、じかんは よていどおり 3じはんからです。スリッパを わすれずに もって きて ください。', ko: '또한 시간은 예정대로 3시 반부터입니다. 실내화를 잊지 말고 가져와 주세요.' }
    ],
    questions: [
      {
        id: 'lq_n3_1a',
        prompt: '오늘 일본어 동아리 설명회가 열리는 장소는 어디인가요?',
        options: ['2층 3번 교실', '도서관', '체육관', '운동장'],
        correctIndex: 2,
        explanation: '원래 3번 교실이었으나 「たいいくかんに へんこうに なりました」(체육관으로 변경되었습니다)라고 안내했어요.'
      }
    ]
  },
  {
    id: 'list_n2_1',
    level: 'N2',
    subLevel: 2,
    title: '면접·대회 발표 준비 조언',
    situation: '선배가 발표를 앞둔 후배에게 조언하고 있어요.',
    lines: [
      { speaker: '후배', gender: 'F', jp: 'せんぱい、らいしゅうの スピーチ たいかい、きんちょうして げんこうを わすれそうで しんぱいです。', ko: '선배, 다음 주 스피치 대회에서 긴장해서 원고를 잊어버릴까 봐 걱정돼요.' },
      { speaker: '선배', gender: 'M', jp: 'ぜんぶ まるあんき しようと するから かえって つまるんだよ。だいじなのは キーワードだけ おぼえて、じぶんの ことばで はなす ことさ。', ko: '전부 통째로 외우려 하니까 오히려 막히는 거야. 중요한 건 키워드만 기억하고 자기 말로 이야기하는 거란다.' }
    ],
    questions: [
      {
        id: 'lq_n2_1a',
        prompt: '선배가 조언한 발표 비결로 가장 알맞은 것은?',
        options: ['원고 토씨 하나까지 완벽히 통째로 외운다', '핵심 키워드만 외워 자기 말로 풀어낸다', '발표 중에는 원고 종이만 계속 본다', '말을 아주 빠르게 한다'],
        correctIndex: 1,
        explanation: '선배는 「キーワードだけ おぼえて、じぶんの ことばで はなす」(키워드만 외워 자기 말로 말하기)를 조언했어요.'
      }
    ]
  },
  {
    id: 'list_n1_1',
    level: 'N1',
    subLevel: 3,
    title: '즉시 응답 · 상황 판단',
    situation: '직장·학교 선후배의 짧은 발화를 듣고 가장 적절한 대답을 고르세요.',
    lines: [
      { speaker: '상대방', gender: 'M', jp: 'この しりょう、あしたの かいぎまでに まとめるのは ちょっと むり かも しれないなあ。', ko: '이 자료, 내일 회의 전까지 정리하는 건 좀 무리일지도 모르겠네.' },
      { speaker: '응답 예시', gender: 'F', jp: 'よかったら、わたしに てつだえる ぶぶんは やりましょうか。', ko: '괜찮으시다면, 제가 도울 수 있는 부분은 할까요?' }
    ],
    questions: [
      {
        id: 'lq_n1_1a',
        prompt: '남자의 말("내일 회의 전까지 정리가 무리일지도 모르겠다")에 대한 응답으로 가장 자연스러운 것은?',
        options: [
          '그럼 내일 회의는 아무도 안 가겠네요.',
          '제가 도울 수 있는 부분이 있다면 맡겨 주세요.',
          '이미 회의가 어제 끝났는데요.',
          '자료는 전혀 필요하지 않을 거예요.'
        ],
        correctIndex: 1,
        explanation: '상대의 부담을 덜어주며 도움을 제안하는 2번이 N1 즉시응답 유형의 정석 정답입니다.'
      }
    ]
  }
];

export const MOCK_EXAM_PAPERS: MockExamPaper[] = [
  {
    id: 'paper_s0_1',
    level: 'STAGE0',
    title: '0단계 가나·기초 총정리 미니 모의고사',
    subtitle: '히라가나·가타카나 구별과 기초 인사 표현 점검',
    totalMinutes: 15,
    passScore: 80,
    maxScore: 100,
    sections: [
      {
        id: 's0_hira',
        name: '히라가나 청음·탁음·요음',
        minutes: 8,
        maxScore: 50,
        minPassScore: 30,
        questions: [
          {
            id: 'ms0_1',
            prompt: '다음 중 발음이 「사(sa)」인 히라가나는 무엇인가요?',
            options: ['き', 'さ', 'ち', 'に'],
            correctIndex: 1,
            explanation: 'き(키)는 가로줄 2개, さ(사)는 가로줄 1개예요.'
          },
          {
            id: 'ms0_2',
            prompt: '단어 「がっこう」의 올바른 뜻은 무엇인가요?',
            options: ['우산', '학교', '가방', '사과'],
            correctIndex: 1,
            explanation: 'がっこう(각코우)는 "학교"를 뜻하는 단어예요.'
          },
          {
            id: 'ms0_3',
            prompt: '다음 중 히라가나 「ぬ(누)」는 어느 것인가요?',
            options: ['め', 'ぬ', 'の', 'ね'],
            correctIndex: 1,
            explanation: 'め 끝에 작은 돼지꼬리 루프가 달리면 ぬ(누)예요!'
          },
          {
            id: 'ms0_4',
            prompt: '단어 「ぱん(팡)」처럼 반탁점(゜)이 붙은 파행 글자는?',
            options: ['ば', 'ざ', 'ぱ', 'だ'],
            correctIndex: 2,
            explanation: 'は 위에 동그라미 반탁점 ゜가 붙으면 파(ぱ) 소리가 나요.'
          }
        ]
      },
      {
        id: 's0_kata',
        name: '가타카나 46자 & 외래어',
        minutes: 7,
        maxScore: 50,
        minPassScore: 30,
        questions: [
          {
            id: 'ms0_5',
            prompt: '시(シ)와 츠(ツ) 중 "아래에서 위로 올려 쓰는" 글자는?',
            options: ['シ (시)', 'ツ (츠)', 'ソ (소)', 'ン (응)'],
            correctIndex: 0,
            explanation: 'シ(시)는 점 두 개가 세로로 놓이고 획을 아래서 위로 쓸어올려요.'
          },
          {
            id: 'ms0_6',
            prompt: '외래어 단어 「ケーキ」의 뜻은 무엇인가요?',
            options: ['카메라', '케이크', '커피', '택시'],
            correctIndex: 1,
            explanation: 'ケーキ(케키)는 영어로 Cake(케이크)예요.'
          },
          {
            id: 'ms0_7',
            prompt: '「ありがとう ございます」를 사용하는 상황은?',
            options: ['사과할 때', '감사할 때', '헤어질 때', '이름을 물을 때'],
            correctIndex: 1,
            explanation: '감사 마음을 전하는 정중한 표현입니다.'
          },
          {
            id: 'ms0_8',
            prompt: '다음 가타카나 중 「ン(응)」과 헷갈리기 쉬운 「ソ(소)」는 어느 것?',
            options: ['ソ', 'ン', 'ノ', 'メ'],
            correctIndex: 0,
            explanation: 'ソ(소)는 위에서 아래로 내리긋고, ン(응)은 아래서 위로 올려그어요.'
          }
        ]
      }
    ]
  },
  {
    id: 'paper_n5_1',
    level: 'N5',
    title: 'JLPT N5 실전 하프 모의고사 1회',
    subtitle: '합격선 80/180점 · 영역별 과락 19점 미만 체크',
    totalMinutes: 30,
    passScore: 80,
    maxScore: 180,
    sections: [
      {
        id: 'sec_vocab',
        name: '언어지식(문자·어휘)',
        minutes: 10,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: 'mn5_v1',
            prompt: '밑줄 친 한자 「毎日」의 올바른 읽기는?',
            options: ['まいにち', 'まいひ', 'まいじつ', 'めいにち'],
            correctIndex: 0,
            explanation: '毎日는 「まいにち(마이니치 · 매일)」라고 읽어요.'
          },
          {
            id: 'mn5_v2',
            prompt: '다음 단어의 한자 표기로 알맞은 것은? 「きょうの てんき」',
            options: ['電気', '天気', '元気', '人気'],
            correctIndex: 1,
            explanation: 'てんき(날씨)는 天気라고 씁니다. 電気는 전기, 元気는 건강해요.'
          },
          {
            id: 'mn5_v3',
            prompt: '빈칸에 가장 알맞은 말은? 「きのう デパートで (　　)を しました。」',
            options: ['やすみ', 'かいもの', 'じかん', 'おてあらい'],
            correctIndex: 1,
            explanation: '백화점에서 한 것은 買い物(쇼핑)가 자연스러워요.'
          },
          {
            id: 'mn5_v4',
            prompt: '한자 「学生」의 올바른 읽기는?',
            options: ['がくせい', 'がっこう', 'せんせい', 'だいがく'],
            correctIndex: 0,
            explanation: '学生(がくせい · 학생)입니다.'
          },
          {
            id: 'mn5_v5',
            prompt: '「みず」를 한자로 바르게 쓴 것은?',
            options: ['木', '火', '水', '金'],
            correctIndex: 2,
            explanation: '물 수(水)가 みず(물)입니다.'
          }
        ]
      },
      {
        id: 'sec_grammar',
        name: '언어지식(문법)·독해',
        minutes: 12,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: 'mn5_g1',
            prompt: '빈칸에 알맞은 조사는? 「わたしは バス(　) がっこうへ いきます。」',
            options: ['を', 'が', 'で', 'に'],
            correctIndex: 2,
            explanation: '교통수단 뒤에는 수단 조사 「で」를 써서 「バスで」라고 해요.'
          },
          {
            id: 'mn5_g2',
            prompt: '빈칸에 알맞은 형태는? 「まいにち 7じに おき(　　)。」',
            options: ['ます', 'ました', 'て', 'たい'],
            correctIndex: 0,
            explanation: '毎日(매일)이라는 습관이므로 현재형 「おきます」가 자연스러워요.'
          },
          {
            id: 'mn5_g3',
            prompt: '「여름방학에 일본에 가고 싶습니다」를 바르게 옮긴 것은?',
            options: [
              'なつやすみに にほんへ いきました。',
              'なつやすみに にほんへ いきたいです。',
              'なつやすみに にほんへ いきますか。',
              'なつやすみに にほんへ いきません。'
            ],
            correctIndex: 1,
            explanation: '~하고 싶습니다는 동사 어간 + たいです → いきたいです!'
          },
          {
            id: 'mn5_r1',
            contextText: 'たなかさんは まいにち あさ 6じに おきて、こうえんを さんぽします。それから あさごはんを たべます。',
            prompt: '위 글에서 다나카 씨가 아침에 제일 먼저 하는 일은?',
            options: ['아침밥을 먹는다', '공원을 산책한다', '학교에 간다', '신문지를 읽는다'],
            correctIndex: 1,
            explanation: '「あさ 6じに おきて、こうえんを さんぽします。それから あさごはんを たべます」(일어나서 산책하고, 그다음 식사해요).'
          }
        ]
      },
      {
        id: 'sec_listening',
        name: '청해',
        minutes: 8,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: 'mn5_l1',
            audioText: 'すみません、ぎんこうは どこですか。まっすぐ いって、みぎに ありますよ。',
            prompt: '🔊 음성을 듣고 답하세요: 은행은 어느 쪽에 있나요?',
            options: ['왼쪽', '오른쪽', '뒤쪽', '2층'],
            correctIndex: 1,
            explanation: '대사에서 「みぎに ありますよ」(오른쪽에 있어요)라고 했어요.'
          },
          {
            id: 'mn5_l2',
            audioText: 'この りんごは ひとつ 150えんです。ふたつ ください。',
            prompt: '🔊 음성을 듣고 답하세요: 손님은 모두 얼마를 내야 할까요?',
            options: ['150엔', '200엔', '300엔', '450엔'],
            correctIndex: 2,
            explanation: '사과 1개 150엔 × 2개(ふたつ) = 300엔이에요!'
          },
          {
            id: 'mn5_l3',
            audioText: 'あしたは テストですから、きょうの よる 9じまで べんきょうします。',
            prompt: '🔊 음성을 듣고 답하세요: 오늘 밤 몇 시까지 공부하나요?',
            options: ['7시까지', '8시까지', '9시까지', '10시까지'],
            correctIndex: 2,
            explanation: '「よる 9じまで べんきょうします」 → 밤 9시까지입니다.'
          },
          {
            id: 'mn5_l4',
            audioText: 'アリさんの たんじょうびは なんがつ なんにちですか。5がつ 5かです。',
            prompt: '🔊 음성을 듣고 답하세요: 아리의 생일은 언제인가요?',
            options: ['3월 5일', '5월 3일', '5월 5일', '5월 15일'],
            correctIndex: 2,
            explanation: '「5がつ 5かです」 → 5월 5일입니다.'
          }
        ]
      }
    ]
  },
  {
    id: 'paper_n4_1',
    level: 'N4',
    title: 'JLPT N4 실전 하프 모의고사 1회',
    subtitle: '합격선 90/180점 · 영역별 과락 19점 미만 체크',
    totalMinutes: 35,
    passScore: 90,
    maxScore: 180,
    sections: [
      {
        id: 'sec_vocab',
        name: '언어지식(문자·어휘)',
        minutes: 10,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          { id: 'mn4_v1', prompt: '한자 「旅行」의 읽기로 알맞은 것은?', options: ['りょこう', 'りょうこう', 'たびこう', 'りょくこう'], correctIndex: 0, explanation: '旅行(りょこう · 여행)은 ょ 단음이에요.' },
          { id: 'mn4_v2', prompt: '한자 「準備」의 뜻은 무엇인가요?', options: ['마감', '준비', '출발', '도착'], correctIndex: 1, explanation: '準備(じゅんび) = 준비입니다.' },
          { id: 'mn4_v3', prompt: '「つくったら すぐ (　　)して ください。」(도착하면 바로 연락하세요)', options: ['けんがく', 'れんらく', 'しょうかい', 'あんない'], correctIndex: 1, explanation: '連絡(れんらく · 연락)이 알맞아요.' }
        ]
      },
      {
        id: 'sec_grammar',
        name: '언어지식(문법)·독해',
        minutes: 15,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          { id: 'mn4_g1', prompt: '「일본에 가 본 적이 있습니다」를 바르게 완성하면? 「日本へ 行った (　　)。」', options: ['ことが あります', 'ように なります', 'て います', 'つもりです'], correctIndex: 0, explanation: '경험을 말할 때는 Vた + ことが あります!' },
          { id: 'mn4_g2', prompt: '빈칸에 알맞은 동사는? 「友達が わたしに ノートを かして (　　)。」', options: ['あげました', 'くれました', 'もらいました', 'やりました'], correctIndex: 1, explanation: '친구(남)가 "나에게" 해 주었으므로 くれました를 써요!' },
          {
            id: 'mn4_r1',
            contextText: 'わたしは 最近、夜 11時まえに 寝る ように しています。そうすると、朝 早く 起きられる ように なりました。',
            prompt: '글쓴이의 생활 변화로 알맞은 것은?',
            options: ['밤 11시 넘어서 자게 되었다', '아침에 일찍 일어날 수 있게 되었다', '낮잠을 많이 자게 되었다', '늦잠을 자서 지각했다'],
            correctIndex: 1,
            explanation: '「朝 早く 起きられる ように なりました」 → 아침 일찍 일어날 수 있게 되었어요.'
          }
        ]
      },
      {
        id: 'sec_listening',
        name: '청해',
        minutes: 10,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          { id: 'mn4_l1', audioText: 'あしたは 雨が ふりそうだから、かさを もって 行った ほうが いいよ。', prompt: '🔊 음성을 듣고 답하세요: 왜 우산을 챙기라고 했나요?', options: ['우산을 잃어버려서', '내일 비가 올 것 같아서', '햇빛이 너무 강해서', '친구가 빌려 달라고 해서'], correctIndex: 1, explanation: '「雨が ふりそうだから」 → 비가 내릴 것 같기 때문이에요.' },
          { id: 'mn4_l2', audioText: 'すみません、電車の 時間が おくれて います。10ぷん ごろ まつと くるそうです。', prompt: '🔊 음성을 듣고 답하세요: 전철은 약 몇 분 뒤에 온다고 하나요?', options: ['5분 후', '10분 후', '20분 후', '30분 후'], correctIndex: 1, explanation: '「10ぷん ごろ まつと くるそうです」(10분쯤 기다리면 온대요).' }
        ]
      }
    ]
  },
  {
    id: 'paper_n3_1',
    level: 'N3',
    title: 'JLPT N3 실전 하프 모의고사 1회',
    subtitle: '합격선 95/180점 · 영역별 과락 19점 미만 체크',
    totalMinutes: 40,
    passScore: 95,
    maxScore: 180,
    sections: [
      {
        id: 'sec_vocab',
        name: '언어지식(문자·어휘)',
        minutes: 12,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          { id: 'mn3_v1', prompt: '한자 「感謝」의 올바른 읽기는?', options: ['かんしゃ', 'かんさ', 'がんしゃ', 'かんじゃ'], correctIndex: 0, explanation: '感謝(かんしゃ · 감사)입니다.' },
          { id: 'mn3_v2', prompt: '한자 「夢」의 훈독 읽기는?', options: ['む', 'ゆめ', 'ねむ', 'あめ'], correctIndex: 1, explanation: '夢의 훈독은 ゆめ(꿈)입니다.' },
          { id: 'mn3_v3', prompt: '「この 問題は (　　)に 簡単だった。」(의외로 간단했다)', options: ['以外', '意外', '案外', '順番'], correctIndex: 1, explanation: '뜻밖을 의미하는 한자는 意外(いがい)입니다.' }
        ]
      },
      {
        id: 'sec_grammar',
        name: '언어지식(문법)·독해',
        minutes: 16,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          { id: 'mn3_g1', prompt: '「잊지 않는 사이에 메모해 두자」 → 「わすれない (　　) メモして おこう。」', options: ['ために', 'うちに', 'あいだ', 'ことに'], correctIndex: 1, explanation: '상태가 변하기 전(잊기 전)을 강조하므로 「うちに」가 정답이에요.' },
          { id: 'mn3_g2', prompt: '「선생님 말씀에 따르면 내일 휴강이라고 한다」 → 「〜によると、あしたは 休み(　　)。」', options: ['ようだ', 'そうだ', 'みたいだ', 'はずがない'], correctIndex: 1, explanation: '~에 따르면(~によると) 전해 들은 사실은 「普通形 + そうだ」입니다.' },
          {
            id: 'mn3_r1',
            contextText: '新しい 環境に 慣れる ためには、まず 自分から あいさつを して みる ことが 大切だ。最初は きんちょうしても、毎日 続ければ 必ず 友だちが 増える だろう。',
            prompt: '글쓴이가 새 환경 적응을 위해 권하는 행동은?',
            options: ['남이 말 걸 때까지 기다린다', '먼저 자신부터 인사를 건네 본다', '첫날에만 인사하면 된다', '친구 수를 줄인다'],
            correctIndex: 1,
            explanation: '「まず 自分から あいさつを して みる ことが 大切だ」가 근거예요.'
          }
        ]
      },
      {
        id: 'sec_listening',
        name: '청해',
        minutes: 12,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          { id: 'mn3_l1', audioText: 'きょうの かいぎですが、2かいの きょうしつから 3かいの かいぎしつに 変更に なりました。', prompt: '🔊 음성을 듣고 답하세요: 오늘 회의는 몇 층에서 열리나요?', options: ['1층', '2층', '3층', '4층'], correctIndex: 2, explanation: '2층 교실에서 「3かいの かいぎしつに 変更」(3층 회의실로 변경)되었어요.' },
          { id: 'mn3_l2', audioText: 'この カメラ、思ったより かるくて 使いやすいですね。りょこうに ぴったりだ。', prompt: '🔊 음성을 듣고 답하세요: 화자가 카메라를 좋게 평가한 이유는?', options: ['매우 무거워서', '생각보다 가볍고 쓰기 편해서', '가격이 너무 비싸서', '배터리가 금방 닳아서'], correctIndex: 1, explanation: '「思ったより かるくて 使いやすい」 → 생각보다 가볍고 쓰기 편해요.' }
        ]
      }
    ]
  },
  {
    id: 'paper_n2_1',
    level: 'N2',
    title: 'JLPT N2 실전 하프 모의고사 1회',
    subtitle: '합격선 90/180점 · 언어·독해 과락 38점 / 청해 과락 19점 체크',
    totalMinutes: 40,
    passScore: 90,
    maxScore: 180,
    sections: [
      {
        id: 'sec_lang_read',
        name: '언어지식(문자·어휘·문법)·독해',
        minutes: 28,
        maxScore: 120,
        minPassScore: 38,
        questions: [
          { id: 'mn2_v1', prompt: '한자 「確認」의 올바른 읽기는?', options: ['かくにん', 'こうにん', 'がくにん', 'かくん'], correctIndex: 0, explanation: '確認(かくにん · 확인)입니다.' },
          { id: 'mn2_v2', prompt: '「학습의 효율이 올라간다」에서 "효율"의 올바른 일본어 읽기는?', options: ['こうか', 'こうりつ', 'りえき', 'せいり'], correctIndex: 1, explanation: '効率(こうりつ)가 효율입니다. 効果는 효과예요.' },
          { id: 'mn2_g1', prompt: '「어린이에 한하지 않고 어른에게도 인기가 있다」 → 「子供(　　) 大人にも 人気がある。」', options: ['にかぎらず', 'にわたって', 'にそって', 'にくわえて'], correctIndex: 0, explanation: '~に 限らず (~에 한하지 않고)가 정확합니다.' },
          {
            id: 'mn2_r1',
            contextText: '時間を かけて 覚えた つもりでも、使わなければ 記憶は 薄れて いく。だからこそ、アウトプットの 機会を 意識的に 作ることが 不可欠だ。',
            prompt: '필자가 기억을 유지하기 위해 꼭 필요하다고 말한 것은?',
            options: ['계속 눈으로만 본다', '아웃풋(직접 써먹는) 기회를 의식적으로 만든다', '잠을 줄인다', '어려운 단어만 외운다'],
            correctIndex: 1,
            explanation: '「アウトプットの 機会を 意識的に 作ることが 不可欠だ」가 핵심입니다.'
          }
        ]
      },
      {
        id: 'sec_listening',
        name: '청해',
        minutes: 12,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          { id: 'mn2_l1', audioText: 'じつは この けいかく、よさんが たりないため、来月に えんき せざるを えなく なりました。', prompt: '🔊 음성을 듣고 답하세요: 계획이 연기된 주된 이유는?', options: ['참여자가 너무 많아서', '예산이 부족해서', '날씨가 추워서', '장소가 너무 넓어서'], correctIndex: 1, explanation: '「よさんが たりないため」(예산이 부족하기 때문에) 연기할 수밖에 없게 되었어요.' },
          { id: 'mn2_l2', audioText: 'ぜんぶ 暗記するより、ポイントだけ おさえて おけば どんな しつもんにも こたえられるよ。', prompt: '🔊 음성을 듣고 답하세요: 조언자의 핵심 메시지는?', options: ['통째로 암기하라', '핵심 포인트만 정확히 파악해 두라', '질문을 받지 말라', '발표를 취소하라'], correctIndex: 1, explanation: '「ポイントだけ おさえて おけば」가 핵심입니다.' }
        ]
      }
    ]
  },
  {
    id: 'paper_n1_1',
    level: 'N1',
    title: 'JLPT N1 실전 하프 모의고사 1회',
    subtitle: '합격선 100/180점 · 언어·독해 과락 38점 / 청해 과락 19점 체크',
    totalMinutes: 45,
    passScore: 100,
    maxScore: 180,
    sections: [
      {
        id: 'sec_lang_read',
        name: '언어지식(문자·어휘·문법)·독해',
        minutes: 32,
        maxScore: 120,
        minPassScore: 38,
        questions: [
          { id: 'mn1_v1', prompt: '한자 「解釈」의 올바른 읽기는?', options: ['かいしゃく', 'けいしゃく', 'かいせき', 'がいしゃく'], correctIndex: 0, explanation: '解釈(かいしゃく · 해석)입니다.' },
          { id: 'mn1_v2', prompt: '표면과 대비되는 사물의 가장 근본적인 성질을 뜻하는 말은?', options: ['現象', '本質', '批判', '前提'], correctIndex: 1, explanation: '本質(ほんしつ · 본질)이 정답입니다.' },
          { id: 'mn1_g1', prompt: '「그 용기에 놀라움을 금할 수 없다」 → 「その 勇気に 驚きを (　　)。」', options: ['禁じ得ない', '余儀なくされる', 'ものともしない', '極まりない'], correctIndex: 0, explanation: '~을 금할 수 없다 = ~を 禁じ得ない!' },
          {
            id: 'mn1_r1',
            contextText: '言語の 習得は 単なる 知識の 蓄積に 留まらず、他者の 視点を 追体験する ことで 自らの 思考を 相対化する 営みに 他ならない。',
            prompt: '필자가 본 언어 습득의 본질적 역할은?',
            options: [
              '단순히 어휘 개수를 세는 작업',
              '타인의 시선을 경험하며 자신의 사고를 객관화·상대화하는 활동',
              '고전 문법만 외우는 훈련',
              '번역기 없이 문장을 베껴 쓰는 일'
            ],
            correctIndex: 1,
            explanation: '「他者の 視点を 追体験する ことで 自らの 思考を 相対化する」가 정확한 근거예요.'
          }
        ]
      },
      {
        id: 'sec_listening',
        name: '청해',
        minutes: 13,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          { id: 'mn1_l1', audioText: 'ぶちょう、ていしゅつ いただいた きかくしょ、とても おもしろいのですが、じっこう プランが もうすこし ぐたいてきだと ありがたいです。', prompt: '🔊 음성을 듣고 답하세요: 상대방이 기획서에 대해 요구한 보완점은?', options: ['기획서 주제를 완전히 바꿀 것', '실행 계획을 조금 더 구체적으로 보강할 것', '페이지를 절반으로 줄일 것', '제출 기한을 작년으로 돌릴 것'], correctIndex: 1, explanation: '「じっこう プランが もうすこし ぐたいてきだと ありがたいです」에서 실행 플랜 구체화를 요청했어요.' },
          { id: 'mn1_l2', audioText: 'この てんらんかい、こんざつを さける ため、よやく なしでは にゅうじょう できない ことに なりました。', prompt: '🔊 음성을 듣고 답하세요: 전시회 입장 규칙으로 바른 것은?', options: ['누구나 예약 없이 입장 가능하다', '혼잡 방지를 위해 예약이 필수다', '학생은 입장할 수 없다', '밤 12시에 열린다'], correctIndex: 1, explanation: '「よやく なしでは にゅうじょう できない」(예약 없이는 입장 불가)이므로 예약 필수입니다.' }
        ]
      }
    ]
  }
];
