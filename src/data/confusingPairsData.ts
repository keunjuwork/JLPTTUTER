import { ConfusingPair } from '../types';

export const CONFUSING_PAIRS: ConfusingPair[] = [
  {
    id: 'pair_sa_ki',
    title: 'さ / き',
    script: 'hiragana',
    chars: ['さ', 'き'],
    summaryTip: '가로줄 개수로 구별해요! 한 줄이면 さ(사), 두 줄이면 き(키)!',
    points: [
      {
        char: 'さ',
        ko: '사',
        romaji: 'sa',
        visualCue: '가로줄이 1개! 입 모양이 한 줄로 활짝 "사~"'
      },
      {
        char: 'き',
        ko: '키',
        romaji: 'ki',
        visualCue: '가로줄이 2개! 열쇠(Key) 톱니가 2개 달렸어요'
      }
    ]
  },
  {
    id: 'pair_nu_me',
    title: 'ぬ / め',
    script: 'hiragana',
    chars: ['ぬ', 'め'],
    summaryTip: '끝부분에 작은 동그라미 고리(돼지꼬리)가 있으면 ぬ(누), 없으면 め(메)!',
    points: [
      {
        char: 'ぬ',
        ko: '누',
        romaji: 'nu',
        visualCue: '끝에 작은 고리가 한 번 더 감겨 있어요 (국수 면발 돌돌)'
      },
      {
        char: 'め',
        ko: '메',
        romaji: 'me',
        visualCue: '고리 없이 둥글게 내려와 깔끔하게 끝나요 (안경알)'
      }
    ]
  },
  {
    id: 'pair_wa_ne_re',
    title: 'わ / ね / れ',
    script: 'hiragana',
    chars: ['わ', 'ね', 'れ'],
    summaryTip: '오른쪽 끝 모양만 보면 1초 구별! 동그란 둥지(わ), 꼬리 고리(ね), 뻗은 발(れ)!',
    points: [
      {
        char: 'わ',
        ko: '와',
        romaji: 'wa',
        visualCue: '오른쪽이 둥근 큰 반원으로 부드럽게 안으로 감겨요'
      },
      {
        char: 'ね',
        ko: '네',
        romaji: 'ne',
        visualCue: '오른쪽 끝에 고양이 꼬리처럼 작은 동그라미 고리가 있어요'
      },
      {
        char: 'れ',
        ko: '레',
        romaji: 're',
        visualCue: '고리 없이 바깥 오른쪽으로 발을 쭉 뻗어 올리며 끝나요'
      }
    ]
  },
  {
    id: 'pair_ha_ho',
    title: 'は / ほ',
    script: 'hiragana',
    chars: ['は', 'ほ'],
    summaryTip: '가로줄 개수와 세로선 머리! 1줄이면 は(하), 지붕 2줄이면 ほ(호)!',
    points: [
      {
        char: 'は',
        ko: '하',
        romaji: 'ha',
        visualCue: '가로줄이 1개이고 세로선이 위로 뾰족 튀어나와요'
      },
      {
        char: 'ほ',
        ko: '호',
        romaji: 'ho',
        visualCue: '가로줄이 2개! 맨 위 가로줄 위로 세로선이 튀어나오지 않아요'
      }
    ]
  },
  {
    id: 'pair_shi_tsu',
    title: 'シ / ツ',
    script: 'katakana',
    chars: ['シ', 'ツ'],
    summaryTip: '점의 배치와 긴 획의 방향! 가로로 누워 올려그으면 シ(시), 세로로 서서 내려그으면 ツ(츠)!',
    points: [
      {
        char: 'シ',
        ko: '시',
        romaji: 'shi',
        visualCue: '점 두 개가 위아래로 쌓여 있고, 마지막 획을 아래→위로 올려요 (웃는 얼굴)'
      },
      {
        char: 'ツ',
        ko: '츠',
        romaji: 'tsu',
        visualCue: '점 두 개가 좌우로 나란히 있고, 마지막 획을 위→아래로 내려요'
      }
    ]
  },
  {
    id: 'pair_so_n',
    title: 'ソ / ン',
    script: 'katakana',
    chars: ['ソ', 'ン'],
    summaryTip: '점이 1개일 때도 방향이 중요! 위에서 내리면 ソ(소), 아래서 올리면 ン(응)!',
    points: [
      {
        char: 'ソ',
        ko: '소',
        romaji: 'so',
        visualCue: '점과 긴 획이 위에서 아래로 내려오는 가파른 각도'
      },
      {
        char: 'ン',
        ko: '응',
        romaji: 'n',
        visualCue: '점이 살짝 높고 긴 획은 왼쪽 아래에서 오른쪽 위로 올라가는 각도'
      }
    ]
  },
  {
    id: 'pair_ru_ro',
    title: 'る / ろ',
    script: 'hiragana',
    chars: ['る', 'ろ'],
    summaryTip: '둘 다 숫자 3을 닮았지만, 끝을 돌돌 말았으면 る(루), 열려있으면 ろ(로)!',
    points: [
      {
        char: 'る',
        ko: '루',
        romaji: 'ru',
        visualCue: '끝에 루비 보석처럼 동그란 고리가 달려 있어요'
      },
      {
        char: 'ろ',
        ko: '로',
        romaji: 'ro',
        visualCue: '고리 없이 숫자 3 그대로 깔끔하게 끝나요'
      }
    ]
  },
  {
    id: 'pair_a_o',
    title: 'あ / お',
    script: 'hiragana',
    chars: ['あ', 'お'],
    summaryTip: '점 위치와 고리 유무! 오른쪽 위 점만 있으면 お(오), 아래 큰 고리가 교차하면 あ(아)!',
    points: [
      {
        char: 'あ',
        ko: '아',
        romaji: 'a',
        visualCue: '위쪽에 점이 없고 아래 둥근 부분이 크게 X자로 교차해요'
      },
      {
        char: 'お',
        ko: '오',
        romaji: 'o',
        visualCue: '오른쪽 위에 둥근 점 하나가 꼭 찍혀 있어요'
      }
    ]
  }
];
