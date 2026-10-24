import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
function offlineShell(): Plugin {
  return {
    name: "offline-app-shell",
    apply: "build",
    generateBundle(_options, bundle) {
      const files = [
        "index.html",
        "favicon.svg",
        ...Object.keys(bundle).filter((name) => /\.(js|css)$/.test(name)),
      ];
      const revision = createHash("sha256")
        .update(Object.keys(bundle).join("-"))
        .update(readFileSync("index.html"))
        .update(readFileSync("public/favicon.svg"))
        .digest("hex")
        .slice(0, 16);
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: `
const CACHE = 'transition-explorer-' + ${JSON.stringify(revision)} + '-' + self.registration.scope;
const FILES = ${JSON.stringify(files)};
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(file => new URL(file, self.registration.scope).href))).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('transition-explorer-') && key.endsWith(self.registration.scope) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(new URL('index.html', self.registration.scope).href, { ignoreVary: true })));
  } else if (FILES.some(file => new URL(file, self.registration.scope).href === url.href)) {
    event.respondWith(caches.match(event.request, { ignoreVary: true }).then(cached => cached || fetch(event.request)));
  }
});`,
      });
    },
  };
}
export default defineConfig({
  plugins: [react(), tailwindcss(), offlineShell()],
  base: "./",
});
