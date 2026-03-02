// 请求队列，因为天天基金 API 固定使用 jsonpgz 作为回调函数名，
// 必须串行请求，否则并发时会互相覆盖
let queue = Promise.resolve();

function fetchFundJsonp(code) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('请求超时'));
    }, 10000);

    function cleanup() {
      clearTimeout(timeout);
      delete window.jsonpgz;
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window.jsonpgz = (data) => {
      cleanup();
      if (data && data.fundcode) {
        resolve({
          code: data.fundcode,
          name: data.name,
          netValue: parseFloat(data.dwjz),       // 上一交易日净值
          estimateValue: parseFloat(data.gsz),    // 实时估算净值
          estimateGrowth: parseFloat(data.gszzl), // 估算涨跌幅 %
          valueDate: data.jzrq,                   // 净值日期
          estimateTime: data.gztime,              // 估算时间
        });
      } else {
        reject(new Error('未找到基金数据'));
      }
    };

    script.src = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('网络请求失败'));
    };
    document.head.appendChild(script);
  });
}

// 对外暴露的接口，自动排队串行执行
export function fetchFundEstimate(code) {
  const p = queue.then(() => fetchFundJsonp(code));
  // 无论成功失败，都让队列继续
  queue = p.catch(() => {});
  return p;
}

// 批量获取多只基金估值
export async function fetchMultipleFundEstimates(codes) {
  const results = {};
  for (const code of codes) {
    try {
      results[code] = await fetchFundEstimate(code);
    } catch {
      results[code] = null;
    }
  }
  return results;
}

// 验证基金代码格式
export function isValidFundCode(code) {
  return /^\d{6}$/.test(code);
}
