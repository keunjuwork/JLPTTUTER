import React from 'react';
import { Award, BookOpen, Calendar, CheckCircle2, Lock, X } from 'lucide-react';
import { ADVENTURE_STAGES, FOUR_WEEK_PLANS, LEVEL_EXAM_INFO } from '../data/adventureRoadmapData';
import { AdventureStage, JlptLevel, StudentState } from '../types';

interface ExamInfoAndRoadmapModalProps {
  mode: 'exam' | 'roadmap';
  state: StudentState;
  onClose: () => void;
  onSelectStage: (stage: AdventureStage) => void;
  onChangeLevel: (level: JlptLevel) => void;
  onTogglePlanTask?: (taskKey: string) => void;
}

const LEVELS: JlptLevel[] = ['STAGE0', 'N5', 'N4', 'N3', 'N2', 'N1'];

export const ExamInfoAndRoadmapModal: React.FC<ExamInfoAndRoadmapModalProps> = ({
  mode,
  state,
  onClose,
  onSelectStage,
  onChangeLevel,
  onTogglePlanTask
}) => {
  const [selectedInfoLevel, setSelectedInfoLevel] = React.useState<JlptLevel>(state.targetLevel);
  const info = LEVEL_EXAM_INFO[selectedInfoLevel];
  const fourWeekPlan = FOUR_WEEK_PLANS.find((p) => p.level === selectedInfoLevel);
  const planChecks = state.fourWeekPlanChecks || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#2B2340]/55 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFF7EC] border-[3px] border-[#FFE1C2] rounded-[28px] max-w-4xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="bg-white border-b-2 border-[#FFE1C2] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {mode === 'exam' ? (
              <BookOpen className="w-5 h-5 text-[#FF6B57]" />
            ) : (
              <Award className="w-5 h-5 text-[#FF6B57]" />
            )}
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2B2340]">
              {mode === 'exam' ? 'JLPT 급수별 시험 정보 & 4주 집중 플랜' : '전체 모험 지도 (0단계 → N1 합격 로드맵)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFF7EC] hover:bg-[#FFE1C2] flex items-center justify-center text-[#2B2340] cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {mode === 'exam' ? (
            <>
              {/* Level Selector */}
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedInfoLevel(lvl)}
                    className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-colors ${
                      selectedInfoLevel === lvl
                        ? 'bg-[#FF6B57] text-white'
                        : 'bg-white border-2 border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFF1DF]'
                    }`}
                  >
                    {lvl === 'STAGE0' ? '0단계 (가나)' : lvl}
                  </button>
                ))}
              </div>

              {/* Exam Overview Card */}
              <div className="bg-white rounded-[24px] border-[3px] border-[#FFE1C2] p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#2B2340]">{info.title}</h3>
                    <p className="text-sm text-[#2B2340]/70 mt-1">{info.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeLevel(selectedInfoLevel);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-full bg-[#2B2340] text-white text-xs font-bold hover:bg-[#3f345d] cursor-pointer whitespace-nowrap"
                  >
                    이 급수를 현재 목표로 선택
                  </button>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#FFF7EC] rounded-2xl p-3.5 border border-[#FFE1C2]">
                    <div className="text-xs text-[#2B2340]/65 font-medium">합격 기준</div>
                    <div className="text-lg font-extrabold text-[#FF6B57] tabular-nums mt-0.5">
                      {info.passScore} / {info.maxScore}점
                    </div>
                  </div>
                  <div className="bg-[#FFF7EC] rounded-2xl p-3.5 border border-[#FFE1C2]">
                    <div className="text-xs text-[#2B2340]/65 font-medium">총 시험 시간</div>
                    <div className="text-lg font-extrabold text-[#2B2340] tabular-nums mt-0.5">
                      {info.totalMinutes > 0 ? `${info.totalMinutes}분` : '단계 퀴즈'}
                    </div>
                  </div>
                  <div className="bg-[#FFF7EC] rounded-2xl p-3.5 border border-[#FFE1C2]">
                    <div className="text-xs text-[#2B2340]/65 font-medium">목표 어휘</div>
                    <div className="text-lg font-extrabold text-[#2B2340] tabular-nums mt-0.5">
                      약 {info.targetVocabCount.toLocaleString()}개
                    </div>
                  </div>
                  <div className="bg-[#FFF7EC] rounded-2xl p-3.5 border border-[#FFE1C2]">
                    <div className="text-xs text-[#2B2340]/65 font-medium">목표 한자</div>
                    <div className="text-lg font-extrabold text-[#2B2340] tabular-nums mt-0.5">
                      {info.targetKanjiCount > 0 ? `약 ${info.targetKanjiCount.toLocaleString()}자` : '가나 마스터'}
                    </div>
                  </div>
                </div>

                {/* Sections & Passing Minimums */}
                <div>
                  <h4 className="text-sm font-bold text-[#2B2340] mb-2.5">영역별 시험 시간 및 과락 기준</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {info.sections.map((sec) => (
                      <div key={sec.name} className="rounded-2xl border-2 border-[#FFE1C2] p-4 bg-[#FFFDF9]">
                        <div className="font-bold text-sm text-[#2B2340]">{sec.name}</div>
                        <div className="mt-2 text-xs text-[#2B2340]/75 space-y-1 tabular-nums">
                          <div>시간: {sec.minutes}분</div>
                          <div>배점: {sec.maxScore}점 · 과락 기준: {sec.minPassScore}점 미만</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Sub-levels */}
                <div>
                  <h4 className="text-sm font-bold text-[#2B2340] mb-2.5">세부 난이도 3단계 구성</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {info.subLevels.map((sub) => (
                      <div key={sub.sub} className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-3.5">
                        <div className="text-sm font-bold text-[#2B2340]">{sub.label}</div>
                        <div className="text-xs text-[#2B2340]/70 mt-1">{sub.focus}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4-Week Focus Plan Preview (20 weeks / 60 tasks dataset with interactive checks) */}
              {fourWeekPlan && (
                <div className="bg-white rounded-[24px] border-[3px] border-[#FFE1C2] p-6 space-y-4">
                  {(() => {
                    const completedForLevel = fourWeekPlan.weeks.reduce(
                      (acc, wk) =>
                        acc +
                        wk.tasks.filter((_, idx) =>
                          planChecks.includes(`${fourWeekPlan.level}_w${wk.week}_${idx}`)
                        ).length,
                      0
                    );
                    return (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-[#FF6B57]" />
                          <h4 className="text-base font-extrabold text-[#2B2340]">
                            {fourWeekPlan.level} 시험 전 4주 집중 플랜
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#4CC38A]/15 text-[#228558] text-xs font-extrabold tabular-nums">
                            체크 {completedForLevel} / 12 완료
                          </span>
                          <span className="text-xs font-bold text-[#2B2340]/60">
                            모험 지도 마지막 관문 (시험 D-28 집중)
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {fourWeekPlan.weeks.map((wk) => (
                      <div key={wk.week} className="rounded-2xl border-2 border-[#FFE1C2] bg-[#FFFDF9] p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-[#FF6B57]">{wk.week}주차 · {wk.title}</span>
                        </div>
                        <p className="text-xs text-[#2B2340]/75 bg-[#FFF7EC] rounded-xl p-2.5">
                          💡 {wk.tip}
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#2B2340]">
                          {wk.tasks.map((task, idx) => {
                            const taskKey = `${fourWeekPlan.level}_w${wk.week}_${idx}`;
                            const checked = planChecks.includes(taskKey);
                            return (
                              <li key={taskKey}>
                                <button
                                  type="button"
                                  onClick={() => onTogglePlanTask?.(taskKey)}
                                  className={`w-full text-left flex items-start gap-2 rounded-lg p-1.5 transition-colors cursor-pointer ${
                                    checked
                                      ? 'bg-[#4CC38A]/12 text-[#1f7d52] font-bold'
                                      : 'hover:bg-[#FFF7EC]'
                                  }`}
                                >
                                  <CheckCircle2
                                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                                      checked ? 'text-[#4CC38A]' : 'text-[#D9CEE6]'
                                    }`}
                                  />
                                  <span className={checked ? 'line-through opacity-85' : ''}>
                                    {task}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Full Adventure Map Roadmap */
            <div className="space-y-4">
              <p className="text-sm text-[#2B2340]/75">
                각 단계 퀴즈를 <strong className="text-[#FF6B57]">80% 이상</strong> 통과하면 다음 단계가 열리고 일본 문화 카드 1장을 획득해요!
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ADVENTURE_STAGES.map((stage) => {
                  const isDone = state.completedStages.includes(stage.id);
                  const isUnlocked = state.unlockedStages.includes(stage.id);
                  const isCurrent = state.currentStageId === stage.id;

                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => {
                        onSelectStage(stage);
                        onClose();
                      }}
                      className={`text-left rounded-[22px] border-[3px] p-4 transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-white border-[#4CC38A]/60 hover:border-[#4CC38A]'
                          : isCurrent || isUnlocked
                            ? 'bg-white border-[#FF6B57] shadow-sm'
                            : 'bg-[#F5F2F8] border-[#E8E3EF] opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-jp font-extrabold text-lg ${
                          isDone
                            ? 'bg-[#4CC38A] text-white'
                            : isUnlocked
                              ? 'bg-[#FF6B57] text-white'
                              : 'bg-[#E8E3EF] text-[#2B2340]/45'
                        }`}
                      >
                        {isUnlocked ? stage.badgeChar : <Lock className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-[#2B2340]/55">{stage.worldLabel}</div>
                        <div className="text-sm font-extrabold text-[#2B2340] mt-0.5 flex items-center justify-between gap-2">
                          <span>{stage.title}</span>
                          <span className="text-[11px] font-bold text-[#FF6B57]">
                            {isDone ? '완료' : isUnlocked ? '도전 가능' : '잠김'}
                          </span>
                        </div>
                        <p className="text-xs text-[#2B2340]/70 mt-1 line-clamp-2">{stage.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
