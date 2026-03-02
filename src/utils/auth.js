const AUTH_KEY = 'fund_tracker_users';
const SESSION_KEY = 'fund_tracker_session';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_fund_tracker_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || {};
  } catch {
    return {};
  }
}

export async function register(username, password) {
  username = username.trim();
  if (!username || !password) throw new Error('请输入用户名和密码');
  if (username.length < 2) throw new Error('用户名至少2个字');
  if (password.length < 4) throw new Error('密码至少4位');

  const users = getUsers();
  if (users[username]) throw new Error('该用户名已被注册');

  const hash = await hashPassword(password);
  users[username] = { hash, createdAt: new Date().toISOString() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, username);
  return username;
}

export async function login(username, password) {
  username = username.trim();
  const users = getUsers();
  if (!users[username]) throw new Error('用户名不存在');

  const hash = await hashPassword(password);
  if (users[username].hash !== hash) throw new Error('密码错误');

  localStorage.setItem(SESSION_KEY, username);
  return username;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  return localStorage.getItem(SESSION_KEY) || null;
}
