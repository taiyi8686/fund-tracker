// JSONP call to 天天基金 realtime estimate API
export function fetchFundEstimate(code) {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonpgz_${code}_${Date.now()}`;
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('请求超时'));
    }, 10000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = (data) => {
      cleanup();
      if (data) {
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

    script.src = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}&callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('网络请求失败'));
    };
    document.head.appendChild(script);
  });
}

// Fetch estimates for multiple funds
export async function fetchMultipleFundEstimates(codes) {
  const results = {};
  const promises = codes.map(async (code) => {
    try {
      results[code] = await fetchFundEstimate(code);
    } catch {
      results[code] = null;
    }
  });
  await Promise.all(promises);
  return results;
}

// Validate fund code format
export function isValidFundCode(code) {
  return /^\d{6}$/.test(code);
}
