/* World Cup 2026 Sweepstake — service worker.
   Makes the site usable offline (e.g. at the family gathering with patchy
   wifi). Core files are precached on install; flag images and Google fonts
   are cached the first time they're fetched, then served cache-first. */
var VERSION = "wc26-v3";
var CORE = [
  "./",
  "./index.html",
  "./print.html",
  "./teams.js",
  "./fixtures.js",
  "./live.js",
  "./icon.svg",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      // Don't let one missing/304 asset abort the whole install.
      return Promise.allSettled(CORE.map(function (u) { return c.add(u); }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; })
                            .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isLiveData = /(^|\.)raw\.githubusercontent\.com$/.test(url.hostname);
  var cacheable = sameOrigin || isLiveData ||
    /(^|\.)flagcdn\.com$/.test(url.hostname) ||
    /(^|\.)gstatic\.com$/.test(url.hostname) ||
    /fonts\.googleapis\.com$/.test(url.hostname);

  if (!cacheable) return;

  // Network-first for our own files AND the live results feed (so scores stay
  // fresh, with a cached fallback offline); cache-first for static cross-origin
  // assets like flags and fonts.
  if (sameOrigin || isLiveData) {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req); })
    );
  } else {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
          return res;
        });
      })
    );
  }
});
