import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  GoogleGenAI,
  HarmCategory,
  HarmBlockThreshold
} from '@google/genai';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, FieldValue, Transaction } from 'firebase-admin/firestore';

// ---------------------------------------------------------------------------
// 1. Firebase Admin Singleton Initialization
// ---------------------------------------------------------------------------
if (!getApps().length) {
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountVar) {
      const parsedAccount = typeof serviceAccountVar === 'string' && serviceAccountVar.startsWith('{')
        ? JSON.parse(serviceAccountVar)
        : JSON.parse(Buffer.from(serviceAccountVar, 'base64').toString('utf-8'));

      initializeApp({
        credential: cert(parsedAccount)
      });
    } else {
      initializeApp();
    }
  } catch (err) {
    console.error('Firebase Admin initialization error:', err);
  }
}

// ---------------------------------------------------------------------------
// 2. Helpers: Korea Standard Time (UTC+9) Date Key
// ---------------------------------------------------------------------------
function getKoreaDateKey(): string {
  const now = new Date();
  const kstOffsetMs = 9 * 60 * 60 * 1000;
  const kst = new Date(now.getTime() + kstOffsetMs);
  return kst.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// 3. Safety & Educational Relevance Verification
// ---------------------------------------------------------------------------
interface SafetyCheckResult {
  allowed: boolean;
  reason?: 'sensitive' | 'off_topic' | 'length';
  message?: string;
}

function checkSafetyAndEducationalRelevance(query: string): SafetyCheckResult {
  const clean = query.trim();

  // Length boundaries
  if (!clean || clean.length < 2) {
    return {
      allowed: false,
      reason: 'length',
      message: '질문 내용을 2글자 이상 입력해 주세요.'
    };
  }

  if (clean.length > 500) {
    return {
      allowed: false,
      reason: 'length',
      message: '질문은 최대 500자까지 입력할 수 있어요. 조금 더 짧게 질문해 주세요!'
    };
  }

  const normalized = clean.toLowerCase();

  // Category A: Sensitive, Harmful, Profane, or Exploit / Jailbreak Attempts
  const sensitivePatterns = [
    // Prompt injection & system exploit probes
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
    /system\s+prompt/i,
    /\bdan\s+mode\b/i,
    /\bjailbreak\b/i,
    /api[-_]?key/i,
    /service[-_]?account/i,
    /firestore\.rules/i,
    /관리자\s*(비밀번호|핀번호|pin|키)/i,
    // Profanity, abuse, sexual/NSFW, violence, self-harm
    /(시발|씨발|개새끼|지랄|병신|좆|존나|미친놈|씹새|꺼져|죽어|자살|자해|살인|성폭행|음란|야동|마약|도박)/i
  ];

  for (const pattern of sensitivePatterns) {
    if (pattern.test(normalized)) {
      return {
        allowed: false,
        reason: 'sensitive',
        message: '선생님과 나눈 대화는 학습 목적으로만 사용할 수 있어요. 부적절하거나 민감한 내용은 질문할 수 없어요 😊'
      };
    }
  }

  // Category B: Non-Educational & Off-Topic Query Patterns
  const offTopicPatterns = [
    // General programming / coding script requests
    /(파이썬|자바스크립트|c\+\+|리액트|코딩)\s*(코드|스크립트|프로그래밍|알고리즘|만들어|짜줘)/i,
    // Homework delegation / essay ghostwriting
    /(숙제|과제|독후감|보고서|에세이)\s*(대신|써줘|해줘|풀어줘)/i,
    // Stock / crypto / finance
    /(주식|코인|비트코인|로또|부동산)\s*(추천|전망|매수)/i,
    // Partisan politics
    /(대통령\s*선거|정당\s*지지|국회의원\s*비판)/i
  ];

  for (const pattern of offTopicPatterns) {
    if (pattern.test(normalized)) {
      return {
        allowed: false,
        reason: 'off_topic',
        message: '저는 일본어 학습(히라가나, 가타카나, 단어, 발음, 한자, 문법, 독해, 청해, JLPT)을 돕는 AI 선생님이에요! 일본어 공부와 관련된 질문을 남겨 주시면 친절하게 알려드릴게요 😊'
      };
    }
  }

  return { allowed: true };
}

// ---------------------------------------------------------------------------
// 4. Serverless Handler
// ---------------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Authenticate user via Firebase ID Token
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: '로그인이 필요합니다. (Authorization Bearer 토큰 누락)'
    });
  }

  const idToken = authHeader.split('Bearer ')[1].trim();
  let decodedToken: DecodedIdToken;

  try {
    const adminAuth = getAuth();
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({
      error: '인증 토큰이 유효하지 않거나 만료되었습니다. 다시 로그인해 주세요.'
    });
  }

  const uid = decodedToken.uid;
  if (!uid) {
    return res.status(401).json({ error: '사용자 ID를 확인할 수 없습니다.' });
  }

  // 2. Safety & Educational Relevance Pre-Checks
  const { question, currentLevel, studentName } = req.body || {};
  const safety = checkSafetyAndEducationalRelevance(typeof question === 'string' ? question : '');
  if (!safety.allowed) {
    return res.status(400).json({
      error: safety.message,
      reason: safety.reason,
      rejectedBySafety: true
    });
  }

  const cleanQuestion = (question as string).trim();

  // 3. Enforce Daily AI Usage Limit in Firestore
  const db = getFirestore();
  const todayKey = getKoreaDateKey();
  const usageDocId = `${uid}_${todayKey}`;
  const usageRef = db.collection('aiUsage').doc(usageDocId);

  // Default cap: 30 calls/day. Also honors custom admin cap if set in student doc.
  let dailyCap = 30;
  try {
    const studentSnap = await db.collection('students').doc(uid).get();
    if (studentSnap.exists) {
      const data = studentSnap.data();
      const customCap = data?.missionSettings?.aiDailyQuestionCap;
      if (typeof customCap === 'number' && customCap > 0 && customCap <= 200) {
        dailyCap = customCap;
      }
    }
  } catch {
    // fallback to standard 30
  }

  let currentCountAfter = 1;
  try {
    const transactionResult = await db.runTransaction(async (t: Transaction) => {
      const snap = await t.get(usageRef);
      const currentCount = snap.exists ? (snap.data()?.count || 0) : 0;
      if (currentCount >= dailyCap) {
        return { reachedLimit: true, count: currentCount };
      }
      const nextCount = currentCount + 1;
      t.set(
        usageRef,
        {
          uid,
          date: todayKey,
          count: nextCount,
          lastQuestionAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      return { reachedLimit: false, count: nextCount };
    });

    if (transactionResult.reachedLimit) {
      return res.status(429).json({
        error: `오늘 질문 횟수(${dailyCap}회)를 모두 사용했어요. 내일 다시 물어봐요!`,
        dailyCap,
        reachedLimit: true,
        remaining: 0
      });
    }
    currentCountAfter = transactionResult.count;
  } catch (err) {
    console.error('Firestore aiUsage transaction error:', err);
  }

  // 4. Verify Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is not configured');
    return res.status(503).json({
      error: '지금은 대답할 수 없어요'
    });
  }

  // 5. Call Gemini API with Model gemini-3.8-flash & Safety Settings
  const cleanLevel = typeof currentLevel === 'string' ? currentLevel : '0단계(가나·기초)';
  const cleanStudent = typeof studentName === 'string' && studentName ? studentName : '학생';

  const systemInstruction = `
당신은 "ARI JLPT – アリのにほんご"의 친절하고 상냥한 일본어 전문 AI 선생님입니다.
학습자는 일본어를 처음 배우는 중학생(${cleanStudent}, 현재 학습 레벨: ${cleanLevel})입니다.

[엄격한 응답 및 교육 규칙]
1. 오직 일본어 학습(히라가나, 가타카나, 단어, 발음, 한자, 문법, 독해, 청해, JLPT 시험 팁)에 관련된 질문에만 답변하세요.
2. 일본어 학습과 무관한 일반 상식, 코딩, 숙제 대행, 정치, 또는 개인정보/비밀을 묻는 질문은 정중하게 거절하세요.
   거절 시 예시: "저는 일본어 공부를 돕는 AI 선생님이에요! 일본어 글자나 단어, 문법에 대해 질문해 주시면 친절하게 알려드릴게요 😊"
3. 중학생 눈높이에 맞춰 쉽고 따뜻한 존댓말(해요체)로 한국어로 친절하게 설명하세요.
4. 설명할 때 어려운 일본어 문법 용어 대신 쉬운 비유와 실생활 예시를 들어 주세요.
5. 현재 단계(${cleanLevel})보다 어려운 내용은 최대한 쉽게 풀어서 안내하세요.
6. 답변 길이는 핵심만 3~5문장 내외로 명확하고 간결하게 작성하세요.
7. 일본어 단어나 예문이 나오면 한글 발음 표기(후리가나)를 함께 적어 주면 학습에 큰 도움이 됩니다.
`.trim();

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: cleanQuestion,
      config: {
        systemInstruction,
        maxOutputTokens: 600,
        temperature: 0.6,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
          }
        ]
      }
    });

    const reply = response.text || '선생님이 잠시 답변을 생각하지 못했어요. 다시 한 번 물어봐 줄래요?';
    return res.status(200).json({
      reply,
      todayDate: todayKey,
      remaining: Math.max(0, dailyCap - currentCountAfter),
      dailyCap
    });
  } catch (err: unknown) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      error: '지금은 대답할 수 없어요'
    });
  }
}
