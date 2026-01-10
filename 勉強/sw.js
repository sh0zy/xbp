self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("focus-wave").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./style.css"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
