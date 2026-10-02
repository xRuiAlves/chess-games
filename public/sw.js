// The old Gatsby site registered a service worker at this path. This one
// replaces it, clears its caches and removes itself so visitors get the new site.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
            await self.registration.unregister();
            const clients = await self.clients.matchAll({ type: "window" });
            clients.forEach((client) => client.navigate(client.url));
        })(),
    );
});
