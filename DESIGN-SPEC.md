# 太一基金小助手 — UI 设计规范与开发说明

> **使用方法**：将本文件（DESIGN-SPEC.md）和设计参考文件（fund-tracker-pro.jsx）一起放到项目根目录下。
> 然后在 Claude Code 中输入：`请阅读 DESIGN-SPEC.md 和 fund-tracker-pro.jsx，按照设计规范重构项目 UI`

---

## 一、项目概述

这是一个基金持仓追踪工具，部署为移动端 H5 页面（通过微信/浏览器访问）。
核心功能：管理多个证券账户的基金持仓，查看收益曲线、重仓股涨跌、行业分布。

参考产品：**养基宝 App**

---

## 二、全局设计规范

### 2.1 颜色系统

```
主色调（Header 渐变）:  #667eea → #764ba2
蓝色主题（详情页 Header）: #1a5ce0 → #2d7ff9
背景色:                   #f5f6fa
卡片背景:                 #ffffff
分割线:                   #f3f3f3 / #f8f8f8

盈利/上涨（红色）:        #e94560
亏损/下跌（绿色）:        #22c55e
盈利背景:                rgba(233,69,96,0.08)
亏损背景:                rgba(34,197,94,0.08)

辅助文字:                 #999999
次要文字:                 #bbbbbb
正文:                     #333333
标题:                     #1a1a2e
```

### 2.2 字体

```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif;
```

### 2.3 间距与圆角（极其重要⚠️）

```
页面两侧 padding:         14px ~ 16px（绝对不能为 0）
卡片 border-radius:        16px
卡片 box-shadow:           0 1px 8px rgba(0,0,0,0.04)
卡片内部 padding:          14px 18px
卡片之间 gap:              12px
Tab 按钮 border-radius:    18px ~ 20px
Tab 按钮之间 gap:          8px
Tab 按钮 padding:          6px 14px
```

### 2.4 Tab 栏样式（核心要求⚠️）

Tab 栏必须使用「胶囊按钮」(Pill Button) 样式，绝对禁止使用纯文字并排的方式。

```
选中态:
  background: rgba(255,255,255,0.93)
  color: #764ba2
  font-weight: 600

未选中态:
  background: rgba(255,255,255,0.15)
  color: rgba(255,255,255,0.85)
  font-weight: 400

「+ 新增」按钮:
  border: 1.5px dashed rgba(255,255,255,0.35)
  background: transparent
```

---

## 三、页面结构

### 3.1 主页面 — 账户汇总

**从上到下的布局结构：**

```
┌─────────────────────────────┐
│  Header（渐变紫色背景）       │
│  ├── 标题栏: "太一基金小助手"  │
│  ├── Tab 栏（胶囊按钮）       │
│  │   账户汇总 | 全部 | 支付宝1 | 支付宝2 | + │
│  └── 资产汇总区               │
│      左: 账户资产 96,599.76    │
│      右: 场内穿透 +538.05 >   │
├─────────────────────────────┤
│  账户卡片 — 支付宝 1          │
│  ├── 卡片头: 图标 + 名称 + ↑5 ↓1 │
│  ├── 左: 账户资产 / 持有收益    │
│  ├── 右: 收益曲线 / 当日收益    │
│  └── （展开时）基金列表         │
│      ├── 前海开源金银珠宝混合C   │
│      ├── 易方达蓝筹精选混合     │
│      └── 易方达中小盘混合       │
├─────────────────────────────┤
│  账户卡片 — 支付宝 2          │
│  ├── （同上结构）              │
│  └── 基金列表...              │
├─────────────────────────────┤
│  + 新增持有    |  批量加减仓 📋 │
├─────────────────────────────┤
│  上证指数浮窗（fixed 定位）    │
├─────────────────────────────┤
│  底部导航栏（fixed 定位）      │
│  持有 | 自选 | 行情 | 资讯 | 会员 | 我的 │
└─────────────────────────────┘
```

**Tab 切换逻辑：**
- **账户汇总**：显示所有账户卡片，卡片内不展开基金列表
- **全部**：显示所有账户卡片，卡片内展开基金列表
- **支付宝 1 / 支付宝 2**：只显示对应账户，展开基金列表

### 3.2 基金详情页

点击任意基金进入详情页。

```
┌─────────────────────────────┐
│  Header（渐变蓝色背景）       │
│  ├── ← 返回  基金名称  基金代码│
│  └── 当日涨幅 | 近1年 | 持有排名│
├─────────────────────────────┤
│  三个子 Tab                   │
│  关联板块 | 业绩走势 | 我的收益  │
│                               │
│  （业绩走势 Tab 显示详细曲线图） │
│  （我的收益 Tab 显示持有收益曲线）│
├─────────────────────────────┤
│  ▎基金重仓股                  │
│  ┌──────┬────┬────┬─────┐   │
│  │股票名称│涨幅 │持仓占比│较上期│   │
│  ├──────┼────┼────┼─────┤   │
│  │紫金矿业│+3.08│ 9.79%│0.59↑│   │
│  │601899 │    │      │     │   │
│  ├──────┼────┼────┼─────┤   │
│  │中金黄金│+9.99│ 9.09%│0.03↑│   │
│  │...    │    │      │     │   │
│  └──────┴────┴────┴─────┘   │
├─────────────────────────────┤
│  ▎行业分布                   │
│  有色金属 ████████████ 90.37% │
│  其他     ██           9.63% │
├─────────────────────────────┤
│  底部操作栏                   │
│  修改持仓 | 提醒 | 交易记录 | 删自选 | 更多 │
└─────────────────────────────┘
```

---

## 四、收益曲线规范（极其重要⚠️）

### 4.1 基本规则

```
盈利时: 红色线 #e94560 + 红色渐变填充
亏损时: 绿色线 #22c55e + 绿色渐变填充
```

这是中国股市的标准：红涨绿跌。颜色必须根据「当日收益」或「持有收益」的正负动态切换。

### 4.2 小型曲线（卡片内）

```
尺寸: width: 120px, height: 40px
线宽: strokeWidth: 1.5
底部渐变: 从线颜色 opacity 0.15 到 opacity 0.01
数据源: 账户级别的历史净值数据（30个点）
```

### 4.3 详情页曲线

```
宽度: 100%（响应式）
高度: 160px
线宽: strokeWidth: 2
带网格线: 水平参考线 4 条，颜色 #eeeeee
带百分比标注: 右侧显示涨跌幅
基准线: 虚线，表示起始净值位置
末端: 实心圆点标记当前值
```

### 4.4 曲线数据要求

曲线必须基于真实的基金净值/收益数据绘制，不是随机线条。
数据结构为一个数组，每个元素代表一个时间点的净值。

---

## 五、数据结构

### 5.1 账户 (Account)

```typescript
interface Account {
  id: string;              // "zhifubao1"
  name: string;            // "支付宝 1"
  icon: string;            // "支"
  iconBg: [string, string]; // 渐变色 ["#1677ff", "#4096ff"]
  assets: number;          // 账户总资产
  holdProfit: number;      // 持有总收益
  holdProfitPct: number;   // 持有收益率 %
  dayProfit: number;       // 当日总收益
  dayProfitPct: number;    // 当日收益率 %
  upCount: number;         // 上涨基金数量
  downCount: number;       // 下跌基金数量
  curveData: number[];     // 收益曲线数据（30个点）
  funds: Fund[];           // 该账户下的基金列表
}
```

### 5.2 基金 (Fund)

```typescript
interface Fund {
  id: string;              // 基金代码
  name: string;            // 基金名称
  code: string;            // 基金代码
  assets: number;          // 持有资产
  holdProfit: number;      // 持有收益
  holdProfitPct: number;   // 持有收益率 %
  dayProfit: number;       // 当日收益
  dayProfitPct: number;    // 当日涨幅 %
  yearReturn: number;      // 近1年收益率 %
  holdRank: string;        // 持有人数排名 "7/25556"
  curveData: number[];     // 净值曲线数据
  sector: string;          // 关联板块名称
  sectorChange: number;    // 板块涨幅 %
  sameTypeFunds: number;   // 同类基金数量
  holdings: Holding[];     // 重仓股列表
  industries: Industry[];  // 行业分布
}
```

### 5.3 重仓股 (Holding)

```typescript
interface Holding {
  name: string;            // 股票名称
  code: string;            // 股票代码
  change: number;          // 当日涨幅 %
  weight: number;          // 持仓占比 %
  weightChange: number;    // 较上期变化 %（正数增仓，负数减仓）
  up: boolean;             // 较上期是增还是减
}
```

### 5.4 行业分布 (Industry)

```typescript
interface Industry {
  name: string;            // 行业名称
  pct: number;             // 占比 %
}
```

---

## 六、组件清单

### 6.1 需要实现的组件

| 组件 | 说明 |
|------|------|
| `ProfitCurve` | 小型 SVG 收益曲线，红涨绿跌，带面积渐变 |
| `DetailChart` | 详情页大曲线，带网格线、百分比标注、基准虚线 |
| `Badge` | 涨跌数量标签，如 ↑5 ↓1 |
| `ProfitText` | 收益金额+百分比显示，自动红绿配色 |
| `AccountCard` | 账户卡片，含资产信息、曲线、展开的基金列表 |
| `FundItem` | 基金列表项，显示当日和持有收益，可点击 |
| `FundDetailView` | 基金详情页，含 Header、子 Tab、重仓股表、行业分布 |
| `HoldingsTable` | 重仓股 Grid 表格 |
| `IndustryBar` | 行业分布水平条形图 |
| `BottomNav` | 固定底部导航栏 |
| `IndexBar` | 上证指数浮窗条 |

### 6.2 组件样式要点

**ProfitCurve（小曲线）：**
```css
/* SVG polyline */
stroke-width: 1.5;
stroke-linecap: round;
stroke-linejoin: round;
/* 底部面积填充用 linearGradient，opacity 从 0.15 到 0.01 */
```

**AccountCard：**
```css
background: #ffffff;
border-radius: 16px;
box-shadow: 0 1px 8px rgba(0,0,0,0.04);
overflow: hidden;
/* 内部 padding: 14px 18px */
```

**Badge（涨跌标签）：**
```css
/* 上涨 */
color: #e94560;
background: rgba(233,69,96,0.08);
padding: 2px 8px;
border-radius: 6px;
font-size: 12px;
font-weight: 600;

/* 下跌 */
color: #22c55e;
background: rgba(34,197,94,0.08);
```

**HoldingsTable（重仓股表格）：**
```css
display: grid;
grid-template-columns: 1.3fr 0.8fr 0.8fr 0.9fr;
/* 表头 */
font-size: 11px;
color: #999;
border-bottom: 1px solid #f0f0f0;
/* 行间距 */
padding: 12px 0;
```

**IndustryBar（行业分布）：**
```css
/* 进度条容器 */
height: 18px;
background: #f0f4ff;
border-radius: 4px;

/* 填充条 */
background: linear-gradient(90deg, #1a5ce0, #4096ff); /* 第一行 */
background: #90b8f8; /* 其余行 */
border-radius: 4px;
transition: width 0.5s ease;
```

---

## 七、交互规范

### 7.1 页面切换
- Tab 切换无需页面跳转，组件内 state 切换
- 点击基金进入详情页，使用组件级路由（state 控制）或 React Router

### 7.2 数字格式化
- 资产金额：千分位格式，保留2位小数，如 `96,599.76`
- 收益金额：带正负号，保留2位小数，如 `+685.09` 或 `-147.04`
- 百分比：带正负号，保留2位小数，如 `+4.48%` 或 `-1.02%`

### 7.3 颜色动态规则
```
if (value >= 0) → 红色 #e94560
if (value < 0)  → 绿色 #22c55e
```
应用于：收益金额、百分比文字、曲线颜色、Badge 标签

---

## 八、注意事项（给 Claude Code 的特别提醒）

1. **绝对不要把 Tab 做成纯文字并排**，必须是胶囊按钮样式，每个 Tab 之间有 8px 间距
2. **页面两侧必须有 padding**（14-16px），不能贴边显示
3. **每个账户必须是独立的白色圆角卡片**，不能用分割线代替
4. **收益曲线的颜色必须根据盈亏动态变化**：赚钱红线，亏钱绿线
5. **数字千分位格式化**：使用 `toLocaleString` 或类似方法
6. **移动端适配**：max-width: 430px，居中显示
7. **fixed 定位的底部栏**：底部导航 + 上证指数浮窗都是 fixed 定位
8. **详情页的重仓股表格**：使用 CSS Grid，不要用 HTML table
9. **fund-tracker-pro.jsx 是完整的设计参考代码**，UI 样式以此文件为准，只需要把 Mock 数据替换为真实数据接口

---

## 九、推荐技术栈

```
框架: React 18+
样式: CSS-in-JS (inline styles) 或 Tailwind CSS
图表: 原生 SVG（参考 fund-tracker-pro.jsx 中的实现）
路由: React Router 或组件内 state 控制
构建: Vite
部署: GitHub Pages / Vercel / Netlify
```

---

## 十、文件清单

请确认以下文件都在项目根目录：

| 文件 | 用途 |
|------|------|
| `DESIGN-SPEC.md` | 本文件，设计规范说明 |
| `fund-tracker-pro.jsx` | 设计参考代码，包含完整 UI 实现和 Mock 数据 |
