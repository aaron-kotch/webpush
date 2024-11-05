if (!self.define) {
  let e,
    n = {};
  const i = (i, o) => (
    (i = new URL(i + ".js", o).href),
    n[i] ||
      new Promise((n) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = n), document.head.appendChild(e);
        } else (e = i), importScripts(i), n();
      }).then(() => {
        let e = n[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (o, r) => {
    const s =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (n[s]) return;
    let c = {};
    const t = (e) => i(e, s),
      f = { module: { uri: s }, exports: c, require: t };
    n[s] = Promise.all(o.map((e) => f[e] || t(e))).then((e) => (r(...e), c));
  };
}
define(["./workbox-e3490c72"], function (e) {
  "use strict";
  self.addEventListener("message", (e) => {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
  }),
    e.precacheAndRoute(
      [
        {
          url: "android-chrome-192x192.png",
          revision: "7ae9f98e7a1494f8a40f587bb685d52f",
        },
        {
          url: "android-chrome-512x512.png",
          revision: "c5be079688a3bdce138b1012ffeec339",
        },
        {
          url: "apple-touch-icon.png",
          revision: "ab47fcf8707e4c6e7a480159569bd3a2",
        },
        {
          url: "maskable_icon.png",
          revision: "c5be079688a3bdce138b1012ffeec339",
        },
        {
          url: "manifest.webmanifest",
          revision: "40aa7ab5e60a241b73f0f11c2ce4524f",
        },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))
    );
});
