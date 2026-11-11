import { ADVENTURE_STAGES } from './adventureRoadmapData';
import { JlptLevel, SubDifficulty } from '../types';

export type DiagnosticCategory = 'hiragana' | 'katakana' | 'vocab' | 'grammar';

export interface DiagnosticQuestion {
  id: string;
  category: DiagnosticCategory;
  categoryLabel: string;
  prompt: string;
  jpHighlight: string;
  ttsText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// 12 questions ordered: Hiragana (3) -> Katakana (3) -> Basic Vocab (3) -> Basic Grammar (3)
export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag_h_1',
    category: 'hiragana',
    categoryLabel: '1단계 · 히라가나 읽기',
    prompt: '이 히라가나 글자의 발음은 무엇일까요?',
    jpHighlight: 'あ',
    ttsText: 'あ',
    options: ['아 (a)', '오 (o)', '이 (i)', '우 (u)'],
    correctIndex: 0,
    explanation: 'あ는 히라가나의 첫 글자 "아 [a]"예요. 오른쪽 위에 점이 없으면 あ, 있으면 お(오)입니다.'
  },
  {
    id: 'diag_h_2',
    category: 'hiragana',
    categoryLabel: '1단계 · 히라가나 읽기',
    prompt: '가로줄이 2개 달린 이 글자의 소리는?',
    jpHighlight: 'き',
    ttsText: 'き',
    options: ['사 (sa)', '키 (ki)', '치 (chi)', '케 (ke)'],
    correctIndex: 1,
    explanation: '열쇠(Key) 톱니 2개 모양의 き는 "키 [ki]"입니다. 1줄은 さ(사)예요.'
  },
  {
    id: 'diag_h_3',
    category: 'hiragana',
    categoryLabel: '1단계 · 히라가나 읽기',
    prompt: '다음 히라가나 단어를 소리 내어 읽으면?',
    jpHighlight: 'ねこ',
    ttsText: 'ねこ',
    options: ['누코 (nuko)', '메코 (meko)', '네코 (neko)', '레코 (reko)'],
    correctIndex: 2,
    explanation: 'ね(네) + こ(코) = ねこ(고양이)입니다!'
  },
  {
    id: 'diag_k_1',
    category: 'katakana',
    categoryLabel: '2단계 · 가타카나 읽기',
    prompt: '이 가타카나 글자의 소리는 무엇일까요?',
    jpHighlight: 'ア',
    ttsText: 'ア',
    options: ['아 (a)', '카 (ka)', '마 (ma)', '야 (ya)'],
    correctIndex: 0,
    explanation: 'ア는 히라가나 あ에 해당하는 가타카나 "아 [a]"입니다.'
  },
  {
    id: 'diag_k_2',
    category: 'katakana',
    categoryLabel: '2단계 · 가타카나 읽기',
    prompt: '점 두 개가 아래에서 위로 올라가는 이 가타카나는?',
    jpHighlight: 'シ',
    ttsText: 'シ',
    options: ['츠 (tsu)', '소 (so)', '응 (n)', '시 (shi)'],
    correctIndex: 3,
    explanation: '웃는 얼굴처럼 점이 세로로 놓이고 올려 그으면 シ(시), 점이 가로로 놓이고 내리면 ツ(츠)예요.'
  },
  {
    id: 'diag_k_3',
    category: 'katakana',
    categoryLabel: '2단계 · 가타카나 읽기',
    prompt: '편의점에서 자주 보이는 가타카나 「パン」의 뜻은?',
    jpHighlight: 'パン',
    ttsText: 'パン',
    options: ['펜', '빵', '우유', '컵'],
    correctIndex: 1,
    explanation: 'パ(파) + ン(응/ㄴ받침) = パン(빵)입니다!'
  },
  {
    id: 'diag_v_1',
    category: 'vocab',
    categoryLabel: '3단계 · 기초 단어',
    prompt: '일본어 아침 인사 「おはようございます」의 뜻은?',
    jpHighlight: 'おはようございます',
    ttsText: 'おはようございます',
    options: ['안녕히 계세요', '죄송합니다', '안녕하세요 (아침 인사)', '잘 먹겠습니다'],
    correctIndex: 2,
    explanation: 'おはようございます는 아침에 만났을 때 하는 정중한 인사말이에요.'
  },
  {
    id: 'diag_v_2',
    category: 'vocab',
    categoryLabel: '3단계 · 기초 단어',
    prompt: '가게에서 직원을 부르거나 사과할 때 쓰는 단어 「すみません」은?',
    jpHighlight: 'すみません',
    ttsText: 'すみません',
    options: ['고맙습니다', '죄송합니다 / 저기요', '괜찮습니다', '내일 만나요'],
    correctIndex: 1,
    explanation: 'すみません은 "미안합니다"와 식당·역에서 "저기요/실례합니다" 두 가지 뜻으로 널리 써요.'
  },
  {
    id: 'diag_v_3',
    category: 'vocab',
    categoryLabel: '3단계 · 기초 단어',
    prompt: '기초 단어 「学生 (がくせい)」의 올바른 뜻은?',
    jpHighlight: '学生',
    ttsText: 'がくせい',
    options: ['선생님', '친구', '학교', '학생'],
    correctIndex: 3,
    explanation: '学生(がくせい)는 "학생"이라는 뜻이에요! 중학생은 中学生(ちゅうがくせい)랍니다.'
  },
  {
    id: 'diag_g_1',
    category: 'grammar',
    categoryLabel: '4단계 · 기초 문법',
    prompt: '"저는 아리입니다"를 만들 때 빈칸에 들어갈 조사는? (발음: 와)',
    jpHighlight: 'わたし (  ) アリ です。',
    ttsText: 'わたしはアリです',
    options: ['は', 'を', 'へ', 'も'],
    correctIndex: 0,
    explanation: '주제를 나타내는 조사 "~은/는"은 글자로 は로 쓰고 발음만 "와"라고 읽어요.'
  },
  {
    id: 'diag_g_2',
    category: 'grammar',
    categoryLabel: '4단계 · 기초 문법',
    prompt: '"이 책은 재미있습니다"로 쓸 때 알맞은 표현은?',
    jpHighlight: '(    ) 本は おもしろいです。',
    ttsText: 'この本はおもしろいです',
    options: ['これ', 'この', 'ここ', 'それ'],
    correctIndex: 1,
    explanation: '뒤에 명사(本)가 바로 이어질 때는 これ가 아니라 この + 명사를 사용해요!'
  },
  {
    id: 'diag_g_3',
    category: 'grammar',
    categoryLabel: '4단계 · 기초 문법',
    prompt: '동사 "공부하다(べんきょうする)"를 공손한 현재·미래형 "~합니다"로 바꾸면?',
    jpHighlight: 'まいにち 日本語を (        )。',
    ttsText: 'まいにちにほんごをべんきょうします',
    options: ['べんきょうした', 'べんきょうする', 'べんきょうします', 'べんきょうしませんでした'],
    correctIndex: 2,
    explanation: '3류 동사 する의 정중한 현재·미래형("~합니다")은 します(べんきょうします)입니다.'
  }
];

export interface DiagnosticEvaluation {
  score: number;
  total: number;
  recommendedLevel: JlptLevel;
  recommendedSubLevel: SubDifficulty;
  recommendedStageId: string;
  unlockedStages: string[];
  summaryTitle: string;
  summaryText: string;
  categoryBreakdown: { category: DiagnosticCategory; label: string; correct: number; total: number }[];
}

export function evaluateDiagnosticAnswers(answers: (number | null)[]): DiagnosticEvaluation {
  const breakdownMap: Record<DiagnosticCategory, { label: string; correct: number; total: number }> = {
    hiragana: { label: '히라가나', correct: 0, total: 0 },
    katakana: { label: '가타카나', correct: 0, total: 0 },
    vocab: { label: '기초 단어', correct: 0, total: 0 },
    grammar: { label: '기초 문법', correct: 0, total: 0 }
  };

  let score = 0;
  DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
    breakdownMap[q.category].total += 1;
    if (answers[idx] === q.correctIndex) {
      score += 1;
      breakdownMap[q.category].correct += 1;
    }
  });

  let recommendedLevel: JlptLevel = 'STAGE0';
  let recommendedSubLevel: SubDifficulty = 1;
  let recommendedStageId = 'stage_h_a';
  let summaryTitle = '0단계 기초 · あ행부터 차근차근 시작해요!';
  let summaryText =
    '일본어 첫 출발에 딱 맞는 0단계 1코스(히라가나 あ행)부터 시작하면 글자 모양과 발음이 흔들리지 않고 탄탄하게 쌓여요.';

  if (score >= 11) {
    recommendedLevel = 'N5';
    recommendedSubLevel = 2;
    recommendedStageId = 'stage_n5';
    summaryTitle = 'JLPT N5 · 핵심 완성 단계 추천!';
    summaryText =
      '가나와 기초 입문 문법을 이미 아주 잘 알고 있어요! 바로 N5 월드로 이동해서 동사 활용과 N5 어휘·한자를 정복해 봐요.';
  } else if (score >= 9) {
    recommendedLevel = 'N5';
    recommendedSubLevel = 1;
    recommendedStageId = 'stage_n5';
    summaryTitle = 'JLPT N5 · 기초 다지기 추천!';
    summaryText =
      '가타카나와 기초 표현 감각이 좋아요. N5 월드 1단계에서 필수 어휘와 한자 100자 도전을 바로 시작할 수 있어요!';
  } else if (score >= 6) {
    recommendedLevel = 'STAGE0';
    recommendedSubLevel = 3;
    recommendedStageId = 'stage_katakana';
    summaryTitle = '0단계 실전 심화 · 가타카나 월드 추천!';
    summaryText =
      '히라가나 기초를 잘 읽고 있어요. 0단계 3코스(가타카나 & 헷갈리는 글자 정복)부터 이어서 달려 봐요!';
  } else if (score >= 4) {
    recommendedLevel = 'STAGE0';
    recommendedSubLevel = 2;
    recommendedStageId = 'stage_h_sa';
    summaryTitle = '0단계 핵심 완성 · さ행부터 도전해요!';
    summaryText =
      '모음과 기초 글자를 일부 알고 있어요! 헷갈리기 쉬운 さ·た·な행부터 차근차근 복습하며 속도를 올려 보자!';
  }

  const targetOrder =
    ADVENTURE_STAGES.find((s) => s.id === recommendedStageId)?.order ?? 1;
  const unlockedStages = ADVENTURE_STAGES.filter((s) => s.order <= targetOrder).map((s) => s.id);

  return {
    score,
    total: DIAGNOSTIC_QUESTIONS.length,
    recommendedLevel,
    recommendedSubLevel,
    recommendedStageId,
    unlockedStages,
    summaryTitle,
    summaryText,
    categoryBreakdown: (['hiragana', 'katakana', 'vocab', 'grammar'] as DiagnosticCategory[]).map(
      (cat) => ({
        category: cat,
        ...breakdownMap[cat]
      })
    )
  };
}
