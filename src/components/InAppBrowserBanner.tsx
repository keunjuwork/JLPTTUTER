import React from 'react';
import { ExternalLink, VolumeX } from 'lucide-react';
import { InAppBrowserInfo } from '../lib/inAppBrowser';

interface InAppBrowserBannerProps {
  info: InAppBrowserInfo;
  onOpenModal: () => void;
}

export const InAppBrowserBanner: React.FC<InAppBrowserBannerProps> = ({
  info,
  onOpenModal
}) => {
  if (!info.isInApp) return null;

  return (
    <div className="bg-[#FFF3CC] border-b-2 border-[#FFD166] text-[#7A4F01] px-3 sm:px-5 py-2 text-xs font-bold print:hidden">
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-md bg-[#FFD166] text-[#7A4F01] flex items-center justify-center shrink-0">
            <VolumeX className="w-3.5 h-3.5" />
          </span>
          <span className="truncate">
            <strong className="text-[#2B2340]">[{info.appName || '앱 안 브라우저'}]</strong> 소리 안 남 · 발음과 효과음을 들으려면 기본 브라우저(Safari / Chrome)로 열어 주세요.
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-[11px] font-extrabold shrink-0 cursor-pointer shadow-xs transition-colors"
        >
          <span>다른 브라우저로 열기</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
