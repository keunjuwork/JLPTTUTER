import { AdventureStage, FourWeekPlan, JlptLevel, LevelExamInfo } from '../types';

export const ADVENTURE_STAGES: AdventureStage[] = [
  {
    id: 'stage_h_a', order: 1, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'あ행', badgeChar: 'あ', rowId: 'row_a', script: 'hiragana',
    description: '일본어 모험의 첫걸음! 모음 다섯 글자 あ・い・う・え・お를 정복해요.',
    rewardCardId: 'card_sakura', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_ka', order: 2, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'か행', badgeChar: 'か', rowId: 'row_ka', script: 'hiragana',
    description: 'か・き・く・け・こ 다섯 글자와 대표 단어 かさ(우산)를 익혀요.',
    rewardCardId: 'card_omikuji', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_sa', order: 3, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'さ행', badgeChar: 'さ', rowId: 'row_sa', script: 'hiragana',
    description: 'さ・し・す・せ・そ! き와 헷갈리는 さ도 완벽하게 구별해요.',
    rewardCardId: 'card_sushi', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_ta', order: 4, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'た행', badgeChar: 'た', rowId: 'row_ta', script: 'hiragana',
    description: 'た・ち・つ・て・と를 배우고 작은 つ(촉음)의 감각도 맛봐요.',
    rewardCardId: 'card_takoyaki', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_na', order: 5, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'な행', badgeChar: 'な', rowId: 'row_na', script: 'hiragana',
    description: 'な・に・ぬ・ね・の! 고양이(ねこ)와 일본(にほん)을 읽을 수 있어요.',
    rewardCardId: 'card_manekineko', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_ha', order: 6, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'は행', badgeChar: 'は', rowId: 'row_ha', script: 'hiragana',
    description: 'は・ひ・ふ・へ・ほ! 후지산(ふじさん)과 꽃(はな)을 읽어요.',
    rewardCardId: 'card_fujisan', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_ma', order: 7, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'ま행', badgeChar: 'ま', rowId: 'row_ma', script: 'hiragana',
    description: 'ま・み・む・め・も! ぬ와 닮은 め를 확실히 구분해요.',
    rewardCardId: 'card_matsuri', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_ya', order: 8, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'や행', badgeChar: 'や', rowId: 'row_ya', script: 'hiragana',
    description: 'や・ゆ・よ 3글자와 요음의 바탕이 되는 소리를 배워요.',
    rewardCardId: 'card_yukata', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_ra', order: 9, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'ら행', badgeChar: 'ら', rowId: 'row_ra', script: 'hiragana',
    description: 'ら・り・る・れ・ろ! 헷갈리는 る와 ろ를 집중 정복해요.',
    rewardCardId: 'card_shinkansen', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_wa', order: 10, world: 'STAGE0', worldLabel: '0단계 히라가나 월드',
    title: 'わ행·ん', badgeChar: 'わ', rowId: 'row_wa', script: 'hiragana',
    description: 'わ・を・ん까지 배우면 히라가나 46자 청음 대장정 완성!',
    rewardCardId: 'card_torii', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_h_dakuon', order: 11, world: 'STAGE0', worldLabel: '0단계 가나 심화',
    title: '탁음·반탁음·요음', badgeChar: 'が', rowId: 'row_dakuon', script: 'hiragana',
    description: '점 두 개(゛)와 동그라미(゜), 작은 ゃゅょ까지 히라가나 100% 완성!',
    rewardCardId: 'card_konbini', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_katakana', order: 12, world: 'STAGE0', worldLabel: '0단계 가타카나 월드',
    title: '가타카나', badgeChar: 'ア', rowId: 'k_row_a', script: 'katakana',
    description: '외래어·음식 메뉴판을 읽는 가타카나! シ/ツ와 ソ/ン도 정복해요.',
    rewardCardId: 'card_vending', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_basics', order: 13, world: 'STAGE0', worldLabel: '0단계 기초 입문',
    title: '인사말·숫자·기초', badgeChar: 'あい',
    description: 'おはよう, ありがとう, 1~10 숫자 등 일본 생활 필수 인사 표현!',
    rewardCardId: 'card_onsen', phase1Ready: true, quizPassPercent: 80
  },
  {
    id: 'stage_n5', order: 14, world: 'N5', worldLabel: 'N5 월드',
    title: 'N5 월드', badgeChar: 'N5',
    description: '기초 한자 100자, 어휘 800개, 동사 활용과 기본 문형을 시작해요.',
    rewardCardId: 'card_kotatsu', phase1Ready: false, quizPassPercent: 80
  },
  {
    id: 'stage_n4', order: 15, world: 'N4', worldLabel: 'N4 월드',
    title: 'N4 월드', badgeChar: 'N4',
    description: '일상 회화의 핵심! 수동·사역·경어 기초와 중급 연결 문법.',
    rewardCardId: 'card_karaoke', phase1Ready: false, quizPassPercent: 80
  },
  {
    id: 'stage_n3', order: 16, world: 'N3', worldLabel: 'N3 월드',
    title: 'N3 월드', badgeChar: 'N3',
    description: '일상에서 자연스러운 일본어! 뉴스·에세이 독해와 한자 650자.',
    rewardCardId: 'card_anime', phase1Ready: false, quizPassPercent: 80
  },
  {
    id: 'stage_n2', order: 17, world: 'N2', worldLabel: 'N2 월드',
    title: 'N2 월드', badgeChar: 'N2',
    description: '비즈니스·신문·논설문 독해와 폭넓은 청해 실력을 쌓아요.',
    rewardCardId: 'card_graduation', phase1Ready: false, quizPassPercent: 80
  },
  {
    id: 'stage_n1', order: 18, world: 'N1', worldLabel: 'N1 월드',
    title: 'N1 월드 (최종 관문)', badgeChar: 'N1',
    description: 'JLPT 최고봉 N1 합격! 추상적 논리 글과 고급 한자 2,000자 마스터.',
    rewardCardId: 'card_cherry_crown', phase1Ready: false, quizPassPercent: 80
  }
];

export const LEVEL_EXAM_INFO: Record<JlptLevel, LevelExamInfo> = {
  STAGE0: {
    level: 'STAGE0',
    title: '0단계 · 가나 & 기초 입문',
    subtitle: '히라가나 · 가타카나 · 기초 인사말',
    totalMinutes: 0,
    sections: [
      { name: '히라가나 청음·탁음·요음', minutes: 15, maxScore: 100, minPassScore: 80 },
      { name: '가타카나 46자 & 외래어', minutes: 15, maxScore: 100, minPassScore: 80 }
    ],
    passScore: 80,
    maxScore: 100,
    targetVocabCount: 120,
    targetKanjiCount: 0,
    subLevels: [
      { sub: 1, label: '1. 기초 다지기', focus: 'あ~は행 글자 모양과 발음' },
      { sub: 2, label: '2. 핵심 완성', focus: 'ま~わ행, 탁음·반탁음·요음 완성' },
      { sub: 3, label: '3. 실전 심화', focus: '가타카나·헷갈리는 글자·기초 인사' }
    ]
  },
  N5: {
    level: 'N5',
    title: 'JLPT N5 · 입문 합격 목표',
    subtitle: '기본적인 일본어를 어느 정도 이해할 수 있는 수준',
    totalMinutes: 90,
    sections: [
      { name: '언어지식(문자·어휘)', minutes: 20, maxScore: 60, minPassScore: 19 },
      { name: '언어지식(문법)·독해', minutes: 40, maxScore: 60, minPassScore: 19 },
      { name: '청해', minutes: 30, maxScore: 60, minPassScore: 19 }
    ],
    passScore: 80,
    maxScore: 180,
    targetVocabCount: 800,
    targetKanjiCount: 100,
    subLevels: [
      { sub: 1, label: '1. 기초 다지기', focus: '기초 명사·형용사·ます형 문장' },
      { sub: 2, label: '2. 핵심 완성', focus: '동사 1·2·3류 활용과 기본 조사' },
      { sub: 3, label: '3. 실전 심화', focus: '짧은 안내문 독해·기초 청해·모의고사' }
    ]
  },
  N4: {
    level: 'N4',
    title: 'JLPT N4 · 초중급 합격 목표',
    subtitle: '기본적인 일본어를 이해할 수 있는 수준',
    totalMinutes: 115,
    sections: [
      { name: '언어지식(문자·어휘)', minutes: 25, maxScore: 60, minPassScore: 19 },
      { name: '언어지식(문법)·독해', minutes: 55, maxScore: 60, minPassScore: 19 },
      { name: '청해', minutes: 35, maxScore: 60, minPassScore: 19 }
    ],
    passScore: 90,
    maxScore: 180,
    targetVocabCount: 1500,
    targetKanjiCount: 300,
    subLevels: [
      { sub: 1, label: '1. 기초 다지기', focus: '보통형·て형 응용·일상 회화 어휘' },
      { sub: 2, label: '2. 핵심 완성', focus: '수수표현·가능·의지·조건문' },
      { sub: 3, label: '3. 실전 심화', focus: '수동/사역·중문 독해·청해 실전' }
    ]
  },
  N3: {
    level: 'N3',
    title: 'JLPT N3 · 중급 합격 목표',
    subtitle: '일상적인 장면의 일본어를 어느 정도 이해하는 수준',
    totalMinutes: 140,
    sections: [
      { name: '언어지식(문자·어휘)', minutes: 30, maxScore: 60, minPassScore: 19 },
      { name: '언어지식(문법)·독해', minutes: 70, maxScore: 60, minPassScore: 19 },
      { name: '청해', minutes: 40, maxScore: 60, minPassScore: 19 }
    ],
    passScore: 95,
    maxScore: 180,
    targetVocabCount: 3750,
    targetKanjiCount: 650,
    subLevels: [
      { sub: 1, label: '1. 기초 다지기', focus: '한자어 확장·중급 접속사' },
      { sub: 2, label: '2. 핵심 완성', focus: '경어·추측·양태·복문 문형' },
      { sub: 3, label: '3. 실전 심화', focus: '기사·실용문 독해·자연 속도 청해' }
    ]
  },
  N2: {
    level: 'N2',
    title: 'JLPT N2 · 중상급 합격 목표',
    subtitle: '일상 및 폭넓은 장면의 일본어를 이해하는 수준',
    totalMinutes: 155,
    sections: [
      { name: '언어지식(문자·어휘·문법)·독해', minutes: 105, maxScore: 120, minPassScore: 38 },
      { name: '청해', minutes: 50, maxScore: 60, minPassScore: 19 }
    ],
    passScore: 90,
    maxScore: 180,
    targetVocabCount: 6000,
    targetKanjiCount: 1000,
    subLevels: [
      { sub: 1, label: '1. 기초 다지기', focus: '복합동사·고유 부사·비즈니스 어휘' },
      { sub: 2, label: '2. 핵심 완성', focus: 'N2 문어체 접속과 유사 문형 구별' },
      { sub: 3, label: '3. 실전 심화', focus: '장문 논설·비교 독해·속도 배분' }
    ]
  },
  N1: {
    level: 'N1',
    title: 'JLPT N1 · 최종 마스터 합격 목표',
    subtitle: '폭넓은 장면의 논리적이고 추상적인 일본어까지 완벽 이해',
    totalMinutes: 170,
    sections: [
      { name: '언어지식(문자·어휘·문법)·독해', minutes: 110, maxScore: 120, minPassScore: 38 },
      { name: '청해', minutes: 60, maxScore: 60, minPassScore: 19 }
    ],
    passScore: 100,
    maxScore: 180,
    targetVocabCount: 10000,
    targetKanjiCount: 2000,
    subLevels: [
      { sub: 1, label: '1. 기초 다지기', focus: '한자 숙어·관용구·고급 부사' },
      { sub: 2, label: '2. 핵심 완성', focus: '격식체·고전 잔재 문법·뉘앙스 비교' },
      { sub: 3, label: '3. 실전 심화', focus: '철학/비평 장문 독해·즉시 응답 청해' }
    ]
  }
};

// 5 levels x 4 weeks x 3 tasks = 20 weeks / 60 tasks blueprint
export const FOUR_WEEK_PLANS: FourWeekPlan[] = [
  {
    level: 'N5',
    weeks: [
      { week: 1, title: '문자·어휘 기초 총정리', tip: '음독/훈독이 헷갈리는 기초 한자 100자를 카드로 매일 25자씩 훑어요.', tasks: ['N5 필수 한자 100자 1회독', '명사·형용사 200개 플래시카드 복습', '혼동하기 쉬운 장음/촉음 받아쓰기'] },
      { week: 2, title: '동사 활용 & 기본 문법 완성', tip: 'ます형↔て형↔ない형 변환을 3초 안에 말할 수 있게 연습해요.', tasks: ['1·2·3류 동사 활용 9종 테스트', '조사(は/が/に/で/を) 오답 정리', '기초 문법 비교 노트 전체 확인'] },
      { week: 3, title: '독해·청해 감각 끌어올리기', tip: '청해는 대본을 보지 않고 먼저 듣고 키워드를 메모하는 습관이 중요해요.', tasks: ['단문/안내문 독해 6지문 풀기', '청해 0.95배속 → 1.0배속 집중 훈련', '망각 곡선 복습함 잔여 0개 만들기'] },
      { week: 4, title: '실전 모의고사 & 약점 보완', tip: '시험 전날에는 새 문제보다 오답노트만 가볍게 보고 푹 자요.', tasks: ['실전 시간표 맞춰 미니/정식 모의고사 2회', '오답노트 틀린 문제 100% 재풀이', '시험장 OMR 마킹 연습 및 컨디션 조절'] }
    ]
  },
  {
    level: 'N4',
    weeks: [
      { week: 1, title: 'N4 한자 300자 & 자동/타동사', tip: '열리다(あく) vs 열다(あける)처럼 짝이 있는 동사를 묶어 외우세요.', tasks: ['N4 추가 한자 200자 쓰기 및 퀴즈', '자동사·타동사 짝 30쌍 정리', '부사·접속사 핵심 어휘 점검'] },
      { week: 2, title: '수수표현·수동·사역 정복', tip: '누가 누구에게 주는지 화살표 그림을 그리면 절대 안 헷갈려요.', tasks: ['あげる/くれる/もらう 문장 전환 연습', '수동태·사역태·사역수동 비교 복습', '겸양어/존경어 기초 동사 표 암기'] },
      { week: 3, title: '중문 독해 & 회화 청해', tip: '독해에서는 접속사(しかし, だから) 앞뒤 문맥을 표시하며 읽으세요.', tasks: ['N4 중문 독해 지문 6편 정독', '청해 과제이해·포인트이해 유형 집중', '헷갈리는 문형 오답 카드 복습'] },
      { week: 4, title: '모의고사 90점+ 안정권 다지기', tip: '문자·어휘 파트를 20분 안에 끝내야 독해 시간이 여유로워요.', tasks: ['N4 모의고사 2회 응시 및 과락 체크', '약점 영역 맞춤 학습지 인쇄 풀이', '최종 오답노트 클리어'] }
    ]
  },
  {
    level: 'N3',
    weeks: [
      { week: 1, title: '한자어 650자 & 파생 어휘', tip: '한국 한자음을 떠올리면 N3 한자 어휘의 60%가 바로 연결돼요!', tasks: ['N3 한자 음독 결합어 150개 마스터', '의성어·의태어 핵심 40개 정리', '다의어 동사(かける, とる) 용법 구분'] },
      { week: 2, title: 'N3 중급 문형 & 뉘앙스 비교', tip: '~うちに vs ~あいだ에 같은 시간 표현 차이를 예문으로 비교하세요.', tasks: ['N3 핵심 문형 60개 복습', '문장 배열(별★) 문제 풀이 전략 연습', '경어 완성 점검 테스트'] },
      { week: 3, title: '실용문·장문 독해 속도 훈련', tip: '질문을 먼저 읽고 본문에서 근거 문장을 찾는 스캐닝 연습을 하세요.', tasks: ['장문·정보검색 독해 시간 재고 풀기', '청해 발화표현·개요이해 집중 훈련', '오답 문형 예문 음성 따라 읽기'] },
      { week: 4, title: '모의고사 95점+ 실전 리허설', tip: '독해 70분 시간 배분(단문15 / 중문25 / 장문20 / 정보10)을 지키세요.', tasks: ['N3 모의고사 풀세트 2회 응시', '영역별 19점 과락 안전선 점검', '시험 전 최종 오답노트 복습'] }
    ]
  },
  {
    level: 'N2',
    weeks: [
      { week: 1, title: 'N2 한자 1,000자 & 복합동사', tip: '~こむ, ~だす, ~なおす 같은 뒷동사 의미를 알면 처음 보는 단어도 유추돼요.', tasks: ['N2 고급 한자어 & 복합동사 80개', '유사어(類義語) 뉘앙스 구별 퀴즈', '신문/칼럼 빈출 부사 복습'] },
      { week: 2, title: '문어체 문법 & 고난도 연결', tip: 'N2는 문법 문제보다 독해 속 문장 구조를 빠르게 파악하는 힘이 핵심이에요.', tasks: ['N2 필수 문법 80개 접속 공식 암기', '경어·문어체 문장 해석 훈련', '빈출 오답 문형 비교 표 정리'] },
      { week: 3, title: '비교 독해 & 논지 파악', tip: 'A와 B 두 글 비교 문제에서는 공통점과 차이점 표를 간단히 메모하세요.', tasks: ['N2 주장 파악·비교 독해 8지문', '청해 통합이해(메모 필수) 연습', '105분 언어지식·독해 페이스 조절'] },
      { week: 4, title: '실전 모의고사 & 시간 단축', tip: '모르는 한 문제에 1분 이상 매달리지 말고 과감히 표시 후 넘기세요.', tasks: ['N2 모의고사 2회 이상 실전 응시', '오답노트 100% 재도전', '약점 단원 인쇄 학습지 마무리'] }
    ]
  },
  {
    level: 'N1',
    weeks: [
      { week: 1, title: 'N1 한자 2,000자 & 추상 어휘', tip: '훈독이 특이한 한자와 4자 숙어·관용구를 매일 20분씩 소리 내어 읽어요.', tasks: ['N1 최고난도 한자·음훈 구별 점검', '문맥 규정 & 용법 구별 60문항', '고급 의태어·관용 표현 정리'] },
      { week: 2, title: 'N1 고급 문법 & 문장 구조 분석', tip: '화자의 태도·아쉬움·단정 같은 감정 뉘앙스를 정확히 구분하세요.', tasks: ['N1 핵심 문형 70개 비교 정리', '부정·이중부정·반어 표현 해석', '문장 배열★ 고난도 30문항 훈련'] },
      { week: 3, title: '철학·비평 장문 독해 & 청해', tip: '필자의 주장이 마지막 문단에만 있지 않고 역접(しかし) 뒤에 숨어있어요.', tasks: ['N1 추상 장문·종합이해 6지문 정독', '청해 즉시응답 & 통합이해 집중 훈련', '약한 어휘·문법 SRS 최종 점검'] },
      { week: 4, title: 'N1 100점+ 최종 합격 마무리', tip: '여기까지 온 중학생 N1 도전자 정말 대단해요! 자신감을 갖고 차분히 풀어요.', tasks: ['N1 모의고사 2회(170분 집중 훈련)', '과거 오답노트 전체 최종 확인', '시험 당일 타임테이블 최종 점검'] }
    ]
  }
];
