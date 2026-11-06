/* SKYPRO uygulama önbelleği: sürüm 1.0.0 */
const SURUM="1.0.0";
const CACHE="skypro-"+SURUM;
const DOSYALAR=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","icons/favicon.ico"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(DOSYALAR.map(u=>new Request(u,{cache:"reload"}))))); if(!self.registration.active) self.skipWaiting(); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("skypro-")&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener("message",e=>{ if(e.data==="skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET"||new URL(r.url).origin!==location.origin) return;
  // Program sayfası: önce sunucu (güncel sürüm), internet yoksa önbellek
  if(r.mode==="navigate"){
    e.respondWith(caches.open(CACHE).then(async c=>{ try{ const n=await fetch(r,{cache:"no-store"}); if(n.ok) c.put("index.html",n.clone()); return n; }catch{ return (await c.match("index.html"))||(await c.match("./"))||Response.error(); } }));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
