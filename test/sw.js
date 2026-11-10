/* SKYPRO uygulama önbelleği: sürüm 1.7.4 */
const SURUM="1.7.4-önizleme";
const CACHE="skypro-test-"+SURUM;
const DOSYALAR=["./","index.html","manifest.webmanifest","icons/icon-192-v2.png","icons/icon-512-v2.png","icons/maskable-512-v2.png","icons/favicon.ico"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(DOSYALAR.map(u=>new Request(u,{cache:"reload"}))))); if(!self.registration.active) self.skipWaiting(); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("skypro-test-")&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener("message",e=>{ if(e.data==="skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET"||new URL(r.url).origin!==location.origin) return;
  // İnternet varsa her şey sunucudan (güncel sürüm, simgeler, ayarlar); yoksa önbellekten
  e.respondWith(caches.open(CACHE).then(async c=>{
    const anahtar=r.mode==="navigate"?"index.html":r;
    try{ const n=await fetch(r,{cache:"no-store"}); if(n.ok) c.put(anahtar,n.clone()); return n; }
    catch{ return (await c.match(anahtar))||(r.mode==="navigate"?await c.match("./"):null)||Response.error(); }
  }));
});
