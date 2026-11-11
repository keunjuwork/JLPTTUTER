import React from 'react';
import { Coffee, Droplets, Play, Timer } from 'lucide-react';

interface BreakReminderModalProps {
  studyMinutesThreshold: number;
  onContinue: () => void;
  onFinishBreakEarly: () => void;
}

const BREAK_DURATION_SECONDS = 5 * 60;

export const BreakReminderModal: React.FC<BreakReminderModalProps> = ({
  studyMinutesThreshold,
  onContinue,
  onFinishBreakEarly
}) => {
  const [resting, setResting] = React.useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = React.useState(BREAK_DURATION_SECONDS);

  React.useEffect(() => {
    if (!resting) return;
    const timer = window.setInterval(() => {
      setRestSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resting]);

  React.useEffect(() => {
    if (resting && restSecondsLeft <= 0) {
      onFinishBreakEarly();
    }
  }, [resting, restSecondsLeft, onFinishBreakEarly]);

  const mins = Math.floor(restSecondsLeft / 60);
  const secs = String(restSecondsLeft % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2340]/55 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-[3px] border-[#FFE1C2] rounded-[28px] p-6 sm:p-7 shadow-2xl space-y-5 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] flex items-center justify-center text-[#FF6B57]">
          <Coffee className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-[#2B2340]">
            {studyMinutesThreshold}분 공부했어요. 5분만 쉬고 다시 해요!
          </h2>
          <p className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2B2340]/75">
            <Droplets className="w-4 h-4 text-[#4CC38A] shrink-0" />
            <span>물 한 잔 마시고 어깨·눈 스트레칭을 하며 잠깐 숨을 돌려 보세요.</span>
          </p>
        </div>

        {resting ? (
          <div className="bg-[#FFF7EC] border-2 border-[#4CC38A] rounded-[22px] p-5 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1E6E4A]">
              <Timer className="w-4 h-4" />
              <span>휴식 중 (학습 타이머 일시정지)</span>
            </div>
            <div className="text-4xl font-extrabold font-num text-[#2B2340]">
              {mins}:{secs}
            </div>
            <button
              type="button"
              onClick={onFinishBreakEarly}
              className="w-full py-3 rounded-full bg-[#4CC38A] hover:bg-[#3cb37a] text-white text-sm font-extrabold cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <Play className="w-4 h-4" />
              <span>충분히 쉬었어요, 다시 시작하기</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setResting(true)}
              className="flex-1 py-3 px-5 rounded-full bg-[#4CC38A] hover:bg-[#3cb37a] text-white text-sm font-extrabold cursor-pointer"
            >
              5분 쉬기
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="flex-1 py-3 px-5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:bg-[#FFEBD2] text-[#2B2340] text-sm font-extrabold cursor-pointer"
            >
              계속하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
