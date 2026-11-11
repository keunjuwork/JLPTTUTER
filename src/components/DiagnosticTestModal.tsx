import React from 'react';
import { ArrowRight, CheckCircle2, Clock, SkipForward, Sparkles, Volume2 } from 'lucide-react';
import {
  DIAGNOSTIC_QUESTIONS,
  DiagnosticEvaluation,
  evaluateDiagnosticAnswers
} from '../data/diagnosticTestData';
import { speakJapanese } from '../lib/speech';

interface DiagnosticTestModalProps {
  studentName: string;
  onComplete: (evalResult: DiagnosticEvaluation) => void;
  onSkip: () => void;
}

const TOTAL_SECONDS = 180; // 3 minutes max

export const DiagnosticTestModal: React.FC<DiagnosticTestModalProps> = ({
  studentName,
  onComplete,
  onSkip
}) => {
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<(number | null)[]>(() =>
    Array(DIAGNOSTIC_QUESTIONS.length).fill(null)
  );
  const [secondsLeft, setSecondsLeft] = React.useState(TOTAL_SECONDS);
  const [finished, setFinished] = React.useState(false);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[index];
  const currentPicked = answers[index];

  React.useEffect(() => {
    if (finished) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finished]);

  const evaluation = React.useMemo(
    () => evaluateDiagnosticAnswers(answers),
    [answers]
  );

  const handleSelectOption = (optIdx: number) => {
    const nextAnswers = [...answers];
    nextAnswers[index] = optIdx;
    setAnswers(nextAnswers);
  };

  const handleNext = () => {
    if (index + 1 >= DIAGNOSTIC_QUESTIONS.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 bg-[#2B2340]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white border-[3px] border-[#FFE1C2] rounded-[28px] shadow-2xl overflow-hidden my-auto">
        {/* Top Coral Banner */}
        <div className="bg-gradient-to-r from-[#FF6B57] to-[#FF8A76] text-white px-6 py-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-extrabold text-white/85 uppercase tracking-wider">
              3분 출발선 진단 테스트
            </div>
            <h2 className="text-lg font-extrabold">
              {studentName}의 알맞은 시작 단계 찾기
            </h2>
          </div>

          {!finished && (
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-extrabold font-num flex items-center gap-1.5 ${
                  secondsLeft <= 30 ? 'bg-white text-[#FF6B57]' : 'bg-white/20 text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {mins}:{secs}
                </span>
              </div>
              <button
                type="button"
                onClick={onSkip}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-xs font-bold text-white cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>건너뛰기</span>
              </button>
            </div>
          )}
        </div>

        {!finished ? (
          <div className="p-6 space-y-5">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#FF6B57]">{currentQuestion.categoryLabel}</span>
                <span className="font-num text-[#2B2340]/60">
                  {index + 1} / {DIAGNOSTIC_QUESTIONS.length}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#FFF7EC] overflow-hidden">
                <div
                  className="h-full bg-[#FF6B57] rounded-full transition-all duration-300"
                  style={{ width: `${((index + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Prompt Box */}
            <div className="bg-[#FFF7EC] border-2 border-[#FFE1C2] rounded-[22px] p-5 text-center space-y-3">
              <div className="text-sm font-bold text-[#2B2340]/85">
                {currentQuestion.prompt}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="font-jp text-3xl sm:text-4xl font-extrabold text-[#2B2340]">
                  {currentQuestion.jpHighlight}
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(currentQuestion.ttsText, 0.9)}
                  className="w-10 h-10 rounded-full bg-white border-2 border-[#FFE1C2] text-[#FF6B57] flex items-center justify-center cursor-pointer hover:bg-[#FFEBD2]"
                  title="일본어 발음 듣기"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const selected = currentPicked === idx;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-2xl border-2 text-left text-sm font-extrabold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      selected
                        ? 'bg-[#FF6B57] border-[#FF6B57] text-white shadow-sm'
                        : 'bg-white border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFF7EC]'
                    }`}
                  >
                    <span className="font-jp">{opt}</span>
                    <span
                      className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-num ${
                        selected ? 'bg-white/25 text-white' : 'bg-[#FFF7EC] text-[#2B2340]/60'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onSkip}
                className="text-xs font-bold text-[#2B2340]/55 hover:text-[#2B2340] cursor-pointer"
              >
                건너뛰고 0단계(あ행)부터 시작할래요
              </button>
              <button
                type="button"
                disabled={currentPicked === null}
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#2B2340] disabled:bg-[#E8E3EF] text-white text-sm font-extrabold cursor-pointer"
              >
                <span>{index + 1 >= DIAGNOSTIC_QUESTIONS.length ? '결과 보기' : '다음 문제'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="bg-[#FFF7EC] border-2 border-[#FFD166] rounded-[24px] p-5 text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD166] text-[#2B2340] text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>진단 결과: {evaluation.score} / {evaluation.total}문항 정답</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#2B2340]">
                {evaluation.summaryTitle}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#2B2340]/75 leading-relaxed">
                {evaluation.summaryText}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {evaluation.categoryBreakdown.map((item) => (
                <div
                  key={item.category}
                  className="bg-white border-2 border-[#FFE1C2] rounded-2xl p-3 text-center"
                >
                  <div className="text-[11px] font-bold text-[#2B2340]/60">{item.label}</div>
                  <div className="text-lg font-extrabold font-num text-[#2B2340] mt-0.5">
                    {item.correct}/{item.total}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onComplete(evaluation)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#FF6B57] hover:bg-[#ef5944] text-white text-sm font-extrabold cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>추천 단계({evaluation.recommendedLevel === 'STAGE0' ? `0단계 ${evaluation.recommendedSubLevel}코스` : `${evaluation.recommendedLevel} 월드`})로 시작하기</span>
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="py-3.5 px-5 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] text-xs font-extrabold text-[#2B2340] cursor-pointer"
              >
                0단계부터 시작
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
