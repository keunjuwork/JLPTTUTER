import React from 'react';
import { Sparkles, X, Send, Volume2, AlertCircle, HelpCircle, LogIn, MessageSquare } from 'lucide-react';
import { askAiTeacher, AiTeacherResponse } from '../lib/aiTeacherClient';
import { playJapaneseAudio } from '../lib/speech';

interface Message {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  time: string;
  isError?: boolean;
}

interface AiTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  currentLevel: string;
  isLoggedIn: boolean;
  onGoogleLogin: () => void;
  getIdToken: () => Promise<string | null>;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const QUICK_PROMPTS = [
  'あ와 お의 모양 차이가 헷갈려요',
  'は를 "와"로 읽을 때와 "하"로 읽을 때 차이',
  '촉음(っ)은 어떻게 발음하나요?',
  'N5 동사 ます형 만드는 규칙 알려줘'
];

export const AiTeacherModal: React.FC<AiTeacherModalProps> = ({
  isOpen,
  onClose,
  studentName,
  currentLevel,
  isLoggedIn,
  onGoogleLogin,
  getIdToken,
  onShowToast
}) => {
  const [question, setQuestion] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'init-1',
      sender: 'teacher',
      text: `안녕하세요, ${studentName}님! 일본어 공부를 함께하는 AI 선생님이에요 😊 히라가나, 단어, 문법, 발음 등 궁금한 점을 무엇이든 물어보세요!`,
      time: '방금'
    }
  ]);
  const [loading, setLoading] = React.useState(false);
  const [remainingQuota, setRemainingQuota] = React.useState<number | null>(null);
  const [dailyCap, setDailyCap] = React.useState<number>(30);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || question).trim();
    if (!textToSend || loading) return;

    if (!isLoggedIn) {
      onShowToast('AI 선생님과 대화하려면 먼저 Google 로그인을 해 주세요!', 'warning');
      return;
    }

    if (textToSend.length > 500) {
      onShowToast('질문은 최대 500자까지 작성할 수 있어요.', 'warning');
      return;
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      time: nowStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    const res: AiTeacherResponse = await askAiTeacher(
      textToSend,
      currentLevel,
      studentName,
      getIdToken
    );

    setLoading(false);

    if (res.dailyCap !== undefined) setDailyCap(res.dailyCap);
    if (res.remaining !== undefined) setRemainingQuota(res.remaining);

    if (res.reply) {
      const teacherMsg: Message = {
        id: `teacher-${Date.now()}`,
        sender: 'teacher',
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, teacherMsg]);
    } else if (res.error) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'teacher',
        text: res.error,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
      onShowToast(res.error, res.reachedLimit ? 'warning' : 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border-4 border-[#FFE1C2] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFF7EC] px-5 py-4 border-b-2 border-[#FFE1C2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B57] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[#2B2340] text-lg">AI 일본어 선생님</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FFE1C2] text-[#FF6B57]">
                  {currentLevel} 맞춤
                </span>
              </div>
              <p className="text-xs text-[#2B2340]/70 font-medium">
                {isLoggedIn
                  ? remainingQuota !== null
                    ? `오늘 남은 질문: ${remainingQuota}회 / ${dailyCap}회`
                    : `하루 최대 ${dailyCap}회 질문 가능 (중학생 맞춤 설명)`
                  : 'Google 로그인 후 1일 30회 이용 가능'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#FFE1C2]/60 text-[#2B2340] flex items-center justify-center border-2 border-[#FFE1C2] transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Gate Prompt (If Not Logged In) */}
        {!isLoggedIn && (
          <div className="bg-[#FFF1EE] border-b border-[#FFD5CC] px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#2B2340]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FF6B57] shrink-0" />
              <span>로그인하면 매일 30회까지 무료로 질문하고 설명을 들을 수 있어요.</span>
            </div>
            <button
              type="button"
              onClick={onGoogleLogin}
              className="px-3 py-1.5 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google 로그인</span>
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF7F2]">
          {messages.map((m) => {
            const isTeacher = m.sender === 'teacher';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isTeacher ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-bold text-[#2B2340]/60">
                    {isTeacher ? 'AI 선생님' : studentName}
                  </span>
                  <span className="text-[10px] text-[#2B2340]/40">{m.time}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    isTeacher
                      ? m.isError
                        ? 'bg-[#FFEBE8] border-2 border-[#FFC2B8] text-[#D83B2B]'
                        : 'bg-white border-2 border-[#FFE1C2] text-[#2B2340] shadow-xs'
                      : 'bg-[#FF6B57] text-white shadow-xs font-medium'
                  }`}
                >
                  {m.text}
                  {isTeacher && !m.isError && (
                    <div className="mt-2 pt-2 border-t border-[#FFE1C2]/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#2B2340]/50 font-medium">일본어 학습 도움말</span>
                      <button
                        type="button"
                        onClick={() => {
                          // Extract Japanese characters or play entire text
                          playJapaneseAudio(m.text);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF6B57] hover:underline cursor-pointer"
                        title="소리 듣기"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>듣기</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[11px] font-bold text-[#2B2340]/60">AI 선생님</span>
              </div>
              <div className="bg-white border-2 border-[#FFE1C2] rounded-2xl px-4 py-3 text-sm text-[#2B2340]/70 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF6B57] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#FF6B57] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#FF6B57] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs font-bold text-[#FF6B57] ml-1">답변을 생각하고 있어요...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#FFF7EC] px-4 py-2 border-t-2 border-[#FFE1C2] flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[11px] font-extrabold text-[#2B2340]/50 shrink-0 inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> 추천 질문:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading || !isLoggedIn}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FFE1C2] text-[#2B2340] border border-[#FFE1C2] text-[11px] font-bold shrink-0 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t-2 border-[#FFE1C2]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  isLoggedIn
                    ? '일본어 글자, 단어, 문법에 대해 물어보세요! (최대 500자)'
                    : 'Google 로그인 후 질문할 수 있어요'
                }
                disabled={!isLoggedIn || loading}
                maxLength={500}
                className="w-full bg-[#FFF7EC] rounded-full border-2 border-[#FFE1C2] px-4 py-2.5 pr-14 text-sm text-[#2B2340] placeholder:text-[#2B2340]/45 focus:outline-none focus:border-[#FF6B57] disabled:opacity-50 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#2B2340]/40">
                {question.length}/500
              </span>
            </div>
            <button
              type="submit"
              disabled={!isLoggedIn || loading || !question.trim()}
              className="px-4 py-2.5 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">질문하기</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
