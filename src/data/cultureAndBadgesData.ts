import { BadgeDef, CultureCard } from '../types';

export const CULTURE_CARDS: CultureCard[] = [
  {
    id: 'card_sakura',
    title: '벚꽃과 하나미',
    jpTitle: '桜・花見',
    category: '계절 문화',
    emoji: '🌸',
    description: '일본의 봄은 벚꽃(さくら)과 함께 시작돼요. 4월 새 학기 입학식 시즌에 맞춰 피기 때문에 "새로운 시작"을 상징한답니다.',
    funFact: '가족이나 친구들이 공원 벚나무 아래 돗자리를 펴고 도시락을 나누어 먹는 피크닉을 "하나미(花見)"라고 불러요.'
  },
  {
    id: 'card_omikuji',
    title: '오미쿠지 운세 종이',
    jpTitle: 'おみくじ',
    category: '전통 체험',
    emoji: '🎋',
    description: '신사나 절에서 동전을 넣고 뽑는 운세 종이예요. 대길(大吉)부터 길, 소길, 흉까지 다양한 결과가 적혀 있어요.',
    funFact: '좋지 않은 운세가 나오면 나쁜 기운을 남기고 가라는 뜻으로 신사 안 지정된 나무나 줄에 묶어 두고 와요.'
  },
  {
    id: 'card_sushi',
    title: '회전초밥 카이텐즈시',
    jpTitle: '回転寿司',
    category: '음식 문화',
    emoji: '🍣',
    description: '레일 위를 돌아가는 초밥 접시를 골라 먹는 회전초밥은 일본 오사카에서 처음 발명되었어요.',
    funFact: '요즘 일본 회전초밥집에서는 자리의 태블릿으로 주문하면 고속 레일 열차가 초밥을 자리 바로 앞까지 배달해 준답니다!'
  },
  {
    id: 'card_takoyaki',
    title: '오사카 명물 다코야키',
    jpTitle: 'たこ焼き',
    category: '음식 문화',
    emoji: '🐙',
    description: '밀가루 반죽 안에 쫄깃한 문어(たこ)를 넣고 동그랗게 구운 오사카 대표 간식이에요.',
    funFact: '오사카의 많은 가정집에는 다코야키 전용 철판이 하나씩 있을 정도로 사랑받는 국민 간식이랍니다.'
  },
  {
    id: 'card_manekineko',
    title: '복을 부르는 마네키네코',
    jpTitle: '招き猫',
    category: '상징 & 전설',
    emoji: '🐱',
    description: '앞발을 들고 손님을 부르는 고양이 인형이에요. 일본 가게 입구에 자주 놓여 있어요.',
    funFact: '오른발을 들면 "돈(재물)"을 부르고, 왼발을 들면 "손님(사람)"을 부른다는 재미있는 규칙이 있어요!'
  },
  {
    id: 'card_fujisan',
    title: '일본 최고봉 후지산',
    jpTitle: '富士山',
    category: '지리 & 명소',
    emoji: '🗻',
    description: '해발 3,776m의 일본에서 가장 높은 산이자 유네스코 세계문화유산이에요.',
    funFact: '새해 첫날 밤에 꾸는 꿈(하츠유메)에 후지산, 매, 가지가 나오면 그해 최고의 행운이 온다는 속담이 있어요.'
  },
  {
    id: 'card_matsuri',
    title: '여름 축제 마츠리',
    jpTitle: '夏祭り',
    category: '전통 행사',
    emoji: '🏮',
    description: '여름밤 신사 주변에서 열리는 일본의 지역 축제예요. 등불이 켜지고 가마(미코시) 행렬이 이어져요.',
    funFact: '금붕어 건지기(킹교스쿠이), 빙수(카키고오리), 불꽃놀이(하나비)는 마츠리의 단골 인기 코스랍니다!'
  },
  {
    id: 'card_yukata',
    title: '시원한 여름 옷 유카타',
    jpTitle: '浴衣',
    category: '전통 의복',
    emoji: '👘',
    description: '기모노보다 훨씬 가볍고 시원한 면 소재로 만든 여름용 전통 의상이에요.',
    funFact: '중·고등학생 친구들도 여름 불꽃축제나 온천 마을 여행을 갈 때 예쁜 유카타를 입고 사진을 찍어요.'
  },
  {
    id: 'card_shinkansen',
    title: '초고속 열차 신칸센',
    jpTitle: '新幹線',
    category: '현대 생활',
    emoji: '🚄',
    description: '1964년 도쿄 올림픽에 맞춰 개통한 세계 최초의 고속철도예요. 도쿄에서 오사카까지 약 2시간 반 만에 가요.',
    funFact: '기차 안에서 먹는 도시락 "에키벤(駅弁)"은 역마다 지역 특산물로 만든 메뉴가 달라서 모으는 재미가 있어요!'
  },
  {
    id: 'card_torii',
    title: '도리이와 신사 예절',
    jpTitle: '鳥居',
    category: '전통 건축',
    emoji: '⛩️',
    description: '신사 입구에 서 있는 붉은색 대문 모양 구조물을 "도리이"라고 해요. 일상 세계와 신성한 공간을 나누는 문이에요.',
    funFact: '도리이를 지나가기 전에 가볍게 고개를 숙여 인사하고, 길 한가운데는 신이 지나가는 길이라 살짝 가장자리로 걷는 예절이 있어요.'
  },
  {
    id: 'card_konbini',
    title: '일본의 편의점 콘비니',
    jpTitle: 'コンビニ',
    category: '현대 생활',
    emoji: '🏪',
    description: '일본에서는 편의점을 줄여서 "콘비니"라고 불러요. 계란 샌드위치, 오니기리, 따뜻한 어묵까지 없는 게 없어요.',
    funFact: '일본어 숫자나 가타카나를 익히고 일본 편의점에 가면 음료수와 과자 이름을 스스로 읽는 재미가 정말 커져요!'
  },
  {
    id: 'card_vending',
    title: '길거리 자판기 천국',
    jpTitle: '自動販売機',
    category: '현대 생활',
    emoji: '🥤',
    description: '일본 골목 어디서나 볼 수 있는 자동판매기! 차가운 음료뿐만 아니라 따뜻한 캔 옥수수 수프와 밀크티도 나와요.',
    funFact: '버튼 아래에 파란 글씨는 "차가움(つめたい)", 빨간 글씨는 "따뜻함(あたたかい)"을 뜻해요!'
  },
  {
    id: 'card_onsen',
    title: '따뜻한 온천 온센',
    jpTitle: '温泉',
    category: '휴식 문화',
    emoji: '♨️',
    description: '화산 지형 덕분에 일본 곳곳에는 천연 온천이 정말 많아요. 지도에서 ♨️ 마크가 바로 온천 표시예요.',
    funFact: '온천에 들어가기 전에는 반드시 몸을 먼저 씻고, 수건은 물속에 담그지 않고 머리 위에 올리거나 밖에 두는 것이 예절이에요.'
  },
  {
    id: 'card_kotatsu',
    title: '겨울 필수품 고타츠',
    jpTitle: 'こたつ',
    category: '가정 문화',
    emoji: '🍊',
    description: '낮은 상 아래에 전기 난방기가 달리고 두꺼운 이불을 덮은 일본 전통 겨울 테이블이에요.',
    funFact: '겨울에 고타츠 안에서 따뜻한 귤(미칸)을 까먹으면 너무 포근해서 밖으로 나오기 싫어져 "마법의 가구"라고 불려요.'
  },
  {
    id: 'card_karaoke',
    title: '가라오케 문화',
    jpTitle: 'カラオケ',
    category: '대중 문화',
    emoji: '🎤',
    description: '반주만 나오는 기계라는 뜻의 "가라(빈) + 오케스트라"에서 유래한 일본어예요.',
    funFact: '일본 가라오케 방에는 코스프레 의상이나 탬버린, 심지어 간식 주문 버튼까지 있어서 친구들과 시간 보내기 좋아요.'
  },
  {
    id: 'card_anime',
    title: '만화 & 애니메이션 성지',
    jpTitle: '漫画・アニメ',
    category: '대중 문화',
    emoji: '🎨',
    description: '일본 서점에 가면 만화 코너만 한 층을 다 쓸 만큼 규모가 커요. 소년·소녀 만화 대부분에는 한자 옆에 히라가나(후리가나)가 적혀 있어요.',
    funFact: '히라가나와 N5만 떼도 일본 만화책의 절반 이상을 스스로 소리 내어 읽을 수 있답니다!'
  },
  {
    id: 'card_graduation',
    title: '졸업식 제2단추',
    jpTitle: '第二ボタン',
    category: '학교 문화',
    emoji: '🎓',
    description: '일본 중·고등학교 졸업식에서는 학생복의 위에서 두 번째 단추를 소중한 사람에게 선물하는 낭만적인 전통이 있어요.',
    funFact: '두 번째 단추가 심장(마음)에서 가장 가까운 위치에 있기 때문에 가장 소중한 마음을 전한다는 의미래요.'
  },
  {
    id: 'card_cherry_crown',
    title: 'N1 마스터의 벚꽃 왕관',
    jpTitle: '夢の達成',
    category: '최종 영예',
    emoji: '👑',
    description: '히라가나 첫 글자 あ부터 시작해 마침내 JLPT N1까지 도달하는 위대한 일본어 모험가의 상징이에요.',
    funFact: '꾸준히 하루 15분씩 쌓은 실력은 어떤 천재도 이길 수 없는 가장 강한 힘이에요!'
  }
];

export const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'badge_early_bird',
    title: '얼리버드',
    shortLabel: '첫발',
    description: '일본어 모험의 첫 학습을 완료했어요!',
    conditionText: '첫 글자 학습 또는 퀴즈 1회 완료',
    accentColor: 'emerald',
    targetTab: 'study',
    targetStudySubTab: 'kana'
  },
  {
    id: 'badge_streak_3',
    title: '꾸준함의 왕',
    shortLabel: '3일',
    description: '3일 연속 일본어 공부를 이어갔어요!',
    conditionText: '연속 학습 3일 달성',
    accentColor: 'gold',
    targetTab: 'home'
  },
  {
    id: 'badge_streak_7',
    title: '7일 완주',
    shortLabel: '7일',
    description: '일주일 내내 빠짐없이 출석한 성실 챔피언!',
    conditionText: '연속 학습 7일 달성',
    accentColor: 'gold',
    targetTab: 'home'
  },
  {
    id: 'badge_hiragana_start',
    title: '히라가나 입문',
    shortLabel: 'あ',
    description: '히라가나 첫 번째 관문 あ행을 정복했어요!',
    conditionText: 'あ행 단계 퀴즈 80% 이상 통과',
    accentColor: 'emerald',
    targetTab: 'study',
    targetStudySubTab: 'kana'
  },
  {
    id: 'badge_hiragana_master',
    title: '히라가나 완성',
    shortLabel: 'あ~ん',
    description: '히라가나 46자 청음을 모두 정복했어요!',
    conditionText: '히라가나 기본 46자 학습 완료',
    accentColor: 'coral',
    targetTab: 'study',
    targetStudySubTab: 'gojuon'
  },
  {
    id: 'badge_katakana_master',
    title: '가타카나 완성',
    shortLabel: 'ア~ン',
    description: '외래어 메뉴판도 거뜬한 가타카나 마스터!',
    conditionText: '가타카나 단계 정복 또는 40자 학습',
    accentColor: 'coral',
    targetTab: 'study',
    targetStudySubTab: 'gojuon'
  },
  {
    id: 'badge_drop_pro',
    title: '낙하 게임 고수',
    shortLabel: 'ぽ!',
    description: '가나 낙하 게임에서 1,000점을 돌파했어요!',
    conditionText: '가나 낙하 게임 1,000점 이상 달성',
    accentColor: 'navy',
    targetTab: 'game'
  },
  {
    id: 'badge_srs_champ',
    title: '망각 곡선 수호자',
    shortLabel: '복습',
    description: '망각 곡선 복습으로 장기 기억을 10회 이상 지켰어요!',
    conditionText: '복습 퀴즈 10회 이상 정답',
    accentColor: 'emerald',
    targetTab: 'study',
    targetStudySubTab: 'srs'
  },
  {
    id: 'badge_sharp_eye',
    title: '헷갈림 타파',
    shortLabel: 'さき',
    description: '비슷한 글자 구별 퀴즈를 멋지게 통과했어요!',
    conditionText: '헷갈리는 글자 비교 퀴즈 정답 5회 이상',
    accentColor: 'gold',
    targetTab: 'study',
    targetStudySubTab: 'confusing'
  },
  {
    id: 'badge_n5_challenger',
    title: 'N5 도전자',
    shortLabel: 'N5',
    description: '0단계 가나 월드를 넘어 N5 월드 문앞에 섰어요!',
    conditionText: 'N5 월드 해금 또는 목표 급수 N5+ 도전',
    accentColor: 'navy',
    targetTab: 'home'
  }
];
