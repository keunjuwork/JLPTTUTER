import React from 'react';
import { Check, Cloud, Sparkles, Type, X } from 'lucide-react';
import {
  DEFAULT_PROFILE_EMOJI,
  DEFAULT_STUDENT_NAME,
  FontSizeScale,
  PROFILE_EMOJI_OPTIONS
} from '../types';

interface ProfileSetupModalProps {
  mode: 'onboarding' | 'edit';
  initialName: string;
  initialEmoji: string;
  initialFontScale?: FontSizeScale;
  level: number;
  hasGoogleUser: boolean;
  onSave: (studentName: string, profileEmoji: string, fontSizeScale?: FontSizeScale) => void;
  onClose?: () => void;
  onGoogleLogin?: () => void;
}

const FONT_SCALE_OPTIONS: { id: FontSizeScale; label: string }[] = [
  { id: 'normal', label: '보통' },
  { id: 'large', label: '크게' },
  { id: 'xlarge', label: '아주 크게' }
];

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  mode,
  initialName,
  initialEmoji,
  initialFontScale = 'normal',
  level,
  hasGoogleUser,
  onSave,
  onClose,
  onGoogleLogin
}) => {
  const [name, setName] = React.useState(initialName || DEFAULT_STUDENT_NAME);
  const [emoji, setEmoji] = React.useState(initialEmoji || DEFAULT_PROFILE_EMOJI);
  const [fontScale, setFontScale] = React.useState<FontSizeScale>(initialFontScale);
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    setName(initialName || DEFAULT_STUDENT_NAME);
    setEmoji(initialEmoji || DEFAULT_PROFILE_EMOJI);
    setFontScale(initialFontScale || 'normal');
    setErrorMsg('');
  }, [initialName, initialEmoji, initialFontScale, mode]);

  const trimmedName = name.trim().slice(0, 40);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedName) {
      setErrorMsg('이름이나 닉네임을 1글자 이상 입력해 주세요.');
      return;
    }
    onSave(trimmedName, emoji || DEFAULT_PROFILE_EMOJI, fontScale);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B2340]/55 backdrop-blur-[2px] flex items-center justify-center p-4 print:hidden overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="bg-white border-[3px] border-[#FFD166] rounded-[28px] max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl my-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#FF6B57]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {mode === 'onboarding'
                  ? 'ARI JLPT – アリのにほんご · 모험 준비 완료!'
                  : 'ARI JLPT – アリのにほんご · 학생 프로필'}
              </span>
            </div>
            <h2 id="profile-modal-title" className="text-xl font-extrabold text-[#2B2340] mt-1">
              {mode === 'onboarding'
                ? '이름과 프로필 이모지를 정해 볼까요?'
                : '이름과 프로필 이모지 변경'}
            </h2>
            <p className="text-xs font-medium text-[#2B2340]/65 mt-1">
              {mode === 'onboarding'
                ? '입력한 이름은 홈 인사말, 학습지, 응원 메시지에 사용되며 언제든 바꿀 수 있어요.'
                : '변경한 내용은 상단 프로필, 홈, 인쇄 학습지, 클라우드에 바로 반영돼요.'}
            </p>
          </div>

          {mode === 'edit' && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="w-8 h-8 rounded-full bg-[#FFF7EC] hover:bg-[#FFEBD2] flex items-center justify-center text-[#2B2340] cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Header Pill Preview */}
        <div className="rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] p-3.5 flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-[#2B2340]/60">상단 프로필 미리보기</span>
          <div className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-[#FFE1C2] pl-3 pr-1.5 py-1 shadow-xs">
            <span className="text-sm font-bold text-[#2B2340] tabular-nums">
              Lv.{level} {trimmedName || DEFAULT_STUDENT_NAME}
            </span>
            <span className="w-8 h-8 rounded-full bg-[#FFE9A8] border-2 border-[#FFD166] flex items-center justify-center text-base leading-none">
              {emoji}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="student-profile-name-input"
              className="block text-xs font-extrabold text-[#2B2340]"
            >
              이름 (닉네임)
            </label>
            <input
              id="student-profile-name-input"
              type="text"
              maxLength={40}
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={DEFAULT_STUDENT_NAME}
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-sm font-bold text-[#2B2340] focus:outline-none focus:border-[#FF6B57]"
            />
            {errorMsg && <p className="text-xs font-bold text-[#FF6B57]">{errorMsg}</p>}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-extrabold text-[#2B2340]">프로필 이모지 선택</div>
            <div className="grid grid-cols-6 gap-2">
              {PROFILE_EMOJI_OPTIONS.map((item) => {
                const selected = emoji === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEmoji(item)}
                    aria-label={`이모지 ${item} 선택`}
                    aria-pressed={selected}
                    className={`h-11 rounded-2xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#FFE9A8] border-2 border-[#FF6B57] scale-105 shadow-sm'
                        : 'bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:border-[#FFB09E]'
                    }`}
                  >
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-extrabold text-[#2B2340] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#FF6B57]" />
              <span>글자 크기 (전체 화면 · 일본어 카드)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FONT_SCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontScale(opt.id)}
                  className={`py-2 px-3 rounded-2xl text-xs font-extrabold border-2 transition-colors cursor-pointer ${
                    fontScale === opt.id
                      ? 'bg-[#2B2340] border-[#2B2340] text-white'
                      : 'bg-[#FFF7EC] border-[#FFE1C2] text-[#2B2340]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            {mode === 'edit' && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full border-2 border-[#FFE1C2] bg-white hover:bg-[#FFF7EC] text-xs font-extrabold text-[#2B2340] cursor-pointer"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{mode === 'onboarding' ? '모험 시작하기!' : '프로필 저장하기'}</span>
            </button>
          </div>
        </form>

        {mode === 'onboarding' && !hasGoogleUser && onGoogleLogin && (
          <div className="pt-2 border-t border-[#FFE1C2] flex items-center justify-between gap-2 text-[11px] font-semibold text-[#2B2340]/65">
            <span>다른 기기에서 배운 기록이 있나요?</span>
            <button
              type="button"
              onClick={onGoogleLogin}
              className="inline-flex items-center gap-1 text-[#FF6B57] font-extrabold hover:underline cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Google 로그인 복원</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
