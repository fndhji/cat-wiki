const memory = globalThis.__CAT_WIKI_MEMORY__ || new Map();
globalThis.__CAT_WIKI_MEMORY__ = memory;

function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  return { url: url.replace(/\/$/, ''), token };
}

function memoryAllowed() {
  return process.env.NODE_ENV !== 'production';
}

function now() { return Date.now(); }

function cleanupMemoryKey(key) {
  const item = memory.get(key);
  if (item && item.expiresAt && item.expiresAt <= now()) {
    memory.delete(key);
    return null;
  }
  return item || null;
}

async function redis(command, ...args) {
  const { url, token } = config();
  if (!url || !token) {
    if (!memoryAllowed()) throw new Error('Persistent Redis storage is not configured.');
    return memoryRedis(command, ...args);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'cat-wiki-bio/1.0',
    },
    body: JSON.stringify([command, ...args]),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Redis HTTP ${response.status}`);
  }
  return payload.result;
}

async function memoryRedis(command, ...args) {
  const cmd = String(command).toUpperCase();
  if (cmd === 'GET') return cleanupMemoryKey(String(args[0]))?.value ?? null;
  if (cmd === 'GETDEL') {
    const key = String(args[0]);
    const value = cleanupMemoryKey(key)?.value ?? null;
    memory.delete(key);
    return value;
  }
  if (cmd === 'DEL') {
    let count = 0;
    for (const key of args) count += memory.delete(String(key)) ? 1 : 0;
    return count;
  }
  if (cmd === 'SET') {
    const key = String(args[0]);
    const value = String(args[1]);
    let expiresAt = null;
    let nx = false;
    for (let i = 2; i < args.length; i += 1) {
      const token = String(args[i]).toUpperCase();
      if (token === 'EX') {
        expiresAt = now() + Number(args[i + 1]) * 1000;
        i += 1;
      } else if (token === 'NX') nx = true;
    }
    if (nx && cleanupMemoryKey(key)) return null;
    memory.set(key, { value, expiresAt });
    return 'OK';
  }
  if (cmd === 'INCR') {
    const key = String(args[0]);
    const current = Number(cleanupMemoryKey(key)?.value || 0) + 1;
    memory.set(key, { value: String(current), expiresAt: null });
    return current;
  }
  if (cmd === 'INCRBY') {
    const key = String(args[0]);
    const current = Number(cleanupMemoryKey(key)?.value || 0) + Number(args[1] || 0);
    memory.set(key, { value: String(current), expiresAt: null });
    return current;
  }
  if (cmd === 'SADD') {
    const key = String(args[0]);
    const old = cleanupMemoryKey(key)?.value;
    const set = new Set(old ? JSON.parse(old) : []);
    const before = set.size;
    for (const item of args.slice(1)) set.add(String(item));
    memory.set(key, { value: JSON.stringify([...set]), expiresAt: null });
    return set.size - before;
  }
  if (cmd === 'SREM') {
    const key = String(args[0]);
    const old = cleanupMemoryKey(key)?.value;
    const set = new Set(old ? JSON.parse(old) : []);
    let removed = 0;
    for (const item of args.slice(1)) removed += set.delete(String(item)) ? 1 : 0;
    memory.set(key, { value: JSON.stringify([...set]), expiresAt: null });
    return removed;
  }
  if (cmd === 'SMEMBERS') {
    const old = cleanupMemoryKey(String(args[0]))?.value;
    return old ? JSON.parse(old) : [];
  }
  throw new Error(`Local memory Redis does not implement ${cmd}`);
}

async function getJson(key) {
  const raw = await redis('GET', key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function setJson(key, value, exSeconds = null, nx = false) {
  const args = [key, JSON.stringify(value)];
  if (exSeconds) args.push('EX', exSeconds);
  if (nx) args.push('NX');
  return redis('SET', ...args);
}

module.exports = { redis, getJson, setJson };
