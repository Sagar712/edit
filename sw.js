/*
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("Edit Rich Text").then(cache => {
            return cache.addAll(["./", "./main.js", "./style.css", "./EditorApp2.png","./manifest.json",
            "./ShowContent/show.html", "./ShowContent/show.css", 
            "./ShowContent/show.js"]);
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
*/