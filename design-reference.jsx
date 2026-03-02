import { useState } from "react";

const miniChartData1 = [30, 32, 31, 35, 33, 38, 36, 40, 42, 41, 45, 43, 47, 50, 48, 52];
const miniChartData2 = [20, 22, 21, 25, 23, 28, 27, 30, 29, 33, 31, 35, 37, 36, 40, 42];

function MiniChart({ data, color = "#e94560", width = 120, height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const accounts = [
  {
    id: "zhifubao1",
    name: "支付宝1",
    assets: 100.0,
    holdProfit: 0.0,
    holdProfitPct: 0.0,
    dayProfit: 7.7,
    dayProfitPct: 7.7,
    chartData: miniChartData1,
    rank: 1,
  },
  {
    id: "zhifubao2",
    name: "支付宝2",
    assets: 50.0,
    holdProfit: 0.0,
    holdProfitPct: 0.0,
    dayProfit: 3.85,
    dayProfitPct: 7.7,
    chartData: miniChartData2,
    rank: 1,
  },
];

const tabs = ["全部", "支付宝1", "支付宝2"];

export default function FundTracker() {
  const [activeTab, setActiveTab] = useState("全部");

  const totalAssets = accounts.reduce((s, a) => s + a.assets, 0);
  const totalDayProfit = accounts.reduce((s, a) => s + a.dayProfit, 0);
  const totalDayProfitPct = totalAssets > 0 ? (totalDayProfit / totalAssets) * 100 : 0;

  const displayAccounts =
    activeTab === "全部"
      ? accounts
      : accounts.filter((a) => a.name === activeTab);

  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#f5f6fa",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif',
        color: "#1a1a2e",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px 20px 28px",
          borderRadius: "0 0 24px 24px",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 600 }}>太一基金小助手</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 14, opacity: 0.85 }}>太一</span>
            <span style={{ fontSize: 18, cursor: "pointer", opacity: 0.85 }}>⟳</span>
          </div>
        </div>

        {/* Tabs - 关键改进：充分间距 + 胶囊样式 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                border: "none",
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                background:
                  activeTab === tab ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.15)",
                color: activeTab === tab ? "#764ba2" : "rgba(255,255,255,0.85)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              {tab}
            </button>
          ))}
          <button
            style={{
              padding: "7px 14px",
              borderRadius: 20,
              border: "1.5px dashed rgba(255,255,255,0.4)",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            + 新增
          </button>
        </div>

        {/* Summary */}
        <div>
          <div
            style={{
              fontSize: 12,
              opacity: 0.7,
              marginBottom: 4,
              letterSpacing: 0.5,
            }}
          >
            账户资产 (元)
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
              {totalAssets.toFixed(2)}
            </span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>当日收益</div>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#7cffb2",
                }}
              >
                +{totalDayProfit.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: 12,
                  marginLeft: 4,
                  opacity: 0.8,
                  color: "#7cffb2",
                }}
              >
                +{totalDayProfitPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div style={{ padding: "16px 16px 100px" }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#333",
            marginBottom: 12,
            paddingLeft: 4,
          }}
        >
          账户明细
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {displayAccounts.map((account) => (
            <div
              key={account.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "18px 20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "transform 0.15s ease",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background:
                        account.name === "支付宝1"
                          ? "linear-gradient(135deg, #1677ff, #4096ff)"
                          : "linear-gradient(135deg, #ff6b35, #ffa726)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {account.name.slice(-1)}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>
                    {account.name}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 12,
                    color: "#e94560",
                    background: "rgba(233,69,96,0.08)",
                    padding: "3px 8px",
                    borderRadius: 8,
                  }}
                >
                  <span>↑</span>
                  <span>{account.rank}</span>
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                {/* Left: Assets info */}
                <div>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>
                    账户资产
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#1a1a2e",
                      letterSpacing: -0.5,
                      lineHeight: 1.2,
                    }}
                  >
                    {account.assets.toFixed(2)}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>
                      持有收益
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: account.holdProfit >= 0 ? "#e94560" : "#22c55e",
                      }}
                    >
                      {account.holdProfit >= 0 ? "+" : ""}
                      {account.holdProfit.toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: account.holdProfit >= 0 ? "#e94560" : "#22c55e",
                        marginLeft: 4,
                      }}
                    >
                      {account.holdProfitPct >= 0 ? "+" : ""}
                      {account.holdProfitPct.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Right: Chart + Day Profit */}
                <div style={{ textAlign: "right" }}>
                  <MiniChart
                    data={account.chartData}
                    color="#e94560"
                    width={100}
                    height={36}
                  />
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "#999" }}>当日收益 </span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#e94560",
                      }}
                    >
                      +{account.dayProfit.toFixed(2)}
                    </span>
                    <span
                      style={{ fontSize: 11, color: "#e94560", marginLeft: 3 }}
                    >
                      +{account.dayProfitPct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Account Button */}
        <button
          style={{
            width: "100%",
            marginTop: 12,
            padding: "14px",
            borderRadius: 14,
            border: "1.5px dashed #d0d5dd",
            background: "transparent",
            color: "#999",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18 }}>+</span>
          新增账户
        </button>
      </div>

      {/* Bottom Nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0 24px",
        }}
      >
        {[
          { icon: "📊", label: "总览", active: true },
          { icon: "📈", label: "持仓" },
          { icon: "🔔", label: "提醒" },
          { icon: "⚙️", label: "设置" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 11,
                color: item.active ? "#764ba2" : "#999",
                fontWeight: item.active ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
