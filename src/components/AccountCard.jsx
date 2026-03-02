import { useMemo } from 'react';
import ProfitCurve from './ProfitCurve';
import Badge from './Badge';
import ProfitText from './ProfitText';
import { generateCurveData } from '../utils/curveData';

export default function AccountCard({ account, estimates, showFunds, onClick, onFundClick, iconGradient }) {
  let totalAmount = 0;
  let totalProfit = 0;
  let totalDailyProfit = 0;
  let hasDailyData = false;
  let upCount = 0;
  let downCount = 0;

  account.funds.forEach((fund) => {
    totalAmount += fund.amount;
    totalProfit += fund.profit;
    const est = estimates[fund.code];
    if (est) {
      totalDailyProfit += fund.amount * (est.estimateGrowth / 100);
      hasDailyData = true;
      if (est.estimateGrowth >= 0) upCount++;
      else downCount++;
    }
  });

  const totalCost = totalAmount - totalProfit;
  const holdProfitPct = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const dayProfitPct = totalAmount > 0 ? (totalDailyProfit / totalAmount) * 100 : 0;
  const acctPositive = totalDailyProfit >= 0;

  const curveData = useMemo(
    () => generateCurveData(account.id + account.name, acctPositive),
    [account.id, account.name, acctPositive]
  );

  const fmt = (n) => n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div
      style={{
        background: "#fff", borderRadius: 16, marginBottom: 12,
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)", overflow: "hidden",
      }}
    >
      {/* Account Header — clickable area */}
      <div onClick={onClick} style={{ cursor: "pointer" }}>
        <div style={{ padding: "14px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: iconGradient || "linear-gradient(135deg, #1677ff, #4096ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "#fff", fontWeight: 600,
              }}
            >
              {account.name.slice(-1)}
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>{account.name}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Badge up count={upCount} />
            <Badge up={false} count={downCount} />
          </div>
        </div>

        {/* Account Summary */}
        <div style={{ padding: "10px 18px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>账户资产</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", letterSpacing: -0.5 }}>
              {fmt(totalAmount)}
            </div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, color: "#999" }}>持有收益</span>
              <ProfitText value={totalProfit} pct={holdProfitPct} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <ProfitCurve data={curveData} positive={acctPositive} width={120} height={40} />
            <div style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
              <span style={{ fontSize: 11, color: "#999" }}>当日收益</span>
              {hasDailyData ? (
                <ProfitText value={totalDailyProfit} pct={dayProfitPct} />
              ) : (
                <span className="skeleton" style={{ width: 60, height: 16, display: "inline-block" }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fund list inside account card */}
      {showFunds && account.funds.length > 0 && (
        <div style={{ borderTop: "1px solid #f3f3f3" }}>
          {account.funds.map((fund, fi) => {
            const est = estimates[fund.code];
            const dailyProfit = est ? fund.amount * (est.estimateGrowth / 100) : null;
            const dailyGrowth = est ? est.estimateGrowth : null;
            const holdProfit = fund.profit;
            const cost = fund.amount - fund.profit;
            const holdProfitPct = cost > 0 ? (holdProfit / cost) * 100 : 0;

            return (
              <div
                key={fund.code}
                onClick={() => onFundClick && onFundClick(account.id, fund.code)}
                style={{
                  padding: "12px 18px",
                  borderBottom: fi < account.funds.length - 1 ? "1px solid #f8f8f8" : "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
                    {est?.name || fund.name || fund.code}
                  </span>
                  <span style={{ fontSize: 11, color: "#bbb" }}>{fund.code}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#999" }}>当日</span>
                    {dailyProfit !== null ? (
                      <ProfitText value={dailyProfit} pct={dailyGrowth} />
                    ) : (
                      <span style={{ fontSize: 14, color: "#ddd" }}>--</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#999" }}>持有</span>
                    <ProfitText value={holdProfit} pct={holdProfitPct} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
