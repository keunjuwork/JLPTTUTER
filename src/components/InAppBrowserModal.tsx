import React from 'react';
import {
  AlertTriangle,
  Camera,
  Check,
  Compass,
  Copy,
  ExternalLink,
  Info,
  Sparkles,
  VolumeX,
  X
} from 'lucide-react';
import { InAppBrowserInfo } from '../lib/inAppBrowser';

interface InAppBrowserModalProps {
  info: InAppBrowserInfo;
  isOpen: boolean;
  onClose: () => void;
  onCopyUrl: () => void;
  copied: boolean;
}

export const InAppBrowserModal: React.FC<InAppBrowserModalProps> = ({
  info,
  isOpen,
  onClose,
  onCopyUrl,
  copied
}) => {
  if (!isOpen) return null;

  const currentHref = typeof window !== 'undefined' ? window.location.href : '';

  // App-specific instructions based on user specifications
  const renderAppInstructions = () => {
    switch (info.type) {
      case 'kakaotalk':
        return (
          <div className="space-y-1.5">
            <div className="font-extrabold text-[#2B2340] flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFD166]" />
              <span>카카오톡 안내</span>
            </div>
            <p className="text-xs text-[#2B2340]/80 leading-relaxed">
              화면 <strong className="text-[#FF6B57]">오른쪽 아래(또는 오른쪽 위) 메뉴(⋮ 또는 공유 아이콘)</strong>를 누른 뒤,
              <br />
              <strong className="text-[#2B2340]">「다른 브라우저로 열기」</strong> 또는 <strong className="text-[#2B2340]">「Safari로 열기」</strong>를 선택해 주세요.
            </p>
          </div>
        );
      case 'instagram':
      case 'facebook':
        return (
          <div className="space-y-1.5">
            <div className="font-extrabold text-[#2B2340] flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFD166]" />
              <span>{info.appName || '인스타그램/페이스북'} 안내</span>
            </div>
            <p className="text-xs text-[#2B2340]/80 leading-relaxed">
              화면 <strong className="text-[#FF6B57]">오른쪽 위 메뉴(⋯)</strong>를 누른 뒤,
              <br />
              <strong className="text-[#2B2340]">「브라우저에서 열기」</strong> 또는 <strong className="text-[#2B2340]">「Safari에서 열기」</strong>를 선택해 주세요.
            </p>
          </div>
        );
      case 'naver':
        return (
          <div className="space-y-1.5">
            <div className="font-extrabold text-[#2B2340] flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFD166]" />
              <span>네이버 앱 안내</span>
            </div>
            <p className="text-xs text-[#2B2340]/80 leading-relaxed">
              화면 <strong className="text-[#FF6B57]">오른쪽 아래 메뉴(⋯ 또는 공유)</strong>를 누른 뒤,
              <br />
              <strong className="text-[#2B2340]">「다른 브라우저로 열기」</strong>를 선택해 주세요.
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-1.5">
            <div className="font-extrabold text-[#2B2340] flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFD166]" />
              <span>{info.appName || '앱 안 브라우저'} 안내</span>
            </div>
            <p className="text-xs text-[#2B2340]/80 leading-relaxed">
              화면 <strong className="text-[#FF6B57]">오른쪽 위 또는 아래 메뉴(⋮ / ⋯ / 공유)</strong>에서
              <br />
              <strong className="text-[#2B2340]">「기본 브라우저로 열기」</strong> 또는 <strong className="text-[#2B2340]">「Safari로 열기」</strong>를 눌러 주세요.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inapp-browser-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white border-[3px] border-[#FF6B57] rounded-[28px] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3CC] border-2 border-[#FFD166] text-[#D97706] flex items-center justify-center shrink-0">
              <VolumeX className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF6B57]/12 text-[11px] font-extrabold text-[#FF6B57]">
                <AlertTriangle className="w-3 h-3" />
                <span>{info.appName || '앱 내부 브라우저'} 감지</span>
              </div>
              <h2
                id="inapp-browser-title"
                className="text-base sm:text-lg font-extrabold text-[#2B2340] mt-0.5 leading-snug"
              >
                소리를 들으려면 다른 브라우저로 열어 주세요
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="안내 닫기"
            className="w-8 h-8 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] hover:bg-[#FFEBD2] flex items-center justify-center text-[#2B2340]/65 hover:text-[#2B2340] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lead sentence */}
        <p className="text-xs sm:text-sm font-medium text-[#2B2340]/85 leading-relaxed bg-[#FFF7EC] p-3.5 rounded-2xl border border-[#FFE1C2]">
          지금은 <strong>{info.appName || '앱 안'}에서 열려 있어서</strong> 일본어 발음(음성 합성)과 게임 효과음이 나오지 않아요.
          <br className="hidden sm:inline" />
          {' '}기본 브라우저(Safari / Chrome)에서 열면 모든 소리와 Google 로그인이 정상 작동합니다!
        </p>

        {/* App-specific steps */}
        <div className="rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] p-4 space-y-2.5">
          {renderAppInstructions()}
          <p className="text-[11px] font-bold text-[#2B2340]/55 pt-1 border-t border-[#FFE1C2]/60">
            ※ 기기마다 메뉴 이름이 조금 달라요.
          </p>
        </div>

        {/* Link Copy Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[#2B2340]">주소 복사 후 직접 열기</span>
            {copied && (
              <span className="text-[11px] font-extrabold text-[#1E6E4A] inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>복사 완료!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentHref}
              onFocus={(e) => e.target.select()}
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border-2 border-[#FFE1C2] bg-[#FFF7EC] text-xs font-num font-bold text-[#2B2340] select-all focus:outline-none focus:border-[#FF6B57]"
              aria-label="현재 웹앱 주소"
            />
            <button
              type="button"
              onClick={onCopyUrl}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors ${
                copied
                  ? 'bg-[#4CC38A] text-white'
                  : 'bg-[#FF6B57] hover:bg-[#ef5944] text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '복사됨' : '링크 복사'}</span>
            </button>
          </div>
          <p className="text-[11px] font-medium text-[#2B2340]/60">
            복사가 막히면 위 주소를 길게 눌러 직접 복사한 뒤 Safari나 Chrome 주소창에 붙여넣어 주세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={onCopyUrl}
            className="w-full sm:flex-1 py-3 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Copy className="w-4 h-4" />
            <span>링크 복사하고 Safari/Chrome에서 열기</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:bg-[#FFEBD2] text-[#2B2340] text-xs font-extrabold cursor-pointer whitespace-nowrap"
          >
            그래도 계속하기
          </button>
        </div>

        {/* Bottom camera tip */}
        <div className="rounded-xl bg-[#F4F1F7] border border-[#E8E3EF] p-2.5 flex items-start gap-2 text-[11px] font-bold text-[#2B2340]/75">
          <Camera className="w-4 h-4 text-[#FF6B57] shrink-0 mt-0.5" />
          <span>
            QR을 찍을 때는 폰 기본 카메라 앱을 쓰면 바로 Safari/Chrome에서 열려요.
          </span>
        </div>
      </div>
    </div>
  );
};
