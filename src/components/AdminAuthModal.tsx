import React from 'react';
import { KeyRound, Lock, LogIn, ShieldCheck, X } from 'lucide-react';
import { User } from 'firebase/auth';

interface AdminAuthModalProps {
  firebaseUser: User | null;
  isGoogleAdmin: boolean;
  adminPin: string;
  onGoogleLogin: () => Promise<void>;
  onUnlockSuccess: () => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  firebaseUser,
  isGoogleAdmin,
  adminPin,
  onGoogleLogin,
  onUnlockSuccess,
  onClose
}) => {
  const [pinInput, setPinInput] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const handleLoginClick = async () => {
    setBusy(true);
    setErrorMsg('');
    try {
      await onGoogleLogin();
    } catch {
      setErrorMsg('Google 로그인에 실패했습니다. 팝업 차단을 해제하고 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGoogleAdmin) {
      setErrorMsg('먼저 관리자 권한이 등록된 Google 계정으로 로그인해 주세요.');
      return;
    }
    if (pinInput === adminPin) {
      onUnlockSuccess();
    } else {
      setErrorMsg('4자리 PIN 번호가 올바르지 않습니다.');
      setPinInput('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B2340]/60 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[28px] max-w-md w-full overflow-hidden shadow-xl">
        {/* Dark Navy Header */}
        <div className="bg-[#2B2340] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full bg-[#FFD166] text-[#2B2340] text-xs font-extrabold inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              관리자 인증
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Step 1: Google Admin Account */}
          <div className="rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#2B2340]/70">1단계 · Google 관리자 계정 확인</span>
              {isGoogleAdmin && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#4CC38A]">
                  <ShieldCheck className="w-4 h-4" /> 확인됨
                </span>
              )}
            </div>

            {!firebaseUser ? (
              <div className="space-y-2">
                <p className="text-xs text-[#2B2340]/75">
                  관리자 권한(Firestore <code className="font-mono">admins</code> 컬렉션)이 있는 Google 계정으로 먼저 로그인하세요.
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleLoginClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2B2340] hover:bg-[#3f345d] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{busy ? '로그인 중...' : '관리자 Google 로그인'}</span>
                </button>
              </div>
            ) : isGoogleAdmin ? (
              <div className="text-xs font-bold text-[#2B2340]">
                {firebaseUser.email} (관리자 권한 확인 완료)
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#FF6B57]">
                  현재 로그인된 계정({firebaseUser.email})에는 관리자 권한이 없습니다.
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleLoginClick}
                  className="w-full py-2 px-3 rounded-xl bg-white border-2 border-[#FFE1C2] text-xs font-bold text-[#2B2340] hover:bg-[#FFF1DF] cursor-pointer"
                >
                  다른 Google 계정으로 전환
                </button>
              </div>
            )}
          </div>

          {/* Step 2: 4-Digit PIN */}
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-pin-input" className="text-xs font-extrabold text-[#2B2340]/70 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#FF6B57]" />
                <span>2단계 · 4자리 PIN 번호</span>
              </label>
              <span className="text-[11px] font-semibold text-[#2B2340]/50">초기 PIN: 1234</span>
            </div>

            <input
              id="admin-pin-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                setErrorMsg('');
              }}
              placeholder="••••"
              className="w-full text-center tracking-[0.6em] text-2xl font-num font-extrabold py-3 rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] text-[#2B2340] focus:outline-none focus:border-[#FF6B57]"
              autoFocus
            />

            {errorMsg && (
              <p className="text-xs font-bold text-[#FF6B57] text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={!isGoogleAdmin || pinInput.length !== 4}
              className="w-full py-3 rounded-2xl bg-[#FF6B57] hover:bg-[#f15843] disabled:bg-[#E8E3EF] disabled:text-[#2B2340]/40 text-white text-sm font-extrabold transition-colors cursor-pointer"
            >
              관리자 화면 들어가기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
