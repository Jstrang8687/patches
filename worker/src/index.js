// Patches admin login service (Cloudflare Worker).
//
// Gives the admin page username/password logins and keeps the GitHub key on the
// server. Logged-in people can only change js/works.js and photos under images/;
// everything else in the repo is off limits.
//
// Secrets (set in the Cloudflare dashboard, never in this file):
//   GITHUB_TOKEN  fine-grained token with Contents: Read and write on the patches repo
//   SETUP_CODE    one-time code needed to create the very first login
// KV namespace binding: DB (users, sessions, login attempt counters)

const REPO = "/repos/Jstrang8687/patches";
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 20000;     // kept modest to fit Workers' CPU limits
const MAX_FAILED_LOGINS = 8;         // per IP per 15 minutes
const MIN_PASSWORD = 8;

// GitHub calls the admin page is allowed to make, by method.
const ALLOWED = [
  ["GET", /^\/git\/ref\/heads\/main$/],
  ["GET", /^\/contents\/js\/works\.js\?ref=[0-9a-f]{40}$/],
  ["GET", /^\/git\/commits\/[0-9a-f]{40}$/],
  ["POST", /^\/git\/blobs$/],
  ["POST", /^\/git\/trees$/],
  ["POST", /^\/git\/commits$/],
  ["PATCH", /^\/git\/refs\/heads\/main$/],
];
const ALLOWED_TREE_PATH = /^(js\/works\.js|images\/(photography|woodworking)\/[a-z0-9-]+\.jpg)$/;

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0] || "",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (origin && !allowed.includes(origin)) return json({ error: "Not allowed from this site." }, 403, cors);

    try {
      const res = await route(req, env);
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      return res;
    } catch (e) {
      const status = e.status || 500;
      return json({ error: status === 500 ? "Something went wrong on the login service." : e.message }, status, cors);
    }
  },
};

async function route(req, env) {
  const url = new URL(req.url);
  const p = url.pathname;
  const m = req.method;

  if (m === "GET" && p === "/status") {
    return json({ needsSetup: !(await hasUsers(env)), ready: !!env.GITHUB_TOKEN });
  }
  if (m === "POST" && p === "/setup") return setup(req, env);
  if (m === "POST" && p === "/login") return login(req, env);

  const me = await requireSession(req, env);
  if (m === "GET" && p === "/me") return json({ name: me.name });
  if (m === "POST" && p === "/logout") {
    await env.DB.delete("session:" + me.key);
    return json({ ok: true });
  }
  if (m === "POST" && p === "/password") return changePassword(req, env, me);
  if (m === "GET" && p === "/users") return json({ users: await listUsers(env) });
  if (m === "POST" && p === "/users") return addUser(req, env, me);
  if (m === "POST" && p === "/users/remove") return removeUser(req, env, me);
  if (m === "POST" && p === "/github") return githubProxy(req, env, me);
  throw httpError(404, "Not found.");
}

// ---------- Accounts ----------

const cleanName = (s) => String(s || "").trim().toLowerCase();
const validName = (s) => /^[a-z0-9][a-z0-9._-]{1,31}$/.test(s);

async function hasUsers(env) {
  return (await env.DB.list({ prefix: "user:", limit: 1 })).keys.length > 0;
}

async function listUsers(env) {
  const { keys } = await env.DB.list({ prefix: "user:" });
  const users = [];
  for (const k of keys) {
    const u = await env.DB.get(k.name, "json");
    if (u) users.push({ name: u.name, created: u.created, createdBy: u.createdBy || null });
  }
  return users.sort((a, b) => a.name.localeCompare(b.name));
}

async function setup(req, env) {
  const { setupCode, username, password } = await body(req);
  if (await hasUsers(env)) throw httpError(409, "Setup is already done. Sign in instead.");
  if (!env.SETUP_CODE) throw httpError(503, "The setup code hasn't been added in Cloudflare yet.");
  if (!(await safeEqual(String(setupCode || ""), env.SETUP_CODE))) {
    await countFailure(req, env);
    throw httpError(403, "That setup code isn't right.");
  }
  const name = cleanName(username);
  await createUser(env, name, password, null);
  return json(await newSession(env, name));
}

async function login(req, env) {
  await checkRateLimit(req, env);
  const { username, password } = await body(req);
  const name = cleanName(username);
  const u = validName(name) ? await env.DB.get("user:" + name, "json") : null;
  const ok = u && (await safeEqual(await hashPassword(String(password || ""), u.salt, u.iterations), u.hash));
  if (!ok) {
    await countFailure(req, env);
    throw httpError(401, "Wrong username or password.");
  }
  return json(await newSession(env, name));
}

async function changePassword(req, env, me) {
  const { current, password } = await body(req);
  const u = await env.DB.get("user:" + me.name, "json");
  if (!u || !(await safeEqual(await hashPassword(String(current || ""), u.salt, u.iterations), u.hash))) {
    throw httpError(403, "Your current password isn't right.");
  }
  await createUser(env, me.name, password, u.createdBy, u.created);
  return json({ ok: true });
}

async function addUser(req, env, me) {
  const { username, password } = await body(req);
  const name = cleanName(username);
  if (await env.DB.get("user:" + name)) throw httpError(409, "That username is already taken.");
  await createUser(env, name, password, me.name);
  return json({ ok: true, users: await listUsers(env) });
}

async function removeUser(req, env, me) {
  const name = cleanName((await body(req)).username);
  if (name === me.name) throw httpError(400, "You can't remove yourself.");
  if (!(await env.DB.get("user:" + name))) throw httpError(404, "No one with that username.");
  await env.DB.delete("user:" + name);
  // End that person's sessions.
  const { keys } = await env.DB.list({ prefix: "session:" });
  for (const k of keys) {
    const s = await env.DB.get(k.name, "json");
    if (s && s.name === name) await env.DB.delete(k.name);
  }
  return json({ ok: true, users: await listUsers(env) });
}

async function createUser(env, name, password, createdBy, created) {
  if (!validName(name)) throw httpError(400, "Usernames are 2 to 32 letters or numbers (dots, dashes and underscores are OK too).");
  if (String(password || "").length < MIN_PASSWORD) throw httpError(400, `Passwords need at least ${MIN_PASSWORD} characters.`);
  const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
  const hash = await hashPassword(String(password), salt, PBKDF2_ITERATIONS);
  await env.DB.put("user:" + name, JSON.stringify({
    name, salt, hash, iterations: PBKDF2_ITERATIONS, createdBy, created: created || new Date().toISOString(),
  }));
}

// ---------- Sessions ----------

async function newSession(env, name) {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const key = await sha256(token);
  await env.DB.put("session:" + key, JSON.stringify({ name }), { expirationTtl: SESSION_DAYS * 86400 });
  return { token, name };
}

async function requireSession(req, env) {
  const m = (req.headers.get("Authorization") || "").match(/^Bearer (.+)$/);
  if (!m) throw httpError(401, "Please sign in.");
  const key = await sha256(m[1]);
  const s = await env.DB.get("session:" + key, "json");
  if (!s || !(await env.DB.get("user:" + s.name))) throw httpError(401, "Your sign-in has expired. Please sign in again.");
  return { name: s.name, key };
}

// ---------- Brute-force protection ----------

const ipKey = (req) => "fail:" + (req.headers.get("CF-Connecting-IP") || "local");
async function checkRateLimit(req, env) {
  const n = Number(await env.DB.get(ipKey(req))) || 0;
  if (n >= MAX_FAILED_LOGINS) throw httpError(429, "Too many wrong tries. Wait 15 minutes and try again.");
}
async function countFailure(req, env) {
  const n = (Number(await env.DB.get(ipKey(req))) || 0) + 1;
  await env.DB.put(ipKey(req), String(n), { expirationTtl: 900 });
}

// ---------- GitHub proxy ----------

async function githubProxy(req, env, me) {
  if (!env.GITHUB_TOKEN) throw httpError(503, "The GitHub key hasn't been added in Cloudflare yet.");
  const { method, path, body: payload } = await body(req);
  const rel = String(path || "").startsWith(REPO) ? String(path).slice(REPO.length) : null;
  if (rel === null || !ALLOWED.some(([mm, re]) => mm === method && re.test(rel))) {
    throw httpError(403, "That change isn't allowed from the admin page.");
  }
  let out = payload;
  if (rel === "/git/trees") {
    const entries = (payload && payload.tree) || [];
    if (!entries.length || entries.some((t) => !ALLOWED_TREE_PATH.test(String(t.path)))) {
      throw httpError(403, "The admin page can only change photos and the artwork list.");
    }
  }
  if (rel === "/git/commits") {
    const msg = String((payload && payload.message) || "Update from admin").slice(0, 2000);
    out = { ...payload, message: `${msg}\n\nPublished by ${me.name} from the Patches admin page` };
  }
  const res = await fetch((env.GITHUB_API || "https://api.github.com") + REPO + rel, {
    method,
    headers: {
      Authorization: "Bearer " + env.GITHUB_TOKEN,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "patches-admin-worker",
      ...(out ? { "Content-Type": "application/json" } : {}),
    },
    body: out ? JSON.stringify(out) : undefined,
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}

// ---------- Helpers ----------

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...headers } });
}
function httpError(status, message) {
  const e = new Error(message); e.status = status; return e;
}
async function body(req) {
  try { return await req.json(); } catch { throw httpError(400, "Bad request."); }
}
function b64(bytes) { let s = ""; bytes.forEach((b) => (s += String.fromCharCode(b))); return btoa(s); }
const b64url = (bytes) => b64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function sha256(text) {
  return b64(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))));
}
async function hashPassword(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: Uint8Array.from(atob(salt), (c) => c.charCodeAt(0)), iterations }, key, 256);
  return b64(new Uint8Array(bits));
}
// Compares by hashing both sides, so timing doesn't reveal how much matched.
async function safeEqual(a, b) {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.min(x.length, y.length); i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}
