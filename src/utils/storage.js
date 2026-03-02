import { getCurrentUser } from './auth';

function getStorageKey() {
  const user = getCurrentUser();
  return user ? `fund_tracker_data_${user}` : 'fund_tracker_data';
}

function getData() {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return { accounts: [] };
    const data = JSON.parse(raw);
    // 兼容旧版数据格式（没有 accounts 的老数据自动迁移）
    if (data.funds && !data.accounts) {
      return { accounts: [{ id: 'default', name: '默认', funds: data.funds }] };
    }
    return data;
  } catch {
    return { accounts: [] };
  }
}

function saveData(data) {
  localStorage.setItem(getStorageKey(), JSON.stringify(data));
}

export function getAccounts() {
  return getData().accounts || [];
}

export function saveAccounts(accounts) {
  saveData({ accounts });
}

export function addAccount(name) {
  const accounts = getAccounts();
  const id = 'acc_' + Date.now();
  accounts.push({ id, name, funds: [] });
  saveAccounts(accounts);
  return id;
}

export function removeAccount(id) {
  saveAccounts(getAccounts().filter(a => a.id !== id));
}

export function getAccount(id) {
  return getAccounts().find(a => a.id === id) || null;
}

export function addFundToAccount(accountId, fund) {
  const accounts = getAccounts();
  const account = accounts.find(a => a.id === accountId);
  if (!account) return;

  const idx = account.funds.findIndex(f => f.code === fund.code);
  if (idx >= 0) {
    account.funds[idx] = { ...account.funds[idx], ...fund };
  } else {
    account.funds.push({ ...fund, addedAt: new Date().toISOString().split('T')[0] });
  }
  saveAccounts(accounts);
}

export function removeFundFromAccount(accountId, fundCode) {
  const accounts = getAccounts();
  const account = accounts.find(a => a.id === accountId);
  if (!account) return;
  account.funds = account.funds.filter(f => f.code !== fundCode);
  saveAccounts(accounts);
}

export function getFundFromAccount(accountId, fundCode) {
  const account = getAccount(accountId);
  if (!account) return null;
  return account.funds.find(f => f.code === fundCode) || null;
}

export function getAllFundCodes() {
  const codes = new Set();
  getAccounts().forEach(a => a.funds.forEach(f => codes.add(f.code)));
  return [...codes];
}
