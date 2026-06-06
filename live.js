/* =====================================================================
   World Cup 2026 — Family Sweepstake : LIVE DATA
   Loaded after teams.js + fixtures.js. Exposes window.LIVE.

   Pulls the real 2026 schedule + results from the community-maintained
   openfootball dataset on GitHub (free, no key, CORS-enabled). As games
   kick off and finish, that file is updated — so the app's "next game",
   scores and knock-outs all keep themselves current.

   • Fixtures/results : SOURCE below (editable).
   • Team names are aliased to ours where spellings differ.
   • Eliminations are derived automatically: losers of finished knock-out
     ties, plus — once the Round of 32 is drawn — any team that didn't make
     the bracket. No manual upkeep needed; Manager mode still works as an
     override and as the offline fallback.
   • Everything is cached to localStorage, so the last good data shows
     instantly on load and still works offline. If the fetch ever fails the
     app falls back to the built-in schedule in fixtures.js.
   ===================================================================== */
(function (root) {
  "use strict";
  var WC = root.WC;
  if (!WC) { console.error("live.js needs teams.js first"); return; }

  var SOURCE = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
  var ALIAS = { "Czech Republic": "Czechia", "Turkey": "Türkiye", "Côte d'Ivoire": "Ivory Coast" };
  var CACHE_KEY = "wc26-live";

  var LIVE = {
    fixtures: [], out: new Set(), updatedAt: null, ok: false, error: null, fetching: false
  };

  function parseWhen(date, time) {
    var Y = +date.slice(0, 4), Mo = +date.slice(5, 7) - 1, D = +date.slice(8, 10);
    var m = /(\d{1,2}):(\d{2})/.exec(time || ""), off = /UTC([+-]\d{1,2})/.exec(time || "");
    if (!m) return new Date(Date.UTC(Y, Mo, D, 12, 0));
    return new Date(Date.UTC(Y, Mo, D, (+m[1]) - (off ? +off[1] : 0), +m[2]));
  }
  function hhmm(d) { return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }); }

  function normalize(json) {
    var ms = (json && json.matches) || [];
    return ms.map(function (m, i) {
      var a = ALIAS[m.team1] || m.team1, b = ALIAS[m.team2] || m.team2;
      var aReal = !!WC.byName[a], bReal = !!WC.byName[b];
      var when = parseWhen(m.date, m.time);
      var s = m.score || null;
      var score = (s && (s.ft || s.et || s.p)) ? { ft: s.ft || null, et: s.et || null, p: s.p || null } : null;
      return {
        id: "m" + i,
        group: m.group ? m.group.replace("Group ", "") : null,
        stage: m.group ? m.group : (m.round || "Knockout"),
        date: m.date, time: hhmm(when), when: when, ground: m.ground || "",
        a: a, b: b, aReal: aReal, bReal: bReal, playable: aReal && bReal,
        score: score, finished: !!score
      };
    }).sort(function (x, y) { return x.when - y.when; });
  }

  function winner(fx) {
    if (!fx.score) return null;
    var arr = fx.score.p || fx.score.et || fx.score.ft;
    if (!arr) return null;
    return arr[0] > arr[1] ? "a" : arr[1] > arr[0] ? "b" : null;
  }
  function scoreText(fx) {
    if (!fx || !fx.score || !fx.score.ft) return "";
    var t = fx.score.ft[0] + "–" + fx.score.ft[1];
    if (fx.score.p) t += " (" + fx.score.p[0] + "–" + fx.score.p[1] + " pens)";
    else if (fx.score.et) t += " (a.e.t.)";
    return t;
  }

  // Auto-derive who's knocked out from the live bracket.
  function deriveOut(fixtures) {
    var out = new Set();
    var kos = fixtures.filter(function (f) { return !f.group; });   // knock-out ties
    kos.forEach(function (f) {
      if (f.finished && f.playable) { var w = winner(f); if (w === "a") out.add(f.b); else if (w === "b") out.add(f.a); }
    });
    // Once the Round of 32 is drawn, anyone not in the bracket didn't qualify.
    if (kos.some(function (f) { return f.playable; })) {
      var inKo = new Set();
      kos.forEach(function (f) { if (f.aReal) inKo.add(f.a); if (f.bReal) inKo.add(f.b); });
      WC.TEAMS.forEach(function (t) { if (!inKo.has(t.n)) out.add(t.n); });
    }
    return out;
  }

  function persist() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        updatedAt: LIVE.updatedAt,
        out: [].slice.call(LIVE.out),
        fixtures: LIVE.fixtures.map(function (f) { var c = Object.assign({}, f); c.when = f.when.toISOString(); return c; })
      }));
    } catch (e) {}
  }
  function hydrate() {
    try {
      var r = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (r && r.fixtures && r.fixtures.length) {
        LIVE.fixtures = r.fixtures.map(function (f) { f.when = new Date(f.when); return f; });
        LIVE.out = new Set(r.out || []);
        LIVE.updatedAt = r.updatedAt; LIVE.ok = true;
        return true;
      }
    } catch (e) {}
    return false;
  }

  function fetchLive() {
    if (LIVE.fetching) return Promise.resolve(false);
    LIVE.fetching = true;
    return fetch(SOURCE, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) {
        var fx = normalize(j);
        if (!fx.length) throw new Error("no matches");
        LIVE.fixtures = fx; LIVE.out = deriveOut(fx);
        LIVE.updatedAt = Date.now(); LIVE.ok = true; LIVE.error = null;
        persist(); return true;
      })
      .catch(function (e) { LIVE.error = e.message; return false; })
      .then(function (changed) { LIVE.fetching = false; return changed; });
  }

  // Load cache instantly, then refresh from the network; cb fires after each.
  function init(cb) {
    var had = hydrate();
    if (had && cb) cb();
    return fetchLive().then(function () { if (cb) cb(); });
  }
  function refresh(cb) { return fetchLive().then(function (changed) { if (cb) cb(); return changed; }); }

  LIVE.init = init; LIVE.refresh = refresh; LIVE.winner = winner; LIVE.scoreText = scoreText; LIVE.SOURCE = SOURCE;
  root.LIVE = LIVE;
})(typeof window !== "undefined" ? window : this);
