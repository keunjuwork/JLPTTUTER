import { KanaItem } from '../types';

export const HIRAGANA_BASIC: KanaItem[] = [
  // あ행
  {
    id: 'h_a', char: 'あ', counterpart: 'ア', script: 'hiragana', category: 'seion',
    rowId: 'row_a', rowLabel: 'あ행', colIndex: 0, ko: '아', romaji: 'a',
    exampleWord: 'あめ', exampleReading: '아메', exampleMeaning: '비 / 사탕',
    mnemonicTip: '사과(Apple)에 칼이 꽂혀 동그랗게 말린 모양 → "아!"',
    strokeCount: 3, strokeHint: '가로 → 세로 곡선 → 크게 감아 돌리기'
  },
  {
    id: 'h_i', char: 'い', counterpart: 'イ', script: 'hiragana', category: 'seion',
    rowId: 'row_a', rowLabel: 'あ행', colIndex: 1, ko: '이', romaji: 'i',
    exampleWord: 'いぬ', exampleReading: '이누', exampleMeaning: '강아지',
    mnemonicTip: '나란히 서 있는 두 사람 모양 → "이~" 하고 웃는 모습',
    strokeCount: 2, strokeHint: '왼쪽 획 살짝 꺾어 올리기 → 오른쪽 짧은 획'
  },
  {
    id: 'h_u', char: 'う', counterpart: 'ウ', script: 'hiragana', category: 'seion',
    rowId: 'row_a', rowLabel: 'あ행', colIndex: 2, ko: '우', romaji: 'u',
    exampleWord: 'うみ', exampleReading: '우미', exampleMeaning: '바다',
    mnemonicTip: '모자를 쓰고 구부린 사람 옆모습 → "우~"',
    strokeCount: 2, strokeHint: '위 짧은 점 → 둥글게 꺾어 아래로'
  },
  {
    id: 'h_e', char: 'え', counterpart: 'エ', script: 'hiragana', category: 'seion',
    rowId: 'row_a', rowLabel: 'あ행', colIndex: 3, ko: '에', romaji: 'e',
    exampleWord: 'えき', exampleReading: '에키', exampleMeaning: '기차역',
    mnemonicTip: '기차역 계단을 오르내리는 모습 → "에키(역)!"',
    strokeCount: 2, strokeHint: '위 점 → Z자처럼 내려오다 마지막 꼬리 올리기'
  },
  {
    id: 'h_o', char: 'お', counterpart: 'オ', script: 'hiragana', category: 'seion',
    rowId: 'row_a', rowLabel: 'あ행', colIndex: 4, ko: '오', romaji: 'o',
    exampleWord: 'おちゃ', exampleReading: '오차', exampleMeaning: '녹차',
    mnemonicTip: '골프공을 쳐서 공(오른쪽 점)이 날아가는 모습 → "오~!"',
    strokeCount: 3, strokeHint: '가로 → 내려와 둥글게 감기 → 오른쪽 위 점'
  },

  // か행
  {
    id: 'h_ka', char: 'か', counterpart: 'カ', script: 'hiragana', category: 'seion',
    rowId: 'row_ka', rowLabel: 'か행', colIndex: 0, ko: '카', romaji: 'ka',
    exampleWord: 'かさ', exampleReading: '카사', exampleMeaning: '우산',
    mnemonicTip: '力(힘 력) 옆에 칼날 점 하나! → "카!"',
    strokeCount: 3, strokeHint: 'ㄱ자로 꺾어 갈고리 → 비스듬히 내리기 → 오른쪽 점'
  },
  {
    id: 'h_ki', char: 'き', counterpart: 'キ', script: 'hiragana', category: 'seion',
    rowId: 'row_ka', rowLabel: 'か행', colIndex: 1, ko: '키', romaji: 'ki',
    exampleWord: 'きって', exampleReading: '킷테', exampleMeaning: '우표',
    mnemonicTip: '열쇠(Key) 손잡이와 두 개의 톱니 모양 → "키"',
    strokeCount: 4, strokeHint: '가로 두 줄 → 사선 내리기 → 아래쪽 둥근 받침'
  },
  {
    id: 'h_ku', char: 'く', counterpart: 'ク', script: 'hiragana', category: 'seion',
    rowId: 'row_ka', rowLabel: 'か행', colIndex: 2, ko: '쿠', romaji: 'ku',
    exampleWord: 'くつ', exampleReading: '쿠츠', exampleMeaning: '구두/신발',
    mnemonicTip: '뻐꾸기(쿠쿠!) 부리처럼 왼쪽으로 뾰족하게 한 획!',
    strokeCount: 1, strokeHint: '한 번에 왼쪽 중간으로 꺾어 내리기'
  },
  {
    id: 'h_ke', char: 'け', counterpart: 'ケ', script: 'hiragana', category: 'seion',
    rowId: 'row_ka', rowLabel: 'か행', colIndex: 3, ko: '케', romaji: 'ke',
    exampleWord: 'けしごむ', exampleReading: '케시고무', exampleMeaning: '지우개',
    mnemonicTip: '술통(Keg)을 세워 놓은 모양 → "케"',
    strokeCount: 3, strokeHint: '왼쪽 세로 살짝 꺾어 올림 → 가로 → 오른쪽 세로 곡선'
  },
  {
    id: 'h_ko', char: 'こ', counterpart: 'コ', script: 'hiragana', category: 'seion',
    rowId: 'row_ka', rowLabel: 'か행', colIndex: 4, ko: '코', romaji: 'ko',
    exampleWord: 'こども', exampleReading: '코도모', exampleMeaning: '어린이',
    mnemonicTip: '동전(Coin) 두 개를 위아래로 나란히 둔 모습 → "코"',
    strokeCount: 2, strokeHint: '위쪽 짧은 가로 곡선 → 아래쪽 둥근 가로선'
  },

  // さ행
  {
    id: 'h_sa', char: 'さ', counterpart: 'サ', script: 'hiragana', category: 'seion',
    rowId: 'row_sa', rowLabel: 'さ행', colIndex: 0, ko: '사', romaji: 'sa',
    exampleWord: 'さくら', exampleReading: '사쿠라', exampleMeaning: '벚꽃',
    mnemonicTip: 'き(키)에서 가로줄 하나를 뺀 모양! 웃는 입 모양 → "사"',
    strokeCount: 3, strokeHint: '가로 한 줄 → 사선 내리기 → 아래쪽 둥근 받침'
  },
  {
    id: 'h_shi', char: 'し', counterpart: 'シ', script: 'hiragana', category: 'seion',
    rowId: 'row_sa', rowLabel: 'さ행', colIndex: 1, ko: '시', romaji: 'shi',
    exampleWord: 'しろ', exampleReading: '시로', exampleMeaning: '하얀색 / 성',
    mnemonicTip: '낚싯바늘(She fishes!) 모양, 한 획으로 부드럽게 휘기 → "시"',
    strokeCount: 1, strokeHint: '위에서 내려와 오른쪽 위로 둥글게 올리기'
  },
  {
    id: 'h_su', char: 'す', counterpart: 'ス', script: 'hiragana', category: 'seion',
    rowId: 'row_sa', rowLabel: 'さ행', colIndex: 2, ko: '스', romaji: 'su',
    exampleWord: 'すし', exampleReading: '스시', exampleMeaning: '초밥',
    mnemonicTip: '그네가 한 바퀴 돌고 내려오는(Swing) 모습 → "스"',
    strokeCount: 2, strokeHint: '가로선 → 내려오다 작은 고리를 만들고 아래로'
  },
  {
    id: 'h_se', char: 'せ', counterpart: 'セ', script: 'hiragana', category: 'seion',
    rowId: 'row_sa', rowLabel: 'さ행', colIndex: 3, ko: '세', romaji: 'se',
    exampleWord: 'せんせい', exampleReading: '센세이', exampleMeaning: '선생님',
    mnemonicTip: '세상 세(世) 자에서 나온 글자! "세"',
    strokeCount: 3, strokeHint: '가로선 → 오른쪽 짧은 세로 → 왼쪽 세로 후 바닥 꺾기'
  },
  {
    id: 'h_so', char: 'そ', counterpart: 'ソ', script: 'hiragana', category: 'seion',
    rowId: 'row_sa', rowLabel: 'さ행', colIndex: 4, ko: '소', romaji: 'so',
    exampleWord: 'そら', exampleReading: '소라', exampleMeaning: '하늘',
    mnemonicTip: '소바(국수)를 지그재그로 말아 올린 한 획 → "소"',
    strokeCount: 1, strokeHint: 'Z자처럼 꺾어 내려가다 아래를 둥글게 감기'
  },

  // た행
  {
    id: 'h_ta', char: 'た', counterpart: 'タ', script: 'hiragana', category: 'seion',
    rowId: 'row_ta', rowLabel: 'た행', colIndex: 0, ko: '타', romaji: 'ta',
    exampleWord: 'たまご', exampleReading: '타마고', exampleMeaning: '달걀',
    mnemonicTip: '영어 ta 모양과 닮았어요! 왼쪽 십자가 + 오른쪽 こ → "타"',
    strokeCount: 4, strokeHint: '가로 → 사선 → 오른쪽 위/아래 두 짧은 획'
  },
  {
    id: 'h_chi', char: 'ち', counterpart: 'チ', script: 'hiragana', category: 'seion',
    rowId: 'row_ta', rowLabel: 'た행', colIndex: 1, ko: '치', romaji: 'chi',
    exampleWord: 'ちず', exampleReading: '치즈', exampleMeaning: '지도',
    mnemonicTip: '숫자 5처럼 생겼어요! 5천 원짜리 치즈 → "치"',
    strokeCount: 2, strokeHint: '가로 → 내려오다 크게 오른쪽으로 둥근 곡선'
  },
  {
    id: 'h_tsu', char: 'つ', counterpart: 'ツ', script: 'hiragana', category: 'seion',
    rowId: 'row_ta', rowLabel: 'た행', colIndex: 2, ko: '츠', romaji: 'tsu',
    exampleWord: 'つき', exampleReading: '츠키', exampleMeaning: '달',
    mnemonicTip: '파도(Tsunami)가 밀려오는 둥근 모양 한 획 → "츠"',
    strokeCount: 1, strokeHint: '왼쪽에서 오른쪽으로 크게 둥글려 안으로 감기'
  },
  {
    id: 'h_te', char: 'て', counterpart: 'テ', script: 'hiragana', category: 'seion',
    rowId: 'row_ta', rowLabel: 'た행', colIndex: 3, ko: '테', romaji: 'te',
    exampleWord: 'てがみ', exampleReading: '테가미', exampleMeaning: '편지',
    mnemonicTip: '테이블(Table) 모서리 아래로 손잡이가 매달린 모습 → "테"',
    strokeCount: 1, strokeHint: '가로선 후 아래로 C자처럼 둥글게 감기'
  },
  {
    id: 'h_to', char: 'と', counterpart: 'ト', script: 'hiragana', category: 'seion',
    rowId: 'row_ta', rowLabel: 'た행', colIndex: 4, ko: '토', romaji: 'to',
    exampleWord: 'とけい', exampleReading: '토케이', exampleMeaning: '시계',
    mnemonicTip: '발가락(Toe)에 가시가 박힌 모양 → "토"',
    strokeCount: 2, strokeHint: '사선 짧은 획 → 오른쪽에서 둥글게 내려와 받치기'
  },

  // な행
  {
    id: 'h_na', char: 'な', counterpart: 'ナ', script: 'hiragana', category: 'seion',
    rowId: 'row_na', rowLabel: 'な행', colIndex: 0, ko: '나', romaji: 'na',
    exampleWord: 'なつ', exampleReading: '나츠', exampleMeaning: '여름',
    mnemonicTip: '매듭(Knot)을 지은 리본 모양 → "나"',
    strokeCount: 4, strokeHint: '가로 → 사선 → 오른쪽 점 → 내려와 고리 맺기'
  },
  {
    id: 'h_ni', char: 'に', counterpart: 'ニ', script: 'hiragana', category: 'seion',
    rowId: 'row_na', rowLabel: 'な행', colIndex: 1, ko: '니', romaji: 'ni',
    exampleWord: 'にほん', exampleReading: '니혼', exampleMeaning: '일본',
    mnemonicTip: '무릎(Knee) 옆에 뼈 두 개(こ)가 붙은 모양 → "니"',
    strokeCount: 3, strokeHint: '왼쪽 세로선 → 오른쪽 위/아래 두 줄'
  },
  {
    id: 'h_nu', char: 'ぬ', counterpart: 'ヌ', script: 'hiragana', category: 'seion',
    rowId: 'row_na', rowLabel: 'な행', colIndex: 2, ko: '누', romaji: 'nu',
    exampleWord: 'ぬいぐるみ', exampleReading: '누이구루미', exampleMeaning: '봉제인형',
    mnemonicTip: 'め(메) 끝에 작은 돼지꼬리 루프가 하나 더 붙은 국수(Noodles) → "누"',
    strokeCount: 2, strokeHint: '내려오는 선 → 교차해 올라가 크게 돌고 마지막 작은 고리'
  },
  {
    id: 'h_ne', char: 'ね', counterpart: 'ネ', script: 'hiragana', category: 'seion',
    rowId: 'row_na', rowLabel: 'な행', colIndex: 3, ko: '네', romaji: 'ne',
    exampleWord: 'ねこ', exampleReading: '네코', exampleMeaning: '고양이',
    mnemonicTip: '고양이(네코)가 기둥 옆에 꼬리를 동그랗게 말고 앉아 있어요 → "네"',
    strokeCount: 2, strokeHint: '왼쪽 세로선 → Z자처럼 건너가 아래쪽 고리 맺기'
  },
  {
    id: 'h_no', char: 'の', counterpart: 'ノ', script: 'hiragana', category: 'seion',
    rowId: 'row_na', rowLabel: 'な행', colIndex: 4, ko: '노', romaji: 'no',
    exampleWord: 'のり', exampleReading: '노리', exampleMeaning: '김 / 풀',
    mnemonicTip: '금지 표지판(No!)처럼 한 바퀴 둥글게 → "노"',
    strokeCount: 1, strokeHint: '가운데서 시작해 왼쪽으로 둥글려 크게 한 바퀴'
  },

  // は행
  {
    id: 'h_ha', char: 'は', counterpart: 'ハ', script: 'hiragana', category: 'seion',
    rowId: 'row_ha', rowLabel: 'は행', colIndex: 0, ko: '하', romaji: 'ha',
    exampleWord: 'はな', exampleReading: '하나', exampleMeaning: '꽃 / 코',
    mnemonicTip: '한글 "하"처럼 웃는 입에 작은 매듭 하나! → "하"',
    strokeCount: 3, strokeHint: '왼쪽 세로 → 가로선 → 내려와 매듭짓기'
  },
  {
    id: 'h_hi', char: 'ひ', counterpart: 'ヒ', script: 'hiragana', category: 'seion',
    rowId: 'row_ha', rowLabel: 'は행', colIndex: 1, ko: '히', romaji: 'hi',
    exampleWord: 'ひこうき', exampleReading: '히코우키', exampleMeaning: '비행기',
    mnemonicTip: '씩 웃는 입 모양(히히히!) 한 획 → "히"',
    strokeCount: 1, strokeHint: '가로로 살짝 가다 크게 U자로 돌고 오른쪽으로 내리기'
  },
  {
    id: 'h_fu', char: 'ふ', counterpart: 'フ', script: 'hiragana', category: 'seion',
    rowId: 'row_ha', rowLabel: 'は행', colIndex: 2, ko: '후', romaji: 'fu',
    exampleWord: 'ふじさん', exampleReading: '후지산', exampleMeaning: '후지산',
    mnemonicTip: '후지산 정상과 양옆 구름 모양 → "후"',
    strokeCount: 4, strokeHint: '위 점 → 굽은 산등성이 → 왼쪽 점 → 오른쪽 점'
  },
  {
    id: 'h_he', char: 'へ', counterpart: 'ヘ', script: 'hiragana', category: 'seion',
    rowId: 'row_ha', rowLabel: 'は행', colIndex: 3, ko: '헤', romaji: 'he',
    exampleWord: 'へや', exampleReading: '헤야', exampleMeaning: '방',
    mnemonicTip: '작은 산봉우리 모양! 히라가나와 가타카나가 똑같아요 → "헤"',
    strokeCount: 1, strokeHint: '왼쪽 아래서 위로 올라갔다가 길게 오른쪽 아래로'
  },
  {
    id: 'h_ho', char: 'ほ', counterpart: 'ホ', script: 'hiragana', category: 'seion',
    rowId: 'row_ha', rowLabel: 'は행', colIndex: 4, ko: '호', romaji: 'ho',
    exampleWord: 'ほし', exampleReading: '호시', exampleMeaning: '별',
    mnemonicTip: 'は(하) 위에 지붕 가로줄이 하나 더! 삐져나오지 않게 주의 → "호"',
    strokeCount: 4, strokeHint: '왼쪽 세로 → 위 가로 → 아래 가로 → 내려와 매듭짓기'
  },

  // ま행
  {
    id: 'h_ma', char: 'ま', counterpart: 'マ', script: 'hiragana', category: 'seion',
    rowId: 'row_ma', rowLabel: 'ま행', colIndex: 0, ko: '마', romaji: 'ma',
    exampleWord: 'まくら', exampleReading: '마쿠라', exampleMeaning: '베개',
    mnemonicTip: '엄마(Mama)가 팔 두 개로 안아 매듭짓는 모습 → "마"',
    strokeCount: 3, strokeHint: '가로 두 줄 → 세로로 내려와 아래 고리 맺기'
  },
  {
    id: 'h_mi', char: 'み', counterpart: 'ミ', script: 'hiragana', category: 'seion',
    rowId: 'row_ma', rowLabel: 'ま행', colIndex: 1, ko: '미', romaji: 'mi',
    exampleWord: 'みず', exampleReading: '미즈', exampleMeaning: '물',
    mnemonicTip: '21살(스물하나)을 한 번에 쓴 모양 → "미"',
    strokeCount: 2, strokeHint: '2처럼 쓰고 둥글게 돌아 꼬리 빼기 → 오른쪽 사선'
  },
  {
    id: 'h_mu', char: 'む', counterpart: 'ム', script: 'hiragana', category: 'seion',
    rowId: 'row_ma', rowLabel: 'ま행', colIndex: 2, ko: '무', romaji: 'mu',
    exampleWord: 'むし', exampleReading: '무시', exampleMeaning: '곤충/벌레',
    mnemonicTip: '소(음메~ 무~) 얼굴에 뿔 점 하나 → "무"',
    strokeCount: 3, strokeHint: '가로 → 내려와 둥글게 감고 오른쪽 위로 → 위 점'
  },
  {
    id: 'h_me', char: 'め', counterpart: 'メ', script: 'hiragana', category: 'seion',
    rowId: 'row_ma', rowLabel: 'ま행', colIndex: 3, ko: '메', romaji: 'me',
    exampleWord: 'めがね', exampleReading: '메가네', exampleMeaning: '안경',
    mnemonicTip: 'ぬ(누)에서 꼬리 고리를 뺀 깔끔한 안경알 모양 → "메"',
    strokeCount: 2, strokeHint: '내려오는 선 → 교차해서 크게 한 바퀴 둥글게 끝내기'
  },
  {
    id: 'h_mo', char: 'も', counterpart: 'モ', script: 'hiragana', category: 'seion',
    rowId: 'row_ma', rowLabel: 'ま행', colIndex: 4, ko: '모', romaji: 'mo',
    exampleWord: 'もも', exampleReading: '모모', exampleMeaning: '복숭아',
    mnemonicTip: 'し(시) 낚싯바늘에 미끼 두 줄이 걸린 모습(More!) → "모"',
    strokeCount: 3, strokeHint: '세로 곡선 먼저 쓰기 → 가로 줄 위, 아래 두 번'
  },

  // や행
  {
    id: 'h_ya', char: 'や', counterpart: 'ヤ', script: 'hiragana', category: 'seion',
    rowId: 'row_ya', rowLabel: 'や행', colIndex: 0, ko: '야', romaji: 'ya',
    exampleWord: 'やま', exampleReading: '야마', exampleMeaning: '산',
    mnemonicTip: '야호! 산에 올라 깃발을 꽂은 모양 → "야"',
    strokeCount: 3, strokeHint: '둥글게 넘기기 → 짧은 점 → 길게 세로 사선'
  },
  {
    id: 'h_yu', char: 'ゆ', counterpart: 'ユ', script: 'hiragana', category: 'seion',
    rowId: 'row_ya', rowLabel: 'や행', colIndex: 2, ko: '유', romaji: 'yu',
    exampleWord: 'ゆき', exampleReading: '유키', exampleMeaning: '눈(설)',
    mnemonicTip: '열대어 물고기 한 마리가 헤엄치는 모양 → "유"',
    strokeCount: 2, strokeHint: '세로로 내려와 크게 반원 그리기 → 가운데 꿰뚫는 사선'
  },
  {
    id: 'h_yo', char: 'よ', counterpart: 'ヨ', script: 'hiragana', category: 'seion',
    rowId: 'row_ya', rowLabel: 'や행', colIndex: 4, ko: '요', romaji: 'yo',
    exampleWord: 'よる', exampleReading: '요루', exampleMeaning: '밤',
    mnemonicTip: '요요(Yo-yo) 실을 손가락에 걸어 내린 모양 → "요"',
    strokeCount: 2, strokeHint: '오른쪽 짧은 가로 → 세로로 내려와 고리 맺기'
  },

  // ら행
  {
    id: 'h_ra', char: 'ら', counterpart: 'ラ', script: 'hiragana', category: 'seion',
    rowId: 'row_ra', rowLabel: 'ら행', colIndex: 0, ko: '라', romaji: 'ra',
    exampleWord: 'らいおん', exampleReading: '라이온', exampleMeaning: '사자',
    mnemonicTip: '숫자 5가 비스듬히 점 찍은 모양! 라디오 안테나 → "라"',
    strokeCount: 2, strokeHint: '위 짧은 점 → 내려와 둥글게 크게 말아주기'
  },
  {
    id: 'h_ri', char: 'り', counterpart: 'リ', script: 'hiragana', category: 'seion',
    rowId: 'row_ra', rowLabel: 'ら행', colIndex: 1, ko: '리', romaji: 'ri',
    exampleWord: 'りんご', exampleReading: '린고', exampleMeaning: '사과',
    mnemonicTip: '리본(Ribbon) 두 줄이 나란히 서 있는 모습 → "리"',
    strokeCount: 2, strokeHint: '왼쪽 살짝 꺾어 올림 → 오른쪽 더 길게 내려 안쪽으로'
  },
  {
    id: 'h_ru', char: 'る', counterpart: 'ル', script: 'hiragana', category: 'seion',
    rowId: 'row_ra', rowLabel: 'ら행', colIndex: 2, ko: '루', romaji: 'ru',
    exampleWord: 'るすばん', exampleReading: '루스반', exampleMeaning: '집 보기',
    mnemonicTip: '숫자 3 끝에 동그란 루프(Loop)가 있어요 → "루"',
    strokeCount: 1, strokeHint: '가로→사선→크게 돌고 끝에서 작은 고리 감기'
  },
  {
    id: 'h_re', char: 'れ', counterpart: 'レ', script: 'hiragana', category: 'seion',
    rowId: 'row_ra', rowLabel: 'ら행', colIndex: 3, ko: '레', romaji: 're',
    exampleWord: 'れもん', exampleReading: '레몬', exampleMeaning: '레몬',
    mnemonicTip: '기둥 옆에서 뒤로 훌쩍 뻗은 발 모양 → "레"',
    strokeCount: 2, strokeHint: '왼쪽 세로선 → Z자 건너와 위로 올라갔다가 바깥쪽으로 꺾기'
  },
  {
    id: 'h_ro', char: 'ろ', counterpart: 'ロ', script: 'hiragana', category: 'seion',
    rowId: 'row_ra', rowLabel: 'ら행', colIndex: 4, ko: '로', romaji: 'ro',
    exampleWord: 'ろく', exampleReading: '로쿠', exampleMeaning: '숫자 6',
    mnemonicTip: 'る(루)에서 끝의 동그라미를 뺀 깔끔한 숫자 3 모양 → "로"',
    strokeCount: 1, strokeHint: '가로→사선→크게 둥글려 열려있게 끝내기'
  },

  // わ행 + ん
  {
    id: 'h_wa', char: 'わ', counterpart: 'ワ', script: 'hiragana', category: 'seion',
    rowId: 'row_wa', rowLabel: 'わ행', colIndex: 0, ko: '와', romaji: 'wa',
    exampleWord: 'わたし', exampleReading: '와타시', exampleMeaning: '나 / 저',
    mnemonicTip: '기둥 옆으로 둥근 물결(Wave)이 퍼져 나가는 모양 → "와"',
    strokeCount: 2, strokeHint: '왼쪽 세로선 → Z자 건너와 크게 반원 그리기'
  },
  {
    id: 'h_wo', char: 'を', counterpart: 'ヲ', script: 'hiragana', category: 'seion',
    rowId: 'row_wa', rowLabel: 'わ행', colIndex: 4, ko: '오(워)', romaji: 'wo',
    exampleWord: 'みずをのむ', exampleReading: '미즈오 노무', exampleMeaning: '물을 마시다',
    mnemonicTip: '목적격 조사(~을/를)로만 쓰이는 특별한 글자! → "오"',
    strokeCount: 3, strokeHint: '가로 → 꺾어 내려와 돌리기 → C자 모양 걸치기'
  },
  {
    id: 'h_n', char: 'ん', counterpart: 'ン', script: 'hiragana', category: 'seion',
    rowId: 'row_wa', rowLabel: 'わ행', colIndex: 3, ko: '응/ㄴ받침', romaji: 'n',
    exampleWord: 'ほん', exampleReading: '혼', exampleMeaning: '책',
    mnemonicTip: '영어 소문자 n처럼 생겼어요! 한 획으로 쓱 → "응"',
    strokeCount: 1, strokeHint: '위에서 사선으로 내렸다가 올라와 둥글게 빼기'
  }
];

export const KATAKANA_BASIC: KanaItem[] = [
  // ア행
  { id: 'k_a', char: 'ア', counterpart: 'あ', script: 'katakana', category: 'seion', rowId: 'k_row_a', rowLabel: 'ア행', colIndex: 0, ko: '아', romaji: 'a', exampleWord: 'アイス', exampleReading: '아이스', exampleMeaning: '아이스크림', mnemonicTip: '도끼(Axe) 날처럼 각지게 꺾인 모양 → "아"', strokeCount: 2, strokeHint: '가로 후 꺾어 내림 → 아래 왼쪽 사선' },
  { id: 'k_i', char: 'イ', counterpart: 'い', script: 'katakana', category: 'seion', rowId: 'k_row_a', rowLabel: 'ア행', colIndex: 1, ko: '이', romaji: 'i', exampleWord: 'インコ', exampleReading: '잉코', exampleMeaning: '잉꼬(앵무새)', mnemonicTip: '한자 사람 인(亻) 변 모양 → "이"', strokeCount: 2, strokeHint: '비스듬히 왼쪽 내리기 → 가운데 세로선' },
  { id: 'k_u', char: 'ウ', counterpart: 'う', script: 'katakana', category: 'seion', rowId: 'k_row_a', rowLabel: 'ア행', colIndex: 2, ko: '우', romaji: 'u', exampleWord: 'ウール', exampleReading: '우루', exampleMeaning: '양모(울)', mnemonicTip: '히라가나 う에 각진 지붕이 생긴 모양 → "우"', strokeCount: 3, strokeHint: '위 점 → 왼쪽 짧은 세로 → 가로 꺾어 사선' },
  { id: 'k_e', char: 'エ', counterpart: 'え', script: 'katakana', category: 'seion', rowId: 'k_row_a', rowLabel: 'ア행', colIndex: 3, ko: '에', romaji: 'e', exampleWord: 'エレベーター', exampleReading: '에레베타', exampleMeaning: '엘리베이터', mnemonicTip: '영어 대문자 I / 장인 공(工) 모양 → "에"', strokeCount: 3, strokeHint: '위 가로 → 가운데 세로 → 아래 긴 가로' },
  { id: 'k_o', char: 'オ', counterpart: 'お', script: 'katakana', category: 'seion', rowId: 'k_row_a', rowLabel: 'ア행', colIndex: 4, ko: '오', romaji: 'o', exampleWord: 'オレンジ', exampleReading: '오렌지', exampleMeaning: '오렌지', mnemonicTip: '오페라 가수가 한 손을 뻗은 모습 → "오"', strokeCount: 3, strokeHint: '가로 → 세로 내려 갈고리 → 왼쪽 아래 사선' },

  // カ행
  { id: 'k_ka', char: 'カ', counterpart: 'か', script: 'katakana', category: 'seion', rowId: 'k_row_ka', rowLabel: 'カ행', colIndex: 0, ko: '카', romaji: 'ka', exampleWord: 'カメラ', exampleReading: '카메라', exampleMeaning: '카메라', mnemonicTip: '히라가나 か에서 오른쪽 점만 쏙 뺀 모양 → "카"', strokeCount: 2, strokeHint: '가로 꺾기 → 관통하는 사선' },
  { id: 'k_ki', char: 'キ', counterpart: 'き', script: 'katakana', category: 'seion', rowId: 'k_row_ka', rowLabel: 'カ행', colIndex: 1, ko: '키', romaji: 'ki', exampleWord: 'キウイ', exampleReading: '키우이', exampleMeaning: '키위', mnemonicTip: '히라가나 き의 윗부분 열쇠 모양 그대로! → "키"', strokeCount: 3, strokeHint: '짧은 가로 → 긴 가로 → 관통하는 사선' },
  { id: 'k_ku', char: 'ク', counterpart: 'く', script: 'katakana', category: 'seion', rowId: 'k_row_ka', rowLabel: 'カ행', colIndex: 2, ko: '쿠', romaji: 'ku', exampleWord: 'クラス', exampleReading: '쿠라스', exampleMeaning: '반(클래스)', mnemonicTip: '숫자 7을 예쁘게 구부린 모양 → "쿠"', strokeCount: 2, strokeHint: '왼쪽 사선 → 가로로 가다 왼쪽 아래로 굽히기' },
  { id: 'k_ke', char: 'ケ', counterpart: 'け', script: 'katakana', category: 'seion', rowId: 'k_row_ka', rowLabel: 'カ행', colIndex: 3, ko: '케', romaji: 'ke', exampleWord: 'ケーキ', exampleReading: '케키', exampleMeaning: '케이크', mnemonicTip: 'ク 위에 가로선이 옆으로 삐죽 나온 모양 → "케"', strokeCount: 3, strokeHint: '왼쪽 사선 → 가로선 → 가운데서 내려오는 사선' },
  { id: 'k_ko', char: 'コ', counterpart: 'こ', script: 'katakana', category: 'seion', rowId: 'k_row_ka', rowLabel: 'カ행', colIndex: 4, ko: '코', romaji: 'ko', exampleWord: 'コーヒー', exampleReading: '코히', exampleMeaning: '커피', mnemonicTip: '한국어 ㄷ이 반대로 열린 코너(Corner) 모양 → "코"', strokeCount: 2, strokeHint: 'ㄱ자로 꺾기 → 아래 가로 닫기' },

  // サ행
  { id: 'k_sa', char: 'サ', counterpart: 'さ', script: 'katakana', category: 'seion', rowId: 'k_row_sa', rowLabel: 'サ행', colIndex: 0, ko: '사', romaji: 'sa', exampleWord: 'サッカー', exampleReading: '삿카', exampleMeaning: '축구', mnemonicTip: '한자 풀 초(艹) 모양! 축구장 잔디 → "사"', strokeCount: 3, strokeHint: '가로 → 왼쪽 짧은 세로 → 오른쪽 길고 굽은 세로' },
  { id: 'k_shi', char: 'シ', counterpart: 'し', script: 'katakana', category: 'seion', rowId: 'k_row_sa', rowLabel: 'サ행', colIndex: 1, ko: '시', romaji: 'shi', exampleWord: 'シャツ', exampleReading: '샤츠', exampleMeaning: '셔츠', mnemonicTip: '웃는 얼굴(시~)처럼 점 두 개가 가로, 선은 아래에서 위로! → "시"', strokeCount: 3, strokeHint: '점 두 개 위아래 → 왼쪽 아래에서 오른쪽 위로 쓸어올리기' },
  { id: 'k_su', char: 'ス', counterpart: 'す', script: 'katakana', category: 'seion', rowId: 'k_row_sa', rowLabel: 'サ행', colIndex: 2, ko: '스', romaji: 'su', exampleWord: 'スキー', exampleReading: '스키', exampleMeaning: '스키', mnemonicTip: '스키를 타고 내리막길을 달리는 다리 모양 → "스"', strokeCount: 2, strokeHint: '가로 후 꺾어 내리기 → 중간에서 오른쪽으로 다리 뻗기' },
  { id: 'k_se', char: 'セ', counterpart: 'せ', script: 'katakana', category: 'seion', rowId: 'k_row_sa', rowLabel: 'サ행', colIndex: 3, ko: '세', romaji: 'se', exampleWord: 'セーター', exampleReading: '세타', exampleMeaning: '스웨터', mnemonicTip: '히라가나 せ를 각지게 만든 모양 → "세"', strokeCount: 2, strokeHint: '가로 후 짧게 갈고리 → 왼쪽 세로 후 바닥 길게' },
  { id: 'k_so', char: 'ソ', counterpart: 'そ', script: 'katakana', category: 'seion', rowId: 'k_row_sa', rowLabel: 'サ행', colIndex: 4, ko: '소', romaji: 'so', exampleWord: 'ソファー', exampleReading: '소파', exampleMeaning: '소파', mnemonicTip: 'ン과 다르게 점 1개! 위에서 아래로 길게 내림 → "소"', strokeCount: 2, strokeHint: '짧은 점 위에서 아래 → 오른쪽 위에서 아래로 빗금' },

  // タ행
  { id: 'k_ta', char: 'タ', counterpart: 'た', script: 'katakana', category: 'seion', rowId: 'k_row_ta', rowLabel: 'タ행', colIndex: 0, ko: '타', romaji: 'ta', exampleWord: 'タクシー', exampleReading: '타쿠시', exampleMeaning: '택시', mnemonicTip: '한자 저녁 석(夕) 모양! ク 안에 점 하나 → "타"', strokeCount: 3, strokeHint: '사선 → 꺾어 내리기 → 가운데 작은 점' },
  { id: 'k_chi', char: 'チ', counterpart: 'ち', script: 'katakana', category: 'seion', rowId: 'k_row_ta', rowLabel: 'タ행', colIndex: 1, ko: '치', romaji: 'chi', exampleWord: 'チーズ', exampleReading: '치즈', exampleMeaning: '치즈', mnemonicTip: '한자 일천 천(千) 모양 → "치"', strokeCount: 3, strokeHint: '위 짧은 사선 → 긴 가로 → 세로로 내려 살짝 구부리기' },
  { id: 'k_tsu', char: 'ツ', counterpart: 'つ', script: 'katakana', category: 'seion', rowId: 'k_row_ta', rowLabel: 'タ행', colIndex: 2, ko: '츠', romaji: 'tsu', exampleWord: 'ツアー', exampleReading: '츠아', exampleMeaning: '투어(여행)', mnemonicTip: '점 두 개가 나란히! 위에서 아래로 내려긋기 → "츠"', strokeCount: 3, strokeHint: '점 두 개 좌우 나란히 → 오른쪽 위에서 아래로 내리기' },
  { id: 'k_te', char: 'テ', counterpart: 'て', script: 'katakana', category: 'seion', rowId: 'k_row_ta', rowLabel: 'タ행', colIndex: 3, ko: '테', romaji: 'te', exampleWord: 'テスト', exampleReading: '테스토', exampleMeaning: '테스트(시험)', mnemonicTip: '전봇대(Telephone pole) T자 모양 → "테"', strokeCount: 3, strokeHint: '짧은 가로 → 긴 가로 → 가운데서 왼쪽으로 굽혀 내리기' },
  { id: 'k_to', char: 'ト', counterpart: 'と', script: 'katakana', category: 'seion', rowId: 'k_row_ta', rowLabel: 'タ행', colIndex: 4, ko: '토', romaji: 'to', exampleWord: 'トマト', exampleReading: '토마토', exampleMeaning: '토마토', mnemonicTip: '한글 ㅏ처럼 깃대에 깃발이 꽂힌 모양(Totem) → "토"', strokeCount: 2, strokeHint: '세로선 → 가운데서 오른쪽 아래 점 찍기' },

  // ナ행
  { id: 'k_na', char: 'ナ', counterpart: 'な', script: 'katakana', category: 'seion', rowId: 'k_row_na', rowLabel: 'ナ행', colIndex: 0, ko: '나', romaji: 'na', exampleWord: 'ナイフ', exampleReading: '나이후', exampleMeaning: '나이프', mnemonicTip: '나이프(Knife)처럼 십자(+) 모양에서 한쪽이 휘어진 글자 → "나"', strokeCount: 2, strokeHint: '가로선 → 관통해 왼쪽으로 굽히기' },
  { id: 'k_ni', char: 'ニ', counterpart: 'に', script: 'katakana', category: 'seion', rowId: 'k_row_na', rowLabel: 'ナ행', colIndex: 1, ko: '니', romaji: 'ni', exampleWord: 'ニュース', exampleReading: '뉴스', exampleMeaning: '뉴스', mnemonicTip: '한자 숫자 이(二) 그대로! 니(2) → "니"', strokeCount: 2, strokeHint: '짧은 가로 → 아래 긴 가로' },
  { id: 'k_nu', char: 'ヌ', counterpart: 'ぬ', script: 'katakana', category: 'seion', rowId: 'k_row_na', rowLabel: 'ナ행', colIndex: 2, ko: '누', romaji: 'nu', exampleWord: 'ヌードル', exampleReading: '누도루', exampleMeaning: '국수(누들)', mnemonicTip: '젓가락 X자로 국수 집는 모양 → "누"', strokeCount: 2, strokeHint: '가로 후 사선 내리기 → 가운데 관통하는 점' },
  { id: 'k_ne', char: 'ネ', counterpart: 'ね', script: 'katakana', category: 'seion', rowId: 'k_row_na', rowLabel: 'ナ행', colIndex: 3, ko: '네', romaji: 'ne', exampleWord: 'ネクタイ', exampleReading: '네쿠타이', exampleMeaning: '넥타이', mnemonicTip: '보일 시(礻) 변처럼 나무에 둥지(Nest)가 걸린 모양 → "네"', strokeCount: 4, strokeHint: '위 점 → 꺾어 내리기 → 세로선 → 오른쪽 점' },
  { id: 'k_no', char: 'ノ', counterpart: 'の', script: 'katakana', category: 'seion', rowId: 'k_row_na', rowLabel: 'ナ행', colIndex: 4, ko: '노', romaji: 'no', exampleWord: 'ノート', exampleReading: '노토', exampleMeaning: '노트(공책)', mnemonicTip: '칼로 사선 한 번에 쓱 베는 모양 → "노"', strokeCount: 1, strokeHint: '오른쪽 위에서 왼쪽 아래로 사선 한 획' },

  // ハ행
  { id: 'k_ha', char: 'ハ', counterpart: 'は', script: 'katakana', category: 'seion', rowId: 'k_row_ha', rowLabel: 'ハ행', colIndex: 0, ko: '하', romaji: 'ha', exampleWord: 'ハンバーガー', exampleReading: '함바가', exampleMeaning: '햄버거', mnemonicTip: '한자 여덟 팔(八) 모양! 양옆으로 활짝 웃는 "하하!"', strokeCount: 2, strokeHint: '왼쪽 사선 → 오른쪽 사선' },
  { id: 'k_hi', char: 'ヒ', counterpart: 'ひ', script: 'katakana', category: 'seion', rowId: 'k_row_ha', rowLabel: 'ハ행', colIndex: 1, ko: '히', romaji: 'hi', exampleWord: 'ヒント', exampleReading: '힌토', exampleMeaning: '힌트', mnemonicTip: '히라가나와 비슷하게 웃으며 기대고 있는 모습 → "히"', strokeCount: 2, strokeHint: '가로 사선 → 세로 내려 오른쪽으로 꺾기' },
  { id: 'k_fu', char: 'フ', counterpart: 'ふ', script: 'katakana', category: 'seion', rowId: 'k_row_ha', rowLabel: 'ハ행', colIndex: 2, ko: '후', romaji: 'fu', exampleWord: 'フルーツ', exampleReading: '후루츠', exampleMeaning: '과일', mnemonicTip: 'ㄱ자 한 획! 후~ 불면 날아가는 부메랑 → "후"', strokeCount: 1, strokeHint: '가로로 가다 왼쪽 아래로 굽혀 내리기' },
  { id: 'k_he', char: 'ヘ', counterpart: 'へ', script: 'katakana', category: 'seion', rowId: 'k_row_ha', rowLabel: 'ハ행', colIndex: 3, ko: '헤', romaji: 'he', exampleWord: 'ヘリコプター', exampleReading: '헤리코푸타', exampleMeaning: '헬리콥터', mnemonicTip: '히라가나 へ와 똑같은 산봉우리 모양! → "헤"', strokeCount: 1, strokeHint: '올라갔다 길게 내려가는 한 획' },
  { id: 'k_ho', char: 'ホ', counterpart: 'ほ', script: 'katakana', category: 'seion', rowId: 'k_row_ha', rowLabel: 'ハ행', colIndex: 4, ko: '호', romaji: 'ho', exampleWord: 'ホテル', exampleReading: '호테루', exampleMeaning: '호텔', mnemonicTip: '나무 목(木)이나 성스러운 십자가(Holy) 모양 → "호"', strokeCount: 4, strokeHint: '가로 → 세로 갈고리 → 왼쪽 점 → 오른쪽 점' },

  // マ행
  { id: 'k_ma', char: 'マ', counterpart: 'ま', script: 'katakana', category: 'seion', rowId: 'k_row_ma', rowLabel: 'マ행', colIndex: 0, ko: '마', romaji: 'ma', exampleWord: 'マスク', exampleReading: '마스쿠', exampleMeaning: '마스크', mnemonicTip: '모서리가 뾰족한 마스크(Mask) 귀걸이 모양 → "마"', strokeCount: 2, strokeHint: '가로 후 꺾어 내리기 → 아래 점' },
  { id: 'k_mi', char: 'ミ', counterpart: 'み', script: 'katakana', category: 'seion', rowId: 'k_row_ma', rowLabel: 'マ행', colIndex: 1, ko: '미', romaji: 'mi', exampleWord: 'ミルク', exampleReading: '미루쿠', exampleMeaning: '우유', mnemonicTip: '고양이 수염 세 줄! (도레미 세 개) → "미"', strokeCount: 3, strokeHint: '위에서 아래로 세 개의 비스듬한 가로선' },
  { id: 'k_mu', char: 'ム', counterpart: 'む', script: 'katakana', category: 'seion', rowId: 'k_row_ma', rowLabel: 'マ행', colIndex: 2, ko: '무', romaji: 'mu', exampleWord: 'ムービー', exampleReading: '무비', exampleMeaning: '영화', mnemonicTip: '삼각형 코 모양 → "무"', strokeCount: 2, strokeHint: '비스듬히 내렸다 바닥 긋기 → 오른쪽 끝 점' },
  { id: 'k_me', char: 'メ', counterpart: 'め', script: 'katakana', category: 'seion', rowId: 'k_row_ma', rowLabel: 'マ행', colIndex: 3, ko: '메', romaji: 'me', exampleWord: 'メモ', exampleReading: '메모', exampleMeaning: '메모', mnemonicTip: '칼자국 X자 모양! 한자 눈 목(目)에서 왔어요 → "메"', strokeCount: 2, strokeHint: '긴 사선 → 교차하는 짧은 점' },
  { id: 'k_mo', char: 'モ', counterpart: 'も', script: 'katakana', category: 'seion', rowId: 'k_row_ma', rowLabel: 'マ행', colIndex: 4, ko: '모', romaji: 'mo', exampleWord: 'モニター', exampleReading: '모니타', exampleMeaning: '모니터', mnemonicTip: '히라가나 も가 각진 모양 → "모"', strokeCount: 3, strokeHint: '위 가로 → 아래 긴 가로 → 세로로 내려 바닥 꺾기' },

  // ヤ행
  { id: 'k_ya', char: 'ヤ', counterpart: 'や', script: 'katakana', category: 'seion', rowId: 'k_row_ya', rowLabel: 'ヤ행', colIndex: 0, ko: '야', romaji: 'ya', exampleWord: 'ヤシ', exampleReading: '야시', exampleMeaning: '야자수', mnemonicTip: '히라가나 や가 각진 모양 → "야"', strokeCount: 2, strokeHint: '가로 사선 후 꺾기 → 긴 세로 사선' },
  { id: 'k_yu', char: 'ユ', counterpart: 'ゆ', script: 'katakana', category: 'seion', rowId: 'k_row_ya', rowLabel: 'ヤ행', colIndex: 2, ko: '유', romaji: 'yu', exampleWord: 'ユニフォーム', exampleReading: '유니호무', exampleMeaning: '유니폼', mnemonicTip: '유턴(U-turn) 표지판이 옆으로 누운 모습 → "유"', strokeCount: 2, strokeHint: 'ㄱ자 꺾기 → 바닥 긴 가로선' },
  { id: 'k_yo', char: 'ヨ', counterpart: 'よ', script: 'katakana', category: 'seion', rowId: 'k_row_ya', rowLabel: 'ヤ행', colIndex: 4, ko: '요', romaji: 'yo', exampleWord: 'ヨーグルト', exampleReading: '요구루토', exampleMeaning: '요구르트', mnemonicTip: '한글 ㄷ이 반대로, 가운데 줄이 하나 더(요!) → "요"', strokeCount: 3, strokeHint: 'ㄱ자 꺾기 → 가운데 가로 → 아래 가로 닫기' },

  // ラ행
  { id: 'k_ra', char: 'ラ', counterpart: 'ら', script: 'katakana', category: 'seion', rowId: 'k_row_ra', rowLabel: 'ラ행', colIndex: 0, ko: '라', romaji: 'ra', exampleWord: 'ラーメン', exampleReading: '라멘', exampleMeaning: '라멘', mnemonicTip: '라면 그릇 위에 젓가락이 올려진 모양 → "라"', strokeCount: 2, strokeHint: '짧은 가로 → 긴 가로 후 꺾어 내리기' },
  { id: 'k_ri', char: 'リ', counterpart: 'り', script: 'katakana', category: 'seion', rowId: 'k_row_ra', rowLabel: 'ラ행', colIndex: 1, ko: '리', romaji: 'ri', exampleWord: 'リボン', exampleReading: '리본', exampleMeaning: '리본', mnemonicTip: '히라가나 り와 똑같은 세로 두 줄 → "리"', strokeCount: 2, strokeHint: '왼쪽 짧은 세로 → 오른쪽 길고 굽은 세로' },
  { id: 'k_ru', char: 'ル', counterpart: 'る', script: 'katakana', category: 'seion', rowId: 'k_row_ra', rowLabel: 'ラ행', colIndex: 2, ko: '루', romaji: 'ru', exampleWord: 'ルール', exampleReading: '루루', exampleMeaning: '규칙(룰)', mnemonicTip: '한글 ㄴ과 ㅅ이 나란히! 루트(Root) 모양 → "루"', strokeCount: 2, strokeHint: '왼쪽 사선 → 오른쪽 세로 후 위로 튕기기' },
  { id: 'k_re', char: 'レ', counterpart: 'れ', script: 'katakana', category: 'seion', rowId: 'k_row_ra', rowLabel: 'ラ행', colIndex: 3, ko: '레', romaji: 're', exampleWord: 'レモン', exampleReading: '레몬', exampleMeaning: '레몬', mnemonicTip: 'ル에서 왼쪽 획만 쏙 뺀 ㄴ 모양 → "레"', strokeCount: 1, strokeHint: '세로로 내려 오른쪽 위로 힘차게 튕기기' },
  { id: 'k_ro', char: 'ロ', counterpart: 'ろ', script: 'katakana', category: 'seion', rowId: 'k_row_ra', rowLabel: 'ラ행', colIndex: 4, ko: '로', romaji: 'ro', exampleWord: 'ロボット', exampleReading: '로봇토', exampleMeaning: '로봇', mnemonicTip: '한글 ㅁ(미음)처럼 네모난 로봇 얼굴 → "로"', strokeCount: 3, strokeHint: '왼쪽 세로 → 위 꺾기 → 아래 닫기' },

  // ワ행 + ン
  { id: 'k_wa', char: 'ワ', counterpart: 'わ', script: 'katakana', category: 'seion', rowId: 'k_row_wa', rowLabel: 'ワ행', colIndex: 0, ko: '와', romaji: 'wa', exampleWord: 'ワイン', exampleReading: '와인', exampleMeaning: '와인', mnemonicTip: 'ウ에서 위 점만 뺀 와인잔 모양 → "와"', strokeCount: 2, strokeHint: '왼쪽 세로 → 가로 꺾어 내려가기' },
  { id: 'k_wo', char: 'ヲ', counterpart: 'を', script: 'katakana', category: 'seion', rowId: 'k_row_wa', rowLabel: 'ワ행', colIndex: 4, ko: '오(워)', romaji: 'wo', exampleWord: 'ヲタ', exampleReading: '오타', exampleMeaning: '조사 오(고유표기)', mnemonicTip: '가로줄 두 개를 관통하는 각진 곡선 → "오"', strokeCount: 3, strokeHint: '위 가로 → 가운데 가로 → 내려와 굽히기' },
  { id: 'k_n', char: 'ン', counterpart: 'ん', script: 'katakana', category: 'seion', rowId: 'k_row_wa', rowLabel: 'ワ행', colIndex: 3, ko: '응/ㄴ받침', romaji: 'n', exampleWord: 'パン', exampleReading: '팡', exampleMeaning: '빵', mnemonicTip: 'ソ와 다르게 점 1개, 아래에서 위로 올려긋기! → "응"', strokeCount: 2, strokeHint: '작은 점 → 왼쪽 아래에서 오른쪽 위로 쓸어올리기' }
];

export const HIRAGANA_DAKUON: KanaItem[] = [
  // が행
  { id: 'h_ga', char: 'が', counterpart: 'ガ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 0, ko: '가', romaji: 'ga', exampleWord: 'がっこう', exampleReading: '각코우', exampleMeaning: '학교', mnemonicTip: 'か(카) + 탁점(゛) = 거센소리가 부드러운 "가"로 변해요!', strokeCount: 5, strokeHint: 'か를 쓰고 오른쪽 위에 작은 점 두 개' },
  { id: 'h_gi', char: 'ぎ', counterpart: 'ギ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 1, ko: '기', romaji: 'gi', exampleWord: 'ぎんこう', exampleReading: '긴코우', exampleMeaning: '은행', mnemonicTip: 'き(키) + 탁점(゛) = "기"', strokeCount: 6, strokeHint: 'き에 오른쪽 위 점 두 개' },
  { id: 'h_gu', char: 'ぐ', counterpart: 'グ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 2, ko: '구', romaji: 'gu', exampleWord: 'ぐあい', exampleReading: '구아이', exampleMeaning: '컨디션/상태', mnemonicTip: 'く(쿠) + 탁점(゛) = "구"', strokeCount: 3, strokeHint: 'く에 점 두 개' },
  { id: 'h_ge', char: 'げ', counterpart: 'ゲ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 3, ko: '게', romaji: 'ge', exampleWord: 'げんき', exampleReading: '겐키', exampleMeaning: '건강함/활기', mnemonicTip: 'け(케) + 탁점(゛) = "게"', strokeCount: 5, strokeHint: 'け에 점 두 개' },
  { id: 'h_go', char: 'ご', counterpart: 'ゴ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 4, ko: '고', romaji: 'go', exampleWord: 'ごはん', exampleReading: '고항', exampleMeaning: '밥', mnemonicTip: 'こ(코) + 탁점(゛) = "고"', strokeCount: 4, strokeHint: 'こ에 점 두 개' },

  // ざ행
  { id: 'h_za', char: 'ざ', counterpart: 'ザ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 0, ko: '자', romaji: 'za', exampleWord: 'ざっし', exampleReading: '잣시', exampleMeaning: '잡지', mnemonicTip: 'さ(사) + 탁점(゛) = "자"', strokeCount: 5, strokeHint: 'さ에 점 두 개' },
  { id: 'h_ji', char: 'じ', counterpart: 'ジ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 1, ko: '지', romaji: 'ji', exampleWord: 'じかん', exampleReading: '지칸', exampleMeaning: '시간', mnemonicTip: 'し(시) + 탁점(゛) = "지"', strokeCount: 3, strokeHint: 'し에 점 두 개' },
  { id: 'h_zu', char: 'ず', counterpart: 'ズ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 2, ko: '즈', romaji: 'zu', exampleWord: 'ちず', exampleReading: '치즈', exampleMeaning: '지도', mnemonicTip: 'す(스) + 탁점(゛) = "즈"', strokeCount: 4, strokeHint: 'す에 점 두 개' },
  { id: 'h_ze', char: 'ぜ', counterpart: 'ゼ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 3, ko: '제', romaji: 'ze', exampleWord: 'ぜんぶ', exampleReading: '젠부', exampleMeaning: '전부', mnemonicTip: 'せ(세) + 탁점(゛) = "제"', strokeCount: 5, strokeHint: 'せ에 점 두 개' },
  { id: 'h_zo', char: 'ぞ', counterpart: 'ゾ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 4, ko: '조', romaji: 'zo', exampleWord: 'ぞう', exampleReading: '조우', exampleMeaning: '코끼리', mnemonicTip: 'そ(소) + 탁점(゛) = "조"', strokeCount: 3, strokeHint: 'そ에 점 두 개' },

  // だ행
  { id: 'h_da', char: 'だ', counterpart: 'ダ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 0, ko: '다', romaji: 'da', exampleWord: 'だいすき', exampleReading: '다이스키', exampleMeaning: '정말 좋아함', mnemonicTip: 'た(타) + 탁점(゛) = "다"', strokeCount: 6, strokeHint: 'た에 점 두 개' },
  { id: 'h_de', char: 'で', counterpart: 'デ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 3, ko: '데', romaji: 'de', exampleWord: 'でんしゃ', exampleReading: '덴샤', exampleMeaning: '전철', mnemonicTip: 'て(테) + 탁점(゛) = "데"', strokeCount: 3, strokeHint: 'て에 점 두 개' },
  { id: 'h_do', char: 'ど', counterpart: 'ド', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 4, ko: '도', romaji: 'do', exampleWord: 'どこ', exampleReading: '도코', exampleMeaning: '어디', mnemonicTip: 'と(토) + 탁점(゛) = "도"', strokeCount: 4, strokeHint: 'と에 점 두 개' },

  // ば행 + ぱ행
  { id: 'h_ba', char: 'ば', counterpart: 'バ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 0, ko: '바', romaji: 'ba', exampleWord: 'ばしょ', exampleReading: '바쇼', exampleMeaning: '장소', mnemonicTip: 'は(하) + 탁점(゛) = "바"', strokeCount: 5, strokeHint: 'は에 점 두 개' },
  { id: 'h_bi', char: 'び', counterpart: 'ビ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 1, ko: '비', romaji: 'bi', exampleWord: 'びょういん', exampleReading: '뵤우인', exampleMeaning: '병원', mnemonicTip: 'ひ(히) + 탁점(゛) = "비"', strokeCount: 3, strokeHint: 'ひ에 점 두 개' },
  { id: 'h_bu', char: 'ぶ', counterpart: 'ブ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 2, ko: '부', romaji: 'bu', exampleWord: 'ぶどう', exampleReading: '부도우', exampleMeaning: '포도', mnemonicTip: 'ふ(후) + 탁점(゛) = "부"', strokeCount: 6, strokeHint: 'ふ에 점 두 개' },
  { id: 'h_be', char: 'べ', counterpart: 'ベ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 3, ko: '베', romaji: 'be', exampleWord: 'べんきょう', exampleReading: '벤쿄우', exampleMeaning: '공부', mnemonicTip: 'へ(헤) + 탁점(゛) = "베"', strokeCount: 3, strokeHint: 'へ에 점 두 개' },
  { id: 'h_bo', char: 'ぼ', counterpart: 'ボ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 4, ko: '보', romaji: 'bo', exampleWord: 'ぼうし', exampleReading: '보우시', exampleMeaning: '모자', mnemonicTip: 'ほ(호) + 탁점(゛) = "보"', strokeCount: 6, strokeHint: 'ほ에 점 두 개' },

  { id: 'h_pa', char: 'ぱ', counterpart: 'パ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 0, ko: '파', romaji: 'pa', exampleWord: 'ぱん', exampleReading: '팡', exampleMeaning: '빵', mnemonicTip: 'は(하) + 반탁점(゜동그라미) = 통통 튀는 "파"!', strokeCount: 4, strokeHint: 'は 오른쪽 위에 동그라미' },
  { id: 'h_pi', char: 'ぴ', counterpart: 'ピ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 1, ko: '피', romaji: 'pi', exampleWord: 'えんぴつ', exampleReading: '엔피츠', exampleMeaning: '연필', mnemonicTip: 'ひ(히) + 반탁점(゜) = "피"', strokeCount: 2, strokeHint: 'ひ 오른쪽 위에 동그라미' },
  { id: 'h_pu', char: 'ぷ', counterpart: 'プ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 2, ko: '푸', romaji: 'pu', exampleWord: 'てんぷら', exampleReading: '텐푸라', exampleMeaning: '튀김', mnemonicTip: 'ふ(후) + 반탁점(゜) = "푸"', strokeCount: 5, strokeHint: 'ふ 오른쪽 위에 동그라미' },
  { id: 'h_pe', char: 'ぺ', counterpart: 'ペ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 3, ko: '페', romaji: 'pe', exampleWord: 'ぺこぺこ', exampleReading: '페코페코', exampleMeaning: '꼬르륵(배고픔)', mnemonicTip: 'へ(헤) + 반탁점(゜) = "페"', strokeCount: 2, strokeHint: 'へ 오른쪽 위에 동그라미' },
  { id: 'h_po', char: 'ぽ', counterpart: 'ポ', script: 'hiragana', category: 'dakuon', rowId: 'row_dakuon', rowLabel: '탁음·반탁음', colIndex: 4, ko: '포', romaji: 'po', exampleWord: 'さんぽ', exampleReading: '산포', exampleMeaning: '산책', mnemonicTip: 'ほ(호) + 반탁점(゜) = "포"', strokeCount: 5, strokeHint: 'ほ 오른쪽 위에 동그라미' }
];

export const HIRAGANA_YOON: KanaItem[] = [
  { id: 'h_kya', char: 'きゃ', counterpart: 'キャ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 0, ko: '캬', romaji: 'kya', exampleWord: 'おきゃくさん', exampleReading: '오캬쿠상', exampleMeaning: '손님', mnemonicTip: 'き(키) + 작은 ゃ(야)를 한 글자처럼 "캬!"', strokeCount: 7, strokeHint: 'き 뒤에 절반 크기로 ゃ 쓰기' },
  { id: 'h_kyu', char: 'きゅ', counterpart: 'キュ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 2, ko: '큐', romaji: 'kyu', exampleWord: 'きゅうり', exampleReading: '큐우리', exampleMeaning: '오이', mnemonicTip: 'き + 작은 ゅ = "큐"', strokeCount: 6, strokeHint: 'き 뒤에 작은 ゅ 쓰기' },
  { id: 'h_kyo', char: 'きょ', counterpart: 'キョ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 4, ko: '쿄', romaji: 'kyo', exampleWord: 'きょう', exampleReading: '쿄우', exampleMeaning: '오늘', mnemonicTip: 'き + 작은 ょ = "쿄"', strokeCount: 6, strokeHint: 'き 뒤에 작은 ょ 쓰기' },
  { id: 'h_sha', char: 'しゃ', counterpart: 'シャ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 0, ko: '샤', romaji: 'sha', exampleWord: 'しゃしん', exampleReading: '샤신', exampleMeaning: '사진', mnemonicTip: 'し + 작은 ゃ = "샤"', strokeCount: 4, strokeHint: 'し 뒤에 작은 ゃ 쓰기' },
  { id: 'h_shu', char: 'しゅ', counterpart: 'シュ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 2, ko: '슈', romaji: 'shu', exampleWord: 'しゅくだい', exampleReading: '슈쿠다이', exampleMeaning: '숙제', mnemonicTip: 'し + 작은 ゅ = "슈"', strokeCount: 3, strokeHint: 'し 뒤에 작은 ゅ 쓰기' },
  { id: 'h_sho', char: 'しょ', counterpart: 'ショ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 4, ko: '쇼', romaji: 'sho', exampleWord: 'しょうゆ', exampleReading: '쇼우유', exampleMeaning: '간장', mnemonicTip: 'し + 작은 ょ = "쇼"', strokeCount: 3, strokeHint: 'し 뒤에 작은 ょ 쓰기' },
  { id: 'h_cha', char: 'ちゃ', counterpart: 'チャ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 0, ko: '차', romaji: 'cha', exampleWord: 'おちゃ', exampleReading: '오차', exampleMeaning: '차(음료)', mnemonicTip: 'ち + 작은 ゃ = "차"', strokeCount: 5, strokeHint: 'ち 뒤에 작은 ゃ 쓰기' },
  { id: 'h_chu', char: 'ちゅ', counterpart: 'チュ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 2, ko: '추', romaji: 'chu', exampleWord: 'ちゅうがっこう', exampleReading: '추우각코우', exampleMeaning: '중학교', mnemonicTip: 'ち + 작은 ゅ = "추"', strokeCount: 4, strokeHint: 'ち 뒤에 작은 ゅ 쓰기' },
  { id: 'h_cho', char: 'ちょ', counterpart: 'チョ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 4, ko: '초', romaji: 'cho', exampleWord: 'ちょっと', exampleReading: '촛토', exampleMeaning: '잠깐 / 조금', mnemonicTip: 'ち + 작은 ょ = "초"', strokeCount: 4, strokeHint: 'ち 뒤에 작은 ょ 쓰기' },
  { id: 'h_nya', char: 'にゃ', counterpart: 'ニャ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 0, ko: '냐', romaji: 'nya', exampleWord: 'にゃんこ', exampleReading: '냥코', exampleMeaning: '냥이(고양이)', mnemonicTip: 'に + 작은 ゃ = "냐"', strokeCount: 6, strokeHint: 'に 뒤에 작은 ゃ 쓰기' },
  { id: 'h_ryu', char: 'りゅ', counterpart: 'リュ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 2, ko: '류', romaji: 'ryu', exampleWord: 'りゅうがく', exampleReading: '류우가쿠', exampleMeaning: '유학', mnemonicTip: 'り + 작은 ゅ = "류"', strokeCount: 4, strokeHint: 'り 뒤에 작은 ゅ 쓰기' },
  { id: 'h_ryo', char: 'りょ', counterpart: 'リョ', script: 'hiragana', category: 'yoon', rowId: 'row_yoon', rowLabel: '요음', colIndex: 4, ko: '료', romaji: 'ryo', exampleWord: 'りょこう', exampleReading: '료코우', exampleMeaning: '여행', mnemonicTip: 'り + 작은 ょ = "료"', strokeCount: 4, strokeHint: 'り 뒤에 작은 ょ 쓰기' }
];

export const ALL_KANA: KanaItem[] = [
  ...HIRAGANA_BASIC,
  ...KATAKANA_BASIC,
  ...HIRAGANA_DAKUON,
  ...HIRAGANA_YOON
];

export const HIRAGANA_ROWS = [
  { id: 'row_a', label: 'あ행', chars: ['あ', 'い', 'う', 'え', 'お'] },
  { id: 'row_ka', label: 'か행', chars: ['か', 'き', 'く', 'け', 'こ'] },
  { id: 'row_sa', label: 'さ행', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
  { id: 'row_ta', label: 'た행', chars: ['た', 'ち', 'つ', 'て', 'と'] },
  { id: 'row_na', label: 'な행', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { id: 'row_ha', label: 'は행', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { id: 'row_ma', label: 'ま행', chars: ['ま', 'み', 'む', 'め', 'も'] },
  { id: 'row_ya', label: 'や행', chars: ['や', '', 'ゆ', '', 'よ'] },
  { id: 'row_ra', label: 'ら행', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { id: 'row_wa', label: 'わ행', chars: ['わ', '', '', 'ん', 'を'] }
];

export const KATAKANA_ROWS = [
  { id: 'k_row_a', label: 'ア행', chars: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
  { id: 'k_row_ka', label: 'カ행', chars: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
  { id: 'k_row_sa', label: 'サ행', chars: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
  { id: 'k_row_ta', label: 'タ행', chars: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
  { id: 'k_row_na', label: 'ナ행', chars: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
  { id: 'k_row_ha', label: 'ハ행', chars: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
  { id: 'k_row_ma', label: 'マ행', chars: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
  { id: 'k_row_ya', label: 'ヤ행', chars: ['ヤ', '', 'ユ', '', 'ヨ'] },
  { id: 'k_row_ra', label: 'ラ행', chars: ['ラ', 'リ', 'ル', 'レ', 'ロ'] },
  { id: 'k_row_wa', label: 'ワ행', chars: ['ワ', '', '', 'ン', 'ヲ'] }
];

export const VOWEL_HEADERS = ['あ단 (a)', 'い단 (i)', 'う단 (u)', 'え단 (e)', 'お단 (o)'];
