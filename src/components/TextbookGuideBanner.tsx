import React from 'react';
import { BookOpen, Check, CheckCircle2, CornerDownLeft, X } from 'lucide-react';
import { TextbookCodeEntry } from '../data/textbookCodes';
import { TextbookCodeProgress, TextbookMissionKey } from '../types';

interface TextbookGuideBannerProps {
  entry: TextbookCodeEntry;
  progress?: TextbookCodeProgress;
  completionExp: number;
  isOnTargetScreen: boolean;
  onToggleMission: (missionKey: TextbookMissionKey) => void;
  onCompleteUnit: () => void;
  onJumpToUnit: () => void;
  onJumpToGame: () => void;
  onJumpToSrs: () => void;
  onClose: () => void;
}

export const TextbookGuideBanner: React.FC<TextbookGuideBannerProps> = ({
  entry,
  progress,
  completionExp,
  isOnTargetScreen,
  onToggleMission,
  onCompleteUnit,
  onJumpToUnit,
  onJumpToGame,
  onJumpToSrs,
  onClose
}) => {
  const isCompleted = Boolean(progress?.completedAt);
  const completedDate = progress?.completedAt ? progress.completedAt.slice(0, 10) : '';
  const missions = progress?.missions || {
    listen: false,
    write: false,
    game: false,
    review: false
  };
  const checkedCount = entry.missions.filter((m) => missions[m.key]).length;

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-4 print:hidden">
      <div className="bg-white border-[3px] border-[#FF6B57] rounded-[24px] p-4 sm:p-5 shadow-sm space-y-3.5">
        {/* Top Header Line */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B57] text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-[#2B2340]">
                  교재 p.{entry.pages} · {entry.code} 과예요.
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-[11px] font-bold text-[#FF6B57]">
                  {entry.book} · {entry.title}
                </span>
                <span className="text-[11px] font-num font-extrabold text-[#2B2340]/60">
                  미션 {checkedCount}/{entry.missions.length}
                </span>
              </div>
              <p className="text-xs font-medium text-[#2B2340]/70 mt-0.5">
                학습·게임 활동 시 자동 체크되며 직접 눌러서 체크할 수도 있어요. 완료하면 교재 완료 버튼을 눌러 주세요.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!isOnTargetScreen && (
              <button
                type="button"
                onClick={onJumpToUnit}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:border-[#FF6B57] text-xs font-extrabold text-[#2B2340] cursor-pointer transition-colors"
              >
                <CornerDownLeft className="w-3.5 h-3.5 text-[#FF6B57]" />
                <span>{entry.title} 화면으로</span>
              </button>
            )}

            {isCompleted ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4CC38A]/15 border-2 border-[#4CC38A] text-xs font-extrabold text-[#1E6E4A] tabular-nums">
                <CheckCircle2 className="w-4 h-4" />
                <span>완료됨 ({completedDate})</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onCompleteUnit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-xs font-extrabold cursor-pointer shadow-xs transition-colors"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>교재 완료 (+{completionExp} EXP)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="교재 안내 띠 닫기"
              className="w-8 h-8 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] hover:bg-[#FFEBD2] flex items-center justify-center text-[#2B2340]/65 hover:text-[#2B2340] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fallback notice (e.g. H-SP) */}
        {entry.fallbackNotice && (
          <div className="rounded-2xl bg-[#FFF3CC] border border-[#FFD166] px-3.5 py-2 text-xs font-bold text-[#7A4F01]">
            안내: {entry.fallbackNotice}
          </div>
        )}

        {/* 4 Textbook Missions Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {entry.missions.map((m) => {
            const done = Boolean(missions[m.key]);
            return (
              <div
                key={m.key}
                className={`rounded-2xl border-2 px-3 py-2 flex items-center justify-between gap-2 transition-colors ${
                  done
                    ? 'bg-[#E9F9F1] border-[#4CC38A]'
                    : 'bg-[#FFFDF9] border-[#FFE1C2]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleMission(m.key)}
                  className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      done
                        ? 'bg-[#4CC38A] text-white'
                        : 'border-2 border-[#FFD1B0] bg-white'
                    }`}
                  >
                    {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <span
                    className={`text-xs font-extrabold truncate ${
                      done ? 'text-[#1E6E4A]' : 'text-[#2B2340]'
                    }`}
                  >
                    {m.symbol} {m.label}
                  </span>
                </button>

                {m.key === 'game' && (
                  <button
                    type="button"
                    onClick={onJumpToGame}
                    className="px-2 py-0.5 rounded-full bg-[#6D5DF6]/12 hover:bg-[#6D5DF6]/20 text-[10px] font-extrabold text-[#5B4CE0] shrink-0 cursor-pointer"
                  >
                    게임 열기
                  </button>
                )}

                {m.key === 'review' && (
                  <button
                    type="button"
                    onClick={onJumpToSrs}
                    className="px-2 py-0.5 rounded-full bg-[#FF6B57]/12 hover:bg-[#FF6B57]/20 text-[10px] font-extrabold text-[#FF6B57] shrink-0 cursor-pointer"
                  >
                    복습 열기
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
