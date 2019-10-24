/*
 * Code comes from
 * https://developers.google.com/web/fundamentals/primers/service-workers/
 * License: "Except as otherwise noted, the content of this page is 
 * licensed under the Creative Commons Attribution 3.0 License, 
 * and code samples are licensed under the Apache 2.0 License. 
 * For details, see our Site Policies." 
 * https://developers.google.com/terms/site-policies
 * Uppdaterades senast februari 12, 2019.
 * 
 * only minor modifications by Peter Lembke
 */
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('infohub').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.php',
                '/manifest.json',
                '/infohub.png',
                '/infohub-512.png',
                '/serviceworker.js'
            ]);
        })
    );
});

self.addEventListener('activate', function (event) {

    var cacheWhitelist = ['infohub'];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event)
{
    event.respondWith(caches.match(event.request).then(function (response) {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        }

        return fetch(event.request).then(function (response)
        {
            if (event.request.method === 'POST') {
                return response;
            }

            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one

            let responseClone = response.clone();

            caches.open('infohub').then(function (cache) {
                cache.put(event.request, responseClone);
            });

            return response;

        }).catch(function () {
            // return caches.match('/index.php');
        });
    }));
});//# sourceURL=serviceworker.js
