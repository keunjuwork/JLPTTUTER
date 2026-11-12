import React from 'react';
import { Award, BookOpen, Download, Lock, Medal, Pencil, Sparkles, Type, Upload, X } from 'lucide-react';
import { BADGE_DEFS, CULTURE_CARDS } from '../data/cultureAndBadgesData';
import { HIRAGANA_BASIC, KATAKANA_BASIC } from '../data/kanaData';
import { TEXTBOOK_BOOK1_CODES } from '../data/textbookCodes';
import { getTextbookProgressSummary } from '../lib/storage';
import { CultureCard, FontSizeScale, MainTab, StudentState, StudySubTab } from '../types';

interface RecordsViewProps {
  state: StudentState;
  onNavigateFromBadge: (tab: MainTab, studySubTab?: StudySubTab) => void;
  onOpenProfileModal: () => void;
  onChangeFontSizeScale: (scale: FontSizeScale) => void;
  onOpenTextbookCode: (code: string) => void;
  onExportJson: () => void;
  onImportJson: (raw: string) => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  state,
  onNavigateFromBadge,
  onOpenProfileModal,
  onChangeFontSizeScale,
  onOpenTextbookCode,
  onExportJson,
  onImportJson
}) => {
  const [selectedCard, setSelectedCard] = React.useState<CultureCard | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImportJson(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const learnedHira = HIRAGANA_BASIC.filter((k) => state.learnedKana.includes(k.char)).length;
  const learnedKata = KATAKANA_BASIC.filter((k) => state.learnedKana.includes(k.char)).length;
  const textbookSummary = getTextbookProgressSummary(state);

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Summary & JSON Backup Bar */}
      <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenProfileModal}
            title="프로필 이모지 변경"
            className="w-14 h-14 rounded-full bg-[#FFE9A8] border-[3px] border-[#FFD166] flex items-center justify-center text-3xl leading-none shrink-0 cursor-pointer hover:scale-105 transition-transform"
          >
            {state.profileEmoji || '🌸'}
          </button>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-[#2B2340]">{state.studentName}의 모험 기록</h1>
              <button
                type="button"
                onClick={onOpenProfileModal}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:border-[#FF6B57] text-xs font-extrabold text-[#2B2340] cursor-pointer transition-colors"
              >
                <Pencil className="w-3 h-3 text-[#FF6B57]" />
                <span>이름 · 이모지 변경</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#2B2340]/70 tabular-nums">
              <span>Lv.{state.level} (총 {state.exp.toLocaleString()} EXP · 🪙 {state.coins.toLocaleString()} C)</span>
              <span aria-hidden="true">·</span>
              <span>가나 {learnedHira + learnedKata}/92자</span>
              <span aria-hidden="true">·</span>
              <span>단어 {state.learnedVocab.length} · 한자 {state.learnedKanji.length} · 문법 {state.learnedGrammar.length}</span>
              <span aria-hidden="true">·</span>
              <span>모의고사 {state.mockExamHistory.length}회</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onExportJson}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF7EC] border-2 border-[#FFE1C2] hover:bg-[#FFEBD2] text-xs font-extrabold text-[#2B2340] cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#FF6B57]" />
            <span>JSON 백업 저장</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2B2340] hover:bg-[#3f345d] text-white text-xs font-extrabold cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#FFD166]" />
            <span>백업 불러오기</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Display Accessibility: 3-Step Font Size Scale */}
      <section className="bg-white border-[3px] border-[#FFE1C2] rounded-[24px] p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] flex items-center justify-center text-[#FF6B57] shrink-0">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[#2B2340]">
              화면 · 일본어 카드 글자 크기 (3단계)
            </div>
            <div className="text-xs font-medium text-[#2B2340]/65">
              본문과 학습실 일본어 큰 글자 카드에 함께 적용돼요 ·{' '}
              <span className="font-jp font-bold text-[#2B2340]">あいうえお</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[
            { id: 'normal' as const, label: '보통' },
            { id: 'large' as const, label: '크게' },
            { id: 'xlarge' as const, label: '아주 크게' }
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeFontSizeScale(opt.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold border-2 transition-colors cursor-pointer ${
                (state.fontSizeScale || 'normal') === opt.id
                  ? 'bg-[#2B2340] border-[#2B2340] text-white'
                  : 'bg-[#FFF7EC] border-[#FFE1C2] text-[#2B2340] hover:bg-[#FFEBD2]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* 1. Badges Grid (Click navigates to corresponding learning screen!) */}
      <section className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-[#FFD166]" />
            <h2 className="text-lg font-extrabold text-[#2B2340]">배지 컬렉션 ({state.badges.length} / {BADGE_DEFS.length})</h2>
          </div>
          <span className="text-xs font-semibold text-[#2B2340]/60">배지를 누르면 관련 학습 화면으로 바로 이동해요!</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {BADGE_DEFS.map((b) => {
            const unlocked = state.badges.includes(b.id);
            const badgeBg = !unlocked
              ? 'bg-[#E8E3EF] text-[#2B2340]/40'
              : b.accentColor === 'gold'
                ? 'bg-[#FFD166] text-[#2B2340]'
                : b.accentColor === 'coral'
                  ? 'bg-[#FF6B57] text-white'
                  : b.accentColor === 'navy'
                    ? 'bg-[#2B2340] text-white'
                    : 'bg-[#4CC38A] text-white';

            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onNavigateFromBadge(b.targetTab, b.targetStudySubTab)}
                className={`text-left rounded-2xl border-2 p-4 transition-all cursor-pointer flex flex-col gap-3 ${
                  unlocked
                    ? 'bg-[#FFFDF9] border-[#FFE1C2] hover:border-[#FF6B57]'
                    : 'bg-[#F8F6FA] border-[#E8E3EF] opacity-80 hover:opacity-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-jp font-extrabold text-sm ${badgeBg}`}>
                  {unlocked ? b.shortLabel : '?'}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#2B2340]">{b.title}</div>
                  <div className="text-[11px] text-[#2B2340]/65 mt-1 leading-snug">
                    {unlocked ? b.description : b.conditionText}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Japanese Culture Cards Collection */}
      <section className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF6B57]" />
            <h2 className="text-lg font-extrabold text-[#2B2340]">
              일본 문화 카드 도감 ({state.cultureCards.length} / {CULTURE_CARDS.length})
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#2B2340]/60">모험 지도 단계를 80% 이상 통과하면 획득!</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CULTURE_CARDS.map((card) => {
            const unlocked = state.cultureCards.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className={`rounded-2xl border-2 p-3.5 text-center transition-transform hover:scale-[1.02] cursor-pointer flex flex-col items-center gap-2 ${
                  unlocked
                    ? 'bg-[#FFF7EC] border-[#FFD166]'
                    : 'bg-[#F4F1F7] border-[#E8E3EF] opacity-75'
                }`}
              >
                <div className="text-3xl leading-none">
                  {unlocked ? card.emoji : <Lock className="w-7 h-7 text-[#2B2340]/35" />}
                </div>
                <div className="text-xs font-extrabold text-[#2B2340] line-clamp-1">
                  {unlocked ? card.title : '잠긴 문화 카드'}
                </div>
                <div className="text-[10px] font-bold text-[#2B2340]/55">{card.category}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Textbook Progress Table (0단계 1권) */}
      <section className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] text-[#FF6B57] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#2B2340]">
                교재 진도 (0단계 1권)
              </h2>
              <p className="text-xs font-medium text-[#2B2340]/65 mt-0.5">
                Part 1(H-A ~ H-TEST) 전체 완료 시 보너스 EXP와 「히라가나 교재 완주」 배지를 받아요!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 tabular-nums">
            <span className="px-3 py-1 rounded-full bg-[#FFF7EC] border border-[#FFE1C2] text-xs font-extrabold text-[#2B2340]">
              Part 1: {textbookSummary.completedPart1}/{textbookSummary.totalPart1}과 ({textbookSummary.pctPart1}%)
            </span>
            <span className="px-3 py-1 rounded-full bg-[#2B2340] text-white text-xs font-extrabold">
              전체 {textbookSummary.completedAll}/{textbookSummary.totalAll}과 ({textbookSummary.pctAll}%)
            </span>
          </div>
        </div>

        {/* Circular Progress & Metrics Card */}
        <div className="bg-[#FFFDF9] border-2 border-[#FFE1C2] rounded-[22px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Left: Overall Circular Progress Gauge */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#FFEAD3"
                  strokeWidth="9"
                />
                {/* Progress Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4CC38A"
                  strokeWidth="9"
                  strokeDasharray={251.327}
                  strokeDashoffset={251.327 - (251.327 * textbookSummary.pctAll) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
                <span className="text-sm sm:text-base font-black font-num text-[#2B2340] leading-none">
                  <span className="text-[#4CC38A]">{textbookSummary.completedAll}</span>
                  <span className="text-[#2B2340]/40 mx-0.5 font-bold">/</span>
                  <span>{textbookSummary.totalAll}</span>
                </span>
                <span className="text-[11px] font-extrabold font-num text-[#4CC38A] mt-1 leading-none">
                  {textbookSummary.pctAll}%
                </span>
                <span className="text-[9px] font-bold text-[#2B2340]/55 mt-0.5">
                  단원 완료
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4CC38A]/15 text-[11px] font-extrabold text-[#1E6E4A]">
                <span>전체 교재 완주율</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-[#2B2340] mt-1 tabular-nums">
                총 {textbookSummary.totalAll}개 단원 중 <strong className="text-[#4CC38A]">{textbookSummary.completedAll}개</strong> 완료
              </div>
              <div className="text-xs font-semibold text-[#2B2340]/65 mt-0.5 tabular-nums">
                {textbookSummary.totalAll - textbookSummary.completedAll > 0
                  ? `앞으로 ${textbookSummary.totalAll - textbookSummary.completedAll}개 단원이 남았어요!`
                  : '🎉 0단계 1권 모든 단원을 완주했어요!'}
              </div>
            </div>
          </div>

          {/* Right: Part 1 Circular Progress & Milestone Pill */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 sm:gap-5 border-t sm:border-t-0 sm:border-l-2 border-[#FFE1C2]/70 pt-3 sm:pt-0 sm:pl-5">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#FFEAD3"
                  strokeWidth="11"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#FF6B57"
                  strokeWidth="11"
                  strokeDasharray={251.327}
                  strokeDashoffset={251.327 - (251.327 * textbookSummary.pctPart1) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-black font-num text-[#2B2340] leading-none">
                  {textbookSummary.pctPart1}%
                </span>
                <span className="text-[9px] font-extrabold text-[#FF6B57] mt-0.5">
                  Part 1
                </span>
              </div>
            </div>

            <div className="min-w-0 text-left sm:text-right">
              <div className="text-xs font-extrabold text-[#2B2340]">
                히라가나 Part 1
              </div>
              <div className="text-xs font-bold text-[#FF6B57] tabular-nums mt-0.5">
                {textbookSummary.completedPart1} / {textbookSummary.totalPart1}과 완료
              </div>
              <div className="text-[11px] font-semibold text-[#2B2340]/60 mt-0.5">
                {textbookSummary.pctPart1 >= 100
                  ? '🏅 배지 획득 완료'
                  : '완료 시 +100 EXP 보너스'}
              </div>
            </div>
          </div>
        </div>

        {/* Linear Bar Indicator */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#2B2340]/60 tabular-nums">
            <span>0단계 1권 진도 바</span>
            <span>{textbookSummary.completedAll} / {textbookSummary.totalAll} 과</span>
          </div>
          <div className="h-3 rounded-full bg-[#FFF3E3] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4CC38A] transition-all duration-500 ease-out"
              style={{ width: `${Math.max(2, textbookSummary.pctAll)}%` }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#FFE1C2] text-[#2B2340]/65">
                <th className="py-2 pr-3">코드</th>
                <th className="py-2 pr-3">쪽</th>
                <th className="py-2 pr-3">단원명</th>
                <th className="py-2 pr-3">미션 현황</th>
                <th className="py-2 pr-3">완료 상태</th>
                <th className="py-2 text-right">이동</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFE1C2]/60 tabular-nums">
              {TEXTBOOK_BOOK1_CODES.map((entry) => {
                const prog = state.textbookProgress?.[entry.code];
                const isDone = Boolean(prog?.completedAt);
                const isUnlocked = state.unlockedStages.includes(entry.requiredStageId);
                return (
                  <tr key={entry.code}>
                    <td className="py-2.5 pr-3 font-num font-extrabold text-[#FF6B57] whitespace-nowrap">
                      {entry.code}
                    </td>
                    <td className="py-2.5 pr-3 font-num text-[#2B2340]/70 whitespace-nowrap">
                      p.{entry.pages}
                    </td>
                    <td className="py-2.5 pr-3 font-bold text-[#2B2340] whitespace-nowrap">
                      {entry.title}
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-1">
                        {entry.missions.map((m) => {
                          const ok = Boolean(prog?.missions?.[m.key]);
                          return (
                            <span
                              key={m.key}
                              title={`${m.label}: ${ok ? '완료' : '미완료'}`}
                              className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-[11px] font-bold ${
                                ok
                                  ? 'bg-[#4CC38A] text-white'
                                  : 'bg-[#FFF7EC] border border-[#FFE1C2] text-[#2B2340]/45'
                              }`}
                            >
                              {m.symbol}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 whitespace-nowrap">
                      {isDone ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#4CC38A]/15 text-[#1E6E4A] text-[11px] font-extrabold">
                          완료 ({prog!.completedAt!.slice(0, 10)})
                        </span>
                      ) : !isUnlocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8E3EF] text-[#2B2340]/60 text-[11px] font-bold">
                          <Lock className="w-3 h-3" />
                          잠김
                        </span>
                      ) : prog ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3CC] text-[#7A4F01] text-[11px] font-bold">
                          학습 중
                        </span>
                      ) : (
                        <span className="text-[#2B2340]/45 text-[11px] font-semibold">시작 전</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenTextbookCode(entry.code)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer ${
                          isUnlocked
                            ? 'bg-[#2B2340] hover:bg-[#3f345d] text-white'
                            : 'bg-[#F4F1F7] text-[#2B2340]/55 hover:bg-[#E8E3EF]'
                        }`}
                      >
                        열기
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Learned Kana Matrix */}
      <section className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#4CC38A]" />
          <h2 className="text-lg font-extrabold text-[#2B2340]">내가 외운 글자 현황</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-extrabold text-[#2B2340]/65 mb-2">히라가나 ({learnedHira} / 46)</div>
            <div className="flex flex-wrap gap-1.5">
              {HIRAGANA_BASIC.map((k) => {
                const ok = state.learnedKana.includes(k.char);
                return (
                  <span
                    key={k.id}
                    className={`w-9 h-9 rounded-xl font-jp font-extrabold text-sm flex items-center justify-center ${
                      ok ? 'bg-[#4CC38A] text-white' : 'bg-[#FFF7EC] text-[#2B2340]/35 border border-[#FFE1C2]'
                    }`}
                  >
                    {k.char}
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-xs font-extrabold text-[#2B2340]/65 mb-2">가타카나 ({learnedKata} / 46)</div>
            <div className="flex flex-wrap gap-1.5">
              {KATAKANA_BASIC.map((k) => {
                const ok = state.learnedKana.includes(k.char);
                return (
                  <span
                    key={k.id}
                    className={`w-9 h-9 rounded-xl font-jp font-extrabold text-sm flex items-center justify-center ${
                      ok ? 'bg-[#00A8E8] text-white' : 'bg-[#FFF7EC] text-[#2B2340]/35 border border-[#FFE1C2]'
                    }`}
                  >
                    {k.char}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Culture Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-[#2B2340]/55 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white border-[3px] border-[#FFD166] rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <span className="text-xs font-extrabold text-[#FF6B57]">{selectedCard.category}</span>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="w-8 h-8 rounded-full bg-[#FFF7EC] flex items-center justify-center cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {state.cultureCards.includes(selectedCard.id) ? (
              <>
                <div className="text-5xl text-center">{selectedCard.emoji}</div>
                <div className="text-center">
                  <h3 className="text-xl font-extrabold text-[#2B2340]">{selectedCard.title}</h3>
                  <div className="font-jp text-sm font-bold text-[#2B2340]/55 mt-0.5">{selectedCard.jpTitle}</div>
                </div>
                <p className="text-sm text-[#2B2340]/85 leading-relaxed">{selectedCard.description}</p>
                <div className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-3.5 text-xs font-bold text-[#2B2340]">
                  💡 재미있는 사실: {selectedCard.funFact}
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Lock className="w-10 h-10 text-[#2B2340]/35 mx-auto" />
                <h3 className="text-lg font-extrabold text-[#2B2340]">아직 잠겨 있는 문화 카드예요</h3>
                <p className="text-xs text-[#2B2340]/70">
                  나의 모험 지도 단계 퀴즈를 80% 이상 통과하면 「{selectedCard.title}」 카드를 모을 수 있어요!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
