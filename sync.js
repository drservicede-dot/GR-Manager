(() => {
  "use strict";

  // ===================== CONFIG =====================
  const SYNC_URL =
    "https://script.google.com/macros/s/AKfycbxMVF79p2qt0S2vODcrgo5ypoPH11cTu1ZM5rqAN8G_H29fr3CwmpH-0mp7iHkHSDt6Vg/exec";
  const SYNC_SECRET =
    "DRS-2025-SECRET-9f3a7c1b-8c2e-4a19-bc11-0d9c8f5a2e77";

  const TIMEOUT_PULL_MS = 8000;
  const TIMEOUT_PUSH_MS = 10000;
  const PUSH_DEBOUNCE_MS = 1200;

  // ===================== UI STATUS =====================
  function pill() { return document.getElementById("syncStatus"); }

  function setStatus(state, msg) {
    const el = pill();
    if (!el) return;

    el.className = "sync-pill " + state;

    const t = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (state === "offline") el.textContent = `OFFLINE • ${t}`;
    else if (state === "syncing") el.textContent = `SYNCING… • ${t}`;
    else if (state === "ok") el.textContent = `SYNC OK • ${t}`;
    else el.textContent = `SYNC ERROR • ${msg || ""} • ${t}`;
  }

  // ===================== UTILS =====================
  function abortableFetch(url, options, timeoutMs) {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeoutMs);
    return fetch(url, { ...options, signal: ctrl.signal })
      .finally(() => clearTimeout(id));
  }

  // CRITICAL FIX:
  // Usuń null/undefined i elementy, które nie są obiektem
  function normalizeArray(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(x => x && typeof x === "object");
  }

  function ensureMeta(arr) {
    const now = Date.now();
    return normalizeArray(arr).map(x => {
      if (!x.createdAt) x.createdAt = now;
      if (!x.updatedAt) x.updatedAt = now;
      return x;
    });
  }

  function toId(x) {
    return x && x.id != null ? String(x.id) : "";
  }

  function toUpdated(x) {
    const v = Number(x && x.updatedAt ? x.updatedAt : 0);
    return Number.isFinite(v) ? v : 0;
  }

  function mergeById(localArr, remoteArr) {
    const map = new Map();

    normalizeArray(localArr).forEach(it => {
      const id = toId(it);
      if (id) map.set(id, it);
    });

    normalizeArray(remoteArr).forEach(it => {
      const id = toId(it);
      if (!id) return;
      const prev = map.get(id);
      if (!prev || toUpdated(it) >= toUpdated(prev)) map.set(id, it);
    });

    return Array.from(map.values());
  }

  // Normalizacja całego DB (żeby UI nigdy nie dostało "pustych" elementów)
  function normalizeDB(db) {
    const safe = db && typeof db === "object" ? db : {};
    return {
      clients: ensureMeta(safe.clients || []),
      objects: ensureMeta(safe.objects || []),
      offers:  ensureMeta(safe.offers  || []),
      settings: (safe.settings && typeof safe.settings === "object") ? safe.settings : {},
    };
  }

  function mergeDB(localDB, remoteDB) {
    const L = normalizeDB(localDB);
    const R = normalizeDB(remoteDB);

    const merged = {
      clients: mergeById(L.clients, R.clients),
      objects: mergeById(L.objects, R.objects),
      offers:  mergeById(L.offers,  R.offers),
      settings: Object.assign({}, L.settings || {}, R.settings || {}),
    };

    return normalizeDB(merged);
  }

  // ===================== API =====================
  async function apiPull() {
    const url = `${SYNC_URL}?action=pull&secret=${encodeURIComponent(SYNC_SECRET)}`;
    const res = await abortableFetch(url, { method: "GET" }, TIMEOUT_PULL_MS);
    const json = await res.json().catch(() => null);
    if (!res.ok || !json || !json.ok) throw new Error("pull failed");
    return json.data;
  }

  async function apiUpsert(db) {
    const clean = normalizeDB(db);

    const url = `${SYNC_URL}?action=upsert&secret=${encodeURIComponent(SYNC_SECRET)}`;
    const res = await abortableFetch(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // bez preflight
        body: JSON.stringify({ data: clean }),
      },
      TIMEOUT_PUSH_MS
    );

    const json = await res.json().catch(() => null);
    if (!res.ok || !json || !json.ok) throw new Error("upsert failed");
    return json.result;
  }

  // ===================== CORE SYNC =====================
  async function pullMergeSave() {
    const remote = await apiPull();

    const localRaw = (typeof window.loadDB === "function") ? window.loadDB() : {};
    const merged = mergeDB(localRaw, remote);

    // zapisujemy już tylko czyste dane
    if (typeof window.saveDB === "function") window.saveDB(merged);
    if (typeof window.renderAll === "function") window.renderAll();

    return merged;
  }

  async function syncNow() {
    if (!navigator.onLine) {
      setStatus("offline");
      if (typeof window.__appReady === "function") window.__appReady();
      return { ok: false, reason: "offline" };
    }

    if (typeof window.loadDB !== "function" || typeof window.saveDB !== "function") {
      setStatus("error", "loadDB/saveDB missing");
      if (typeof window.__appReady === "function") window.__appReady();
      throw new Error("loadDB/saveDB missing");
    }

    setStatus("syncing");
    const merged = await pullMergeSave();
    await apiUpsert(merged);
    setStatus("ok");
    if (typeof window.__appReady === "function") window.__appReady();
    return { ok: true };
  }

  window.__syncNow = syncNow;

  // ===================== AUTO PUSH (patch saveDB) =====================
  let pushTimer = null;

  function schedulePush() {
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }

    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      try {
        setStatus("syncing");
        const local = normalizeDB(window.loadDB());
        await apiUpsert(local);
        setStatus("ok");
      } catch (e) {
        setStatus("error", (e && e.message) ? e.message : "push");
      }
    }, PUSH_DEBOUNCE_MS);
  }

  function patchSaveDB() {
    if (typeof window.saveDB !== "function") return;
    if (window.saveDB.__patchedForSync) return;

    const original = window.saveDB;
    function wrapped(db) {
      // zapisuj tylko czyste dane
      const clean = normalizeDB(db);
      const r = original(clean);
      schedulePush();
      return r;
    }

    wrapped.__patchedForSync = true;
    window.saveDB = wrapped;
  }

  // ===================== BOOT =====================
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      patchSaveDB();

      if (!navigator.onLine) {
        setStatus("offline");
        if (typeof window.__appReady === "function") window.__appReady();
        return;
      }

      await syncNow();
    } catch (e) {
      setStatus("error", (e && e.message) ? e.message : "start");
      if (typeof window.__appReady === "function") window.__appReady();
    }
  });

  window.addEventListener("online", () => {
    syncNow().catch(e => setStatus("error", (e && e.message) ? e.message : "online"));
  });

  window.addEventListener("offline", () => {
    setStatus("offline");
  });

})();
