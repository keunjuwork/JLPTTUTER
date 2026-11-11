import React from 'react';
import {
  Clock,
  Cloud,
  CloudOff,
  Coins,
  Download,
  Lock,
  LogIn,
  LogOut,
  Menu,
  WifiOff,
  X
} from 'lucide-react';
import { User } from 'firebase/auth';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { MainTab } from '../types';

interface StudentHeaderProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  studentName: string;
  profileEmoji: string;
  level: number;
  coins: number;
  firebaseUser: User | null;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  isOnline: boolean;
  hasPendingSync: boolean;
  timerStatus: 'active' | 'idle' | 'off';
  activeMinutesToday: number;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  onOpenProfileModal: () => void;
  onOpenAdminGate: () => void;
}

const NAV_ITEMS: { id: MainTab; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'study', label: '학습실' },
  { id: 'game', label: '게임존' },
  { id: 'practice', label: '실전' },
  { id: 'print', label: '인쇄 센터' },
  { id: 'shop', label: '상점' },
  { id: 'records', label: '내 기록' }
];

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  activeTab,
  onSelectTab,
  studentName,
  profileEmoji,
  level,
  coins,
  firebaseUser,
  cloudSyncStatus,
  isOnline,
  hasPendingSync,
  timerStatus,
  activeMinutesToday,
  onGoogleLogin,
  onGoogleLogout,
  onOpenProfileModal,
  onOpenAdminGate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showIOSGuide, setShowIOSGuide] = React.useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b-2 border-[#FFE1C2] print:hidden">
        <div className="max-w-[1260px] mx-auto px-3 sm:px-5 h-[70px] flex items-center justify-between gap-2 lg:gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57] rounded-lg px-1"
          >
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#2B2340]">
              ARI JLPT
            </span>
            <span className="font-jp text-xs sm:text-sm font-extrabold text-[#FF6B57]">
              アリのにほんご
            </span>
          </button>

          {/* Zone 2: Desktop Single-Line Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="주 메뉴">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 rounded-full text-[13px] font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57] ${
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

          {/* Zone 3: Offline, Timer, Install, Coins, Student Profile, Sync & Admin */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!isOnline ? (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3CC] border-2 border-[#FFD166] text-[11px] font-extrabold text-[#7A4F01] whitespace-nowrap shrink-0"
                title="오프라인에서도 학습할 수 있어요. 온라인이 되면 자동 저장됩니다."
              >
                <WifiOff className="w-3.5 h-3.5 text-[#D97706]" />
                <span>오프라인 모드</span>
              </span>
            ) : (
              firebaseUser &&
              hasPendingSync && (
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF7EC] border border-[#FFD166] text-[11px] font-bold text-[#2B2340] whitespace-nowrap shrink-0">
                  동기화 대기
                </span>
              )
            )}

            {timerStatus !== 'off' && (
              <span
                className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold font-num whitespace-nowrap shrink-0 ${
                  timerStatus === 'active'
                    ? 'bg-[#E9F9F1] border border-[#4CC38A] text-[#1E6E4A]'
                    : 'bg-[#F4F1F7] border border-[#E8E3EF] text-[#2B2340]/60'
                }`}
                title={
                  timerStatus === 'active'
                    ? '실제 집중 학습 시간을 측정 중이에요 (5분 미조작 시 자동 일시정지)'
                    : '자리비움 또는 일시정지 상태예요'
                }
              >
                <Clock className="w-3 h-3" />
                <span>{timerStatus === 'active' ? `${activeMinutesToday}분 측정 중` : '일시정지'}</span>
              </span>
            )}

            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={install}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6B57]/12 border border-[#FF6B57]/35 hover:bg-[#FF6B57]/20 text-[11px] font-extrabold text-[#FF6B57] whitespace-nowrap shrink-0 cursor-pointer"
                title="홈 화면에 앱 설치"
              >
                <Download className="w-3.5 h-3.5" />
                <span>앱 설치</span>
              </button>
            )}

            {!isInstalled && !isInstallable && isIOS && (
              <button
                type="button"
                onClick={() => setShowIOSGuide(true)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-[11px] font-extrabold text-[#2B2340] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FF6B57]" />
                <span>홈 화면 추가</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectTab('shop')}
              title="보유 코인 · 상점 열기"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF7EC] border-2 border-[#FFD166] hover:bg-[#FFE9A8]/50 text-xs font-extrabold text-[#2B2340] tabular-nums whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{coins.toLocaleString()}</span>
            </button>

            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 rounded-full pl-1.5 pr-1 py-1 hover:bg-[#FFF7EC] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="프로필 이름 · 이모지 · 글자 크기 변경"
            >
              <span className="text-xs sm:text-sm font-bold text-[#2B2340] tabular-nums max-w-[100px] truncate">
                Lv.{level} {studentName}
              </span>
              <span className="w-8 h-8 rounded-full bg-[#FFE9A8] border-2 border-[#FFD166] flex items-center justify-center text-base leading-none shrink-0">
                {profileEmoji}
              </span>
            </button>

            {firebaseUser ? (
              <button
                type="button"
                onClick={onGoogleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 border-[#FFE1C2] bg-[#FFF9F0] text-xs font-semibold text-[#2B2340] hover:bg-[#FFEBD2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title={`${firebaseUser.email || ''} 로그아웃`}
              >
                <Cloud
                  className={`w-3.5 h-3.5 ${
                    cloudSyncStatus === 'syncing' ? 'text-[#FF6B57] animate-pulse' : 'text-[#4CC38A]'
                  }`}
                />
                <span className="hidden xl:inline">
                  {cloudSyncStatus === 'syncing' ? '동기화 중' : '클라우드 연결됨'}
                </span>
                <LogOut className="w-3 h-3 text-[#2B2340]/60" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoogleLogin}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border-2 border-[#FFE1C2] bg-[#FFF9F0] text-xs font-semibold text-[#2B2340] hover:bg-[#FFEBD2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Google 로그인으로 클라우드 자동 동기화"
              >
                <CloudOff className="w-3.5 h-3.5 text-[#2B2340]/50" />
                <span className="hidden xl:inline">Google 동기화</span>
                <LogIn className="w-3 h-3 text-[#FF6B57]" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAdminGate}
              aria-label="관리자 모드 열기"
              title="관리자 화면 (Google 관리자 + 4자리 PIN)"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#FFE1C2] bg-[#FFF9F0] hover:bg-[#2B2340] hover:text-white hover:border-[#2B2340] text-[#2B2340] flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6B57]"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Tablet/Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-full border-2 border-[#FFE1C2] flex items-center justify-center text-[#2B2340] cursor-pointer shrink-0"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tablet / Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#FFE1C2] bg-white px-4 py-3 space-y-2.5">
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
            <div className="pt-2 border-t border-[#FFE1C2] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenProfileModal();
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-bold text-[#2B2340] cursor-pointer"
                >
                  <span>{profileEmoji}</span>
                  <span>{studentName} 프로필 변경</span>
                </button>
                {!isInstalled && isInstallable && (
                  <button
                    type="button"
                    onClick={() => {
                      install();
                      setMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FF6B57] text-white text-xs font-extrabold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>앱 설치</span>
                  </button>
                )}
              </div>
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

      {/* iOS Safari Add-to-Home-Screen Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-[#2B2340]/55 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-extrabold text-[#2B2340]">iPhone / iPad 홈 화면에 추가</h3>
            <p className="text-xs sm:text-sm font-medium text-[#2B2340]/80 leading-relaxed">
              1. Safari 하단 또는 상단의 <strong>공유</strong> 버튼을 누르세요.
              <br />
              2. 아래로 내려 <strong>홈 화면에 추가</strong>를 선택하면 오프라인에서도 앱처럼 열 수 있어요!
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-full bg-[#FF6B57] text-white text-xs font-extrabold cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
