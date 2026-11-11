import React from 'react';
import { Award, Download, Lock, Medal, Sparkles, Upload, X } from 'lucide-react';
import { BADGE_DEFS, CULTURE_CARDS } from '../data/cultureAndBadgesData';
import { HIRAGANA_BASIC, KATAKANA_BASIC } from '../data/kanaData';
import { CultureCard, MainTab, StudentState, StudySubTab } from '../types';

interface RecordsViewProps {
  state: StudentState;
  onNavigateFromBadge: (tab: MainTab, studySubTab?: StudySubTab) => void;
  onExportJson: () => void;
  onImportJson: (raw: string) => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  state,
  onNavigateFromBadge,
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

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Summary & JSON Backup Bar */}
      <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-[#2B2340]">{state.studentName}의 모험 기록</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#2B2340]/70 tabular-nums">
            <span>Lv.{state.level} (총 {state.exp.toLocaleString()} EXP)</span>
            <span aria-hidden="true">·</span>
            <span>히라가나 {learnedHira}/46자</span>
            <span aria-hidden="true">·</span>
            <span>가타카나 {learnedKata}/46자</span>
            <span aria-hidden="true">·</span>
            <span>낙하 게임 최고 {state.gameRecords.kanaDropBest.toLocaleString()}점</span>
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

      {/* 3. Learned Kana Matrix */}
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
