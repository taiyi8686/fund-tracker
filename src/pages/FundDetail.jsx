import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailChart from '../components/DetailChart';
import ProfitText from '../components/ProfitText';
import { getFundFromAccount, removeFundFromAccount } from '../utils/storage';
import { fetchFundEstimate } from '../utils/fundApi';
import { generateCurveData } from '../utils/curveData';

export default function FundDetail() {
  const { accountId, code } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("trend");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const stored = getFundFromAccount(accountId, code);
    if (!stored) {
      navigate(`/?tab=${accountId}`, { replace: true });
      return;
    }
    setFund(stored);
    fetchFundEstimate(code)
      .then(setEstimate)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code, accountId, navigate]);

  const curveData = useMemo(
    () => generateCurveData(code + '_detail', fund?.profit >= 0),
    [code, fund?.profit]
  );

  if (!fund) return null;

  const hasEstimate = !!estimate;
  const dailyGrowth = hasEstimate ? estimate.estimateGrowth : null;
  const dailyProfit = hasEstimate ? fund.amount * (estimate.estimateGrowth / 100) : null;
  const totalProfit = fund.profit;
  const cost = fund.amount - fund.profit;
  const totalProfitRate = cost > 0 ? (totalProfit / cost) * 100 : 0;
  const positive = dailyGrowth !== null ? dailyGrowth >= 0 : totalProfit >= 0;

  const handleDelete = () => {
    removeFundFromAccount(accountId, code);
    navigate(`/?tab=${accountId}`, { replace: true });
  };

  const fmt = (n) => n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div
      style={{
        maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        background: "#f5f6fa",
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif',
      }}
    >
      {/* Blue Gradient Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a5ce0 0%, #2d7ff9 100%)",
          padding: "16px 16px 20px",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", color: "#fff",
              fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1,
            }}
          >
            ←
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>
              {estimate?.name || fund.name || '加载中...'}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{fund.code}</div>
          </div>
          <button
            onClick={() => navigate(`/add/${accountId}?edit=${code}`)}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", background: "none", border: "none", cursor: "pointer" }}
          >
            编辑
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 4px" }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>当日涨幅</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>
              {dailyGrowth !== null
                ? `${dailyGrowth >= 0 ? "+" : ""}${dailyGrowth.toFixed(2)}%`
                : "--"
              }
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>持有金额</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {fmt(fund.amount)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>实时估值</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {hasEstimate ? estimate.estimateValue.toFixed(4) : "--"}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs + Chart */}
      <div style={{ background: "#fff", padding: "16px 16px 12px", margin: "0 0 8px" }}>
        <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
          {["trend", "myProfit"].map((t) => {
            const labels = { trend: "业绩走势", myProfit: "我的收益" };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: tab === t ? 600 : 400,
                  color: tab === t ? "#1a1a2e" : "#999",
                  background: "none",
                  borderBottom: tab === t ? "2px solid #1a5ce0" : "2px solid transparent",
                }}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>

        {tab === "trend" && (
          <div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
              {hasEstimate && (
                <>
                  估算时间 {estimate.estimateTime} &nbsp;
                  <span style={{ color: positive ? "#e94560" : "#22c55e", fontWeight: 600 }}>
                    {dailyGrowth >= 0 ? "+" : ""}{dailyGrowth.toFixed(2)}%
                  </span>
                </>
              )}
            </div>
            <DetailChart data={curveData} positive={positive} />
          </div>
        )}

        {tab === "myProfit" && (
          <div>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>持有收益</div>
              <ProfitText value={totalProfit} pct={totalProfitRate} size="large" />
            </div>
            <DetailChart data={curveData} positive={totalProfit >= 0} />
          </div>
        )}

        {loading && <div className="skeleton" style={{ width: "100%", height: 120 }} />}
      </div>

      {/* Fund Info */}
      <div style={{ background: "#fff", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: "#1a5ce0", borderRadius: 2, marginRight: 8 }} />
          <span style={{ fontSize: 15, fontWeight: 700 }}>持仓详情</span>
        </div>

        <InfoRow label="持有金额" value={`¥${fmt(fund.amount)}`} />
        <InfoRow label="买入成本" value={`¥${fmt(cost)}`} />
        <InfoRow label="持有收益" value={`${totalProfit >= 0 ? "+" : ""}${totalProfit.toFixed(2)}`} color={totalProfit >= 0 ? "#e94560" : "#22c55e"} />
        <InfoRow label="收益率" value={`${totalProfitRate >= 0 ? "+" : ""}${totalProfitRate.toFixed(2)}%`} color={totalProfitRate >= 0 ? "#e94560" : "#22c55e"} />
        {hasEstimate && <InfoRow label="上个交易日净值" value={estimate.netValue.toFixed(4)} />}
        {hasEstimate && <InfoRow label="净值日期" value={estimate.valueDate} />}
        <InfoRow label="添加日期" value={fund.addedAt} last />
      </div>

      {/* Delete */}
      <div style={{ padding: "24px 16px 80px" }}>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              width: "100%", padding: 12, borderRadius: 12, fontSize: 14,
              color: "#e94560", background: "#fff", cursor: "pointer",
              border: "1px solid rgba(233,69,96,0.3)",
            }}
          >
            删除该基金
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                flex: 1, padding: 12, borderRadius: 12, fontSize: 14,
                background: "#f3f4f6", color: "#666", border: "none", cursor: "pointer",
              }}
            >
              取消
            </button>
            <button
              onClick={handleDelete}
              style={{
                flex: 1, padding: 12, borderRadius: 12, fontSize: 14,
                background: "#e94560", color: "#fff", border: "none", cursor: "pointer",
              }}
            >
              确认删除
            </button>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430, background: "#fff",
          borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around",
          padding: "10px 0 24px",
        }}
      >
        <ActionBtn label="修改持仓" onClick={() => navigate(`/add/${accountId}?edit=${code}`)} />
        <ActionBtn label="交易记录" />
        <ActionBtn label="删自选" onClick={() => setShowConfirm(true)} />
      </div>
    </div>
  );
}

function InfoRow({ label, value, color, last }) {
  return (
    <div
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 0",
        borderBottom: last ? "none" : "1px solid #f8f8f8",
      }}
    >
      <span style={{ fontSize: 13, color: "#999" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: color || "#1a1a2e" }}>{value}</span>
    </div>
  );
}

function ActionBtn({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ fontSize: 12, color: "#666", textAlign: "center", cursor: "pointer" }}
    >
      {label}
    </div>
  );
}
