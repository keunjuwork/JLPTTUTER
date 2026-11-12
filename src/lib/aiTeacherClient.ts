export interface AiTeacherResponse {
  reply?: string;
  error?: string;
  dailyCap?: number;
  remaining?: number;
  reachedLimit?: boolean;
  rejectedBySafety?: boolean;
  todayDate?: string;
}

export async function askAiTeacher(
  question: string,
  currentLevel: string,
  studentName: string,
  getIdToken: () => Promise<string | null>
): Promise<AiTeacherResponse> {
  const token = await getIdToken();
  if (!token) {
    return {
      error: 'AI 선생님과 대화하려면 로그인이 필요해요. 상단에서 Google 로그인을 진행해 주세요!'
    };
  }

  try {
    const res = await fetch('/api/ai-teacher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        question,
        currentLevel,
        studentName
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error: data.error || '선생님과 연결하는 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.',
        dailyCap: data.dailyCap,
        remaining: data.remaining,
        reachedLimit: Boolean(data.reachedLimit),
        rejectedBySafety: Boolean(data.rejectedBySafety)
      };
    }

    return {
      reply: data.reply,
      dailyCap: data.dailyCap,
      remaining: data.remaining,
      todayDate: data.todayDate
    };
  } catch (err) {
    console.error('askAiTeacher network error:', err);
    return {
      error: '네트워크 연결을 확인해 주세요.'
    };
  }
}
