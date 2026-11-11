import React from 'react';
import { CheckCircle2, Coins, Gift, Shield, ShoppingBag, Ticket } from 'lucide-react';
import { ShopItem, StudentState } from '../types';

interface ShopViewProps {
  state: StudentState;
  onBuyShopItem: (item: ShopItem) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ state, onBuyShopItem }) => {
  const activeCatalog = React.useMemo(
    () => (state.shopCatalog || []).filter((item) => item.active),
    [state.shopCatalog]
  );

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Wallet Banner */}
      <div className="rounded-[28px] bg-gradient-to-br from-[#FF6B57] to-[#FF8167] text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ARI JLPT 보상 상점</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            공부해서 모은 코인으로 보상을 받아요!
          </h1>
          <p className="text-xs sm:text-sm font-medium text-white/90">
            가나·단어·한자·모의고사·게임을 완료할 때마다 코인이 쌓여요. 연속 학습 보호권과 선생님 보상 쿠폰을 교환해 보세요!
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-[22px] bg-white text-[#2B2340] px-5 py-3.5 min-w-[140px] shadow-sm">
            <div className="text-[11px] font-bold text-[#2B2340]/60 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-[#D97706]" />
              <span>내 코인 잔액</span>
            </div>
            <div className="text-2xl font-extrabold tabular-nums mt-0.5 text-[#FF6B57]">
              {state.coins.toLocaleString()} C
            </div>
          </div>

          <div className="rounded-[22px] bg-[#2B2340] text-white px-5 py-3.5 min-w-[140px]">
            <div className="text-[11px] font-bold text-white/70 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#4CC38A]" />
              <span>연속 학습 보호권</span>
            </div>
            <div className="text-2xl font-extrabold tabular-nums mt-0.5">
              {state.streakProtections}개
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Items Grid */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#2B2340] flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#FF6B57]" />
          <span>교환 가능한 아이템 · 쿠폰</span>
        </h2>

        {activeCatalog.length === 0 ? (
          <div className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-10 text-center text-sm font-bold text-[#2B2340]/65">
            현재 상점에 진열된 상품이 없어요. 관리자 상점 관리에서 상품을 추가할 수 있어요!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeCatalog.map((item) => {
              const canAfford = state.coins >= item.priceCoins;
              return (
                <div
                  key={item.id}
                  className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFF7EC] border-2 border-[#FFE1C2] flex items-center justify-center text-3xl">
                        {item.emoji}
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          item.effectType === 'streak_protection'
                            ? 'bg-[#4CC38A]/15 text-[#228558]'
                            : 'bg-[#FFD166]/35 text-[#875800]'
                        }`}
                      >
                        {item.effectType === 'streak_protection' ? '즉시 적용' : '보상 쿠폰'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-[#2B2340]">{item.title}</h3>
                      <p className="text-xs text-[#2B2340]/70 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#FFE1C2] space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-[#2B2340]/60">필요 코인</span>
                      <span className="text-base text-[#FF6B57] tabular-nums">
                        🪙 {item.priceCoins.toLocaleString()} C
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyShopItem(item)}
                      className={`w-full py-2.5 rounded-full text-xs font-extrabold transition-colors cursor-pointer ${
                        canAfford
                          ? 'bg-[#2B2340] hover:bg-[#3f345d] text-white'
                          : 'bg-[#E8E3EF] text-[#2B2340]/45 cursor-not-allowed'
                      }`}
                    >
                      {canAfford
                        ? '교환하기'
                        : `${(item.priceCoins - state.coins).toLocaleString()} 코인 더 필요해요`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Purchased Coupon Wallet */}
      <section className="bg-white border-[3px] border-[#FFE1C2] rounded-[26px] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#FFD166]" />
            <h2 className="text-lg font-extrabold text-[#2B2340]">
              내가 교환한 쿠폰 · 아이템 내역 ({state.purchasedItems.length}건)
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#2B2340]/60">
            미사용 쿠폰은 선생님·부모님 화면(관리자 상점 관리)에서 사용 완료 처리할 수 있어요.
          </span>
        </div>

        {state.purchasedItems.length === 0 ? (
          <div className="rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] p-8 text-center text-xs font-bold text-[#2B2340]/60">
            아직 교환한 아이템이나 쿠폰이 없어요! 오늘의 미션을 완료해 코인을 모아 보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...state.purchasedItems].reverse().map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl border-2 p-4 flex items-center justify-between gap-3 ${
                  p.status === 'unused'
                    ? 'bg-[#FFFDF9] border-[#FFD166]'
                    : 'bg-[#F8F6FA] border-[#E8E3EF] opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF7EC] border border-[#FFE1C2] flex items-center justify-center text-2xl shrink-0">
                    {p.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-[#2B2340] truncate">
                      {p.title}
                    </div>
                    <div className="text-[11px] font-bold text-[#2B2340]/60 tabular-nums">
                      {p.purchasedAt.slice(0, 10)} · {p.priceCoins} C
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0 ${
                    p.status === 'unused'
                      ? 'bg-[#FFD166] text-[#2B2340]'
                      : 'bg-[#4CC38A]/15 text-[#228558]'
                  }`}
                >
                  {p.status === 'redeemed' && <CheckCircle2 className="w-3 h-3" />}
                  {p.status === 'unused' ? '보관 중' : '사용 완료'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
