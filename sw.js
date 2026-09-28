const CACHE='fnr-onco-v5';
const FILES=["./",
"index.html",
"manifest.webmanifest",
"app/app.css",
"app/app.js",
"app/calc.js",
"app/engine.js",
"content/fnr.js",
"content/staging.js",
"content/regimens/ccu.js",
"content/regimens/mama.js",
"content/pathways/ccu.js",
"content/pathways/mama.js",
"icons/icon-192.png",
"icons/icon-512.png",
"icons/maskable-512.png",
"fonts/figtree-latin-400-normal.woff2",
"fonts/figtree-latin-500-normal.woff2",
"fonts/figtree-latin-600-normal.woff2",
"fonts/figtree-latin-700-normal.woff2",
"fonts/ibm-plex-mono-latin-400-normal.woff2",
"fonts/ibm-plex-mono-latin-500-normal.woff2",
"fonts/lexend-latin-400-normal.woff2",
"fonts/lexend-latin-500-normal.woff2",
"fonts/lexend-latin-600-normal.woff2"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin) return;
  /* la página: primero la red (así la versión nueva aparece a la primera), la copia guardada si no hay conexión */
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));}
      return res;
    }).catch(()=>caches.match('index.html')));
    return;
  }
  /* íconos y tipografías: primero la copia guardada */
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}
    return res;
  })));
});
