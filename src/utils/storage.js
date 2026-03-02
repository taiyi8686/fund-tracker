import { getCurrentUser } from './auth';

function getStorageKey() {
  const user = getCurrentUser();
  return user ? `fund_tracker_data_${user}` : 'fund_tracker_data';
}

export function getFunds() {
  try {
    const data = localStorage.getItem(getStorageKey());
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.funds || [];
  } catch {
    return [];
  }
}

export function saveFunds(funds) {
  localStorage.setItem(getStorageKey(), JSON.stringify({ funds }));
}

export function addFund(fund) {
  const funds = getFunds();
  const existing = funds.findIndex(f => f.code === fund.code);
  if (existing >= 0) {
    funds[existing] = { ...funds[existing], ...fund };
  } else {
    funds.push({ ...fund, addedAt: new Date().toISOString().split('T')[0] });
  }
  saveFunds(funds);
  return funds;
}

export function removeFund(code) {
  const funds = getFunds().filter(f => f.code !== code);
  saveFunds(funds);
  return funds;
}

export function getFund(code) {
  return getFunds().find(f => f.code === code) || null;
}
