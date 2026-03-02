import { useState } from "react";

// ============ Mock Data (模拟真实数据结构) ============
const generateCurve = (trend, volatility, points = 30) => {
  const data = [100];
  for (let i = 1; i < points; i++) {
    const change = (Math.random() - (trend === "up" ? 0.35 : 0.6)) * volatility;
    data.push(Math.max(0, data[i - 1] + change));
  }
  return data;
};

const accountsData = {
  zhifubao1: {
    id: "zhifubao1",
    name: "支付宝 1",
    icon: "支",
    iconBg: ["#1677ff", "#4096ff"],
    assets: 15391.53,
    holdProfit: 1072.95,
    holdProfitPct: 7.19,
    dayProfit: 685.09,
    dayProfitPct: 4.48,
    upCount: 5,
    downCount: 1,
    curveData: generateCurve("up", 3, 30),
    funds: [
      {
        id: "002207",
        name: "前海开源金银珠宝混合C",
        code: "002207",
        assets: 8200.0,
        holdProfit: 1800.5,
        holdProfitPct: 28.13,
        dayProfit: 520.3,
        dayProfitPct: 6.88,
        yearReturn: 137.38,
        holdRank: "7/25556",
        curveData: generateCurve("up", 4, 30),
        sector: "黄金股",
        sectorChange: 6.94,
        sameTypeFunds: 7,
        holdings: [
          { name: "紫金矿业", code: "601899", change: 3.08, weight: 9.79, weightChange: 0.59, up: true },
          { name: "中金黄金", code: "600489", change: 9.99, weight: 9.09, weightChange: 0.03, up: true },
          { name: "山金国际", code: "000975", change: 9.23, weight: 9.01, weightChange: 2.40, up: true },
          { name: "赤峰黄金", code: "600988", change: 9.99, weight: 8.79, weightChange: -0.09, up: false },
          { name: "兴业银锡", code: "000426", change: 9.11, weight: 8.09, weightChange: -1.23, up: false },
          { name: "株冶集团", code: "600961", change: 9.06, weight: 8.04, weightChange: -0.08, up: false },
          { name: "西部黄金", code: "601069", change: 10.01, weight: 7.91, weightChange: 0.66, up: true },
          { name: "湖南黄金", code: "002155", change: 10.0, weight: 7.75, weightChange: -0.72, up: false },
        ],
        industries: [
          { name: "有色金属", pct: 90.37 },
          { name: "其他", pct: 9.63 },
        ],
      },
      {
        id: "005827",
        name: "易方达蓝筹精选混合",
        code: "005827",
        assets: 3500.0,
        holdProfit: -280.0,
        holdProfitPct: -7.41,
        dayProfit: 88.5,
        dayProfitPct: 2.59,
        yearReturn: -12.5,
        holdRank: "1820/25556",
        curveData: generateCurve("up", 2.5, 30),
        sector: "消费",
        sectorChange: 1.2,
        sameTypeFunds: 15,
        holdings: [
          { name: "贵州茅台", code: "600519", change: 1.25, weight: 9.5, weightChange: 0.2, up: true },
          { name: "腾讯控股", code: "00700", change: 2.1, weight: 8.8, weightChange: -0.5, up: false },
          { name: "泸州老窖", code: "000568", change: 0.85, weight: 7.2, weightChange: 0.1, up: true },
        ],
        industries: [
          { name: "食品饮料", pct: 45.2 },
          { name: "互联网", pct: 30.5 },
          { name: "其他", pct: 24.3 },
        ],
      },
      {
        id: "110011",
        name: "易方达中小盘混合",
        code: "110011",
        assets: 2100.0,
        holdProfit: -350.0,
        holdProfitPct: -14.29,
        dayProfit: 42.0,
        dayProfitPct: 2.04,
        yearReturn: -18.7,
        holdRank: "5200/25556",
        curveData: generateCurve("down", 2, 30),
        sector: "中小盘",
        sectorChange: -0.8,
        sameTypeFunds: 22,
        holdings: [
          { name: "宁德时代", code: "300750", change: -1.2, weight: 8.5, weightChange: -0.3, up: false },
          { name: "阳光电源", code: "300274", change: 3.5, weight: 7.1, weightChange: 0.8, up: true },
        ],
        industries: [
          { name: "新能源", pct: 55.0 },
          { name: "制造业", pct: 25.0 },
          { name: "其他", pct: 20.0 },
        ],
      },
    ],
  },
  zhifubao2: {
    id: "zhifubao2",
    name: "支付宝 2",
    icon: "支",
    iconBg: ["#ff6b35", "#ffa726"],
    assets: 81208.23,
    holdProfit: -834.6,
    holdProfitPct: -1.02,
    dayProfit: -147.04,
    dayProfitPct: -0.18,
    upCount: 6,
    downCount: 6,
    curveData: generateCurve("down", 3.5, 30),
    funds: [
      {
        id: "161725",
        name: "招商中证白酒指数",
        code: "161725",
        assets: 45000.0,
        holdProfit: -2200.0,
        holdProfitPct: -4.66,
        dayProfit: -180.0,
        dayProfitPct: -0.4,
        yearReturn: -15.3,
        holdRank: "3500/25556",
        curveData: generateCurve("down", 3, 30),
        sector: "白酒",
        sectorChange: -0.65,
        sameTypeFunds: 5,
        holdings: [
          { name: "贵州茅台", code: "600519", change: 1.25, weight: 15.2, weightChange: 0.3, up: true },
          { name: "五粮液", code: "000858", change: -0.5, weight: 14.8, weightChange: -0.2, up: false },
          { name: "泸州老窖", code: "000568", change: 0.85, weight: 10.5, weightChange: 0.1, up: true },
          { name: "山西汾酒", code: "600809", change: -1.2, weight: 9.8, weightChange: -0.4, up: false },
        ],
        industries: [
          { name: "食品饮料", pct: 95.5 },
          { name: "其他", pct: 4.5 },
        ],
      },
      {
        id: "012414",
        name: "国泰中证半导体材料ETF联接C",
        code: "012414",
        assets: 36208.23,
        holdProfit: 1365.4,
        holdProfitPct: 3.92,
        dayProfit: 32.96,
        dayProfitPct: 0.09,
        yearReturn: 22.1,
        holdRank: "850/25556",
        curveData: generateCurve("up", 4, 30),
        sector: "半导体",
        sectorChange: 2.35,
        sameTypeFunds: 12,
        holdings: [
          { name: "北方华创", code: "002371", change: 5.2, weight: 12.1, weightChange: 1.5, up: true },
          { name: "中芯国际", code: "688981", change: 3.8, weight: 10.5, weightChange: 0.8, up: true },
          { name: "韦尔股份", code: "603501", change: -2.1, weight: 8.3, weightChange: -1.2, up: false },
        ],
        industries: [
          { name: "半导体", pct: 88.2 },
          { name: "电子", pct: 8.5 },
          { name: "其他", pct: 3.3 },
        ],
      },
    ],
  },
};

// ============ Chart Components ============
function ProfitCurve({ data, width = 140, height = 44, positive }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const color = positive ? "#e94560" : "#22c55e";

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 4 - ((v - min) / range) * (height - 8);
    return `${x},${y}`;
  });

  const areaPoints = `0,${height} ${points.join(" ")} ${width},${height}`;

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`grad-${positive ? "r" : "g"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${positive ? "r" : "g"})`} />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailChart({ data, positive, height = 160 }) {
  if (!data || data.length < 2) return null;
  const w = 340;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const color = positive ? "#e94560" : "#22c55e";
  const startVal = data[0];

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - 20 - ((v - min) / range) * (height - 40);
    return [x, y];
  });

  const baseY = height - 20 - ((startVal - min) / range) * (height - 40);
  const polyStr = points.map((p) => p.join(",")).join(" ");
  const areaStr = `0,${height - 20} ${polyStr} ${w},${height - 20}`;

  const gridLines = 4;
  const gridValues = [];
  for (let i = 0; i <= gridLines; i++) {
    const val = min + (range * i) / gridLines;
    const pct = ((val - startVal) / startVal) * 100;
    gridValues.push({ y: height - 20 - (i / gridLines) * (height - 40), pct });
  }

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {gridValues.map((g, i) => (
        <g key={i}>
          <line x1="0" y1={g.y} x2={w} y2={g.y} stroke="#eee" strokeWidth="0.5" />
          <text x={w - 2} y={g.y - 3} textAnchor="end" fontSize="9" fill="#bbb">
            {g.pct >= 0 ? "+" : ""}{g.pct.toFixed(2)}%
          </text>
        </g>
      ))}
      <line x1="0" y1={baseY} x2={w} y2={baseY} stroke="#999" strokeWidth="0.5" strokeDasharray="3,3" />
      <polygon points={areaStr} fill="url(#detailGrad)" />
      <polyline
        points={polyStr}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="3" fill={color} />
    </svg>
  );
}

// ============ Sub Components ============
function Badge({ up, count }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontSize: 12,
        fontWeight: 600,
        color: up ? "#e94560" : "#22c55e",
        background: up ? "rgba(233,69,96,0.08)" : "rgba(34,197,94,0.08)",
        padding: "2px 8px",
        borderRadius: 6,
      }}
    >
      {up ? "↑" : "↓"} {count}
    </span>
  );
}

function ProfitText({ value, pct, size = "normal" }) {
  const positive = value >= 0;
  const color = positive ? "#e94560" : "#22c55e";
  const fSize = size === "large" ? 24 : size === "medium" ? 18 : 14;
  const pctSize = size === "large" ? 13 : size === "medium" ? 12 : 11;

  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
      <span style={{ fontSize: fSize, fontWeight: 700, color }}>
        {positive ? "+" : ""}{typeof value === "number" ? value.toFixed(2) : value}
      </span>
      {pct !== undefined && (
        <span style={{ fontSize: pctSize, color, fontWeight: 500 }}>
          {positive ? "+" : ""}{pct.toFixed(2)}%
        </span>
      )}
    </span>
  );
}

// ============ Views ============
function FundDetailView({ fund, onBack }) {
  const [tab, setTab] = useState("holdings");
  const positive = fund.dayProfit >= 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa" }}>
      {/* Blue Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a5ce0 0%, #2d7ff9 100%)",
          padding: "16px 16px 20px",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              background: "none", border: "none", color: "#fff",
              fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1,
            }}
          >
            ←
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{fund.name}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{fund.code}</div>
          </div>
          <div style={{ width: 22 }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 4px" }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>当日涨幅</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>
              {fund.dayProfitPct >= 0 ? "+" : ""}{fund.dayProfitPct.toFixed(2)}%
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>近1年</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: fund.yearReturn >= 0 ? "#ffb3c1" : "#86efac" }}>
              {fund.yearReturn >= 0 ? "+" : ""}{fund.yearReturn.toFixed(2)}%
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>持有人数排名</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{fund.holdRank}</div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ background: "#fff", padding: "16px 16px 12px", margin: "0 0 8px" }}>
        <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
          {["holdings", "trend", "myProfit"].map((t) => {
            const labels = { holdings: "关联板块", trend: "业绩走势", myProfit: "我的收益" };
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
              日期 03-02 &nbsp;
              <span style={{ color: positive ? "#e94560" : "#22c55e", fontWeight: 600 }}>
                {fund.dayProfitPct >= 0 ? "+" : ""}{fund.dayProfitPct.toFixed(2)}%
              </span>
            </div>
            <DetailChart data={fund.curveData} positive={positive} />
          </div>
        )}

        {tab === "holdings" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>关联板块：{fund.sector}</span>
              <span style={{ fontSize: 13, color: fund.sectorChange >= 0 ? "#e94560" : "#22c55e", fontWeight: 600 }}>
                {fund.sectorChange >= 0 ? "+" : ""}{fund.sectorChange.toFixed(2)}%
              </span>
              <span style={{ fontSize: 11, color: "#999", marginLeft: "auto" }}>
                {fund.sameTypeFunds} 只同类基金 &gt;
              </span>
            </div>
          </div>
        )}

        {tab === "myProfit" && (
          <div>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>持有收益</div>
              <ProfitText value={fund.holdProfit} pct={fund.holdProfitPct} size="large" />
            </div>
            <DetailChart data={fund.curveData} positive={fund.holdProfit >= 0} />
          </div>
        )}
      </div>

      {/* Holdings Table */}
      <div style={{ background: "#fff", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: "#1a5ce0", borderRadius: 2, marginRight: 8 }} />
          <span style={{ fontSize: 15, fontWeight: 700 }}>基金重仓股</span>
        </div>

        {/* Table Header */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "1.3fr 0.8fr 0.8fr 0.9fr",
            padding: "8px 0", borderBottom: "1px solid #f0f0f0",
            fontSize: 11, color: "#999",
          }}
        >
          <span>股票名称</span>
          <span style={{ textAlign: "right" }}>涨幅</span>
          <span style={{ textAlign: "right" }}>持仓占比</span>
          <span style={{ textAlign: "right" }}>较上期占比</span>
        </div>

        {/* Table Rows */}
        {fund.holdings.map((h, i) => (
          <div
            key={i}
            style={{
              display: "grid", gridTemplateColumns: "1.3fr 0.8fr 0.8fr 0.9fr",
              padding: "12px 0", borderBottom: i < fund.holdings.length - 1 ? "1px solid #f8f8f8" : "none",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{h.name}</div>
              <div style={{ fontSize: 11, color: "#bbb" }}>{h.code}</div>
            </div>
            <span style={{ textAlign: "right", fontSize: 14, fontWeight: 600, color: h.change >= 0 ? "#e94560" : "#22c55e" }}>
              {h.change >= 0 ? "+" : ""}{h.change.toFixed(2)}%
            </span>
            <span style={{ textAlign: "right", fontSize: 13, color: "#333" }}>{h.weight.toFixed(2)}%</span>
            <div style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
              <span style={{ fontSize: 13, color: h.up ? "#e94560" : "#22c55e", fontWeight: 500 }}>
                {Math.abs(h.weightChange).toFixed(2)}%
              </span>
              <span style={{ fontSize: 11, color: h.up ? "#e94560" : "#22c55e" }}>
                {h.up ? "↑" : "↓"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Industry Distribution */}
      <div style={{ background: "#fff", padding: "16px", marginTop: 8, marginBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: "#1a5ce0", borderRadius: 2, marginRight: 8 }} />
          <span style={{ fontSize: 15, fontWeight: 700 }}>行业分布</span>
        </div>

        {fund.industries.map((ind, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "#333", width: 70, flexShrink: 0 }}>{ind.name}</span>
            <div style={{ flex: 1, height: 18, background: "#f0f4ff", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  width: `${ind.pct}%`, height: "100%",
                  background: i === 0 ? "linear-gradient(90deg, #1a5ce0, #4096ff)" : "#90b8f8",
                  borderRadius: 4, transition: "width 0.5s ease",
                }}
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#333", width: 55, textAlign: "right" }}>
              {ind.pct.toFixed(2)}%
            </span>
          </div>
        ))}
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
        {["修改持仓", "提醒", "交易记录", "删自选", "更多"].map((label) => (
          <div key={label} style={{ fontSize: 12, color: "#666", textAlign: "center", cursor: "pointer" }}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Main App ============
export default function FundTracker() {
  const [activeTab, setActiveTab] = useState("账户汇总");
  const [selectedFund, setSelectedFund] = useState(null);

  const tabs = ["账户汇总", "全部", "支付宝 1", "支付宝 2"];

  const allAccounts = Object.values(accountsData);
  const totalAssets = allAccounts.reduce((s, a) => s + a.assets, 0);
  const totalDayProfit = allAccounts.reduce((s, a) => s + a.dayProfit, 0);
  const totalHoldProfit = allAccounts.reduce((s, a) => s + a.holdProfit, 0);

  const getDisplayAccounts = () => {
    if (activeTab === "账户汇总" || activeTab === "全部") return allAccounts;
    return allAccounts.filter((a) => a.name === activeTab);
  };

  const displayAccounts = getDisplayAccounts();
  const isPositiveTotal = totalDayProfit >= 0;

  if (selectedFund) {
    return <FundDetailView fund={selectedFund} onBack={() => setSelectedFund(null)} />;
  }

  return (
    <div
      style={{
        maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        background: "#f5f6fa",
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "16px 16px 24px",
          borderRadius: "0 0 20px 20px",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>太一基金小助手</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 13, opacity: 0.8 }}>太一</span>
            <span style={{ cursor: "pointer", opacity: 0.8 }}>⟳</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 2 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 14px", borderRadius: 18, border: "none",
                fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                background: activeTab === tab ? "rgba(255,255,255,0.93)" : "rgba(255,255,255,0.15)",
                color: activeTab === tab ? "#764ba2" : "rgba(255,255,255,0.85)",
                cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {tab}
            </button>
          ))}
          <button
            style={{
              padding: "6px 12px", borderRadius: 18,
              border: "1.5px dashed rgba(255,255,255,0.35)",
              background: "transparent", color: "rgba(255,255,255,0.6)",
              fontSize: 13, cursor: "pointer", flexShrink: 0,
            }}
          >
            +
          </button>
        </div>

        {/* Total Summary */}
        <div style={{ padding: "0 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 12, opacity: 0.7 }}>账户资产</span>
            <span style={{ fontSize: 14, opacity: 0.5, cursor: "pointer" }}>👁</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
              {totalAssets.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: 0.6 }}>场内穿透</div>
              <span style={{ fontSize: 20, fontWeight: 600, color: isPositiveTotal ? "#7cffb2" : "#ff9b9b" }}>
                {totalDayProfit >= 0 ? "+" : ""}{totalDayProfit.toFixed(2)}
              </span>
              <span style={{ fontSize: 18, marginLeft: 6, cursor: "pointer", opacity: 0.7 }}>&gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div style={{ padding: "14px 14px 100px" }}>
        {displayAccounts.map((account) => {
          const acctPositive = account.dayProfit >= 0;
          return (
            <div
              key={account.id}
              style={{
                background: "#fff", borderRadius: 16, marginBottom: 12,
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)", overflow: "hidden",
              }}
            >
              {/* Account Header */}
              <div style={{ padding: "14px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: `linear-gradient(135deg, ${account.iconBg[0]}, ${account.iconBg[1]})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, color: "#fff", fontWeight: 600,
                    }}
                  >
                    {account.icon}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>{account.name}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge up count={account.upCount} />
                  <Badge up={false} count={account.downCount} />
                </div>
              </div>

              {/* Account Summary */}
              <div style={{ padding: "10px 18px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>账户资产</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", letterSpacing: -0.5 }}>
                    {account.assets.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "#999" }}>持有收益</span>
                    <ProfitText value={account.holdProfit} pct={account.holdProfitPct} />
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <ProfitCurve data={account.curveData} positive={acctPositive} width={120} height={40} />
                  <div style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "#999" }}>当日收益</span>
                    <ProfitText value={account.dayProfit} pct={account.dayProfitPct} />
                  </div>
                </div>
              </div>

              {/* Fund List inside account */}
              {(activeTab === "全部" || activeTab === account.name) && (
                <div style={{ borderTop: "1px solid #f3f3f3" }}>
                  {account.funds.map((fund, fi) => {
                    const fundPositive = fund.dayProfit >= 0;
                    return (
                      <div
                        key={fund.id}
                        onClick={() => setSelectedFund(fund)}
                        style={{
                          padding: "12px 18px",
                          borderBottom: fi < account.funds.length - 1 ? "1px solid #f8f8f8" : "none",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{fund.name}</span>
                          <span style={{ fontSize: 11, color: "#bbb" }}>{fund.code}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                            <span style={{ fontSize: 11, color: "#999" }}>当日</span>
                            <ProfitText value={fund.dayProfit} pct={fund.dayProfitPct} />
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                            <span style={{ fontSize: 11, color: "#999" }}>持有</span>
                            <ProfitText value={fund.holdProfit} pct={fund.holdProfitPct} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, padding: "0 4px" }}>
          <button
            style={{
              padding: "12px 0", flex: 1, marginRight: 8,
              borderRadius: 12, border: "1.5px dashed #d0d5dd",
              background: "transparent", color: "#999", fontSize: 13, cursor: "pointer",
            }}
          >
            + 新增持有
          </button>
          <button
            style={{
              padding: "12px 0", flex: 1, marginLeft: 8,
              borderRadius: 12, border: "1px solid #e0e0e0",
              background: "#fff", color: "#666", fontSize: 13, cursor: "pointer",
            }}
          >
            批量加减仓 📋
          </button>
        </div>
      </div>

      {/* Bottom Index Bar */}
      <div
        style={{
          position: "fixed", bottom: 50, left: "50%", transform: "translateX(-50%)",
          width: "calc(100% - 32px)", maxWidth: 398,
          background: "#fff", borderRadius: 10,
          padding: "8px 14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>上证指数</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#e94560" }}>4,182.59</span>
          <span style={{ fontSize: 12, color: "#e94560" }}>+19.71</span>
          <span style={{ fontSize: 12, color: "#e94560", fontWeight: 500 }}>+0.47%</span>
        </div>
      </div>

      {/* Bottom Nav */}
      <div
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex", justifyContent: "space-around",
          padding: "8px 0 22px",
        }}
      >
        {[
          { icon: "📊", label: "持有", active: true },
          { icon: "⭐", label: "自选" },
          { icon: "📈", label: "行情" },
          { icon: "📰", label: "资讯" },
          { icon: "💎", label: "会员" },
          { icon: "👤", label: "我的" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 2, cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 10,
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
