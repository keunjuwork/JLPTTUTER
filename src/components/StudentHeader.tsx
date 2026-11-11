import React from 'react';
import { Cloud, CloudOff, Lock, LogIn, LogOut, Menu, X } from 'lucide-react';
import { User } from 'firebase/auth';
import { MainTab } from '../types';

interface StudentHeaderProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  studentName: string;
  level: number;
  firebaseUser: User | null;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  onOpenAdminGate: () => void;
}

const NAV_ITEMS: { id: MainTab; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'study', label: '학습실' },
  { id: 'game', label: '게임존' },
  { id: 'print', label: '인쇄 센터' },
  { id: 'records', label: '내 기록' }
];

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  activeTab,
  onSelectTab,
  studentName,
  level,
  firebaseUser,
  cloudSyncStatus,
  onGoogleLogin,
  onGoogleLogout,
  onOpenAdminGate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-[#FFE1C2] print:hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-1.5 text-xl sm:text-[22px] font-extrabold tracking-tight whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57] rounded-lg px-1"
        >
          <span className="font-jp text-[#FF6B57]">にほんご</span>
          <span className="text-[#2B2340]">모험</span>
        </button>

        {/* Zone 2: Desktop Single-Line Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4" aria-label="주 메뉴">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57] ${
                  isActive
                    ? 'bg-[#FF6B57] text-white shadow-sm'
                    : 'text-[#2B2340]/80 hover:text-[#2B2340] hover:bg-[#FFF7EC]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Student Profile, Sync Status & Admin Lock */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('records')}
            className="flex items-center gap-2 rounded-full pl-2 pr-1.5 py-1 hover:bg-[#FFF7EC] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="내 기록 보기"
          >
            <span className="text-sm font-bold text-[#2B2340] tabular-nums">
              Lv.{level} {studentName}
            </span>
            <span className="w-8 h-8 rounded-full bg-[#FFE9A8] border-2 border-[#FFD166] flex items-center justify-center text-base leading-none">
              🌸
            </span>
          </button>

          {firebaseUser ? (
            <button
              type="button"
              onClick={onGoogleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#FFE1C2] bg-[#FFF9F0] text-xs font-semibold text-[#2B2340] hover:bg-[#FFEBD2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title={`${firebaseUser.email || ''} 로그아웃`}
            >
              <Cloud className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'text-[#FF6B57] animate-pulse' : 'text-[#4CC38A]'}`} />
              <span>{cloudSyncStatus === 'syncing' ? '동기화 중' : '클라우드 연결됨'}</span>
              <LogOut className="w-3 h-3 text-[#2B2340]/60" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoogleLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#FFE1C2] bg-[#FFF9F0] text-xs font-semibold text-[#2B2340] hover:bg-[#FFEBD2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Google 로그인으로 클라우드 자동 동기화"
            >
              <CloudOff className="w-3.5 h-3.5 text-[#2B2340]/50" />
              <span>Google 동기화</span>
              <LogIn className="w-3 h-3 text-[#FF6B57]" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAdminGate}
            aria-label="관리자 모드 열기"
            title="관리자 화면 (Google 관리자 + 4자리 PIN)"
            className="w-10 h-10 rounded-full border-2 border-[#FFE1C2] bg-[#FFF9F0] hover:bg-[#2B2340] hover:text-white hover:border-[#2B2340] text-[#2B2340] flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57]"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden w-10 h-10 rounded-full border-2 border-[#FFE1C2] flex items-center justify-center text-[#2B2340] cursor-pointer"
            aria-label="모바일 메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#FFE1C2] bg-white px-4 py-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3.5 py-2 rounded-full text-sm font-bold whitespace-nowrap cursor-pointer ${
                    isActive ? 'bg-[#FF6B57] text-white' : 'bg-[#FFF7EC] text-[#2B2340]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="pt-2 border-t border-[#FFE1C2] flex items-center justify-between">
            {firebaseUser ? (
              <button
                type="button"
                onClick={onGoogleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7EC] text-xs font-semibold text-[#2B2340] cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-[#4CC38A]" />
                <span>{firebaseUser.email} (로그아웃)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoogleLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7EC] text-xs font-semibold text-[#2B2340] cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FF6B57]" />
                <span>Google 로그인 동기화</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
