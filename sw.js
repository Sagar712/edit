self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("Edit Rich Text").then(cache => {
            return cache.addAll(["./", "./EditorApp2.png","./manifest.json",
            "./style.css", "./app.js", './import-export/import-export.html', 
            './import-export/import-export.css', './import-export/import-export.js']);
        })
    );
});
  
self.addEventListener("fetch", e => {
  
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
  
});
